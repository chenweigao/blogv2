import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

/**
 * 自动生成侧边栏配置
 * 根据 docs 文件夹结构扫描并生成 VitePress 侧边栏配置
 */

// 需要忽略的文件和文件夹
const IGNORE_PATTERNS = [
  '.vitepress',
  'node_modules',
  '.git',
  '.DS_Store',
  'index.md',
  'README.md'
]

// 需要忽略的文件扩展名
const IGNORE_EXTENSIONS = ['.json', '.js', '.ts', '.vue', '.css', '.scss', '.less']

/**
 * 从 markdown 文件中提取 frontmatter
 * @param {string} filePath 文件路径
 * @returns {object} frontmatter 对象
 */
function extractFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    
    if (frontmatterMatch) {
      return yaml.load(frontmatterMatch[1]) || {}
    }
  } catch (error) {
    console.warn(`Failed to parse frontmatter from ${filePath}:`, error.message)
  }
  
  return {}
}

/**
 * 格式化文件名为显示标题
 * @param {string} filename 文件名（不含扩展名）
 * @returns {string} 格式化后的标题
 */
function formatTitle(filename) {
  return filename
    .replace(/[-_]/g, ' ') // 将连字符和下划线替换为空格
    .replace(/\b\w/g, l => l.toUpperCase()) // 首字母大写
    .trim()
}

/**
 * 获取文件或文件夹的显示标题
 * @param {string} filePath 文件路径
 * @param {string} name 文件或文件夹名称
 * @param {boolean} isFile 是否为文件
 * @returns {string} 显示标题
 */
function getDisplayTitle(filePath, name, isFile = false) {
  if (isFile) {
    // 对于文件，尝试从 frontmatter 中获取 title
    const frontmatter = extractFrontmatter(filePath)
    if (frontmatter.title) {
      return frontmatter.title
    }
    
    // 如果没有 frontmatter title，使用格式化的文件名
    const nameWithoutExt = path.parse(name).name
    return formatTitle(nameWithoutExt)
  } else {
    // 对于文件夹，使用格式化的文件夹名
    return formatTitle(name)
  }
}

/**
 * 检查是否应该忽略文件或文件夹
 * @param {string} name 文件或文件夹名称
 * @param {boolean} isFile 是否为文件
 * @returns {boolean} 是否应该忽略
 */
function shouldIgnore(name, isFile = false) {
  // 检查忽略模式
  if (IGNORE_PATTERNS.some(pattern => name.includes(pattern))) {
    return true
  }
  
  // 检查隐藏文件
  if (name.startsWith('.')) {
    return true
  }
  
  // 对于文件，检查扩展名
  if (isFile) {
    const ext = path.extname(name).toLowerCase()
    if (ext !== '.md') {
      return true
    }
  }
  
  return false
}

/**
 * 递归扫描目录生成侧边栏项
 * @param {string} dirPath 目录路径
 * @param {string} basePath 基础路径（用于生成链接）
 * @param {number} depth 当前深度
 * @returns {Array} 侧边栏项数组
 */
function scanDirectory(dirPath, basePath = '', depth = 0) {
  const items = []
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    // 分别处理文件夹和文件
    const directories = entries.filter(entry => entry.isDirectory() && !shouldIgnore(entry.name))
    const files = entries.filter(entry => entry.isFile() && !shouldIgnore(entry.name, true))
    
    // 先处理文件夹
    directories.forEach(dir => {
      const dirFullPath = path.join(dirPath, dir.name)
      const dirLinkPath = path.posix.join(basePath, dir.name)
      
      // 检查文件夹是否包含 markdown 文件
      const hasMarkdownFiles = hasMarkdownFilesRecursive(dirFullPath)
      
      if (hasMarkdownFiles) {
        const subItems = scanDirectory(dirFullPath, dirLinkPath, depth + 1)
        
        if (subItems.length > 0) {
          items.push({
            text: getDisplayTitle(dirFullPath, dir.name),
            collapsed: depth > 0, // 第一级不折叠，其他级别默认折叠
            items: subItems
          })
        }
      }
    })
    
    // 再处理文件
    files.forEach(file => {
      const fileFullPath = path.join(dirPath, file.name)
      const fileName = path.parse(file.name).name
      const fileLinkPath = path.posix.join(basePath, fileName)
      
      items.push({
        text: getDisplayTitle(fileFullPath, file.name, true),
        link: `/${fileLinkPath}`
      })
    })
    
  } catch (error) {
    console.warn(`Failed to scan directory ${dirPath}:`, error.message)
  }
  
  return items
}

/**
 * 递归检查目录是否包含 markdown 文件
 * @param {string} dirPath 目录路径
 * @returns {boolean} 是否包含 markdown 文件
 */
