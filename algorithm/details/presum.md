---
title:  "Prefix, Presum"
Date: 2021-06-01
---

## 例题索引

| 问题                                                         | 类型               | 解法                  | 备注 |
| ------------------------------------------------------------ | ------------------ | --------------------- | ---- |
| LC560 和为 k 的子数组                                        | 前缀和 + dict      | 最经典的前缀和用法！  |      |
| LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？            | 前缀和综合应用问题 | 使用到了 `accumulate` |      |
| LC724 寻找数组的中心索引（下标）                             |                    |                       |      |
| LC930 和相同的二元子数组                                     | 前缀和 + dict      | 同解法 LC560          |      |
| LC525 [连续数组](https://leetcode-cn.com/problems/contiguous-array/) |                    |                       |      |
| LC209 长度最小的子数组                                       | 前缀和 + 二分      |                       |      |

[[toc]]

## 概述

### 前缀和快速求解

前缀和是一种非常有用的算法思路，应当加以总结。

在 Python 中，可以很方便的求解一个数组的前缀和，如下所示：

```python
>>> from itertools import accumulate
>>> candiesCount = [7, 4, 5, 3, 8]

>>> accumulate(candiesCount)
<itertools.accumulate object at 0x037ACEA8>

>>> list(accumulate(candiesCount))
[7, 11, 16, 19, 27]
```

### 前缀和原理

前缀和关键问题在于：**如何快速得到某个子数组的和？**这就使用到了**前缀和**的技巧。

写伪代码实现前缀和：

```python
n = len(nums)
pre_sum = [0] + [0] * n
for i in range(n):
    pre_sum[i + 1] = pre_sum[i] + nums[i]
```

上面代码求出的前缀和 `pre_sum` 的含义为：`pre_sum[i]` 为 `nums[0:i-1]`的和。

如果要求解  `nums[i..j]` 的和，则可以使用 `pre_sum[j+1] - pre_sum[i]` 即可。

如果在实际的应用中，感觉到上述的方法较为复杂，要使用 `accumulate` 方法，则需要注意到以下问题：

按照概述中的例子来举例：

```python
nums         = [7, 4,  5,  3,  8]
pre_sum      = [7, 11, 16, 19, 27] # 
```

画个表格，方便理解：

| i       | 0    | 1    | 2    | 3    | 4    |
| ------- | ---- | ---- | ---- | ---- | ---- |
| nums    | 7    | 4    | 5    | 3    | 8    |
| pre_sum | 7    | 11   | 16   | 19   | 27   |

要求解`nums[1...3]`，可以看到，其实际的区间和为 4 + 5 + 3 为 12，对应的 `pre_sum[3] - pre_sum[0]` 为 19 - 7 = 12。

:::tip 结论

故得出结论：在实际的编写代码过程中，`nums[i..j] = pre_sum[j] - pre_sum[i - 1]`，但是这种方式要注意，数组越界！

或者将 `pre_sum` 初始化为：`[0] + accumulate(nums)`，`nums[i..j] = pre_sum[j+1] - pre_sum[i]` 即可。

:::


## 例题解析

### LC1588 所有奇数长度子数组的和

[LC1588](https://leetcode-cn.com/problems/sum-of-all-odd-length-subarrays/)

这道题可以帮助理解：如何获取数组中所有奇数长度的子数组，并求和。比较基础的处理方法，考验编程的基础。

```python
import unittest
from typing import List


class Solution:
    def sumOddLengthSubarrays(self, arr: List[int]) -> int:
        """
        奇数子序列的和，如何与前缀和联系起来？
        前缀和的本质是为了求解数组区间的和，我们枚举所有的奇数数组区间，然后求和
        """
        presum = [0] * (len(arr) + 1)
        for i in range(len(arr)):
            presum[i + 1] = arr[i] + presum[i]

        res = 0
        for start in range(len(arr)):
            length = 1
            while length + start <= len(arr):
                end = start + length - 1
                res += presum[end+1] - presum[start]
                length += 2

        return res
```

特别的，如果是 C++/C 实现，可以如下所示：

```c++
for (int start = 0; start < n; start++)
{
    for (int length = 1; start + length <= n; length += 2)
    {
        int end = start + length - 1;
        for (int i = start; i <= end; i++)
        {
            sum += arr[i];
        }
    }
}
```

### LC2055 蜡烛之间的盘子

[LC2055](https://leetcode-cn.com/problems/plates-between-candles/)

直接看代码和测试用例：

```python
class Solution:
    def platesBetweenCandles(self, s: str, queries: List[List[int]]) -> List[int]:
        """
        先找到最左边的 | 再找到最右边的 | 然后计算之间 * 的个数
        但是暴力解法会超时，区间和一类的解法就使用前缀和的思想
        """
        # 先计算每个位置为止蜡烛的数量前缀和数组
        n = len(s)
        presum = [0] * (n + 1)
        for i in range(n):
            if s[i] == '*':
                presum[i+1] = presum[i] + 1
            else:
                presum[i+1] = presum[i]

        # 找到左右两个蜡烛的位置，注意到如果直接从左右两边搜索还是会超时，所以需要优化
        # 我们尝试使用数组来维护这个边界
        left, right = [0] * n, [0] * n
        l, r = -1, -1
        for i in range(n):
            if s[i] == '|':
                l = i
            left[i] = l

        for i in range(n-1, -1, -1):
            if s[i] == '|':
                r = i
            right[i] = r
        res = []
        for query in queries:
            # 注意理解这边：right, left
            x, y = right[query[0]], left[query[1]]
            if x < 0 or y < 0 or x >= y:
                res.append(0)
            else:
                res.append(presum[y] - presum[x])
        return res
```

测试用例如下：

```python
class TestSolution(unittest.TestCase):
    def setUp(self):
        self.s = Solution()
        return super().setUp()

    def tearDown(self):
        self.s = None

    def test_01(self):
        s = "**|**|***|"
        # presum = [0, 1, 2, 2, 3, 4, 4, 5, 6, 7, 7]
        queries = [[2, 5], [5, 9]]
        res = self.s.platesBetweenCandles(s, queries)
        self.assertEqual([2, 3], res)

    def test_02(self):
        s = "***|**|*****|**||**|*"
        queries = [[1, 17], [4, 5], [14, 17], [5, 11], [15, 16]]
        res = self.s.platesBetweenCandles(s, queries)
        self.assertEqual([9, 0, 0, 0, 0], res)


if __name__ == '__main__':
    unittest.main()
````

### LC560 和为 k 的子数组

> 给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续的子数组的个数。
>
> 示例 1 :
>
> 输入:nums = [1,1,1], k = 2
>
> 输出: 2 , [1,1] 与 [1,1] 为两种不同的情况。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/subarray-sum-equals-k
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

#### 解法1：直接用前缀和（超时）

应用前缀和求解这个问题的时候，很容易写出如下的代码，但是该方法超时：

```python
def subarraySum(self, nums: List[int], k: int) -> int:
    # 求出前缀和数组
    pre_sum = [0] + list(accumulate(nums))
    count = 0
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            # nums[i..j] = pre_sum[j+1] - pre_sum[i]
            if pre_sum[j + 1] - pre_sum[i] == k:
                count += 1
     return count

# 小优化，j 从 i + 1 开始循环，提高可读性
def subarraySum(self, nums: List[int], k: int) -> int:
    pre_sum = [0] + list(accumulate(nums))
    count = 0
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            # nums[i..j] = pre_sum[j+1] - pre_sum[i]
            if pre_sum[j] - pre_sum[i] == k:
                count += 1
     return count
```

#### 解法2：优化解法（hash map）

如果分析上面解法1的时间复杂度，不难看出，其时间复杂度为 $O(n^2)$，所以进行如下优化：

上述的判断语句：

```python
if pre_sum[j] - pre_sum[i] == k:
	count += 1
```

等价于：

```python
if pre_sum[i] == pre_sum[j] - k:
    count += 1
```

如此可以把循环进行颠倒：

```python
#原来的循环
for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if pre_sum[j] - pre_sum[i] == k:
            count += 1

# 颠倒后的循环
for j in range(1, len(nums)):
	for i in range(j):
        if pre_sum[i] == pre_sum[j] - k:
            count += 1
```

其含义是，**有多少个 `i` 满足 `pre_sum[i]` 的值为 `pre_sum[j] - k`**。所以我们可以通过 hashmap 存储每一个 `pre_sum[i]` 的值，直接找到满足条件的 `pre_sum[i]` 的个数。

因此我们使用 hashmap，在计算前缀和的同时把前缀和的每个值出现的次数都记录在 hashmap 中。

~~（因此可以使用 hash map 记录下来有几个 `pre_sum[i]` 和 `pre_sum[j+1] - k ` 相等，干掉内层的 for 循环。）~~

```python
def subarraySum(self, nums: List[int], k: int) -> int:
    # # 使用 hash 表优化
    # # 存储前缀和出现的次数
    _dict = collections.defaultdict(int)
    _dict[0] = 1

    count = 0
    # 前缀和 nums[0..i]
    sum_0_i = 0
    for i in range(len(nums)):
        sum_0_i += nums[i]
        sum_0_j = sum_0_i - k
        if sum_0_j in _dict:
            count += _dict[sum_0_j]
        _dict[sum_0_i] += 1
        
    return count
```

#### 解法3：对比理解

使用下面的解法，对比理解这个题目：

首先看优化后的 for 循环:

```python
for j in range(1, len(nums)):
	for i in range(j):
        if pre_sum[i] == pre_sum[j] - k:
            count += 1
```

```python
class Solution4:
    def subarraySum(self, nums: List[int], k: int) -> int:
        mapping = collections.defaultdict(int)
        # 前缀和 0 出现 1 次
        mapping[0] = 1
        count = 0
        presum_j = 0
        for num in nums:
            presum_j += num
            # 查找有多少个 presum[i] 等于 presum[j] - k
            # 要求解的 presum[i] 的个数
            if presum_j - k in mapping:
                count += mapping.get(presum_j - k)

            # 更新 presum[j] 的个数
            if presum_j in mapping:
                mapping[presum_j] += 1
            else:
                mapping[presum_j] = 1
        return count
```

### LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？

[LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？](https://leetcode-cn.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day/)

这个题目描述比较复杂，关键在于从题目中进行抽象，得出可以用前缀和求解的思路。

> 输入：candiesCount = [7,4,5,3,8], queries = [[0,2,2],[4,2,4],[2,13,1000000000]]
>
> 输出：[true,false,true]
>
> 提示：
>
> 1. 在第 0 天吃 2 颗糖果(类型 0），第 1 天吃 2 颗糖果（类型 0），第 2 天你可以吃到类型 0 的糖果。
> 2. 每天你最多吃 4 颗糖果。即使第 0 天吃 4 颗糖果（类型 0），第 1 天吃 4 颗糖果（类型 0 和类型 1），你也没办法在第 2 天吃到类型 4 的糖果。换言之，你没法在每天吃 4 颗糖果的限制下在第 2 天吃到第 4 类糖果。
> 3. 如果你每天吃 1 颗糖果，你可以在第 13 天吃到类型 2 的糖果。 
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

巧妙用到了前缀和，解法如下：

```python
class Solution:
    def canEat(self, candiesCount: List[int], queries: List[List[int]]) -> List[bool]:
        # 求前缀和
        pre_sum = [0] + list(accumulate(candiesCount))
        res = list()
        for _type, day, cap in queries:
            # 题意是从 0 开始，所以要 +1
            min_can_eat, max_can_eat = day + 1, (day + 1) * cap
            # 表示自己喜欢吃的糖果的区间
            first_favor_candy, last_favor_candy = pre_sum[_type] + 1, pre_sum[_type] + candiesCount[_type]
            res.append(min_can_eat <= last_favor_candy and max_can_eat >= first_favor_candy)

        return res
```

其中有个题解非常形象，可以参考：[题解](https://leetcode-cn.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day/solution/python3-shu-zhou-jie-ti-yi-tu-ming-liao-debzu/)



### LC523 连续的子数组和

> 给你一个整数数组 nums 和一个整数 k ，编写一个函数来判断该数组是否含有同时满足下述条件的连续子数组：
>
> 子数组大小 至少为 2 ，且
> 子数组元素总和为 k 的倍数。
> 如果存在，返回 true ；否则，返回 false 。
>
> 如果存在一个整数 n ，令整数 x 符合 x = n * k ，则称 x 是 k 的一个倍数。
>
> 示例 1：
>
> 输入：nums = [23,2,4,6,7], k = 6
>
> 输出：true
>
> 解释：[2,4] 是一个大小为 2 的子数组，并且和为 6 。
>
> 
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/continuous-subarray-sum
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这道题目也是一个经典的前缀和应用，需要注意，直接暴力求解前缀和问题一般都会超时，需要进行优化，最终的代码如下所示：

```python
class Solution:
    def checkSubarraySum(self, nums: List[int], k: int) -> bool:
        mapping = {0: -1}
        for i, prefix in enumerate(accumulate(nums)):
            # 保证 k!=0
            key = prefix % k if k else prefix
            if key not in mapping:
                mapping[key] = i
            elif i - mapping[key] >= 2:
                return True
        return False
```

#### LC 560 解法3：模板

作为对比，如果要设计出来一个模板的话，可以将上述代码套入求解 LC560：

```python
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        mapping = collections.defaultdict(int)
        mapping[0] = 1
        count = 0

        for i, prefix in enumerate(accumulate(nums)):
            key = prefix - k
            if key not in mapping:
                mapping[prefix] += 1
            else:
                count += mapping[key]
                mapping[prefix] += 1
        return count
```

### LC525 连续数组

> 给定一个二进制数组 nums , 找到含有相同数量的 0 和 1 的最长连续子数组，并返回该子数组的长度。
>
> 示例 1:
>
> 输入: nums = [0,1]
>
> 输出: 2
>
> 说明: [0, 1] 是具有相同数量0和1的最长连续子数组。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/contiguous-array
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

题目分析：这道题目首先把数组中的 0 全部替换成 1，那就等价于找和为 0 的最长连续数组。不同于上面 LC560 的是，这道题目要求返回的是子数组的长度。

如果这道题目按照上述模板进行的话，可能会有些难理解，所以，模板不能万能的，关键还是要理解！

#### 解法一：模板

```python
class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        _nums = []
        for num in nums:
            if num == 0:
                _nums.append(-1)
            else:
                _nums.append(1)

        # 遇到前缀和，首先联想到 hash map
        mapping = collections.defaultdict(int)
        mapping[0] = -1
        max_len = 0
        for i, prefix in enumerate(accumulate(_nums)):
            key = prefix - 0
            # 如果存在1和0的数量差值相等的地方，那么说明后者到前者之前1和0的数量相等！
            # 换句话说，就是前缀和相等的地方，求解前缀和数组出现相等地方的最大距离
            if key not in mapping:
                mapping[prefix] = i
            else:
                max_len = max(max_len, i - mapping[key])
        return max_len
```

### LC209 长度最小的子数组

> 给定一个含有 n 个正整数的数组和一个正整数 target 。
>
> 找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。
>
> 示例 1：
>
> 输入：target = 7, nums = [2,3,1,2,4,3]
>
> 输出：2
>
> 解释：子数组 [4,3] 是该条件下的长度最小的子数组。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/minimum-size-subarray-sum
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

解析：可以使用前缀和来求解。

牢记前缀和的推导：`nums[i:j]`的和等于 `pre_sum[j + 1] - pre_sum[i]`，当初始化为 [0] + presums 的时候。

如果是初始化为 presums 的时候，前缀和就应该是 `pre_sum[j] - pre_sum[i-1]`，其实是等价的，就看下标的不同。

```python
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        if not nums:
            return 0
        ans = len(nums) + 1
        # 求前缀和，这种方式求解的前缀和 nums[i:j] = pre[j+1] - pre[i]
        pre_sum = [0] + list(itertools.accumulate(nums))

        # 推导一下：我们在确定左边界 i 的时候，需要求解 sum(nums[i:j]) >= target, 也就是说相当于 pre[j+1] - pre[i] >= target
        # 移项可得 pre[j+1] >= pre[i] + target
        # 也就是说需要找到那个 j 在数组中的插入位置
        for i in range(len(pre_sum)):
            find = pre_sum[i] + target
            bound = bisect.bisect_left(pre_sum, find)
            if bound != len(pre_sum):
                ans = min(bound - i, ans)

        return 0 if ans == len(pre_sum) else ans

```
