---
title: Python requirements.txt 最佳实践
date: 2024-10-29
category: ["Python"]
tags: ["python", "pip", "依赖管理"]
summary: pip list --format=freeze 与 pip freeze 的区别，以及 requirements.txt 的最佳实践。
---

# Python requirements.txt 最佳实践

Python 项目通常用 `requirements.txt` 管理依赖。但生成这个文件的方式有讲究，用错了可能引入本地路径，导致其他环境无法安装。

<!-- more -->

## 两种生成方式

Python 生成依赖列表有两种常用方式：

### pip freeze（不推荐）

```sh
pip freeze > requirements.txt
```

这会生成类似：

```text
package-a==1.0.0
some-local-pkg @ file:///home/user/projects/local-pkg
```

问题在于 `pip freeze` 会**记录所有已安装的包**，包括：
- 本地路径安装的包（带 `file://` 前缀）
- 用 `pip install -e .` 安装的开发模式下依赖
- 其他虚拟环境残留的包

这些本地路径在其他机器或 Docker 环境中根本无法安装。

### pip list --format=freeze（推荐）

```sh
pip list --format=freeze > requirements.txt
```

`pip list` 默认只列出通过 PyPI/pip 安装的包，格式更干净，不会混入本地路径。生成的输出与 `pip freeze` 格式一致，但更可控。

## 手动维护 vs 自动生成

对于**应用程序**（如 Django、Flask Web 应用），推荐**锁定版本号**：

```text
django==4.2.11
requests==2.31.0
celery==5.3.6
```

对于**库/包**（如要发布到 PyPI 的 SDK），推荐**宽松版本约束**在 `setup.py` 或 `pyproject.toml` 中：

```toml
# pyproject.toml
[project]
dependencies = [
    "requests>=2.28,<3",
    "pydantic>=2.0",
]
```

## pip-tools：更好的依赖管理

手动维护顶层依赖 + 锁定传递依赖是更可靠的做法。`pip-tools` 提供了这套机制：

```sh
pip install pip-tools
```

创建 `requirements.in`，只写顶层依赖：

```text
# requirements.in
django
requests
celery
```

然后编译生成精确版本的 `requirements.txt`：

```sh
pip-compile requirements.in
```

这会生成包含所有传递依赖的锁定文件，类似 `package-lock.json` / `Cargo.lock` 的效果。

## 总结

| 方法 | 适用场景 | 注意 |
|------|----------|------|
| `pip list --format=freeze` | 快速导出 | 比 `pip freeze` 干净 |
| 手动维护 `requirements.txt` | 应用项目 | 需要手动更新版本 |
| `pip-tools` + `requirements.in` | 正式项目 | 分离顶层依赖和锁文件 |

~~踩过 `pip freeze` 把本地路径带进 Docker 镜像导致构建失败的坑，记录一下。~~
