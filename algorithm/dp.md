# DP

## 1.1. Fibonacci

> 斐波那契数列：1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...  
> 如果设F(n）为该数列的第n项（n∈N*），那么这句话可以写成如下形式：F(n)=F(n-1)+F(n-2)

### 1.1.1. 递归法

Recursive approach：使用递归法，时间复杂度 O(n^2)，空间复杂度 O(n):

```py
def fib_recur(n):
    if n < 2:
        return  n
    return fib_recur(n-1) + fib_recur(n-2)
```

### 1.1.2. 动态规划 <Badge text="reco" type="tip"/>

Dynamic programmming approach：使用 DP, 时间复杂度和空间复杂度均为 O(n)

```py
def fib_dyn(n):
    if n < 2:
        return n
    memo = [-1 for i in range(n+1)]
    # 使用 range(n) 会数组越界
    memo[0] = 0
    memo[1] = 1
    for i in range(2, n + 1):
        memo[i] = memo[i - 1] + memo[i - 2]
    return memo[n]
```

### 1.1.3. 记忆化搜索

Memoization of Fibonacci :

```py
def fib(N):
    cache = {}
    def recur_fib(N):
        if N in cache:
            return cache[N]
        if N < 2:
            result = N
        else:
            result = recur_fib(N - 1) + recur_fib(N - 2)

        cache[N] = result
        return result
    return recur_fib(N)
```

### 1.1.4. 使用公式

Imperative approach使用公式，时间复杂度 O(n), 空间复杂度 O(1)

```py
def fib_imp(n):
    if n < 2:
        return n
    a = 0
    b = 1
    for i in range(1, n):
        a, b = b, a + b
    return b
```

## 1.2. 记忆化搜索

### 1.2.1. 记忆化搜索概览

记忆化搜索和 DP 是有很多相似之处的，所以把记忆化搜索放在 DP 里面进行研究。

总的来说，我们写记忆化搜索算法的步骤大致为：

* 使用BFS记忆化：
  1. 写出这道题的暴力搜索程序（如 DFS）
  2. 将这个 DFS 改写城“无需外部变量”的 DFS
  3. 添加记忆化数组
* 使用状态转移方程记忆化：
  1. 把这道题目的 DP 和方程写出来
  2. 根据它们写出 DFS 函数
  3. 添加记忆化数组

其优点在于：

1. 避免搜索到无用状态

其缺点在于：

1. 不能滚动数组
2. 有些优化较难
3. 效率较低但是不至于 TLE

## 1.3. 例题

### 1.3.1. LC638 大礼包

[638. 大礼包](https://leetcode-cn.com/problems/shopping-offers/)

这道题目可以利用记忆化搜索的方式去求解。

首先按照例子解释一下这个用例：

> price = [2, 5] // A, B 对应的价格
>
> special = [[3, 0, 5], [1, 2, 10]] // 表示折扣, 3A 0B 的大礼包价格是 5
>
> needs = [3, 2] // 需要买的总的数量

1. 我们该怎么合理使用大礼包呢？

   按照记忆化搜索的思路，我们首先过滤掉无用的状态，即过滤掉不需要计算的大礼包，可以分几种情况来判断哪些大礼包是我们不需要的：

   - 根据题目要求「不能购买超出购物清单指定数量的物品」，如果大礼包里面的所有物品加起来超过我们要买的物品总数了，那么这个大礼包不能要；
   - 大礼包不划算则不选这个大礼包（不划算指的是我单独买这些物品，下来大礼包反而贵了）
   - 大礼包内不包含我们要买的物品，也不能买 

   以上的条件就是我们记忆化搜索时可以用来筛选的条件。

2. 根据题目要求，我们可以写出大致的状态转移方程。

   - 我们用 `dp ` 表示满足购物清单 `needs ` 需要的最小花费

   - 我们思考满足购物清单 `needs ` 的最后一次购买，其可以分为两种情况：

     1. 购买大礼包
     2. 不购买大礼包

   - 我们如果购买大礼包的时候，可以遍历每一个大礼包，$price_i$ 表示第 $i$ 个大礼包的价格，$needs_i$ 表示大礼包中的物品清单，$needs - needs_i$ 表示购物清单 $needs$ 减去第 $i$ 个大礼包中包含的物品清单后剩余的物品清单。

先附上官方题解，这个题解目前还有很多的疑问点：

```python
class Solution:
    def shoppingOffers(self, price: List[int], special: List[List[int]], needs: List[int]) -> int:
        n = len(price)
        filter_special = []
        for sp in special:
            # 比如在第一个例子中 i == 2
            # 第二个条件表示大礼包是有优惠的，这时候我们选择该礼包
            if sum(sp[i] for i in range(n)) > 0 and sum(sp[i] * price[i] for i in range(n)) > sp[-1]:
                filter_special.append(sp)

        @lru_cache(None)
        def dfs(cur_needs):
            # 在不购买大礼包的时候，购买购物清单中所有物品需要的花费
            min_price = sum(need * price[i] for i, need in enumerate(cur_needs))
            for cur_special in filter_special:
                special_price = cur_special[-1]
                nxt_needs = []
                for i in range(n):
                    if cur_special[i] > cur_needs[i]:
                        # 不购买多于当前订单数量的物品
                        break
                    # 还剩下多少物品需要购买
                    nxt_needs.append(cur_needs[i] - cur_special[i])
                # why, 如果上述遍历完成，满足数量条件，大礼包可以购买
                if len(nxt_needs) == n:
                    min_price = min(min_price, dfs(tuple(nxt_needs)) + special_price)

            return min_price

        return dfs(tuple(needs))
```

对应的测试用例：

```python
class Test(unittest.TestCase):
    def setUp(self) -> None:
        self.s = Solution()

    def test_1(self):
        # 折扣对应的价格
        price = [2, 5]
        # 表示折扣
        special = [[3, 0, 5], [1, 2, 10]]
        # 需要买的数量
        needs = [3, 2]

        res = self.s.shoppingOffers(price, special, needs)
        self.assertEqual(14, res)
```

### 1.3.2. 跳台阶游戏

> 一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。

这是一个换了个考法的斐波那契数列问题：

第一次跳台阶只有两种选择：

* 跳 1 阶，则剩余的跳法为 f(n-1)
* 跳 2 阶，则剩余的跳法为 f(n-2)

所有的跳法就是 f(n-1) + f(n-2), 是不是和斐波那契数列一模一样？至此，就可以使用斐波那契数列的三种解法解决这个问题，只需要注意边界条件即可。

```py
class Solution:
    def jumpFloor(self, n):
        # write code here
        if n < 2:
            return n
        a = 1
        b = 1
        for i in range(1, n):
            a, b = b, a + b
        return b
```

扩展问题：

> 一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

```py
class Solution:
    def jumpFloorII(self, n):
        # write code here
        if n <= 1:
            return n
        return 2 ** (n-1)
```

### 1.3.3. 矩形覆盖

> 我们可以用 $2*1$ 的小矩形横着或者竖着去覆盖更大的矩形。请问用 n 个 $2*1$ 的小矩形无重叠地覆盖一个 $2*n$ 的大矩形，总共有多少种方法？

矩形覆盖无非就是两种情况：

1. 刚好填满一列：

|  √   |      |      |      |      |      |      |      |
| :--: | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|  √   |      |      |      |      |      |      |      |

2. 横向需要两个填满两列：

|  √   |  √   |      |      |      |      |      |      |
| :--: | :--: | ---- | ---- | ---- | ---- | ---- | ---- |
|  ×   |  ×   |      |      |      |      |      |      |

这两种方式都可以实现填满，那么总的方式 $f(n) = f(n-1) + f(n-2)$ ，$f(n-1)$  为方法1，填满其中的一列，剩余 $n-1$ 列，$f(n-2)$ 为方法2，填满其中的两列，剩余 $n-2$ 列。

所以代码的编写就和斐波那契数列相同。
