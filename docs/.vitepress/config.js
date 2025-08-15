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
    
    // 导航栏 - 根据实际文档分类更新
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Timeline', link: '/timeline' },
      { text: 'Algorithms', link: '/algorithms/' },
      { text: 'AI', link: '/artificial-intelligence/' },
      { 
        text: 'Computer Systems',
        items: [
          { text: 'CPU & GPU', link: '/computer-systems/cpu-gpu/' },
          { text: 'Linux', link: '/computer-systems/linux/' }
        ]
      },
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
      {
        text: 'Research',
        items: [
          { text: 'Papers', link: '/research-projects/papers/' },
          { text: 'Projects', link: '/research-projects/projects/' },
          { text: 'Research', link: '/research-projects/research/' }
        ]
      },
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
      '/algorithms/': [
        {
          text: 'Algorithms & Data Structures',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/algorithms/' },
            { text: 'Data Structures', link: '/algorithms/data-structures' },
            { text: 'Sorting Algorithms', link: '/algorithms/sorting' },
            { text: 'Search Algorithms', link: '/algorithms/searching' },
            { text: 'Graph Algorithms', link: '/algorithms/graph' },
            { text: 'Dynamic Programming', link: '/algorithms/dynamic-programming' },
            { text: 'Complexity Analysis', link: '/algorithms/complexity' }
          ]
        }
      ],
      '/artificial-intelligence/': [
        {
          text: 'AI & Machine Learning',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/artificial-intelligence/' },
            { text: 'Machine Learning Basics', link: '/artificial-intelligence/ml-basics' },
            { text: 'Deep Learning', link: '/artificial-intelligence/deep-learning' },
            { text: 'Natural Language Processing', link: '/artificial-intelligence/nlp' },
            { text: 'Computer Vision', link: '/artificial-intelligence/computer-vision' },
            { text: 'AI Tools & Frameworks', link: '/artificial-intelligence/tools-frameworks' }
          ]
        }
      ],
      '/computer-systems/cpu-gpu/': [
        {
          text: 'CPU 概述',
          collapsed: false,
          items: [
            { text: 'CPU 架构概览', link: '/computer-systems/cpu-gpu/' },
            { text: 'README', link: '/computer-systems/cpu-gpu/README' }
          ]
        },
        {
          text: 'CPU 基础架构',
          collapsed: false,
          items: [
            { text: '流水线 (Pipeline)', link: '/computer-systems/cpu-gpu/pipline' },
            { text: '缓存系统 (Cache)', link: '/computer-systems/cpu-gpu/cache' },
            { text: '内存管理单元 (MMU)', link: '/computer-systems/cpu-gpu/MMU' },
            { text: '虚拟内存与分页', link: '/computer-systems/cpu-gpu/memory_va_page' }
          ]
        },
        {
          text: '指令集架构 (ISA)',
          collapsed: false,
          items: [
            { text: 'x86 指令集', link: '/computer-systems/cpu-gpu/x86_inst' },
            { text: 'AMX 矩阵扩展', link: '/computer-systems/cpu-gpu/amx' },
            {
              text: 'ARM 架构',
              collapsed: true,
              items: [
                { text: 'ARM 概述', link: '/computer-systems/cpu-gpu/arm/' },
                { text: 'ARM 指令集', link: '/computer-systems/cpu-gpu/arm/arm_ins' },
                { text: 'ARM 内联汇编', link: '/computer-systems/cpu-gpu/arm/arm_inline_assembly' }
              ]
            }
          ]
        },
        {
          text: '系统架构',
          collapsed: false,
          items: [
            { text: 'NUMA 与 Socket', link: '/computer-systems/cpu-gpu/numa_socket' },
            { text: 'IBS 指令采样', link: '/computer-systems/cpu-gpu/ibs' }
          ]
        },
        {
          text: 'GPU 与 AI 加速',
          collapsed: false,
          items: [
            { text: 'GPU-AI 概述', link: '/computer-systems/cpu-gpu/gpu-ai/' },
            { text: 'GPU 架构', link: '/computer-systems/cpu-gpu/gpu-ai/gpu_arch' },
            { text: 'GPU 通信', link: '/computer-systems/cpu-gpu/gpu-ai/gpu_communication' },
            { text: 'SAC - ISCA 23', link: '/computer-systems/cpu-gpu/gpu-ai/SAC - ISCA 23' }
          ]
        },
        {
          text: '学术论文',
          collapsed: true,
          items: [
            { text: '论文概述', link: '/computer-systems/cpu-gpu/papers/' },
            { text: 'Value Prediction', link: '/computer-systems/cpu-gpu/papers/vp_value_prediction' },
            { text: 'VP HPCA 14', link: '/computer-systems/cpu-gpu/papers/vp_hpca14' }
          ]
        }
      ],
      '/computer-systems/linux/': [
        {
          text: 'Linux 概述',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/computer-systems/linux/' },
            { text: 'README', link: '/computer-systems/linux/README' }
          ]
        },
        {
          text: 'Linux 内核',
          collapsed: false,
          items: [
            { text: '内核模块', link: '/computer-systems/linux/kernel-modules' },
            { text: '内核配置', link: '/computer-systems/linux/kernel-config' }
          ]
        },
        {
          text: 'Linux 工具',
          collapsed: false,
          items: [
            { text: '命令行工具', link: '/computer-systems/linux/command-line-tools' },
            { text: '文件系统', link: '/computer-systems/linux/file-systems' }
          ]
        }
      ],
      '/programming-languages/java/': [
        {
          text: 'Java 基础',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/programming-languages/java/' },
            { text: 'Java 核心概念', link: '/programming-languages/java/java/core-concepts' },
            { text: 'Java 索引', link: '/programming-languages/java/java/' }
          ]
        },
        {
          text: 'JVM 虚拟机',
          collapsed: false,
          items: [
            { text: 'JVM 内存模型', link: '/programming-languages/java/jvm/01_jvm_memory' },
            { text: 'JVM 指令集', link: '/programming-languages/java/jvm/jvm_inst' },
            { text: 'G1 垃圾收集器', link: '/programming-languages/java/jvm/gc_g1' },
            { text: 'Java 反射机制', link: '/programming-languages/java/jvm/reflection' }
          ]
        },
        {
          text: 'ART 运行时',
          collapsed: false,
          items: [
            { text: 'ART 创建过程', link: '/programming-languages/java/art/art_create' },
            { text: 'ART DEX2OAT', link: '/programming-languages/java/art/art_dex2oat' },
            { text: 'ART JNI', link: '/programming-languages/java/art/art_jni' },
            { text: 'ART GC 原理', link: '/programming-languages/java/art/gc_art_01' }
          ]
        },
        {
          text: 'Android 系统',
          collapsed: false,
          items: [
            { text: 'ADB 调试工具', link: '/programming-languages/java/android/adb' },
            { text: 'Binder 机制', link: '/programming-languages/java/android/binder' },
            { text: 'Binder 原理 (1)', link: '/programming-languages/java/android/binder_01' },
            { text: 'Binder 原理 (2)', link: '/programming-languages/java/android/binder_02' },
            { text: 'IPC 进程间通信', link: '/programming-languages/java/android/ipc' },
            { text: 'Parcel 序列化', link: '/programming-languages/java/android/parcel' }
          ]
        }
      ],
      '/programming-languages/python/': [
        {
          text: 'Python Programming',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/programming-languages/python/' },
            { text: 'Python Basics', link: '/programming-languages/python/basics' },
            { text: 'Advanced Features', link: '/programming-languages/python/advanced' },
            { text: 'Data Science', link: '/programming-languages/python/data-science' },
            { text: 'Web Development', link: '/programming-languages/python/web-development' },
            { text: 'Testing & Debugging', link: '/programming-languages/python/testing' },
            { text: 'Best Practices', link: '/programming-languages/python/best-practices' }
          ]
        }
      ],
      '/development-tools/tools/': [
        {
          text: '常用工具',
          collapsed: false,
          items: [
            { text: 'Git', link: '/development-tools/tools/git' },
            { text: 'Docker', link: '/development-tools/tools/docker' }
          ]
        }
      ],
      '/development-tools/frameworks/': [
        {
          text: '常用框架',
          collapsed: false,
          items: [
            { text: 'React', link: '/development-tools/frameworks/react' },
            { text: 'Vue', link: '/development-tools/frameworks/vue' }
          ]
        }
      ],
      '/development-tools/database/': [
        {
          text: '数据库',
          collapsed: false,
          items: [
            { text: 'MySQL', link: '/development-tools/database/mysql' },
            { text: 'PostgreSQL', link: '/development-tools/database/postgresql' }
          ]
        }
      ],
      '/development-tools/frontend/': [
        {
          text: '前端开发',
          collapsed: false,
          items: [
            { text: 'HTML & CSS', link: '/development-tools/frontend/html-css' },
            { text: 'JavaScript', link: '/development-tools/frontend/javascript' }
          ]
        }
      ],
      '/development-tools/networks/': [
        {
          text: '网络技术',
          collapsed: false,
          items: [
            { text: 'TCP/IP 协议栈', link: '/development-tools/networks/tcp-ip' },
            { text: 'HTTP/HTTPS', link: '/development-tools/networks/http-https' }
          ]
        }
      ],
      '/development-tools/cloud-server/': [
        {
          text: '云服务器',
          collapsed: false,
          items: [
            { text: 'AWS EC2', link: '/development-tools/cloud-server/aws-ec2' },
            { text: 'Google Cloud VMs', link: '/development-tools/cloud-server/google-cloud-vms' }
          ]
        }
      ],
      '/research-projects/papers/': [
        {
          text: '学术论文',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/research-projects/papers/' },
            { text: 'Paper 1', link: '/research-projects/papers/paper-1' },
            { text: 'Paper 2', link: '/research-projects/papers/paper-2' }
          ]
        }
      ],
      '/research-projects/projects/': [
        {
          text: '研究项目',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/research-projects/projects/' },
            { text: 'Project 1', link: '/research-projects/projects/project-1' },
            { text: 'Project 2', link: '/research-projects/projects/project-2' }
          ]
        }
      ],
      '/research-projects/research/': [
        {
          text: '研究方向',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/research-projects/research/' },
            { text: 'Direction 1', link: '/research-projects/research/direction-1' },
            { text: 'Direction 2', link: '/research-projects/research/direction-2' }
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