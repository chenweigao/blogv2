# CodeBlockModal 组件优化说明

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

### 3. 性能优化

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

## 注意事项

1. 首次使用时会异步加载 Shiki，可能有短暂的加载时间
2. 如果 Shiki 加载失败，会自动降级到基础的 HTML 转义显示
3. 建议在生产环境中预加载 Shiki 以获得更好的用户体验