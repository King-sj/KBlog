---
title: python requirements.txt
date: 2024-10-29
category: python
tag:
  - 踩坑记录
---

Python 生成 ```requirements```有两种方式

+ ```pip list --format=freeze > requirements.txt``` (推荐做法)
+ ```pip freeze > requirements.txt``` (不推荐，会带有本地路径)
