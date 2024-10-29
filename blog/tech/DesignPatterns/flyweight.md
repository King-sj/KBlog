---
title: Flyweight 模式
date: 2024-10-28
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 避免浪费
prev: ./state
next: ./proxy
---

## 为什么使用 Flyweight 模式

Flyweight 模式是一种结构型设计模式，它通过共享尽可能多的相同对象来减少内存使用，从而提高性能。在需要生成大量细粒度对象的场景中，Flyweight 模式非常有用。通过共享对象，Flyweight 模式可以显著减少内存消耗，并提高应用程序的效率。

## 实例代码
@startuml
class BigChar {
  - charname: string
  - fontdata: string
  + print(): void
}

class BigCharFactory {
  - pool: Map<string, BigChar>
  - static singleton: BigCharFactory
  - constructor()
  + static getInstance(): BigCharFactory
  + getBigChar(charname: string): BigChar
}

class BigString {
  - bigchars: BigChar[]
  + constructor(str: string)
  + print(): void
}

BigCharFactory --> BigChar
BigString --> BigCharFactory
BigString --> BigChar
@enduml

@startuml
actor Client
Client -> BigString: new BigString("123")
activate BigString
BigString -> BigCharFactory: getInstance()
activate BigCharFactory
BigCharFactory -> BigCharFactory: getBigChar('1')
activate BigChar
BigCharFactory <-- BigChar: return BigChar('1')
deactivate BigChar
BigCharFactory -> BigCharFactory: getBigChar('2')
activate BigChar
BigCharFactory <-- BigChar: return BigChar('2')
deactivate BigChar
BigCharFactory -> BigCharFactory: getBigChar('3')
activate BigChar
BigCharFactory <-- BigChar: return BigChar('3')
deactivate BigChar
deactivate BigCharFactory
BigString --> Client: return BigString
deactivate BigString

Client -> BigString: print()
activate BigString
BigString -> BigChar: print('1')
BigString -> BigChar: print('2')
BigString -> BigChar: print('3')
deactivate BigString
@enduml

