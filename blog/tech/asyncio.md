# Python asyncio

`asyncio` 是 Python 用于编写并发代码的库。它使用 `async`/`await` 语法，使得编写异步程序变得更加直观和简单。`asyncio` 主要用于 I/O 绑定和高层次结构化网络代码。

## 示例代码

以下是一个使用 `asyncio` 的示例代码，它展示了如何动态添加和管理异步任务。

```python
import asyncio
import sys
import time

stop_event = asyncio.Event()

async def func(name):
    i = 0
    while not stop_event.is_set():
        print(f"{name} : {i}")
        i += 1
        await asyncio.sleep(1)

async def append_task(name):
    task = asyncio.create_task(func(name))
    return task

async def listen_for_input():
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    await asyncio.get_running_loop().connect_read_pipe(lambda: protocol, sys.stdin)

    while not stop_event.is_set():
        input_line = await reader.readline()
        input_line = input_line.decode().strip()
        if input_line.lower() == "stop":
            stop_event.set()
        else:
            task = await append_task(input_line)
            task_list.append(task)

async def main():
    start_time = time.time()

    global task_list
    task_list = []
    input_task = asyncio.create_task(listen_for_input())

    # 使用事件循环持续运行，支持动态添加任务
    # while not stop_event.is_set():
    #    await asyncio.sleep(0.1)
    await stop_event.wait()

    await input_task
    await asyncio.gather(*task_list)

    end_time = time.time()
    print(f"Total run time: {end_time - start_time} seconds")

if __name__ == "__main__":
    asyncio.run(main())
```

**运行结果**

```
kkk@BugAutomaton:/tmp$ python test_async.py
a
a : 0
a : 1
b
b : 0
a : 2
b : 1
a : 3
b : 2
a : 4
c
c : 0
b : 3
a : 5
c : 1
b : 4
a : 6
c : 2
b : 5
a : 7
dc : 3

d : 0
b : 6
a : 8
c : 4
d : 1
b : 7
a : 9
c : 5
d : 2
e
e : 0
b : 8
a : 10
c : 6
d : 3
e : 1
b : 9
a : 11
c : 7
d : 4
e : 2
b : 10
a : 12
steopc : 8

steop : 0
d : 5
e : 3
b : 11
a : 13
c : 9
steop : 1
d : 6
e : 4
b : 12
a : 14
sc : 10
steop : 2
d : 7
te : 5
b : 13
oa : 15
p
Total run time: 16.707311153411865 seconds
```

### windows 注意

输入读取需要改为

```python
async def listen_for_input():
    loop = asyncio.get_running_loop()
    while not stop_event.is_set():
        # 使用run_in_executor异步读取输入行，避免阻塞事件循环
        input_line = await loop.run_in_executor(None, sys.stdin.readline)
        input_line = input_line.strip()
        if input_line.lower() == "stop":
            stop_event.set()
        else:
            task = await append_task(input_line)
            task_list.append(task)
```

## 代码解释

1. `func(name)`：这是一个异步函数，它会每秒打印一次传入的 `name` 和一个递增的计数器 `i`，直到 `stop_event` 被设置。
2. `append_task(name)`：这是一个辅助函数，用于创建并返回一个新的任务，该任务运行 `func(name)`。
3. `listen_for_input()`：这是一个异步函数，它会监听标准输入。当用户输入 "stop" 时，它会设置 `stop_event`，否则它会创建一个新的任务并将其添加到 `task_list` 中。
4. `main()`：这是主函数，它初始化任务列表并启动 `listen_for_input` 任务。它会持续运行事件循环，直到 `stop_event` 被设置，然后等待所有任务完成并打印总运行时间。

通过这个示例，我们可以看到 `asyncio` 如何帮助我们轻松地管理并发任务，并且可以动态地添加新的任务。
