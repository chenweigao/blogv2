# DFS & DFS

## Abstract

📑📑📑 深度优先搜索算法

📑📑📑 广度优先搜索算法

### 深度优先搜索算法

英语：Depth-First-Search，DFS是一种用于遍历或搜索树或图的算法。其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个结点只能访问一次.

因发明「深度优先搜索算法」，约翰 · 霍普克洛夫特与罗伯特 · 塔扬在1986年共同获得计算机领域的最高奖：图灵奖。


### 广度优先搜索算法

Breadth-First Search，缩写为 BFS，又称为宽度优先搜索，是一种图形搜索算法。简单的说，BFS 是从根结点开始，沿着树的宽度遍历树的结点。如果所有结点均被访问，则算法中止。

广度优先搜索也广泛应用在图论问题中。


## DFS

### 概览

1. 遇到一个问题，如何确定可以使用 DFS 求解？
2. 使用 DFS 求解的一般套路是什么？DFS 一般会用到了**递归**的概念，所以我们写出来的代码结构也应该是递归的。而对于递归，我们有的时候可以递归函数本身，有的时候需要写辅助函数来进行递归。
3. 上述 DFS 求解问题可以总结为 **自底向上方法**。


### LC329 矩阵中的最长递增路径

> 给定一个整数矩阵，找出最长递增路径的长度。
>
> 对于每个单元格，你可以往上，下，左，右四个方向移动。 你不能在对角线方向上移动或移动到边界外（即不允许环绕）。

这是一道迷宫搜索问题，可以使用 DFS 搜索，这样可以熟悉 DFS 的步骤。实现代码如下所示：

@[code](../code/dfs.py)

但是不幸的是，上述的解法会导致超时，所以我们要配合缓存，来求解这个问题：

@[code](../code/329.py)

### LC841 钥匙和房间

> 有 N 个房间，开始时你位于 0 号房间。每个房间有不同的号码：0，1，2，...，N-1，并且房间里可能有一些钥匙能使你进入下一个房间。
>
> 在形式上，对于每个房间 i 都有一个钥匙列表 rooms[i]，每个钥匙 rooms[i][j] 由 [0,1，...，N-1] 中的一个整数表示，其中 N = rooms.length。 钥匙 rooms[i][j] = v 可以打开编号为 v 的房间。
>
> 最初，除 0 号房间外的其余所有房间都被锁住。
>
> 你可以自由地在房间之间来回走动。
>
> 如果能进入每个房间返回 true，否则返回 false。
>
> 来源：力扣（LeetCode）
> 链接：<https://leetcode-cn.com/problems/keys-and-rooms>
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

其 DFS 解法如下所示：

```python
class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        n = len(rooms)
        visited = set()
        num = 0

        def dfs(i: int):
            visited.add(i)
            nonlocal num
            num += 1
            for it in rooms[i]:
                if it not in visited:
                    dfs(it)

        dfs(0)
        return num == n
```

如果这个不好理解，可以参考如下 DFS 解法：

```python
class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        visited = set()
        visited.add(0)
        
        def dfs(i, visited):
            visited.add(i)
            for key in rooms[i]:
                if key not in visited:
                    visited.add(key)
                    dfs(key, visited)
        
        dfs(0, visited)
        return len(visited) == len(rooms)
```

二刷的解法更加简洁：

```python
class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        visited = set()
        def dfs(i: int):
            visited.add(i)
            for key in rooms[i]:
                if key not in visited:
                    visited.add(key)
                    dfs(key)
                    
        dfs(0)
        return len(visited) == len(rooms)
```

使用 `stack` 的解法如下：

```python
class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        visited = set()
        visited.add(0)
        stack = [0]

        while stack:
            idx = stack.pop()
            for key in rooms[idx]:
                if key not in visited:
                    visited.add(key)
                    stack.append(key)
        return len(rooms) == len(visited)
```

还有 BFS 解法，可参考下文。

### LC200 岛屿数量

