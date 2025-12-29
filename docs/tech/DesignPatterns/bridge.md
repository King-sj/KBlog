---
title: Bridge 模式
date: 2024-10-25
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 分开考虑
prev: ./abstractFactory
next: ./strategy
---

Bridge 模式在“类的功能层次结构”和“类的实现层次结构”之间搭建桥梁。
<!-- more -->

## 使用此设计模式的理由

Bridge 模式的主要目的是将抽象部分与实现部分分离，使它们可以独立变化。这种模式通过组合而不是继承来实现功能的扩展，减少了类之间的耦合度，提高了系统的可扩展性和可维护性。

## 类的层次结构的两个作用

### 增加新功能时
假设现在有一个类 `Something`，当我们想在 `Something` 中增加新功能时（例如增加一个具体方法），会编写一个 `Something` 类的子类（派生类），即 `SomethingGood` 类。这样就构成了一个小小的类层次结构。这就是为了增加新功能而产生的层次结构。

SomeThing

----\ SomeThingGood

### 增加新的实现时
在 Template Method 模式（第 3 章）中，我们学习了抽象类的作用。抽象类声明了一些抽象方法，定义了接口 (API)，然后子类负责实现这些抽象方法。父类的任务是通过声明抽象方法的方式定义接口 (API)，而子类的任务是实现抽象方法。正是由于父类和子类的这种任务分担，我们才可以编写出具有高可替换性的类。

这里其实也存在层次结构。例如，当子类实现了父类 `AbstractClass` 类的抽象方法时，它们之间就构成了一个小小的层次结构。

AbstractClass

----\ ConcreteClass

但是，这里的类的层次结构并非用于增加功能，也就是说，这种层次结构并非用于方便我们增加新的方法。它的真正作用是帮助我们实现任务分担。

### 类的层次结构的混杂和分离

当我们想要编写子类时，就需要先确认自己的意图：“我是要增加功能呢？还是要增加实现呢？”

当类的层次结构只有一层时，功能层次结构与实现层次结构是混杂在一个层次结构中的。这样很容易使类的层次结构变得复杂，也难以透彻地理解类的层次结构。因为自己难以确定究竟应该在类的哪一个层次结构中去增加子类。

因此，我们需要将“类的功能层次结构"与“类的实现层次结构"分离为两个独立的类层次结构。当然，如果只是简单地将它们分开，两者之间必然会缺少联系。所以我们还需要在它们之间搭建一座桥梁。本章中要学习的 Bridge 模式的作用就是搭建这座桥梁。

## 示例代码

### 类的一览表

| 在桥的哪一侧 | 名字 | 说明 |
|--------------|------|------|
| 类的功能层次结构 | Display | 负责“显示”的类 |
| 类的功能层次结构 | CountDisplay | 增加了“只显示规定次数”这一功能的类 |
| 类的实现层次结构 | DisplayImpl | 负责“显示”的类 |
| 类的实现层次结构 | StringDisplayImpl | “用字符串显示”的类 |
| 主程序 | Main | 试程序行为的类 |

Display 类（代码清单 9 · 1 ）的功能是抽象的，负责“显示一些东西"。该类位于“类的功能层次结构"的最上层。在 impl 字段中保存的是实现了 Display 类的具体功能的实例（ impl 是 implementation （实现）的缩写）。该实例通过 Display 类的构造函数被传递给 Display 类，然后保存在字段中，以供后面的处理使用（ impl 字段即是类的两个层次结构的“桥梁"）。

CountDisplay 类继承了 Display 类的 open、print、close 方法，并使用它们来增加这个新功能。这就是“类的功能层次结构"。

@startuml
class Display {
  - impl: DisplayImpl
  + Display(impl: DisplayImpl)
  + open(): void
  + print(): void
  + close(): void
  + display(): void
}

class CountDisplay extends Display{
  + CountDisplay(impl: DisplayImpl)
  + multiDisplay(times: number): void
}

abstract class DisplayImpl {
  + rawOpen(): void
  + rawPrint(): void
  + rawClose(): void
}

class StringDisplayImpl extends DisplayImpl{
  - str: string
  - width: number
  + StringDisplayImpl(str: string)
  + rawOpen(): void
  + rawPrint(): void
  + rawClose(): void
  - printLine(): void
}

