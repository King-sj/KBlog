---
category: functools
tag:
  - python
  - decorators
title: functools.wraps 使用详解
---

functools.wraps 是 Python 中的一个装饰器，用于装饰另一个装饰器，使其保留被装饰函数的元数据，如函数名、文档字符串等。这在编写装饰器时非常有用，因为装饰器会改变被装饰函数的属性，使得调试和文档生成变得困难。

使用示例

以下是一个没有使用 functools.wraps 的装饰器示例：

def my_decorator(func):
def wrapper(*args, **kwargs):
"""decorator"""
print('Calling decorated function...')
return func(*args, **kwargs)
return wrapper

@my_decorator
def example():
"""Docstring"""
print('Called example function')

print(example.__name__, example.__doc__)
输出结果为：

wrapper decorator
可以看到，函数名和文档字符串都被改变了。

现在，我们使用 functools.wraps 来修复这个问题：

import functools

def my_decorator(func):
@functools.wraps(func)
def wrapper(*args, **kwargs):
"""decorator"""
print('Calling decorated function...')
return func(*args, **kwargs)
return wrapper

@my_decorator
def example():
"""Docstring"""
print('Called example function')

print(example.__name__, example.__doc__)
输出结果为：

example Docstring
可以看到，函数名和文档字符串都被正确保留了。

重要性

使用 functools.wraps 可以确保装饰器不会改变被装饰函数的元数据，这对于调试、文档生成和代码可读性非常重要。它通过调用 functools.update_wrapper 函数来实现这一点，该函数会将被装饰函数的属性复制到装饰器函数上。

结论

functools.wraps 是编写装饰器时的一个重要工具，它可以帮助我们保留被装饰函数的元数据，从而提高代码的可读性和可维护性。在编写装饰器时，建议始终使用 functools.wraps 来装饰你的装饰器函数。
