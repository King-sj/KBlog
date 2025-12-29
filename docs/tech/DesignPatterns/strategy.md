---
title: Strategy 模式
date: 2024-10-25
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 分开考虑
  - 整体的替换算法
prev: ./bridge
next: ./composite
---

## 使用此设计模式的理由

在这个示例程序中，我们使用了策略模式（Strategy Pattern）来实现不同的猜拳策略。策略模式的主要优点包括：

1. **易于扩展**：可以很容易地添加新的策略，而不需要修改现有的代码。
2. **提高代码的可读性和可维护性**：将不同的算法封装在独立的类中，使得代码更加清晰。
3. **减少重复代码**：通过使用策略模式，可以避免在多个地方重复相同的算法逻辑。

## 示例程序
下面我们来看一段使用了 strategy 模式的示例程序。这段示例程序的功能是让电脑玩“猜拳"游戏。

我们考虑了两种猜拳的策略。第一种策略是“如果这局猜拳获胜，那么下一局也出一样的手势" (WinningStrategy), 这是一种稍微有些笨的策略；另外一种策略是“根据上一局的手势从概率上计算出下一局的手势"（ ProbStrategy ）。

@startuml
class Hand {
  - static hand: Hand[]
  - static names: string[]
  - handValue: HandValue
  + static getHand(handValue: HandValue): Hand
  + isStrongerThan(h: Hand): boolean
  + isWeakerThan(h: Hand): boolean
  - fight(h: Hand): number
  + toString(): string
}

enum HandValue {
  GUU
  CHO
  PAA
}

interface Strategy {
  + nextHand(): Hand
  + study(win: boolean): void
}

class WinningStrategy extends Strategy{
  - won: boolean
  - prevHand: Hand
  + nextHand(): Hand
  + study(win: boolean): void
}

class ProbStrategy extends Strategy{
  - prevHandValue: number
  - currentHandValue: number
  - history: number[][]
  + nextHand(): Hand
  - getSum(hv: number): number
  + study(win: boolean): void
}

class Player {
  - name: string
  - strategy: Strategy
  - wincount: number
  - losecount: number
  - gamecount: number
  + nextHand(): Hand
  + win(): void
  + lose(): void
  + even(): void
  + toString(): string
}

HandValue o-- Hand : use
Strategy --o Hand : use
Player --o Strategy : use
@enduml

