import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  "/",
  "/home",
  { text: "Blog", icon: "linter", link: "/category/" },
  {
    text: "Algorithm",
    icon: "bit",
    prefix: "/algorithm/",
    children: [
      {
        text: "Data Struct",
        icon: "stack",
        link: "data_struct/"
      },
      {
        text: "Algorithm",
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
      },
      { 
        text: "Temp", 
        icon: "any",
        link: "tmp/"
      }
    ]
  },
  {
    text: "主题文档",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/zh/",
  },
]);
