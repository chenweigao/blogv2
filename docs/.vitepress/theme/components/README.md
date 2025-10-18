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

### 2. Layout 组件重构 - 模块化架构

**重构目标：**
- ✅ 将大型 Layout.vue 组件拆分成多个小组件
- ✅ 使用 Vue 3 Module CSS 管理样式
- ✅ 提高代码可维护性和复用性
- ✅ 优化项目结构，使组件职责更清晰

**组件架构：**

#### 核心布局组件 (`/components/layout/`)
```
docs/.vitepress/theme/components/layout/
├── LayoutEnhancementIndicator.vue  # 布局增强指示器
├── DocBreadcrumb.vue              # 面包屑导航
├── ArticleHeader.vue              # 文章头部（元信息+操作栏）
├── QuickTOC.vue                   # 快速目录预览
├── DocFooter.vue                  # 文档底部增强内容
├── SidebarDocInfo.vue             # 侧边栏文档信息
└── styles/                        # Module CSS 样式文件
```

#### Composables (`/composables/`)
```
docs/.vitepress/theme/composables/
└── useDocumentStats.js            # 文档统计逻辑复用
```

**重构特性：**

1. **组件拆分**：
   - `DocBreadcrumb` - 面包屑导航，支持自动路径生成
   - `ArticleHeader` - 文章头部，包含元信息和操作按钮
   - `QuickTOC` - 快速目录预览，支持动画效果
   - `DocFooter` - 文档底部，包含统计信息和相关文章
   - `SidebarDocInfo` - 侧边栏文档信息展示

2. **Module CSS**：
   - 每个组件使用独立的 Module CSS
   - 避免样式冲突，提供更好的样式隔离
   - 支持动态类名绑定

3. **逻辑复用**：
   - `useDocumentStats` composable 提取文档统计逻辑
   - 支持阅读进度、字数统计、标题提取等功能
   - 可在多个组件间复用

4. **性能优化**：
   - 组件按需加载，减少初始包大小
   - 独立的样式文件，支持 CSS 代码分割
   - 响应式设计，适配各种设备

**使用示例：**

```vue
<template>
  <!-- 使用重构后的组件 -->
  <DocBreadcrumb />
  <ArticleHeader 
    :show-quick-toc="showQuickTOC"
    @toggle-quick-toc="toggleQuickTOC"
  />
  <QuickTOC 
    :is-visible="showQuickTOC"
    :headings="quickHeadings"
    @close="showQuickTOC = false"
  />
</template>

<script setup>
import { useDocumentStats } from '../composables/useDocumentStats.js'

// 使用 composable
const { quickHeadings, updateQuickHeadings } = useDocumentStats()
</script>

<style module>
/* Module CSS 样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
```

### 3. 新增功能

- **主题切换**：支持 8 种不同的代码主题
- **扩展语言支持**：新增 Swift、Kotlin、Dart、Ruby 等语言
- **键盘快捷键**：
  - `Ctrl/Cmd + C`：复制代码
  - `Ctrl/Cmd + L`：切换行号
  - `Ctrl/Cmd + F`：切换全屏
  - `Ctrl/Cmd + T`：切换主题
  - `Escape`：关闭模态框或退出全屏

### 4. 布局优化 - 隐藏右侧 Aside

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

### 5. 性能优化

- 异步加载 Shiki 高亮器
- 更好的错误处理和降级方案
- 优化了滚动同步逻辑
- 组件按需加载，减少初始包大小

## 项目结构

### 组件目录结构
```
docs/.vitepress/theme/components/
├── layout/                        # 布局相关组件
│   ├── LayoutEnhancementIndicator.vue
│   ├── DocBreadcrumb.vue
│   ├── ArticleHeader.vue
│   ├── QuickTOC.vue
│   ├── DocFooter.vue
│   ├── SidebarDocInfo.vue
│   └── styles/                    # Module CSS 样式
├── toc/                          # TOC 相关组件
│   ├── TOCNavigation.vue
│   ├── TOCPanel.vue
│   ├── TOCProgressRing.vue
│   ├── TOCSearch.vue
│   └── TOCToggleButton.vue
├── CodeBlockModal/               # 代码块模态框
├── ArticleMeta.vue              # 文章元信息
├── ReadingStats.vue             # 阅读统计
├── GitHistoryButton.vue         # Git 历史按钮
├── EnhancedTOC.vue             # 增强 TOC
└── NavbarEnhancer.vue          # 导航栏增强
```

### Composables 目录
```
docs/.vitepress/theme/composables/
├── useDocumentStats.js          # 文档统计逻辑
├── useTOC.js                    # TOC 功能逻辑
└── useDragAndDrop.js           # 拖拽功能逻辑
```

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

### 模块化组件架构
- 大型 Layout 组件已拆分为多个小组件
- 每个组件职责单一，易于维护和测试
- 使用 Vue 3 Module CSS 提供样式隔离
- 支持组件间的逻辑复用

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

## 开发指南

### 添加新的布局组件

1. 在 `docs/.vitepress/theme/components/layout/` 目录下创建新组件
2. 使用 Module CSS 管理样式：
   ```vue
   <style module>
   .container {
     /* 样式定义 */
   }
   </style>
   ```
3. 在主 Layout.vue 中导入并使用

### 创建 Composable

1. 在 `docs/.vitepress/theme/composables/` 目录下创建新文件
2. 导出可复用的逻辑函数：
   ```js
   export function useCustomLogic() {
     // 逻辑实现
     return { /* 返回值 */ }
   }
   ```

### 样式管理

- 使用 Vue 3 Module CSS 避免样式冲突
- 每个组件维护独立的样式文件
- 支持 CSS 变量和主题切换

## 注意事项

1. 首次使用时会异步加载 Shiki，可能有短暂的加载时间
2. 如果 Shiki 加载失败，会自动降级到基础的 HTML 转义显示
3. 建议在生产环境中预加载 Shiki 以获得更好的用户体验
4. 右侧 aside 已被完全隐藏，如需恢复可以移除 `hide-aside.css` 的导入
5. 重构后的组件使用 Module CSS，确保样式隔离和可维护性