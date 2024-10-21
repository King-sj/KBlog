---
title: Template Method 模式
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 交给子类
prev: ./adapter
next: ./factory_method
---

[[toc]]

在父类中定义处理流程的框架，在子类中实现具体处理。Template Method 模式的主要目的是为了定义一个算法的骨架，而将一些步骤的具体实现延迟到子类中。通过这种方式，子类可以在不改变算法结构的情况下，重新定义算法中的某些步骤。
<!-- more -->

## 为什么要使用 Template Method 模式？

1. **代码复用**：将通用的算法结构放在父类中，避免重复代码。
2. **灵活性**：允许子类实现具体的步骤，增加了灵活性。
3. **控制反转**：父类控制算法的执行流程，子类只需关注具体步骤的实现。

## 示例代码
@startuml
abstract class AbstractDisplay {
  + display(): void
  # open(): void
  # print(): void
  # close(): void
}

class CharDisplay {
  - ch: string
  + CharDisplay(ch: string)
  + open(): void
  + print(): void
  + close(): void
}

class StringDisplay {
  - str: string
  - width: number
  + StringDisplay(str: string)
  + open(): void
  + print(): void
  + close(): void
  - printLine(): void
}

AbstractDisplay <|-- CharDisplay
AbstractDisplay <|-- StringDisplay
@enduml

```ts
// abstractDisplay.ts
export abstract class AbstractDisplay {
  protected abstract open(): void;
  protected abstract print(): void;
  protected abstract close(): void;

  display(): void {
    this.open();
    for (let i = 0; i < 5; i++) {
      this.print();
    }
    this.close();
  }
}

// charDisplay.ts
import { AbstractDisplay } from './abstractDisplay';
export class CharDisplay extends AbstractDisplay {
  private ch: string;
  constructor(ch: string) {
    super();
    this.ch = ch;
  }
  open() {
    console.log('<<');
  }
  print() {
    console.log(this.ch);
  }
  close() {
    console.log('>>');
  }
}

// stringDisplay.ts
import { AbstractDisplay } from './abstractDisplay';
export class StringDisplay extends AbstractDisplay {
  private str: string;
  private width: number;
  constructor(str: string) {
    super();
    this.str = str;
    this.width = str.length;
  }
  open() {
    this.printLine();
  }
  print() {
    console.log(`|${this.str}|`);
  }
  close() {
    this.printLine();
  }
  private printLine() {
    let line = '+';
    for (let i = 0; i < this.width; i++) {
      line += '-';
    }
    line += '+';
    console.log(line);
  }
}

// main.ts
import { CharDisplay } from './charDisplay';
import { StringDisplay } from './stringDisplay';

const d1 = new CharDisplay('H');
const d2 = new StringDisplay('Hello, world.');
const d3 = new StringDisplay('你好，世界。');
d1.display();
d2.display();
d3.display();
```
## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\template_method\main.ts"
<<
H
H
H
H
H
>>
+-------------+
|Hello, world.|
|Hello, world.|
|Hello, world.|
|Hello, world.|
|Hello, world.|
+-------------+
+------+
|你好，世界。|
|你好，世界。|
|你好，世界。|
|你好，世界。|
|你好，世界。|
+------+
```

## 相关设计模式
+ Factory Method 模式
+ Strategy 模式

## 延申: 类的层次与抽象类
我们在理解类的层次时，通常是站在子类的角度进行思考的。也就是说，很容易着眼于以下几点。
+ 在子类中可以使用父类中定义的方法
+ 可以通过在子类中增加方法以实现新的功能
+ 在子类中重写父类的方法可以改变程序的行为

现在，让我们稍微改变一下立场，站在父类的角度进行思考。在父类中，我们声明了抽象方法，而将该方法的实现交给了子类。换言之，就程序而言，声明抽象方法是希望达到以下目的。
+ 期待子类去实现抽象方法
+ 要求子类去实现抽象方法

也就是说，子类具有实现在父类中所声明的抽象方法的责任。因此，这种责任被称为“子类责任"（ subclass responsibility ）。
