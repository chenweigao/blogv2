import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function isSafeRelativePath(p) {
  if (!p || typeof p !== 'string') return false
  if (p.includes('\0')) return false
  if (p.startsWith('/') || p.startsWith('\\')) return false
  if (p.includes('..')) return false
  return true
}

/**
 * 实时获取文件的 Git 历史记录
 * @param {string} filePath - 文件相对于 docs 目录的路径
 * @param {number} maxEntries - 最大历史记录条数
 * @returns {Promise<Array>} 历史记录数组
 */
export async function getRealtimeGitHistory(filePath, maxEntries = 10) {
  return new Promise((resolve, reject) => {
    try {
      const repoRoot = path.resolve(__dirname, '../../../')
      if (!isSafeRelativePath(filePath)) {
        return reject(new Error('Invalid file path'))
      }
      const docsDir = path.resolve(repoRoot, 'docs')
      const resolved = path.resolve(docsDir, filePath)
      if (!resolved.startsWith(docsDir)) {
        return reject(new Error('Path outside docs directory'))
      }
      const limit = Math.max(1, Math.min(Number(maxEntries) || 10, 100))
      const args = [
        'log',
        '--follow',
        '--format=%h|%an|%ad|%s',
        '--date=short',
        `-${limit}`,
        '--',
        path.relative(repoRoot, resolved)
      ]
      const child = spawn('git', args, { cwd: repoRoot })
      let stdout = ''
      let stderr = ''
      const timeoutMs = 3000
      const t = setTimeout(() => {
        try { child.kill('SIGKILL') } catch {}
      }, timeoutMs)
      child.stdout.on('data', (d) => { stdout += String(d) })
      child.stderr.on('data', (d) => { stderr += String(d) })
      child.on('error', (err) => {
        clearTimeout(t)
        reject(err)
      })
      child.on('close', (code) => {
        clearTimeout(t)
        if (code !== 0) {
          return reject(new Error(stderr.trim() || `git exited with code ${code}`))
        }
        const out = stdout.trim()
        if (!out) return resolve([])
        const history = out.split('\n').map(line => {
          const [hash, author, date, subject] = line.split('|')
          return {
            hash: hash?.trim(),
            author: author?.trim(),
            date: date?.trim(),
            subject: subject?.trim()
          }
        }).filter(e => e.hash)
        resolve(history)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * VitePress 开发服务器 API 处理函数
 * 用于在开发模式下提供实时 git 历史记录 API
 */
export function createGitHistoryAPI() {
  return {
    name: 'git-history-api',
    configureServer(server) {
      server.middlewares.use('/api/git-history', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next()
        }
        
        const url = new URL(req.url, `http://${req.headers.host}`)
        const filePath = url.searchParams.get('file')
        const maxParam = parseInt(url.searchParams.get('max') || '10', 10)
        const maxEntries = Number.isFinite(maxParam) ? Math.max(1, Math.min(maxParam, 100)) : 10
        
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing file parameter' }))
          return
        }
        
        try {
          const history = await getRealtimeGitHistory(filePath, maxEntries)
          
          // 收紧 CORS：仅回显请求来源，并限定方法
          const origin = req.headers.origin
          if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin)
            res.setHeader('Vary', 'Origin')
            res.setHeader('Access-Control-Allow-Methods', 'GET')
          }
          res.setHeader('Content-Type', 'application/json')
          
          res.end(JSON.stringify({
            filePath,
            history,
            lastUpdated: history.length > 0 ? history[0].date : null,
            totalCommits: history.length
          }))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: error.message }))
        }
      })
    }
  }
}