---
title: CMake 在 Linux/VSCode 下的常见问题与解决
categories:
  - C++
  - 构建工具
  - VSCode
  - Linux
  - 踩坑
---

# CMake 在 Linux/VSCode 下的常见问题与解决

## 问题描述
CMake Error: Could not create named generator MinGW Makefiles

该错误常见于 VSCode 配置 CMake 项目时，CMake 默认生成器设置为 MinGW Makefiles，但当前环境（如 macOS、Linux）并不支持 MinGW。

## 解决方法
在 `.vscode/settings.json` 中指定合适的生成器，例如：

```json
{
  "cmake.generator": "Unix Makefiles"
}
```

- 对于 macOS/Linux，推荐使用 `Unix Makefiles` 或 `Ninja`。
- Windows 下可用 `MinGW Makefiles` 或 `Visual Studio ...`。

## 其他建议
- 确认已安装 `make` 或 `ninja` 工具。
- 可通过 `cmake --help` 查看本机支持的生成器列表。
- 若使用 VSCode CMake Tools 插件，建议在“命令面板”中选择“CMake: Select a Kit”并重新配置。

## 常见命令
```sh
# macOS/Linux 安装 make
sudo apt install make        # Ubuntu/Debian
brew install make            # macOS (Homebrew)

# 安装 ninja
sudo apt install ninja-build # Ubuntu/Debian
brew install ninja           # macOS
```

