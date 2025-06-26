---
title: 风格统一
date: 2024-08-25 12:00:00
tag: 风格
category: 风格
---

# 风格统一

如何实现风格统一？
可以使用*.editorconfig*文件来实现风格统一。

1. 安装EditorConfig插件 (部分IDE默认直接支持)
2. 在项目根目录下创建.editorconfig文件，并添加以下内容：

```
root = true
[*]
indent_style = space
tab_width = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```
