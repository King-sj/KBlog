---
title: 迭代器模式
date: 2024-10-21
category:
  - 设计模式
tag:
  - 设计模式
  - typescript
prev: ./DesignPrinciples
next: ./adapter
---



## 为什么要使用迭代器模式

迭代器模式提供了一种方法来顺序访问集合中的元素，而无需暴露其底层表示。使用迭代器模式有以下几个优点：

1. **简化代码**：迭代器模式将遍历逻辑封装在迭代器对象中，使得客户端代码更加简洁和易读。
2. **解耦集合和遍历**：集合对象和遍历算法分离，增加了代码的灵活性和可维护性。可以在不修改集合对象的情况下，改变遍历算法。
3. **统一接口**：通过实现统一的迭代器接口，不同类型的集合可以使用相同的遍历方式，增强了代码的可扩展性。
4. **支持多种遍历方式**：可以根据需要实现不同的迭代器，以支持多种遍历方式，如正向遍历、反向遍历、过滤遍历等。

通过使用迭代器模式，我们可以更好地管理和操作集合数据，提高代码的可读性和可维护性。

## TypeScript 实现迭代器模式

在本节中，我们将展示如何使用 TypeScript 实现迭代器模式。迭代器模式是一种行为设计模式，它允许顺序访问集合中的元素，而无需暴露其底层表示。

### 代码示例

以下是实现迭代器模式的 TypeScript 代码示例：

@startuml
interface Iterator {
  +hasNext(): boolean
  +next(): any
}

interface Aggregate {
  +iterator(): Iterator
}

class Book {
  -name: string
  +getName(): string
}

class BookShelf implements Aggregate{
  -books: Book[]
  -last: number
  +getBookAt(index: number): Book
  +appendBook(book: Book): void
  +getLength(): number
  +iterator(): Iterator
}

class BookShelfIterator implements Iterator{
  -bookShelf: BookShelf
  -index: number
  +hasNext(): boolean
  +next(): any
}
Aggregate --* Iterator : create
BookShelfIterator --o BookShelf
Book --o BookShelf
@enduml

```ts
// aggregate.ts
import { Iterator } from './iterator';
export interface Aggregate {
  iterator(): Iterator;
}

// book.ts
export class Book {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}

// bookShelf.ts
import { Book } from './book';
import { Iterator } from './iterator';
import { BookShelfIterator } from './bookShelfIterator';
import { Aggregate } from './aggregate';
export class BookShelf implements Aggregate {
  private books: Book[];
  private last: number = 0;
  constructor() {
    this.books = [];
  }
  getBookAt(index: number): Book {
    return this.books[index];
  }
  appendBook(book: Book): void {
    this.books[this.last] = book;
    this.last++;
  }
  getLength(): number {
    return this.last;
  }
  iterator(): Iterator {
    return new BookShelfIterator(this);
  }
}

// bookShelfIterator.ts
import { BookShelf } from './bookShelf';
import { Iterator } from './iterator';
export class BookShelfIterator implements Iterator {
  private bookShelf: BookShelf;
  private index: number;
  constructor(bookShelf: BookShelf) {
    this.bookShelf = bookShelf;
    this.index = 0;
  }
  hasNext(): boolean {
    return this.index < this.bookShelf.getLength();
  }
  next(): any {
    const book = this.bookShelf.getBookAt(this.index);
    this.index++;
    return book;
  }
}

// iterator.ts
export interface Iterator {
  hasNext(): boolean;
  next(): any;
}

// main.ts
import { BookShelf } from "../bookShelf";
import { Book } from "../book";
const bookShelf = new BookShelf();
bookShelf.appendBook(new Book("Around the World in 80 Days"));
bookShelf.appendBook(new Book("Bible"));
bookShelf.appendBook(new Book("Cinderella"));
bookShelf.appendBook(new Book("Daddy-Long-Legs"));
const it = bookShelf.iterator();
while (it.hasNext()) {
  const book = it.next();
  console.log(book.getName());
}
```
### 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\iterator\main.ts"
Around the World in 80 Days
Bible
Cinderella
Daddy-Long-Legs
```

在上面的代码中，我们定义了几个类和接口来实现迭代器模式：

- `Iterator` 接口定义了 `hasNext` 和 `next` 方法。
- `Aggregate` 接口定义了 `iterator` 方法。
- `Book` 类表示一个书籍对象。
- `BookShelf` 类表示一个书架，它实现了 `Aggregate` 接口。
- `BookShelfIterator` 类实现了 `Iterator` 接口，用于遍历 `BookShelf` 中的书籍。

通过这些类和接口，我们可以轻松地遍历 `BookShelf` 中的书籍，而无需了解其内部实现细节。

## 多个迭代器

在某些情况下，我们可能需要为同一个集合编写多个具体迭代器（ConcreteIterator）。例如，我们可以为 `BookShelf` 编写一个反向迭代器，以便从后向前遍历书籍。

## 相关的设计模式
+ Visitor 模式
+ Composite 模式
+ Factory Method 模式
