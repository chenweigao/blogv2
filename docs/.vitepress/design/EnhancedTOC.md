## EnhancedTOC 设计文档

本文档描述 `EnhancedTOC` 组件的设计、交互、状态管理、可访问性与性能优化策略，以及可扩展的改进方向与测试建议。后续相关的改进优化工作均以此文档为参考。

### 概述

**EnhancedTOC** 提供文档页的增强型目录（Table of Contents）体验：
- 浮动按钮显示阅读进度环和标题数量
- 面板支持搜索、导航、阅读进度与剩余时间
- 支持拖拽按钮位置、固定面板、紧凑模式与移动端遮罩
- 具备可访问性（键盘、焦点陷阱、ARIA）与性能优化

### 架构与组成

- `docs/.vitepress/theme/components/EnhancedTOC.vue`
  - 页面级容器与协调者：管理可见性、定位、持久化、键盘交互、焦点与无障碍
  - 调用组合式逻辑：`useTOC.js` 提供 headings、搜索与滚动；`useDragAndDrop.js` 提供拖拽与位置持久化
  - 渲染与驱动子组件：`TOCToggleButton.vue` 与 `TOCPanel.vue`

- `docs/.vitepress/theme/components/toc/TOCToggleButton.vue`
  - 浮动按钮：显示阅读进度环、标题计数；可拖拽；点击切换 TOC
  - 事件：`click`、`drag-start`、`drag-move`、`drag-end`

- `docs/.vitepress/theme/components/toc/TOCPanel.vue`
  - 目录面板：标题导航、搜索框、阅读统计、顶部/底部跳转与复制 TOC 文本
  - 暴露 API：`focusSearch()`、`scrollToActiveItem()`
  - 事件：`close`、`toggle-pin`、`toggle-compact`、`search`、`clear-search`、`heading-click`、`scroll-to-top`、`scroll-to-bottom`、`copy-toc`

- 组合式模块
  - `useTOC.js`: 聚合并过滤 `headings`，跟踪 `activeHeading`，提供搜索、复制、滚动等方法；计算 `readingProgress`、`estimatedReadingTime`、`timeRemaining`
  - `useDragAndDrop.js`: 提供 `createDragHandlers`、`position`、`setPosition`，支持位置持久化与约束

### 交互流程

- 浮动按钮
  - 显示阅读进度环（圆环 svg）与百分比，展示标题数量徽章
  - 支持鼠标与触屏拖拽，持久化位置（`localStorage.enhanced-toc-position`）
  - 点击切换面板显隐

- 目录面板
  - 包含标题导航与搜索（超过 5 个标题时显示）
  - 支持紧凑模式（隐藏额外统计）、固定模式（无过渡、固定定位）
  - 提供“Top / Bottom / Copy TOC”操作

- 键盘快捷键（在 `EnhancedTOC.vue`）
  - `Ctrl/⌘ + K`：显隐 TOC
  - `Esc`：关闭 TOC（未固定时）
  - `/`：聚焦搜索框（面板可见时）
  - `Ctrl/⌘ + ?`：显示快捷键提示 3 秒

- 移动端遮罩
  - 面板可见且移动端时显示半透明遮罩，点击遮罩关闭 TOC

### 状态、属性与持久化

- `EnhancedTOC.vue` 局部状态
  - `isVisible`：TOC 面板显隐
  - `isPinned`：是否固定面板（`localStorage.toc-pinned`）
  - `isCompactMode`：紧凑模式（`localStorage.toc-compact`）
  - `isMobile`：是否移动端（基于 `window.innerWidth < 768`）
  - `showShortcuts`、`showProgressRing`
  - 拖拽位置：`dragPosition` 来自 `useDragAndDrop`
  - 面板动态定位：`panelPosition`（随按钮位置与视窗空间计算）

- `TOCToggleButton.vue` 属性
  - `isActive`、`headingCount`、`isDraggable`、`position`
  - `readingProgress`、`showProgress`

- `TOCPanel.vue` 属性
  - `isVisible`、`isPinned`、`isCompactMode`、`isMobile`
  - `title`、`headings`、`filteredHeadings`、`activeHeading`、`searchQuery`
  - `readingProgress`、`estimatedReadingTime`、`timeRemaining`
  - `panelPosition`（用于桌面端固定定位）

- 持久化键
  - `enhanced-toc-position`：按钮坐标
  - `toc-pinned`：固定面板开关
  - `toc-compact`：紧凑模式开关

### 定位与布局

- 按钮默认位置（桌面端）：`x = window.innerWidth - 76`，`y = window.innerHeight / 2 - 28`
- 面板位置（桌面端）基于按钮坐标计算：
  - 默认在按钮右侧，若右侧空间不足则左侧，否则居中
  - 垂直方向根据视窗边界在 `margin` 内调整
- 移动端面板固定：全屏覆盖（遮罩 + 固定样式）
- 层级：按钮 `z-index` 随拖拽变化；面板 `z-index: 200`；遮罩 `z-index: 90`

### 拖拽

- 通过 `useDragAndDrop.createDragHandlers(buttonElement)` 绑定
- 事件：`mousedown`/`touchstart` 启动拖拽；移动与结束更新 `position` 与持久化
- 约束：`constrainToViewport: true`，`snapToEdges: false`，`snapThreshold: 30`

### 可访问性（a11y）

