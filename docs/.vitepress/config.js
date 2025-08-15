import { defineConfig } from 'vitepress'
import { writeTimelineData } from './utils/generateTimeline.js'

export default defineConfig({
  title: 'Knowledge Wiki',
  description: 'Personal Knowledge Base - Work & Study Documentation',
  
  // 构建钩子 - 在构建前生成 timeline 数据
  buildStart() {
    console.log('Generating timeline data...')
    writeTimelineData()
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
    
    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Timeline', link: '/timeline' },
      { text: 'AI', link: '/ai/' },
      { text: 'CPU', link: '/cpu/' },
      { text: 'Java', link: '/java/' },
      { text: 'Algorithm', link: '/algorithm/' },
      { text: 'Python', link: '/python/' },
      {
        text: 'More',
        items: [
          { text: 'About', link: '/about' },
          { text: 'Search', link: '/search' }
        ]
      }
    ],

    // 侧边栏配置 - 自动生成
    sidebar: {
      '/ai/': [
        {
          text: 'AI & Machine Learning',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/ai/' },
            { text: 'Machine Learning Basics', link: '/ai/ml-basics' },
            { text: 'Deep Learning', link: '/ai/deep-learning' },
            { text: 'Natural Language Processing', link: '/ai/nlp' },
            { text: 'Computer Vision', link: '/ai/computer-vision' },
            { text: 'AI Tools & Frameworks', link: '/ai/tools-frameworks' }
          ]
        }
      ],
      '/cpu/': [
        {
          text: 'CPU 概述',
          collapsed: false,
          items: [
            { text: 'CPU 架构概览', link: '/cpu/' },
            { text: 'README', link: '/cpu/README' }
          ]
        },
        {
          text: 'CPU 基础架构',
          collapsed: false,
          items: [
            { text: '流水线 (Pipeline)', link: '/cpu/pipline' },
            { text: '缓存系统 (Cache)', link: '/cpu/cache' },
            { text: '内存管理单元 (MMU)', link: '/cpu/MMU' },
            { text: '虚拟内存与分页', link: '/cpu/memory_va_page' }
          ]
        },
        {
          text: '指令集架构 (ISA)',
          collapsed: false,
          items: [
            { text: 'x86 指令集', link: '/cpu/x86_inst' },
            { text: 'AMX 矩阵扩展', link: '/cpu/amx' },
            {
              text: 'ARM 架构',
              collapsed: true,
              items: [
                { text: 'ARM 概述', link: '/cpu/arm/' },
                { text: 'ARM 指令集', link: '/cpu/arm/arm_ins' },
                { text: 'ARM 内联汇编', link: '/cpu/arm/arm_inline_assembly' }
              ]
            }
          ]
        },
        {
          text: '系统架构',
          collapsed: false,
          items: [
            { text: 'NUMA 与 Socket', link: '/cpu/numa_socket' },
            { text: 'IBS 指令采样', link: '/cpu/ibs' }
          ]
        },
        {
          text: 'GPU 与 AI 加速',
          collapsed: false,
          items: [
            { text: 'GPU-AI 概述', link: '/cpu/gpu-ai/' },
            { text: 'GPU 架构', link: '/cpu/gpu-ai/gpu_arch' },
            { text: 'GPU 通信', link: '/cpu/gpu-ai/gpu_communication' },
            { text: 'SAC - ISCA 23', link: '/cpu/gpu-ai/SAC - ISCA 23' }
          ]
        },
        {
          text: '学术论文',
          collapsed: true,
          items: [
            { text: '论文概述', link: '/cpu/papers/' },
            { text: 'Value Prediction', link: '/cpu/papers/vp_value_prediction' },
            { text: 'VP HPCA 14', link: '/cpu/papers/vp_hpca14' }
          ]
        }
      ],
      '/java/': [
        {
          text: 'Java 基础',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/java/' },
            { text: 'Java 核心概念', link: '/java/java/core-concepts' },
            { text: 'Java 索引', link: '/java/java/' }
          ]
        },
        {
          text: 'JVM 虚拟机',
          collapsed: false,
          items: [
            { text: 'JVM 内存模型', link: '/java/jvm/01_jvm_memory' },
            { text: 'JVM 指令集', link: '/java/jvm/jvm_inst' },
            { text: 'G1 垃圾收集器', link: '/java/jvm/gc_g1' },
            { text: 'Java 反射机制', link: '/java/jvm/reflection' }
          ]
        },
        {
          text: 'ART 运行时',
          collapsed: false,
          items: [
            { text: 'ART 创建过程', link: '/java/art/art_create' },
            { text: 'ART DEX2OAT', link: '/java/art/art_dex2oat' },
            { text: 'ART JNI', link: '/java/art/art_jni' },
            { text: 'ART GC 原理', link: '/java/art/gc_art_01' }
          ]
        },
        {
          text: 'Android 系统',
          collapsed: false,
          items: [
            { text: 'ADB 调试工具', link: '/java/android/adb' },
            { text: 'Binder 机制', link: '/java/android/binder' },
            { text: 'Binder 原理 (1)', link: '/java/android/binder_01' },
            { text: 'Binder 原理 (2)', link: '/java/android/binder_02' },
            { text: 'IPC 进程间通信', link: '/java/android/ipc' },
            { text: 'Parcel 序列化', link: '/java/android/parcel' }
          ]
        }
      ],
      '/algorithm/': [
        {
          text: 'Algorithms & Data Structures',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/algorithm/' },
            { text: 'Data Structures', link: '/algorithm/data-structures' },
            { text: 'Sorting Algorithms', link: '/algorithm/sorting' },
            { text: 'Search Algorithms', link: '/algorithm/searching' },
            { text: 'Graph Algorithms', link: '/algorithm/graph' },
            { text: 'Dynamic Programming', link: '/algorithm/dynamic-programming' },
            { text: 'Complexity Analysis', link: '/algorithm/complexity' }
          ]
        }
      ],
      '/python/': [
        {
          text: 'Python Programming',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/python/' },
            { text: 'Python Basics', link: '/python/basics' },
            { text: 'Advanced Features', link: '/python/advanced' },
            { text: 'Data Science', link: '/python/data-science' },
            { text: 'Web Development', link: '/python/web-development' },
            { text: 'Testing & Debugging', link: '/python/testing' },
            { text: 'Best Practices', link: '/python/best-practices' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
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
      copyright: 'Copyright © 2024'
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

    // 大纲配置
    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
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