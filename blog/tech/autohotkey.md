---
title: AutoHotKey 入门与技巧
categories:
  - 自动化
  - 脚本
  - 效率工具
  - Windows
---

# AutoHotKey 简介

AutoHotKey（简称 AHK）是一款 Windows 平台下强大的自动化脚本工具，广泛用于快捷键自定义、自动化操作、文本替换、窗口管理等场景。

## 主要功能
- 自定义全局或应用快捷键
- 自动输入文本、批量粘贴
- 自动化鼠标、键盘操作
- 窗口管理、批量重命名、自动化办公
- 脚本可编程，支持条件、循环、函数等

## 典型应用场景
- 一键启动常用软件
- 批量输入常用短语、代码片段
- 游戏连点、自动挂机
- Excel/Word/浏览器自动化

## 基本语法示例
```ahk
; F1 键输入“你好，世界！”
F1::Send, 你好，世界！

; Ctrl+Alt+C 复制当前窗口标题
^!c::
WinGetTitle, title, A
Clipboard := title
return

; 循环点击鼠标左键 10 次
Loop 10 {
    Click
    Sleep, 100
}
```

## 安装与使用
1. 访问 [AutoHotKey 官网](https://www.autohotkey.com/) 下载并安装。
2. 新建 `.ahk` 脚本文件，右键“运行脚本”即可。
3. 可将脚本添加到开机启动。

## 进阶技巧
- 支持 GUI 界面开发、正则表达式、DLL 调用等高级功能。
- 社区有丰富的脚本资源和插件。

## macOS 替代方案
- 推荐使用 Hammerspoon、Karabiner-Elements、Automator 等工具实现类似自动化。

---

> AutoHotKey 是 Windows 下极为高效的自动化神器，适合程序员和办公用户提升效率。
