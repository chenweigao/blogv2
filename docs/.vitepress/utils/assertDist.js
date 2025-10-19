import fs from 'fs'
import path from 'path'

const DIST_DIR = path.resolve(process.cwd(), 'docs/.vitepress/dist')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')
const SITEMAP_XML = path.join(DIST_DIR, 'sitemap.xml')

function assert(condition, message) {
  if (!condition) {
    console.error('[assert:dist] FAIL:', message)
    process.exit(1)
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function main() {
  console.log('[assert:dist] Checking dist directory...')
  assert(fs.existsSync(DIST_DIR), 'dist directory does not exist')

  console.log('[assert:dist] Checking index.html...')
  assert(fs.existsSync(INDEX_HTML), 'index.html missing')
  const index = read(INDEX_HTML)

  // 基本资源检查：favicon/logo 路径应包含 base '/blogv2/'
  assert(index.includes('/blogv2/favicon.ico'), 'favicon link with base "/blogv2/" missing')
  assert(index.includes('/blogv2/logo.svg'), 'logo link with base "/blogv2/" missing')

  console.log('[assert:dist] Checking sitemap.xml...')
  assert(fs.existsSync(SITEMAP_XML), 'sitemap.xml missing')
  const sitemap = read(SITEMAP_XML)
  assert(sitemap.includes('https://chenweigao.github.io/blogv2/'), 'sitemap hostname incorrect')

  // 资产与页面数量基本检查
  const htmlFiles = fs.readdirSync(DIST_DIR).filter(f => f.endsWith('.html'))
  assert(htmlFiles.length > 0, 'no html pages found in dist')

  console.log('[assert:dist] All checks passed.')
}

main()