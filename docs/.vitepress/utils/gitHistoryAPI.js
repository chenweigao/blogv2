import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      const repoRelativePath = `docs/${filePath}`
      const gitCommand = `git log --format="%h|%an|%ad|%s" --date=short -${maxEntries} -- "${repoRelativePath}"`
      
      const output = execSync(gitCommand, { 
        cwd: repoRoot, 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      })
      
      if (!output.trim()) {
        resolve([])
        return
      }
      
      const history = output.trim().split('\n').map(line => {
        const [hash, author, date, subject] = line.split('|')
        return {
          hash: hash?.trim(),
          author: author?.trim(),
          date: date?.trim(),
          subject: subject?.trim()
        }
      }).filter(entry => entry.hash)
      
      resolve(history)
      
    } catch (error) {
      console.warn(`Failed to get realtime git history for ${filePath}:`, error.message)
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
        const maxEntries = parseInt(url.searchParams.get('max') || '10')
        
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing file parameter' }))
          return
        }
        
        try {
          const history = await getRealtimeGitHistory(filePath, maxEntries)
          
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
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