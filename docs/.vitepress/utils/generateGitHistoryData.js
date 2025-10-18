import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 获取文件的 Git 历史记录
 * @param {string} filePath - 文件相对于仓库根目录的路径
 * @param {number} maxEntries - 最大历史记录条数
 * @returns {Array} 历史记录数组
 */
function getFileGitHistory(filePath, maxEntries = 10) {
  try {
    const repoRoot = path.resolve(__dirname, '../../../')
    // 添加 --follow 参数以追踪文件移动历史
    const gitCommand = `git log --follow --format="%h|%an|%ad|%s" --date=short -${maxEntries} -- "${filePath}"`
    
    const output = execSync(gitCommand, { 
      cwd: repoRoot, 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    if (!output.trim()) {
      return []
    }
    
    return output.trim().split('\n').map(line => {
      const [hash, author, date, subject] = line.split('|')
      return {
        hash: hash?.trim(),
        author: author?.trim(),
        date: date?.trim(),
        subject: subject?.trim()
      }
    }).filter(entry => entry.hash) // 过滤掉无效的条目
    
  } catch (error) {
    console.warn(`Failed to get git history for ${filePath}:`, error.message)
    return []
  }
}

/**
 * 生成所有文档的历史记录数据
 */
export function generateAllGitHistoryData() {
  const docsDir = path.resolve(__dirname, '../../')
  const historyData = {}
  let processedCount = 0
  
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      // 跳过 .vitepress 目录和其他不需要的目录
      if (item.startsWith('.') || item === 'node_modules' || item === 'public') {
        continue
      }
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item))
      } else if (item.endsWith('.md') && item !== 'timeline.md') {
        const relativeFilePath = path.join(relativePath, item).replace(/\\/g, '/')
        const repoRelativePath = `docs/${relativeFilePath}`
        
        // 获取历史记录
        const history = getFileGitHistory(repoRelativePath)
        
        // 使用文档路径作为键（去掉 .md 扩展名）
        const docPath = '/' + relativeFilePath.replace('.md', '')
        historyData[docPath] = {
          filePath: relativeFilePath,
          history: history,
          lastUpdated: history.length > 0 ? history[0].date : null,
          totalCommits: history.length
        }
        
        processedCount++
        console.log(`Processed git history for: ${relativeFilePath}`)
      }
    }
  }
  
  console.log('Starting to generate git history data for all documents...')
  scanDirectory(docsDir)
  console.log(`Git history data generation completed. Processed ${processedCount} files.`)
  
  return historyData
}

/**
 * 将历史记录数据写入 JSON 文件
 */
export function writeGitHistoryData() {
  const historyData = generateAllGitHistoryData()
  const outputPath = path.resolve(__dirname, '../data/git-history.json')
  
  // 确保目录存在
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(historyData, null, 2))
  console.log(`Git history data written to: ${outputPath}`)
  console.log(`Total documents processed: ${Object.keys(historyData).length}`)
  
  return historyData
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  writeGitHistoryData()
}