import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TIMEOUT_MS = 5000
const CONCURRENCY = 8

function collectMarkdownFiles(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '.vitepress' || e.name === 'public') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      collectMarkdownFiles(full, acc)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      acc.push(full)
    }
  }
  return acc
}

function extractLinks(content) {
  const links = new Set()
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  const rawUrlRegex = /(https?:\/\/[^\s)"]+)/g
  let m
  while ((m = mdLinkRegex.exec(content))) links.add(m[2])
  while ((m = rawUrlRegex.exec(content))) links.add(m[1])
  return Array.from(links)
}

async function checkLink(url) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const resp = await fetch(url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(t)
    if (resp.ok || (resp.status >= 300 && resp.status < 400)) return { url, ok: true, status: resp.status }
    return { url, ok: false, status: resp.status }
  } catch (e) {
    clearTimeout(t)
    return { url, ok: false, error: e?.message || String(e) }
  }
}

async function main() {
  const docsDir = path.resolve(__dirname, '../../')
  const files = collectMarkdownFiles(docsDir, [])
  const urls = []
  for (const f of files) {
    const c = fs.readFileSync(f, 'utf-8')
    extractLinks(c).forEach((u) => urls.push(u))
  }
  const unique = Array.from(new Set(urls))
  console.log(`LinkCheck: ${unique.length} unique URLs to verify`)

  const results = []
  const queue = unique.slice()
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const u = queue.pop()
      results.push(await checkLink(u))
    }
  })
  await Promise.all(workers)

  const failures = results.filter((r) => !r.ok)
  if (failures.length) {
    console.error('LinkCheck: failures detected:')
    failures.slice(0, 20).forEach((f) => console.error(`- ${f.url} (${f.status || f.error})`))
    process.exit(1)
  } else {
    console.log('LinkCheck: all links healthy')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main