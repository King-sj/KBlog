---
date: 2024-09-12
category: docker
tag:
  - docker
---

## GitHub Container Registry 加速

### ghcr.io简介
+ ghcr.io 是 GitHub Container Registry 的域名。GitHub Container Registry 是 GitHub 提供的容器镜像注册表服务，允许开发者在 GitHub 上存储、管理和分享 Docker 镜像。它与 GitHub 代码仓库紧密集成，可以使用相同的权限管理、团队协作和版本控制工具来管理容器镜像。
+ 通过 GitHub Container Registry，开发者可以方便地将他们的容器镜像与代码仓库关联起来，这样就可以在同一个平台上管理代码和镜像。这种集成性使得持续集成/持续交付 (CI/CD) 流程更加简化和统一，开发团队可以更容易地构建、测试和部署应用程序。
+ 对于使用 GitHub 作为代码托管平台的开发者来说，GitHub Container Registry 提供一个便捷且强大的容器镜像管理解决方案。通过该服务，可以更轻松地构建和部署容器化的应用程序，从而加速开发和交付周期。
### 镜像地址
https://ghcr.nju.edu.cn
### 配置方法
```sh
sudo vim /etc/docker/daemon.json
```
```json
{
  "registry-mirrors": ["https://ghcr.nju.edu.cn"]
}
```
**:wq**保存退出
```
sudo systemctl daemon-reload
sudo systemctl restart docker
```
拉取镜像方法
```sh
docker pull ghcr.nju.edu.cn/open-webui/open-webui:main
```

## docker wsl2 容器目录

```
\\wsl$\docker-desktop-data\data\docker\containers
```
