---
title: Observer 模式
date: 2024-10-26
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 管理状态
prev: ./mediator
next: ./memento
---

## 为什么使用观察者模式

观察者模式非常适合用于需要自动更新的场景。例如，在图形用户界面（GUI）应用程序中，当数据模型发生变化时，所有显示该数据的视图都需要自动更新。通过使用观察者模式，我们可以将这些视图注册为观察者，当数据模型发生变化时，它们会自动收到通知并更新显示。

## 示例代码

在这个示例中，我们展示了如何使用观察者模式来管理状态变化。观察者模式定义了一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新。以下是 TypeScript 实现的代码示例：

@startuml
interface Observer {
  +update(generator: NumberGenerator): void
}

abstract class NumberGenerator {
  +addObserver(observer: Observer): void
  +deleteObserver(observer: Observer): void
  +notifyObservers(): void
  +getNumber(): number
  +execute(): void
}

class DigitObserver implements Observer {
  +update(generator: NumberGenerator): void
}

class GraphObserver implements Observer {
  +update(generator: NumberGenerator): void
}

class RandomNumberGenerator extends NumberGenerator {
  -number: number
  +getNumber(): number
  +execute(): void
}

NumberGenerator o-- Observer
@enduml


```ts
// DigitObserver.ts
import { NumberGenerator } from './numberGenerator';
import { Observer } from './observer';
export class DigitObserver implements Observer {
  update(number: NumberGenerator): void {
    console.log(`DigitObserver: ${number.getNumber()}`);
  }
}

// graphObserver.ts
import { Observer } from './observer';
import { NumberGenerator } from './numberGenerator';
export class GraphObserver implements Observer {
  update(generator: NumberGenerator): void {
    const count = generator.getNumber();
    let graph = '';
    for (let i = 0; i < count; i++) {
      graph += '*';
    }
    console.log(`GraphObserver: \n${graph}\n ${generator.getNumber()}\n${graph} `);
  }
}

// main.ts
import { NumberGenerator } from './numberGenerator';
import { Observer } from './observer';
import { RandomNumberGenerator } from './randomNumberGenerator';
import { DigitObserver } from './DigitObserver';
import { GraphObserver } from './graphObserver';
const generator: NumberGenerator = new RandomNumberGenerator();
const observer1 = new DigitObserver();
const observer2 = new GraphObserver();
generator.addObserver(observer1);
generator.addObserver(observer2);
generator.execute();

// numberGenerator.ts
import { Observer } from './observer';
export abstract class NumberGenerator {
  private observers: Observer[] = [];
  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }
  public deleteObserver(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }
  public notifyObservers(): void {
    this.observers.forEach((o) => o.update(this));
  }
  public abstract getNumber(): number;
  public abstract execute(): void;
}

// observer.ts
import {NumberGenerator} from './numberGenerator';
export interface Observer {
  update(generator: NumberGenerator): void;
}

// randomNumberGenerator.ts
import {NumberGenerator} from './numberGenerator';
export class RandomNumberGenerator extends NumberGenerator {
  private number: number;
  constructor() {
    super();
    this.number = 0;
  }
  getNumber(): number {
    return this.number;
  }
  execute(): void {
    for (let i = 0; i < 20; i++) {
      this.number = Math.floor(Math.random() * 50);
      this.notifyObservers();
    }
  }
}
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\observer\main.ts"
DigitObserver: 13
GraphObserver:
*************
 13
*************
DigitObserver: 43
GraphObserver:
*******************************************
 43
*******************************************
DigitObserver: 46
GraphObserver:
**********************************************
 46
**********************************************
DigitObserver: 18
GraphObserver:
******************
 18
******************
DigitObserver: 20
GraphObserver:
********************
 20
********************
DigitObserver: 49
GraphObserver:
*************************************************
 49
*************************************************
DigitObserver: 25
GraphObserver:
*************************
 25
*************************
DigitObserver: 26
GraphObserver:
**************************
 26
**************************
DigitObserver: 37
GraphObserver:
*************************************
 37
*************************************
DigitObserver: 2
GraphObserver:
**
 2
**
DigitObserver: 10
GraphObserver:
**********
 10
**********
DigitObserver: 0
GraphObserver:

 0

DigitObserver: 11
GraphObserver:
***********
 11
***********
DigitObserver: 13
GraphObserver:
*************
 13
*************
DigitObserver: 16
GraphObserver:
****************
 16
****************
DigitObserver: 28
GraphObserver:
****************************
 28
****************************
DigitObserver: 22
GraphObserver:
**********************
 22
**********************
DigitObserver: 30
GraphObserver:
******************************
 30
******************************
DigitObserver: 44
GraphObserver:
********************************************
 44
********************************************
DigitObserver: 3
GraphObserver:
***
 3
***
```

## 拓展思路的要点

### 这里也出现了可替换性
在设计模式中，可替换性是指一个对象可以被另一个具有相同接口的对象替换，而不影响系统的功能。在观察者模式中，观察者（Observer）和被观察者（Subject）之间的关系是松耦合的，这意味着我们可以轻松地替换观察者或被观察者，而不会影响系统的其他部分。

### Observer 的顺序
Subject 角色（被观察对象）中注册有多个 Observer 角色。在示例程序的 `notifyObservers` 方法中，先注册的 Observer 的 `update` 方法会先被调用。通常，在设计 ConcreteObserver 角色的类时，需要注意这些 Observer 的 `update` 方法的调用顺序，不能因为方法的调用顺序发生改变而产生问题。例如，在示例程序中，绝不能因为先调用 `DigitObserver` 的 `update` 方法后调用 `GraphObserver` 的 `update` 方法而导致应用程序不能正常工作。当然，通常，只要保持各个类的独立性，就不会发生上面这种类的依赖关系混乱的问题。不过，我们还需要注意下面将要提到的情况。

### 当 Observer 的行为会对被观察对象产生影响时
当观察者的行为会对被观察对象产生影响时，我们需要特别小心，以避免循环依赖和无限递归。例如，一个观察者在接收到通知后修改了被观察对象的状态，这可能会导致被观察对象再次通知所有观察者，从而引发无限循环。为了解决这个问题，我们可以引入一个标志位来跟踪通知状态，或者使用更复杂的事件处理机制。

### 传递更新信息的方式
在观察者模式中，传递更新信息的方式有多种选择。最简单的方法是直接调用观察者的更新方法，并将被观察对象自身作为参数传递。另一种方法是传递具体的更新信息，例如事件对象或数据包。这种方法可以减少观察者对被观察对象的依赖，从而提高系统的灵活性和可维护性。

### 从观察变为通知
在某些情况下，我们可能需要从观察模式转变为通知模式。例如，当系统中有大量的观察者时，逐个通知每个观察者可能会导致性能问题。此时，我们可以考虑使用事件总线或消息队列来集中处理通知，从而提高系统的性能和可扩展性。

### MVC (Model/View/Controller)
观察者模式在 MVC 架构中得到了广泛应用。模型（Model）作为被观察对象，视图（View）作为观察者，当模型的状态发生变化时，视图会自动更新。控制器（Controller）负责协调模型和视图之间的交互。通过使用观察者模式，MVC 架构实现了视图和模型的松耦合，从而提高了系统的可维护性和可扩展性。

## 相关的设计模式
+ Mediator 模式
