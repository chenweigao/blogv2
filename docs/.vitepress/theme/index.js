import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ArticleMeta from './components/ArticleMeta.vue'
import PageLoader from './components/PageLoader.vue'
import ScrollAnimations from './components/ScrollAnimations.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ArticleMeta', ArticleMeta)
    app.component('PageLoader', PageLoader)
    app.component('ScrollAnimations', ScrollAnimations)
    app.component('ParticleBackground', ParticleBackground)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 在页面最外层添加粒子背景
      'layout-top': () => h(ParticleBackground, { 
        density: 30, 
        speed: 0.5, 
        showInteractive: true,
        theme: 'knowledge'
      }),
      // 在文档内容前插入文章元数据组件
      'doc-before': () => h(ArticleMeta),
      // 在页面底部添加滚动动画组件
      'layout-bottom': () => [
        h(ScrollAnimations),
        h(PageLoader)
      ]
    })
  }
}