import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  "/",
  "/home",
  { text: "博客", icon: "linter", link: "/category/" },
  {
    text: "算法",
    icon: "bit",
    prefix: "/algorithm/",
    children: [
      {
        text: "数据结构",
        icon: "stack",
        link: "data_struct/"
      },
      {
        text: "算法",
        icon: "bit",
        link: "details/"
      },
    ]
  },
  { text: "Python", icon: "python", link: "/python/" },
  { text: "Linux", icon: "linux", link: "/linux/" },
  {
    text: "Others",
    icon: "wrap",
    prefix: "/others/",
    children: [
      {
        text: "Tools",
        icon: "material",
        link: "tools/"
      }
    ]
  },
  {
    text: "主题文档",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/zh/",
  },
]);
