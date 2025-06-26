---
title: switch-true 编程模式
categories:
  - 编程范式
  - 技巧
---

# switch-true 编程模式

switch-true 是一种利用 switch 语句和 true 常量实现多条件分支判断的编程技巧，常见于 JavaScript、Go 等语言。

## 定义
switch-true 模式指的是 switch 语句的表达式为 true，各 case 为布尔表达式，从而实现类似 if-else if-else 的链式分支。

## 原理
switch (true) 语句会依次判断每个 case 的条件表达式，遇到第一个为 true 的分支即执行。

## 应用场景
- 替代多层 if-else，提高代码可读性
- 处理复杂的条件分支
- 某些语言（如 Go）可用 switch 实现更优雅的分支

## 示例
### JavaScript
```js
switch (true) {
  case x > 10:
    console.log('大于10');
    break;
  case x > 5:
    console.log('大于5');
    break;
  default:
    console.log('5及以下');
}
```

### Go
```go
switch {
case x > 10:
    fmt.Println("大于10")
case x > 5:
    fmt.Println("大于5")
default:
    fmt.Println("5及以下")
}
```

## 参考资料
- [switch-true pattern 详解](https://yangss3.github.io/yangss/articles/switch-true-pattern.html)
