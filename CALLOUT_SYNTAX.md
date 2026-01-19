# Callout 语法参考

本项目支持两种 callout 语法：**Directive 语法** (`:::`) 和 **Obsidian 语法** (`> [!type]`)，采用 Apple/Linear 风格设计。

## 支持的类型

| 类型 | 用途 | 颜色 | Obsidian 别名 |
|------|------|------|---------------|
| `tip` | 提示、技巧 | 绿色 (Emerald) | `hint` |
| `note` | 注意事项 | 蓝色 (Blue) | `abstract`, `summary`, `tldr` |
| `info` | 一般信息 | 青色 (Cyan) | `example`, `question`, `help`, `faq` |
| `important` | 重要信息 | 紫色 (Purple) | - |
| `success` | 成功状态 | 绿色 (Green) | `check`, `done` |
| `caution` | 轻度警告 | 橙色 (Orange) | `attention` |
| `warning` | 警告信息 | 琥珀色 (Amber) | `warn` |
| `danger` | 危险警告 | 红色 (Red) | `error`, `bug`, `failure`, `fail`, `missing` |
| `quote` | 引用内容 | 灰色 (Slate) | `cite` |
| `details` | 可折叠详情 | 中性色 | - |

---

## 语法一：Directive 语法 (`:::`)

### 基本用法

```markdown
:::tip
这是一个提示。
:::

:::warning[自定义标题]
这是带自定义标题的警告。
:::
```

### 高级功能

#### 无标题模式

```markdown
:::tip{no-title}
只显示图标，没有标题。
:::
```

#### 可折叠模式

```markdown
:::tip{collapsible}[点击展开]
可折叠的内容。
:::

:::warning{collapsible open}[默认展开]
添加 `open` 属性默认展开。
:::
```

#### details 类型

```markdown
:::details[查看代码]
```python
print("Hello World")
```
:::
```

### 注意事项

1. **`:::` 和类型名之间不能有空格**：`:::tip` ✓ `::: tip` ✗
2. 类型名称必须小写
3. 自定义标题用方括号：`[标题]`
4. 属性用花括号：`{collapsible}` `{no-title}` `{open}`
5. 结束标记 `:::` 必须单独一行

---

## 语法二：Obsidian 语法 (`> [!type]`)

### 基本用法

```markdown
> [!note]
> 这是一个注意事项。

> [!warning] 自定义标题
> 这是带标题的警告。
```

### 可折叠语法

```markdown
> [!tip]- 点击展开
> 默认折叠的内容。

> [!info]+ 默认展开
> 使用 `+` 表示默认展开。
```

### 多行内容

```markdown
> [!note] 标题
> 第一行内容
> 
> 第二段内容
> - 列表项 1
> - 列表项 2
```

### 注意事项

1. 必须以 `> [!type]` 开头
2. `-` 表示折叠，`+` 表示默认展开
3. 标题直接写在 `]` 后面
4. 后续内容每行都要以 `>` 开头

---

## 完整示例

### Directive 语法示例

```markdown
:::tip[性能优化]
- 使用合并内存访问
- 减少分支分化
:::

:::danger
执行此操作前请备份数据！
:::

:::details[查看完整代码]
```cpp
__global__ void kernel() {
    // code
}
```
:::
```

### Obsidian 语法示例

```markdown
> [!tip] 性能优化
> - 使用合并内存访问
> - 减少分支分化

> [!danger]
> 执行此操作前请备份数据！

> [!note]- 点击查看详情
> 这是折叠的内容...
```

---

## 两种语法对比

| 特性 | Directive (`:::`) | Obsidian (`> [!]`) |
|------|-------------------|---------------------|
| 可读性 | 更清晰 | 更紧凑 |
| 兼容性 | VitePress/Docusaurus | Obsidian/GitHub |
| 无标题模式 | ✓ `{no-title}` | ✗ |
| 属性支持 | ✓ `{collapsible open}` | 仅 `-`/`+` |
| 嵌套内容 | 更灵活 | 需要每行 `>` |

**建议**：新内容使用 Directive 语法，从 Obsidian 迁移的内容可保持原语法。

---

## 可访问性

- `warning` 和 `danger` 使用 `role="alert"`
- `success` 使用 `role="status"`
- 其他类型使用 `role="note"`
- 所有 callout 都有 `aria-label` 描述

---

## 原生 HTML

也支持原生 `<details>` 标签：

```html
<details>
<summary>点击展开</summary>

这里是内容...

</details>
```
