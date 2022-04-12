---
title: Binary Search
date: 2019-9-12
tag:
 - algorithm
 - binary_search
category:
 - Algorithm
---

## Summary

### 1. 二分搜索模板

### 1.1 基本的二分搜索算法

1. 手工实现

   ```python
   class Solution:
       def search(self, nums: List[int], target: int) -> int:
           if not nums:
               return -1
           l, r = 0, len(nums) - 1
           while l <= r:
               mid = l + (r - l) // 2
               if nums[mid] < target:
                   l = mid + 1
               elif nums[mid] > target:
                   r = mid - 1
               else:
                   return mid
   
           return -1
   ```

2. 使用 Python `bisect` 库

   ```python
       def search_2(self, nums: List[int], target: int) -> int:
           res = bisect.bisect_left(nums, target)
           if res != len(nums) and nums[res] == target:
               return res
           return -1
   ```

### 1.2 寻找左侧边界的二分搜索

1. 手工实现

   ```python
       def search(self, nums: List[int], target: int) -> int:
           l, r = 0, len(nums) - 1
           while l <= r:
               mid = l + (r - l) // 2
               if nums[mid] < target:
                   l = mid + 1
               elif nums[mid] > target:
                   r = mid - 1
               elif nums[mid] == target:
                   # 暂时不能返回，需要收缩右边界，锁定左侧边界
                   r = mid - 1
           # 检查越界情况。注意这边下面两个条件是二选一的
           if l >= len(nums) or nums[l] != target:
               return -1
           return l
   ```

2. 使用 `bisect`

   手工实现在很多情况下都需要调试，比较慢，因此使用 `bisect` 比较方便，其使用方式如下：

   - 找到 *Find rightmost value less than target*：找到小于目标元素，离目标元素最近的元素（肯定在左边）。如 `[-1, 1, 3, 5, 9, 12]` 目标元素 2, 则返回了 1，表示 2 可以插入到 1 和 3 之间。对应的下标 `res - 1` 就是 1 的下标。

     ```python
     def search2(self, nums: List[int], target: int) -> int:
             res = bisect.bisect_left(nums, target)
             if res:
                 return nums[res - 1]
             return -1
     ```

   - 找到 *Find rightmost value less than or equal to target*

     ```python
         def search3(self, nums: List[int], target: int) -> int:
             res = bisect.bisect_right(nums, target)
             if res:
                 return nums[res - 1]
             return -1
     ```

### 1.3 寻找右侧边界的二分搜索

   1. 手工实现

      ```python
          def search(self, nums: List[int], target: int) -> int:
              l, r = 0, len(nums) - 1
              while l <= r:
                  mid = l + (r - l) // 2
                  if nums[mid] < target:
                      l = mid + 1
                  elif nums[mid] > target:
                      r = mid - 1
                  elif nums[mid] == target:
                      # 暂时不能返回，需要收缩左边界，锁定右侧边界
                      l = mid + 1
              # 检查越界情况。注意这边下面两个条件是二选一的
              if r < 0 or nums[l] != target:
                  return -1
              return r
      ```

   2. 使用库

      ```python
      def find_gt(a, x):
          'Find leftmost value greater than x'
          i = bisect_right(a, x)
          if i != len(a):
              return a[i]
          raise ValueError
      
      def find_ge(a, x):
          'Find leftmost item greater than or equal to x'
          i = bisect_left(a, x)
          if i != len(a):
              return a[i]
          raise ValueError
      ```

### 1.3 参考

在二分查找中，要特别注意边界的问题，二分查找的边界，分为 `[left, right)` 和 `[left, right]`.

- 初始化时，形式为 `left = 0, right = n`, 其中 `n` 表示数组的长度，由于数组取不到下标 `n`, 故为左闭右开区间；
- 初始化时，形式为 `left = 0, right = n - 1`, 故为左闭右闭区间。

:::danger bug!!!
对于左闭右开区间(`[left, right)` )而言，应注意：

在写代码时，应当注意边界条件：

如果初始化为左闭右开区间，则当 `mid` 的值小于要查找的值的时候，`left = mid  + 1` 是正确的

而当 `mid` 的值大于要查找的值的时候（这时候需要向左查找），此时如果让 `right` 赋值为 `mid - 1`, 则有可能存在 `mid - 1` 正好是要查找的值的情况，要十分慎重。
:::

