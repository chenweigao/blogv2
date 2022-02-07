import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  title: 'Something',
  description: 'Nothing',
  theme: 'reco',
  themeConfig: {
    style: '@vuepress-reco/style-default',
    logo: '/favicon.png',
    author: 'author someone',
    authorAvatar: 'avatar.png',
    docsRepo: 'https://github.com/chenweigao/myblog',
    docsBranch: 'master',
    docsDir: 'docs',
    lastUpdatedText: '',
    // series 为原 sidebar
    series: {
      '/docs/theme-reco/': [
        {
          text: 'module one',
          children: ['home', 'theme']
        },
        {
          text: 'module two',
          children: ['api', 'plugin']
        }
      ],
      '/docs/algorithm/': [
        {
          text: 'Data Struct',
          children: ['data_struct', 'string', 'stack', 'hashmap', 'linkedlist', 'binarytree']
        },
        {
          text: 'Algorithm',
          children: ['sort', 'dfs_bfs', 'binary_search', 'backtrack', 'lcs', 'fibonacci', 'dp', 'package', 'slide_window']
        }
      ],
      '/docs/python/': [
        {
          text: 'Python Tools',
          children: ['virtualenv', 'crontab']
        },
        {
          text: 'Python Basic',
          children: ['python-start', 'coroutines', 'python-oo', 'hash', 'io']
        },
        {
          text: 'Python Test',
          children: ['pytest']
        }
      ]
    },
    navbar:
    [
      { text: 'Home', link: '/' },
      { text: 'Categories', link: '/categories/python/1/' },
      { text: 'Tags', link: '/tags/tag1/1/' },
      { text: 'Algorithm', link: '/docs/algorithm/data_struct' },
      { text: 'Docs',
        children: [
          { text: 'vuepress-reco', link: '/docs/theme-reco/theme' },
          { text: 'vuepress-theme-reco', link: '/blogs/other/guide' },
          { text: 'Python', link: '/docs/python/python-start' }
        ]
      },
    ],
    bulletin: {
      body: [
        {
          type: 'text',
          content: `🎉🎉🎉 欢迎访问！本博客基于 reco 主题 2.x 构建，欢迎指导交流！`,
          style: 'font-size: 12px;'
        },
        {
          type: 'hr',
        },
        {
          type: 'title',
          content: '联系方式',
        },
        {
          type: 'text',
          content: `
          <ul>
            <li>297859260</li>
            <li>Email：mail@weigao.cc</li>
          </ul>`,
          style: 'font-size: 12px;'
        },
        {
          type: 'hr',
        },
        {
          type: 'title',
          content: 'GitHub',
        },
        {
          type: 'text',
          content: `
          <ul>
            <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
            <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
          </ul>`,
          style: 'font-size: 12px;'
        },
        {
          type: 'hr',
        },
        {
          type: 'buttongroup',
          children: [
            {
              text: '打赏',
              link: '/docs/others/donate.html'
            }
          ]
        }
      ],
    },
    // valineConfig 配置与 1.x 一致
    // valineConfig: {
    //   appId: 'xxx',
    //   appKey: 'xxx',
    //   placeholder: '填写邮箱可以收到回复提醒哦！',
    //   verify: true, // 验证码服务
    //   // notify: true,
    //   recordIP: true,
    //   // hideComments: true // 隐藏评论
    // },
    autoSetCategory: true,         // 自动设置分类
    autoAddCategoryToNavbar: false  // 自动将首页、分类和标签添加至头部导航条
  },
  // debug: true,
})
