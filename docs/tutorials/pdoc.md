---
category: Python
tags: [pdoc, 文档生成, Python, 教程]
title: pdoc 使用教程
summary: 介绍 pdoc 的安装、基本用法、常见参数与示例，帮助快速为 Python 项目生成文档。
---

# pdoc 使用文档

## 什么是 pdoc？
pdoc 是一个用于为 Python 项目自动生成文档的工具，支持生成 HTML 或 Markdown 格式，适合快速构建 API 文档。

## 安装
使用 pip 安装 pdoc：
```bash
pip install pdoc
```

## 生成文档
在命令行中运行：
```bash
pdoc -o ./docs your_module_name
```

### 参数说明
- `-o` 或 `--output-dir`：指定文档输出目录。
- `your_module_name`：替换为你的 Python 模块或包的名称。

## 示例
假设你的模块名为 `example_module`，且源码在 `src/` 目录下，运行：
```bash
pdoc -o ./docs src/example_module
```
生成的文档将保存在 `./docs` 目录中。

## 常用功能
- 支持生成 HTML 或 Markdown 文档（通过 `--format` 参数）。
- 可递归扫描包内所有子模块。
- 支持自定义模板和主题。

## 更多信息
查看官方文档以获取更多用法和高级功能：[pdoc 官方文档](https://pdoc.dev/)
