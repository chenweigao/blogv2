/**
 * 侧边栏动态组件配置文件
 * 提供组件的默认配置和自定义选项
 */

// 默认配置
export const defaultConfig = {
  // 基础设置
  enableInteraction: true,
  autoCollapse: true,
  collapseDelay: 3000,
  
  // 动画设置
  enableAnimations: true,
  showParticles: true,
  animationSpeed: 'medium', // 'slow', 'medium', 'fast'
  
  // 主题设置
  defaultTheme: 'aurora',
  availableThemes: ['aurora', 'ocean', 'sunset', 'forest'],
  
  // 显示设置
  showReadingProgress: true,
  showWordCount: true,
  showReadingTime: true,
  showQuickActions: true,
  
  // 响应式设置
  mobileMinHeight: 50,
  desktopMinHeight: 60,
  
  // 性能设置
  maxParticles: 8,
  reducedMotion: false
}

// 主题配置
export const themeConfigs = {
  aurora: {
    name: '极光',
    description: '神秘的极光色彩',
    colors: {
      primary: 'rgba(10, 37, 64, 0.4)',
      secondary: 'rgba(255, 212, 0, 0.3)',
      accent: 'rgba(0, 208, 132, 0.4)'
    },
    gradient: 'linear-gradient(135deg, var(--widget-aurora-primary) 0%, var(--widget-aurora-secondary) 50%, var(--widget-aurora-accent) 100%)'
  },
  ocean: {
    name: '海洋',
    description: '深邃的海洋蓝调',
    colors: {
      primary: 'rgba(0, 119, 190, 0.4)',
      secondary: 'rgba(0, 180, 216, 0.3)',
      accent: 'rgba(144, 224, 239, 0.4)'
    },
    gradient: 'linear-gradient(135deg, var(--widget-ocean-primary) 0%, var(--widget-ocean-secondary) 50%, var(--widget-ocean-accent) 100%)'
  },
  sunset: {
    name: '日落',
    description: '温暖的日落色调',
    colors: {
      primary: 'rgba(255, 94, 77, 0.4)',
      secondary: 'rgba(255, 154, 0, 0.3)',
      accent: 'rgba(255, 206, 84, 0.4)'
    },
    gradient: 'linear-gradient(135deg, var(--widget-sunset-primary) 0%, var(--widget-sunset-secondary) 50%, var(--widget-sunset-accent) 100%)'
  },
  forest: {
    name: '森林',
    description: '清新的森林绿意',
    colors: {
      primary: 'rgba(76, 175, 80, 0.4)',
      secondary: 'rgba(139, 195, 74, 0.3)',
      accent: 'rgba(205, 220, 57, 0.4)'
    },
    gradient: 'linear-gradient(135deg, var(--widget-forest-primary) 0%, var(--widget-forest-secondary) 50%, var(--widget-forest-accent) 100%)'
  }
}

// 动画速度配置
export const animationSpeeds = {
  slow: {
    transition: '0.6s',
    particleSpeed: '4s',
    auroraSpeed: '12s'
  },
  medium: {
    transition: '0.3s',
    particleSpeed: '3s',
    auroraSpeed: '8s'
  },
  fast: {
    transition: '0.15s',
    particleSpeed: '2s',
    auroraSpeed: '5s'
  }
}

// 实用工具函数
export const utils = {
  /**
   * 合并配置
   * @param {Object} userConfig - 用户配置
   * @param {Object} defaultConfig - 默认配置
   * @returns {Object} 合并后的配置
   */
  mergeConfig(userConfig = {}, defaultConfig = {}) {
    return {
      ...defaultConfig,
      ...userConfig
    }
  },

  /**
   * 获取主题配置
   * @param {string} themeName - 主题名称
   * @returns {Object} 主题配置
   */
  getThemeConfig(themeName) {
    return themeConfigs[themeName] || themeConfigs.aurora
  },

  /**
   * 检测是否支持减少动画
   * @returns {boolean}
   */
  prefersReducedMotion() {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * 检测是否为触摸设备
   * @returns {boolean}
   */
  isTouchDevice() {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  /**
   * 获取设备类型
   * @returns {string} 'mobile' | 'tablet' | 'desktop'
   */
  getDeviceType() {
    if (typeof window === 'undefined') return 'desktop'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  },

  /**
   * 格式化日期
   * @param {string|Date} date - 日期
   * @returns {string} 格式化后的日期
   */
  formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    return d.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  },

  /**
   * 计算阅读进度
   * @returns {number} 阅读进度百分比
   */
  calculateReadingProgress() {
    if (typeof window === 'undefined') return 0
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    
    if (scrollHeight <= 0) return 0
    
    return Math.round((scrollTop / scrollHeight) * 100)
  },

  /**
   * 估算阅读时间
   * @param {number} wordCount - 字数
   * @param {number} wpm - 每分钟阅读字数，默认200
   * @returns {number} 阅读时间（分钟）
   */
  estimateReadingTime(wordCount, wpm = 200) {
    if (!wordCount || wordCount <= 0) return 0
    return Math.ceil(wordCount / wpm)
  },

  /**
   * 生成随机粒子样式
   * @param {number} count - 粒子数量
   * @returns {Array} 粒子样式数组
   */
  generateParticleStyles(count = 8) {
    const particles = []
    
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        style: {
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 2 + 's',
          animationDuration: (Math.random() * 3 + 2) + 's',
          opacity: Math.random() * 0.6 + 0.4
        }
      })
    }
    
    return particles
  },

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 限制时间
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

// 预设配置
export const presets = {
  // 最小化配置 - 适合移动端或性能敏感场景
  minimal: {
    enableAnimations: false,
    showParticles: false,
    autoCollapse: true,
    collapseDelay: 2000,
    maxParticles: 0,
    animationSpeed: 'fast'
  },

  // 标准配置 - 平衡性能和效果
  standard: {
    ...defaultConfig
  },

  // 豪华配置 - 最佳视觉效果
  premium: {
    enableAnimations: true,
    showParticles: true,
    autoCollapse: false,
    maxParticles: 12,
    animationSpeed: 'medium',
    showReadingProgress: true,
    showWordCount: true,
    showReadingTime: true,
    showQuickActions: true
  },

  // 无障碍配置 - 符合无障碍标准
  accessible: {
    enableAnimations: false,
    showParticles: false,
    autoCollapse: false,
    reducedMotion: true,
    animationSpeed: 'fast'
  }
}

export default {
  defaultConfig,
  themeConfigs,
  animationSpeeds,
  utils,
  presets
}