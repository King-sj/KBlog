---
category: C++
tags: [C++17, lambda, std::visit, 模板元编程]
title: C++ 实现 lambda 重载模式
summary: 介绍如何在 C++17 中通过模板实现 lambda 重载模式，适配 std::visit 等场景，附详细示例与解析。
---

# C++ 实现 lambda 重载模式

C++17 引入了结构化绑定和模板参数包展开，使得我们可以优雅地实现 lambda 重载模式。该模式常用于 `std::visit` 等需要对多种类型进行分派的场景。

## 1. 原理与实现

核心代码如下：

```cpp
// 定义一个模板结构体，将多个 lambda 继承并展开 operator()
template <class... Ts> struct overloaded : Ts... {
    using Ts::operator()...;
};
template <class... Ts> overloaded(Ts...) -> overloaded<Ts...>;
```

- `overloaded` 结构体通过多重继承，将所有 lambda 的 `operator()` 合并。
- `using Ts::operator()...;` 展开所有基类的调用运算符，实现多态调用。
- 最后一个模板推导指引，方便直接用花括号初始化。

## 2. 使用示例

以 `std::variant` 为例，结合 `std::visit` 实现多类型分派：

```cpp
#include <iostream>
#include <string>
#include <variant>

struct A {
  int a;
  A(int a) : a(a) {}
  friend std::ostream &operator<<(std::ostream &os, const A &a) {
    os << "A: " << a.a;
    return os;
  }
};

int main() {
  std::variant<int, double, std::string, A> v = 42;
  auto print = overloaded{
      [](int i) { std::cout << "int: " << i << '\n'; },
      [](double d) { std::cout << "double: " << d << '\n'; },
      [](const std::string &s) { std::cout << "string: " << s << '\n'; },
      [](const A &a) { std::cout << "A: " << a << '\n'; },
      [](auto &&x) { std::cout << "unknown type: " << x << '\n'; },
  };
  std::visit(print, v);

  v = 3.14;
  std::visit(print, v);

  v = "Hello, world!";
  std::visit(print, v);

  v = A(42);
  std::visit(print, v);

  return 0;
}
/*
输出：
int: 42
double: 3.14
string: Hello, world!
A: 42
*/
```

## 3. 应用场景
- `std::visit` 处理 `std::variant` 多类型分派
- 事件分发、AST 访问器等需要多重重载的场景

## 4. 参考资料
- [cppreference: std::visit](https://en.cppreference.com/w/cpp/utility/variant/visit)
- [C++17 新特性：模板参数包展开](https://zh.cppreference.com/w/cpp/language/parameter_pack)
- [C++ lambda 重载模式实践](https://blog.csdn.net/qq_36387683/article/details/108893964)