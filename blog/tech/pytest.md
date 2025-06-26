---
title: pytest 配置与实用技巧
category: 工具
---

# pytest 配置与实用技巧

pytest 是 Python 生态中最流行的单元测试框架之一，支持简单易用的断言、丰富的插件生态和灵活的配置方式。

## 基本定义
pytest 是一个用于 Python 的自动化测试框架，支持单元测试、功能测试、参数化测试等。

## 原理简介
pytest 通过自动发现以 test_ 开头的函数或类，执行测试并收集结果。其断言机制无需使用 self.assert*，直接用 assert 即可。

## 常用配置
- conftest.py：用于存放测试夹具（fixture）、hook、全局配置等。
- pytest.ini / pyproject.toml：全局配置文件，可设置测试路径、忽略规则、插件参数等。

### conftest.py 示例
```python
# content of tests/conftest.py
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
print(sys.path)
```

### pytest.ini 示例
```ini
[pytest]
testpaths = tests
addopts = -v --tb=short
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

## 常用命令
- 运行所有测试：`pytest`
- 指定文件：`pytest tests/test_demo.py`
- 只运行某个类/函数：`pytest -k 'TestClass and test_func'`
- 生成测试报告：`pytest --html=report.html`

## 插件推荐
- pytest-cov：测试覆盖率统计
- pytest-xdist：并行测试
- pytest-mock：mock 支持

## 参考资料
- [pytest 官方文档](https://docs.pytest.org/zh/latest/)
- [pytest 配置详解](https://pytest-zh.readthedocs.io/zh/latest/example/simple.html)