> 给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
>
> 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
>
> 此外，你可以假设该网格的四条边均被水包围。
>
> 
>
> 示例 1：
>
> ```
> 输入：grid = [
> ["1","1","1","1","0"],
> ["1","1","0","1","0"],
> ["1","1","0","0","0"],
> ["0","0","0","0","0"]
> ]
> ```
>
> 输出：1
>
> 来源：力扣（LeetCode）
>
> 链接：https://leetcode-cn.com/problems/number-of-islands
>
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

DFS 解法如下：

```python
class Solution:

    def dfs(self, grid, i, j):
        if i < 0 or j < 0 or i >= len(grid) or j >= len(grid[0]) or grid[i][j] != '1':
            return
        grid[i][j] = '#'
        self.dfs(grid, i + 1, j)
        self.dfs(grid, i - 1, j)
        self.dfs(grid, i, j + 1)
        self.dfs(grid, i, j - 1)

    def numIslands(self, grid):
        count = 0

        if not grid:
            return count
        
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == '1':
                    self.dfs(grid, i, j) # mark the visited
                    count += 1
        return count
```

### LC386 字典序排数

> 输入：n = 13
>
> 输出：[1,10,11,12,13,2,3,4,5,6,7,8,9]

<https://leetcode-cn.com/problems/lexicographical-numbers/>

其 DFS 的递归解法如下：

```python
class Solution:
    def lexicalOrder(self, n: int) -> List[int]:
        res = []

        def dfs(cur: int):
            if cur > n:
                return
            res.append(cur)
            for _ in range(10):
                dfs(cur * 10 + _)

        for i in range(1, 10):
            dfs(i)
        return res
```

注意到上述代码，我们在外层循环递归的时候从 `1` 开始而不是从 `0` 开始，因为我们不需要递归 `0` 开头的。

但是题目中要求了你必须设计一个时间复杂度为 `O(n)` 且使用 `O(1)` 额外空间的算法，所以我们尝试使用迭代的方法来解决这个问题。

```python
class Solution:
    def lexicalOrder(self, n: int) -> List[int]:
        res = [0] * n
        num = 1
        for i in range(n):
            res[i] = num
            if num * 10 <= n:
                num *= 10
            else:
                while num % 10 == 9 or num + 1 > n:
                    num //= 10
                num += 1
        return res
```

这种解法的核心在于判断末尾是否已经搜索完成，搜索完成的话退回上一位。

### LC417 太平洋大西洋水流问题

题目描述见 <https://leetcode-cn.com/problems/pacific-atlantic-water-flow/>, 简单概括一下，这个题目就是给你一个二维的矩阵，然后看这个二维矩阵中的元素是不是都可以到太平洋和大西洋，其中太平洋在矩阵的左边和上边环绕，大西洋在矩阵的右边和下边环绕。

#### DFS

我们给出这个问题的 DFS 解法：

```python
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        # 水必须流进大西洋 and 太平洋
        m, n = len(heights), len(heights[0])

        def search(starts: List):
            visited = set()

            def dfs(x: int, y: int):
                if (x, y) in visited:
                    return
                visited.add((x, y))
                for nx, ny in ((x + 1, y), (x, y + 1), (x - 1, y), (x, y - 1)):
                    if 0 <= nx < m and 0 <= ny < n \
                            and heights[nx][ny] >= heights[x][y]:
                        dfs(nx, ny)

            for x, y in starts:
                dfs(x, y)

            return visited
        # 从矩阵的上边界和左边界开始搜索, (0, 0) 不重复加
        # [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4), (1, 0), (2, 0), (3, 0), (4, 0)]
        pacific = [(0, i) for i in range(n)] + [(i, 0) for i in range(1, m)]

        # 从矩阵的下边界和右边界开始
        atlantic = [(m - 1, i) for i in range(n)] + [(i, n - 1) for i in range(m - 1)]

        return list(map(list, search(pacific) & search(atlantic)))
```

这个题目中用到了一种“反向搜索”的概念，其实本质来说，就是从矩阵边界进行搜索。根绝题目含义，反向搜索的时候，每次只能移动到高度相同或者高度更大的单元格。

