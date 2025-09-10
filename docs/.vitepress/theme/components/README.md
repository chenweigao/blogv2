# VitePress 主题组件说明

## 主要改进

### 1. 使用 Shiki 替代手工语法高亮

**之前的问题：**
- 手工编写正则表达式，维护成本高
- 只支持基础的关键词、字符串、注释高亮
- 准确性不足，无法处理复杂语法结构
- 扩展性差，添加新语言需要大量工作

**现在的优势：**
- ✅ 基于 VS Code 的语法高亮引擎，效果专业
- ✅ 支持 100+ 编程语言
- ✅ 多种内置主题可切换
- ✅ 输出真实 HTML，无需额外 CSS
- ✅ 支持行高亮、差异显示等高级功能

### 2. 新增功能

- **主题切换**：支持 8 种不同的代码主题
- **扩展语言支持**：新增 Swift、Kotlin、Dart、Ruby 等语言
- **键盘快捷键**：
  - `Ctrl/Cmd + C`：复制代码
  - `Ctrl/Cmd + L`：切换行号
  - `Ctrl/Cmd + F`：切换全屏
  - `Ctrl/Cmd + T`：切换主题
  - `Escape`：关闭模态框或退出全屏

### 3. 布局优化 - 隐藏右侧 Aside

**功能说明：**
- ✅ 完全隐藏 VitePress 默认的右侧 aside 区域
- ✅ 文章主体获得更多显示空间，提升阅读体验
- ✅ 保留浮动 TOC 组件 (EnhancedTOC)，提供更好的导航体验
- ✅ 响应式设计，在不同屏幕尺寸下都能正常工作

**实现方式：**
- 通过 `hide-aside.css` 样式文件强制隐藏所有 aside 相关元素
- 修改 `Layout.vue` 禁用 `#aside-outline-before` 和 `#aside-outline-after` 插槽
- 调整文档容器的最大宽度和边距，让内容占用更多空间
- 在 VitePress 配置中设置 `outline: false` 禁用默认大纲功能

**配置文件：**
- `docs/.vitepress/theme/styles/hide-aside.css` - 隐藏 aside 的样式规则
- `docs/.vitepress/theme/Layout.vue` - 布局组件，禁用 aside 插槽
- `docs/.vitepress/config.js` - VitePress 配置，设置 `outline: false`

### 4. 性能优化

- 异步加载 Shiki 高亮器
- 更好的错误处理和降级方案
- 优化了滚动同步逻辑

## 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 使用方法

```vue
<template>
  <CodeBlockModal
    :visible="showModal"
    :code="codeContent"
    :language="'javascript'"
    :filename="'example.js'"
    :highlight-lines="[1, 3, 5]"
    @close="showModal = false"
    @fullscreen="handleFullscreen"
  />
</template>

<script setup>
import CodeBlockModal from './components/CodeBlockModal.vue'

const showModal = ref(false)
const codeContent = ref(`
function hello() {
  console.log('Hello, World!')
}
`)
</script>
```

## 支持的语言

JavaScript, TypeScript, Python, Java, C++, C, CSS, HTML, JSON, XML, YAML, Markdown, Bash, Shell, SQL, PHP, Go, Rust, Vue, JSX, TSX, Swift, Kotlin, Dart, Ruby, Scala, R, MATLAB, PowerShell, Dockerfile, Nginx, Apache

## 可用主题

- github-light
- github-dark  
- monokai
- nord
- one-dark-pro
- dracula
- material-theme-palenight
- slack-theme-dark-mode

## 布局特性

### 隐藏右侧 Aside
- 默认隐藏 VitePress 的右侧 aside 区域
- 文章内容获得更宽的显示空间
- 保留浮动 TOC 组件提供导航功能
- 支持响应式设计，适配各种屏幕尺寸

### 浮动 TOC 组件
- 可拖拽的浮动目录组件
- 支持搜索和筛选功能
- 显示阅读进度和预估时间
- 可固定位置或自由拖拽

## 注意事项

1. 首次使用时会异步加载 Shiki，可能有短暂的加载时间
2. 如果 Shiki 加载失败，会自动降级到基础的 HTML 转义显示
3. 建议在生产环境中预加载 Shiki 以获得更好的用户体验
4. 右侧 aside 已被完全隐藏，如需恢复可以移除 `hide-aside.css` 的导入