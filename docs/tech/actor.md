---
category: 并发
tags: [actor, 并发模型, erlang, rust, 分布式, 容错]
title: actor 并发模型简介与实践
summary: 介绍 actor 并发模型的基本思想、优势与劣势、典型实现（如 Erlang、Rust），并给出相关理论与实践资料。
---

# actor 并发模型

Actor 模型是一种高度面向对象、无锁、异步、天生支持分布式和容错的并发编程范式。它将系统中的每个实体抽象为 Actor，彼此通过消息传递进行通信。

## 主要特性
- 更加面向对象：每个 Actor 封装状态和行为，彼此独立。
- 无锁：避免传统多线程的锁竞争问题。
- 异步消息传递：Actor 之间通过异步消息通信，天然适合分布式场景。
- 天生分布式：Actor 可以分布在不同节点，透明通信。
- 容错（Let it crash）：Actor 崩溃后可由监控者自动重启，提升系统健壮性。

## 劣势
- 调试和追踪较为复杂，难以全局把控。
- 消息顺序和一致性需额外关注。
- 性能受限于消息传递和调度开销。

## 常见并发模型对比
- 多线程：共享内存，需加锁，易出错。
- 协程/异步：轻量级线程，适合 IO 密集型。
- Actor：消息驱动，天然分布式，适合高并发和容错需求。

## 典型实现
- Smalltalk：最早提出面向对象消息传递思想。
- Objective-C：借鉴 Smalltalk 的消息机制。
- Erlang：工业级 Actor 模型代表，广泛应用于电信、分布式系统。
- Rust：如 Actix、riker 等库实现 Actor 并发。

## 代码示例（Erlang）
```erlang
% 简单的 echo actor
echo() ->
    receive
        {From, Msg} ->
            io:format("Received: ~p~n", [Msg]),
            From ! {self(), Msg},
            echo()
    end.
```

## Rust 中 Actor 并发模型的实践
Rust 生态中有如 Actix、riker 等高性能 Actor 框架，适合构建高并发、分布式服务。
- [Rust 中 Actor 并发模型的实践与使用](https://blog.csdn.net/smilejiasmile/article/details/138037188)

## 理论与资料
- [Actor 模型原理与 Erlang 实践](https://zhuanlan.zhihu.com/p/86460724)
- [Erlang 官方文档](https://www.erlang.org/doc/)
- [Actix 官方文档](https://actix.rs/docs/)

---

Actor 模型已成为现代分布式系统和高并发服务的重要基础，适合对高可用、可扩展性有极高要求的场景。
# actor 并发模型

## 并发模型
- 多线程
- 协程/异步
- actor

## 理论
https://zhuanlan.zhihu.com/p/86460724

## Rust 中 Actor 并发模型的实践与使用
https://blog.csdn.net/smilejiasmile/article/details/138037188
