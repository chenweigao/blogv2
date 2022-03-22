---
title: Tree
date: 2022-2-7
---

[[toc]]

## Preorder Traversal

### 多叉树的前序遍历

多叉树的前序遍历，给定多叉树，用数组表示：`root = [1,null,3,2,4,null,5,6]`, 每个层级之间用 `null` 进行隔离，根据这个输出这棵树的前序遍历结果。

题目中提到了，**递归**的方法比较简单，希望我们用**迭代**的方法进行求解。

题目链接如下：[LC589 N 叉树的前序遍历](https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/)

需要遍历的多叉树数据结构定义如下：

```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
```

#### 递归法

递归法的实现如下：

```python
class Solution:
    def preorder(self, root: 'Node') -> List[int]:
        res = []
        self.dfs(root, res)
        return res

    def dfs(self, root: 'Node', res: List[int]) -> List[int]:
        if not root:
            return None

        res.append(root.val)
        for child in root.children:
            self.dfs(child, res)
```

我们定义一个 `res` 用于存储最终结果，然后先遍历 `root`, 再遍历 `root` 所有的子节点，因为存储的时候按照从左到右的顺序存储，因此这种遍历是可以达到前序遍历的效果的。


#### 迭代法

前序遍历的迭代，要求根-左-右的顺序返回各个节点，我们给出迭代的解法如下所示：

```python
class Solution:
    def preorder(self, root: 'Node') -> List[int]:
        if root is None:
            return []
        
        stack = [root]
        res = []
        while stack:
            node = stack.pop()
            if node is not None:
                res.append(node.val)
                # 栈顶元素是左侧元素
                stack.extend(node.children[::-1])
            
        return res
```

我们仔细研究一下，这个迭代中有几个关键点：
1. 使用了**栈**
2. 把 node 的 children 逆序入栈，保证了先出栈的元素一定是最左侧的

多多理解，十分巧妙！

### 二叉树的前序遍历

#### 递归法

@todo

#### 迭代法

@todo

## Level Order Traversal

