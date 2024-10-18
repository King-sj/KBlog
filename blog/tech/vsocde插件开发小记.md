# vscode plugin
// TODO
https://code.visualstudio.com/api/get-started/your-first-extension

# tips
- 若activate function执行时间过长，会导致`Activating extension 'undefined_publisher.kcodetime' failed: AggregateError.`, 从而启动失败
- 若deactivate function执行时间超过5s, 会被强行终止，导致插件无法正常退出。
- 关闭vscode 不会触发onDidCloseTextDocument事件