```ts
// bigChar.ts
export class BigChar {
  charname: string;
  fontdata: string;
  static fontdatas: { [key: string]: string } = {
    "0":
      ".....######.....\n" +
      "....##....##....\n" +
      "...##......##...\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "...##......##...\n" +
      "....##....##....\n" +
      ".....######.....\n",
    "1":
      ".......##.......\n" +
      ".....####.......\n" +
      ".......##.......\n" +
      ".......##.......\n" +
      ".......##.......\n" +
      ".......##.......\n" +
      ".......##.......\n" +
      ".......##.......\n" +
      ".......##.......\n" +
      ".....######.....\n" +
      "................\n",
    "2":
      ".....######.....\n" +
      "...##......##...\n" +
      "..##........##..\n" +
      "..........##....\n" +
      ".........##.....\n" +
      ".......##.......\n" +
      "......##........\n" +
      ".....##.........\n" +
      "...##...........\n" +
      "....##########..\n" +
      "................\n",
    "3":
      ".....######.....\n" +
      "...##......##...\n" +
      "..##........##..\n" +
      "..........##....\n" +
      ".........##.....\n" +
      "......####......\n" +
      ".........##.....\n" +
      "..........##....\n" +
      "..##........##..\n" +
      "...##......##...\n" +
      ".....######.....\n",
    "4":
      "........###.....\n" +
      ".......####.....\n" +
      "......##.##.....\n" +
      ".....##..##.....\n" +
      "....##...##.....\n" +
      "...##....##.....\n" +
      "..##########....\n." +
      "........##......\n" +
      "........##......\n" +
      ".......######...\n",
    "5":
      "....########....\n" +
      "....########....\n" +
      "....##..........\n" +
      "....##..........\n" +
      "....##..........\n" +
      "....##..........\n" +
      "....##..........\n" +
      "....##..........\n" +
      "....######......\n" +
      "....######......\n" +
      "..........##....\n" +
      "..........##....\n" +
      "...........##...\n" +
      "...........##...\n" +
      "...........##...\n" +
      "...........##...\n" +
      "..##.......##...\n" +
      "..##.......##...\n" +
      "...##......##...\n" +
      "...##......##...\n" +
      ".....######.....\n",
    "6":
      ".......####.....\n" +
      "......##........\n" +
      ".....##.........\n" +
      "....##..........\n" +
      "...##...........\n" +
      "..######........\n" +
      "..##...##.......\n" +
      "..##....##......\n" +
      "..##.....##.....\n" +
      "...##....##.....\n" +
      "....####........\n",
    "7":
      "..##########....\n" +
      "..##......##....\n" +
      "........##......\n" +
      ".......##.......\n" +
      "......##........\n" +
      "......##........\n" +
      ".....##.........\n" +
      ".....##.........\n" +
      "....##..........\n" +
      "....##..........\n" +
      "....##..........\n",
    "8":
      ".....######.....\n" +
      "...##......##...\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "...##......##...\n" +
      "....######......\n" +
      "...##......##...\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "...##......##...\n" +
      ".....######.....\n",
    "9":
      ".....######.....\n" +
      "...##......##...\n" +
      "..##........##..\n" +
      "..##........##..\n" +
      "...##......##...\n" +
      "....#######.....\n" +
      "..........##....\n" +
      ".........##.....\n" +
      "........##......\n" +
      "......###.......\n" +
      ".....##.........\n",
  };
  constructor(charname: string) {
    this.charname = charname;
    this.fontdata = BigChar.fontdatas[charname];
    this.fontdata = this.fontdata.replace(/#/g, charname);
  }
  print(): void {
    console.log(this.fontdata);
  }
}
// bigCharFactory.ts
import { BigChar } from './bigChar';
export class BigCharFactory {
  private pool: Map<string, BigChar> = new Map();
  private static singleton: BigCharFactory = new BigCharFactory();
  private constructor() { }
  public static getInstance(): BigCharFactory {
    return BigCharFactory.singleton;
  }
  public getBigChar(charname: string): BigChar {
    let bc: BigChar = this.pool.get(charname);
    // ts 是单线程的，所以不需要考虑多线程问题， 若为多线程则需要加锁
    if (bc == null) {
      bc = new BigChar(charname);
      this.pool.set(charname, bc);
    }
    return bc;
  }
}
// bigString.ts
import { Factory } from '../abstractFactory/factory';
import { BigChar } from './bigChar';
import { BigCharFactory } from './bigCharFactory';
export class BigString {
  bigchars: BigChar[] = [];
  constructor(public str: string) {
    let factory = BigCharFactory.getInstance();
    str.split('').forEach((char) => {
      this.bigchars.push(factory.getBigChar(char));
    });
  }
  print() {
    this.bigchars.forEach((bigchar) => {
      bigchar.print();
    });
  }
}
// main.ts
import { BigString } from './bigString';
let bs: BigString = new BigString('123');
bs.print();
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\flyweight\main.ts"
.......11.......
.....1111.......
.......11.......
.......11.......
.......11.......
.......11.......
.......11.......
.......11.......
.......11.......
.....111111.....
................

.....222222.....
...22......22...
..22........22..
..........22....
.........22.....
.......22.......
......22........
.....22.........
...22...........
....2222222222..
................

.....333333.....
...33......33...
..33........33..
..........33....
.........33.....
......3333......
.........33.....
..........33....
..33........33..
...33......33...
.....333333.....
```


## 拓展思路的要点

### 对多个地方产生影响
Flyweight 模式的主题是“共享”。那么，在共享实例时应当注意什么呢？首先要想到的是“如果要改变被共享的对象，就会对多个地方产生影响”。也就是说，一个实例的改变会同时反映到所有使用该实例的地方。例如，假设我们改变了示例程序中 BigChar 类的 '3' 所对应的字体数据，那么 BigString 类中使用的所有 '3' 字符的字体（形状）都会发生改变。在编程时，像这样改一个地方会对多个地方产生影响并非总是不好。有些情况下这是好事，有些情况下这是坏事。不管怎样，“修改一个地方会对多个地方产生影响”，这就是共享的特点。

