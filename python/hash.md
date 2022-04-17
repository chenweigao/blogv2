---
title: Hash Map
Date: 2020-07-12
---

以前很擅长写这个，现在记性不太好了，今天练习了一下，写在这里备忘一下。

## 1. Hash Map in Python


### 1.1 Implement

Python 中的 Hash Map 使用方法很多，以后会慢慢复习到，现在先写上基本的实现。

LeetCode 的一个题目涉及到了这个问题：[1512. Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs/)

对于这个题目的实现如下：


  <<< @/docs/.vuepress/code/algorithm/hash_map_1.py

具体的[完整示例](https://github.com/chenweigao/_code/blob/master/LeetCode/LC1512_Number_of_good_pairs.py)可以参考 GitHub。

## 2. collections.Counter()

#### 2.1 .values()

这是 python 官方库的实现方式，使用前需要先导入 `collections` 依赖。

以 leetcode 的 [1207](https://leetcode-cn.com/problems/unique-number-of-occurrences/) 题目举例来说明用法：

  <<< @/docs/.vuepress/code/algorithm/hash_map_2.py

该题目中使用了 `collections.Counter()` 获得字典，而后通过 `.values()` 拿到字典中的 value 集合，最后通过将其转化为 set 来判断是否与原有字典长度相等达到解决问题的目的。

## 3. OrderedDict

### 3.1 Abstract

#### init

`OrderedDict` 是 python3 内置的数据结构，其主要存在两个函数可以供我们使用：

1. `move_to_end`
2. `popitem`

初始化 `OrderedDict`:

```python
import collections

d = collections.OrderedDict.fromkeys('abcde')

# 'abcde'
d_str = ''.join(d.keys())
```

#### move_to_end()

使用 `move_to_end`, 参数 `last` 指定为 True（默认值），则将特定的元素移动到 dict 的最后面，指定为 False 移动到 dict 的最前面。

```python
# 将 b 移动到最前面
d.move_to_end('b', last=False)
# 将 b 移动到最后面, 默认是 true
d.move_to_end('b', last=True)
```

#### popitem()

使用 `popitem`，参数 `last` 指定为 True（默认值），则移除 dict 中最后的元素，指定为 False 则移除 dict 中最左的元素。

1. `popitem()` 默认参数。删除最后的元素！`('b', None)` 没有了~

   之前的 dict 为：`OrderedDict([('a', None), ('c', None), ('d', None), ('e', None), ('b', None)])`

   使用 `popitem()`：

   ```python
   item_of_b = d.popitem()
   ```

   将 dict 中的最后一个元素 **b** 进行了删除，成了 `OrderedDict([('a', None), ('c', None), ('d', None), ('e', None)])`

2. `popitem(last=False)` 。删除最左边的元素！

   ```python
   item_of_a = d.popitem(last=False)
   ```

   `OrderedDict([('a', None), ('c', None), ('d', None), ('e', None), ('b', None)])` --> `OrderedDict([('c', None), ('d', None), ('e', None), ('b', None)])`

