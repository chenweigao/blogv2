import chokidar from 'chokidar'
import { writeTimelineData } from './generateTimeline.js'
import { debounce } from './debounce.js'

/**
 * 智能文件监听器
 * 监听 docs 目录下的 .md 文件变化，自动重新生成时间线数据
 */
class TimelineWatcher {
  constructor() {
    this.watcher = null
    this.isGenerating = false
    
    // 防抖处理，避免频繁重新生成
    this.debouncedGenerate = debounce(this.generateTimeline.bind(this), 1000)
  }

  /**
   * 启动监听
   */
  start() {
    console.log('🚀 启动时间线文件监听器...')
    
    // 监听 docs 目录下的所有 .md 文件
    this.watcher = chokidar.watch('docs/**/*.md', {
      ignored: [
        '**/node_modules/**',
        '**/.vitepress/cache/**',
        '**/.vitepress/dist/**',
        '**/.*' // 忽略隐藏文件
      ],
      persistent: true,
      ignoreInitial: true // 忽略初始扫描
    })

    // 监听文件事件
    this.watcher
      .on('add', (path) => {
        console.log(`📝 检测到新文件: ${path}`)
        this.debouncedGenerate()
      })
      .on('change', (path) => {
        console.log(`✏️  文件已修改: ${path}`)
        this.debouncedGenerate()
      })
      .on('unlink', (path) => {
        console.log(`🗑️  文件已删除: ${path}`)
        this.debouncedGenerate()
      })
      .on('error', (error) => {
        console.error('❌ 文件监听错误:', error)
      })
      .on('ready', () => {
        console.log('✅ 文件监听器已就绪，正在监听文档变化...')
        console.log('💡 提示: 按 Ctrl+C 停止监听')
      })
  }

  /**
   * 生成时间线数据
   */
  async generateTimeline() {
    if (this.isGenerating) {
      console.log('⏳ 正在生成中，跳过本次请求...')
      return
    }

    try {
      this.isGenerating = true
      console.log('🔄 重新生成时间线数据...')
      
      const timelineData = writeTimelineData()
      
      console.log(`✅ 时间线数据已更新: ${timelineData.length} 篇文章`)
      console.log('📊 最新文章:', timelineData.slice(0, 3).map(item => item.title).join(', '))
      
    } catch (error) {
      console.error('❌ 生成时间线数据失败:', error)
    } finally {
      this.isGenerating = false
    }
  }

  /**
   * 停止监听
   */
  stop() {
    if (this.watcher) {
      this.watcher.close()
      console.log('🛑 文件监听器已停止')
    }
  }
}

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n👋 正在停止监听器...')
  watcher.stop()
  process.exit(0)
})

process.on('SIGTERM', () => {
  watcher.stop()
  process.exit(0)
})

// 启动监听器
const watcher = new TimelineWatcher()
watcher.start()

export default TimelineWatcher