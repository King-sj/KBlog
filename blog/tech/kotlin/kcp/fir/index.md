# FIR插件API

目前，FIR提供了五种不同的扩展，可用于不同的目的。它们大多使用基于谓词的特殊API来访问声明，因此首先会解释这些谓词，然后解释每个扩展点。

## 注解和谓词

通常，FIR编译器仅支持使用特定的classId/callableId搜索声明。另一方面，插件通常希望执行全局查找，因为它们不知道用户代码中声明的实际名称。为了解决这个问题，FIR插件API提供了一种基于特定谓词快速查找用户代码中特定声明的方法。目前，用户代码和插件之间通信的唯一方式是在代码中使用注解标记某些内容，这样插件就会查看这个注解并发挥其作用。为此，FIR提供了谓词API。

_注意：_ 计划设计一些新的语法来代替注解从代码向插件传递信息，因为由于编译器设计原因，注解存在一些问题和限制。

FIR中有一个名为[FirPredicateBasedProvider](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirPredicateBasedProvider.kt)的特殊服务。它允许查找编译代码中匹配某个[DeclarationPredicate](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/predicate/DeclarationPredicate.kt)的所有声明。

有多种类型的谓词，每种都有DSL函数来创建它们（括号内）：
- `AnnotatedWith` 匹配所有具有传递给它的注解之一的声明 (`has(vararg annotations: FqName)`)
- `UnderAnnotatedWith` 匹配所有在类内部声明的声明，该类用传递给它的注解之一进行了注解 (`under(vararg annotations: FqName)`)
- `AnnotatedWithMeta` 和 `UnderMetaAnnotated` -- 与上面相同，但用于元注解 (`metaHas(vararg annotations: FqName)` 和 `metaUnder(vararg annotations: FqName)`)
- `And` 和 `Or` 是用于组合其他类型谓词的谓词

还有函数 `hasOrUnder` 和 `metaHasOrUnder` 作为 `has(...) or under(...)` 和 `metaHas(...) or metaUnder(...)` 的快捷方式

这些谓词接受注解类的完全限定名，这些注解必须是插件的一部分（与插件一起提供）。

_元注解_ 是用户可以用来标记自己的注解，然后使用它们来标记声明的注解。

### 示例

```kotlin
// my-super-plugin-annotations.jar
package my.super.plugin

annotation class MyAnnotation
annotation class MyMetaAnnotation

// 用户代码
package test

import my.super.plugin.*

@MyMetaAnnotation
annotation class UserAnnotation

@MyAnnotation
class A {
    fun foo() {}
}

@UserAnnotation
class B {
    fun foo() {}
}

// my-super-plugin 代码
...
val provider = session.predicateBasedProvider
val myAnn = "my.super.plugin.MyAnnotation".toFqn()
val myMeta = "my.super.plugin.MyMetaAnnotation".toFqn()

provider.getSymbolsByPredicate(has(myAnn)) // [test.A]
provider.getSymbolsByPredicate(under(myAnn)) // [test.A.foo]
provider.getSymbolsByPredicate(hasOrUnder(myAnn)) // [test.A, test.A.foo]

provider.getSymbolsByPredicate(has(myMeta)) // [test.B]
provider.getSymbolsByPredicate(under(myMeta)) // [test.B.foo]
provider.getSymbolsByPredicate(hasOrUnder(myMeta)) // [test.B, test.B.foo]
```

**重要：** 如果你想在插件中使用某些谓词，那么你需要在 `FirExtension.registerPredicates` 方法中显式声明它们。如果你不这样做，那么即使声明与谓词匹配，基于谓词的提供程序也不能保证找到带注解的声明。存在这种限制是因为基于谓词的提供程序在 `ANNOTATIONS_FOR_PLUGINS` 阶段基于所有已注册的谓词构建声明索引，这使它能够以几乎 `O(1)` 的时间查找具有特定谓词（已被索引）的声明。

另外，关于可用于插件的注解有两个限制：
1. 只有顶级注解可以在谓词中使用。存在这种限制是因为插件注解在 `SUPERTYPES` 阶段之前被解析，所以如果注解被定义为其超类型的嵌套注解，编译器将无法解析对类中注解的访问
```kotlin
open class Base {
    annotation class Ann
}

class Derived : Base() { // 超类型 Base 尚未解析
    @Ann // 在插件注解阶段无法解析
    fun foo() {}
}
```
2. 尽管插件注解在很早的阶段被解析，但它们的参数只会在 `ARGUMENTS_OF_ANNOTATIONS` 阶段被解析，所以你不能依赖在 `ARGUMENTS_OF_ANNOTATIONS` 阶段之前工作的某些扩展中所有参数都已解析的事实。

## 扩展

