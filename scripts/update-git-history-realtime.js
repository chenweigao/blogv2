#!/usr/bin/env node

/**
 * 实时 Git 历史记录更新脚本
 * 提供多种实时收集方案
 */

import { getRealtimeGitHistory } from '../docs/.vitepress/utils/gitHistoryAPI.js'
import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)

console.log('🔄 实时 Git 历史记录工具')
console.log('='.repeat(50))

if (args.length === 0) {
  console.log('用法:')
  console.log('  node scripts/update-git-history-realtime.js <file-path>  # 获取单个文件的实时历史')
  console.log('  node scripts/update-git-history-realtime.js --server     # 启动实时历史记录服务器')
  console.log('  node scripts/update-git-history-realtime.js --test       # 测试实时获取功能')
  process.exit(0)
}

const command = args[0]

switch (command) {
  case '--server':
    startRealtimeServer()
    break
  case '--test':
    testRealtimeFunction()
    break
  default:
    getSingleFileHistory(command)
    break
}

async function getSingleFileHistory(filePath) {
  console.log(`📝 获取文件的实时历史记录: ${filePath}`)
  
  try {
    const history = await getRealtimeGitHistory(filePath)
    
    if (history.length === 0) {
      console.log('❌ 未找到历史记录')
      return
    }
    
    console.log(`✅ 找到 ${history.length} 条历史记录:`)
    console.log('')
    
    history.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit.subject}`)
      console.log(`   📅 ${commit.date} | 👤 ${commit.author} | 🔗 ${commit.hash}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ 获取历史记录失败:', error.message)
  }
}

async function testRealtimeFunction() {
  console.log('🧪 测试实时获取功能...')
  
  const testFiles = [
    'algorithms/README.md',
    'artificial-intelligence/index.md',
    'programming-languages/java/index.md'
  ]
  
  for (const file of testFiles) {
    console.log(`\n测试文件: ${file}`)
    try {
      const history = await getRealtimeGitHistory(file, 3)
      console.log(`✅ 成功获取 ${history.length} 条记录`)
      
      if (history.length > 0) {
        console.log(`   最新提交: ${history[0].subject} (${history[0].date})`)
      }
    } catch (error) {
      console.log(`❌ 失败: ${error.message}`)
    }
  }
}

function startRealtimeServer() {
  console.log('🚀 启动实时历史记录服务器...')
  console.log('注意: 这个功能需要在 VitePress 开发服务器中运行')
  console.log('请使用: npm run docs:dev 或 vitepress dev docs')
  console.log('')
  console.log('服务器启动后，API 端点将在以下地址可用:')
  console.log('  GET /api/git-history?file=<file-path>&max=<max-entries>')
  console.log('')
  console.log('示例:')
  console.log('  http://localhost:5173/api/git-history?file=algorithms/README.md&max=10')
}

console.log('='.repeat(50))
console.log('💡 提示: 实时模式在开发环境中自动启用，生产环境使用预生成数据')