---
title: 抽象工厂模式
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
  - 生成实例
prev: ./builder
next: ./bridge
---

## 为什么要使用抽象工厂模式

抽象工厂模式提供一个接口，用于创建相关或依赖对象的家族，而无需明确指定具体类。它通过定义一个创建对象的接口来实现，这样子类可以决定实例化哪个类。抽象工厂模式使得一个类的实例化延迟到其子类。
<!-- more -->

1. **解耦**：抽象工厂模式通过将对象的创建过程抽象化，减少了客户端代码与具体类之间的耦合。
2. **一致性**：确保同一工厂创建的一系列对象具有一致的接口和行为。
3. **扩展性**：可以方便地增加新的产品族而不影响现有代码。

## 示例代码


@startuml
namespace abstractFactory {
  abstract class Factory {
    + createLink(caption: string, url: string): Link
    + createTray(caption: string): Tray
    + createPage(title: string, author: string): Page
  }

  abstract class Item {
    - caption: string
    + makeHTML(): string
  }

  abstract class Link extends Item {
    - url: string
  }

  abstract class Tray extends Item {
    - tray: Item[]
    + add(item: Item): void
  }

  abstract class Page {
    - title: string
    - author: string
    - content: Item[]
    + add(item: Item): void
    + output(): void
    + makeHTML(): string
  }
}

namespace concreteFactory {
  class ListFactory extends abstractFactory.Factory {
    + createLink(caption: string, url: string): abstractFactory.Link
    + createTray(caption: string): abstractFactory.Tray
    + createPage(title: string, author: string): abstractFactory.Page
  }

  class ListLink extends abstractFactory.Link {
    + makeHTML(): string
  }

  class ListTray extends abstractFactory.Tray {
    + makeHTML(): string
  }

  class ListPage extends abstractFactory.Page {
    + makeHTML(): string
  }
}
Factory --* Link : create
Factory --* Tray : create
Factory --* Page : create
ListFactory --* ListLink : create
ListFactory --* ListTray : create
ListFactory --* ListPage : create

@enduml


```ts
// factory.ts
// 抽象工厂
import { Link } from './link';
import { Tray } from './tray';
import { Page } from './page';

export abstract class Factory {
  abstract createLink(caption: string, url: string): Link;
  abstract createTray(caption: string): Tray;
  abstract createPage(title: string, author: string): Page;
}

// item.ts
// 抽象零件
export abstract class Item {
  protected caption: string;
  constructor(caption: string) {
    this.caption = caption;
  }
  abstract makeHTML(): string;
}

// link.ts
// 抽象超链接
import { Item } from './item';
export abstract class Link extends Item {
  protected url: string;
  constructor(caption: string, url: string) {
    super(caption);
    this.url = url;
  }
}

// listFactory.ts
import { Factory } from './factory';
import { ListLink } from './listLink';
import { ListTray } from './listTray';
import { ListPage } from './listPage';

export class ListFactory extends Factory {
  createLink(caption: string, url: string) {
    return new ListLink(caption, url);
  }
  createTray(caption: string) {
    return new ListTray(caption);
  }
  createPage(title: string, author: string) {
    return new ListPage(title, author);
  }
}

// listLink.ts
import { Link } from './link';
export class ListLink extends Link {
  constructor(caption: string, url: string) {
    super(caption, url);
  }
  makeHTML() {
    return `<li><a href="${this.url}">${this.caption}</a></li>\n`;
  }
}

// listPage.ts
import { Page } from './page';
export class ListPage extends Page {
  makeHTML() {
    let buffer = [];
    buffer.push(`<html><head><title>${this.title}</title></head>`);
    buffer.push(`<body>`);
    buffer.push(`<h1>${this.title}</h1>`);
    buffer.push(`<ul>`);
    this.content.forEach(item => {
      buffer.push(item.makeHTML());
    });
    buffer.push(`</ul>`);
    buffer.push(`<hr><address>${this.author}</address>`);
    buffer.push(`</body></html>`);
    return buffer.join('\n');
  }
}

// listTray.ts
import { Tray } from "./tray";
export class ListTray extends Tray {
  constructor(caption: string) {
    super(caption);
  }
  makeHTML() {
    let buffer = [];
    buffer.push("<li>\n");
    buffer.push(this.caption + "\n");
    buffer.push("<ul>\n");
    this.tray.forEach(item => {
      buffer.push(item.makeHTML());
    });
    buffer.push("</ul>\n");
    buffer.push("</li>\n");
    return buffer.join("");
  }
}

// main.ts
import { Factory } from "./factory";
import { ListFactory } from "./listFactory";
function getProduct(factory: Factory) {
  let people = factory.createLink("people", "http://www.people.com");
  let gmw = factory.createLink("gmw", "http://www.gmw.com");

  let us_yahoo = factory.createLink("us_yahoo", "http://www.us.yahoo.com");
  let jp_yahoo = factory.createLink("jp_yahoo", "http://www.jp.yahoo.com");
  let excite = factory.createLink("excite", "http://www.excite.com");
  let google = factory.createLink("google", "http://www.google.com");

  let traynews = factory.createTray("news");
  traynews.add(people);
  traynews.add(gmw);

  let trayyahoo = factory.createTray("yahoo");
  trayyahoo.add(us_yahoo);
  trayyahoo.add(jp_yahoo);

  let traysearch = factory.createTray("search");
  traysearch.add(trayyahoo);
  traysearch.add(excite);

  let page = factory.createPage("LinkPage", "gmw");
  page.add(traynews);
  page.add(traysearch);
  page.output();
}

let factory = new ListFactory();
getProduct(factory);

// page.ts
// 抽象html页面
import { Item } from './item';
export abstract class Page {
  title: string;
  author: string;
  content: Array<Item>;
  buffer: string;
  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
    this.content = [];
  }
  add(item: Item): void {
    this.content.push(item);
  }
  output(): void {
    try {
      this.buffer = this.makeHTML();
      console.log(this.buffer);
    } catch (error) {
      console.log(error);
    }
  }
  abstract makeHTML(): string;
}

// tray.ts
// 抽象容器
import { Item } from './item';
export abstract class Tray extends Item {
  protected tray: Item[] = [];
  constructor(caption: string) {
    super(caption);
  }
  public add(item: Item): void {
    this.tray.push(item);
  }
}
```

