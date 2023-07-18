import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({

  hostname: "https://vueblog.weigao.cc",

  author: {
    name: "chener",
    url: "https://vueblog.weigao.cc",
  },

  iconPrefix: "iconfont icon-",

  logo: "excellence.png",

  repo: "https://github.com/chenweigao",

  // navbar
  // navbar: navbar,

  // sidebar
  sidebar: {
    "/algorithm/data_struct/": "structure",
    "/algorithm/": "structure",
    "/python/": "structure",
    "/others/tools/": "structure",
    "/others/tmp/": "structure",
    "/linux/": "structure"
  },

  footer: "2017-2022",

  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  rtl: true,

  blog: {
    description: "someone..",
    intro: "/intro.html",
    medias: {
      Baidu: "https://example.com",
      Bitbucket: "https://example.com",
      Dingding: "https://example.com",
      Discord: "https://example.com",
      Dribbble: "https://example.com",
      Email: "mail@weigao.cc",
      Evernote: "https://example.com",
      Facebook: "https://example.com",
      Flipboard: "https://example.com",
      Gitee: "https://example.com",
      GitHub: "https://github.com/chenweigao",
      Gitlab: "https://example.com",
      Gmail: "https://example.com",
      Instagram: "https://example.com",
      Lines: "https://example.com",
      Linkedin: "https://example.com",
      Pinterest: "https://example.com",
      Pocket: "https://example.com",
      QQ: "https://example.com",
      Qzone: "https://example.com",
      Reddit: "https://example.com",
      Rss: "https://example.com",
      Steam: "https://example.com",
      Twitter: "https://example.com",
      Wechat: "https://example.com",
      Weibo: "https://example.com",
      Whatsapp: "https://example.com",
      Youtube: "https://example.com",
      Zhihu: "https://example.com",
    },
  },

  encrypt: {
    config: {
      "/guide/encrypt.html": ["1234"],
    },
  }
});
