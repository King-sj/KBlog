---
title: facade 模式
date: 2024-10-26
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 简单化
prev: ./chainOfResponsibility
next: ./mediator
---

当某个程序员得意地说出"啊，在调用那个类之前需要先调用这个类。在调用那个方法之前需要先在这个类中注册一下"的时候，就意味着我们需要引人Facade了。

对于那些能够明确地用语言描述出来的知识，我们不应该将它们隐藏在自己脑袋中，而是应该用代码将它们表现出来。
<p style="text-align: right;">—————《图解设计模式》</p>
<!-- more -->
## 为什么使用外观模式？

1. **简化接口**：外观模式为复杂的子系统提供了一个简单的接口，使得客户端代码不需要了解子系统的内部细节。
2. **松散耦合**：通过引入外观类，客户端代码与子系统之间的耦合度降低，增强了代码的可维护性和可扩展性。
3. **更好的分层**：外观模式有助于分层设计，使得每一层只关注自己的职责，层与层之间通过外观类进行交互。


## 示例代码

在这个示例中，我们使用了外观模式（Facade Pattern）来简化与复杂子系统的交互。外观模式通过提供一个统一的接口来隐藏子系统的复杂性，使得客户端代码可以更容易地使用子系统的功能。

@startuml
class DataBase {
  +static mailData: { [key: string]: string }
  -constructor()
  +static getProperties(databaseName: string): { [key: string]: string }
}

class HtmlWriter {
  -writer: string
  +constructor(writer: string)
  +title(title: string): void
  +paragraph(message: string): void
  +link(href: string, caption: string): void
  +mailto(mailaddr: string, username: string): void
  +close(): void
  +getHtml(): string
}

class PageMaker {
  -constructor()
  +static makeWelcomePage(mailAddress: string, fileName: string): void
}

PageMaker --> DataBase : Organization code
PageMaker --> HtmlWriter : Organization code
@enduml

## 代码实现

```ts
// dataBase.ts
export class DataBase {
  static mailData: { [key: string]: string } = {
    'hyuki@hyuki.com': 'Hiroshi Yuki',
    'hanako@hyuki.com': 'Hanako Sato',
    'tomura@hyuki.com': 'Tomura',
    'mamoru@hyuki.com': 'Mamoru Takahashi',
  };
  private constructor() {}
  static getProperties(databaseName: string) {
    return DataBase.mailData;
  }
}

// htmlWriter.ts
export class HtmlWriter {
  constructor(private writer: string = '') {
  }
  title(title: string): void {
    this.writer += `<html><head><title>${title}</title></head><body>\n<h1>${title}</h1>\n`;
  }
  paragraph(message: string): void {
    this.writer += `<p>${message}</p>\n`;
  }
  link(href: string, caption: string): void {
    this.writer += `<a href="${href}">${caption}</a>\n`;
  }
  mailto(mailaddr: string, username: string): void {
    this.link(`mailto:${mailaddr}`, username);
  }
  close(): void {
    this.writer += '</body></html>\n';
  }
  getHtml(): string {
    return this.writer;
  }
}

// main.ts
import { PageMaker } from "./pageMaker";
PageMaker.makeWelcomePage('hyuki@hyuki.com', "welcome.html");

// pageMaker.ts
import { DataBase } from './dataBase';
import { HtmlWriter } from './htmlWriter';
export class PageMaker {
  private constructor() {}
  static makeWelcomePage(mailAddress: string, fileName: string): void {
    console.log(`Making ${fileName} for ${mailAddress}`);
    let mailprop = DataBase.getProperties('maildata');
    let username = mailprop[mailAddress];
    let writer = new HtmlWriter(fileName);
    writer.title('Welcome to ' + username + "'s page!");
    writer.paragraph(username + 'のページへようこそ。');
    writer.paragraph('メール待っていますね。');
    writer.mailto(mailAddress, username);
    writer.close();
    console.log(writer.getHtml());
  }
}
```

## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\facade\main.ts"
Making welcome.html for hyuki@hyuki.com
welcome.html<html><head><title>Welcome to Hiroshi Yuki's page!</title></head><body>
<h1>Welcome to Hiroshi Yuki's page!</h1>
<p>Hiroshi Yukiのページへようこそ。</p>
<p>メール待っていますね。</p>
<a href="mailto:hyuki@hyuki.com">Hiroshi Yuki</a>
</body></html>
```

## 相关设计模式
+ Abstract Factory 模式
+ Singleton 模式
+ Mediator 模式
