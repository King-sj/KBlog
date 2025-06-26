---
title: PostMan 使用细节与技巧
categories:
  - 接口测试
  - 工具
  - 前端
  - 后端
  - 实用技巧
---

# PostMan 使用细节

PostMan 是一款强大的 API 接口调试与自动化测试工具，广泛用于前后端联调、接口文档管理、自动化测试等场景。

## 常见用法

### 1. POST 请求

#### json 传参
1. 需要手动在 Headers 中携带 `Content-Type=application/json` 参数
   ![Content-Type](image-23.png)
2. 需要手动在 body 中选择 `raw` 并填写 json 数据
   ![raw-json](image-24.png)

#### x-www-form-urlencoded 传参
- 选择 `x-www-form-urlencoded`，参数以表单形式填写，PostMan 会自动设置 Content-Type。

#### form-data 传参（文件上传）
- 选择 `form-data`，可上传文件和普通字段。

### 2. GET 请求
- 参数直接拼接在 URL 后，或在 Params 选项卡填写。

### 3. 环境变量与全局变量
- 可在“环境”中定义变量，支持多环境切换。
- 变量引用格式：`{{var_name}}`

### 4. 脚本与自动化
- Pre-request Script：请求前自动执行 JS 脚本。
- Tests：请求后自动断言、提取数据。

### 5. 常见问题
- 中文乱码：检查编码设置，必要时在 Headers 添加 `Accept-Charset: utf-8`。
- 跨域问题：PostMan 不受浏览器同源策略限制。
- Cookie/Token 自动携带：可在“Cookies”或“Headers”中手动设置。

## 进阶技巧
- 支持接口集合、自动化测试、Mock 服务、接口文档导出。
- 支持导入 Swagger/OpenAPI、HAR、cURL 等多种格式。
- 支持团队协作与云同步。

## 替代方案
- Insomnia、Apifox、Hoppscotch 等。

---

> PostMan 是开发、测试、运维等角色必备的接口调试与自动化工具。
