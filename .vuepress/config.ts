import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import themeConfig from "./themeConfig";
import theme from "./theme";

export default defineUserConfig({
  base: "/",

  dest: "./dist",

  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css",
      }
    ],
    [
      "link",
      {
        rel: "icon",
        href: "modx-icon.svg",
      }
    ],
  ],

  locales: {
    "/": {
      lang: "zh-CN",
      title: "WW",
      description: "blog & wiki",
    },
  },

  theme,

});

