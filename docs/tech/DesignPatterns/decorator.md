---
title: Decorator 模式
date: 2024-10-25
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 容器与内容的一致性
prev: ./composite
next: ./visitor
---

在这个示例中，我们使用装饰器模式来动态地给对象添加职责。装饰器模式允许我们通过将对象放入包含行为的特殊封装对象中来扩展对象的功能，而无需修改原始类的代码。
<!-- more -->
## 为什么使用装饰器模式？

1. **职责扩展**：装饰器模式允许我们在不修改现有代码的情况下扩展对象的功能。
2. **灵活性**：可以根据需要动态地添加或删除职责。
3. **遵循开闭原则**：通过使用装饰器模式，我们可以在不修改现有类的情况下添加新功能，从而遵循开闭原则。



## 代码示例

@startuml
abstract class Display {
  + getColumns(): number
  + getRows(): number
  + getRowText(row: number): string
  + show(): void
}

abstract class Border extends Display {
  - display: Display
  + Border(display: Display)
}

class StringDisplay extends Display {
  - string: string
  + StringDisplay(string: string)
  + getColumns(): number
  + getRows(): number
  + getRowText(row: number): string
}

class SideBorder extends Border {
  - borderChar: string
  + SideBorder(display: Display, ch: string)
  + getColumns(): number
  + getRows(): number
  + getRowText(row: number): string
}

class FullBorder extends Border {
  + FullBorder(display: Display)
  + getColumns(): number
  + getRows(): number
  + getRowText(row: number): string
  - makeLine(ch: string, count: number): string
}

Border --o StringDisplay
Display <--o Border
@enduml

```ts
// border.ts
import { Display } from "./display";
export abstract class Border extends Display {
  protected display: Display;
  constructor(display: Display) {
    super();
    this.display = display;
  }
}

// display.ts
export abstract class Display {
  abstract getColumns(): number;
  abstract getRows(): number;
  abstract getRowText(row: number): string;
  show(): void {
    for (let i = 0; i < this.getRows(); i++) {
      console.log(this.getRowText(i));
    }
  }
}

// fullBorder.ts
import { Border } from "./border";
export class FullBorder extends Border {
  constructor(display) {
    super(display);
  }
  getColumns() {
    return 1 + this.display.getColumns() + 1;
  }
  getRows() {
    return 1 + this.display.getRows() + 1;
  }
  getRowText(row) {
    if (row === 0) {
      return "+" + this.makeLine("-", this.display.getColumns()) + "+";
    } else if (row === this.display.getRows() + 1) {
      return "+" + this.makeLine("-", this.display.getColumns()) + "+";
    } else {
      return "|" + this.display.getRowText(row - 1) + "|";
    }
  }
  private makeLine(ch, count) {
    let buf = "";
    for (let i = 0; i < count; i++) {
      buf += ch;
    }
    return buf;
  }
}

// main.ts
import { Display } from "./display";
import { StringDisplay } from "./stringDisplay";
import { SideBorder } from "./sideBorder";
import { FullBorder } from "./fullBorder";
let b1: Display = new StringDisplay("Hello, world.");
let b2: Display = new SideBorder(b1, "#");
let b3: Display = new FullBorder(b2);
b1.show();
b2.show();
b3.show();
let b4: Display =
  new SideBorder(
    new FullBorder(
      new FullBorder(
        new SideBorder(
          new FullBorder(
            new StringDisplay("Hello")
          ),
          "*"
        )
      )
    ),
    "/"
  );

b4.show();

// sideBorder.ts
import { Border } from "./border";
import { Display } from "./display";
export class SideBorder extends Border {
  private borderChar: string;
  constructor(display: Display, ch: string) {
    super(display);
    this.borderChar = ch;
  }
  getColumns(): number {
    return 1 + this.display.getColumns() + 1;
  }
  getRows(): number {
    return this.display.getRows();
  }
  getRowText(row: number): string {
    return this.borderChar + this.display.getRowText(row) + this.borderChar;
  }
}

// stringDisplay.ts
import { Display } from './display';
export class StringDisplay extends Display {
  private string: string;
  constructor(string: string) {
    super();
    this.string = string;
  }
  getColumns(): number {
    return this.string.length;
  }
  getRows(): number {
    return 1;
  }
  getRowText(row: number): string {
    if (row === 0) {
      return this.string;
    } else {
      return '';
    }
  }
}
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\decorator\main.ts"
Hello, world.
#Hello, world.#
+---------------+
|#Hello, world.#|
+---------------+
/+-----------+/
/|+---------+|/
/||*+-----+*||/
/||*|Hello|*||/
/||*+-----+*||/
/|+---------+|/
/+-----------+/
```

