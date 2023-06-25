import { navbar } from "vuepress-theme-hope";

export const zhNavbarConfig = navbar([
  "/",
  "/home",
  { text: "Blog", icon: "linter", link: "/category/" },
  { text: "Algorithm", icon: "stack", link: "/algorithm/" },
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
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