因此，在决定 Flyweight 角色中的字段时，需要精挑细选。只将那些真正应该在多个地方共享的字段定义在 Flyweight 角色中即可。关于这一点，让我们简单地举个例子。假设我们要在示例程序中增加一个功能，实现显示“带颜色的大型文字”。那么此时，颜色信息应当放在哪个类中呢？首先，假设我们将颜色信息放在 BigChar 类中。由于 BigChar 类的实例是被共享的，因此颜色信息也被共享了。也就是说，BigString 类中用到的所有 BigChar 类的实例都带有相同的颜色。如果我们不把颜色信息放在 BigChar 类中，而是将它放在 BigString 类中。那么 BigString 类会负责管理“第三个字符的颜色是红色的”这样的颜色信息。这样一来，我们就可以实现以不同的颜色显示同一个 BigChar 类的实例。

那么两种解决方案到底哪个是正确的呢？关于这个问题，其实并没有绝对的答案。哪些信息应当共享，哪些信息不应当共享，这取决于类的使用目的。设计者在使用 Flyweight 模式共享信息时必须仔细思考应当共享哪些信息。

### Intrinsic 与 Extrinsic
前面讲到的“应当共享的信息和不应当共享的信息”是有专有名词的。应当共享的信息被称作 Intrinsic 信息。Intrinsic 的意思是“本质的”“固有的”。换言之，它指的是不论实例在哪里、不论在什么情况下都不会改变的信息，或是不依赖于实例状态的信息。

在示例程序中，BigChar 的字体数据不论在 BigString 中的哪个地方都不会改变。因此，BigChar 的字体数据属于 Intrinsic 信息。另一方面，不应当共享的信息被称作 Extrinsic 信息。Extrinsic 的意思是“外在的”“非本质的”。也就是说，它是当实例的位置、状况发生改变时会变化的信息，或是依赖于实例状态的信息。在示例程序中，BigChar 的实例在 BigString 中是第几个字符这种信息会根据 BigChar 在 BigString 中的位置变化而发生变化，因此，不应当在 BigChar 中保存这个信息，它属于 Extrinsic 信息。因此，前面提到的是否共享“颜色”信息这个问题，我们也可以换种说法，即应当将“颜色”看作是 Intrinsic 信息还是 Extrinsic 信息。

### 不要让被共享的实例被垃圾回收器回收了
在有垃圾回收的语言中要注意共享内存未被使用时被 GC 的问题。在使用 Flyweight 模式时，我们通常会将共享对象存储在某种集合（如 HashMap 或 List）中，以便重复使用这些对象。然而，如果这些集合中的对象没有被其他任何地方引用，垃圾回收器可能会认为这些对象是垃圾，从而将其回收掉。这会导致共享对象在需要时无法被找到，从而引发程序错误。

为了避免这种情况，我们需要确保共享对象在整个程序生命周期内都被引用。以下是一些常见的解决方案：

1. **强引用**：将共享对象存储在一个全局的集合中，并确保这个集合在程序的整个生命周期内都存在。这种方法简单直接，但可能会导致内存泄漏，因为共享对象永远不会被回收。

2. **弱引用**：使用弱引用（WeakReference）来存储共享对象。弱引用允许垃圾回收器在没有其他强引用时回收对象，从而避免内存泄漏。Java 提供了 `WeakHashMap` 类，可以用来存储弱引用的键值对。

3. **引用计数**：通过引用计数来管理共享对象的生命周期。每当一个对象被引用时，增加计数；每当一个引用被释放时，减少计数。当计数为零时，表示该对象不再被使用，可以安全地回收。

4. **定期清理**：定期检查集合中的对象，移除那些不再被使用的对象。这种方法需要额外的逻辑来判断对象是否仍然被使用，但可以有效地管理内存。


### 内存之外的其它资源
在示例程序中，我们了解到共享实例可以减少内存使用量。一般来说，共享实例可以减少所需资源的使用量。这里的资源指的是计算机中的资源，而内存是资源中的一种。时间也是一种资源。使用 new 关键字生成实例会花费时间。通过 Flyweight 模式共享实例可以减少使用 new 关键字生成实例的次数。这样，就可以提高程序运行速度。文件句柄（文件描述符）和窗口句柄等也都是一种资源。在操作系统中，可以同时使用的文件句柄和窗口句柄是有限制的。因此，如果不共享实例，应用程序在运行时很容易就会达到资源极限而导致崩溃。

## 相关的设计模式
+ Proxy 模式
+ Composite 模式
+ Singleton 模式
