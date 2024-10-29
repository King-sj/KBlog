---
title: Memento 模式
date: 2024-10-28
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 管理状态
prev: ./observer
next: ./state
---

## 为什么使用 Memento 模式

Memento 模式的主要目的是在不破坏封装性的前提下，捕获和恢复对象的内部状态。它在以下情况下特别有用：

- 需要保存和恢复对象的多个状态。
- 需要在对象状态变化时进行撤销操作。
- 需要在不暴露对象实现细节的情况下保存对象状态。


## 示例代码

在这个示例中，我们使用了 Memento 模式来管理 `Gamer` 对象的状态。Memento 模式允许我们在不暴露对象实现细节的情况下保存和恢复对象的状态。以下是示例代码：


@startuml
class Gamer {
  - money: number
  - fruits: string[]
  + getMoney(): number
  + bet(): void
  + createMemento(): Memento
  + restoreMemento(memento: Memento): void
  + toString(): string
  - getFruit(): string
}

class Memento {
  + money: number
  + fruits: string[]
  + getMoney(): number
  + addFruit(fruit: string): void
  + getFruits(): string[]
}

Gamer --> Memento
@enduml

@startuml
actor Client
Client -> Gamer: bet()
Gamer -> Gamer: createMemento()
Gamer -> Memento: new Memento()
Gamer -> Memento: addFruit(fruit)
Gamer -> Client: return Memento

Client -> Gamer: restoreMemento(memento)
Gamer -> Memento: getMoney()
Gamer -> Memento: getFruits()
@enduml


```ts
// gamer.ts
import { Memento } from './memento';
export class Gamer {
  private money: number;
  private fruits: string[];
  private static fruitsName: string[] = ['apple', 'grape', 'banana', 'orange'];
  constructor(money: number) {
    this.money = money;
    this.fruits = [];
  }
  getMoney(): number {
    return this.money;
  }
  bet(): void {
    const dice = Math.floor(Math.random() * 6) + 1;
    if (dice === 1) {
      this.money += 100;
      console.log('Money increased');
    } else if (dice === 2) {
      this.money /= 2;
      console.log('Money halved');
    } else if (dice === 6) {
      const f = this.getFruit();
      console.log(`Got fruit: ${f}`);
      this.fruits.push(f);
    } else {
      console.log('Nothing happened');
    }
  }
  createMemento(): Memento {
    const m = new Memento(this.money);
    this.fruits.forEach(f => {
      if (f.startsWith('delicious')) {
        m.addFruit(f);
      }
    });
    return m;
  }
  restoreMemento(memento: Memento): void {
    this.money = memento.money;
    this.fruits = memento.fruits;
  }
  toString(): string {
    return `[money = ${this.money}, fruits = ${this.fruits.join(', ')}]`;
  }
  private getFruit(): string {
    const prefix = Math.random() > 0.5 ? 'delicious ' : '';
    return prefix + Gamer.fruitsName[Math.floor(Math.random() * Gamer.fruitsName.length)];
  }
}
// main.ts
import { Gamer } from './gamer';
let gamer = new Gamer(100);
let memento = gamer.createMemento();
for (let i = 0; i < 100; i++) {
  console.log(`==== ${i}`);
  console.log(`Current: ${gamer.toString()}`);
  gamer.bet();
  console.log(`Money now: ${gamer.getMoney()}`);
  if (gamer.getMoney() > memento.getMoney()) {
    console.log('Money increased, saving current state');
    memento = gamer.createMemento();
  } else if (gamer.getMoney() < memento.getMoney() / 2) {
    console.log('Money halved, restoring to previous state');
    gamer.restoreMemento(memento);
  }
  console.log('');
}
// memento.ts
export class Memento {
  money: number;
  fruits: string[];
  constructor(money: number) {
    this.money = money;
    this.fruits = [];
  }
  public getMoney(): number {
    return this.money;
  }
  public addFruit(fruit: string): void {
    this.fruits.push(fruit);
  }
  public getFruits(): string[] {
    return [...this.fruits];
  }
}
```


## 运行结果
```ts
...(省略)
==== 97
Current: [money = 462.5, fruits = delicious grape, delicious apple, delicious apple, delicious orange, delicious banana, delicious apple, delicious apple, delicious grape, delicious grape, banana, grape, delicious banana]
Money halved
Money now: 231.25
Money halved, restoring to previous state

==== 98
Current: [money = 925, fruits = delicious grape, delicious apple, delicious apple, delicious orange, delicious banana, delicious apple, delicious apple, delicious grape, delicious grape, banana, grape, delicious banana]
Nothing happened
Money now: 925

==== 99
Current: [money = 925, fruits = delicious grape, delicious apple, delicious apple, delicious orange, delicious banana, delicious apple, delicious apple, delicious grape, delicious grape, banana, grape, delicious banana]
Nothing happened
Money now: 925
```

## 拓展思路的要点

### 两种接口和可见性
在 Memento 模式中，通常会有两种接口：宽接口（wide interface）和窄接口（narrow interface）。宽接口提供了对 Memento 对象的所有操作权限，而窄接口则只提供了有限的操作权限。Originator 类使用宽接口来创建和恢复 Memento，而 Caretaker 类则使用窄接口来保存和传递 Memento。通过这种方式，可以确保 Memento 的内部状态不会被外部直接修改，从而保持封装性。

### 需要多少个 Memento
在实际应用中，需要根据具体需求来决定需要保存多少个 Memento。对于一些简单的应用，可能只需要保存一个 Memento 来支持一次撤销操作。而对于一些复杂的应用，可能需要保存多个 Memento 以支持多次撤销操作。需要注意的是，保存过多的 Memento 会占用大量的内存资源，因此需要在性能和功能之间找到一个平衡点。

### Memento 的有效期限是多久
Memento 的有效期限取决于具体的应用场景。在某些情况下，Memento 可能只需要在短时间内有效，例如在用户进行撤销操作之前。而在其他情况下，Memento 可能需要长期保存，例如在应用程序关闭后重新打开时恢复状态。需要根据具体需求来决定 Memento 的有效期限，并在适当的时候清理过期的 Memento 以释放资源。

### 划分 Caretaker 和 Originator 角色的意义
在 Memento 模式中，Caretaker 和 Originator 角色的划分具有重要意义。Caretaker 负责保存和管理 Memento，而 Originator 负责创建和恢复 Memento。通过这种划分，可以将状态保存和恢复的逻辑与业务逻辑分离，从而提高系统的可维护性和可扩展性。

+ 变更为可以多次撤销
  通过保存多个 Memento，可以实现多次撤销操作。Caretaker 可以维护一个 Memento 的栈，每次撤销操作时从栈中弹出一个 Memento 并恢复状态。这样可以支持用户进行多次撤销和重做操作。

+ 变更为不仅可以撤销，还可以将现在的状态保存在文件中
  通过将 Memento 保存到文件中，可以实现持久化存储。这样即使应用程序关闭后重新打开，也可以恢复到之前的状态。Caretaker 可以负责将 Memento 序列化并保存到文件中，以及从文件中读取并反序列化 Memento。

## 相关的设计模式
+ Command 模式
+ Prototype 模式
+ State 模式
