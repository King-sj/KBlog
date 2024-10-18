---
date: 2024-09-12
tags:
  - docker
categories:
  - 奇技淫巧
  - docker
---

[[toc]]

# docker in wsl

转载自：[docker wsl2 踩坑记录 | 唯独你没懂，居然把路径藏在这里](https://blog.csdn.net/Tighway/article/details/111304261)

## docker wsl2 踩坑记录 | 唯独你没懂，居然把路径藏在这里

最新推荐文章于 2024-06-30 17:39:23 发布

![](https://csdnimg.cn/release/blogv2/dist/pc/img/original.png)

[TieWay59](https://blog.csdn.net/Tighway "TieWay59") ![](https://csdnimg.cn/release/blogv2/dist/pc/img/newCurrentTime2.png) 最新推荐文章于 2024-06-30 17:39:23 发布

版权声明：本文为博主原创文章，遵循 [CC 4.0 BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) 版权协议，转载请附上原文出处链接和本声明。

## docker wsl2 踩坑记录

### docker-desktop 是什么

> [Docker Desktop WSL 2 backend](https://docs.docker.com/docker-for-windows/wsl/)
>
> [What is the docker-desktop-data distro](https://stackoverflow.com/questions/61396989/what-is-the-docker-desktop-data-distro-used-for-when-running-docker-desktop-with)

简单地说，使用 docker-desktop-wsl 方式使用 docker，会给你创建两个 wsl distro。一个包含 docker/docker-desktop 服务本体，一个用于存储附属的数据（比如 images 等）。

> 这中间就会导致 docker 文件的实际位置很奇怪，我还没有研究透。

官方推荐的 win10 下的实践是：你的用 docker-desktop 设置把你主机 docker 集成到某个 distro(wsl 可以使用的 linux 发行版，我的是 Ubuntu)。然后在 win10 的开发环境去 remote 连接你的 Ubuntu。

这样你就能用 win10 的图形界面，在 linux 的环境下，进行包含 docker 的开发过程了。

### wsl 里的 docker 到底在哪里

> [Docker volumes on Windows WSL2](https://stackoverflow.com/questions/63552052/docker-volumes-on-windows-wsl2)
>
> [Locating data volumes in Docker Desktop (Windows)](https://stackoverflow.com/questions/43181654/locating-data-volumes-in-docker-desktop-windows/64418064#64418064)
>
> More generally `/var/lib/docker/` maps to `\\wsl$\docker-desktop-data\version-pack-data\community\docker\`.

简单地说，打开 win10 文件管理器，输入：

```url
\\wsl$\docker-desktop-data\version-pack-data\community\docker\
```

去 inspect 得到的`/var/lib/docker/...`都是在这个路径下的。


# 修改docker ip 绑定参考

https://www.cnblogs.com/kingsonfu/p/11578073.html

文件目录：```\\wsl$\docker-desktop-data\data\docker\containers```
