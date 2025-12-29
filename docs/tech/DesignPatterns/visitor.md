---
title: Visitor 模式
date: 2024-10-25
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 访问数据结构并处理数据
prev: ./decorator
next: ./chainOfResponsibility
---

在 Visitor 模式中，数据结构与处理被分离开来。我们编写一个表示“访问者”的类来访问数据结构中的元素，并把对各元素的处理交给访问者类。这样，当需要增加新的处理时，我们只需要编写新的访问者，然后让数据结构可以接受访问者的访问即可。
<!-- more -->
### 为什么使用 Visitor 模式？

1. **分离关注点**：将数据结构与操作分离，使得代码更清晰、更易维护。
2. **增加新操作更容易**：只需添加新的访问者类，而不需要修改现有的数据结构。
3. **符合开闭原则**：对扩展开放，对修改关闭。

## 示例代码

@startuml
interface Element {
  +accept(visitor: Visitor): void
}

abstract class Entry implements Element {
  +getName(): string
  +getSize(): number
  +add(entry: Entry): Entry
  +iterator(): Entry[]
  +toString(): string
  +accept(visitor: Visitor): void
}

class File extends Entry {
  -name: string
  -size: number
  +getName(): string
  +getSize(): number
  +accept(visitor: Visitor): void
}

class Directory extends Entry {
  -name: string
  -dir: Entry[]
  +getName(): string
  +getSize(): number
  +add(entry: Entry): Directory
  +iterator(): Entry[]
  +accept(visitor: Visitor): void
}

abstract class Visitor {
  +visit(entry: Entry): void
}

class ListVisitor extends Visitor {
  -currentdir: string
  +visit(entry: Entry): void
}

Entry --> Visitor : accept
Visitor --> Entry : visit
@enduml

@startuml
actor Client
Client -> Directory : add(entry: Entry)
Client -> Directory : accept(visitor: Visitor)
Directory -> ListVisitor : visit(entry: Entry)
ListVisitor -> Directory : iterator()
Directory -> File : accept(visitor: Visitor)
ListVisitor -> File : visit(entry: Entry)
@enduml

