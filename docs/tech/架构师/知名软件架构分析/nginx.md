# Nginx 架构设计

【Nginx是什么？Nginx高并发架构拆解指南-哔哩哔哩】 https://b23.tv/5TP2kfG

## 设计

## QA

### 多个worker监听同一个端口，为什么不冲突?

- [笔记:两个进程能监听同一个端口吗？ - vanki的文章 - 知乎](https://zhuanlan.zhihu.com/p/612436510)
- [Linux epoll完全图解，彻底搞懂epoll机制 - 物联网心球的文章 - 知乎](https://zhuanlan.zhihu.com/p/17856755436)

### Nginx单点问题

https://blog.csdn.net/liaofeifeifeifei/article/details/124923137