---
title: GitHub SSH 连接被拒问题解决
categories:
  - Git
  - SSH
  - 踩坑
  - Windows
  - 网络
---

# 坑：ssh: connect to host github.com port 22: Connection refused

在 Windows（或部分网络环境）下，使用 Git 命令操作 GitHub 项目时，可能遇到如下错误：

```
ssh: connect to host github.com port 22: Connection refused
```

## 问题原因
- 端口 22 被防火墙/运营商/公司网络屏蔽，导致无法通过默认 SSH 端口连接 GitHub。
- 常见于校园网、公司网、部分宽带环境。

## 解决方法

### 1. 改用 HTTPS 方式
- 推荐直接将远程仓库地址改为 HTTPS，避免 SSH 端口问题。
- 命令：
```sh
git remote set-url origin https://github.com/用户名/仓库名.git
```

### 2. 使用 SSH 端口 443 代理
GitHub 支持通过端口 443 建立 SSH 连接。
- 修改 `~/.ssh/config`，添加如下内容：

```
Host github.com
  HostName ssh.github.com
  User git
  Port 443
```

- 之后正常使用 `git clone`、`git push` 等命令即可。

### 3. 检查本地防火墙/代理
- 关闭本地防火墙或安全软件的端口限制。
- 检查是否有代理软件影响 SSH 连接。

### 4. 公司/校园网环境建议
- 可尝试手机热点、VPN 等方式规避网络限制。

## 参考资料
- [知乎：ssh: connect to host github.com port 22: Connection refused](https://zhuanlan.zhihu.com/p/521340971)
- [GitHub 官方文档](https://docs.github.com/zh/authentication/troubleshooting-ssh/)

---

> 本文档由 VuePress 2.x 生成，适合 Git/SSH 踩坑与经验分享。