Display --o DisplayImpl : use
@enduml

### countDisplay.ts
```typescript
import { Display } from './display';
import { DisplayImpl } from './displayImpl';

export class CountDisplay extends Display {
  constructor(impl: DisplayImpl) {
    super(impl);
  }

  multiDisplay(times: number) {
    this.open();
    for (let i = 0; i < times; i++) {
      this.print();
    }
    this.close();
  }
}
```

#### display.ts
```typescript
import { DisplayImpl } from './displayImpl';

export class Display {
  private impl: DisplayImpl;

  constructor(impl: DisplayImpl) {
    this.impl = impl;
  }

  open() {
    this.impl.rawOpen();
  }

  print() {
    this.impl.rawPrint();
  }

  close() {
    this.impl.rawClose();
  }

  display() {
    this.open();
    this.print();
    this.close();
  }
}
```

#### displayImpl.ts
```typescript
export abstract class DisplayImpl {
  abstract rawOpen(): void;
  abstract rawPrint(): void;
  abstract rawClose(): void;
}
```

#### main.ts
```typescript
import { Display } from './display';
import { CountDisplay } from './countDisplay';
import { StringDisplayImpl } from './stringDisplayImpl';

const d1 = new Display(new StringDisplayImpl('Hello, China.'));
const d2 = new CountDisplay(new StringDisplayImpl('Hello, World.'));
const d3 = new CountDisplay(new StringDisplayImpl('Hello, Universe.'));

d1.display();
d2.display();
d3.multiDisplay(5);
```

#### stringDisplayImpl.ts
```typescript
import { DisplayImpl } from './displayImpl';

export class StringDisplayImpl extends DisplayImpl {
  private str: string;
  private width: number;

  constructor(str: string) {
    super();
    this.str = str;
    this.width = str.length;
  }

  rawOpen() {
    this.printLine();
  }

  rawPrint() {
    console.log(`|${this.str}|`);
  }

  rawClose() {
    this.printLine();
  }

  private printLine() {
    let buffer = '+';
    for (let i = 0; i < this.width; i++) {
      buffer += '-';
    }
    buffer += '+';
    console.log(buffer);
  }
}
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\bridge\main.ts"
+-------------+
|Hello, China.|
+-------------+
+-------------+
|Hello, World.|
+-------------+
+----------------+
|Hello, Universe.|
|Hello, Universe.|
|Hello, Universe.|
|Hello, Universe.|
|Hello, Universe.|
+----------------+
```

## 拓展思路的要点
### 分开后更容易扩展

Bridge 模式的特征是将“类的功能层次结构"与“类的实现层次结构"分离开了。将类的这两个层次结构分离开有利于独立地对它们进行扩展。当想要增加功能时，只需要在“类的功能层次结构"一侧增加类即可，不必对“类的实现层次结构"做任何修改。而且，增加后的功能可以被“所有的实现”使用。

例如，我们可以将“类的功能层次结构"应用于软件所运行的操作系统上。如果我们将某个程序中依赖于操作系统的部分划分为 Windows 版、Macintosh 版、Unix 版，那么我们就可以用 Bridge 模式中的“类的实现层次结构"来表现这些依赖于操作系统的部分。也就是说，我们需要编写一个定义这些操作系统的共同接口（API）的 Implementor 角色，然后编写 Windows 版、Macintosh 版、Unix 版的 3 个 ConcreteImplementor 角色。这样一来，无论在“类的功能层次结构"中增加多少个功能，它们都可以工作于这 3 个操作系统上。

### 继承是强关联，委托是弱关联

继承是强关联关系，但委托是弱关联关系。这是因为只有 Display 类的实例生成时，才与作为参数被传入的类构成关联。例如，在示例程序中，当 Main 类生成 Display 类和 CountDisplay 类的实例时，才将 StringDisplayImpl 的实例作为参数传递给 Display 类和 CountDisplay 类。如果我们不传递 StringDisplayImpl 类的实例，而是将其他 ConcreteImplementor 角色的实例传递给 Display 类和 CountDisplay 类，就能很容易地改变实现。这时，发生变化的代码只有 Main 类，Display 类和 DisplayImpl 类则不需要做任何修改。

## 相关的设计模式
+ Template Method 模式
+ Abstract Factory 模式
+ Adapter 模式
