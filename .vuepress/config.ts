import { defineUserConfig } from "vuepress";
import theme from "./theme";
import { viteBundler } from '@vuepress/bundler-vite'

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
      title: "weigao",
      description: "blog & wiki",
    },
  },

  theme,
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

  plugins: [
  ]
})
