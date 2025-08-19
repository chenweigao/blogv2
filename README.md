# Knowledge Wiki

> Personal Knowledge Base - A comprehensive documentation site for work and study notes

## 📖 项目简介

这是一个基于 **VitePress** 构建的个人知识库项目，专注于计算机科学、编程技术、人工智能等领域的知识整理与分享。项目采用现代化的文档站点架构，支持响应式设计、全文搜索、时间线展示等功能。

## 🏗️ 技术架构

### 核心技术栈
- **框架**: VitePress 1.6.4
- **前端**: Vue 3.5.18
- **构建工具**: Vite
- **包管理器**: pnpm 8.10.0
- **Node.js**: >=18.0.0

### 项目结构
```
blogv2/
├── docs/                           # VitePress 文档目录
│   ├── .vitepress/                # VitePress 配置
│   │   ├── config.js              # 主配置文件
│   │   ├── utils/                 # 工具脚本
│   │   │   ├── generateTimeline.js    # 时间线生成器
│   │   │   ├── watchTimeline.js       # 时间线监听器
│   │   │   └── generateGitHistoryData.js  # Git历史数据生成
│   │   └── config/                # 配置模块
│   ├── algorithms/                # 算法与数据结构
│   ├── artificial-intelligence/   # 人工智能
│   ├── computer-systems/         # 计算机系统
│   ├── development-tools/        # 开发工具
│   ├── programming-languages/    # 编程语言
│   ├── research-projects/        # 研究项目
│   └── index.md                  # 首页
├── .obsidian/                    # Obsidian 笔记配置
├── .vuepress/                    # 历史 VuePress 配置（遗留）
├── src/                          # 源码目录
├── scripts/                      # 脚本目录
└── package.json                  # 项目配置
```

## 🚀 核心功能

### 1. 智能时间线系统
- **自动生成**: 扫描所有 Markdown 文件，自动提取元数据生成时间线
- **实时更新**: 文件变化时自动重新生成时间线数据
- **多维度展示**: 支持按时间、分类、标签等维度展示内容

### 2. Git 历史集成
- **版本追踪**: 集成 Git 历史记录，追踪文档变更历史
- **实时 API**: 提供实时 Git 历史记录查询接口
- **变更可视化**: 在文档中展示文件的修改历史

### 3. 高级搜索功能
- **全文搜索**: 基于 VitePress 本地搜索，支持中英文内容检索
- **分类筛选**: 支持按知识领域分类搜索
- **标签系统**: 通过标签快速定位相关内容

### 4. 响应式设计
- **多设备适配**: 完美支持桌面、平板、移动设备
- **主题切换**: 支持明暗主题自动切换
- **优化体验**: 图片懒加载、数学公式渲染等性能优化

## 📚 知识体系

### 🔢 算法与数据结构 (`/algorithms/`)
- **核心算法**: 排序、搜索、图遍历（DFS/BFS）
- **高级技巧**: 动态规划、回溯算法、滑动窗口
- **数据结构**: 树、图、哈希表、栈、链表
- **复杂度分析**: 时间/空间复杂度分析与优化策略

### 🖥️ 计算机系统 (`/computer-systems/`)
- **CPU & GPU**: 架构设计、指令集、流水线、缓存系统
- **操作系统**: Linux 内核、内存管理、进程调度
- **性能优化**: NUMA、内存优化、系统级性能调优
- **硬件架构**: ARM 架构、x86 指令集、硬件软件交互

### 💻 编程语言 (`/programming-languages/`)
- **Java**: 核心概念、JVM 内部机制、垃圾回收、并发编程
- **Python**: 语言特性、高级技巧、最佳实践
- **语言设计**: 内存模型、类型系统、运行时优化

### 🤖 人工智能 (`/artificial-intelligence/`)
- **机器学习**: 算法原理、模型训练、优化技术
- **深度学习**: 神经网络、框架使用、实际应用
- **AI 工具**: 性能分析、优化部署、开发工具链

### 🔧 开发工具 (`/development-tools/`)
- **云服务与服务器**: Docker、Kubernetes、云平台、服务器管理
- **数据库**: SQL/NoSQL 数据库、优化策略、数据建模
- **前端技术**: React、现代 Web 开发、UI/UX 最佳实践
- **框架工具**: Spring、Web 框架、开发模式
- **DevOps**: CI/CD、监控部署、自动化运维

### 📚 研究项目 (`/research-projects/`)
- **学术论文**: 计算机架构、系统、AI 领域研究论文
- **项目实践**: 实际项目实现与案例研究
- **技术研究**: 实验发现与技术调研

## 🛠️ 开发指南

### 环境要求
```bash
Node.js >= 18.0.0
pnpm >= 8.0.0
```

### 安装依赖
```bash
pnpm install
```

### 开发命令

#### 基础开发
```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

#### 时间线功能
```bash
# 生成时间线数据
pnpm timeline:generate

# 监听文件变化，自动更新时间线
pnpm timeline:watch

# 增量更新时间线
pnpm timeline:incremental

# 完整重新生成时间线
pnpm timeline:full

# 同时启动开发服务器和时间线监听
pnpm dev:watch
```

#### Git 钩子
```bash
# 设置 Git 钩子
pnpm setup:hooks
```

### 添加新内容

1. **创建文档**: 在对应的知识领域目录下创建 `.md` 文件
2. **添加 Frontmatter**: 在文档顶部添加元数据
   ```yaml
   ---
   title: 文档标题
   description: 文档描述
   date: 2025-01-XX
   category: 分类名称
   tags: 标签1,标签2
   ---
   ```
3. **自动更新**: 时间线和搜索索引会自动更新

### 配置说明

#### VitePress 配置 (`docs/.vitepress/config.js`)
- 站点基础信息配置
- 导航栏和侧边栏配置
- 插件和主题配置
- 构建钩子配置

#### 时间线配置
- 自动扫描 `docs/` 目录下的所有 `.md` 文件
- 提取 frontmatter 和内容元数据
- 生成 JSON 格式的时间线数据

## 🎯 特色亮点

### 1. 双重笔记系统
- **VitePress**: 用于知识分享和在线展示
- **Obsidian**: 用于本地笔记编辑和知识图谱构建

### 2. 自动化工作流
- **构建时生成**: 自动生成时间线和 Git 历史数据
- **实时监听**: 文件变化时自动更新相关数据
- **Git 集成**: 自动追踪文档版本历史

### 3. 现代化体验
- **快速搜索**: 毫秒级全文搜索响应
- **响应式设计**: 完美适配各种设备
- **性能优化**: 图片懒加载、代码分割等优化

### 4. 扩展性强
- **模块化配置**: 易于添加新的知识领域
- **插件系统**: 支持各种 VitePress 插件
- **自定义组件**: 可扩展自定义 Vue 组件

## 📈 使用统计

- **文档数量**: 100+ 篇技术文档
- **知识领域**: 6 大核心领域
- **更新频率**: 持续更新中
- **访问性能**: 静态站点，毫秒级加载

## 🤝 贡献指南

1. **内容贡献**: 欢迎添加新的技术文档和知识总结
2. **功能改进**: 欢迎提交功能改进和 Bug 修复
3. **文档完善**: 帮助完善现有文档的内容和格式

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- **在线访问**: [Knowledge Wiki](https://your-domain.com)
- **GitHub**: [项目仓库](https://github.com/chenweigao)
- **VitePress**: [官方文档](https://vitepress.dev/)

---

**Knowledge Wiki** - 让知识更有序，让学习更高效 🚀