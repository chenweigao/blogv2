---
title: Tree
Date: 2022-2-7
---

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

1. 递归法

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

2. 迭代法

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

递归法:

@todo

迭代法:

@todo

## Level Order Traversal

### 二叉树的层次遍历


## Inorder Traversal



## Trie 前缀树

@todo 实现前缀树

<https://leetcode-cn.com/problems/implement-trie-prefix-tree/solution/shi-xian-trie-qian-zhui-shu-by-leetcode-ti500/>

## BST

[Advantages of BST(Binary Search Tree) over Hash Table](https://www.geeksforgeeks.org/advantages-of-bst-over-hash-table/)

- We can get all keys in sorted order by just doing Inorder Traversal of BST.
- Doing order statistics, finding closest lower and greater elements, doing range queries are easy to do with BSTs.
- BSTs are easy to implement compared to hashing, we can easily implement our own customized BST.
- ...
- Hash table supports following operations in Θ(1) time: **search insert and delete**, BST is O(logn) for these operation.

### BST 中序遍历

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

#### LC653 两数之和 IV - 输入 BST

> 给定一个二叉搜索树 root 和一个目标结果 k，如果 BST 中存在两个元素且它们的和等于给定的目标结果，则返回 true。

这个题目需要用到二叉搜索树和两数之和解法的一些特性：

1. 二叉搜索树中序遍历出的结果是有序的（左根右）
2. 两数之和问题可以使用双指针来求解，或者使用 hash map

##### 解法1：DFS + hash map

这个解法的核心思路就是，把这个 BST 当作普通的二叉树处理，然后使用 hash map 记录元素出现的个数，比较直观的解法，其实现代码如下：

```python
class Solution:
    def __init__(self):
        self.dic = collections.defaultdict(int)

    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        if not root:
            return False

        if k - root.val in self.dic.keys():
            return True

        self.dic[root.val] += 1
        return self.findTarget(root.left, k) or self.findTarget(root.right, k)
```

##### 解法2：中序遍历 + 双指针

由于我们知道 BST 的中序遍历出来的结果是升序的，所以说我们可以把中序遍历的结果保存起来，然后用双指针去找，看有没有结果。

在此复习一下二叉树的中序遍历，中序遍历的解法可以看上文总结。

```python
class Solution:
    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        # 中序遍历 BST
        res = []

        def dfs(root: Optional[TreeNode]):
            if not root:
                return
            dfs(root.left)
            res.append(root.val)
            dfs(root.right)

        dfs(root, res)
        # 此时 res 已经是升序了，我们使用双指针
        l, r = 0, len(res) - 1
        # 这边 while l < r 也可以
        while l != r:
            if res[l] + res[r] == k:
                return True
            elif res[l] + res[r] > k:
                r -= 1
            else:
                l += 1

        return False
```


##### 解法3：迭代 + 双指针

这个解法不再需要额外的空间消耗，比较不错。

@todo








