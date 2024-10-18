import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "intro",
  ],
  "/tech/":[
    {
      text: "技术",
      children:"structure",
      collapsible: true,
    }
  ],
  "/essay/":[
    {
      text:"随笔",
      children:"structure",
      collapsible:true,
    },
  ],
  "/tutorials/":[
    {
      text: "教程",
      children:"structure",
      icon: "book",
      collapsible:true,
    }
  ],
});
