import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbarConfig } from "./navbar";
import { mysidebar } from "./sidebar";

export default hopeTheme(
    {
        hostname: "https://vueblog.weigao.cc",

        author: {
            name: "Someone",
            url: "https://vueblog.weigao.cc",
        },


        navbar: zhNavbarConfig,

        sidebar: mysidebar,


        iconPrefix: "iconfont icon-",

        logo: "dojo-icon.svg",

        repo: "https://github.com/chenweigao",

        // docsDir: "demo/src",

        footer: "2017-2022",

        displayFooter: true,

        pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

        blog: {
            description: "someone..",
            intro: "/intro.html",
            medias: {
                Baidu: "https://example.com",
                Bitbucket: "https://example.com",
                Dingding: "https://example.com",
                Discord: "https://example.com",
                Dribbble: "https://example.com",
                Email: "https://example.com",
                Evernote: "https://example.com",
                Facebook: "https://example.com",
                Flipboard: "https://example.com",
                Gitee: "https://example.com",
                GitHub: "https://example.com",
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
        },

        fullscreen: true,

        plugins: {
            blog: true,
            // 你也可以使用 Waline
            // comment: {
            //     type: "giscus",
            //     repo: "chenweigao/gitalk",
            //     repoId: "MDEwOlJlcG9zaXRvcnkxMjU1OTE1ODQ=",
            //     category: "Announcements",
            //     categoryId: "DIC_kwDOB3xgIM4COUME",
            // },

            mdEnhance: {
                tex: true,
                // 启用下角标功能
                sub: true,
                // 启用上角标
                sup: true,
                // mermaid: true,
            },

        },
    }
);      