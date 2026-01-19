# Callout 语法参考

本项目支持使用 `:::` 语法创建各种提示框（callout），采用 Apple/Linear 风格设计。

## 支持的类型

| 类型 | 用途 | 颜色 |
|------|------|------|
| `tip` | 提示、技巧 | 绿色 (Emerald) |
| `note` | 注意事项 | 蓝色 (Blue) |
| `info` | 一般信息 | 青色 (Cyan) |
| `important` | 重要信息 | 紫色 (Purple) |
| `success` | 成功状态 | 绿色 (Green) |
| `caution` | 轻度警告 | 橙色 (Orange) |
| `warning` | 警告信息 | 琥珀色 (Amber) |
| `danger` | 危险警告 | 红色 (Red) |
| `quote` | 引用内容 | 灰色 (Slate) |
| `details` | 可折叠详情 | 中性色 |

## 基本语法

```markdown
::: tip
这是一个提示。
:::

::: warning[自定义标题]
这是带自定义标题的警告。
:::
```

## 高级功能

### 1. 自定义标题

使用方括号指定标题：

```markdown
::: tip[性能优化建议]
使用合并内存访问可以显著提升 GPU 性能。
:::
```

### 2. 无标题模式

添加 `no-title` 属性隐藏标题，只显示图标：

```markdown
::: tip{no-title}
这是一个简洁的提示，只有图标没有标题。
:::
```

### 3. 可折叠模式

任何类型都可以添加 `collapsible` 属性变成可折叠：

```markdown
::: tip{collapsible}[点击展开提示]
这是可折叠的提示内容。
:::

::: warning{collapsible open}[默认展开的警告]
添加 `open` 属性默认展开。
:::
```

### 4. details 类型

`details` 类型默认就是可折叠的：

```markdown
::: details[查看完整代码]
```cpp
__global__ void kernel() {
    // code here
}
```
:::
```

## 完整示例

```markdown
::: tip[性能优化建议]
- 使用合并内存访问
- 减少分支分化
- 提高 SM 占用率
:::

::: warning[常见误区]
- **误区 1**: Warp 是程序员创建的 → 错误
- **误区 2**: Block 可以跨 SM 执行 → 错误
:::

::: danger[数据丢失风险]
执行此操作前请确保已备份数据！
:::

::: quote[Linus Torvalds]
Talk is cheap. Show me the code.
:::

::: success
操作已成功完成！
:::

::: info{no-title}
这是一条简洁的信息提示。
:::

::: important{collapsible}[重要说明]
点击展开查看重要说明内容...
:::
```

## 可访问性

- `warning` 和 `danger` 类型使用 `role="alert"` 确保屏幕阅读器能正确播报
- `success` 类型使用 `role="status"` 表示状态变化
- 其他类型使用 `role="note"` 作为补充信息
- 所有 callout 都有 `aria-label` 描述其类型

## 注意事项

1. 类型名称必须小写：`tip` ✓ `Tip` ✗ `tips` ✗
2. 自定义标题使用方括号：`[标题内容]`
3. 属性使用花括号：`{collapsible}` `{no-title}` `{open}`
4. 结束标记 `:::` 必须单独一行
5. 内容支持完整的 Markdown 语法
6. 用户输入的标题会自动转义，防止 XSS 攻击
