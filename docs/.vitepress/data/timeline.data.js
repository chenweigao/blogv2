import { generateDynamicTimelineData } from '../utils/dynamicTimeline.js'

export default {
  watch: ['**/*.md'],
  load() {
    console.log('🔄 动态加载时间线数据...')
    const data = generateDynamicTimelineData()
    console.log(`✅ 时间线数据已加载: ${data.length} 篇文章`)
    
    // 输出一些调试信息
    const articlesWithTags = data.filter(item => item.tags && item.tags.length > 0)
    console.log(`📝 包含标签的文章: ${articlesWithTags.length} 篇`)
    if (articlesWithTags.length > 0) {
      console.log('📋 标签示例:', articlesWithTags[0].tags)
    }
    
    return data
  }
}