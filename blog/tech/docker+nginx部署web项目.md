---
author: King-sj
date: 2024-09-16
category:
  - nginx
tag:
  - 部署
star: true
---

[[toc]]

# docker + nginx + acme.sh 部署 vue/flask 项目

本文将介绍如何使用 Docker、Nginx 和 acme.sh 部署一个 Vue 和 Flask 项目。我们将详细讲解环境配置、项目结构、Nginx 配置、Docker 配置以及如何升级到 HTTPS。
<!-- more -->
::: tip
需要先申请一个域名，本文是 bupt.online
:::

## 环境

+ Ubuntu
+ Docker
+ Docker-Compose
+ acme.sh
+ (python)
+ nginx

## 项目结构
```tree
./nginx
├── acme  # 存放SSL证书
├── conf.d
│   ├── Automaton.conf
│   ├── blog.conf
├── docker-compose.yml
├── DockerFile
├── logs # 存放日志
│   ├── access.log
│   ├── Automaton
│   ├── blog
│   └── error.log
├── nginx.conf
./project # 要部署的（前端）项目
├── Automaton
└── blog
```

## 配置http服务

在准备好前端项目及安装相应环境后，进行如下操作(**部分路径以实际为准，进行修改**)
### 配置nginx

**nginx.conf**
```yml
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
  worker_connections  4096;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

  # access_log  /var/log/nginx/access.log  main;
  access_log off;
  error_log /var/log/nginx/error.log warn;

  sendfile        on;
  #tcp_nopush     on;

  keepalive_timeout  65;

  # 定义DNS解析器
  resolver 8.8.8.8 114.114.114.114 valid=300s;
  resolver_timeout 10s;
  # 增加请求头和Cookie的大小限制
  client_header_buffer_size 16k;
  large_client_header_buffers 4 32k;

  include /etc/nginx/conf.d/*.conf;
}
```

**Automaton.conf**
```yml
server {
  listen 80;
  server_name Automaton.bupt.online;
  location / {
    root /usr/share/nginx/html/Automaton;
    try_files $uri $uri/ =404;
  }
  access_log /var/log/nginx/Automaton/access.log;
  error_log /var/log/nginx/Automaton/error.log warn;
}
```
**blog.conf**
```yml
server {
  listen 80;
  server_name bupt.online www.bupt.online;

  location / {
    root /usr/share/nginx/html/blog;
    try_files $uri $uri/ =404;
    # access_log /var/log/nginx/blog/access.log;
    error_log /var/log/nginx/blog/error.log warn;
  }

  location /Automaton {
    # 使用 proxy_pass 或 rewrite 重定向到Automaton.bupt.online 失败
    alias /usr/share/nginx/html/Automaton/;
    try_files $uri $uri/ =404;
    # access_log /var/log/nginx/Automaton/access.log;
    error_log /var/log/nginx/Automaton/error.log warn;
  }
}
```
### 配置docker
**DockerFile**
```docker
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d
```
**docker-compose.yml**
```yml
services:
  nginx:
    build:
      context: .
      dockerfile: DockerFile
    ports:
      - "80:80"
      - "443:443"

    volumes:
      - ../project/blog:/usr/share/nginx/html/blog
      - ../project/Automaton:/usr/share/nginx/html/Automaton
      - ./logs:/var/log/nginx
      - ./conf.d:/etc/nginx/conf.d
      - ./acme:/etc/letsencrypt/live
    networks:
      - webnet

    environment:
      - TZ=Asia/Shanghai

networks:
  webnet:
```

### 启动项目
```sh
docker-compose up -d --build
```
然后就能正常访问 http://bupt.online 及 http://automaton.bupt.online ， http://bupt.online/Automaton

## 升级为https

