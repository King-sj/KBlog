---
title: Qt6 Maintenance Tool 无法安装 Qt5
date: 2024-08-31
category: ["C++"]
tags: ["Qt", "Qt6", "Qt5", "踩坑记录"]
summary: 解决 Qt6 Maintenance Tool 中找不到 Qt5 组件的问题。
---

# Qt6 Maintenance Tool 无法安装 Qt5

Qt6 的 Maintenance Tool 默认只显示最新版的 Qt6 组件，如果你需要安装 Qt5（很多项目还在用），需要在设置中打开存档仓库。

<!-- more -->

## 问题

用 Qt Online Installer 安装了 Qt6，打开 Maintenance Tool 后，在"选择组件"中只能看到 Qt6.x 的选项，找不到 Qt5。

## 原因

Qt Maintenance Tool 默认只拉取最新的组件仓库。Qt5 被标记为"旧版本"，需要手动在 Repository 设置中启用 "Archive" 来源。

## 解决步骤

1. 打开 Qt Maintenance Tool（在 Qt 安装目录下）
2. 点击 **Settings**（设置）→ **Repositories**（仓库）
3. 勾选 **Archive**（存档）仓库
4. 点击 **Filter**（筛选）按钮刷新组件列表
5. 回到"选择组件"页面，Qt5 的选项就出现了

勾选即可安装。

## 补充

如果你需要离线安装（避免国内网络下载慢），可以下载 Qt5 官方离线安装包：

- [Qt 5.15 LTS 离线安装包](https://download.qt.io/official_releases/qt/5.15/)
- [国内镜像加速（清华源）](https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/qt/5.15/)

离线安装包不需要 Maintenance Tool，直接双击安装即可。

## 总结

Qt6 的 Maintenance Tool 默认隐藏了 Qt5，勾选 Archive 仓库就能看到。如果只是偶尔用 Qt5 开发，也可以考虑用离线安装包或包管理器直接装（如 `brew install qt@5` / `apt install qt5-default`）。
