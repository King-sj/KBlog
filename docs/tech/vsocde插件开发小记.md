---
title: VSCode 插件开发踩坑记录
date: 2025-03-01
category: ["VSCode"]
tags: ["vscode", "插件开发", "extension"]
summary: VSCode 插件开发中的常见问题：激活超时、停用超时、文件关闭事件等。
---

# VSCode 插件开发踩坑记录

VSCode 插件开发入门不难——官方脚手架 `yo code` 一把梭。但实际开发中还是有一些文档不显眼、踩了才知道的坑。

<!-- more -->

## 快速起步

VSCode 提供脚手架工具一键生成插件模板：

```sh
npm install -g yo generator-code
yo code
```

会引导你选择插件类型（扩展、主题、代码片段等）、语言（JS/TS）和基本配置。生成的项目结构如下：

```text
my-extension/
├── package.json          # 插件清单（activationEvents、contributes 等）
├── src/
│   └── extension.ts      # 入口：activate() 和 deactivate()
├── tsconfig.json
└── .vscode/
    └── launch.json       # F5 调试配置
```

开发时直接按 `F5` 即可打开一个新的 VSCode 窗口加载插件进行调试。

官方文档：[Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)

## 常见踩坑

### 1. activate 执行超时导致启动失败

`activate()` 函数如果执行时间过长，VSCode 会认为插件启动失败：

```text
Activating extension 'undefined_publisher.kcodetime' failed: AggregateError.
```

**原因**：VSCode 对插件的 `activate` 有超时限制（默认约 10 秒）。如果你的初始化逻辑（如读取大量文件、请求外部 API）超过这个时间，就会被强行终止。

**解决方案**：

```typescript
export function activate(context: vscode.ExtensionContext) {
    // 耗时初始化放到异步任务中，不阻塞 activate
    context.subscriptions.push(
        vscode.commands.registerCommand('myext.init', async () => {
            // 这里可以执行耗时操作
            await heavyInitLogic();
        })
    );

    // 或者用 setImmediate 延迟执行
    setImmediate(() => heavyInitLogic());
}
```

### 2. deactivate 执行超时被强制终止

`deactivate()` 如果执行超过 **5 秒**，VSCode 会直接 kill 插件进程，导致清理逻辑未完成。

```typescript
export async function deactivate() {
    // 发送统计数据、关闭连接等清理工作
    // 注意：全部清理操作必须在 5 秒内完成
    await cleanupConnections();

    // 如果清理操作可能很长，给个超时保护
    await Promise.race([
        cleanupConnections(),
        new Promise(r => setTimeout(r, 4000))  // 4 秒兜底
    ]);
}
```

### 3. onDidCloseTextDocument 不会在关闭 VSCode 时触发

`vscode.workspace.onDidCloseTextDocument` 只在**打开的文件标签被关闭时**触发。**关闭整个 VSCode 窗口时不会触发这个事件**。

如果你的插件需要"在文档关闭时保存元数据"，不能只依赖这个事件。需要额外监听窗口关闭：

```typescript
// 文件关闭事件
vscode.workspace.onDidCloseTextDocument(doc => {
    saveMetadata(doc.uri);
});

// 插件停用事件（包括窗口关闭）
context.subscriptions.push({
    dispose: () => {
        // VSCode 关闭时会调用 dispose
        saveAllPendingMetadata();
    }
});
```

### 4. activationEvents 配置陷阱

`package.json` 中的 `activationEvents` 决定了插件何时激活。如果配置不当，插件可能一直不启动，或者在不该启动的时候启动。

```json
{
    "activationEvents": [
        "onLanguage:python",       // 打开 Python 文件时激活
        "onCommand:myext.hello",   // 执行命令时激活
        "workspaceContains:pyproject.toml"  // 工作区包含某文件时激活
    ]
}
```

常见陷阱：`onLanguage` 不是文件后缀！`onLanguage:python` 对应 `.py` 文件，`onLanguage:typescript` 对应 `.ts`。不要写成 `onLanguage:py` 或 `onLanguage:ts`。

## 调试技巧

- **F5** 启动调试模式，会自动编译并加载插件
- **Ctrl+Shift+I** 在调试窗口中打开 Developer Tools（类似 Chrome 的 DevTools）
- `console.log` 输出会在调试窗口的 Debug Console 显示
- 日志也可以输出到 VSCode 的输出面板：

```typescript
const outputChannel = vscode.window.createOutputChannel('My Extension');
outputChannel.appendLine('Plugin activated!');
```

## 总结

VSCode 插件开发的 API 设计得挺完善，脚手架也很成熟。主要坑点集中在**生命周期管理**上——各种超时限制和事件触发时机需要特别留意。建议在 CI 中加入 E2E 测试来覆盖这些边界情况。

## 参考

- [VSCode Extension API 文档](https://code.visualstudio.com/api)
- [Your First Extension 教程](https://code.visualstudio.com/api/get-started/your-first-extension)