### 申请证书
进入acme.sh的安装目录(/root/.acme.sh)
```sh
sudo su root
acme.sh  --issue  -d bupt.online  --nginx   # Nginx
acme.sh  --issue  -d Automaton.bupt.online  --nginx   # Nginx
```
#### 安装证书
这里将目录修改为目标目录
```sh
# sudo su root
# cd .acme.sh
# use like below
acme.sh --install-cert -d bupt.online \
--cert-file      /home/ubuntu/nginx/acme/bupt.online/cert.cer  \
--key-file        /home/ubuntu/nginx/acme/bupt.online/privkey.key \
--fullchain-file  /home/ubuntu/nginx/acme/bupt.online/fullchain.cer \
--reloadcmd     "cd /home/ubuntu/nginx && docker-compose up -d --build"
```

### 修改配置
**blog.conf**
```yml
server {
  listen 80;
  server_name bupt.online www.bupt.online;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name bupt.online;

  ssl_certificate /etc/letsencrypt/live/bupt.online/fullchain.cer;
  ssl_certificate_key /etc/letsencrypt/live/bupt.online/privkey.key;

  location / {
    root /usr/share/nginx/html/blog;
    try_files $uri $uri/ =404;
    # access_log /var/log/nginx/blog/access.log;
    error_log /var/log/nginx/blog/error.log warn;
  }

  location /Automaton {
    # 使用 proxy_pass 或 rewrite 重定向到Automaton.bupt.online 失败
    alias /usr/share/nginx/html/Automaton/;
    try_files $uri $uri/ =404;
    # access_log /var/log/nginx/Automaton/access.log;
    error_log /var/log/nginx/Automaton/error.log warn;
  }
}

server {
  listen 443 ssl;
  server_name www.bupt.online;

  ssl_certificate /etc/letsencrypt/live/www.bupt.online/fullchain.cer;
  ssl_certificate_key /etc/letsencrypt/live/www.bupt.online/privkey.key;


  location / {
    root /usr/share/nginx/html/blog;
    try_files $uri $uri/ =404;
    # access_log /var/log/nginx/blog/access.log;
    error_log /var/log/nginx/blog/error.log warn;
  }

  location /Automaton {
    # 使用 proxy_pass 或 rewrite 重定向到Automaton.bupt.online 失败
    alias /usr/share/nginx/html/Automaton/;
    try_files $uri $uri/ =404;
    # access_log /var/log/nginx/Automaton/access.log;
    error_log /var/log/nginx/Automaton/error.log warn;
  }
}
```
**Automaton.conf**
```yml
server {
  listen 80;
  server_name Automaton.bupt.online;
  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl;
  server_name Automaton.bupt.online;
  ssl_certificate /etc/letsencrypt/live/Automaton.bupt.online/fullchain.cer;
  ssl_certificate_key /etc/letsencrypt/live/Automaton.bupt.online/privkey.key;
  location / {
    root /usr/share/nginx/html/Automaton;
    try_files $uri $uri/ =404;
  }
  access_log /var/log/nginx/Automaton/access.log;
  error_log /var/log/nginx/Automaton/error.log warn;
}
```
### 重启container
```sh
docker-compose up -d --build
```

## 配置nginx反向代理，使flask支持 https

#TODO - 添加flask+nginx配置

# 改进方向

[ ] 将卷的挂载目录改为由命令输入，而不是硬编码

## 参考资料

1. [Nginx Documentation](https://nginx.org/en/docs/)
2. [Flask Documentation](https://flask.palletsprojects.com/en/2.0.x/)
3. [Reverse Proxy Guide](https://www.digitalocean.com/community/tutorials/understanding-nginx-http-proxying-load-balancing-buffering-and-caching)
4. [SSL Certificates](https://letsencrypt.org/getting-started/)
5. [用acme.sh帮你免费且自动更新的HTTPS证书，省时又省力](https://zhuanlan.zhihu.com/p/347064501)
6. [docker部署certbot与nginx来获取ssl证书添加https及自动更新](https://www.cnblogs.com/vishun/p/15746849.html)
7. [使用docker acme申请、续订泛域名证书，并自动重载docker nginx](https://sleele.com/2021/04/15/docker-acme-with-docker-nginx/)
8. [Flask: 如何给Python Flask Web服务器添加HTTPS功能](https://geek-docs.com/flask/flask-questions/4_flask_can_you_add_https_functionality_to_a_python_flask_web_server.html#google_vignette)
