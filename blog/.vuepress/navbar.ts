import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/tech/",
  "/essays/",
  "/projects/",
  "/tutorials/",
  "/resources/",
  {
    text: '友链',
    children: [
      {
        text: 'KSJ-Blog',
        link: 'https://bupt.online',
      },
      {
        text: 'KSJ-Blog-GitHub',
        link: 'https://king-sj.github.io',
      },
    ],
  },
]);
