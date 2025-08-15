import { defineConfig } from 'vitepress'
import { writeTimelineData } from './utils/generateTimeline.js'
import { writeGitHistoryData } from './utils/generateGitHistoryData.js'
import { createGitHistoryAPI } from './utils/gitHistoryAPI.js'

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
  
  // Vite 配置 - 添加实时 git 历史记录 API 插件
  vite: {
    plugins: [
      createGitHistoryAPI()
    ]
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

    // 侧边栏配置 - 根据实际文件结构修正
    sidebar: {
      '/algorithms/': [
        {
          text: 'Algorithms & Data Structures',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/algorithms/' },
            { text: 'README', link: '/algorithms/README' },
            { text: 'Backtrack', link: '/algorithms/backtrack' },
            { text: 'Sliding Window', link: '/algorithms/slide_window' },
            { text: 'DFS & BFS', link: '/algorithms/dfs_bfs' },
            { text: 'Binary Tree', link: '/algorithms/binary_tree' },
            { text: 'Binary Search', link: '/algorithms/binary_search' },
            { text: 'Dynamic Programming', link: '/algorithms/dp' },
            { text: 'Sorting', link: '/algorithms/sort' },
            { text: 'LCS', link: '/algorithms/lcs' },
            { text: 'Prefix Sum', link: '/algorithms/presum' }
          ]
        },
        {
          text: 'Data Structures',
          collapsed: false,
          items: [
            { text: 'Data Structures README', link: '/algorithms/data_struct/readme' },
            { text: 'Stack', link: '/algorithms/data_struct/stack' },
            { text: 'HashMap', link: '/algorithms/data_struct/hashmap' },
            { text: 'String', link: '/algorithms/data_struct/string' },
            { text: 'Tree', link: '/algorithms/data_struct/tree' },
            { text: 'Linked List', link: '/algorithms/data_struct/linkedlist' }
          ]
        }
      ],
      '/artificial-intelligence/': [
        {
          text: 'AI Infrastructure Overview',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/artificial-intelligence/' }
          ]
        },
        {
          text: 'Hardware Acceleration',
          collapsed: false,
          items: [
            { text: 'GPU Architecture', link: '/artificial-intelligence/gpu-computing/gpu_arch' },
            { text: 'GPU Communication', link: '/artificial-intelligence/gpu-computing/gpu_communication' },
            { text: 'Intel AMX & OpenVINO', link: '/artificial-intelligence/AMX/openvino' }
          ]
        },
        {
          text: 'Infrastructure & Operations',
          collapsed: false,
          items: [
            { text: 'Model Optimization', link: '/artificial-intelligence/model-optimization/' },
            { text: 'Monitoring & Operations', link: '/artificial-intelligence/monitoring-ops/' },
            { text: 'Cloud Platforms', link: '/artificial-intelligence/cloud-platforms/' },
            { text: 'Training Frameworks', link: '/artificial-intelligence/training-frameworks/' }
          ]
        },
        {
          text: 'Research & Papers',
          collapsed: true,
          items: [
            { text: 'SAC - ISCA 23', link: '/artificial-intelligence/gpu-computing/SAC - ISCA 23' }
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
            { text: '流水线 (Pipeline)', link: '/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/pipline' },
            { text: '缓存系统 (Cache)', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/cache' },
            { text: '内存管理单元 (MMU)', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/MMU' },
            { text: '虚拟内存与分页', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/memory_va_page' }
          ]
        },
        {
          text: '指令集架构 (ISA)',
          collapsed: false,
          items: [
            { text: 'x86 指令集', link: '/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/x86_inst' },
            { text: 'AMX 矩阵扩展', link: '/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/amx' },
            {
              text: 'ARM 架构',
              collapsed: true,
              items: [
                { text: 'ARM 概述', link: '/computer-systems/cpu-gpu/arm-architecture/' },
                { text: 'ARM 指令集', link: '/computer-systems/cpu-gpu/arm-architecture/arm_ins' },
                { text: 'ARM 内联汇编', link: '/computer-systems/cpu-gpu/arm-architecture/arm_inline_assembly' }
              ]
            }
          ]
        },
        {
          text: '系统架构',
          collapsed: false,
          items: [
            { text: 'NUMA 与 Socket', link: '/computer-systems/cpu-gpu/cpu-architecture/memory-systems/numa_socket' },
            { text: 'IBS 指令采样', link: '/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/ibs' }
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
          text: 'Linux 工具',
          collapsed: false,
          items: [
            { text: '命令行工具', link: '/computer-systems/linux/commands-tools/command' }
          ]
        },
        {
          text: 'Linux 内核',
          collapsed: false,
          items: [
            { text: '内核 README', link: '/computer-systems/linux/kernel/README' },
            { text: 'RCU', link: '/computer-systems/linux/kernel/process-scheduling/rcu' },
            { text: 'Idle Tick', link: '/computer-systems/linux/kernel/process-scheduling/idle_tick' },
            { text: 'Idle', link: '/computer-systems/linux/kernel/process-scheduling/idle' },
            { text: 'I2C 驱动', link: '/computer-systems/linux/kernel/device-drivers/i2c' },
            { text: 'BL31', link: '/computer-systems/linux/kernel/architecture/BL31' },
            { text: 'THP', link: '/computer-systems/linux/kernel/memory-management/THP' },
            { text: 'Notifier', link: '/computer-systems/linux/kernel/core-concepts/notifier' },
            { text: 'Pthread', link: '/computer-systems/linux/kernel/core-concepts/pthread' },
            { text: 'Thermal Init', link: '/computer-systems/linux/kernel/thermal-management/thermal_init' },
            { text: 'Thermal', link: '/computer-systems/linux/kernel/thermal-management/thermal' }
          ]
        },
        {
          text: '系统编程',
          collapsed: false,
          items: [
            { text: '系统编程 README', link: '/computer-systems/linux/system-programming/README' },
            { text: 'Linkers & Loaders', link: '/computer-systems/linux/system-programming/linkers_loaders' },
            { text: 'size_t', link: '/computer-systems/linux/system-programming/size_t' },
            { text: 'C Pointer', link: '/computer-systems/linux/system-programming/c-pointer' },
            { text: 'CMake', link: '/computer-systems/linux/system-programming/cmake' },
            { text: 'CMake Makefile', link: '/computer-systems/linux/system-programming/cmake_makefile' }
          ]
        },
        {
          text: '系统管理',
          collapsed: false,
          items: [
            { text: 'APT', link: '/computer-systems/linux/system-administration/apt' }
          ]
        },
        {
          text: '教育资源',
          collapsed: false,
          items: [
            { text: 'XV6', link: '/computer-systems/linux/educational/xv6' }
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
            { text: 'Hash', link: '/programming-languages/python/language/hash' },
            { text: 'Effective Python', link: '/programming-languages/python/language/effective-python' },
            { text: 'Pytest', link: '/programming-languages/python/language/pytest' },
            { text: 'Python C', link: '/programming-languages/python/language/python_c' },
            { text: 'Itertools', link: '/programming-languages/python/language/itertools' },
            { text: 'Python Function', link: '/programming-languages/python/language/python-function' },
            { text: 'Python Data Structure', link: '/programming-languages/python/language/py-data-struct' },
            { text: 'Pip', link: '/programming-languages/python/language/pip' }
          ]
        },
        {
          text: 'Python Tools',
          collapsed: false,
          items: [
            { text: 'Virtual Environment', link: '/programming-languages/python/tools/virtualenv' },
            { text: 'Python Tools', link: '/programming-languages/python/tools/py-tools' }
          ]
        }
      ],
      '/development-tools/tools/': [
        {
          text: '常用工具',
          collapsed: false,
          items: [
            { text: 'Tools Overview', link: '/development-tools/tools/' },
            { text: 'Vim', link: '/development-tools/tools/vim' },
            { text: 'VPS', link: '/development-tools/tools/vps' },
            { text: 'Batch Windows', link: '/development-tools/tools/bat_win' },
            { text: 'Git', link: '/development-tools/tools/git' }
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
            { text: 'Database Overview', link: '/development-tools/database/' },
            { text: 'Redis', link: '/development-tools/database/redis' },
            { text: 'Peewee', link: '/development-tools/database/peewee' },
            { text: 'MySQL', link: '/development-tools/database/mysql' },
            { text: 'MongoDB', link: '/development-tools/database/mongodb' }
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
            { text: 'RF-Pose', link: '/research-projects/research/RF-Pose' },
            { text: 'Information Theory', link: '/research-projects/research/information_theory' },
            { text: 'Face Recognition', link: '/research-projects/research/face_recognition' },
            { text: 'MNIST', link: '/research-projects/research/mnist' },
            { text: 'LaTeX', link: '/research-projects/research/latex' },
            { text: 'CSI Tool', link: '/research-projects/research/csitool' },
            { text: 'CVPR', link: '/research-projects/research/cvpr' },
            { text: 'ArrayTrack', link: '/research-projects/research/ArrayTrack' },
            { text: 'TensorFlow', link: '/research-projects/research/tensorflow' },
            { text: 'CNN', link: '/research-projects/research/cnn' }
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