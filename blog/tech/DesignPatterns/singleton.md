---
title: Singleton 模式
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 生成实例
prev: ./factory_method
next:
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
