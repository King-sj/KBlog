---
title: Command 模式
date: 2024-10-29
category:
  - 设计模式
tag:
  - 设计模式
  - TypeScript
  - 用类实现
prev: ./proxy
next: ./interpreter
---


## 为什么使用此模式

Command 模式将请求封装成对象，使得可以用不同的请求、队列或者日志来参数化其他对象。Command 模式也支持可撤销的操作。


## 示例代码

@startuml
interface Command {
  +execute(): void
}

interface Drawable {
  +draw(x: number, y: number): void
}

class DrawCanvas implements Drawable {
  -history: MacroCommand
  +paint(): void
  +draw(x: number, y: number): void
}

class DrawCommand implements Command {
  -x: number
  -y: number
  -canv: DrawCanvas
  +execute(): void
}

class MacroCommand implements Command {
  -commands: Command[]
  +push(command: Command): void
  +undo(): void
  +clear(): void
  +execute(): void
}

DrawCanvas --> MacroCommand
DrawCommand --> DrawCanvas
@enduml

@startuml
actor Client
participant "DrawCanvas" as canvas
participant "MacroCommand" as history
participant "DrawCommand" as command

Client -> canvas: new DrawCanvas(history)
Client -> history: new MacroCommand()
Client -> command: new DrawCommand(canvas, x, y)
Client -> history: push(command)
Client -> canvas: paint()
canvas -> history: execute()
history -> command: execute()
command -> canvas: draw(x, y)
@enduml

```ts
// command.ts
export interface Command {
  execute(): void;
}
// drawable.ts
export interface Drawable {
  draw(x:number,y:number): void;
}
// drawCanvas.ts
import { Drawable } from './drawable';
import { MacroCommand } from './macroCommand';
export class DrawCanvas implements Drawable {
  private history: MacroCommand;
  constructor(history: MacroCommand) {
    this.history = history;
  }
  paint(): void {
    this.history.execute();
  }
  draw(x: number, y: number): void {
    console.log(`Drawing at (${x}, ${y})`);
  }
}
// drawCommand.ts
import { Command } from './command';
import { DrawCanvas } from './drawCanvas';
export class DrawCommand implements Command {
  private x: number;
  private y: number;

  constructor(private canv: DrawCanvas,x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  execute(): void {
    this.canv.draw(this.x, this.y)
  }
}
// macroCommand.ts
import { Command } from './command';
export class MacroCommand implements Command {
  private commands: Command[] = [];
  push(command: Command): void {
    this.commands.push(command);
  }
  undo(): void {
    this.commands.pop();
  }
  clear(): void {
    this.commands = [];
  }
  execute(): void {
    this.commands.forEach((command) => {
      command.execute();
    });
  }
}
// main.ts
import { DrawCanvas } from './drawCanvas';
import { MacroCommand } from './macroCommand';
import { DrawCommand } from './drawCommand';
const history = new MacroCommand();
const canvas = new DrawCanvas(history);
for (let i = 0; i < 10; i++) {
  const cmd = new DrawCommand(canvas, i, i);
  history.push(cmd);
}
canvas.paint();
```


## 运行结果
```sh
PS design_patern> ts-node "d:\code\design_patern\src\command\main.ts"
Drawing at (0, 0)
Drawing at (1, 1)
Drawing at (2, 2)
Drawing at (3, 3)
Drawing at (4, 4)
Drawing at (5, 5)
Drawing at (6, 6)
Drawing at (7, 7)
Drawing at (8, 8)
Drawing at (9, 9)
```

## 拓展思路的要点

### 命令中应该包含哪些信息
在命令模式中，命令对象通常包含以下信息：
- **接收者（Receiver）**：执行命令的对象。接收者包含了执行具体操作的逻辑。
- **动作（Action）**：要执行的具体操作。命令对象将动作封装为一个方法调用。
- **参数（Parameters）**：执行操作所需的参数。命令对象可以包含执行操作所需的所有参数。
- **状态（State）**：命令执行前后的状态信息。命令对象可以保存执行前的状态，以便在需要时进行撤销操作。

通过将这些信息封装在命令对象中，可以实现命令的参数化和可撤销性，从而提高系统的灵活性和可维护性。

### 保存历史记录
命令模式的一个重要应用是保存历史记录，以支持撤销和重做操作。通过将每个执行的命令对象保存到一个历史记录列表中，可以在需要时回滚到之前的状态。以下是实现保存历史记录的一些常见方法：
- **命令栈（Command Stack）**：使用栈数据结构保存执行的命令对象。每次执行命令时，将命令对象压入栈中；每次撤销操作时，从栈中弹出命令对象并执行撤销操作。
- **命令队列（Command Queue）**：使用队列数据结构保存执行的命令对象。适用于需要按顺序执行和撤销命令的场景。
- **快照（Snapshot）**：在执行命令前保存对象的快照，以便在需要时恢复到之前的状态。适用于需要保存复杂对象状态的场景。

## 相关的设计模式
+ Composite 模式
+ Memento 模式
+ Prototype 模式
