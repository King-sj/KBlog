# ssl 证书申请
acme.sh 申请免费 ssl 证书

## 准备工作

- 域名
- 服务器
- 域名解析
- 服务器上安装 acme.sh


## 申请证书

```bash
acme.sh --issue -d example.com -w /var/www/html
```

## 自动续期

```bash
acme.sh --cron --home /etc/acme.sh
```

## 证书续期

```bash
acme.sh --renew -d example.com
```

## 证书安装

```bash
acme.sh --install-cert -d example.com --key-file /etc/nginx/ssl/example.com.key --fullchain-file /etc/nginx/ssl/example.com.crt --reloadcmd "service nginx force-reload"
```
