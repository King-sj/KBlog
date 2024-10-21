---
title: 设计模式七大原则
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
prev: ./index
next: ./iterator
---

[[toc]]

类的设计原则有七个，包括：开闭原则、里氏代换原则、迪米特原则（最少知道原则）、单一职责原则、接口分隔原则、依赖倒置原则、组合/聚合复用原则。

<!-- more -->

## 关系

七大原则之间并不是相互孤立的，而是相互关联的。一个原则可以是另一个原则的加强或基础。违反其中一个原则，可能同时违反其他原则。

开闭原则是面向对象可复用设计的基石，其他设计原则是实现开闭原则的手段和工具。

通常，可以将这七个原则分为以下两部分：

- 设计目标：开闭原则、里氏代换原则、迪米特原则
- 设计方法：单一职责原则、接口分隔原则、依赖倒置原则、组合/聚合复用原则

## 开闭原则

+ 对扩展开放
+ 对修改关闭

根据开闭原则，在设计一个系统模块的时候，应该可以在不修改原模块的基础上，扩展其功能。

### 实现方法

1. 使用抽象类和接口：通过定义抽象类和接口，可以在不修改现有代码的情况下，增加新的实现。
2. 使用设计模式：例如策略模式、装饰者模式等，可以在不改变原有代码的情况下，动态地扩展对象的行为。
3. 遵循单一职责原则：确保每个类只有一个职责，这样在扩展功能时，不会影响其他功能。

<!-- some plantuml demo -->

@startuml
title 符合开闭原则
interface AbsServer {
  + serve() : Result
}

class Client {
  - myServer : AbsServer*
  + doSomeThing()
}

class server implements AbsServer {
  + serve() : Result
}
Client --* AbsServer
@enduml

@startuml
title 不符合开闭原则
class Client {
  - myServer : Server*
  + doSomeThing()
}
class server {
  + serve() : Result
}
Client --* server
@enduml

## 里氏代换原则

### 里氏代换原则

+ 里氏代换原则规定子类不得重写父类的普通方法，只能重写父类的抽象方法；即子类可以扩展父类的功能，但是不能改变父类原有的功能。
+ 派生类应当可以替换基类并出现在基类能够出现的任何地方，或者说如果我们把代码中使用基类的地方用它的派生类所代替，代码还能正常工作。

### 实现方法

1. 使用抽象类和接口：确保子类实现父类的抽象方法，而不是重写父类的具体方法。
2. 遵循契约：子类的方法签名应与父类一致，返回类型应与父类相同或是其子类型。
3. 遵循行为一致性：子类应保持父类的行为，不应引入违反父类预期的新行为。

### 示例

@startuml
title 符合里氏代换原则
abstract class Bird {
  + fly() : void
}

class Sparrow extends Bird {
  + fly() : void
}

class BirdWatcher {
  + watch(bird : Bird) : void
}

BirdWatcher --> Bird
@enduml

@startuml
title 不符合里氏代换原则
abstract class Bird {
  + fly() : void
}

class Ostrich extends Bird {
  + fly() : void { throw new UnsupportedOperationException(); }
}

class BirdWatcher {
  + watch(bird : Bird) : void
}

BirdWatcher --> Bird
@enduml

## 迪米特原则
### 迪米特原则

一个实体应当尽量少地与其他实体之间发生相互作用，使得系统功能模块相对独立；降低类之间的耦合度，提高模块的相对独立性。

### 实现方法

1. **引入中介者模式**：通过中介者对象来管理对象之间的交互，减少对象之间的直接依赖。
2. **使用门面模式**：通过门面对象提供统一的接口，隐藏系统的复杂性，减少对象之间的直接交互。
3. **限制公开方法**：尽量减少类的公开方法，避免不必要的外部依赖。

## 单一职责原则

+ 一个类只对应一个职责，其职责是引起该类变化的原因。
+ 如果一个类需要改变，改变它的理由永远只有一个。如果存在多个改变它的理由，就需要重新设计该类。

### 实现方法

1. **职责分离**：将不同的职责分离到不同的类中，每个类只负责一个职责。
2. **模块化设计**：通过模块化设计，将不同的功能模块分开，确保每个模块只负责一个功能。
3. **重构**：在发现类有多个职责时，及时进行重构，将不同的职责分离到不同的类中。

### 示例

```typescript
// 不符合单一职责原则的类
class User {
  login() {
    // 登录逻辑
  }

  register() {
    // 注册逻辑
  }

  displayProfile() {
    // 显示用户信息逻辑
  }
}

// 符合单一职责原则的类
class AuthService {
  login() {
    // 登录逻辑
  }

  register() {
    // 注册逻辑
  }
}

class UserProfile {
  displayProfile() {
    // 显示用户信息逻辑
  }
}
```

## 接口隔离原则

+ 不应强迫用户依赖他们不使用的接口。
+ 一个类对另一个类的依赖应该建立在最小的接口上。

简单来说，使用多个专门的接口比使用单个通用接口要好得多。
## 依赖倒置原则

高层模块不应该依赖低层模块，二者都应该依赖其抽象。抽象不应该依赖细节，细节应该依赖抽象。核心思想是：面向接口编程，而不是面向实现编程。

### 实现方法

1. **使用接口和抽象类**：定义接口或抽象类，让高层模块依赖这些抽象，而不是具体实现。
2. **依赖注入**：通过构造函数注入、属性注入或方法注入，将具体实现传递给高层模块。
3. **工厂模式**：使用工厂模式创建对象，避免高层模块直接依赖具体类。

### 示例

```typescript
// 定义抽象接口
interface IWorker {
  work(): void;
}

// 具体实现
class Worker implements IWorker {
  work() {
    console.log("Working...");
  }
}

// 高层模块依赖抽象接口
class Manager {
  private worker: IWorker;

  constructor(worker: IWorker) {
    this.worker = worker;
  }

  manage() {
    this.worker.work();
  }
}

// 使用依赖注入
const worker = new Worker();
const manager = new Manager(worker);
manager.manage();
```

## 组合/聚合复用原则

**尽量使用组合/聚合，不要使用类继承。**

如果使用继承，会导致父类的任何变换都可能影响到子类的行为，所以优先使用组合的方式代替继承的方式。

### 实现方法

1. **使用组合**：通过在类中包含其他类的实例来实现功能，而不是通过继承。
2. **使用聚合**：通过在类中引用其他类的实例来实现功能，而不是通过继承。
3. **接口和抽象类**：通过接口和抽象类定义行为，然后在具体类中实现这些行为。

### 示例

```typescript
// 使用继承的方式
class Engine {
  start() {
    console.log("Engine started");
  }
}

class Car extends Engine {
  drive() {
    this.start();
    console.log("Car is driving");
  }
}

// 使用组合的方式
class Engine {
  start() {
    console.log("Engine started");
  }
}

class Car {
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  drive() {
    this.engine.start();
    console.log("Car is driving");
  }
}

const engine = new Engine();
const car = new Car(engine);
car.drive();
```

## 总结

- **开闭原则**：对扩展开放，对修改关闭。
- **里氏代换原则**：子类可以替换父类，且程序行为不变。
- **迪米特原则**：尽量减少类之间的耦合。
- **单一职责原则**：一个类只负责一个职责。
- **接口隔离原则**：使用多个专门的接口，而不是一个通用接口。
- **依赖倒置原则**：高层模块不依赖低层模块，二者都依赖抽象。
- **组合/聚合复用原则**：优先使用组合/聚合，而不是继承。

