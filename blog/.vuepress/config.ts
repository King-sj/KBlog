import { defineUserConfig } from "vuepress";
// import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "博客",
  description: "KSJ 的博客",
  port: 8083,
  theme,
  plugins:[
  ]
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
