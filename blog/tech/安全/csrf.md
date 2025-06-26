---
title: CSRF（跨站请求伪造）
date: 2025-06-26
categories:
  - 安全
---
# 跨站请求伪造（CSRF）

CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种攻击方式，攻击者诱导已登录受信任网站的用户，在不知情的情况下发送恶意请求，从而在用户已认证的情况下执行非本意的操作。

## 原理

攻击者通过构造与受害网站相同的请求，诱导用户点击链接或访问页面，利用用户已登录的身份在后台发起请求，达到攻击目的。

## 错误编码示例

如下是易受 CSRF 攻击的 Kotlin 后端代码示例：

```kotlin
// 未做任何 CSRF 防护的 Spring Controller
@RestController
class TransferController {

    @PostMapping("/transfer")
    fun transfer(
        @RequestParam to: String,
        @RequestParam amount: Int
    ): String {
        // 直接处理转账请求，未校验 CSRF Token
        // 实际业务逻辑略
        return "转账成功"
    }
}
```

上述代码没有对 CSRF Token 进行校验，攻击者可诱导用户在已登录状态下发起恶意请求，导致资金被盗。

## 安全编码方式

1. 校验 Referer 或 Origin 头部。
2. 使用 CSRF Token（推荐）。
3. 对敏感操作要求二次验证。

**CSRF Token 示例：**

```html
<form action="/transfer" method="POST">
  <input name="to" value="attacker" />
  <input name="amount" value="1000" />
  <input type="hidden" name="csrf_token" value="{{csrf_token}}" />
  <button type="submit">转账</button>
</form>
```

## 攻击例子

攻击者可通过如下方式诱导用户发起请求：

```html
<img src="https://bank.com/transfer?to=attacker&amount=1000" style="display:none;" />
```

或伪造表单自动提交：

```html
<form action="https://bank.com/transfer" method="POST" id="csrfForm">
  <input name="to" value="attacker" />
  <input name="amount" value="1000" />
</form>
<script>document.getElementById('csrfForm').submit();</script>
```
