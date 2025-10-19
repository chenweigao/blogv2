import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseFrontmatter } from './frontmatter.js'
import { generateTimelineData } from './generateTimeline.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 增量更新时间线数据
 * 只处理变更的文件，提高性能
 */
class IncrementalUpdater {
  constructor() {
    this.timelineDataPath = path.resolve(__dirname, '../data/timeline.json')
    this.cacheFilePath = path.resolve(__dirname, '../data/.timeline-cache.json')
  }

  /**
   * 获取现有时间线数据
   */
  getExistingData() {
    try {
      if (fs.existsSync(this.timelineDataPath)) {
        const data = fs.readFileSync(this.timelineDataPath, 'utf-8')
        return JSON.parse(data)
      }
    } catch (error) {
      console.warn('读取现有时间线数据失败:', error.message)
    }
    return []
  }

  /**
   * 获取文件缓存信息
   */
  getFileCache() {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const data = fs.readFileSync(this.cacheFilePath, 'utf-8')
        return JSON.parse(data)
      }
    } catch (error) {
      console.warn('读取文件缓存失败:', error.message)
    }
    return {}
  }

  /**
   * 保存文件缓存信息
   */
  saveFileCache(cache) {
    try {
      const cacheDir = path.dirname(this.cacheFilePath)
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(cache, null, 2))
    } catch (error) {
      console.error('保存文件缓存失败:', error.message)
    }
  }

  /**
   * 获取文件的修改时间戳
   */
  getFileTimestamp(filePath) {
    try {
      const stat = fs.statSync(filePath)
      return stat.mtime.getTime()
    } catch (error) {
      return 0
    }
  }

  /**
   * 扫描并识别变更的文件
   */
  scanChangedFiles() {
    const docsDir = path.resolve(__dirname, '../../')
    const fileCache = this.getFileCache()
    const changedFiles = []
    const deletedFiles = []
    const newCache = {}

    // 递归扫描文件
    const scanDirectory = (dir, relativePath = '') => {
      try {
        const items = fs.readdirSync(dir)
        
        for (const item of items) {
          const fullPath = path.join(dir, item)
          const stat = fs.statSync(fullPath)
          
          // 跳过特定目录
          if (item.startsWith('.') || item === 'node_modules' || item === 'public') {
            continue
          }
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath, path.join(relativePath, item))
          } else if (item.endsWith('.md') && item !== 'index.md') {
            const relativeFilePath = path.join(relativePath, item)
            const timestamp = this.getFileTimestamp(fullPath)
            
            newCache[relativeFilePath] = timestamp
            
            // 检查是否为新文件或已修改文件
            if (!fileCache[relativeFilePath] || fileCache[relativeFilePath] !== timestamp) {
              changedFiles.push({
                path: relativeFilePath,
                fullPath: fullPath,
                isNew: !fileCache[relativeFilePath]
              })
            }
          }
        }
      } catch (error) {
        console.warn(`扫描目录失败 ${dir}:`, error.message)
      }
    }

    scanDirectory(docsDir)

    // 检查删除的文件
    for (const cachedFile in fileCache) {
      if (!newCache[cachedFile]) {
        deletedFiles.push(cachedFile)
      }
    }

    // 保存新的缓存
    this.saveFileCache(newCache)

    return { changedFiles, deletedFiles }
  }

  /**
   * 执行增量更新
   */
  async performIncrementalUpdate() {
    console.log('🔍 扫描文件变更...')
    
    const { changedFiles, deletedFiles } = this.scanChangedFiles()
    
    if (changedFiles.length === 0 && deletedFiles.length === 0) {
      console.log('✅ 没有检测到文件变更，跳过更新')
      return false
    }

    console.log(`📝 检测到 ${changedFiles.length} 个变更文件，${deletedFiles.length} 个删除文件`)
    
    if (changedFiles.length > 0) {
      console.log('变更文件:')
      changedFiles.forEach(file => {
        console.log(`  ${file.isNew ? '➕' : '✏️'} ${file.path}`)
      })
    }
    
    if (deletedFiles.length > 0) {
      console.log('删除文件:')
      deletedFiles.forEach(file => console.log(`  🗑️ ${file}`))
    }

    // 读取现有数据并构建索引
    const existing = this.getExistingData()
    const map = new Map(existing.map(item => [item.path, item]))

    // 工具函数：从单个文件构建条目
    const buildEntry = (fullPath, relativePath) => {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const fm = parseFrontmatter(content)

        // 标题
        let title = fm?.title
        if (!title) {
          const m = content.match(/^#\s+(.+)$/m)
          title = m ? m[1] : relativePath.replace(/\\/g, '/').split('/').pop().replace(/\.md$/, '')
        }

        // 描述
        let description = fm?.description
        if (!description) {
          const withoutFm = (fm && Object.keys(fm).length > 0)
            ? content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
            : content
          const paras = withoutFm.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('```'))
          description = paras[0] ? paras[0].slice(0, 150) + '...' : ''
        }

        const stat = fs.statSync(fullPath)
        const createTime = fm?.date || stat.birthtime
        const updateTime = fm?.updated || stat.mtime
        const category = (relativePath.split(path.sep)[0] || 'general')
        const tags = Array.isArray(fm?.tags)
          ? fm.tags
          : (typeof fm?.tags === 'string' ? fm.tags.split(',').map(t => t.trim()).filter(Boolean) : [])

        return {
          title,
          description,
          path: '/' + relativePath.replace(/\\/g, '/').replace('.md', ''),
          category,
          createTime: new Date(createTime).toISOString(),
          updateTime: new Date(updateTime).toISOString(),
          tags
        }
      } catch {
        return null
      }
    }

    // 处理变更与新增
    for (const f of changedFiles) {
      const entry = buildEntry(f.fullPath, f.path)
      if (entry) {
        map.set(entry.path, entry)
      }
    }

    // 处理删除
    for (const rel of deletedFiles) {
      const p = '/' + rel.replace(/\\/g, '/').replace('.md', '')
      map.delete(p)
    }

    // 重新排序并保存
    const newTimelineData = Array.from(map.values()).sort(
      (a, b) => new Date(b.createTime) - new Date(a.createTime)
    )

    const outputDir = path.dirname(this.timelineDataPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(this.timelineDataPath, JSON.stringify(newTimelineData, null, 2))

    console.log(`✅ 时间线数据已更新: ${newTimelineData.length} 篇文章`)

    return true
  }

  /**
   * 强制完整更新
   */
  async forceFullUpdate() {
    console.log('🔄 执行完整更新...')
    
    // 清除缓存
    if (fs.existsSync(this.cacheFilePath)) {
      fs.unlinkSync(this.cacheFilePath)
    }
    
    // 重新生成数据
    const timelineData = generateTimelineData()
    
    // 保存数据
    const outputDir = path.dirname(this.timelineDataPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(this.timelineDataPath, JSON.stringify(timelineData, null, 2))
    
    // 重建缓存
    this.scanChangedFiles()
    
    console.log(`✅ 完整更新完成: ${timelineData.length} 篇文章`)
    
    return timelineData
  }
}

// 命令行接口
if (import.meta.url === `file://${process.argv[1]}`) {
  const updater = new IncrementalUpdater()
  const mode = process.argv[2] || 'incremental'
  
  if (mode === 'full') {
    updater.forceFullUpdate()
  } else {
    updater.performIncrementalUpdate()
  }
}

export default IncrementalUpdater