```ts
// directory.ts
import { Entry } from './entry';
import { Visitor } from './visitor';
export class Directory extends Entry {
  private dir: Entry[] = [];
  constructor(private name: string) {
    super();
  }
  getName() {
    return this.name;
  }
  getSize() {
    let size = 0;
    this.dir.forEach((entry) => {
      size += entry.getSize();
    });
    return size;
  }
  add(entry: Entry) {
    this.dir.push(entry);
    return this;
  }
  iterator() {
    return this.dir;
  }
  accept(visitor:Visitor) {
    visitor.visit(this);
  }
}
// element.ts
import { Visitor } from './visitor';
export interface Element {
  accept(visitor: Visitor): void;
}
// entry.ts
import { Element } from "./element";
import { Visitor } from "./visitor";
export abstract class Entry implements Element {
  abstract getName(): string;
  abstract getSize(): number;
  add(entry: Entry): Entry {
    throw new Error("Entry.add not implemented");
  }
  iterator(): Entry[] {
    throw new Error("Entry.iterator not implemented");
  }
  toString(): string {
    return `${this.getName()} (${this.getSize()})`;
  }
  abstract accept(visitor: Visitor): void;
}
// file.ts
import { Visitor } from './visitor';
import { Entry } from './entry';
export class File extends Entry {
  constructor(private name: string, private size: number) {
    super();
  }
  getName(): string {
    return this.name;
  }
  getSize(): number {
    return this.size;
  }
  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
// listVisitor.ts
import { Visitor } from "./visitor";
import { File } from "./file";
import { Directory } from "./directory";
import { Entry } from "./entry";
export class ListVisitor extends Visitor {
  private currentdir = "";
  visit(entry:Entry) {
    if (entry instanceof File) {
      console.log(`${this.currentdir}/${entry}`);
    } else if (entry instanceof Directory) {
      console.log(`${this.currentdir}/${entry}`);
      const savedir = this.currentdir;
      this.currentdir = `${this.currentdir}/${entry.getName()}`;
      const it: Entry[] = entry.iterator();
      for (let i = 0; i < it.length; i++) {
        it[i].accept(this);
      }
      this.currentdir = savedir;
    }
  }

}
// main.ts
import { Directory } from "./directory";
import { File } from "./file";
import { ListVisitor } from "./listVisitor";

console.log("Making root entries...");
let rootdir = new Directory("root");
let bindir = new Directory("bin");
let tmpdir = new Directory("tmp");
let usrdir = new Directory("usr");
rootdir.add(bindir);
rootdir.add(tmpdir);
rootdir.add(usrdir);
bindir.add(new File("vi", 10000));
bindir.add(new File("latex", 20000));
rootdir.accept(new ListVisitor());

console.log("Making user entries...");
let yuki = new Directory("yuki");
let hanako = new Directory("hanako");
let tomura = new Directory("tomura");
usrdir.add(yuki);
usrdir.add(hanako);
usrdir.add(tomura);
yuki.add(new File("diary.html", 100));
yuki.add(new File("Composite.java", 200));
hanako.add(new File("memo.tex", 300));
tomura.add(new File("game.doc", 400));
tomura.add(new File("junk.mail", 500));
rootdir.accept(new ListVisitor());
// visitor.ts
import { Entry } from './entry';

export abstract class Visitor {
  abstract visit(file:Entry);
}
```
## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\visitor\main.ts"
Making root entries...
/root (30000)
/root/bin (30000)
/root/bin/vi (10000)
/root/bin/latex (20000)
/root/tmp (0)
/root/usr (0)
Making user entries...
/root (31500)
/root/bin (30000)
/root/bin/vi (10000)
/root/bin/latex (20000)
/root/tmp (0)
/root/usr (1500)
/root/usr/yuki (300)
/root/usr/yuki/diary.html (100)
/root/usr/yuki/Composite.java (200)
/root/usr/hanako (300)
/root/usr/hanako/memo.tex (300)
/root/usr/tomura (900)
/root/usr/tomura/game.doc (400)
/root/usr/tomura/junk.mail (500)
```


## 拓展思路的要点
### 双重分发
我们来整理一下 Visitor 模式中的方法调用关系。`accept`（接收）方法的调用方式如下：`element.accept(visitor)`；而 `visit`（访问）方法的调用方式如下：`visitor.visit(element)`。对比这两个方法会发现，它们呈现出一种相反的关系。`element` 接收 `visitor`，而 `visitor` 又访问 `element`。在 Visitor 模式中，`ConcreteElement` 和 `ConcreteVisitor` 这两个角色共同决定了实际进行的处理。这种消息分发的方式一般被称为双重分发（double dispatch）。
### 为什么要这么复杂
Visitor 模式的目的是将处理逻辑从数据结构中分离出来。数据结构很重要，它能够将元素集合及其关联关系组织在一起。但是，需要注意的是，保存数据结构与基于数据结构进行处理是两种不同的概念。在示例程序中，我们创建了 `ListVisitor` 类作为显示文件夹内容的 `ConcreteVisitor` 角色。此外，在练习题中，我们还要编写进行其他处理的 `ConcreteVisitor` 角色。通常，`ConcreteVisitor` 角色的开发可以独立于 `File` 类和 `Directory` 类。也就是说，Visitor 模式提高了 `File` 类和 `Directory` 类作为组件的独立性。如果将处理逻辑的方法定义在 `File` 类和 `Directory` 类中，那么每次要扩展功能，增加新的“处理”时，就不得不去修改这些类。
### 开闭原则——对扩展开放，对修改关闭
在设计类时，若无特殊理由，必须要考虑到将来可能会扩展类。绝不能毫无理由地禁止扩展类。这就是“对扩展是开放的”的意思。但是，如果在每次扩展类时都需要修改现有的类就太麻烦了。所以我们需要在不修改现有类的前提下能够扩展类，这就是“对修改是关闭的”的意思。我们提倡扩展，但如果需要修改现有代码，那就不行了。在不修改现有代码的前提下进行扩展，这就是开闭原则。至此，大家已经学习了多种设计模式。那么在看到这条设计原则后，大家应该都会点头表示赞同吧。功能需求总是在不断变化，而且这些功能需求大都是“希望扩展某个功能”。因此，如果不能比较容易地扩展类，开发过程将会变得非常困难。另一方面，如果要修改已经编写和测试完成的类，又可能会导致软件产品的质量降低。对扩展开放、对修改关闭的类具有高可复用性，可作为组件复用。设计模式和面向对象的目的正是为我们提供一种结构，可以帮助我们设计出这样的类。
### 易于增加 ConcreteVisitor 角色
使用 Visitor 模式可以很容易地增加 `ConcreteVisitor` 角色。因为具体的处理被交给 `ConcreteVisitor` 角色负责，因此完全不用修改 `ConcreteElement` 角色。
### 难以增加 ConcreteElement 角色
尽管使用 Visitor 模式可以很容易地增加 `ConcreteVisitor` 角色，但它却难以应对 `ConcreteElement` 角色的增加。例如，假设现在我们要在示例程序中增加一个 `Device` 类，它是 `File` 类和 `Directory` 类的兄弟类。这时，我们不得不在 Visitor 类中声明一个 `visit(Device)` 方法，并在所有的 Visitor 类的子类中都实现这个方法。
### Visitor 工作所需的条件
在 Visitor 模式中，对数据结构中的元素进行处理的任务被分离出来，交给 Visitor 类负责。这样，就实现了数据结构与处理的分离。这个主题，我们在本章的学习过程中已经提到过很多次了。但是要达到这个目的是有条件的，那就是 Element 角色必须向 Visitor 角色公开足够多的信息。例如，在示例程序中，`visit(Directory)` 方法需要调用每个目录条目的 `accept` 方法。为此，`Directory` 类必须提供用于获取每个目录条目的 `iterator` 方法。只有当访问者从数据结构中获取了足够多的信息后才能工作。如果无法获取到这些信息，它就无法工作。这样做的缺点是，如果公开了不应当被公开的信息，将来对数据结构的改良就会变得非常困难。


## 相关的设计模式
+ Iterator 模式
+ Composite 模式
+ Interpreter 模式
