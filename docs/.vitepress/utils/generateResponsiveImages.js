import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.resolve(__dirname, '../../public')
const SOURCE_DIR = path.join(PUBLIC_DIR, 'images')
const OUTPUT_DIR = path.join(PUBLIC_DIR, '_optimized')
const MANIFEST_PATH = path.resolve(__dirname, '../data/image-manifest.json')

const VALID_EXT = new Set(['.jpg', '.jpeg', '.png'])
const WIDTHS = [480, 768, 1024, 1440]

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  const ents = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of ents) {
    const fp = path.join(dir, e.name)
    if (e.isDirectory()) walk(fp, acc)
    else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase()
      if (VALID_EXT.has(ext)) acc.push(fp)
    }
  }
  return acc
}

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true })
}

async function processImage(absPath, sharp) {
  const relFromPublic = path.relative(PUBLIC_DIR, absPath).split(path.sep).join('/')
  const publicPath = '/' + relFromPublic
  const baseName = path.basename(absPath, path.extname(absPath))
  const ext = path.extname(absPath).toLowerCase()
  const originalFormat = ext === '.png' ? 'png' : 'jpeg'
  const image = sharp(absPath)
  const meta = await image.metadata()
  const origWidth = meta.width || 0
  const origHeight = meta.height || 0
  const mimeOriginal = originalFormat === 'png' ? 'image/png' : 'image/jpeg'

  const outRelDir = path.join('_optimized', path.relative('images', path.dirname(relFromPublic)))
  const outAbsDir = path.join(PUBLIC_DIR, outRelDir)
  await ensureDir(outAbsDir)

  const variantsOriginal = []
  const variantsWebp = []

  for (const w of WIDTHS) {
    if (origWidth && w > origWidth) continue
    const outName = `${baseName}-${w}w${ext}`
    const outAbs = path.join(outAbsDir, outName)
    const outPublic = '/' + path.join(outRelDir, outName).split(path.sep).join('/')
    await sharp(absPath).resize({ width: w }).toFormat(originalFormat, { quality: 82 }).toFile(outAbs)
    variantsOriginal.push({ width: w, src: outPublic })
    const outNameWebp = `${baseName}-${w}w.webp`
    const outAbsWebp = path.join(outAbsDir, outNameWebp)
    const outPublicWebp = '/' + path.join(outRelDir, outNameWebp).split(path.sep).join('/')
    await sharp(absPath).resize({ width: w }).webp({ quality: 82 }).toFile(outAbsWebp)
    variantsWebp.push({ width: w, src: outPublicWebp })
  }

  // 新增：LQIP（base64 极小图）
  let lqip = ''
  try {
    const lqipBuffer = await sharp(absPath).resize({ width: 24 }).webp({ quality: 60 }).toBuffer()
    lqip = 'data:image/webp;base64,' + lqipBuffer.toString('base64')
  } catch (e) {
    console.warn('[images] LQIP failed:', absPath, e?.message || e)
  }

  return {
    key: publicPath,
    value: {
      original: { src: publicPath, width: origWidth, height: origHeight, type: mimeOriginal, lqip },
      variants: {
        original: variantsOriginal.sort((a, b) => a.width - b.width),
        webp: variantsWebp.sort((a, b) => a.width - b.width)
      }
    }
  }
}

export async function generateResponsiveImages() {
  // 新增：允许通过环境变量跳过（例如在某些构建环境中缺失 sharp）
  if (process.env.SKIP_IMAGE_OPTIMIZE === '1') {
    console.log('[images] SKIP_IMAGE_OPTIMIZE=1, skip responsive images generation')
    return true
  }
  // 新增：在函数内部尝试动态加载 sharp，避免在配置解析阶段就失败
  let sharp
  try {
    const mod = await import('sharp')
    sharp = mod?.default || mod
  } catch (e) {
    console.warn('[images] sharp not available, skip responsive images generation:', e?.message || e)
    // 仍然确保清单文件存在，避免下游读取失败
    await ensureDir(path.dirname(MANIFEST_PATH))
    await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 2))
    return false
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.log('[images] No source dir:', SOURCE_DIR, '- writing empty manifest and skipping')
    await ensureDir(path.dirname(MANIFEST_PATH))
    await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 2))
    return true
  }
  const files = walk(SOURCE_DIR, [])
  if (files.length === 0) {
    console.log('[images] No images found under', SOURCE_DIR)
    await ensureDir(path.dirname(MANIFEST_PATH))
    await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 2))
    return true
  }
  const manifest = {}
  console.log(`[images] Processing ${files.length} images...`)
  for (const f of files) {
    try {
      const item = await processImage(f, sharp)
      manifest[item.key] = item.value
    } catch (e) {
      console.warn('[images] Failed:', f, e?.message || e)
    }
  }
  await ensureDir(path.dirname(MANIFEST_PATH))
  await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log('[images] Manifest written:', MANIFEST_PATH)
  return true
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateResponsiveImages().then((ok) => {
    process.exit(ok ? 0 : 1)
  })
}