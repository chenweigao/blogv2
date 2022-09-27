---
title: Hash Map & Dict
icon: creative
date: 2020-07-12
category:
  - Python
---



本文主要是总结 Python 中字典和 hash map 的用法。

<!--more-->



## Hash Map

背景：以前很擅长写这个，现在记性不太好了，今天练习了一下，写在这里备忘一下。

### Implement

Python 中的 Hash Map 使用方法很多，以后会慢慢复习到，现在先写上基本的实现。

LeetCode 的一个题目涉及到了这个问题：[1512. Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs/)

对于这个题目的实现如下：

```python
class Solution:
    def numIdenticalPairs(self, nums: 'List[int]') -> int:
        # 先构建 hash map
        res = 0
        hash_map = dict()
        for num in nums:
            res += hash_map.get(num, 0)
            hash_map[num] = hash_map.get(num, 0) + 1
        # hash_map = {1: 3, 2: 1, 3: 2}
        # 这是构造了一个hash_map
        return res
```

具体的[完整示例](https://github.com/chenweigao/_code/blob/master/LeetCode/LC1512_Number_of_good_pairs.py)可以参考 GitHub。

## collections.Counter()

这是 python 官方库的实现方式，使用前需要先导入 `collections` 依赖。

以 leetcode 的 [1207](https://leetcode-cn.com/problems/unique-number-of-occurrences/) 题目举例来说明用法：

 ```python
# LC 1207
# algorithm/hash_map_2.py
class Solution:
    def uniqueOccurrences(self, arr: 'List[int]') -> bool:
        arr_dict = {}
        for n in arr:
            arr_dict[n] = arr_dict.get(n, 0) + 1
        values = list(arr_dict.values())
        return len(values) == len(set(values))

import collections
class Solution2:
    def uniqueOccurrences(self, arr: 'List[int]') -> bool:
        arr_dict = collections.Counter(arr)
        print(arr_dict.values()) # dict_values([3, 2, 1])
        return len(set(arr_dict.values())) == len(arr_dict)

arr = [1,2,2,1,1,3]
print(Solution().uniqueOccurrences(arr))
print(Solution2().uniqueOccurrences(arr))
 ```

该题目中使用了 `collections.Counter()` 获得字典，而后通过 `.values()` 拿到字典中的 value 集合，最后通过将其转化为 set 来判断是否与原有字典长度相等达到解决问题的目的。

## OrderedDict

### init

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

### move_to_end()

使用 `move_to_end`, 参数 `last` 指定为 True（默认值），则将特定的元素移动到 dict 的最后面，指定为 False 移动到 dict 的最前面。

```python
# 将 b 移动到最前面
d.move_to_end('b', last=False)
# 将 b 移动到最后面, 默认是 true
d.move_to_end('b', last=True)
```

### popitem()

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

### 按照 dict value 排序后返回字典

使用如下的方式按照 value 排序：

```python
res_sorted = sorted(res.items(), key=lambda x: -x[1])
return collections.OrderedDict(res_sorted)
```

其中 `res` 是未排序的字典，使用 sorted 以后再将其转化为 `OrderedDict` 就可以实现按照字典的顺序排序了。
