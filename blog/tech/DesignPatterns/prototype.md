---
title: Prototype 模式
date: 2024-10-22
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 生成实例
prev: ./singleton
next: ./builder
---

## 为什么要使用 Prototype 模式

Prototype 模式是一种创建型设计模式，它允许你复制现有对象而无需使代码依赖它们所属的类。使用 Prototype 模式可以：

- 避免重复初始化对象的复杂过程。
- 提高性能，特别是在创建对象代价较高时。
- 简化代码，使得对象的创建更加灵活。
- 对象种类繁多，无法将它们整合到一个类中
- 难以根据类生成实例
- 解耦框架与生成的实例
<!-- more -->
## 示例代码

@startuml
interface Product {
  +use(s: String): void
  +createClone(): Product
}

class Manager {
  -showcase: { [key: string]: any }
  +register(name: string, proto: any): void
  +create(name: string): any
}

class MessageBox {
  -decochar: string
  +use(s: string): void
  +createClone(): Product
}

class UnderlinePen {
  -ulchar: string
  +use(s: string): void
  +createClone(): Product
}

Product <|.. MessageBox
Product <|.. UnderlinePen
Manager --> Product : use
@enduml

```ts
// main.ts
import { Manager } from './manager';
import { UnderlinePen } from './underlinePen';
import { MessageBox } from './messageBox';

let manager = new Manager();
let upen = new UnderlinePen('~');
let mbox = new MessageBox('*');
let sbox = new MessageBox('/');
manager.register('strong message', upen);
manager.register('warning box', mbox);
manager.register('slash box', sbox);

let p1 = manager.create('strong message');
p1.use('Hello, world.');
let p2 = manager.create('warning box');
p2.use('Hello, world.');
let p3 = manager.create('slash box');
p3.use('Hello, world.');
// manager.ts
export class Manager {
  private showcase: { [key: string]: any } = {};
  register(name: string, proto: any) {
    this.showcase[name] = proto;
  }
  create(name: string): any {
    const p = this.showcase[name];
    return p.createClone();
  }
}
// messageBox.ts
import { Product } from "./product";
export class MessageBox implements Product {
  private decochar: string;
  constructor(decochar: string) {
    this.decochar = decochar;
  }
  use(s: string): void {
    const length = s.length;
    console.log(this.decochar.repeat(length + 4));
    console.log(`${this.decochar} ${s} ${this.decochar}`);
    console.log(this.decochar.repeat(length + 4));
  }
  createClone(): Product {
    let p: Product = null;
    try {
      p = <Product>Object.create(this);
    } catch (e) {
      console.error(e);
    }
    return p;
  }
}
// product.ts
export interface Product {
  use(s:String): void;
  createClone(): Product;
}
// underlinePen.ts
import { Product } from './product';
export class UnderlinePen implements Product {
  private ulchar: string;
  constructor(ulchar: string) {
    this.ulchar = ulchar;
  }
  use(s: string): void {
    const length = s.length;
    console.log(`"${s}"`);
    console.log(' ');
    console.log(` ${this.ulchar.repeat(length)}`);
    console.log(' ');
  }
  createClone(): Product {
    let p: Product = null;
    try {
      p = Object.create(this);
    } catch (e) {
      console.log(e);
    }
    return p;
  }
}
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\prototype\main.ts"
"Hello, world."

 ~~~~~~~~~~~~~

*****************
* Hello, world. *
*****************
/////////////////
/ Hello, world. /
/////////////////
```

## 相关设计模式
+ Flyweight 模式
+ Memento 模式
+ Composite 模式
+ Decorator 模式
+ Command 模式
