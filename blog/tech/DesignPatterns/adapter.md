---
title: 适配器模式
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
prev: ./iterator
next: ./template_method
---

[[toc]]

## 适配器模式

适配器模式（Adapter Pattern）是一种结构型设计模式，它允许将一个类的接口转换成客户希望的另一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

### 为什么要用适配器模式

在软件开发中，经常会遇到需要使用一些现有的类，但它们的接口并不符合当前系统的需求。适配器模式通过创建一个适配器类，将现有类的接口转换为所需的接口，从而使得现有类可以在新的环境中使用。

### 类比

### 类比

| | 比喻       | 示例程序    |
|------------|-------------|-------------|
| 实际需求   | 交流100V    |Banner      |
| 变换装置   | 适配器      | PrintBanner |
| 需求       | 直流12V     | Print       |

### 示例程序

Adapter 有两种方式实现

@startuml
title: 继承
interface Print {
  +printWeak()
  +printStrong()
}

class Banner {
  +showWithParen()
  +showWithAster()
}

class PrintBanner extends Banner implements Print {
  +printWeak()
  +printStrong()
}
@enduml

@startuml
title: 委托
abstract class Print {
  +printWeak()
  +printStrong()
}

class Banner {
  +showWithParen()
  +showWithAster()
}

class PrintBanner extends Print{
  -banner: Banner
  +printWeak()
  +printStrong()
}
PrintBanner --* Banner : 委托
@enduml
```ts
// banner.ts
export class Banner {
  private string: string;
  constructor(string: string) {
    this.string = string;
  }
  showWithParen(): void {
    console.log(`(${this.string})`);
  }
  showWithAster(): void {
    console.log(`*${this.string}*`);
  }
}

// print_inheritance.ts
export interface Print {
  printWeak(): void;
  printStrong(): void;
}

// printBanner_inheritance.ts
import { Banner } from './banner';
import { Print } from './print_inheritance';
export class PrintBanner extends Banner implements Print {
  constructor(string: string) {
    super(string);
  }
  printWeak(): void {
    this.showWithParen();
  }
  printStrong(): void {
    this.showWithAster();
  }
}

// print_delegation.ts
export abstract class Print {
  abstract printWeak(): void;
  abstract printStrong(): void;
}

// printBanner_delegation.ts
import { Print } from "./print_delegation";
import { Banner } from "./banner";
export class PrintBanner extends Print {
  private banner: Banner;
  constructor(string: string) {
    super();
    this.banner = new Banner(string);
  }
  printWeak(): void {
    this.banner.showWithParen();
  }
  printStrong(): void {
    this.banner.showWithAster();
  }
}

// main.ts
import { PrintBanner as pbi } from './printBanner_inheritance';
import { PrintBanner as pbd } from './printBanner_delegation';

// 使用继承
const printBanner = new pbi('Hello');
printBanner.printWeak();
printBanner.printStrong();

// 使用委托
const printBanner2 = new pbd('Hello');
printBanner2.printWeak();
printBanner2.printStrong();
```
### 运行结果
```sh
ts-node "d:\code\design_pattern\src\adapter\main.ts"
(Hello)
*Hello*
(Hello)
*Hello*
```
## 相关的设计模式
+ Bridge
+ Decorator