## 拓展思路的要点

### API 的透明性

在 Decorator 模式中，装饰边框与被装饰物具有一致性。具体而言，在示例程序中，表示装饰边框的 `Border` 类是表示被装饰物的 `Display` 类的子类，这就体现了它们之间的一致性。也就是说， `Border` 类（以及它的子类）与表示被装饰物的 `Display` 类具有相同的接口（API）。这样，即使被装饰物被边框装饰起来了，接口（API）也不会被隐藏起来。其他类依然可以调用 `getColumns`、`getRows`、`getRowText` 以及 `show` 方法。这就是接口（API）的“透明性”。在示例程序中，实例 `b4` 被装饰了多次，但是接口（API）却没有发生任何变化。得益于接口（API）的透明性，模式中也形成了类似于 Composite 模式中的递归结构。也就是说，装饰边框里面的“被装饰物”实际上又是别的物体的“装饰边框”。就像是剥洋葱时以为洋葱心要出来了，结果却发现还是皮。不过， Decorator 模式虽然与 Composite 模式一样，都具有递归结构，但是它们的使用目的不同。Decorator 模式的主要目的是通过添加装饰物来增加对象的功能。

### 在不改变被装饰物的前提下增加功能

在 Decorator 模式中，装饰边框与被装饰物具有相同的接口（API）。虽然接口是相同的，但是越装饰，功能则越多。例如，用 `SideBorder` 装饰 `Display` 后，就可以在字符串的左右两侧加上装饰字符。如果再用 `FullBorder` 装饰，那么就可以在字符串的四周加上边框。此时，我们完全不需要对被装饰的类做任何修改。这样，我们就实现了不修改被装饰的类即可增加功能。Decorator 模式使用了委托。对“装饰边框”提出的要求（调用装饰边框的方法）会被转交（委托）给“被装饰物”去处理。以示例程序来说，就是 `SideBorder` 类的 `getColumns` 方法调用了 `display.getColumns`。此外，`getRows` 方法也调用了 `display.getRows`。

### 可以动态地增加功能

Decorator 模式中用到了委托，它使类之间形成了弱关联关系。因此，不用改变框架代码，就可以生成一个与其他对象具有不同关系的新对象。

### 只需要一些装饰物即可添加许多功能

使用 Decorator 模式可以为程序添加许多功能。只要准备一些装饰边框（ConcreteDecorator 角色），即使这些装饰边框都只具有非常简单的功能，也可以将它们自由组合成为新的对象。这就像我们可以自由选择香草味冰激凌、巧克力冰激凌、草莓冰激凌、猕猴桃冰激凌等各种口味的冰激凌一样。如果冰激凌店要为顾客准备所有的冰激凌成品那真是太麻烦了。因此，冰激凌店只会准备各种香料，当顾客下单后只需要在冰激凌上加上各种香料就可以了。不管是香草味，还是咖啡朗姆和开心果的混合口味，亦或是香草味、草莓味和猕猴桃三重口味，顾客想吃什么口味都可以。Decorator 模式就是可以应对这种多功能对象的需求的一种模式。

### 导致增加许多很小的类

Decorator 模式的一个缺点是会导致程序中增加许多功能类似的很小的类。

## 相关的设计模式
+ Adapter 模式
+ Strategy 模式

## 继承和委托中的一致性
### 父类和子类的一致性
在面向对象编程中，父类和子类之间的一致性是指子类应当继承父类的行为和属性，并且可以扩展或重写这些行为和属性。子类应当能够替代父类的实例而不影响程序的正确性，这就是所谓的里氏替换原则（Liskov Substitution Principle）。

### 自己和被委托对象的一致性
在委托模式中，一致性是指委托对象应当具有与委托者相同的接口或行为。委托者将某些任务委托给委托对象来执行，而委托对象应当能够无缝地完成这些任务，就像委托者自己完成一样。这种一致性确保了委托模式的灵活性和可维护性。
