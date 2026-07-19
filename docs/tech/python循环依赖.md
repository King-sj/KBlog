---
title: Python 循环依赖检测
date: 2025-03-01
category: ["Python"]
tags: ["python", "循环依赖", "pycycle", "import"]
summary: Python 项目中循环导入问题的检测与解决方案。
---

# Python 循环依赖检测

Python 中两个模块互相 import 会导致 `ImportError` 或部分加载后的 `AttributeError`。这类问题在项目变大后很难排查，尤其是间接的循环依赖（A → B → C → A）。

<!-- more -->

## 循环依赖是什么

典型的循环依赖场景：

```text
# module_a.py
from module_b import foo

def bar():
    return foo() + 1

# module_b.py
from module_a import bar  # 循环引用！

def foo():
    return 42
```

当 Python 导入 `module_a` 时：
1. 开始解析 `module_a`，执行到 `from module_b import foo`
2. 转而解析 `module_b`，执行到 `from module_a import bar`
3. `module_a` 尚未完全加载，导致 `ImportError`

## 如何检测

### pycycle — 专用检测工具

[pycycle](https://github.com/bndr/pycycle) 可以自动分析项目的导入图，找出所有循环依赖链。

```sh
pip install pycycle
```

运行检测：

```sh
pycycle --here
```

输出示例：

```text
Cycle found:
  app.services.user -> app.models.user -> app.services.user
  app.api.handlers -> app.services.order -> app.api.handlers
```

### import-linter

[import-linter](https://github.com/sedders123/import_linter) 提供更灵活的规则配置，适合在 CI 中持续检查。

### 手动排查

如果不想引入额外工具，可以看报错信息。循环依赖的典型报错：

```text
ImportError: cannot import name 'bar' from partially initialized module 'module_a'
(most likely due to a circular import)
```

后半句就是 Python 给你的提示。

## 解决方案

### 1. 延迟导入（最小改动）

把 `import` 从模块顶层移到函数内部：

```python
# module_a.py
def bar():
    from module_b import foo  # 延迟到函数调用时才导入
    return foo() + 1
```

缺点是不优雅，且 IDE 可能无法正确分析类型。

### 2. 不导入模块，导入整个包

```python
# module_a.py
import module_b  # 用 module_b.foo() 代替 from module_b import foo

def bar():
    return module_b.foo() + 1
```

Python 对模块的循环引用容忍度高一些，因为它不需要在导入时立即提取具体名称。

### 3. 提取公共接口到第三个模块

```text
# 重构前
module_a ↔ module_b

# 重构后
module_a → common_interface ← module_b
```

```python
# common_interface.py
class BaseService:
    pass

# module_a.py
from common_interface import BaseService

# module_b.py
from common_interface import BaseService
```

### 4. 使用依赖注入

```python
# module_a.py
class A:
    def __init__(self, b_service):
        self.b_service = b_service

# main.py
from module_a import A
from module_b import B

b = B()
a = A(b)
```

## 预防措施

- 架构分层的项目（如 controller → service → repository）使用 `import-linter` 配置层间约束
- 在 CI 中跑 `pycycle` 或 `import-linter`，预防循环依赖被合入主分支
- 不要在 `__init__.py` 中写大量导入，它容易成为循环依赖的源头

## 总结

循环依赖本质上是一个**架构问题**——模块间的耦合方向不正确。检测工具可以帮你在早期发现，但治本的方式是重新审视模块职责和依赖关系。

## 参考

- [pycycle GitHub](https://github.com/bndr/pycycle)
- [import-linter 文档](https://import-linter.readthedocs.io/)
