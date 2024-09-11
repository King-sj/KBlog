import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
      collapsible: true,
    },
    "intro",
    {
      text: "课文",
      icon: "book",
      prefix: "classBook/",
      children: "structure",
      collapsible: true,
    },
  ],
});
