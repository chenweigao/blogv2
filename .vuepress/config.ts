import { defineUserConfig } from "vuepress";
import theme from "./theme";
import { searchProPlugin } from "vuepress-plugin-search-pro";

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
  markdown: {
    code: {
      lineNumbers: 10
    }
  },
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ]
})
