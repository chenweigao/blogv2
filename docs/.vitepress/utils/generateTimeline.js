import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseFrontmatter } from './frontmatter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 生成时间线数据
 * 扫描 docs 目录下的所有 .md 文件，提取文件信息生成时间线
 */
export function generateTimelineData() {
  const docsDir = path.resolve(__dirname, '../../')
  const timelineData = []

  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      // 跳过 .vitepress 目录和 node_modules
      if (item.startsWith('.') || item === 'node_modules' || item === 'public') {
        continue
      }
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item))
      } else if (item.endsWith('.md') && item !== 'index.md') {
        const relativeFilePath = path.join(relativePath, item)
        const fileContent = fs.readFileSync(fullPath, 'utf-8')
        
        const frontmatter = parseFrontmatter(fileContent)
         
        // 提取标题
        let title = frontmatter?.title
        if (!title) {
          const titleMatch = fileContent.match(/^#\s+(.+)$/m)
          title = titleMatch ? titleMatch[1] : item.replace('.md', '')
        }
         
        // 提取描述
        let description = frontmatter?.description
        if (!description) {
          // 提取第一段非标题内容作为描述
          const contentWithoutFrontmatter = (frontmatter && Object.keys(frontmatter).length > 0)
            ? fileContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
            : fileContent
          const paragraphs = contentWithoutFrontmatter.split('\n').filter(line => 
            line.trim() && !line.startsWith('#') && !line.startsWith('```')
          )
          description = paragraphs[0] ? paragraphs[0].substring(0, 150) + '...' : ''
        }
         
        // 获取文件时间信息
        const createTime = frontmatter?.date || stat.birthtime
        const updateTime = frontmatter?.updated || stat.mtime
         
        // 确定分类
        const category = relativePath.split(path.sep)[0] || 'general'
         
        timelineData.push({
          title,
          description,
          path: '/' + relativeFilePath.replace(/\\/g, '/').replace('.md', ''),
          category,
          createTime: new Date(createTime).toISOString(),
          updateTime: new Date(updateTime).toISOString(),
          tags: Array.isArray(frontmatter?.tags)
            ? frontmatter.tags
            : (typeof frontmatter?.tags === 'string'
                ? frontmatter.tags.split(',').map(t => t.trim()).filter(Boolean)
                : [])
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
 * 将时间线数据写入文件
 */
export function writeTimelineData() {
  const timelineData = generateTimelineData()
  const outputPath = path.resolve(__dirname, '../data/timeline.json')
  
  // 确保目录存在
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(timelineData, null, 2))
  console.log(`Timeline data generated: ${timelineData.length} articles`)
  return timelineData
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  writeTimelineData()
}