---
title: Mediator 模式
date: 2024-10-26
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 简单化
prev: ./facade
next: ./observer
---

## 为什么使用此类

请大家想象一下一个乱糟糟的开发小组的工作状态。小组中的 10 个成员虽然一起协同工作，但是意见难以统一，总是互相指挥，导致工作进度始终滞后。不仅如此，他们还十分在意编码细节，经常为此争执不下。
<!-- more -->
这时，我们就需要一个中立的仲裁者站出来说：“各位，请大家将情况报告给我，我来负责仲裁。我会从团队整体出发进行考虑，然后下达指示，但我不会评价大家的工作细节。”这样，当出现争执时大家就会找仲裁者进行商量，仲裁者会负责统一大家的意见。

最后，整个团队的交流过程就变为了组员向仲裁者报告，仲裁者向组员下达指示。组员之间不再相互询问和相互指示。

## 示例代码

[源地址](https://github.com/RefactoringGuru/design-patterns-typescript/blob/main/src/Mediator/RealWorld/index.ts)

@startuml
interface Mediator {
  +notify(sender: object, event: string, payload?: string): void
}

class User {
  +name: string
  -mediator: Mediator
  +User(name: string, mediator: Mediator)
  +receiveMessage(message: string): void
  +publishMessage(message: string): void
}

class ChatAppMediator {
  -users: User[]
  +notify(sender: object, event: string, payload?: string): void
}

User --> Mediator
ChatAppMediator ..|> Mediator
User --> ChatAppMediator : mediator
@enduml
@startuml
actor User1
actor User2
actor User3
participant ChatAppMediator

User1 -> ChatAppMediator: notify('subscribe')
ChatAppMediator -> User1: Subscribing Lightning

User2 -> ChatAppMediator: notify('subscribe')
ChatAppMediator -> User2: Subscribing Doc

User3 -> ChatAppMediator: notify('subscribe')
ChatAppMediator -> User3: Subscribing Mater

User1 -> ChatAppMediator: notify('publish', 'Catchaw')
ChatAppMediator -> User2: Message received by Doc: Catchaw
ChatAppMediator -> User3: Message received by Mater: Catchaw

User2 -> ChatAppMediator: notify('publish', 'Ey kid')
ChatAppMediator -> User1: Message received by Lightning: Ey kid
ChatAppMediator -> User3: Message received by Mater: Ey kid

User3 -> ChatAppMediator: notify('publish', 'Tomato')
ChatAppMediator -> User1: Message received by Lightning: Tomato
ChatAppMediator -> User2: Message received by Doc: Tomato
@enduml
```ts
/**
 * EN: Real World Example for the Mediator design pattern
 *
 * Need: To have a messaging application to notify groups of people. Users
 * should not know about each other.
 *
 * Solution: Create a mediator to manage subscriptions and messages
 */

/**
 * EN: Extending the Mediator interface to have a payload to include messages
 */
interface Mediator {
  notify(sender: object, event: string, payload?: string): void;
}

/**
* EN: The user plays the role of the independent component. It has an
* instance of the mediator.
*/
class User {
  constructor(public name: string, private mediator: Mediator) {
    this.mediator.notify(this, 'subscribe');
  }

  receiveMessage(message: string) {
    console.log(`Message received by ${this.name}: ${message}`);
  }

  publishMessage(message: string) {
    this.mediator.notify(this, 'publish', message);
  }
}

/**
* EN: The app is the concrete Mediator and implements all the events that
* collaborators can notify: subscribe and publish
*/
class ChatAppMediator implements Mediator {
  private users: User[] = [];

  public notify(sender: object, event: string, payload?: string): void {
    if (event === 'subscribe') {
      const user = sender as User;
      console.log(`Subscribing ${user.name}`);
      this.users.push(user);
    }

    if (event === 'publish') {
      console.log(`Publishing message "${payload}" to the group`);
      const usersExcludingSender = this.users.filter(u => u !== sender);
      for (const user of usersExcludingSender) {
        user.receiveMessage(payload);
      }
    }
  }
}

/**
* EN: The client code. Creating a user automatically subscribes them to the
* group.
*/
const chatAppMediator = new ChatAppMediator();
const user1 = new User('Lightning', chatAppMediator);
const user2 = new User('Doc', chatAppMediator);
const user3 = new User('Mater', chatAppMediator);

user1.publishMessage('Catchaw');
user2.publishMessage('Ey kid');
user3.publishMessage('Tomato');
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\mediator\main.ts"
Subscribing Lightning
Subscribing Doc
Subscribing Mater
Publishing message "Catchaw" to the group
Message received by Doc: Catchaw
Message received by Mater: Catchaw
Publishing message "Ey kid" to the group
Message received by Lightning: Ey kid
Message received by Mater: Ey kid
Publishing message "Tomato" to the group
Message received by Lightning: Tomato
Message received by Doc: Tomato
```

## 拓展思路的要点
### 当发生分散灾难时
示例程序中的 `ChatAppMediator` 类的 `notify` 方法稍微有些复杂。如果发生需求变更，该方法中很容易发生 Bug。不过这并不是什么问题。因为即使 `notify` 方法中发生了 Bug，由于其他地方并没有控制消息发布和订阅的逻辑处理，因此只要调试该方法就能很容易地找出 Bug 的原因。请试想一下，如果这段逻辑分散在 `User` 类中，那么无论是编写代码还是调试代码和修改代码，都会非常困难。通常情况下，面向对象编程可以帮助我们分散处理，避免处理过于集中，也就是说可以“分而治之”。但是在本章中的示例程序中，把处理分散在各个类中是不明智的。如果只是将应当分散的处理分散在各个类中，但是没有将应当集中的处理集中起来，那么这些分散的类最终只会导致灾难。

在这个示例程序中，`ChatAppMediator` 类作为中介者（Mediator），负责管理和协调各个用户（User）的交互。`notify` 方法集中处理了所有消息的发布和订阅逻辑，这样可以确保逻辑的一致性和可维护性。如果将这些逻辑分散到各个用户类中，不仅会增加代码的复杂性，还会使得调试和维护变得更加困难。因此，将这些逻辑集中在中介者类中是更明智的选择。

### 通信线路的增加
假设现在有 A 和 B 这 2 个实例，它们之间互相通信（相互调用方法），那么通信线路有两条，即 A-B 和 A-B。如果是有 A、B 和 C 这 3 个实例，那么就会有 6 条通信线路，即 A-B、A-C、B-C、B-A 和 C-A。如果有 4 个实例，会有 12 条通信线路；5 个实例就会有 20 条通信线路，而 6 个实例则会有 30 条通信线路。如果存在很多这样的互相通信的实例，那么程序结构会变得非常复杂。可能会有读者认为，如果实例很少就不需要 Mediator 模式了。但是需要考虑到的是，即使最初实例很少，很可能随着需求变更实例数量会慢慢变多，迟早会暴露出问题。

### 哪些角色可以复用
ConcreteColleague 角色可以复用，但 ConcreteMediator 角色很难复用。例如，假设我们现在需要制作另外一个对话框。这时，我们可将扮演 ConcreteColleague 角色的 colleagueButton 类、 colleagueTextField 类和 colleagueCheckbox 类用于新的对话框中。这是因为在 ConcreteColleague 角色中并没有任何依赖于特定对话框的代码。在示例程序中，依赖于特定应用程序的部分都被封装在扮演 ConcreteMediator 角色的 LoginFrame 类中，依赖于特定应用程序就意味着难以复用。因此， LoginFrame 类很难在其他对话框中被复用。

## 相关的设计模式
+ Facade 模式
+ Observer 模式
