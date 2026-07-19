---
title: GitHub 图床搭建指南
date: 2024-11-01
category: ["工具"]
tags: ["GitHub", "图床", "jsDelivr", "CDN", "PicGo"]
summary: 使用 GitHub + jsDelivr CDN 搭建免费高速图床。
---

# GitHub 图床搭建指南

写博客时经常需要插入图片，直接放在本地目录会让仓库越来越大，而且迁移不方便。使用图床可以集中管理图片，让博客仓库保持轻量。

<!-- more -->

## 为什么用 GitHub 做图床

GitHub 图床的优点是**免费**、**稳定**、**不限制带宽**。配合 jsDelivr CDN，国内访问速度也不错。缺点是不能存放敏感图片（公开仓库），单文件限制 100MB。

相比其他免费图床（如路过图床、SM.MS），GitHub 方案的优点是数据完全由自己掌控，不用担心服务跑路。

## 搭建步骤

### 1. 创建图片仓库

在 GitHub 新建一个 Public 仓库（例如 `blog-images`），用来存放所有图片。

### 2. 上传图片并获取 URL

将图片推送到仓库后，可以通过 jsDelivr 获取 CDN 加速链接：

```text
https://cdn.jsdelivr.net/gh/{用户名}/{仓库名}@{分支名}/{文件路径}
```

例如：

```text
https://cdn.jsdelivr.net/gh/user/blog-images@main/2024/screenshot.png
```

### 3. 配合 PicGo 自动上传

手动先上传到 GitHub 再复制链接比较繁琐，推荐配合 [PicGo](https://github.com/Molunerfinn/PicGo) 实现截图自动上传。

PicGo 配置步骤：

1. 安装 PicGo 客户端
2. 在插件设置中搜索 `github`，安装 `github-plus` 上传器
3. 在 GitHub 生成一个 [Personal Access Token](https://github.com/settings/tokens/new)，勾选 `repo` 权限
4. 在 PicGo 中配置：
   - 仓库名：`用户名/仓库名`
   - 分支名：`main`
   - Token：上一步生成的 Token
   - 存储路径：`img/`（可自定义）
   - 自定义域名：`https://cdn.jsdelivr.net/gh/用户名/仓库名@main`

配置完成后，截图直接拖入 PicGo 即可自动上传并将 Markdown 链接复制到剪贴板。

### 4. 注意事项

- 不要上传敏感或私密图片（公开仓库所有人都能看到）
- 建议按年或按月分目录存放，方便管理（如 `img/2024/01/`）
- GitHub 对仓库大小有限制（建议控制在 1GB 以内），超过可考虑用 Release 存放
- jsDelivr 有缓存机制，更新同名图片后需要刷新 CDN 缓存（URL 后加 `?v=xxx` 或修改文件名）

## 替代方案对比

| 方案 | 免费 | 速度 | 稳定性 | 说明 |
|------|------|------|--------|------|
| GitHub + jsDelivr | 是 | 中 | 高 | 推荐，需要 GitHub 账号 |
| 阿里云 OSS | 付费 | 高 | 高 | 按量付费，国内最快 |
| 七牛云 | 部分免费 | 高 | 中 | 免费额度 10GB，需备案域名 |
| 路过图床 | 是 | 低 | 低 | 无需注册，但随时可能跑路 |
| SM.MS | 免费 | 中 | 中 | 有 5MB 单文件限制 |

## 总结

GitHub + jsDelivr 是最省心、零成本的个人博客图床方案。配合 PicGo 能大幅提升写博客时插入图片的效率。

## 参考

- [知乎：GitHub + PicGo 搭建图床](https://zhuanlan.zhihu.com/p/347342082)
- [PicGo 官方文档](https://picgo.github.io/PicGo-Doc/)
