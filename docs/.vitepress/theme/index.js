import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ArticleMeta from './components/ArticleMeta.vue'
import PageTransition from './components/PageTransition.vue'
import ScrollAnimations from './components/ScrollAnimations.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import GitHistoryModal from './components/GitHistoryModal.vue'
import { h } from 'vue'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ArticleMeta', ArticleMeta)
    app.component('PageTransition', PageTransition)
    app.component('ScrollAnimations', ScrollAnimations)
    app.component('ParticleBackground', ParticleBackground)
    app.component('GitHistoryButton', GitHistoryButton)
    app.component('GitHistoryModal', GitHistoryModal)
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 等待 DOM 更新完成后初始化 medium-zoom
      nextTick(() => {
        mediumZoom('.main img', {
          background: 'rgba(0, 0, 0, 0.8)',
          scrollOffset: 0,
          margin: 24
        })
      })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => initZoom(),
      { flush: 'post' }
    )
  },
  Layout() {
    return h(PageTransition, null, {
      default: () => h(DefaultTheme.Layout, null, {
        // 在页面最外层添加粒子背景
        'layout-top': () => h(ParticleBackground, { 
          density: 30, 
          speed: 0.5, 
          showInteractive: true,
          theme: 'knowledge'
        }),
        // 在文档内容前插入文章元数据组件和历史记录按钮
        'doc-before': () => [
          h(ArticleMeta),
          h('div', { class: 'git-history-container', style: 'margin: 1rem 0; text-align: right;' }, [
            h(GitHistoryButton)
          ])
        ],
        // 在页面底部只添加滚动动画组件（移除了PageLoader）
        'layout-bottom': () => h(ScrollAnimations)
      })
    })
  }
}