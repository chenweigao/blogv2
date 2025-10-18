import fs from 'fs'
import yaml from 'js-yaml'

/**
 * 解析 markdown 内容中的 frontmatter
 * 返回对象，保持数组/对象等复杂结构，不做手工 split 处理
 */
export function parseFrontmatter(content = '') {
  if (typeof content !== 'string') return {}
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return {}
  try {
    const data = yaml.load(match[1])
    return (data && typeof data === 'object') ? data : {}
  } catch {
    return {}
  }
}

/**
 * 从文件路径直接读取 frontmatter
 */
export function parseFrontmatterFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return parseFrontmatter(content)
  } catch {
    return {}
  }
}