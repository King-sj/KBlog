import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
// import { MR_HOPE_AVATAR } from "./logo.js";

export default hopeTheme({
  hostname: "https://github.com/King-sj",

  author: {
    name: "KSJ",
    url: "https://github.com/King-sj",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo.svg",

  repo: "https://github.com/King-sj/KBlog",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "<a href='https://beian.miit.gov.cn'>黔ICP备2024025117号-1</a> | 版权所有 © 2024-至今 KSJ ",
  displayFooter: true,
  copyright: "MPL-2.0 许可证",
  // 博客相关
  blog: {
    description: "一位热衷于探索全栈开发领域的技术爱好者，擅长将前端与后端技术无缝结合，致力于打造高效、优雅的解决方案。",
    intro: "/intro.html",
    medias: {
      Email: "mailto:info@example.com",
      GitHub: "https://github.com/King-sj",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/encrypt/": ["1234"],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,
    searchPro: {
      indexContent: true,
      filter: (page) => {
        return true
        // TODO(SJ) 一下代码会报错
        if (page.path == null) return true
        return !page.path.startsWith('/encrypt');
      },
    },
    comment: {
      provider: 'Giscus', // Artalk | Giscus | Waline | Twikoo
      repo: "King-sj/KBlog",
      repoId: "R_kgDOL41Gpw",
      category: "Q&A",
      categoryId: "DIC_kwDOL41Gp84CiYFP",
      lazyLoading: true,
      // <script src="https://giscus.app/client.js"
      // data - repo="King-sj/KBlog"
      // data - repo - id="R_kgDOL41Gpw"
      // data - category="Q&A"
      // data - category - id="DIC_kwDOL41Gp84CiYFP"
      // data - mapping="pathname"
      // data - strict="0"
      // data - reactions - enabled="1"
      // data - emit - metadata="0"
      // data - input - position="top"
      // data - theme="preferred_color_scheme"
      // data - lang="zh-CN"
      // data - loading="lazy"
      // crossorigin = "anonymous"
      // async >
      //   </script>

    },

    components: {
      components: ["Badge", "VPCard"],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      tasklist: true,
      vPre: true,

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
