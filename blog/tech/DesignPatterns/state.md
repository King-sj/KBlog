---
title: State 模式
date: 2024-10-28
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 管理状态
prev: ./memento
next: ./flyweight
---

## 为什么使用 State 模式

State 模式允许对象在其内部状态改变时改变其行为。它将与状态相关的行为封装在独立的类中，使得状态转换变得清晰且易于管理。使用 State 模式可以避免大量的条件语句，使代码更加简洁和可维护。

## 示例代码
@startuml
interface Context {
  setClock(hour: number): void
  changeState(state: State): void
  callSecurityCenter(msg: string): void
  recordLog(msg: string): void
}

interface State {
  doClock(context: Context, hour: number): void
  doUse(context: Context): void
  doAlarm(context: Context): void
  doPhone(context: Context): void
}

class DayState implements State{
  +getInstance(): State
  -constructor()
  +doClock(context: Context, hour: number): void
  +doUse(context: Context): void
  +doAlarm(context: Context): void
  +doPhone(context: Context): void
  +toString(): string
}

class NightState implements State{
  +getInstance(): State
  -constructor()
  +doClock(context: Context, hour: number): void
  +doUse(context: Context): void
  +doAlarm(context: Context): void
  +doPhone(context: Context): void
  +toString(): string
}

class SafeFrame implements Context{
  -state: State
  +setClock(hour: number): void
  +changeState(state: State): void
  +callSecurityCenter(msg: string): void
  +recordLog(msg: string): void
  +doUse(): void
  +doAlarm(): void
  +doPhone(): void
}
Context o-- State

@enduml

@startuml
actor User
participant SafeFrame
participant DayState
participant NightState

User -> SafeFrame: setClock(hour)
SafeFrame -> DayState: doClock(context, hour)
DayState -> SafeFrame: changeState(NightState)
SafeFrame -> NightState: doClock(context, hour)
User -> SafeFrame: doUse()
SafeFrame -> NightState: doUse(context)
User -> SafeFrame: doAlarm()
SafeFrame -> NightState: doAlarm(context)
User -> SafeFrame: doPhone()
SafeFrame -> NightState: doPhone(context)
@enduml

```ts
// context.ts
import { State } from './state';
export interface Context {
  setClock(hour: number): void;
  changeState(state: State): void;
  callSecurityCenter(msg: string): void;
  recordLog(msg: string): void;
}

// dayState.ts
import { State } from './state';
import { Context } from './context';
import { NightState } from './nightState';

export class DayState implements State {
  private static singleton: DayState = new DayState();
  private constructor() {}
  public static getInstance(): State {
    return this.singleton;
  }
  public doClock(context: Context, hour: number): void {
    if (hour < 9 || 17 <= hour) {
      context.changeState(NightState.getInstance());
    }
  }
  public doUse(context: Context): void {
    context.recordLog('金库使用(白天)');
  }
  public doAlarm(context: Context): void {
    context.callSecurityCenter('紧急铃(白天)');
  }
  public doPhone(context: Context): void {
    context.callSecurityCenter('正常通话(白天)');
  }
  public toString(): string {
    return '[白天]';
  }
}

// main.ts
import { SafeFrame } from './safeFrame';
const safeFrame: SafeFrame = new SafeFrame();
for (let hour: number = 0; hour < 24; hour++) {
  safeFrame.setClock(hour);
  safeFrame.doUse();
  safeFrame.doAlarm();
  safeFrame.doPhone();
}

// nightState.ts
import { State } from './state';
import { Context } from './context';
import { DayState } from './dayState';

export class NightState implements State {
  private static singleton: NightState = new NightState();
  private constructor() {}
  public static getInstance(): State {
    return this.singleton;
  }
  public doClock(context: Context, hour: number): void {
    if (9 <= hour && hour < 17) {
      context.changeState(DayState.getInstance());
    }
  }
  public doUse(context: Context): void {
    context.callSecurityCenter('紧急：夜间使用金库！');
  }
  public doAlarm(context: Context): void {
    context.callSecurityCenter('紧急铃(夜间)');
  }
  public doPhone(context: Context): void {
    context.recordLog('夜间通话录音');
  }
  public toString(): string {
    return '[夜间]';
  }
}

// safeFrame.ts
import { Context } from './context';
import { State } from './state';
import { DayState } from './dayState';
export class SafeFrame implements Context {
  private state: State = DayState.getInstance();
  public setClock(hour: number): void {
    let clockString: string = '現在時刻は';
    if (hour < 10) {
      clockString += `0${hour}:00`;
    } else {
      clockString += `${hour}:00`;
    }
    console.log(clockString);
    this.state.doClock(this, hour);
  }
  public changeState(state: State): void {
    console.log(`${this.state.toString()}から${state.toString()}へ状態が変化しました。`);
    this.state = state;
  }
  public callSecurityCenter(msg: string): void {
    console.log(`call! ${msg}`);
  }
  public recordLog(msg: string): void {
    console.log(`record ... ${msg}`);
  }
  public doUse(): void {
    this.state.doUse(this);
  }
  public doAlarm(): void {
    this.state.doAlarm(this);
  }
  public doPhone(): void {
    this.state.doPhone(this);
  }
}

// state.ts
import { Context } from './context';
export interface State {
  doClock(context: Context, hour: number): void;
  doUse(context: Context): void;
  doAlarm(context: Context): void;
  doPhone(context: Context): void;
}
```


## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\state\main.ts"
現在時刻は00:00
[白天]から[夜间]へ状態が変化しました。
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は01:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は02:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は03:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は04:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は05:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は06:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は07:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は08:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は09:00
[夜间]から[白天]へ状態が変化しました。
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は10:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は11:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は12:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は13:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は14:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は15:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は16:00
record ... 金库使用(白天)
call! 紧急铃(白天)
call! 正常通话(白天)
現在時刻は17:00
[白天]から[夜间]へ状態が変化しました。
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は18:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は19:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は20:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は21:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は22:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
現在時刻は23:00
call! 紧急：夜间使用金库！
call! 紧急铃(夜间)
record ... 夜间通话录音
```

## 拓展思路的要点

### 分而治之
在编程时，我们经常会使用分而治之的方针。它非常适用于大规模的复杂处理。当遇到庞大且复杂的问题、不能用一般的方法解决时，我们会先将该问题分解为多个小问题。如果还是不能解决这些小问题，我们会将它们继续划分为更小的问题，直至可以解决它们为止。

分而治之，简单而言就是将一个复杂的大问题分解为多个小问题然后逐个解决。在 State 模式中，我们用类来表示状态，并为每一种具体的状态都定义一个相应的类。这样，问题就被分解了。开发人员可以在编写一个 ConcreteState 角色的代码的同时，在头脑中（一定程度上）考虑其他的类。

在本章的警报系统的示例程序中，只有“白天”和“晚上”两个状态，可能大家对此感受不深，但是当状态非常多的时候，State 模式的优势就会非常明显了。在不使用 State 模式时，我们需要使用条件分支语句判断当前的状态，然后进行相应的处理。状态越多，条件分支就会越多，而且我们必须在所有的事件处理方法中都编写这些条件分支语句。State 模式用类表示系统的“状态”，并以此将复杂的程序分解开来。

### 依赖于状态的处理
我们来思考一下 SafeFrame 类的 setClock 方法和 State 接口的 doClock 方法之间的关系。Main 类会调用 SafeFrame 类的 setClock 方法，告诉 setClock 方法“请设置时间”。在 setClock 方法中，会像下面这样将处理委托给 State 类：`state.doClock(this, hour);`。也就是说，我们将设置时间的处理看作是“依赖于状态的处理”。当然，不只是 doClock 方法。在 State 接口中声明的所有方法都是“依赖于状态的处理”，都是“状态不同处理也不同”。这虽然看似理所当然，不过却需要我们特别注意。在 State 模式中，我们应该如何编程，以实现“依赖于状态的处理”呢？总结起来有如下两点：
- 定义接口，声明抽象方法
- 定义多个类，实现具体方法

这就是 State 模式中的“依赖于状态的处理”的实现方法。这里故意将上面两点说得很笼统，但是，如果大家在读完这两点之后会点头表示赞同，那就意味着大家完全理解了 State 模式以及接口与类之间的关系。

### 应当是谁来管理状态的迁移
用类来表示状态，将依赖于状态的处理分散在每个 ConcreteState 角色中，这是一种非常好的解决办法。不过，在使用模式时需要注意应当是谁来管理状态迁移。在示例程序中，扮演 Context 角色的 SafeFrame 类实现了实际进行状态迁移的 changeState 方法。但是，实际调用该方法的却是扮演 ConcreteState 角色的 DayState 类和 NightState 类。

也就是说，在示例程序中，我们将“状态迁移”看作是“依赖于状态的处理”。这种处理方式既有优点也有缺点。优点是这种处理方式将“什么时候从一个状态迁移到其他状态”的信息集中在了一个类中。也就是说，当我们想知道“什么时候会从 DayState 类变化为其他状态”时，只需要阅读 DayState 类的代码就可以了。缺点是“每个 ConcreteState 角色都需要知道其他 ConcreteState 角色”。

例如，DayState 类的 doClock 方法就使用了 NightState 类。这样，如果以后发生需求变更，需要删除 NightState 类时，就必须要相应地修改 DayState 类的代码。将状态迁移交给 ConcreteState 角色后，每个 ConcreteState 角色都需要或多或少地知道其他角色。也就是说，将状态迁移交给 ConcreteState 角色后，各个类之间的依赖关系就会加强。我们也可以不使用示例程序中的做法，而是将所有的状态迁移交给扮演 Context 角色的 SafeFrame 类来负责。

有时，使用这种解决方法可以提高 ConcreteState 角色的独立性，程序的整体结构也会更加清晰。不过这样做的话，Context 角色就必须要知道“所有的 ConcreteState 角色”。在这种情况下，我们可以使用 Mediator 模式（第 16 章）。当然，还可以不用 State 模式，而是用状态迁移表来设计程序。所谓状态迁移表是可以根据“输入和内部状态”得到“输出和下一个状态”的一览表（这超出了本书的范围，我们暂且不深入学习该方法）。当状态迁移遵循一定的规则时，使用状态迁移表非常有效。此外，当状态数过多时，可以用程序来生成代码而不是手写代码。

### 不会自相矛盾
如果不使用 State 模式，我们需要使用多个变量的值的集合来表示系统的状态。这时，必须十分小心，注意不要让变量的值之间互相矛盾。而在 State 模式中，是用类来表示状态的。这样，我们就只需要一个表示系统状态的变量即可。在示例程序中，SafeFrame 类的 state 字段就是这个变量，它决定了系统的状态。因此，不会存在自相矛盾的状态。

### 易于增加新的状态
在 State 模式中增加新的状态是非常简单的。以示例程序来说，编写一个 XXXState 类，让它实现 State 接口，然后实现一些所需的方法就可以了。当然，在修改状态迁移部分的代码时，还是需要仔细一点的。因为状态迁移的部分正是与其他 ConcreteState 角色相关联的部分。

但是，在 State 模式中增加其他“依赖于状态的处理”是很困难的。这是因为我们需要在 State 接口中增加新的方法，并在所有的 ConcreteState 角色中都实现这个方法。虽说很困难，但是好在我们绝对不会忘记实现这个方法。假设我们现在在 State 接口中增加了一个 doYYY 方法，而忘记了在 DayState 类和 NightState 类中实现这个方法，那么编译器在编译代码时就会报错，告诉我们存在还没有实现的方法。

如果不使用 State 模式，那么增加新的状态时会怎样呢？这里，如果不使用 State 模式，就必须用条件分支语句判断状态。这样就很难在编译代码时检测出“忘记实现方法”这种错误了（在运行时检测出问题并不难。我们只要事先在每个方法内部都加上一段“当检测到没有考虑到的状态时就报错”的代码即可）。

### 实例的多面性
请注意 SafeFrame 类中的以下两条语句（代码清单 19.7）：
- SafeFrame 类的构造函数中的 `buttonUse.addActionListener(this);`
- actionPerformed 方法中的 `state.doUse(this);`

这两条语句中都有 `this`。那么这个 `this` 到底是什么呢？当然，它们都是 SafeFrame 类的实例。由于在示例程序中只生成了一个 SafeFrame 的实例，因此这两个 `this` 其实是同一个对象。不过，在 addActionListener 方法中和 doUse 方法中，对 `this` 的使用方式是不一样的。

向 addActionListener 方法传递 `this` 时，该实例会被当作“实现了 ActionListener 接口的类的实例”来使用。这是因为 addActionListener 方法的参数类型是 ActionListener 类型。

在 addActionListener 方法中会用到的方法也都是在 ActionListener 接口中定义了的方法。至于这个参数是否是 SafeFrame 类的实例并不重要。向 doUse 方法传递 `this` 时，该实例会被当作“实现了 Context 接口的类的实例”来使用。这是因为 doUse 方法的参数类型是 Context 类型。在 doUse 方法中会用到的方法也都是在 Context 接口中定义了的方法（大家只要再回顾一下 DayState 类和 NightState 类的 doUse 方法就会明白了）。请大家一定要透彻理解此处的实例的多面性。

## 相关的设计模式
+ Singleton 模式
+ Flyweight 模式
