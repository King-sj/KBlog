---
title: .editorconfig 统一代码风格
date: 2024-08-25
category: ["工具"]
tags: ["EditorConfig", "代码风格", "格式化"]
summary: 使用 .editorconfig 文件统一团队代码风格，告别缩进混乱。
---

# .editorconfig 统一代码风格

一个团队里有人用 Tab 有人用空格，有人缩进 2 格有人缩进 4 格，有人用 CRLF 有人用 LF——这些差异不仅让 Git diff 难看，还容易引发无意义的争论。

`.editorconfig` 就是来解决这个问题的。

<!-- more -->

## 什么是 EditorConfig

EditorConfig 是一套跨编辑器的代码风格标准。在项目根目录放一个 `.editorconfig` 文件，支持的编辑器（VSCode、JetBrains 全家桶、Vim、Emacs 等）会自动读取并应用配置。

**不需要安装任何依赖**，编辑器原生支持或通过插件即可，不侵入代码。

## 基本配置

在项目根目录创建 `.editorconfig`：

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

### 配置项说明

| 配置 | 值 | 说明 |
|------|------|------|
| `indent_style` | `space` / `tab` | 缩进类型 |
| `indent_size` | 数字 | 缩进宽度 |
| `tab_width` | 数字 | Tab 显示宽度 |
| `end_of_line` | `lf` / `crlf` / `cr` | 换行符类型 |
| `charset` | `utf-8` / `latin1` 等 | 字符编码 |
| `trim_trailing_whitespace` | `true/false` | 自动删除行尾空格 |
| `insert_final_newline` | `true/false` | 文件末尾插入空行 |

## 按文件类型定制

不同文件类型可能需要不同配置：

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.py]
indent_size = 4

[Makefile]
indent_style = tab

[*.md]
trim_trailing_whitespace = false

[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

常见场景：
- Python 项目通常用 4 空格缩进（PEP 8）
- Makefile **必须用 Tab**，用空格会报错
- Markdown 的行尾空格可能有特殊含义（强制换行），不要自动删除

## 编辑器设置

### VSCode

安装 [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 插件。

### JetBrains (IntelliJ / PyCharm / WebStorm)

JetBrains IDE 原生支持 EditorConfig，无需插件。在 Settings → Code Style 中可以勾选 "Enable EditorConfig support"。

### Vim

```vim
Plug 'editorconfig/editorconfig-vim'
```

然后 `:PlugInstall`。

## 配合 Prettier / ESLint

EditorConfig 管的是**编辑器的行为**（按 Tab 插入几个空格、换行符格式等），Prettier/ESLint 管的是**代码格式化规则**（语句末尾分号、引号风格等）。两者不冲突，各司其职。

实际项目建议：
1. `.editorconfig` — 所有编辑器统一的缩进/编码/换行
2. `.prettierrc` — 代码格式化细节
3. `.eslintrc` — 代码质量检查

这样无论团队成员用什么编辑器，底线风格是保证一致的。

## 总结

`.editorconfig` 是最低成本的代码风格统一方案。零依赖、跨编辑器、配置简单，一个文件能消灭大部分"缩进战争"。建议每个项目都加一个，哪怕只有你自己在维护——换机器、换编辑器时也能保持一致。

## 参考

- [EditorConfig 官方文档](https://editorconfig.org/)
