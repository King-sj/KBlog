---
title: 使用capacitor和ionic将vue项目迁移到mobile端
tag:
  - mobile
---

# 前言

当我们写完了vue项目后，想做一个一样的移动app，此时我们可以使用ionic无缝将其迁移到移动端。

<!-- more -->

## 安装

[Capacitor](https://capacitorjs.com/)

[ionic](https://ionic.nodejs.cn/)

## tips

[deploy](https://ionic.nodejs.cn/vue/your-first-app/deploying-mobile)

每次执行更新你的 Web 目录的构建（例如 ionic build）时（默认：build)，你需要将这些更改复制到你的原生项目中：

ionic cap copy

注意：更新代码的原生部分（例如添加新插件）后，使用 sync 命令：

```sh
ionic cap sync
```

::: info
vscode中可以使用"ionic"插件
:::


* 默认不支持HTTP
```
const config: CapacitorConfig = {
  plugins:{
    CapacitorHttp:{
      enabled:true,
    }
  },
  android:{
    allowMixedContent: true,
  }
};
```

## bug 记录

+ 使用 vscode ionic打包后的相对路径不正确， 手动修改后可正常运行

::: important
用Android Studio时不能打开360手机助手，会和ADB冲突
:::
