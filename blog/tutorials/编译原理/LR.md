---
title: LR 语法分析方法
categories:
  - 编译原理
  - 语法分析
---

# LR 语法分析方法

LR 分析是一类自底向上的语法分析方法，广泛应用于编译器的语法分析阶段。

## 定义
LR（Left-to-right, Rightmost derivation）分析器是一种自底向上、从左到右扫描输入、产生最右推导的分析器。

## 原理
LR 分析器通过状态机和分析栈维护文法归约过程，能够处理大部分上下文无关文法。

## 类型
- LR(0)：最基础的 LR 分析器，无向前看符号
- SLR(1)：简单 LR，使用 Follow 集消除冲突
- LR(1)：每个项目带 1 个向前看符号，状态数多
- LALR(1)：合并 LR(1) 同心集，状态数与 SLR(1) 相同

## 应用
- 编译器语法分析（如 yacc、bison、antlr）
- 复杂表达式解析

## 参考资料
- [LR 语法分析方法详解](https://blog.csdn.net/m0_46202073/article/details/109519696)
- [编译原理经典教材](https://book.douban.com/subject/2132920/)