FIR编译器的所有扩展都是[FirExtension](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtension.kt)的继承者。它只有一个可以在自定义扩展中重写的方法（`registerPredicates`），之前已经解释过了。

为了注册FIR扩展，你需要实现并注册一个名为[FirExtensionRegistrar](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/entrypoint/src/org/jetbrains/kotlin/fir/extensions/FirExtensionRegistrar.kt?tab=source&line=24)的扩展点。它有一个要实现的方法（`configurePlugin`），在其中你需要使用特殊的DSL语法注册所有的FIR扩展：

```kotlin
class MySuperFirRegistrar : FirExtensionRegistrar() {
    override fun ExtensionRegistrarContext.configurePlugin() {
        // 在扩展构造函数的可调用引用上有一个一元加号函数
        //   用于注册特定扩展
        +::MyFirstFirExtension
        +::MySecondFirExtension
        +::MyFirCheckersExtension
    }
}
```

这个扩展点可以像所有其他现有扩展点一样在编译器中注册，使用 `-Xplugin` CLI参数或通过 `META-INF.services`。

### FirSupertypeGenerationExtension

```kotlin
abstract class FirSupertypeGenerationExtension(session: FirSession) : FirExtension(session) {
    abstract fun needTransformSupertypes(declaration: FirClassLikeDeclaration): Boolean

    abstract fun computeAdditionalSupertypes(
        classLikeDeclaration: FirClassLikeDeclaration,
        resolvedSupertypes: List<FirResolvedTypeRef>
    ): List<FirResolvedTypeRef>
}
```

[FirSupertypeGenerationExtension](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt) 是一个允许你向类和接口添加额外超类型的扩展。此扩展在 `SUPERTYPES` 阶段调用，就在某个类（`classLikeDeclaration`）的类型被解析（`resolvedSupertypes`）但尚未写入类本身时。注意你不能修改显式声明的类，只能添加新的。

例如，如果 `computeAdditionalSupertypes` 为类 `Base : A, B` 返回了某个 `[C, D]` 列表，那么类 `Base` 将有四个超类型：`Base : A, B, C, D`。

还要注意，只有当 `needTransformSupertypes` 对特定类返回 `true` 时，才会调用 `computeAdditionalSupertypes`。

### FirStatusTransformerExtension

```kotlin
abstract class FirStatusTransformerExtension(session: FirSession) : FirExtension(session) {
    abstract fun needTransformStatus(declaration: FirDeclaration): Boolean

    open fun transformStatus(
        status: FirDeclarationStatus,
        declaration: FirDeclaration
    ): FirDeclarationStatus {
        return status
    }

    ...
    // 针对不同类型声明的 `transformStatus` 重写
    ...
}
```

[FirStatusTransformerExtension](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt) 允许你转换任何非局部声明的声明状态（可见性、修饰符、修饰符）。此扩展在 `STATUS` 阶段调用，就在从重写推断实际状态之前。在 `transformStatus` 中，你可以返回新的状态，例如，改变默认修饰符。只有当 `needTransformStatus` 对特定声明返回 `true` 时，才会调用 `transformStatus`。

**示例：**
```kotlin
/*
 * transformStatus(function, status) {
 *   val newVisibility = if (status.visibility == Unknown) Public else status.visibility
 *   return status.withVisibility(newVisbility)
 * }
 */

abstract class Base {
    protected abstract fun foo()
}

@AllMembersPublic
class Derived : Base() {
    // 没有插件时 `foo` 默认是 `protected`，
    override fun foo() {}
}
/*
 * 解析前 Derived.foo 的状态：
 *   (visiblity = Unknown, modality = null, isOverride = true)
 * 没有插件的解析后状态：
 *   (visiblity = Protected, modality = Final, isOverride = true)
 *
 * 插件转换后解析前的状态：
 *   (visiblity = Public, modality = null, isOverride = true)
 * 有插件的解析后状态：
 *   (visiblity = Public, modality = Final, isOverride = true)
 */
```

**重要：** 不要改变分类器（类、对象、类型别名）的可见性。这是不支持的（也不会支持），在将来这将不被API本身允许，或者至少使用断言。

### FirDeclarationGenerationExtension

```kotlin
abstract class FirDeclarationGenerationExtension(session: FirSession) : FirExtension(session) {
    // 可以在 SUPERTYPES 阶段调用
    open fun generateClassLikeDeclaration(classId: ClassId): FirClassLikeSymbol<*>? = null

    // 可以在 STATUS 阶段调用
    open fun generateFunctions(callableId: CallableId, owner: FirClassSymbol<*>?): List<FirNamedFunctionSymbol> = emptyList()
    open fun generateProperties(callableId: CallableId, owner: FirClassSymbol<*>?): List<FirPropertySymbol> = emptyList()
    open fun generateConstructors(owner: FirClassSymbol<*>): List<FirConstructorSymbol> = emptyList()

    // 可以在 IMPORTS 阶段调用
    open fun hasPackage(packageFqName: FqName): Boolean = false

    // 可以在 SUPERTYPES 阶段之后调用
    open fun getCallableNamesForClass(classSymbol: FirClassSymbol<*>): Set<Name> = emptySet()
    open fun getNestedClassifiersNames(classSymbol: FirClassSymbol<*>): Set<Name> = emptySet()
    open fun getTopLevelCallableIds(): Set<CallableId> = emptySet()
    open fun getTopLevelClassIds(): Set<ClassId> = emptySet()
}
```

