---
title: builder 模式
date: 2024-10-22
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 生成实例
prev: ./prototype
next: ./abstractFactory
---

## 为什么要使用 Builder 模式

Builder 模式通过将对象的构建过程与其表示分离，使得同样的构建过程可以创建不同的表示。它主要用于以下情况：

1. **复杂对象的创建**：当一个对象的构建过程非常复杂时，Builder 模式可以将构建过程分解为多个步骤，使代码更易于维护和理解。
2. **不同的表示**：当需要创建不同表示的对象时，Builder 模式允许使用相同的构建过程来生成不同的对象表示。
3. **代码复用**：通过将构建过程封装在 Director 类中，可以在不同的上下文中重用相同的构建逻辑。

## 代码示例
@startuml
class Builder {
  +makeTitle(title: string): void
  +makeString(str: string): void
  +makeItems(items: string[]): void
  +close(): void
}

class Director {
  -builder: Builder
  +Director(builder: Builder)
  +construct(): void
}

class HTMLBuilder {
  -filename: string
  -buffer: string
  +makeTitle(title: string): void
  +makeString(str: string): void
  +makeItems(items: string[]): void
  +close(): void
  +getResult(): string
}

class TextBuilder {
  -buffer: string
  +makeTitle(title: string): void
  +makeString(str: string): void
  +makeItems(items: string[]): void
  +close(): void
  +getResult(): string
}

Builder <|-- HTMLBuilder
Builder <|-- TextBuilder
Director --> Builder
@enduml

```ts
// builder.ts
export abstract class Builder {
  public abstract makeTitle(title: string): void;
  public abstract makeString(str: string): void;
  public abstract makeItems(items: string[]): void;
  public abstract close(): void;
}

// director.ts
import { Builder } from './builder';
export class Director {
  private builder: Builder;
  constructor(builder: Builder) {
    this.builder = builder;
  }
  public construct(): void {
    this.builder.makeTitle('问候');
    this.builder.makeString('从早上到下午');
    this.builder.makeItems(['早上好。', '下午好。']);
    this.builder.makeString('晚上');
    this.builder.makeItems(['晚上好。', '晚安。', '再见。']);
    this.builder.close();
  }
}

// htmlBuilder.ts
import { Builder } from './builder';
export class HTMLBuilder extends Builder {
  private filename: string = '';
  private buffer: string = '';

  public makeTitle(title: string): void {
    this.filename = `${title}.html`;
    this.buffer += `<html><head><title>${title}</title></head><body>`;
    this.buffer += `<h1>${title}</h1>`;
  }

  public makeString(str: string): void {
    this.buffer += `<p>${str}</p>`;
  }

  public makeItems(items: string[]): void {
    this.buffer += '<ul>';
    items.forEach((item) => {
      this.buffer += `<li>${item}</li>`;
    });
    this.buffer += '</ul>';
  }

  public close(): void {
    this.buffer += '</body></html>';
  }

  public getResult(): string {
    return this.buffer;
  }
}

// textBuilder.ts
import { Builder } from './builder';
export class TextBuilder extends Builder {
  private buffer: string = '';
  public makeTitle(title: string): void {
    this.buffer += '==============================\n';
    this.buffer += `『${title}』\n`;
    this.buffer += '\n';
  }
  public makeString(str: string): void {
    this.buffer += `■${str}\n`;
    this.buffer += '\n';
  }
  public makeItems(items: string[]): void {
    items.forEach((item) => {
      this.buffer += ` ・${item}\n`;
    });
    this.buffer += '\n';
  }
  public close(): void {
    this.buffer += '==============================\n';
  }
  public getResult(): string {
    return this.buffer;
  }
}

// main.ts
import { Builder } from './builder';
import { Director } from './director';
import { HTMLBuilder } from './htmlBuilder';
import { TextBuilder } from './textBuilder';

// TextBuilder
console.log("Creating a text file...");
const textBuilder = new TextBuilder();
const director = new Director(textBuilder);
director.construct();
const result = textBuilder.getResult();
console.log(result);

// HTMLBuilder
console.log("Creating an HTML file...");
const htmlBuilder = new HTMLBuilder();
const director2 = new Director(htmlBuilder);
director2.construct();
const filename = htmlBuilder.getResult();
console.log(`${filename}が作成されました。`);
```


## 运行结果

```sh
PS design_patern> ts-node "d:\code\design_patern\src\builder\main.ts"
Creating a text file...
==============================
『问候』

■从早上到下午

 ・早上好。
 ・下午好。

■晚上

 ・晚上好。
 ・晚安。
 ・再见。

==============================

Creating an HTML file...
<html><head><title>问候</title></head><body><h1>问候</h1><p>从早上到下午</p><ul><li>早上好。</li><li>下午好。</li></ul><p>晚上</p><ul><li>晚上好。</li><li>晚安。</li><li>再见。</li></ul></body></html>が作成されました。
```

## 相关设计模式
+ Template Method 模式
+ Composite 模式
+ Abstract Factory 模式
+ Facade 模式

## 拓展思路的要点

### 谁知道什么
在面向对象编程中，“谁知道什么”是非常重要的。Builder 模式通过将对象的构建过程与其表示分离，明确了各个类的职责分工。Director 类知道如何构建复杂对象，但不知道对象的具体表示；Builder 类知道如何生成对象的具体表示，但不知道构建的具体步骤。这种职责分离使得代码更加清晰、易于维护和扩展。

正是因为不知道才能够替换，正是因为可以替换，组件才具有高价。作为设计人员，我们必须时刻关汴这种“可替換性”
### 设计时能够决定的事情和不能决定的事情

在设计软件时，有些事情是可以在设计阶段决定的，而有些事情则需要在运行时决定。Builder 模式通过将构建过程与表示分离，使得在设计时可以决定构建的步骤和逻辑，而具体的表示则可以在运行时灵活选择。这种设计方式提高了系统的灵活性和可扩展性。

### 代码的阅读方法和修改方法

在编程时，虽然有时需要从零开始编写代码，但更多时候我们都是在现有代码的基础上进行增加和修改。

这时，我们需要先阅读现有代码。不过，只是阅读抽象类的代码是无法获取很多信息的（虽然可以从方法名中获得线索）。

让我们再回顾一下示例程序。即使理解了 Builder 抽象类，也无法理解程序整体。至少必须在阅读了 Director 的代码后才能理解 Builder 类的使用方法（Builder 类的方法的调用方法）。然后再去看看 TextBuilder 类和 HTMLBuilder 类的代码，就可以明白调用 Builder 类的方法后具体会进行什么样的处理。

如果没有理解各个类的角色就动手增加和修改代码，在判断到底应该修改哪个类时，就会很容易出错。例如，如果修改 Builder 类，那么就会对类中调用 Builder 类方法的地方和 Builder 类的子类产生影响。或是如果不小心修改了 Director 类，在其内部调用了类的特有的方法，则会导致其失去作为可复用组件的独立性，而且当将子类替换为 HTMLBuilder 时，程序可能会无法正常工作。
