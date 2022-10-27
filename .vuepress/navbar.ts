import { navbar } from "vuepress-theme-hope";

export const zhNavbarConfig = navbar([
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
        link: ""
      },
    ]
  },
  { text: "Python", icon: "python", link: "/python/" },
  { text: "Linux", icon: "linux", link: "/linux/" },
  { text: "Arch", icon: "process", link: "/architecture/" },
  { text: "Java", icon: "java", link: "/java/" },
  { text: "TimeLine", icon: "class", link: "/timeline/" },
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
