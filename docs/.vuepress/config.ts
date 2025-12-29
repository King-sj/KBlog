import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import theme from './theme.js'
import path from "path";

export default defineUserConfig({
    title: 'kblog',
    description: "KSJ-blog",
    bundler: viteBundler(),
    theme,
    // 将主页和博客首页的组件重定向到自定义组件
    // https://theme-hope.vuejs.press/zh/guide/advanced/replace.html#%E5%8D%9A%E5%AE%A2%E7%BB%84%E4%BB%B6
    alias: {
        // "@theme-hope/modules/blog/components/BlogHero": path.resolve(
        //     __dirname,
        //     "./components/BlogHero.vue",
        // ),
        // "@theme-hope/components/HomePage": path.resolve(
        //     __dirname,
        //     "./components/HomePage.vue",
        // ),
    },
});



