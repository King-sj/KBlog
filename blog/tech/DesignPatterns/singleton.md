---
title: Singleton 模式
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 生成实例
prev: ./factory_method
next: ./prototype
---


## 为什么要使用 Singleton 模式

Singleton 模式确保一个类只有一个实例，并提供一个全局访问点。它常用于需要控制资源访问的场景，例如数据库连接、日志记录器等。通过 Singleton 模式，可以避免创建多个实例带来的资源浪费和不一致性问题。

<!-- more -->
### 总结:
+ 想确保任何情况下都绝对只有 1 个实例
+ 想在程序上表现出“只存在一个实例”

## 示例代码

@startuml
class Singleton {
  - static instance: Singleton
  - static generatedId: number
  - constructor()
  + static getInstance(): Singleton
}

Singleton --> Singleton : uses
@enduml

```ts
// main.ts
import { Singleton } from './singleton';
const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
console.log(singleton1 === singleton2); // true

// singleton.ts
export class Singleton {
  private static instance: Singleton | null = null;
  private static generatedId: number = 0;

  private constructor() {
    Singleton.generatedId++;
    console.log(`Singleton instance created with id: ${Singleton.generatedId}`);
  }

  public static getInstance(): Singleton {
    if (this.instance === null) {
      this.instance = new Singleton();
    }
    return this.instance;
  }
}
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\singleton\main.ts"
Singleton instance created with id: 1
true
```

## 相关设计模式

+ abstractFactory 模式
+ Builder 模式
+ Facade 模式
+ Prototype 模式

## 多线程下

在多线程环境中，Singleton 模式的实现需要特别注意线程安全问题。如果多个线程同时访问 `getInstance` 方法，可能会导致创建多个实例。为了解决这个问题，可以使用双重检查锁定（Double-Checked Locking）或其他线程同步机制。

### 双重检查锁定示例代码

```ts
export class Singleton {
  private static instance: Singleton | null = null;
  private static generatedId: number = 0;
  private static lock: any = {};

  private constructor() {
    Singleton.generatedId++;
    console.log(`Singleton instance created with id: ${Singleton.generatedId}`);
  }

  public static getInstance(): Singleton {
    if (this.instance === null) {
      synchronized(this.lock, () => {
        if (this.instance === null) {
          this.instance = new Singleton();
        }
      });
    }
    return this.instance;
  }
}

function synchronized(lock: any, fn: () => void) {
  // Simulate a lock mechanism
  fn();
}
```

在上面的代码中，`synchronized` 函数模拟了一个锁机制，以确保在多线程环境下 `getInstance` 方法的线程安全性。