注意到我们的初始化，pacific 和 atlantic 均表示边界元素的坐标。

#### BFS

我们给出这个问题的 BFS 解法：

```python
    def pacificAtlanticBfs(self, heights: List[List[int]]) -> List[List[int]]:
        # 水必须流进大西洋 and 太平洋
        m, n = len(heights), len(heights[0])

        def bfs(starts: List):
            visited = set(starts)
            q = collections.deque(starts)
            while q:
                x, y = q.popleft()
                for nx, ny in ((x + 1, y), (x, y + 1), (x - 1, y), (x, y - 1)):
                    if 0 <= nx < m and 0 <= ny < n \
                            and heights[nx][ny] >= heights[x][y] \
                            and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        q.append((nx, ny))
            return visited

        pacific = [(0, i) for i in range(n)] + [(i, 0) for i in range(1, m)]
        atlantic = [(m - 1, i) for i in range(n)] + [(i, n - 1) for i in range(m - 1)]

        return list(map(list, bfs(pacific) & bfs(atlantic)))
```

#### Testcase

其对应的测试用例如下：

```python
class Test(unittest.TestCase):
    def setUp(self) -> None:
        self.s = Solution()

    def test01(self):
        heights = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]
        res = self.s.pacificAtlantic(heights)
        print(res)
        self.assertCountEqual([[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]], res)
```

需要注意的是，这个测试用例的 `self.assertCountEqual` 表示 list 的顺序不同，但是其中的元素出现个数相等。



## BFS

### 概览

:::tip 概览

1. BFS 问题的本质就是让你在一副“图”中找到从起点 start 到终点 target 的最近距离；
2. BFS 的核心数据结构是队列；
3. BFS 常用 visited 结构来标记是否走过某段路程，避免走回头路；
4. BFS 在队列初始化的时候一般会加入将起点加入队列中；
5. 在写 BFS 前要明确终止条件。

:::


### LC841 钥匙和房间

很经典的一道题目，从举例看一下这道题目：

> 输入：[[1,3],[3,0,1],[2],[0]]
>
> 输出：false
>
> 解释：我们不能进入 2 号房间。

初始的时候是可以进入 0 号房间的，然后看能不能根据这个房间的钥匙把每个房间都走了。

下面是上述问题的 BFS 解法：

```python
class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        n = len(rooms)
        queue = collections.deque([0])
        visited = {0}

        while queue:
            x = queue.popleft()
            for it in rooms[x]:
                if it not in visited:
                    visited.add(it)
                    queue.append(it)
        return len(visited) == n
```

### LC200 岛屿数量

> 题目描述见 DFS 描述。

BFS 解法如下：

```python
class Solution:
    def numIslands(self, grid):
        row = len(grid)
        if not row:
            return 0
        col = len(grid[0])
        res = 0
        for r in range(row):
            for c in range(col):
                if grid[r][c] == '1':
                    # 开始 BFS
                    res += 1
                    q = collections.deque([(r, c)])
                    while q:
                        nr, nc = q.popleft()
                        for x, y in [(nr - 1, nc), (nr, nc - 1), (nr + 1, nc), (nr, nc + 1)]:
                            if 0 <= x < row and 0 <= y < col and grid[x][y] == '1':
                                q.append((x, y))
                                grid[x][y] = '0'
        return res
```

### LC210 课程表

[210. 课程表 II](https://leetcode-cn.com/problems/course-schedule-ii/)

> 现在你总共有 numCourses 门课需要选，记为 0 到 numCourses - 1。给你一个数组 prerequisites ，其中 prerequisites[i] = [ai, bi] ，表示在选修课程 ai 前 必须 先选修 bi 。
>
> 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示：[0,1] 。
>
> 返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，你只要返回 任意一种 就可以了。如果不可能完成所有课程，返回 一个空数组 。
>
> 
>
> **示例 1**：
>
> - 输入：numCourses = 2, prerequisites = [[1,0]]
> - 输出：[0,1]
> - 解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1] 。
>
> **示例 2**：
>
> - 输入：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
> - 输出：[0,2,1,3]
> - 解释：总共有 4 门课程。要学习课程 3，你应该先完成课程 1 和课程 2。并且课程 1 和课程 2 都应该排在课程 0 之后。
>   因此，一个正确的课程顺序是 [0,1,2,3] 。另一个正确的排序是 [0,2,1,3] 。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/course-schedule-ii
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这道题目比较综合，出的还是很不错的，我们整理思路如下：

