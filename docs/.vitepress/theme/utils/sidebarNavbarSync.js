/**
 * 侧边栏与导航栏同步工具
 * 确保点击侧边栏链接后，顶部导航栏能正确高亮
 */

export function setupSidebarNavbarSync() {
  if (typeof window === 'undefined') return

  // 监听侧边栏链接点击
  const handleSidebarClick = (event) => {
    const target = event.target
    
    // 检查是否是侧边栏链接
    if (target.matches('.VPSidebarItem .link, .VPSidebarItem .link *')) {
      // console.log('[SidebarNavbarSync] Sidebar link clicked')
      
      // 延迟调用导航栏刷新，确保路由已经更新
      setTimeout(() => {
        if (window.__refreshNavbarHighlight) {
          window.__refreshNavbarHighlight()
        }
      }, 50)
      
      // 额外的延迟调用，确保在复杂情况下也能正常工作
      setTimeout(() => {
        if (window.__refreshNavbarHighlight) {
          window.__refreshNavbarHighlight()
        }
      }, 200)
    }
  }
  
  // 使用事件委托监听所有侧边栏点击
  document.addEventListener('click', handleSidebarClick, true)
  
  // 返回清理函数
  return () => {
    document.removeEventListener('click', handleSidebarClick, true)
  }
}