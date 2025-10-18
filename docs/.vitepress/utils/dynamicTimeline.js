import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 动态生成时间线数据
 * 实时扫描 docs 目录下的所有 .md 文件，提取文件信息生成时间线
 * 不依赖预生成的 JSON 文件，支持开发和构建时的动态更新
 */
export function generateDynamicTimelineData() {
  const docsDir = path.resolve(__dirname, '../../')
  const timelineData = []

  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      // 跳过 .vitepress 目录、node_modules、public 等
      if (item.startsWith('.') || item === 'node_modules' || item === 'public') {
        continue
      }
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item))
      } else if (item.endsWith('.md') && item !== 'index.md') {
        const relativeFilePath = path.join(relativePath, item)
        const fileContent = fs.readFileSync(fullPath, 'utf-8')
        
        // 提取并解析 frontmatter
        const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/)
        let frontmatter = {}
        
        if (frontmatterMatch) {
          try {
            // 使用 js-yaml 正确解析 YAML frontmatter
            frontmatter = yaml.load(frontmatterMatch[1]) || {}
          } catch (e) {
            console.warn(`Failed to parse frontmatter in ${relativeFilePath}:`, e)
            // 降级到简单解析
            frontmatter = parseSimpleFrontmatter(frontmatterMatch[1])
          }
        }
        
        // 提取标题
        let title = frontmatter.title
        if (!title) {
          const titleMatch = fileContent.match(/^#\s+(.+)$/m)
          title = titleMatch ? titleMatch[1] : item.replace('.md', '')
        }
        
        // 提取描述
        let description = frontmatter.description
        if (!description) {
          // 提取第一段非标题内容作为描述
          const contentWithoutFrontmatter = frontmatterMatch 
            ? fileContent.replace(/^---\n[\s\S]*?\n---\n/, '') 
            : fileContent
          const paragraphs = contentWithoutFrontmatter
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('```'))
          description = paragraphs[0] ? paragraphs[0].substring(0, 150) + '...' : ''
        }
        
        // 获取时间信息
        let createTime = frontmatter.date
        if (createTime) {
          // 处理各种日期格式
          if (typeof createTime === 'string') {
            createTime = new Date(createTime)
          }
        } else {
          createTime = stat.birthtime
        }
        
        const updateTime = frontmatter.updated 
          ? new Date(frontmatter.updated) 
          : stat.mtime
        
        // 确定分类
        const category = relativePath.split(path.sep)[0] || 'general'
        
        // 处理标签
        let tags = []
        if (frontmatter.tags) {
          if (Array.isArray(frontmatter.tags)) {
            tags = frontmatter.tags.map(tag => String(tag).trim())
          } else if (typeof frontmatter.tags === 'string') {
            tags = frontmatter.tags.split(',').map(tag => tag.trim())
          }
        }
        
        timelineData.push({
          title,
          description,
          path: '/' + relativeFilePath.replace(/\\/g, '/').replace('.md', ''),
          category,
          createTime: createTime.toISOString(),
          updateTime: updateTime.toISOString(),
          tags,
          // 添加原始日期用于显示
          displayDate: frontmatter.date ? formatDisplayDate(createTime) : null
        })
      }
    }
  }
  
  scanDirectory(docsDir)
  
  // 按创建时间倒序排列
  timelineData.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  
  return timelineData
}

/**
 * 简单的 frontmatter 解析器（降级方案）
 */
function parseSimpleFrontmatter(yamlContent) {
  const frontmatter = {}
  const lines = yamlContent.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '')
      frontmatter[key] = value
    }
  }
  
  return frontmatter
}

/**
 * 格式化显示日期
 */
function formatDisplayDate(date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * VitePress 数据加载器
 * 用于在构建时和开发时动态加载时间线数据
 */
export default {
  watch: ['**/*.md'],
  load() {
    return generateDynamicTimelineData()
  }
}