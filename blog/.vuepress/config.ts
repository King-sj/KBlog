import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { oml2dPlugin } from 'vuepress-plugin-oh-my-live2d';
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "blog",
  description: "KSJ-blog",
  port: 8083,
  theme,
  plugins: [
    oml2dPlugin({
      models: [
        {
          "path": "https://model.oml2d.com/HK416-1-normal/model.json",
          "position": [0, 60],
          "scale": 0.08,
          "stageStyle": {
            "height": 450
          }
        }
      ]
    })
  ],
  alias: {
    "@theme-hope/modules/blog/components/BlogHero": path.resolve(
      __dirname,
      "./components/BlogHero.vue",
    ),
    "@theme-hope/components/HomePage": path.resolve(
      __dirname,
      "./components/HomePage.vue",
    ),
  },
});

