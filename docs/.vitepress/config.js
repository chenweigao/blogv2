import { defineConfig } from 'vitepress'
import { writeTimelineData } from './utils/generateTimeline.js'
import { writeGitHistoryData } from './utils/generateGitHistoryData.js'
import { createGitHistoryAPI } from './utils/gitHistoryAPI.js'
import { sidebar } from './config/sidebar/index.js'

export default defineConfig({
  title: 'Knowledge Wiki',
  description: 'Personal Knowledge Base - Work & Study Documentation',

  // 忽略死链接检查，避免构建失败
  ignoreDeadLinks: true,

  // 构建钩子 - 在构建前生成 timeline 数据和 git 历史记录
  buildStart() {
    console.log('Generating timeline data...')
    writeTimelineData()

    console.log('Generating git history data for modal...')
    writeGitHistoryData()
  },

  // SSR 配置 - 解决客户端组件的 SSR 问题
  ssr: {
    noExternal: ['vue', '@vue/shared']
  },

  // Vite 配置 - 添加实时 git 历史记录 API 插件
  vite: {
    plugins: [
      createGitHistoryAPI()
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
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],

  // 主题配置
  themeConfig: {
    // 网站logo
    logo: '/logo.svg',

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

    // 侧边栏配置 - 从外部文件导入
    sidebar,

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
      pattern: 'https://github.com/your-username/knowledge-wiki/edit/main/docs/:path',
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
    outline: false
  },

  // Markdown 配置
  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    math: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  },

  // 站点地图
  sitemap: {
    hostname: 'https://your-domain.com'
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
  }
})