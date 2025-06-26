---
title: pre-commit 钩子工具简介与实用
category: 工具
---

# pre-commit 简介

pre-commit 是一个流行的 Git 钩子管理工具，支持在代码提交前自动执行格式化、静态检查、自动修复等操作，提升代码质量，避免低级错误进入仓库。

## 主要功能
- 统一管理多种代码检查/格式化工具（如 black、flake8、isort、eslint、stylelint 等）
- 支持多语言、多平台
- 配置简单，易于团队协作
- 可自定义钩子脚本

## 安装与使用

### 1. 安装 pre-commit
```sh
pip install pre-commit
```

### 2. 添加配置文件
在项目根目录新建 `.pre-commit-config.yaml`，例如：
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
```

### 3. 安装 Git 钩子
```sh
pre-commit install
```

### 4. 手动检查所有文件
```sh
pre-commit run --all-files
```

## 常见用法
- 自动格式化 Python 代码
- 检查并修复行尾空格、文件结尾换行
- 检查 YAML/JSON/Markdown 等文件格式
- 前端项目可集成 eslint、stylelint 等

## 进阶技巧
- 支持本地自定义钩子（shell/python 脚本）
- 支持多语言项目和 monorepo
- 可与 CI/CD 集成，保证远程仓库代码质量

## 参考资料
- [pre-commit 官方文档](https://github.com/pre-commit/pre-commit)

---

> pre-commit 是现代团队协作和代码质量保障的利器，推荐所有项目集成。
