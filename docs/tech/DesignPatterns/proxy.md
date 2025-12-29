---
title: Proxy 模式
date: 2024-10-29
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 避免浪费
prev: ./flyweight
next: ./command
---


## 为什么使用代理模式

在面向对象编程中，“本人”和“代理人”都是对象。如果“本人”对象太忙了．有些工作无法自己亲自完成，就将其交给“代理人"对象负责。
<!-- more -->

Proxy 模式用于为某对象提供一个代理，以控制对该对象的访问。主要有以下几个优点：
- 延迟实例化：代理对象可以在需要时才创建实际对象，节省资源。
- 控制访问：可以在代理中加入额外的逻辑来控制对实际对象的访问。
- 远程代理：可以用于访问远程对象。

## 实例代码

为了让 PrinterProxy 类与 Printer 类具有一致性，我们定义了 Printable 接口。示例程序的前提是"生成 Printer 类的实例"这一处理需要花费很多时间。为了在程序中体现这一点，我们在 Printer 类的构造了数中调用了 heavyJob 方法，让它干一些“重活”（虽说是重活，也不过是让程序睡眠 5 秒钟）。

@startuml
interface Printable {
  + setPrinterName(name: string): void
  + getPrinterName(): string
  + print(str: string): void
}

class Printer implements Printable {
  - name: string
  + Printer(name: string)
  + setPrinterName(name: string): void
  + getPrinterName(): string
  + print(str: string): void
  - heavyJob(msg: string): void
}

class PrinterProxy implements Printable {
  - name: string
  - real: Printer
  + PrinterProxy(name: string)
  + setPrinterName(name: string): void
  + getPrinterName(): string
  + print(str: string): void
  - realize(): void
}

PrinterProxy o--> Printer : use
@enduml

@startuml
actor Client
Client -> PrinterProxy: setPrinterName("Bob")
activate PrinterProxy
PrinterProxy -> PrinterProxy: realize()
activate Printer
PrinterProxy -> Printer: new Printer("Bob")
deactivate Printer
PrinterProxy -> Printer: print("你好，世界。")
Printer -> Printer: heavyJob("正在生成Printer的实例(Bob)")
Printer -> PrinterProxy: 完了。
Printer -> Client: === Bob ===\n你好，世界。
deactivate Printer
deactivate PrinterProxy
@enduml

```ts
// main.ts
import { Printable } from './printable';
import { PrinterProxy } from './printerProxy';
let p: Printable = new PrinterProxy('Alice');
console.log('名字现在是' + p.getPrinterName() + '。');
p.setPrinterName('Bob');
console.log('名字现在是' + p.getPrinterName() + '。');
p.print('你好，世界。');
// printable.ts
export interface Printable {
  setPrinterName(name: string): void;
  getPrinterName(): string;
  print(str:string): void;
}
// printer.ts
import { Printable } from "./printable";
export class Printer implements Printable {
  private name: string;
  constructor(name: string) {
    this.name = name;
    this.heavyJob(`正在生成Printer的实例(${this.name})`);
  }
  setPrinterName(name: string): void {
    this.name = name;
  }
  getPrinterName(): string {
    return this.name;
  }
  print(str:string): void {
    console.log(`=== ${this.name} ===`);
    console.log(str);
  }
  private heavyJob(msg: string): void {
    console.log(msg);
    for (let i = 0; i < 5; i++) {
      try {
        console.log(".");
        setTimeout(() => {
          console.log(".");
        }, 1000);
      } catch (e) {
        console.log(e);
      }
    }
    console.log("完了。");
  }
}
// printerProxy.ts
import { Printable } from './printable';
import { Printer } from './printer';
export class PrinterProxy implements Printable {
  private name: string;
  private real: Printer;
  constructor(name: string) {
    this.name = name;
  }
  setPrinterName(name: string): void {
    if (this.real !== undefined) {
      this.real.setPrinterName(name);
    }
    this.name = name;
  }
  getPrinterName(): string {
    return this.name;
  }
  print(str: string): void {
    this.realize();
    this.real.print(str);
  }
  private realize(): void {
    if (this.real === undefined) {
      this.real = new Printer(this.name);
    }
  }
}
```


## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\proxy\main.ts"
名字现在是Alice。
名字现在是Bob。
正在生成Printer的实例(Bob)
.
.
.
.
.
完了。
=== Bob ===
你好，世界。
.
.
.
.
.
```

## 拓展思路的要点

### 使用代理人来提升处理速度
在某些情况下，使用代理可以显著提升处理速度。例如，虚拟代理（Virtual Proxy）可以在实际对象创建之前进行一些轻量级的操作，从而减少系统的开销。通过代理对象来延迟实际对象的创建，可以提高系统的响应速度和资源利用率。

### 有必要划分代理人和本人吗
在设计模式中，代理人和本人的划分是为了实现职责分离和提高系统的灵活性。代理模式通过引入代理对象来控制对实际对象的访问，可以在不修改实际对象的情况下添加额外的功能。例如，远程代理（Remote Proxy）可以在客户端和远程服务器之间进行通信，而不需要客户端了解远程服务器的具体实现。

### 代理与委托
代理模式和委托模式虽然在某些方面有相似之处，但它们的目的和实现方式有所不同。代理模式主要用于控制对对象的访问，而委托模式则用于将任务分配给其他对象来执行。代理模式通过代理对象来控制对实际对象的访问，而委托模式通过委托对象来执行具体的任务。

### 透明性
代理模式的一个重要特点是透明性。代理对象和实际对象实现相同的接口，客户端可以像使用实际对象一样使用代理对象，而不需要关心代理对象的内部实现。这种透明性使得代理模式在不改变客户端代码的情况下添加额外的功能成为可能。

### HTTP 代理
HTTP 代理是一种常见的代理模式应用。HTTP 代理服务器位于客户端和目标服务器之间，负责转发客户端的请求和目标服务器的响应。HTTP 代理可以用于缓存、负载均衡、安全控制等功能，从而提高网络通信的效率和安全性。

### 各种 Proxy 模式
+ **Virtual Proxy**：虚拟代理用于控制对资源密集型对象的访问。它在实际对象创建之前进行一些轻量级的操作，从而延迟实际对象的创建。例如，图像加载时可以使用虚拟代理来显示占位符图像，直到实际图像加载完成。
+ **Remote Proxy**：远程代理用于控制对远程对象的访问。它在客户端和远程服务器之间进行通信，使得客户端可以像使用本地对象一样使用远程对象。例如，RMI（远程方法调用）就是一种远程代理的实现。
+ **Access Proxy**：访问代理用于控制对实际对象的访问权限。它可以在访问实际对象之前进行权限检查，从而确保只有授权的客户端才能访问实际对象。例如，防火墙代理可以用于控制对内部网络资源的访问。

通过这些不同类型的代理模式，我们可以在不同的应用场景中灵活地控制对对象的访问，提高系统的安全性、性能和可维护性。

## 相关的设计模式
+ Adapter 模式
+ Decorator 模式