function hasMarkdownFilesRecursive(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    // 检查当前目录是否有 markdown 文件
    const hasMarkdown = entries.some(entry => 
      entry.isFile() && 
      !shouldIgnore(entry.name, true) && 
      path.extname(entry.name).toLowerCase() === '.md'
    )
    
    if (hasMarkdown) {
      return true
    }
    
    // 递归检查子目录
    const directories = entries.filter(entry => entry.isDirectory() && !shouldIgnore(entry.name))
    return directories.some(dir => hasMarkdownFilesRecursive(path.join(dirPath, dir.name)))
    
  } catch (error) {
    return false
  }
}

/**
 * 生成完整的侧边栏配置
 * @param {string} docsPath docs 目录路径
 * @returns {object} 侧边栏配置对象
 */
function generateSidebar(docsPath) {
  // 如果没有提供路径，自动计算 docs 目录路径
  if (!docsPath) {
    // 获取当前工作目录
    const cwd = process.cwd()
    // 如果当前在项目根目录，docs 路径为 './docs'
    // 如果当前在 utils 目录，需要回到项目根目录
    const possibleDocsPaths = [
      path.join(cwd, 'docs'),           // 当前目录下的 docs
      path.join(cwd, '../../../docs'),  // 从 utils 目录回到根目录的 docs
      path.join(cwd, '../../docs'),     // 从 .vitepress 目录回到根目录的 docs
      path.join(cwd, '../docs')         // 从 config 目录回到根目录的 docs
    ]
    
    // 找到第一个存在的 docs 目录
    docsPath = possibleDocsPaths.find(p => {
      try {
        return fs.existsSync(p) && fs.statSync(p).isDirectory()
      } catch {
        return false
      }
    })
    
    if (!docsPath) {
      console.error('❌ Could not find docs directory. Tried paths:', possibleDocsPaths)
      return {}
    }
  }
  
  console.log(`📁 Using docs path: ${docsPath}`)
  
  const sidebar = {}
  
  try {
    const entries = fs.readdirSync(docsPath, { withFileTypes: true })
    const directories = entries.filter(entry => entry.isDirectory() && !shouldIgnore(entry.name))
    
    directories.forEach(dir => {
      const dirPath = path.join(docsPath, dir.name)
      const sidebarKey = `/${dir.name}/`
      
      // 检查目录是否包含 markdown 文件
      const hasMarkdownFiles = hasMarkdownFilesRecursive(dirPath)
      
      if (hasMarkdownFiles) {
        const items = scanDirectory(dirPath, dir.name)
        
        if (items.length > 0) {
          sidebar[sidebarKey] = [{
            text: getDisplayTitle(dirPath, dir.name),
            collapsed: false,
            items: items
          }]
        }
      }
    })
    
  } catch (error) {
    console.error('Failed to generate sidebar:', error.message)
  }
  
  return sidebar
}

/**
 * 写入侧边栏配置到文件
 * @param {object} sidebar 侧边栏配置
 * @param {string} outputPath 输出文件路径
 */
function writeSidebarConfig(sidebar, outputPath) {
  // 如果没有提供输出路径，自动计算
  if (!outputPath) {
    const cwd = process.cwd()
    const possibleOutputPaths = [
      path.join(cwd, 'docs/.vitepress/config/sidebar/auto-generated.js'),
      path.join(cwd, '../../../docs/.vitepress/config/sidebar/auto-generated.js'),
      path.join(cwd, '../../config/sidebar/auto-generated.js'),
      path.join(cwd, '../sidebar/auto-generated.js')
    ]
    
    // 找到第一个目录存在的输出路径
    outputPath = possibleOutputPaths.find(p => {
      try {
        const dir = path.dirname(p)
        return fs.existsSync(dir)
      } catch {
        return false
      }
    })
    
    if (!outputPath) {
      // 如果都不存在，使用第一个并创建目录
      outputPath = possibleOutputPaths[0]
    }
  }
  
  try {
    const configContent = `// 自动生成的侧边栏配置
// 此文件由 generateSidebar.js 自动生成，请勿手动修改

export const autoGeneratedSidebar = ${JSON.stringify(sidebar, null, 2)}
`
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, configContent, 'utf-8')
    console.log(`✅ Sidebar configuration written to: ${outputPath}`)
    
  } catch (error) {
    console.error('Failed to write sidebar configuration:', error.message)
  }
}

/**
 * 主函数：生成并写入侧边栏配置
 */
export function generateAndWriteSidebar() {
  console.log('🔄 Generating sidebar configuration...')
  
  const sidebar = generateSidebar()
  
  console.log(`📊 Generated ${Object.keys(sidebar).length} sidebar sections`)
  
  // 写入配置文件
  writeSidebarConfig(sidebar)
  
  return sidebar
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAndWriteSidebar()
}

export { generateSidebar, writeSidebarConfig }