---
title: VSCode 插件开发小记
date: 2025-03-01
category: ["VSCode"]
tags: ["vscode", "插件开发", "extension"]
---

# VSCode 插件开发

// TODO
参考：https://code.visualstudio.com/api/get-started/your-first-extension

## Tips
- 若 activate function 执行时间过长，会导致 `Activating extension 'undefined_publisher.kcodetime' failed: AggregateError.`, 从而启动失败
- 若 deactivate function 执行时间超过5s, 会被强行终止，导致插件无法正常退出。
- 关闭 vscode 不会触发 onDidCloseTextDocument 事件
