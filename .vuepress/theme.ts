import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbarConfig } from "./navbar";
import { mysidebar } from "./sidebar";
export default hopeTheme(
    {
        hostname: "https://vueblog.weigao.cc",

        author: {
            name: "Someone",
            url: "https://www.weigao.cc",
        },

        pure: true,

        focus: false,

        navbar: zhNavbarConfig,

        sidebar: mysidebar,

        lastUpdated: false,

        logo: "excellence.png",

        repo: "https://github.com/chenweigao",

        // docsDir: "/",

        footer: "2017-2023",

        displayFooter: true,

        blog: {
            description: "someone..",
            intro: "/intro.html",
            // medias: {
            //     Baidu: "https://example.com",
            //     Bitbucket: "https://example.com",
            //     Dingding: "https://example.com",
            //     Discord: "https://example.com",
            //     Dribbble: "https://example.com",
            //     Email: "https://example.com",
            //     Evernote: "https://example.com",
            //     Facebook: "https://example.com",
            //     Flipboard: "https://example.com",
            //     Gitee: "https://example.com",
            //     GitHub: "https://github.com/chenweigao",
            //     Gitlab: "https://example.com",
            //     Gmail: "https://example.com",
            //     Instagram: "https://example.com",
            //     Lines: "https://example.com",
            //     Linkedin: "https://example.com",
            //     Pinterest: "https://example.com",
            //     Pocket: "https://example.com",
            //     QQ: "https://example.com",
            //     Qzone: "https://example.com",
            //     Reddit: "https://example.com",
            //     Rss: "https://example.com",
            //     Steam: "https://example.com",
            //     Twitter: "https://example.com",
            //     Wechat: "https://example.com",
            //     Weibo: "https://example.com",
            //     Whatsapp: "https://example.com",
            //     Youtube: "https://example.com",
            //     Zhihu: "https://example.com",
            // }
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
            comment: {
                provider: "Giscus",
                repo: "chenweigao/gitalk",
                repoId: "MDEwOlJlcG9zaXRvcnkxMjU1OTE1ODQ=",
                category: "Announcements",
                categoryId: "DIC_kwDOB3xgIM4COUME",
            },
            slimsearch: {
                indexContent: true,
            },
            icon: {
                assets: "iconify",
            }
        },
        markdown: {
            highlighter: {
                type: "shiki",
                // langs: ['ts', 'json', 'md', 'bash', 'python', "cpp"],
                themes: {
                    light: 'github-light',
                    dark: 'nord',
                },
                // lineNumbers: 15,
            },
            mermaid: true,
            footnote: true,
            math: true,
            spoiler: true,
            alert: true,
            mark: true,
            imgLazyload: true,
            imgMark: true,
            imgSize: true,
            chartjs: true,
            figure: true

        },
        sidebarSorter: ["readme", "order", "date", "filename"]
    }
);      
