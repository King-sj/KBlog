---
title: Factory Method 模式
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 工厂方法
  - 交给子类
prev: ./template_method
next: ./singleton
---

[[toc]]

在 Factory Method 模式中，我们定义一个用于创建对象的接口，但由子类决定要实例化的类是哪一个。Factory Method 使一个类的实例化延迟到其子类。
<!-- more -->

## 为什么要使用 Factory Method

使用 Factory Method 模式有以下几个好处：

1. **解耦创建和使用**：客户端代码不需要知道具体的产品类，只需要依赖抽象产品接口，降低了耦合性。
2. **扩展性强**：增加新的产品类时，只需添加新的子类工厂，不需要修改现有代码，符合开闭原则。
3. **灵活性高**：可以通过子类来定制产品的创建过程，满足不同的需求。

通过使用 Factory Method 模式，我们可以更灵活地管理对象的创建过程，提高代码的可维护性和可扩展性。

## 示例代码
@startuml
@startuml
namespace framework {
  interface Product {
    + use(): void
  }

  abstract class Factory {
    + create(owner: string): Product
    - createProduct(owner: string): Product
    - registerProduct(product: Product): void
  }
}

namespace concrete {
  class IDCard implements framework.Product {
    - owner: string
    + use(): void
    + getOwner(): string
  }

  class IDCardFactory extends framework.Factory {
    - owners: string[]
    + createProduct(owner: string): IDCard
    + registerProduct(product: IDCard): void
    + getOwners(): string[]
  }
}

framework.Factory --* framework.Product : creates
concrete.IDCardFactory --* concrete.IDCard : creates
@enduml
@enduml

```ts
// product.ts
export interface Product {
  use(): void;
}

// factory.ts
import { Product } from './product';
export abstract class Factory {
  create(owner: string): Product {
    const p = this.createProduct(owner);
    this.registerProduct(p);
    return p;
  }
  protected abstract createProduct(owner: string): Product;
  protected abstract registerProduct(product: Product): void;
}

// idCard.ts
import { Product } from './product';
export class IDCard implements Product {
  private owner: string;
  constructor(owner: string) {
    this.owner = owner;
  }
  use(): void {
    console.log(`${this.owner}使用了ID卡`);
  }
  getOwner(): string {
    return this.owner;
  }
}

// idCardFactory.ts
import { IDCard } from "./idCard";
import { Factory } from "./factory";
export class IDCardFactory extends Factory {
  private owners: string[] = [];
  createProduct(owner: string): IDCard {
    return new IDCard(owner);
  }
  registerProduct(product: IDCard): void {
    this.owners.push(product.getOwner());
  }
  getOwners(): string[] {
    return this.owners;
  }
}

// main.ts
import { Factory } from "./factory";
import { IDCardFactory } from "./idCardFactory";

const factory: Factory = new IDCardFactory();
const card1 = factory.create("Alice");
const card2 = factory.create("Bob");
const card3 = factory.create("Charlie");
card1.use();
card2.use();
card3.use();
```
## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\factory_method\main.ts"
Alice使用了ID卡
Bob使用了ID卡
Charlie使用了ID卡
```

# 相关的设计模式
+ Template Method
+ Singleton
+ Composite
+ Iterator