[FirDeclarationGenerationExtension](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt) 是一个用于生成新声明（类、函数、属性）的扩展。与 `SyntheticResolveExtension` 不同（它一次为特定类生成所有成员和嵌套类），`FirDeclarationGenerationExtension` 具有类似提供程序的API：编译器带着某个特定的classId或callableId来到扩展，如果需要，插件生成具有此ID的声明。

**契约和用法：**
- 只有当 `get...Names/get...Ids` 已经返回了相应的ID时，才会调用 `generate...` 函数。
- 所有函数的结果都被缓存，因此保证每个扩展中的函数带有特定参数只会被调用一次
- 扩展的不同方法可以在不同的编译器阶段首次调用（见注释），所以要小心。这意味着，例如，如果你在 `generateClassLikeDeclaration` 中观察某个类，那么这个类可能有未解析的超类型
- 你在 `generate...` 方法中返回的所有声明都应该完全解析：`status` 应该是 `FirResolvedDeclarationStatus`，所有类型引用应该是 `FirResolvedTypeRef`，`resolvePhase` 字段应该设置为 `FirResolvePhase.BODY_RESOLVE`
- 不需要为函数生成主体和属性的初始化器。它们都可以通过 `IrGenerationExtension` 在后端IR中填充
- 如果你使用 `generateClassLikeDeclaration` 生成某个类，那么你不需要填充它的 `declarations`。相反，你需要通过**同一个**生成扩展的 `generateProperties/Functions/Constructors` 方法生成成员（如果你的插件中有多个生成扩展，这是一个重要的注意事项）
- 如果你想在类中生成构造函数（来自源代码或生成的），那么你需要在此类的 `getCallableNamesForClass` 中添加 `SpecialNames.INIT`
- 如果你想在某个类中生成伴生对象（具有classId `outerClassId`），那么你需要从此类的 `generateClassLikeDeclaration` 返回 `outerClassId.Companion` 类id
- 所有生成的声明将自动转换为后端IR，因此不需要手动生成IR声明并替换整个模块中的引用。你需要做的就是填充生成声明的主体
- 对于生成的声明，你需要设置名为 `FirDeclarationOrigin.Plugin` 的特殊 `origin`。这个origin接受对象 `key: FirPluginKey`，它将保存在IR中生成声明的 `IrPluginDeclarationOrigin` 中，因此你可以使用该密钥将数据从前端传递到后端（_计划将这种机制迁移到IR声明属性，但现在它们不存在_）

### FirAdditionalCheckersExtension

```kotlin
abstract class FirAdditionalCheckersExtension(session: FirSession) : FirExtension(session) {
    open val declarationCheckers: DeclarationCheckers = DeclarationCheckers.EMPTY
    open val expressionCheckers: ExpressionCheckers = ExpressionCheckers.EMPTY
    open val typeCheckers: TypeCheckers = TypeCheckers.EMPTY
}
```

[FirAdditionalCheckersExtension](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) 用于启用一些可以报告诊断信息的额外检查器。有三种主要类型的检查器（用于声明、表达式和类型），每种类型都有针对每种特定类型的声明/表达式/typeRef的多种检查器。你需要做的就是在扩展内声明所有这些检查器。

### FirTypeAttributeExtension

_开发中_

### 其他扩展

计划实现更多扩展，允许：
- 声明新类型的契约
- 修改函数体
    - 改变返回类型和函数调用的已解析引用（以及其他可解析实体）
    - 用新表达式替换某些表达式

# IDE集成

整个FIR插件API的设计方式为插件提供了开箱即用的IDE支持，因此不需要为每个编译器插件编写单独的IDE插件。IDE集成目前正在积极开发中，显示了非常令人印象深刻的结果，但目前还没有准备好预览。

# 示例

- [plugin-sandbox](https://github.com/JetBrains/kotlin/tree/master/plugins/plugin-sandbox) 测试所有现有扩展点的沙盒插件
- [fir-parcelize](https://github.com/JetBrains/kotlin/tree/master/plugins/parcelize/parcelize-compiler/parcelize.k2/src/org/jetbrains/kotlin/parcelize/fir) Parcelize插件的FIR实现