[LC102 - Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

代码实现如下：

[Code GitHub - binary_tree](https://github.com/chenweigao/_code/blob/master/python/binary_tree.py)

```py
def levelOrder(root):
    '''
    二叉树的层次遍历
    '''
    if not root:
        return []

    result = [[root.data]]  # 存储层次遍历的结果
    current = [root]  # 存储当前层次内的节点，在循环里面更新

    while True:
        node_list = []  # 临时存储节点
        for node in current:  # 循环内遍历
            if node.left:
                node_list.append(node.left)
            if node.right:
                node_list.append(node.right)
        if node_list == []:
            break
        vals = [node.data for node in node_list]  # 拿出当前层次的节点的值
        result.append(vals)
        current = node_list  # 更新层次
    return result
```

这是目前可以写出的比较高效的一个算法，应当牢记。

## Trie 前缀树

@todo 实现前缀树

https://leetcode-cn.com/problems/implement-trie-prefix-tree/solution/shi-xian-trie-qian-zhui-shu-by-leetcode-ti500/

## BST

[Advantages of BST(Binary Search Tree) over Hash Table](https://www.geeksforgeeks.org/advantages-of-bst-over-hash-table/)

- We can get all keys in sorted order by just doing Inorder Traversal of BST.
- Doing order statistics, finding closest lower and greater elements, doing range queries are easy to do with BSTs.
- BSTs are easy to implement compared to hashing, we can easily implement our own customized BST.
- ...
- Hash table supports following operations in Θ(1) time: **search insert and delete**, BST is O(logn) for these operation.

### Inorder Traveersal BST

[解法参考代码](https://github.com/chenweigao/_code/blob/master/data_struct/BST_inorder.py):

Recursive

```py
class Solution:
    def inorderTraversal(self, root):
        res = []
        self.inorder(root, res)
        return res

    def inorder(self, root, res):
        if not root:
            return
        if root.left:
            self.inorder(root.left, res)
        res.append(root.val)
        if root.right:
            self.inorder(root.right, res)
```


## 二叉树遍历例题

### LC606 根据二叉树创建字符串（前序遍历）

https://leetcode-cn.com/problems/construct-string-from-binary-tree/

题目的大概意思是，前序遍历二叉树，但是给每个子节点都用括号包裹起来，如果子节点是空的话，就不用括号。是一道简单题。

这道题目的核心难点在于，如何包裹。解法给出了一个**讨论情况然后分别处理**的方法：

1. 左右节点都没有了，返回；
2. 左节点有，右节点没有，左节点包裹后继续递归；
3. 左节点没有，右节点有，左节点用空括号（题目要求），右节点递归
4. 左右节点都有，都递归

其实现方式如下：

```python
class Solution:
    def tree2str(self, root: Optional[TreeNode]) -> str:
        if not root:
            return ''
        
        res = str(root.val)
        if not root.left and not root.right:
            return res

        left = self.tree2str(root.left)
        right = self.tree2str(root.right)

        res += '(' + left + ')'
        if right:
            res += '(' + right + ')'

        return res
```

### LC104 二叉树的最大深度

[104. 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

#### 问题分析

💓💓💓 **思考** 🧡🧡🧡

如何用 DFS 的思维来思考这个问题呢？

假设我们已经知道了左子树和右子树的最大深度 `l`, `r`, 那么整个二叉树的最大深度就是根节点的深度 1 加上左右子树中的最大深度，用公式表达是：

$$depth = max(l, r) + 1$$

所以我们可以使用深度有限搜索来计算二叉树的最大深度，具体而言就是递归计算出二叉树左子树和右子树的最大深度，然后再使用上述公式直接计算出二叉树的最大深度。

而二叉树左右子树的深度也都可以通过相同的方法递归获得，递归在访问到空节点时退出。

#### 复杂度分析

该问题使用 DFS 求解，其时间复杂度为 $O(n)$, 每个节点在递归中只被遍历一次。

其空间复杂度为 $O(height)$，与二叉树的高度有关。由于递归需要栈空间，而栈空间取决于递归的深度，因此空间复杂度等价于二叉树的高度。

#### 问题求解


这个题目存在 DFS 和 BFS 解法，下面是这个题目的 DFS 解法：

- 解法：使用辅助函数来进行递归：

  ```python
  class Solution:
      def maxDepth(self, root: TreeNode) -> int:
          if not root:
              return 0
  
          def dfs(node: TreeNode):
              if not node:
                  return 0
  
              return max(dfs(node.right), dfs(node.left)) + 1
  
          return dfs(root)
  ```

  上述做法使用了一个 `dfs()`辅助函数进行递归，我们也可以不使用辅助函数。

- 解法：直接递归：

  ```python
  class Solution:
      def maxDepth(self, root: TreeNode) -> int:
          if not root:
              return 0
          return max(self.maxDepth(root.right), self.maxDepth(root.left)) + 1
  ```

  这个不带辅助函数的解法是比带辅助函数的解法稍慢的，但是代码更加简洁。



### LC101 对称二叉树

[101. 对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/)

这是该题目的 DFS（递归）解法。

代码如下：

```python
class SolutionDFS:
    def isSymmetric(self, root: TreeNode) -> bool:
        # 反例 [1]
        if not root.right and not root.left:
            return True

        # if not root.left or not root.right:
        #     return False

        def dfs(left, right):
            # 递归终止条件，两个节点都为空
            if not left and not right:
                return True

            if not left or not right:
                return False

            if left.val != right.val:
                return False

            return dfs(left.left, right.right) and dfs(left.right, right.left)

        return dfs(root.left, root.right)
```

从代码中我们可以看出，我们定义递归终止条件：

1. 两个节点都为空，返回 True, 递归终止
2. 两个节点中有一个不存在，不对称，返回 False
3. 两个节点的值不相等，返回 False

在这些条件满足以后，我们对 `left.left` 和 `right.right`等分别递归即可求出结果。
