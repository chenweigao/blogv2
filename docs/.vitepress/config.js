import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { writeTimelineData } from './utils/generateTimeline.js'
import { writeGitHistoryData } from './utils/generateGitHistoryData.js'
import { createGitHistoryAPI } from './utils/gitHistoryAPI.js'
import markdownItMark from 'markdown-it-mark'
import imageSizePlugin from './theme/utils/markdown-it-image-size.js'
import { generateResponsiveImages } from './utils/generateResponsiveImages.js'
import UnoCSS from 'unocss/vite'

// 通用侧边栏配置选项
const commonSidebarOptions = {
  // 排除不需要生成侧边栏的文件
  excludeFiles: ['index.md'],
  // 使用文件的 frontmatter title 作为侧边栏标题
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  // 按文件名排序
  sortMenusByFrontmatterOrder: true,
  sortMenusOrderByDescending: false,
  // 折叠配置
  collapsed: true,
  collapseDepth: 2,
  // 使用文件夹名作为组标题
  useFolderTitleFromIndexFile: true,
  useFolderLinkFromIndexFile: true,
  // 首字母大写
  capitalizeFirst: true,
  // 连字符转空格
  hyphenToSpace: true,
  // 下划线转空格
  underscoreToSpace: true,
}

// 使用 vitepress-sidebar 自动生成多侧边栏配置
// 每个导航 tab 对应独立的侧边栏
const vitepressSidebarOptions = [
  {
    documentRootPath: '/docs',
    scanStartPath: 'artificial-intelligence',
    resolvePath: '/artificial-intelligence/',
    ...commonSidebarOptions,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: 'computer-systems',
    resolvePath: '/computer-systems/',
    ...commonSidebarOptions,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: 'research-projects',
    resolvePath: '/research-projects/',
    ...commonSidebarOptions,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: 'algorithms',
    resolvePath: '/algorithms/',
    ...commonSidebarOptions,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: 'programming-languages',
    resolvePath: '/programming-languages/',
    ...commonSidebarOptions,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: 'development-tools',
    resolvePath: '/development-tools/',
    ...commonSidebarOptions,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: 'copilot',
    resolvePath: '/copilot/',
    ...commonSidebarOptions,
  },
]

