import { navbar } from "vuepress-theme-hope";

export const zhNavbarConfig = navbar([
  "/",
  "/home",
  { text: "Blog", icon: "material-symbols:book-ribbon", link: "/category/" },
  { text: "Algorithm", icon: "fluent-emoji-high-contrast:thinking-face", link: "/algorithm/" },
  { text: "Python", icon: "akar-icons:python-fill", link: "/python/" },
  { text: "Linux", icon: "fluent-mdl2:linux-logo-32", link: "/linux/" },
  { text: "Arch", icon: "oui:compute", link: "/architecture/" },
  { text: "Java", icon: "ri:java-line", link: "/java/" },
  { text: "TimeLine", icon: "icon-park-outline:timeline", link: "/timeline/" },
  {
    text: "Others",
    icon: "basil:other-1-outline",
    prefix: "/others/",
    children: [
      {
        text: "Tools",
        icon: "mdi:tools",
        link: "tools/"
      },
      {
        text: "Temp",
        icon: "carbon:prompt-template",
        link: "tmp/"
      }
    ]
  },
  {
    text: "主题文档",
    icon: "material-symbols:zoom-out-map",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
