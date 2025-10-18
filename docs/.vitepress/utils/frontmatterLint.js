import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseFrontmatter } from './frontmatter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function walkDocs(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'public' || e.name === '.vitepress') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      walkDocs(full, acc)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      acc.push(full)
    }
  }
  return acc
}

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const fm = parseFrontmatter(content)
  const issues = []

  // 标题必须存在
  if (!fm.title || typeof fm.title !== 'string' || !fm.title.trim()) {
    issues.push('missing-title')
  }
  // 日期若存在需可解析
  if (fm.date) {
    const d = new Date(fm.date)
    if (isNaN(d.getTime())) issues.push('invalid-date')
  }
  // 更新日期若存在需可解析
  if (fm.updated) {
    const d = new Date(fm.updated)
    if (isNaN(d.getTime())) issues.push('invalid-updated')
  }
  // tags 类型为数组或可拆分字符串
  if (fm.tags && !Array.isArray(fm.tags) && typeof fm.tags !== 'string') {
    issues.push('invalid-tags')
  }

  return { filePath, issues }
}

function main() {
  const docsDir = path.resolve(__dirname, '../../')
  const files = walkDocs(docsDir, [])
  const results = files.map(lintFile).filter(r => r.issues.length > 0)

  if (results.length > 0) {
    console.error('Frontmatter Lint: found issues:')
    results.forEach(r => {
      console.error(`- ${path.relative(process.cwd(), r.filePath)}: ${r.issues.join(', ')}`)
    })
    process.exit(1)
  } else {
    console.log('Frontmatter Lint: OK')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main