# 运行结果

```sh
PS design_patern> ts-node "d:\code\design_patern\src\abstractFactory\main.ts"
<html><head><title>LinkPage</title></head>
<body>
<h1>LinkPage</h1>
<ul>
<li>
news
<ul>
<li><a href="http://www.people.com">people</a></li>
<li><a href="http://www.gmw.com">gmw</a></li>
</ul>
</li>

<li>
search
<ul>
<li>
yahoo
<ul>
<li><a href="http://www.us.yahoo.com">us_yahoo</a></li>
<li><a href="http://www.jp.yahoo.com">jp_yahoo</a></li>
</ul>
</li>
<li><a href="http://www.excite.com">excite</a></li>
</ul>
</li>

</ul>
<hr><address>gmw</address>
</body></html>
```

## 增加其它工厂

如果只是为了编写包含 HTML 超链接集合的文件，这样的设计可能显得有些过于复杂。当只有一个具体工厂时，划分“抽象类”和“具体类”是没有必要的。然而，使用抽象工厂模式，我们可以轻松地添加其他具体工厂，例如TableFactory。


## 拓展思路的要点

### 易于增加具体工厂
在 Abstract Factory 模式中增加具体的工厂是非常容易的。这里说的“容易”指的是需要编写哪些类和需要实现哪些方法都非常清楚。

假设现在我们要在示例程序中增加新的具体工厂，那么需要做的就是编写 Factory、Link、Tray、Page 这 4 个类的子类，并实现它们定义的抽象方法。也就是说将 factory 包中的抽象部分全部具体化即可。

这样一来，无论要增加多少个具体工厂（或是要修改具体工厂的 Bug），都无需修改抽象工厂和 Main 部分。

### 难以增加新的零件
请试想一下要在 Abstract Factory 模式中增加新的零件时应当如何做。例如，我们要在 factory 包中增加一个表示图像的 Picture 零件。这时，我们必须要对所有的具体工厂进行相应的修改才行。例如，在 listfactory 包中，我们必须要做以下修改：

+ 在 ListFactory 中增加 createPicture 方法，
+ 新增 ListPicture 类。

已经编写完成的具体工厂越多，修改的工作量就会越大。

## 相关的设计模式

+ Builder 模式
+ Factory Method 模式
+ Composite 模式
+ Singleton 模式
