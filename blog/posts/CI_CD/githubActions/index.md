---
date: 2024-08-02
category:
  - CI/CD
tag:
  - CI/CD
---

# Github Actions

本地调试工具 [act](https://github.com/nektos/act)

需要创建配置文件
![alt text](image-1.png)
也可另外指定
```sh
act --var-file "./.act/.vars" --secret-file "./.act/.secrets" --env-file "./.act/.env" {{other}}
```