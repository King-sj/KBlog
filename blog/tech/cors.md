---
title: CORS（跨域资源共享）
date: 2025-06-26
categories:
  - 前端
  - 安全
---

# CORS（跨域资源共享）

CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种浏览器的安全机制，用于允许服务器声明哪些源可以访问资源，从而实现跨域访问控制。

## 为什么需要 CORS
浏览器的同源策略（Same-Origin Policy）限制了不同源之间的资源访问，防止恶意网站窃取数据。但实际开发中，前后端分离、API 网关等场景常常需要跨域访问，这时就需要 CORS。

## CORS 工作原理
1. **预检请求（OPTIONS）**：对于非简单请求，浏览器会先发送 OPTIONS 请求，询问服务器是否允许跨域。
2. **响应头**：服务器通过设置 `Access-Control-Allow-Origin`、`Access-Control-Allow-Methods`、`Access-Control-Allow-Headers` 等响应头，告知浏览器允许的跨域策略。
3. **实际请求**：预检通过后，浏览器才会发送实际的跨域请求。

## 常见响应头说明
- `Access-Control-Allow-Origin`: 指定允许访问的源（如 `*` 或具体域名）。
- `Access-Control-Allow-Methods`: 允许的 HTTP 方法（如 `GET, POST, PUT`）。
- `Access-Control-Allow-Headers`: 允许的自定义请求头。
- `Access-Control-Allow-Credentials`: 是否允许携带 Cookie。

## 示例
**后端（Node.js Express）实现 CORS：**

```js
const express = require('express');
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
```

**前端请求示例：**

```js
fetch('https://api.example.com/data', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## 注意事项
- `Access-Control-Allow-Origin` 不能与 `*` 和 `credentials: true` 同时使用。
- 只有服务器设置了正确的 CORS 响应头，浏览器才允许跨域。
- CORS 只影响浏览器，服务端到服务端的请求不受影响。

## 常见问题排查
- 检查响应头是否正确设置。
- 检查是否有预检请求被拒绝。
- 检查是否有跨域 Cookie 问题。

---

> 本文档由 VuePress 2.x 生成，支持代码高亮与 markdown 增强。
