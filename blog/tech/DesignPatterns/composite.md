---
title: Composite 模式
date: 2024-10-25
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 容器与内容的一致性
prev: ./strategy
next: ./decorator
---

## 使用此设计模式的理由

Composite 模式允许你将对象组合成递归结构来表示“部分-整体”的层次结构。使用 Composite 模式，用户可以统一地对待单个对象和组合对象。例如，在文件系统中，目录和文件都可以被视为条目（Entry），目录可以包含其他目录和文件，而文件则是叶子节点。

## 示例代码

@startuml
abstract class Entry {
  + getName(): string
  + getSize(): number
  + add(entry: Entry): Entry
  + printList(): void
  # printListWithPrefix(prefix: string): void
  + toString(): string
}

class Directory extends Entry{
  - directory: Entry[]
  - name: string
  + getName(): string
  + getSize(): number
  + add(entry: Entry): Entry
  # printListWithPrefix(prefix: string): void
}

class File extends Entry{
  - name: string
  - size: number
  + getName(): string
  + getSize(): number
  # printListWithPrefix(prefix: string): void
}
Directory <--o Entry
@enduml

### 目录类 (directory.ts)
```ts
import { Entry } from './entry';
export class Directory extends Entry {
  private directory: Entry[] = [];
  constructor(private name: string) {
    super();
  }
  getName(): string {
    return this.name;
  }
  getSize(): number {
    return this.directory.reduce((acc, entry) => acc + entry.getSize(), 0);
  }
  add(entry: Entry): Entry {
    this.directory.push(entry);
    return this;
  }
  protected printListWithPrefix(prefix: string): void {
    console.log(`${prefix}/${this}`);
    this.directory.forEach(entry => (entry as Directory).printListWithPrefix(`${prefix}/${this.name}`));
  }
}
```

### 抽象条目类 (entry.ts)
```ts
export abstract class Entry {
  abstract getName(): string;
  abstract getSize(): number;
  add(entry: Entry): Entry {
    throw new Error("FileTreatmentException");
  }
  printList(): void {
    this.printListWithPrefix("");
  }
  protected abstract printListWithPrefix(prefix: string): void;
  toString(): string {
    return `${this.getName()} (${this.getSize()})`;
  }
}
```

### 文件类 (file.ts)
```ts
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
  protected printListWithPrefix(prefix: string): void {
    console.log(`${prefix}/${this}`);
  }
}
```

### 主程序 (main.ts)
```ts
import { Entry } from './entry';
import { Directory } from './directory';
import { File } from './file';
console.log('Making root entries...');
let rootdir: Directory = new Directory('root');
let bindir: Directory = new Directory('bin');
let tmpdir: Directory = new Directory('tmp');
let usrdir: Directory = new Directory('usr');
rootdir.add(bindir);
rootdir.add(tmpdir);
rootdir.add(usrdir);
bindir.add(new File('vi', 10000));
bindir.add(new File('latex', 20000));
rootdir.printList();

console.log("Making user entries...");
let yuki: Directory = new Directory('yuki');
let hanako: Directory = new Directory('hanako');
let tomura: Directory = new Directory('tomura');
usrdir.add(yuki);
usrdir.add(hanako);
usrdir.add(tomura);
yuki.add(new File('diary.html', 100));
yuki.add(new File('Composite.java', 200));
hanako.add(new File('memo.tex', 300));
tomura.add(new File('game.doc', 400));
tomura.add(new File('junk.mail', 500));
rootdir.printList();
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\composite\main.ts"
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

## 相关的设计模式
+ Command 模式
+ Visitor 模式
+ Decorator 模式
