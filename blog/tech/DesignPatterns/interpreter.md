---
title: Interpreter 模式
date: 2024-10-29
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 用类实现
prev: ./command
next: false
---



## 为什么使用此模式

解释器模式（Interpreter Pattern）是一种行为设计模式，它定义了一种语言的文法表示，并定义一个解释器来解释该语言中的句子。使用解释器模式的原因包括：

1. **简化语法解析**：通过定义文法规则，可以轻松解析和执行特定的语言或指令集。
2. **可扩展性**：可以轻松添加新的语法规则或指令，而无需修改现有代码。
3. **代码复用**：通过将不同的语法规则封装在不同的类中，可以提高代码的复用性和可维护性。

## 示例代码
本实例是一个控制小车的脚本语言解释器demo,文法如下， 分析方法为[递归下降](https://bupt.online/tech/designASimpileCCompiler/0.html)

```
<program> ::= program <command list>
<command list> ::= <command>* end
<command> ::= <repeat command> | <primitive command>
<repeat command> ::= repeat <number> <command list>
<primitive command> ::= go | right | left
```


@startuml
class Context {
  - stringTokenizer: StringTokenizer
  - currentToken: string
  + nextToken(): string
  + getCurrentToken(): string
  + skipToken(token: string): void
  + getCurrentNumber(): number
}

abstract class Node {
  + parse(context: Context): void
}

class ProgramNode extends Node {
  - commandListNode: CommandListNode
  + parse(context: Context): void
  + toString(): string
}

class CommandListNode extends Node {
  - list: Node[]
  + parse(context: Context): void
  + toString(): string
}

class CommandNode extends Node {
  - node: Node
  + parse(context: Context): void
  + toString(): string
}

class RepeatCommandNode extends Node {
  - number: number
  - commandListNode: CommandListNode
  + parse(context: Context): void
  + toString(): string
}

class PrimitiveCommandNode extends Node {
  - name: string
  + parse(context: Context): void
  + toString(): string
}

class StringTokenizer {
  - text: string
  - tokens: string[]
  - index: number
  + nextToken(): string
  + hasMoreTokens(): boolean
}
Node --o Context
Context --o StringTokenizer
@enduml

@startuml
actor Client
Client -> Context: new(text)
Client -> ProgramNode: new()
Client -> ProgramNode: parse(context)
ProgramNode -> Context: skipToken("program")
ProgramNode -> CommandListNode: new()
ProgramNode -> CommandListNode: parse(context)
CommandListNode -> Context: getCurrentToken()
alt token == "repeat"
  CommandListNode -> CommandNode: new()
  CommandNode -> RepeatCommandNode: new()
  CommandNode -> RepeatCommandNode: parse(context)
else token == "go" or "right" or "left"
  CommandListNode -> CommandNode: new()
  CommandNode -> PrimitiveCommandNode: new()
  CommandNode -> PrimitiveCommandNode: parse(context)
end
CommandListNode -> Context: getCurrentToken()
alt token == "end"
  CommandListNode -> Context: skipToken("end")
end
Client -> ProgramNode: toString()
@enduml

```ts
// commandListNode.ts
import { Node } from "./node";
import { Context } from "./context";
import { CommandNode } from "./commandNode";
// <command list> ::= <command>* end
export class CommandListNode extends Node {
  list: Node[] = [];
  parse(context: Context): void {
    while (true) {
      if (context.getCurrentToken() === null) {
        throw new Error("Missing 'end'");
      } else if (context.getCurrentToken() === "end") {
        context.skipToken("end");
        break;
      } else {
        const commandNode = new CommandNode();
        commandNode.parse(context);
        this.list.push(commandNode);
      }
    }
  }
  toString(): string {
    return this.list.join("");
  }
}
// commandNode.ts
import { Context } from "./context";
import { Node } from "./node";
import { RepeatCommandNode } from "./repeatCommandNode";
import { PrimitiveCommandNode } from "./primitiveCommandNode";
// <command> ::= <repeat command> | <primitive command>
export class CommandNode extends Node {
  node: Node;
  parse(context: Context): void {
    if (context.getCurrentToken() === "repeat") {
      this.node = new RepeatCommandNode();
      this.node.parse(context);
    } else {
      this.node = new PrimitiveCommandNode();
      this.node.parse(context);
    }
  }
  toString(): string {
    return this.node.toString();
  }
}
// context.ts
import { StringTokenizer } from './stringTokenizer';
export class Context {
  private stringTokenizer: StringTokenizer;
  private currentToken: string;
  constructor(text: string) {
    this.stringTokenizer = new StringTokenizer(text);
    this.nextToken();
  }
  nextToken(): string {
    if (this.stringTokenizer.hasMoreTokens()) {
      this.currentToken = this.stringTokenizer.nextToken();
    } else {
      this.currentToken = null;
    }
    return this.currentToken;
  }
  getCurrentToken(): string {
    return this.currentToken;
  }
  skipToken(token: string): void {
    if (token != this.currentToken) {
      throw new Error(`Warning: ${token} is expected, but ${this.currentToken} is found.`);
    }
    this.nextToken();
  }
  getCurrentNumber(): number {
    let number: number;
    try {
      number = Number(this.currentToken);
    } catch (e) {
      throw new Error(`Warning: ${e}`);
    }
    return number;
  }
}
// main.ts
import { Context } from "./context";
import { ProgramNode } from "./programNode";

// <program> ::= program <command list>
// <command list> ::= <command>* end
// <command> ::= <repeat command> | <primitive command>
// <repeat command> ::= repeat <number> <command list>
// <primitive command> ::= go | right | left

let programs =
  "program end\n"+
  "program go end\n"+
  "program go right go right go right end\n"+
  "program repeat 4 go right end end\n"+
  "program repeat 4 repeat 3 go right go left end right end end\n";

programs.split("\n").forEach((text:string)=>{
  if (text.length == 0) return;
  console.log(`current:\n ${text}\n`)
  let node = new ProgramNode()
  node.parse(new Context(text))
  console.log(`node = ${node}`)
})
// node.ts
import {Context} from "./context";
export abstract class Node {
  abstract parse(ctx:Context): void;
}
// primitiveCommandNode.ts
import { Node } from "./node";
import { Context } from "./context";
// <primitive command> ::= <go> | <right> | <left>
export class PrimitiveCommandNode extends Node {
  private name: string;
  parse(context: Context): void {
    this.name = context.getCurrentToken();
    context.skipToken(this.name);
    if (this.name !== "go" && this.name !== "right" && this.name !== "left") {
      throw new Error(`${this.name} is undefined`);
    }
  }
  toString(): string {
    return this.name+" ";
  }
}
// programNode.ts
import { Node } from "./node";
import { CommandListNode } from "./commandListNode";
import {Context} from "./context";
// <program> ::= program <command list>
export class ProgramNode extends Node {
  commandListNode: Node;
  parse(context:Context): void {
    context.skipToken("program");
    this.commandListNode = new CommandListNode();
    this.commandListNode.parse(context);
  }
  toString(): string {
    return "[program " + this.commandListNode + "]";
  }
}
// repeatCommandNode.ts
import { Node } from "./node";
import { Context } from "./context";
import { CommandListNode } from "./commandListNode";
// <repeat command> ::= "repeat" <number> "end"
export class RepeatCommandNode extends Node {
  number: number;
  commandListNode: CommandListNode;
  parse(context: Context): void {
    context.skipToken("repeat");
    this.number = context.getCurrentNumber();
    context.nextToken();
    this.commandListNode = new CommandListNode();
    this.commandListNode.parse(context);
  }
  toString(): string {
    return `[repeat [${this.number} ${this.commandListNode.toString()}]]`;
  }
}
// StringTokenizer.ts
export class StringTokenizer{
  private text: string;
  private tokens: string[];
  private index: number;
  constructor(text: string) {
    this.text = text;
    this.tokens = text.split(" ");
    this.index = 0;
  }
  nextToken(): string {
    return this.tokens[this.index++];
  }
  hasMoreTokens(): boolean {
    return this.index < this.tokens.length;
  }
}
```

## 运行结果
```
PS design_patern> ts-node "d:\code\design_patern\src\interperter\main.ts"
current:
 program end

node = [program ]
current:
 program go end

node = [program go ]
current:
 program go right go right go right end

node = [program go right go right go right ]
current:
 program repeat 4 go right end end

node = [program [repeat [4 go right ]]]
current:
 program repeat 4 repeat 3 go right go left end right end end

node = [program [repeat [4 [repeat [3 go right go left ]]right ]]]
```
