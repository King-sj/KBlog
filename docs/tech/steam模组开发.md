---
title: Unity 游戏模组开发工具链
date: 2024-09-09
category: ["游戏开发"]
tags: ["Unity", "游戏模组", "Mod", "BepInEx", "Harmony"]
summary: Unity 游戏模组（Mod）开发的常用工具链介绍：反编译、Hook、资源提取等。
---

# Unity 游戏模组开发工具链

Unity 游戏的 Mod 开发本质上是**运行时注入**和**资源替换**。本文整理常用的工具链。

<!-- more -->

## 整体流程

Unity Mod 开发通常分为几个阶段：

1. **反编译** — 查看游戏的 C# 代码，理解内部逻辑
2. **资源提取** — 提取模型、贴图等资源，了解资源结构
3. **注入框架** — 将自定义代码注入游戏运行时
4. **Hook/补丁** — 修改、替换或扩展游戏方法

## 工具介绍

### BepInEx — Mod 加载框架

[BepInEx](https://github.com/BepInEx/BepInEx) 是目前最主流的 Unity 游戏 Mod 加载器，支持 IL2CPP 和 Mono 后端。

核心能力：加载自定义 DLL 插件、提供日志系统、配置管理、Harmony 集成。

基本使用：
1. 下载 BepInEx 压缩包，解压到游戏根目录
2. 将你的 Mod（DLL）放到 `BepInEx/plugins/` 下
3. 启动游戏，BepInEx 自动加载

```text
游戏根目录/
├── BepInEx/
│   ├── core/          # BepInEx 核心文件
│   ├── plugins/       # 你的 Mod DLL 放这里
│   └── config/        # 配置文件
├── winhttp.dll         # BepInEx 注入点（Windows）
└── 游戏.exe
```

### dnSpy — .NET 反编译器

[dnSpy](https://github.com/dnSpy/dnSpy) 是 .NET/C# 程序集的调试和反编译工具。

主要用途：
- 反编译 `Assembly-CSharp.dll` 查看游戏逻辑
- 调试 Unity 游戏运行时的 C# 代码
- 修改 IL 代码（高级用法，一般配合 Harmony 更好）

找到游戏目录下的 `{游戏名}_Data/Managed/Assembly-CSharp.dll`，拖入 dnSpy 即可浏览游戏的全部 C# 代码。

### AssetStudio — Unity 资源提取

[AssetStudio](https://github.com/Perfare/AssetStudio) 用于查看和提取 Unity 游戏的资产文件（AssetBundle）。

支持提取：模型、贴图、Shader、TextAsset（文本数据）、MonoBehaviour（序列化对象）。

用途：了解游戏中资源的命名规则、ID 映射、配置表结构，为编写 Mod 提供参考。

### Harmony — 运行时方法补丁

[Harmony](https://github.com/pardeike/Harmony) 是 C# 运行时方法补丁库，可以在运行时替换、前置、后置任何方法。

典型用法：

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.TakeDamage))]
class InfiniteHealthPatch
{
    static bool Prefix(Player __instance, ref int damage)
    {
        // 完全替换原方法，不受伤害
        damage = 0;
        return true; // 继续执行原方法（但 damage 已被改为 0）
    }
}
```

三种补丁类型：

| 补丁类型 | 说明 | 使用场景 |
|----------|------|----------|
| Prefix（前置） | 在方法执行前运行，可以修改参数或跳过原方法 | 修改输入、阻止执行 |
| Postfix（后置） | 在方法执行后运行，可以修改返回值 | 修改输出、记录结果 |
| Transpiler（IL） | 直接修改方法的 IL 代码 | 最灵活，也最复杂 |

### UnityExplorer — 运行时调试

[UnityExplorer](https://github.com/sinai-dev/UnityExplorer) 是一个游戏内调试工具，可以在运行时：
- 查看和修改场景中的 GameObject 层级
- 通过 C# Console 执行任意代码
- 实时查看和修改对象属性

推荐在开发早期使用，快速定位需要 Hook 的对象和方法。

## 实操建议

1. **从简单 Mod 入手**：先试着修改一个配置值（如移动速度），跑通全流程
2. **善用日志**：BepInEx 内置日志系统，不确定的地方先 `LogInfo` 打出来看看
3. **注意版本**：游戏更新后 Assembly-CSharp.dll 会变，Harmony 补丁的签名（方法名、参数）可能需要调整
4. **尊重版权**：非官方 Mod 开发请遵守游戏 EULA，涉及在线游戏的注意反作弊检测

## 总结

Unity Mod 开发的工具链已经比较成熟了。BepInEx 负责加载，Harmony 负责 Hook，dnSpy 负责逆向分析，三者组合可以覆盖大部分需求。

~~什么时候有空写一个完整的 Mod 开发教程~~（Flag 已立 qWq）

## 参考

- [BepInEx 官方文档](https://docs.bepinex.dev/)
- [Harmony 官方文档](https://harmony.pardeike.net/)
- [dnSpy GitHub](https://github.com/dnSpy/dnSpy)
- [AssetStudio GitHub](https://github.com/Perfare/AssetStudio)
- [UnityExplorer GitHub](https://github.com/sinai-dev/UnityExplorer)