1. 我们初始化每个课程，按照 index 把节点的入度全部初始化为 0, 注意到每个节点的入度我们都计算一下。
2. 我们维护一个 dict, key 是这个节点，value 是和这个节点的前驱
3. 然后对整体使用 BFS

比如 `[1,0]` 这对数据，1 的入度这时候需要 +1, 而在字典中我们将 1 的前驱 0 （多个前驱用列表保存）存储起来。


```python
class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        res = []
        edges = collections.defaultdict(list)
        # 存储节点的入度
        indeg = [0] * numCourses

        # 选修 ai 前必须先选修 bi
        for ai, bi in prerequisites:
            indeg[ai] += 1
            edges[bi].append(ai)

        # 将所有入度为0的节点放入队列中
        q = collections.deque([_ for _ in range(numCourses) if indeg[_] == 0])

        # bfs
        while q:
            node = q.popleft()
            res.append(node)
            for v in edges[node]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)

        if len(res) != numCourses:
            return list()
        return res
```

### LC977 找到小镇的法官

[997. 找到小镇的法官](https://leetcode-cn.com/problems/find-the-town-judge/)

这道题目与LC210 类似，都是关于入度和出度的。

> 在一个小镇里，按从 1 到 n 为 n 个人进行编号。传言称，这些人中有一个是小镇上的秘密法官。
>
> 如果小镇的法官真的存在，那么：
>
> 小镇的法官不相信任何人。
>
> 每个人（除了小镇法官外）都信任小镇的法官。
>
> 只有一个人同时满足条件 1 和条件 2 。
>
> 给定数组 trust，该数组由信任对 trust[i] = [a, b] 组成，表示编号为 a 的人信任编号为 b 的人。
>
> 如果小镇存在秘密法官并且可以确定他的身份，请返回该法官的编号。否则，返回 -1。
>
> 
>
> 示例 1：
>
> 输入：n = 2, trust = [[1,2]]
>
> 输出：2
>
> 
>
> 示例 2：
>
> 输入：n = 3, trust = [[1,3],[2,3]]
>
> 输出：3
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/find-the-town-judge
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```python
class Solution:
    def findJudge(self, n: int, trust: List[List[int]]) -> int:
        trust_in = [0] * (n + 1)
        trust_out = [0] * (n + 1)
        for me, other in trust:
            # 我信任了别人
            trust_out[me] += 1
            # 别人信任了我
            trust_in[other] += 1

        for i in range(1, n + 1):
            if trust_in[i] == n - 1 and trust_out[i] == 0:
                return i
        return -1
```

### LC752 打开转盘锁

[752. 打开转盘锁](https://leetcode-cn.com/problems/open-the-lock/)

问题分析：

- 我们可以定义 add, minus 来表示转盘密码 +1 或者 -1 的操作，注意到 0、9 这些边界值，将这个操作单独拎出来。

- 从题目中我们可以知道，有一些密码的组合是不能转到的，不然就算失败了，而为了达到不访问这些组合的效果，我们可以把这些组合和 visited 数组放到一起。
- 对这个问题进行抽象，一个锁共有 4 个位置，每个位置都可以向下或者向上转动，所以每个位置都有 2 种转动的可能，4 个位置共有 8 个可能。也就是说，‘xxxx’ 这个组合对应着 8 种下一个状态，8 种下一个状态中的每一个也是这样的结构，对应 8 种下一个状态… *这就像是一幅图，每个节点有 8 个相邻的节点*。

编码：

1. 先写基础的 add, minus 方法

   ```python
   def add(num: str):
       return '0' if num == '9' else str(int(num) + 1)
   
   def minus(num: str):
       return '9' if num == '0' else str(int(num) - 1)
   ```

2. 除此之外，我们还需要写一个辅助函数，计算某个状态在一次拨动以后能到达的所有下一个状态(前面分析过，这个状态有 8 个)，如`0000`可以到达的 `1000`, `0100`等。

   这个在 Python 中有很多写法，其中最容易理解的写法为：

   ```python
   # 给定一个 status, 计算出来他能拨到的所有 8 个 status
   def get_status(status: str) -> List[str]:
       # list 方便赋值
       status_list = list(status)
       res = []
       for i in range(4):
           # 存储起来，等复位
           tmp = status_list[i]
           up = add(status[i])
           status_list[i] = up
           res.append(''.join(status_list))
   
           down = minus(status[i])
           status_list[i] = down
           res.append(''.join(status_list))
   
           # 复位
           status_list[i] = tmp
           return res
   ```

   比较高级的技巧是使用 `yield ` 生成器，在此给个参考：

   ```python
   def get(status: str):
       status_list = list(status)
       for i in range(4):
           tmp = status_list[i]
           
           status_list[i] = add(tmp)
           yield ''.join(status_list)
           
           status_list[i] = minus(tmp)
           yield ''.join(status_list)
           
           status_list[i] = tmp
   ```

   

3. 套用 BFS 框架。

   根据题意，锁的初始数字为 `'0000'`，所以我们在队列中将这个元素初始化进去。

   ::: warning 关于队列初始化的基本语法技巧，需要注意

   Python 中我们一般这么初始化队列：`q = collections.deque([1])`

   ❌🚫❌ `q = collections.deque(1)` 是错误的！会报错 *TypeError: 'int' object is not iterable.*

   

   而在添加的时候，直接使用 `q.append(2)` 即可，这时候结果是 `[1,2]`；

   ❌🚫❌ 举个反例，如果觉得一次可以添加多个：`q.append([3,4])`, 就会得到这样的结果：`deque([1, 2, [3, 4]])`!

   

   一般而言，我们在求解 BFS 问题的时候，会给每个候选项加上其对应的次数，放在一个元组中，其初始化就类似于这样：`q = collections.deque([('0000', 1)])`, 这种做法与初始化一个空的队列，然后将元组 `('0000', 1)` 添加进去是相同的效果(LC111. 二叉树的最小深度 使用了这个写法)。

   :::

   结合上面的分析，我们套用 BFS 的框架可以得出求解该题目的主题框架：

   ```python
   q = collections.deque([('0000', 1)])
   visited = {'0000'}
   # 将 deadends 这个 list 添加到 visited 这个 set 中
   visited |= set(deadends)
   # 这种方法同理
   # visited.update(deadends)
   while q:
       status, step = q.popleft()
       for state in get_status(status):
           if state not in visited:
               if state == target:
                   return step
               visited.add(state)
               q.append((state, step + 1))
               return -1
   ```

   上述代码中有几个细节需要注意：

   - 初始化队列，我们初始化队列为 `('0000', 1)`，最终在找到目标后返回了 `step`；其实我们初始化为 `('0000', 0)`，在找到目标后返回 `step + 1`也是可以的。

   - ❓❓❓ 如何将一个 list 全部加入 set 中呢？有两种做法:

     1. `visited |= set(deadends)`

     2. `visited.update(deadends)`

     

4. 特殊场景考虑

   除了上述的解法之外，我们还需要考虑到几种特殊场景的用例：

   ```python
   # 处理异常场景
   if '0000' in deadends:
       return -1
   if target == '0000':
       return 0
   ```

### LC133 克隆图

[133. 克隆图](https://leetcode-cn.com/problems/clone-graph/)

> 给你无向 **[连通](https://baike.baidu.com/item/连通图/6460995?fr=aladdin)** 图中一个节点的引用，请你返回该图的 [**深拷贝**](https://baike.baidu.com/item/深拷贝/22785317?fr=aladdin)（克隆）。

初看这个题目，很难将其和 BFS 关联到，我们进行分析：

```txt
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]

输出：[[2,4],[1,3],[2,4],[1,3]]
```

我们可以看到，题目是给出了邻接表，让我们按照这个邻接表对图进行深拷贝。这个邻接表的含义是：`[2,4]` 表示第一个节点 `1`的邻居为节点 `2` 和节点 `4`（节点 index 从 1 开始），以此类推。

🎈🎈🎈 思考。

从这个题目中，我们要明白：**BFS 设立之初就是为的图的遍历**，这个题目真可谓是返璞归真。

那么，我们要怎么深拷贝这个图呢？

1. 我们解析邻接表，邻接表的两个无向边可以确定一个有向边。
2. 我们知道了邻接表，但是如果直接解析，可能会进入死循环，我们需要使用 `visited` 数组来进行标记。

如何设计算法：

1. 使用一个哈希表来记录 visited 过的节点。将 key 设置为原始图中的节点， value 设置为克隆图中对应的节点。

2. 题目中给定的节点加入队列，克隆该节点并且存储到哈希表中。

```python
class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return node

        q = collections.deque([node])
        visited = dict()
        visited[node] = Node(node.val, [])

        while q:
            head = q.popleft()
            for neighbor in head.neighbors:
                if neighbor not in visited.keys():
                    q.append(neighbor)
                    visited[neighbor] = Node(neighbor.val, [])
                visited[head].neighbors.append(visited[neighbor])
        return visited[node]
```

这个题目较为复杂，还需要多多理解！

### LC2039 网络空闲的时刻

这个题目[描述](https://leetcode-cn.com/problems/the-time-when-the-network-becomes-idle/)比较复杂，核心思路是使用 BFS 对图进行遍历，看代码：

```python
class Solution:
    def networkBecomesIdle(self, edges: List[List[int]], patience: List[int]) -> int:
        n = len(patience)
        g = collections.defaultdict(list)
        for u, v in edges:
            g[u].append(v)
            g[v].append(u)
            
        q = collections.deque([0])
        visited = [True] + [False] * (n-1)
        res = 0
        dist = 1
        while q:
            for _ in range(len(q)):
                u = q.popleft()
                for v in g[u]:
                    if visited[v]:  
                        continue
                    visited[v] = True
                    q.append(v)
                    res = max(res, (dist * 2 - 1) //
                            patience[v] * patience[v] + dist * 2 + 1)
            dist += 1
        return res
```


其对应的测试代码如下：

```python
class Test(unittest.TestCase):
    def setUp(self):
        self.s = Solution()

    def test(self):
        edges = [[0, 1], [1, 2]]
        patience = [0, 2, 1]
        res = self.s.networkBecomesIdle(edges, patience)
        print(res)

    def test2(self):
        edges = [[5, 7], [15, 18], [12, 6], [5, 1], [11, 17], [3, 9], [6, 11], [14, 7], [19, 13], [13, 3], [
            4, 12], [9, 15], [2, 10], [18, 4], [5, 14], [17, 5], [16, 2], [7, 1], [0, 16], [10, 19], [1, 8]]
        patience = [0, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1]
        res = self.s.networkBecomesIdle(edges, patience)
        self.assertEqual(67, res)
```

### LC365 水壶问题

两个水壶 x, y 和无限多的水，能否通过使用这两个水壶，得到恰好 z 容量的水？

我们把这个问题理解为一个 BFS 问题，其关键点在于：状态的转换。我们设置初始状态为 $(0, 0)$, 而经过转化后的中间状态为 $(a, b)$, 其状态上限为 $(x, y)$, 每一次递归的状态都放入 BFS 的队列中进行判断，而后向后搜索，其代码如下：

```python
class Solution:
    def canMeasureWater(self, x: int, y: int, z: int) -> bool:
        if x + y < z:
            return False

        if x > y:
            x, y = y, x

        q = collections.deque([(0, 0)])
        visited = set()
        visited.add((0, 0))

        while q:
            a, b = q.popleft()
            if a + b == z:
                return True

            states = set()

            states.add((a, 0))
            states.add((0, b))
            states.add((x, b))
            states.add((a, y))
            # y -> x
            states.add((min(x, b + a), 0 if a + b < x else b - (x - a)))
            # x -> y
            states.add((0 if a + b < y else a - (y - b), min(a + b, y)))

            for state in states:
                if state in visited:
                    continue
                visited.add(state)
                q.append(state)

        return False
```

在这个问题中，我们需要把所有的状态转化点都列举出来：

|                          动作                          | 状态                            |      |
| :----------------------------------------------------: | ------------------------------- | ---- |
|                        $(a,b)$                         | 初始状态（后面用 a,b 标识壶号） |      |
|                        $(0, b)$                        | a 壶倒空                        |      |
|                        $(a, 0)$                        | b 壶倒空                        |      |
|                        $(x, b)$                        | a 壶倒满                        |      |
|                        $(a, y)$                        | b 壶倒满                        |      |
| $(min(x, b + a), 0)$ or $(min(x, b + a), b - (x - a))$ | 将 b 壶全部倒入 a 壶            |      |
|  $(0, min(a+b, y))$ or $(a - (y - b), min(a + b, y))$  | 将 a 壶全部倒入 b 壶            |      |

我们需要重点理解一下后面两种情况：

1. *将 b 壶倒入 a 壶*：此时我们可以确定：
   1. 如果 b 壶全被倒空了。那么这时候有两种情况：第一种是把全部的 b 都倒进去了，但是没有倒满（$b + a$）；第二种情况是到进去了，此时杯子的容量不够了($x$)。
   2. 如果 b 壶没有被倒空。那么此时 b 壶中应该是有剩下的水的，什么时候会剩下呢？如果 $a + b$ 的容量小于 a 壶的容量 $x$ 时候，肯定会有部分的水剩下在了 b 壶里面。那么剩下了多少呢？我们知道 a 壶可以倒入 $x - a$ 容量的水，那么剩下的水就是 b 壶现有的水减去 a 壶可以倒入的水 $b - (x -a)$。
2. *将 a 壶倒入 b 壶*：和上面的分析同理。

### LC433 基因变化

> 给你两个基因序列 start 和 end ，以及一个基因库 bank ，请你找出并返回能够使 start 变化为 end 所需的最少变化次数。如果无法完成此基因变化，返回 -1 。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/minimum-genetic-mutation
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这个题目描述比较长，可以参考一下原题目的描述，在此归纳一下这个题目的一些重点：

1. 最终的变化序列要在基因库 bank 里面，并且每一次的变化也要在基因库 bank 里面才算是合法的变化
2. 要求解 start –> end 的最小变化

对于这道题目，我们的解法如下：

```python
class Solution:
    def minMutation(self, start: str, end: str, bank: List[str]) -> int:
        if start == end:
            return 0
        if end not in bank:
            return -1
        bank = set(bank)
        q = collections.deque([(start, 0)])
        while q:
            gen, step = q.popleft()
            for i, ch in enumerate(gen):
                for y in "ACGT":
                    if ch != y:
                        new_gen = gen[:i] + y + gen[i + 1:]
                        if new_gen in bank:
                            if new_gen == end:
                                return step + 1
                            bank.remove(new_gen)
                            q.append((new_gen, step + 1))
        return -1
```

上述代码有几个关键点我们需要注意的，现在逐一说明：

1. 题目要求是求最小变化，**为什么 BFS 求解出来的答案是最小变化**？

   对于广度优先搜索而言，我们找到的第一个叶子节点就是最短的。假设有两个同层的节点都能指向 end, 因为他们两个是同层，所以最终的结果也是一样的。

2.  有段时间没有刷 leetcode 了，犯了一些错误。

   - `gen, step = q.popleft()` 注意是 `popleft()`, 不要写成 `pop()`
   - `new_gen = gen[:i] + y + gen[i + 1:]` 这个按照 i 的思路很好，我是没有想到的，多多理解！之前我的想法是定义一个全局的 `i`, 等遍历完以后再恢复，明显是没有这种方式巧妙的。

