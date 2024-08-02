https://ionic.nodejs.cn/vue/your-first-app/deploying-mobile/#google_vignette

Capacitor是一个开源的并且在Native端运行的跨平台的web应用。
使用JavaScript、HTML和CSS创建跨平台iOS、Android和渐进式Web应用程序。
很好的将Cordova迁移到Capacitor，因为它99%的向后兼容Cordova。

# 默认不支持HTTP
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