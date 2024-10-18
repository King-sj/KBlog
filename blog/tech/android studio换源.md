---
title: android studio换源
date: 2024-08-02
categories:
  - build-tools
---

# gradle

[国内镜像](https://mirrors.cloud.tencent.com/gradle/)

Android Studio下载gradle太慢可换源

[android.plugin version 下载错误查看](https://blog.csdn.net/qq_43811536/article/details/139447518)

**修改 settings.gradle.kts**
```
pluginManagement {
    repositories {
        maven { url=uri ("https://jitpack.io") }
        maven { url=uri ("https://maven.aliyun.com/repository/releases") }
//        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url=uri ("https://maven.aliyun.com/repository/google") }
        maven { url=uri ("https://maven.aliyun.com/repository/central") }
        maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin") }
        maven { url=uri ("https://maven.aliyun.com/repository/public") }
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven { url=uri ("https://jitpack.io") }
        maven { url=uri ("https://maven.aliyun.com/repository/releases") }
//        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url=uri ("https://maven.aliyun.com/repository/google") }
        maven { url=uri ("https://maven.aliyun.com/repository/central") }
        maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin") }
        maven { url=uri ("https://maven.aliyun.com/repository/public") }
        google()
        mavenCentral()
    }
}
```

**gradle-wrapper.properties
换成对应的版本**
```
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.7-all.zip
```
