---
layout: Layout
title: 资源
date: 2024-10-18
---

# 资源

这里是推荐的书籍、网站、工具等资源。
<!-- more -->
+ [github - 世界上最大的代码托管平台](https://github.com/)
+ [Z-Library – 世界上最大的电子图书馆。自由访问知识和文化。](https://zh.z-lib.gs/)
+ [Vuepress - 我的博客构建库](https://v2.vuepress.vuejs.org/zh/)
+ [plantUML - 一个通用性很强的工具，可以快速、直接地创建各种图表](https://plantuml.com/zh/)
+ [emoji-cheat-sheet - A markdown version emoji cheat sheet](https://github.com/ikatyang/emoji-cheat-sheet)
+ [Sci-hub —— 当今科学界最具争议性的项目。Sci-hub的目标是 免费并且不受限制地 提供所有科学知识。](https://www.sci-hub.st/)
+ [Lib.Genesis —— Part of Library Genesis. ex libgen.io, libgen.org](https://libgen.mx/)

<BlogPosts :pages="$site.pages" :filter="page => page.path.startsWith('/resources/')" />