```ts
// hand.ts
export enum HandValue {
  GUU = 0,
  CHO = 1,
  PAA = 2,
}
export class Hand {
  //NOTE - 使用了单例模式
  private static readonly hand: Hand[] = [
    new Hand(HandValue.GUU),
    new Hand(HandValue.CHO),
    new Hand(HandValue.PAA),
  ];
  private static readonly names: string[] = ['石头', '剪刀', '布'];
  private handValue: HandValue;
  private constructor(handValue: HandValue) {
    this.handValue = handValue;
  }
  static getHand(handValue: HandValue): Hand {
    return this.hand[handValue];
  }
  isStrongerThan(h: Hand): boolean {
    return this.fight(h) === 1;
  }
  isWeakerThan(h: Hand): boolean {
    return this.fight(h) === -1;
  }
  private fight(h: Hand): number {
    if (this === h) {
      return 0;
    } else if ((this.handValue + 1) % 3 === h.handValue) {
      return 1;
    } else {
      return -1;
    }
  }
  toString(): string {
    return Hand.names[this.handValue];
  }
}
// main.ts
import { Player } from "./player";
import { WinningStrategy } from "./winningStrategy";
import { ProbStrategy } from "./probStrategy";

const player1 = new Player("Taro", new WinningStrategy());
const player2 = new Player("Hana", new ProbStrategy());
for (let i = 0; i < 10000; i++) {
  const nextHand1 = player1.nextHand();
  const nextHand2 = player2.nextHand();
  if (nextHand1.isStrongerThan(nextHand2)) {
    console.log(`Winner: ${player1.toString()}`);
    player1.win();
    player2.lose();
  } else if (nextHand2.isStrongerThan(nextHand1)) {
    console.log(`Winner: ${player2.toString()}`);
    player1.lose();
    player2.win();
  } else {
    console.log("Even...");
    player1.even();
    player2.even();
  }
}
console.log("Total result:");
console.log(player1.toString());
console.log(player2.toString());
// Output
// player.ts
import { Hand } from './hand';
import { Strategy } from './strategy';
export class Player {
  private name: string;
  private strategy: Strategy;
  private wincount = 0;
  private losecount = 0;
  private gamecount = 0;
  constructor(name: string, strategy: Strategy) {
    this.name = name;
    this.strategy = strategy;
  }
  nextHand(): Hand {
    return this.strategy.nextHand();
  }
  win(): void {
    this.strategy.study(true);
    this.wincount++;
    this.gamecount++;
  }
  lose(): void {
    this.strategy.study(false);
    this.losecount++;
    this.gamecount++;
  }
  even(): void {
    this.gamecount++;
  }
  toString(): string {
    return `[${this.name}:${this.gamecount} games, ${this.wincount} win, ${this.losecount} lose]`;
  }
}
// probStrategy.ts
import { Hand } from './hand';
import { Strategy } from './strategy';
export class ProbStrategy implements Strategy {
  private prevHandValue = 0;
  private currentHandValue = 0;
  private history: number[][] = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  constructor() {}
  nextHand(): Hand {
    const bet = Math.floor(Math.random() * this.getSum(this.currentHandValue));
    let handvalue = 0;
    if (bet < this.history[this.currentHandValue][0]) {
      handvalue = 0;
    } else if (bet < this.history[this.currentHandValue][0] + this.history[this.currentHandValue][1]) {
      handvalue = 1;
    } else {
      handvalue = 2;
    }
    this.prevHandValue = this.currentHandValue;
    this.currentHandValue = handvalue;
    return Hand.getHand(handvalue);
  }
  private getSum(hv: number): number {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      sum += this.history[hv][i];
    }
    return sum;
  }
  study(win: boolean): void {
    if (win) {
      this.history[this.prevHandValue][this.currentHandValue]++;
    } else {
      this.history[this.prevHandValue][(this.currentHandValue + 1) % 3]++;
      this.history[this.prevHandValue][(this.currentHandValue + 2) % 3]++;
    }
  }
}
// strategy.ts
import { Hand } from './hand';
export interface Strategy {
  nextHand(): Hand;
  study(win: boolean): void;
}
// winningStrategy.ts
import { Hand } from './hand';
import { Strategy } from './strategy';
export class WinningStrategy implements Strategy {
  private won = false;
  private prevHand: Hand;
  constructor() {}
  nextHand(): Hand {
    if (!this.won) {
      this.prevHand = Hand.getHand(Math.floor(Math.random() * 3));
    }
    return this.prevHand;
  }
  study(win: boolean): void {
    this.won = win;
  }
}
```

## 运行结果
```sh
...(省略)
Winner: [Hana:9991 games, 3567 win, 3049 lose]
Winner: [Hana:9992 games, 3568 win, 3049 lose]
Even...
Winner: [Hana:9994 games, 3569 win, 3049 lose]
Even...
Even...
Winner: [Hana:9997 games, 3570 win, 3049 lose]
Winner: [Hana:9998 games, 3571 win, 3049 lose]
Winner: [Hana:9999 games, 3572 win, 3049 lose]
Total result:
[Taro:10000 games, 3049 win, 3573 lose]
[Hana:10000 games, 3573 win, 3049 lose]
```

## 拓展思路的要点

### 为什么要特意编写 Strategy
通常在编程时算法会被写在具体方法中。Strategy 模式却特意将算法与其他部分分离开来，只是定义了与算法相关的接口（API），然后在程序中以委托的方式来使用算法。

这样看起来程序好像变复杂了，其实不然。例如，当我们想要通过改善算法来提高算法的处理速度时，如果使用了 Strategy 模式，就不必修改 Strategy 角色的接口（API）了，仅仅修改 ConcreteStrategy 角色即可。而且，使用委托这种弱关联关系可以很方便地整体替换算法。例如，如果想比较原来的算法与改进后的算法的处理速度有多大区别，简单地替换下算法即可进行测试。

使用 Strategy 模式编写象棋程序时，可以方便地根据棋手的选择切换 AI 例程的水平。

### 程序运行中也可以切换策略
如果使用 Strategy 模式，在程序运行中也可以切换角色。例如，在内存容量少的运行环境中可以使用 SlowButLessMemoryStrategy（速度慢但省内存的策略），而在内存容量多的运行环境中则可以使用 FastButMoreMemoryStrategy（速度快但耗内存的策略）。

此外，还可以用某种算法去“验算”另外一种算法。例如，假设要在某个表格计算软件的开发版本中进行复杂的计算。这时，我们可以准备两种算法，即“高速但计算上可能有 Bug 的算法”和“低速但计算准确的算法”，然后让后者去验算前者的计算结果。

## 相关的设计模式
+ Flyweight 模式
+ Abstract Factory 模式
+ State 模式
