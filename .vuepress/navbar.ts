import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  "/",
  "/home",
  { text: "博客", icon: "creative", link: "/blogs/" },
  {
    text: "算法",
    icon: "creative",
    prefix: "/algorithm/",
    children: [
      {
        text: "数据结构",
        icon: "creative",
        link: "data_struct/"
      },
      {
        text: "算法",
        icon: "code",
        link: "details/"
      },
    ]
  },
  { text: "Python", icon: "code", link: "/python/" },
  {
    text: "Others",
    icon: "edit",
    prefix: "/others/",
    children: [
      {
        text: "Tools",
        icon: "edit",
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