export default defineConfig({
  title: 'Knowledge Wiki',
  description: 'Personal Knowledge Base - Work & Study Documentation',
  lang: 'zh-CN',
  // GitHub Pages 项目站点子路径
  base: '/blogv2/',

  // 忽略死链接检查，避免构建失败
  ignoreDeadLinks: true,

  // 构建钩子 - 在构建前生成 timeline 数据、git 历史记录和响应式图片
  buildStart() {
    console.log('Generating timeline data...')
    writeTimelineData()

    console.log('Generating git history data for modal...')
    writeGitHistoryData()

    console.log('Generating responsive images...')
    generateResponsiveImages()
  },

  // SSR 配置 - 解决客户端组件的 SSR 问题
  ssr: {
    noExternal: ['vue', '@vue/shared']
  },

  // Vite 配置 - 添加实时 git 历史记录 API 插件
  vite: {
    plugins: [
      createGitHistoryAPI(),
      UnoCSS()
    ],
    // 优化构建配置
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'toc-components': [
              './docs/.vitepress/theme/components/EnhancedTOC.vue',
              './docs/.vitepress/theme/components/toc/TOCToggleButton.vue',
              './docs/.vitepress/theme/components/toc/TOCPanel.vue'
            ]
            // 移除对外部依赖的手动分块，避免与 external 冲突
          }
        }
      }
    },
    // 定义全局变量以避免 SSR 问题
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  },

  // 网站图标
  head: [
    // 使用项目站点子路径，避免 /favicon.ico 在项目站下 404
    ['link', { rel: 'icon', href: '/blogv2/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    // 新增：告知浏览器支持亮暗两种配色方案
    ['meta', { name: 'color-scheme', content: 'light dark' }]
  ],

  // 主题配置
  themeConfig: {
    // 网站logo
    logo: '/blogv2/logo.svg',

    // 导航栏 - 根据实际文档分类更新
    nav: [
      { text: 'Home', link: '/' },
      { text: 'AI Infra', link: '/artificial-intelligence/' },
      {
        text: 'Computer Systems',
        items: [
          { text: 'CPU & GPU', link: '/computer-systems/cpu-gpu/' },
          { text: 'Linux', link: '/computer-systems/linux/' }
        ]
      },
      {
        text: 'Research',
        items: [
          { text: 'Papers', link: '/research-projects/papers/' },
          { text: 'Projects', link: '/research-projects/projects/' },
          { text: 'Research', link: '/research-projects/research/' }
        ]
      },
      { text: 'Timeline', link: '/timeline' },
      {
        text: 'More',
        items: [
          { text: 'Algorithms', link: '/algorithms/' },
          {
            text: 'Programming',
            items: [
              { text: 'Java', link: '/programming-languages/java/' },
              { text: 'Python', link: '/programming-languages/python/' }
            ]
          },
          {
            text: 'Development',
            items: [
              { text: 'Tools', link: '/development-tools/tools/' },
              { text: 'Frameworks', link: '/development-tools/frameworks/' },
              { text: 'Database', link: '/development-tools/database/' },
              { text: 'Frontend', link: '/development-tools/frontend/' },
              { text: 'Networks', link: '/development-tools/networks/' },
              { text: 'Cloud Server', link: '/development-tools/cloud-server/' }
            ]
          },
          { text: 'About', link: '/about' },
          { text: 'Search', link: '/search' }
        ]
      }
    ],

    // 侧边栏配置 - 使用 vitepress-sidebar 自动生成
    sidebar: generateSidebar(vitepressSidebarOptions),

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/chenweigao' }
    ],

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search'
          },
          modal: {
            noResultsText: 'No results found',
            resetButtonTitle: 'Clear search',
            footer: {
              selectText: 'to select',
              navigateText: 'to navigate'
            }
          }
        }
      }
    },

    // 页脚
    footer: {
      message: 'Personal Knowledge Wiki',
      copyright: 'Copyright © 2025'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/chenweigao/blogv2/edit/main/docs/:path',
      text: 'Edit this page'
    },

    // 最后更新时间
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 大纲配置 - 启用大纲以支持 TOC 功能
    // outline: {
    //   level: [2, 3]
    // }
    outline: false
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    codeCopyButtonTitle: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    math: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    },
    config: (md) => {
      // 使用 markdown-it-mark 插件启用 ==高亮== 语法
      md.use(markdownItMark)
      
      // 使用自定义图片大小插件
      md.use(imageSizePlugin)
    }
  },

  // 站点地图
  sitemap: {
    // GitHub Pages 项目站点的完整主页地址
    hostname: 'https://chenweigao.github.io/blogv2/'
  },

  // 支持 front matter 数据处理
  transformPageData(pageData) {
    // 处理页面的 front matter 数据
    const frontmatter = pageData.frontmatter

    // 如果有 title，使用 front matter 中的 title 覆盖默认标题
    if (frontmatter.title) {
      pageData.title = frontmatter.title
    }

    // 处理日期格式
    if (frontmatter.date) {
      // 确保日期格式正确
      const date = new Date(frontmatter.date)
      if (!isNaN(date.getTime())) {
        frontmatter.formattedDate = date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    }

    // 处理分类信息
    if (frontmatter.category) {
      // 确保 category 是数组格式
      if (typeof frontmatter.category === 'string') {
        frontmatter.category = [frontmatter.category]
      }
    }

    return pageData
  },

  // 新增：根据页面与站点信息动态生成 head（canonical/OG/Twitter）
  transformHead: ({ page, site }) => {
    const hostname = site?.sitemap?.hostname || ''
    const pagePath = page?.relativePath ? page.relativePath.replace(/\.md$/, '') : ''
    const canonicalUrl = hostname && pagePath ? `${hostname}/${pagePath}` : ''
    const title = page?.title || site?.title || 'Site'
    const description = page?.description || site?.description || ''
    const tags = [
      canonicalUrl
        ? ['link', { rel: 'canonical', href: canonicalUrl }]
        : null,
      ['meta', { name: 'description', content: description }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      canonicalUrl ? ['meta', { property: 'og:url', content: canonicalUrl }] : null,
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ].filter(Boolean)

    // 若 frontmatter 存在文章元数据，注入 JSON-LD 结构化数据
    const fm = page?.frontmatter || {}
    const articleTitle = fm.title || title
    const datePublished = fm.date || null
    const dateModified = fm.updated || fm.lastUpdated || null
    const authorName = fm.author || (site?.title ? String(site.title) : undefined)
    const keywords = Array.isArray(fm.tags)
      ? fm.tags
      : (typeof fm.tags === 'string' ? fm.tags.split(',').map(s => s.trim()).filter(Boolean) : [])
    if (articleTitle && (datePublished || dateModified)) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleTitle,
        description,
        ...(canonicalUrl ? { url: canonicalUrl } : {}),
        ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
        ...(authorName ? { author: { '@type': 'Person', name: authorName } } : {}),
        ...(datePublished ? { datePublished: new Date(datePublished).toISOString() } : {}),
        ...(dateModified ? { dateModified: new Date(dateModified).toISOString() } : {})
      }
      tags.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])
    }

    // 新增：根据环境变量为分析域名添加预连接与 DNS 预解析
    const rawAnalyticsUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_ANALYTICS_URL) || ''
    if (rawAnalyticsUrl) {
      try {
        const origin = new URL(rawAnalyticsUrl).origin
        tags.push(['link', { rel: 'preconnect', href: origin }])
        tags.push(['link', { rel: 'dns-prefetch', href: origin }])
      } catch {}
    }

    return tags
  }
})