- 面板 `role="dialog"`，`aria-modal` 在未固定且可见时为 `true`
- `aria-labelledby="enhanced-toc-title"` 指向隐藏标题元素
- 焦点陷阱：面板可见时拦截 `Tab` 循环在面板内
- 打开面板时：
  - 先聚焦面板容器，再聚焦面板内第一个可聚焦元素
- 键盘支持：`Esc` 关闭、`Ctrl/⌘ + K` 显隐、`/` 聚焦搜索

### 性能优化

- 减少动画：`prefers-reduced-motion` 下禁用过渡与动画
- 使用 `will-change`、`backface-visibility`、`translate3d` 优化按钮拖拽与过渡
- 容器 `pointer-events: none`，仅子元素接收事件，降低事件命中负担
- 通过 `Transition` 简化视觉过渡；固定模式禁用过渡避免布局抖动

### 已知问题与修复记录

- 修复：点击浮动按钮导致页面跳到顶部
  - 原因：打开面板时焦点查找回退到整个 `document`，浏览器将页面滚动到顶部的可聚焦元素
  - 修复：
    - 将 `getFocusable()` 查找范围限定为 TOC 面板容器内
    - 打开面板时先聚焦面板容器，再聚焦内部首个可聚焦元素
    - 将按钮显式设置为 `type="button"`，在点击处理里 `event.preventDefault()` + `event.stopPropagation()`

### 事件与方法清单

- `EnhancedTOC.vue` 内部方法
  - `toggleTOC()`：显隐面板与焦点管理
  - `hideTOC()`：关闭面板、清理搜索、恢复焦点到按钮
  - `togglePin()`、`toggleCompactMode()`：持久化状态切换
  - `handleSearch(query)` / `handleClearSearch()`
  - `handleHeadingClick(anchor, event)`：滚动到标题（移动端未固定自动关闭面板）
  - `handleCopyTOC()`：复制文本（来自 `useTOC.copyTOC()`）
  - `scrollToTop()` / `scrollToBottom()`：页面滚动
  - `handleResize()`：移动端检测与默认位置重算
  - `handleKeydown(event)`：快捷键与关闭逻辑
  - 拖拽相关：`createDragHandlers()`、`setPosition()`

- `TOCToggleButton.vue` 暴露方法
  - `handleDragStart(event)`、`handleDragMove(position)`、`handleDragEnd(position)`
  - `updatePosition(newPosition)`、`resetPosition()`

- `TOCPanel.vue` 暴露方法
  - `focusSearch()`：将光标移动到搜索框
  - `scrollToActiveItem()`：滚动面板列表到当前活动标题

### 配置与适配

- 页面筛选：`isDocPage` 排除首页与特定路径；尊重 frontmatter 布局（home/page）
- 浏览器环境保护：`isBrowser` 判断，避免 SSR 阶段访问 `window/document`
- 移动端适配：视窗宽度驱动 `isMobile` 与遮罩行为

### 改进与扩展建议

- 动态面板尺寸测量
  - 使用 `getBoundingClientRect()` 计算面板实际宽高，替代固定估算值，以提高定位准确性
- 边缘吸附与碰撞优化
  - 支持吸附边缘与碰撞回弹，提升拖拽体验
- 无障碍提升
  - 打开/关闭面板时发出 `aria-live` 提示
  - 为按钮与控件补充更细致的 `aria-label` 与状态描述
- 可定制配置
  - 暴露主题变量控制进度环尺寸、面板宽度、动画曲线与遮罩样式
- 观测与埋点
  - 记录用户打开/搜索/导航行为，支持优化交互与信息架构
- 异步数据与大型文档优化
  - 对超大文档的标题树进行虚拟化渲染
  - 延迟计算阅读时间与剩余时间，避免主线程阻塞

### 测试建议

- 单元测试
  - 焦点管理：`getFocusable()` 仅在面板容器内查找；打开时焦点顺序正确
  - 快捷键：`Ctrl/⌘ + K`、`Esc`、`/`、`Ctrl/⌘ + ?`
  - 拖拽：事件绑定、位置约束与持久化
  - 状态持久化：`toc-pinned`、`toc-compact`、`enhanced-toc-position`

- 端到端测试（E2E）
  - 桌面与移动端显隐/遮罩行为
  - 面板定位在不同视窗尺寸与按钮位置下正确
  - 点击标题在移动端未固定时自动关闭面板
  - 复制 TOC 文本成功提示与内容正确

### 使用说明（站点集成）

- 组件由主题自动注入（如已在主题布局中引入）
- 在文档页：
  - 确保 frontmatter 未将布局设为 `home` 或 `page`
  - 页面渲染后，`EnhancedTOC` 自动根据 `headings` 生成目录并加载按钮与面板
- 覆盖样式与配置：
  - 通过主题变量与 CSS 覆盖 `toc-progress-button`、`toc-panel` 等类的样式
  - 若需关闭进度环，设置 `showProgressRing = false`

### 术语与约定

- “面板”：指 TOC 目录面板
- “按钮”：指 TOC 浮动按钮
- “紧凑模式”：隐藏辅助统计信息，仅保留导航核心要素
- “固定模式”：面板固定定位，禁用动画过渡

以上为 EnhancedTOC 的完整设计说明。后续优化工作（动态面板尺寸、无障碍提升、拖拽吸附、虚拟化渲染等）请以此文档为准执行与评审。