基于此，在写二分查找时，可以基于以下原则：[标准程序参考链接](https://github.com/chenweigao/_code/blob/master/cpp/binary_search.cpp)

1. 使用左右闭区间初始化，查找后条件应当变成：`left = mid + 1` and `right = mid -1`, 否则会出现死循环；
2. 使用左闭右开区间初始化，查找后条件应当是：`left = mid + 1` and `right = mid`;
3. `left` 初值为 `-1`, 循环条件使用 `while(left + 1 != right)`;
4. 对边界条件专门进行判断。

## 二分查找思路整理

有下面的例子，可以分为四种问题，提出二分查找：

![binary_search_1](/binary_search/binary_search_1.png)

从一个新的角度区理解这个问题，该问题可以变为：**找出图中的蓝红边界，即求出未知数K**。

![binary_search_2](/binary_search/binary_search_2.png)

针对此问题，可以写出伪代码如下所示：

```python
l = -1, r = N
while l + 1 != r
  m = (l + r) / 2 取下界
  if isBlue(m)
    l = m
  else
    r = m
return l or r
```

有了以上的伪代码，图1 中的问题答案分别为：

![binary_search_3](/binary_search/binary_search_3.png)

参考视频：<https://www.bilibili.com/video/BV1d54y1q7k7>

## Code

### wiki 伪代码

:::tip 记住口诀
**mid 在前，先小后大，先左后右**

解析：mid 总是在比较的左边：mid < target; 先写 mid 小于，对应左边 l = mid + 1; 再写 mid 大于，对应右边。
:::

```c
function binary_search(A, n, T):
    L := 0
    R := n − 1
    while L <= R:
        m := floor((L + R) / 2)
        if A[m] < T:
            L := m + 1
        else if A[m] > T:
            R := m - 1
        else:
            return m
    return unsuccessful
```

### 查找插入位置

二分查找有序序列中某个元素的位置，如果没找到，则返回其需要插入的位置(LC 035):

@[code](../code/binarySearch.py)

### bisect

或者使用 Python 自带的 **bisect**:

```py
import bisect
nums = [1, 3, 4, 4, 6, 7]
print(bisect.bisect(nums, 4))
print(bisect.bisect_left(nums, 4))
```

注意到，`bisect()` 默认会查找元素需要插入的位置，如果是重复的元素，则会返回其最右侧可以插入的位置，使用 `bisect_left()` 可以返回其左侧位置。

### 向上、下取整

1. 使用 $\frac {(A+B-1)} {B}$ 计算

2. 使用 `math.ceil()` 和 `math.floor()`:

```py
imprt math
math.ceil(7/4) # 2
math.floor(7/4) # 1 or 7//4
round(2.6) # 3 四舍五入
```

一般而言，我们在快速排序或者二分查找中如果要计算 mid, 则可以使用 $mid = left + \frac{right - left}{2}$ 来计算[^1]。

## Problems

### 查找二维数组中是否存在某个元素

在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。
请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

@[code](../code/find_in_array.py)

:::tip
注意到这里用到了 **先小(<)后大(>), 先左(l)后右** 的口诀。
:::

### 完全平方数

使用二分查找判断某个数是否完全平方数：

@[code](../code/isPerfectSquare.py)

### 数字在排序数组中出现的次数

> 统计一个数字在排序数组中出现的次数。

使用二分查找，首先查找在前面出现的位置 start, 再查找在后面出现的位置 end, 然后相减得到答案。

这个题目对查找插入位置的概念进行了强化：

@[code](../code/get_number_of_k.py)

### Find Peak Element - 寻找峰值

> 找寻一个数组的峰值
>
> 输入: nums = [1,2,1,3,5,6,4]
>
> 输出: 1 或 5
>
> 解释: 你的函数可以返回索引 1，其峰值元素为 2；或者返回索引 5， 其峰值元素为 6。

这道题目只要求返回一个峰值，所以可以从前往后遍历，遇到符合条件的返回即可，暴力解法和二分法的代码如下：

@[code](../code/findPeakElement.py)

### 875. 爱吃香蕉的珂珂

> 珂珂喜欢吃香蕉。这里有 N 堆香蕉，第 i 堆中有 piles[i] 根香蕉。警卫已经离开了，将在 H 小时后回来。
>
> 珂珂可以决定她吃香蕉的速度 K （单位：根/小时）。每个小时，她将会选择一堆香蕉，从中吃掉 K 根。如果这堆香蕉少于 K 根，她将吃掉这堆的所有香蕉，然后这一小时内不会再吃更多的香蕉。  
>
> 珂珂喜欢慢慢吃，但仍然想在警卫回来前吃掉所有的香蕉。
>
> 返回她可以在 H 小时内吃掉所有香蕉的最小速度 K（K 为整数）。
>
> 来源：力扣（LeetCode）
> 链接：<https://leetcode-cn.com/problems/koko-eating-bananas>
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

下面两种解法展示了不同边界条件下该如何处理：

@[code](../code/binary_search_koko_1.py)

@[code](../code/binary_search_koko_2.py)

### 求根号 x 的值

可以使用二分法，解法一如下：

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        # 二分法
        delta = 1e-5
        l, r = 1, x
        while l < r:
            mid = (l + r) * 0.5
            if abs(mid ** 2 - x) < delta:
                return mid
            elif mid ** 2 > x:
                r = mid
            else:
                l = mid
        return l
```

解法二如下：

```python
    mid = (l + r) * 0.5
    while True:
        if mid ** 2 > x:
            r = mid
        else:
            l = mid
        last = mid
        mid = (l + r) * 0.5
        if abs(mid - last) < delta:
            break
    return mid
```

解法一比解法二好很多，可以掌握一下！

如果是要求结果是整数，则使用以下解法：

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        # 二分法, 要求结果是取整的
        l, r = 0, x
        res = -1
        while l <= r:
            mid = (l + r) // 2
            if mid ** 2 <= x:
                res = mid
                l = mid + 1
            else:
                r = mid - 1
        return res
```

## 参考文献

[^1]: 参考[二分查找 python 代码](https://github.com/chenweigao/_code/blob/master/data_struct/binary_search.py)
