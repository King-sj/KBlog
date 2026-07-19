---
title: GitHub Actions 本地调试
date: 2024-08-02
category: ["CI/CD"]
tags: ["CI/CD", "GitHub Actions", "act", "Docker"]
summary: 使用 act 工具在本地调试 GitHub Actions 工作流，避免反复提交触发 CI。
---

# GitHub Actions 本地调试

调试 GitHub Actions 最头疼的问题是每次改完 workflow 都要 `git push` 触发，失败了再改再 push ~~无限循环~~。有没有办法在本地跑 CI？

答案是 [act](https://github.com/nektos/act)，一个可以本地运行 GitHub Actions 的工具。

<!-- more -->

## 为什么需要本地调试

写 Actions workflow 时的典型痛苦流程：

```text
写 workflow → push → 等 CI 跑 → 失败 → 看日志 → 改 workflow → push → 等 CI 跑 → ...
```

每一步循环可能要等几分钟，调试效率极低。本地运行可以秒级反馈。

## 安装 act

macOS：

```sh
brew install act
```

Linux：

```sh
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

Windows（需要先安装 Docker Desktop）：

```sh
choco install act-cli
```

> `act` 依赖 Docker 来模拟 GitHub Actions 的运行环境，确保本地已安装 Docker 并正在运行。

## 基本用法

### 列出可用的 workflow

```sh
act -l
```

### 运行指定 job

```sh
act -j build
```

### 模拟 push 事件

```sh
act push
```

### 模拟 pull_request 事件

```sh
act pull_request
```

## 管理 Secrets 和变量

GitHub Actions 的环境变量和 Secrets 在本地需要手动提供。

创建配置文件目录：

```sh
mkdir -p .act
```

### .act/.vars — 环境变量

```text
AWS_REGION=us-east-1
DEPLOY_ENV=staging
```

### .act/.secrets — 密钥（不提交 Git）

```text
NPM_TOKEN=npm_xxxxx
AWS_ACCESS_KEY_ID=AKIAXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
```

### .act/.env — dotenv 格式

```text
# 类 dotenv 格式的环境变量
MY_CUSTOM_VAR=hello
```

使用这些文件运行 act：

```sh
act --var-file "./.act/.vars" --secret-file "./.act/.secrets" --env-file "./.act/.env"
```

**重要**：`.act/.secrets` 包含敏感信息，务必加入 `.gitignore`：

```text
.act/.secrets
.act/.env
```

## 常见问题

### 镜像过大

act 默认拉取完整的 `ubuntu-latest` Docker 镜像（约 20GB+）。首次运行会比较慢，后续使用缓存会快很多。

可以用轻量镜像加速：

```sh
act -P ubuntu-latest=catthehacker/ubuntu:act-latest
```

### 权限问题

如果 workflow 中有需要 sudo 的命令，加上 `--container-options`：

```sh
act --container-options "--privileged"
```

### 某些 action 不支持

act 不是 GitHub Actions 的 100% 复刻，部分 GitHub 专属功能（如 GitHub Packages、GitHub Pages 部署）可能无法在本地运行。对于这类场景，只能推到 GitHub 验证。

### 交互式调试

在 workflow 中添加 `tmate` 或 `action-upterm` 可以进入交互式调试模式：

```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
```

act 也支持这个 action，运行后会在终端中给出 SSH 连接地址，可以直接登录到容器中调试。

## 总结

act 不能完全替代真实 CI 环境，但它能帮你快速验证大多数 workflow 配置，把"改→push→等→失败"的循环缩短为"改→run→失败"。

日常使用建议：本地用 act 快速迭代 → push 前跑一遍完整 workflow → GitHub 上做最终验证。

## 参考

- [act GitHub 仓库](https://github.com/nektos/act)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
