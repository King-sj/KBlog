---
title: chainOfResponsibility 模式
date: 2024-10-25
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 推卸责任
prev: ./visitor
next: false
---

“推卸责任"听起来有些贬义的意思，但是有时候也确实存在需要“推卸责任"的情况。例如，当外部请求程序进行某个处理，但程序暂时无法直接决定由哪个对象负责处理时，就需要推卸责任。这种情况下，我们可以考虑将多个对象组成一条职责链，然后按照它们在职责链上的顺序一个一个地找出到底应该谁来负责处理。
<!-- more -->
当一个人被要求做什么事情时，如果他可以做就自己做，如果不能做就将“要求"转给另外一个人。下一个人如果可以自己处理，就自己做；如果也不能自己处理，就再转给另外一个人““这就是 Chain Of Responsibility 模式。

### 为什么使用此类

使用 Chain of Responsibility 模式有以下几个优点：

1. **解耦请求发送者和接收者**：发送者无需知道哪个对象会处理请求。
2. **动态组合职责链**：可以在运行时动态地改变职责链的结构。
3. **增加灵活性**：可以很容易地添加新的处理者而不影响现有代码。

## 示例代码

在这个示例中，我们使用了 Chain of Responsibility 模式来处理一系列的请求。每个请求都会沿着职责链传递，直到有一个对象能够处理它。这样做的好处是请求的发送者和接收者解耦，发送者无需知道哪个对象会处理请求。

@startuml
abstract class Support {
  - name: string
  - next: Support
  + setNext(next: Support): Support
  + support(trouble: Trouble): void
  # resolve(trouble: Trouble): boolean
  # done(trouble: Trouble): void
  # fail(trouble: Trouble): void
}

class NoSupport extends Support{
  + resolve(trouble: Trouble): boolean
}

class LimitSupport extends Support{
  - limit: number
  + resolve(trouble: Trouble): boolean
}

class OddSupport extends Support{
  + resolve(trouble: Trouble): boolean
}

class SpecialSupport extends Support{
  - number: number
  + resolve(trouble: Trouble): boolean
}

class Trouble {
  - number: number
  + getNumber(): number
  + toString(): string
}
@enduml

@startuml
actor Client
Client -> NoSupport: support(trouble)
NoSupport -> LimitSupport: support(trouble)
LimitSupport -> SpecialSupport: support(trouble)
SpecialSupport -> OddSupport: support(trouble)
SpecialSupport <- OddSupport
LimitSupport <- SpecialSupport
NoSupport <- LimitSupport
Client <- NoSupport
@enduml

```ts
// limitSupport.ts
import { Support } from './support';
import { Trouble } from './trouble';
export class LimitSupport extends Support {
  private limit: number;
  constructor(name: string, limit: number) {
    super(name);
    this.limit = limit;
  }
  protected resolve(trouble: Trouble): boolean {
    if (trouble.getNumber() < this.limit) {
      return true;
    }
    return false;
  }
}
// main.ts
import { NoSupport } from "./NoSupport";
import { LimitSupport } from "./LimitSupport";
import { OddSupport } from "./OddSupport";
import { SpecialSupport } from "./specialSupport";
import { Support } from "./support";
import { Trouble } from "./trouble";
let alice: Support = new NoSupport("Alice");
let bob: Support = new LimitSupport("Bob", 100);
let charlie: Support = new SpecialSupport("Charlie", 429);
let diana: Support = new LimitSupport("Diana", 200);
let elmo: Support = new OddSupport("Elmo");
let fred: Support = new LimitSupport("Fred", 300);

alice.setNext(bob).setNext(charlie).setNext(diana).setNext(elmo).setNext(fred);

for (let i = 0; i < 500; i += 33) {
  alice.support(new Trouble(i));
}
// NoSupport.ts
import { Support } from './support';
import { Trouble } from './trouble';
export class NoSupport extends Support {
  constructor(name: string) {
    super(name);
  }
  resolve(trouble: Trouble): boolean {
    return false;
  }
}
// OddSupport.ts
import { Support } from './support';
export class OddSupport extends Support {
  resolve(trouble) {
    if (trouble.getNumber() % 2 === 1) {
      return true;
    }
    else {
      return false;
    }
  }
}
// specialSupport.ts
import { Support } from './support';
import { Trouble } from './trouble';
export class SpecialSupport extends Support {
  private number: number;
  constructor(name: string, number: number) {
    super(name);
    this.number = number;
  }
  protected resolve(trouble: Trouble): boolean {
    if (trouble.getNumber() === this.number) {
      return true;
    }
    return false;
  }
}
// support.ts
import { Trouble } from './trouble';
export abstract class Support {
  private next: Support;
  constructor(private name: string) {
    this.name = name;
  }
  setNext(next: Support): Support {
    this.next = next;
    return next;
  }
  support(trouble: Trouble): void {
    if (this.resolve(trouble)) {
      this.done(trouble);
    } else if (this.next != undefined && this.next !== null) {
      this.next.support(trouble);
    } else {
      this.fail(trouble);
    }
  }
  toString(): string {
    return `[${this.name}]`;
  }
  protected abstract resolve(trouble: Trouble): boolean;
  protected done(trouble: Trouble): void {
    console.log(`${trouble} is resolved by ${this}.`);
  }
  protected fail(trouble: Trouble): void {
    console.log(`${trouble} cannot be resolved.`);
  }
}
// trouble.ts
export class Trouble {
  private number: number;
  constructor(number: number) {
    this.number = number;
  }
  getNumber(): number {
    return this.number;
  }
  toString(): string {
    return `[Trouble ${this.number}]`;
  }
}

```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\chainOfResponsibility\main.ts"
[Trouble 0] is resolved by [Bob].
[Trouble 33] is resolved by [Bob].
[Trouble 66] is resolved by [Bob].
[Trouble 99] is resolved by [Bob].
[Trouble 132] is resolved by [Diana].
[Trouble 165] is resolved by [Diana].
[Trouble 198] is resolved by [Diana].
[Trouble 231] is resolved by [Elmo].
[Trouble 264] is resolved by [Fred].
[Trouble 297] is resolved by [Elmo].
[Trouble 330] cannot be resolved.
[Trouble 363] is resolved by [Elmo].
[Trouble 396] cannot be resolved.
[Trouble 429] is resolved by [Charlie].
[Trouble 462] cannot be resolved.
[Trouble 495] is resolved by [Elmo].
```

## 相关的设计模式
+ Composite 模式
+ Command 模式
