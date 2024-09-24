---
title: Backtrack
date: 2021-01-15
---

## Abstract

**回溯法**（英语：backtracking）是[暴力搜索法](https://zh.wikipedia.org/wiki/暴力搜尋法)中的一种。

对于某些计算问题而言，回溯法是一种可以找出所有（或一部分）解的一般性算法，尤其适用于[约束补偿问题](https://zh.wikipedia.org/wiki/约束补偿问题)（在解决约束满足问题时，我们逐步构造更多的候选解，并且在确定某一部分候选解不可能补全成正确解之后放弃继续搜索这个部分候选解本身及其可以拓展出的子候选解，转而测试其他的部分候选解）。

<!-- more -->

在经典的教科书中，[八皇后问题](https://zh.wikipedia.org/wiki/八皇后问题)展示了回溯法的用例。（八皇后问题是在标准国际象棋棋盘中寻找八个皇后的所有分布，使得没有一个皇后能攻击到另外一个。）

回溯法采用[试错](https://zh.wikipedia.org/wiki/试错)的思想，它尝试分步的去解决一个问题。在分步解决问题的过程中，当它通过尝试发现，现有的分步答案不能得到有效的正确的解答的时候，它将取消上一步甚至是上几步的计算，再通过其它的可能的分步解答再次尝试寻找问题的答案。回溯法通常用最简单的[递归](https://zh.wikipedia.org/wiki/递归)方法来实现，在反复重复上述的步骤后可能出现两种情况：

* 找到一个可能存在的正确的答案
* 在尝试了所有可能的分步方法后宣告该问题没有答案

在最坏的情况下，回溯法会导致一次[复杂度](https://zh.wikipedia.org/wiki/计算复杂性理论)为[指数时间](https://zh.wikipedia.org/wiki/指數時間)的计算。

## 模板

总结回溯的模板如下：

```python
result = []
def back_track(path, choices):
    if OK:
        result.append(path)
        return
    else:
        for choice in choices:
            make_choices()
            back_tarack(path, choices)
            undo_choices()
```

其中 path 表示路径，choices 表示做出的选择。

## 例题解析

### LC17 电话号码的字母组合

> 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
>
> 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
>
> 输入：digits = "23"
>
> 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
>
> 来源：力扣（LeetCode）
>  
> 链接：https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

解法：标准回溯：

```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        dig2alph = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }

        result = []
        combia = []
        # 重点：回溯的时候如何确定回溯的参数？
        def backtrack(index):
            # 模板：给出终止条件
            if index == len(digits):
                result.append(''.join(combia))
                return
            digit = digits[index]
            for ch in dig2alph.get(digit):
                combia.append(ch)
                backtrack(index + 1)
                # 这个回溯过程的理解：递归调用以后满足条件返回了
                # 可以画一个树形结构来理解
                combia.pop()
        backtrack(0)
        return result

```

### LC22 括号生成

> 数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。
>
> 有效括号组合需满足：左括号必须以正确的顺序闭合。

解法：回溯。通过 left 和 right 是否"平衡"来筛选一下数据。

```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []

        def back_track(A: list, left, right):
            # 比如 n == 3 时，生成的括号总数为 2*3 个
            if len(A) == 2 * n:
                res.append(''.join(A))
                return
            if left < n:
                A.append('(')
                back_track(A, left + 1, right)
                A.pop()
            if right < left:
                A.append(')')
                back_track(A, left, right + 1)
                A.pop()

        back_track([], 0, 0)
        return res
```

如果不使用该方法的话，可能需要使用较为“暴力”的解法：
(不过该解法比较适合用来理解回溯的思想)

```python
    def generateParenthesis(self, n: int) -> List[str]:

        def generate(A: list):
            if len(A) == 2 * n:
                if is_valid(A):
                    res.append("".join(A))
            else:
                A.append('(')
                generate(A)
                A.pop()
                A.append(')')
                generate(A)
                A.pop()

        def is_valid(A):
            balance = 0
            for ch in A:
                if ch == '(':
                    balance += 1
                else:
                    balance -= 1
                if balance < 0:
                    return False
            return balance == 0

        res = list()
        generate([])
        return res
```

### LC39 组合总数

> 给定一个无重复元素的正整数数组 candidates 和一个正整数 target ，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。
>
> candidates 中的数字可以无限制重复被选取。如果至少一个所选数字数量不同，则两种组合是唯一的。 
>
> 输入: candidates = [2, 3, 6, 7], target = 7
>
> 输出: [[7], [2, 2, 3]]
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/combination-sum
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

套用上述的公式，写出的解法如下：

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []

        def back_track(A):
            if sum(A) == target and sorted(A) not in res:
                res.append(sorted(A[:]))
                return
            if sum(A) > target:
                return
            for c in candidates:
                A.append(c)
                back_track(A)
                A.pop()

        back_track([])
        return res
```

注意到 sum(A) 大于 target 被剪枝，这样就减少了计算量。第二是通过排序的操作筛选出了已经存在的组合。

但是该算法还存在很大的优化点，因为我们的“剪枝”操作过于原始，在这种**不需要考虑顺序**的题目中，应当考虑更加高效的方法。

```python
class Solution2:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []

        def back_track(A: list, cur_sum, begin):
            if cur_sum == target:
                res.append(sorted(A[:]))
                return
            if cur_sum > target:
                return
            for i in range(begin, len(candidates)):
                # 剪枝
                if cur_sum + candidates[i] > target:
                    return

                cur_sum += candidates[i]
                A.append(candidates[i])
                // 不用i+1，表示可以重复读取当前的数
                back_track(A, cur_sum, i)
                cur_sum -= candidates[i]
                A.pop()
        candidates.sort()
        back_track([], 0, 0)
        return res
```

注意到这个回溯之前我们先进行了排序 `candidates.sort()` , 这个剪枝相比于上面的解法高明之处在哪里呢？

* 如果题目要求，结果集不计算顺序，此时需要按顺序搜索，才能做到不重不漏。（为何排序？按照特定搜索指定了 `begin`）
* 使用了一个 `begin`变量，这个变量用于组合问题，不讲究顺序（即 `[2, 2, 3]` 与 `[2, 3, 2]` 视为相同列表时），需要按照某种顺序搜索。

理解 `cur_sum` 的优点在于：对于刚开始的原始解法，，对于sum已经大于target的情况，其实是依然进入了下一层递归，只是下一层递归结束判断的时候，会判断sum > target的话就返回。其实如果已经知道下一层的sum会大于target，就没有必要进入下一层递归了。所以我们在 for 循环中做了文章，使用 `cur_sum` 来判断如果下一层的 sum 已经大于 target，就没有必要走下去了，而是直接结束本轮 for 循环的遍历。

参考该[blog](https://programmercarl.com/0039.%E7%BB%84%E5%90%88%E6%80%BB%E5%92%8C.html#%E5%89%AA%E6%9E%9D%E4%BC%98%E5%8C%96)

### LC40 组合总数II

不同于 LC39 组合总数，LC40 要求 `candidates` 中的每个数字在每个组合中只能使用一次。

举例而言：

> 输入: candidates = [10, 1, 2, 7, 6, 1, 5], target = 8, 
>
> 输出:
> [
> [1, 1, 6], 
> [1, 2, 5], 
> [1, 7], 
> [2, 6]
> ]
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/combination-sum-ii
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

题目的意思是，每个数字在每一个答案里面只能用一次，无法重复使用，因此如何达到这个限制是本题目的难点，解决方案是使用比较高级的剪枝，与上述题目只有一点不同，具体看代码：

```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []

        def back_track(A: list, cur_sum, begin):
            if cur_sum == target:
                res.append(A[:])
                return
            if cur_sum > target:
                return

            for i in range(begin, len(candidates)):
                if cur_sum + candidates[i] > target:
                    return

                if i > begin and candidates[i] == candidates[i - 1]:
                    continue

                cur_sum += candidates[i]
                A.append(candidates[i])
                back_track(A, cur_sum, i + 1)
                cur_sum -= candidates[i]
                A.pop()

        candidates.sort()
        back_track([], 0, 0)
        return res
```

可以看到，我们在代码中增加了一段剪枝：

```python
if i > begin and candidates[i] == candidates[i - 1]:
    continue
```

并且在回溯的时候把 begin 设置为了 `i+1` ，个人的理解是，这一步操作排除了当前层的节点，从下一层开始找，达到了我们剪枝的目的。（去重“同一树层上使用过的”元素）

```python
back_track(A, cur_sum, i + 1)
```

对这个 `begin` 的理解是：其作用相当于标记了 used 元素（使用 used 数组标记效果相同），我们在 sort() 的情况下用 begin 是可以的。

**（需要加深理解，不一定正确。）**

### LC46 全排列

在解决了上面的那些问题以后，全排列问题就变得简单了，全排列问题举例如下：

> 给定一个不含重复数字的数组 `nums` ，返回其 **所有可能的全排列** 。你可以 **按任意顺序** 返回答案。
>
> 输入：nums = [1, 2, 3]
>
> 输出：[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]

该题目使用回溯可以很方便的求解：

```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res = []

        def back_track(path):
            if len(path) == len(nums):
                res.append(path[:])
                return
            
            for i in range(len(nums)):
                if nums[i] in path:
                    continue

                path.append(nums[i])
                back_track(path)
                path.pop()

        back_track([])
        return res
```

全排列是经典的回溯问题，套用回溯模板可以很轻松求解。

### LC47 全排列II

> 给定一个可包含重复数字的序列 `nums` ，**按任意顺序** 返回所有不重复的全排列。
>
> 输入：nums = [1, 1, 2]
>
> 输出：
> [[1, 1, 2], 
> [1, 2, 1], 
> [2, 1, 1]]

解法如下：

```python
class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        res = []

        def back_track(path: List, visited: List):
            if len(path) == len(nums):
                res.append(path[:])
                return

            for i in range(len(nums)):
                if visited[i] == 1:
                    continue
				
                # visited[i - 1] == 1 在该题目中同理，但是性能较差
                if i > 0 and nums[i] == nums[i - 1] and visited[i - 1] == 0:
                    continue

                visited[i] = 1
                path.append(nums[i])
                back_track(path, visited)
                visited[i] = 0
                path.pop()

        nums.sort()

        visited = [0 for _ in nums]
        back_track([], visited)
        return res
```

这道题目不同于*全排列*的点在于：

* 集合中有重复的元素，但是最后的结果中不能有重复的组合。我们需要对结果进行去重（直观的思路是用set，但是容易超时）
* nums[i] 和 nums[i - 1] 可以理解为同一层的当前选项和同一层的前一个选项
* 该题目中有两个变量去重，如果仅有`num[i] == num[i-1]`条件存在，递归时会把相同元素去除，显然不是我们想要的，所以加上了 `vistied`，防止漏掉元素
* 如果 `visited[i - 1] == 1`，说明在同一层，并且 `num[i] == num[i-1]`，所有可能的组合都早已被这一层第一次出现的那个相同数穷尽了，不需要再画蛇添足。

:::warning todo

需要拿 iPad 画图分析一下 visited[i - 1] == 1 和 visited[i - 1] == 0 的剪枝差异，可以参考 [题解](https://leetcode-cn.com/problems/permutations-ii/solution/dai-ma-sui-xiang-lu-dai-ni-xue-tou-hui-s-ki1h/)

:::

### LC77 组合

> 给定两个整数 `n` 和 `k` ，返回范围 `[1, n]` 中所有可能的 `k` 个数的组合。
>
> 你可以按 **任何顺序** 返回答案。
>
> 输入：n = 4, k = 2
> 输出：
> [
> 	[2, 4], 
> 	[3, 4], 
> 	[2, 3], 
> 	[1, 2], 
> 	[1, 3], 
> 	[1, 4], 
> ]

```python
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        res = []

        nums = [i + 1 for i in range(n)]

        def back_track(path: List, begin):
            if len(path) == k:
                res.append(path[:])
                return

            for i in range(begin, len(nums)):
                if i > begin and nums[i] == nums[i - 1]:
                    continue

                path.append(nums[i])
                back_track(path, i + 1)
                path.pop()

        back_track([], 0)
        return res
```

### LC473 火柴拼正方形

题目链接见：[473. 火柴拼正方形](https://leetcode.cn/problems/matchsticks-to-square/)

这道题目需要注意以下几点：

1. 火柴可以拼接成正方形的条件是，所有火柴的和必须是 4 的倍数
2. 火柴数量小于 4 只的话非法

这两个条件可以作为我们的剪枝条件，我们给出这个题目的求解：

```python
class Solution:
    def makesquare(self, matchsticks: List[int]) -> bool:
        if len(matchsticks) < 4 or sum(matchsticks) % 4 != 0:
            return False
        
        target = sum(matchsticks) // 4
        # 从大到小排序保证回溯的次数比较少
        matchsticks.sort(reverse=True)
        # 把每一个 bucket 都放满 target
        bucket = [0] * 4
        def backtrack(index: int):
            if index >= len(matchsticks):
                return True
            
            for i in range(4):
                if bucket[i] + matchsticks[index] > target:
                    continue
                bucket[i] += matchsticks[index]
                if backtrack(index + 1):
                    return True
                bucket[i] -= matchsticks[index]
            return False

        return backtrack(0)

```

对于上述解法的，需要有以下注意的点：

1. 我们把火柴数量从大到小排列，这样做的好处可以避免过多的回溯
2. 我们给了四个桶 bucket, 每一个桶中最终的数量都是等于正方形的边长
3. 第 16 行，如果当前的火柴加上当前的桶的和超过了 target, 我们则继续遍历其他的桶
4. 剩下的就是回溯的基本步骤

除此之外，我们还能给出一个暴力的 DFS 解法，这个解法也是有助于我们理解这个题目的：

```python
class Solution:
    def makesquare(self, matchsticks: List[int]) -> bool:
        if sum(matchsticks) % 4 != 0 or len(matchsticks) < 4:
            return False

        # 每个边长可以计算出来
        target = sum(matchsticks) // 4

        matchsticks.sort(reverse=True)

        self.res = False

        @lru_cache(None)
        def dfs(a, b, c, d, i):
            if i == len(matchsticks) and a == b == c == d == target:
                self.res = True
                return

            if a + matchsticks[i] <= target:
                dfs(a + matchsticks[i], b, c, d, i + 1)
            if b + matchsticks[i] <= target:
                dfs(a, b + matchsticks[i], c, d, i + 1)
            if c + matchsticks[i] <= target:
                dfs(a, b, c + matchsticks[i], d, i + 1)
            if d + matchsticks[i] <= target:
                dfs(a, b, c, d + matchsticks[i], i + 1)

        dfs(0, 0, 0, 0, 0)
        return self.res
```

但是总体而言，这个解法是没有回溯的解法优雅的。
