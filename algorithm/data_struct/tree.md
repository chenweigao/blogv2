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

### 删除二叉搜索树中的节点

#### LC450 删除二叉搜索树中的节点

这个解法一是我一年前（2021）的解法，如下所示，写的还是比较清晰的：

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def get_successor(self, root):
        """获取root的后继节点
        1. 定位到 root 右子树
        2. 寻找右子树中最靠左的节点
        """
        root = root.right
        while root.left:
            root = root.left
        return root

    def get_precursor(self, root):
        """获取root的前驱节点
        1. 定位到 root左子树
        2. 寻找左子树中最靠右的节点
        """
        root = root.left
        while root.right:
            root = root.right
        return root

    def deleteNode(self, root: TreeNode, key: int) -> TreeNode:
        if not root:
            return None

        if key == root.val:
            # 删除
            # 待删除的接地那没有子节点
            if not root.left and not root.right:
                root = None
            # 如果要删除的节点只有左节点
            elif root.left and not root.right:
                root = root.left
            # 只有右节点同理
            elif root.right and not root.left:
                root = root.right

            # 如果左右节点都有，从左子树中找到最大的节点，或者右子树中找到最小的节点来替换自己
            else:
                # 找到后继节点
                succeeded = self.get_successor(root)
                root.val = succeeded.val
                root.right = self.deleteNode(root.right, succeeded.val)

        elif root.val > key:
            # 比 key 大，找左边的
            root.left = self.deleteNode(root.left, key)
        else:
            root.right = self.deleteNode(root.right, key)

        return root
```

需要分析一下，先看如下的函数，要寻找某个节点右子树中最左边的那个节点：

```python
    def get_successor(self, root):
        """获取root的后继节点
        1. 定位到 root 右子树
        2. 寻找右子树中最靠左的节点
        """
        root = root.right
        while root.left:
            root = root.left
        return root
```

1. 定位到 root 的右子树（右节点）
2. 右子树的最坐标节点找到，找到后返回

这个思路十分巧妙，应当加以学习。

我们在主流程中（遇到 root == key, 并且左右子树都存在的情况），我们的方法是：

1. 首先找到 root 右子树的最左边的那个节点，这个节点将来就是用来替换 root 的，这么做的原因在于，替换掉以后，这个节点的左子树都比它小，右子树都比他大
2. 我们找到以后把找到的最左边节点的值赋值给 root, 然后递归调用 root 的右子树，删除找到的最左边节点这个节点。在这里为什么递归会起作用呢？这是因为我们在递归到最左边子树的时候，这时候的这个节点必然是没有左子树的，所以符合我们上面讨论的只有右边节点这个递归条件，我们就可以解决了。



来看看一年后的解法是怎么写的：

```python
class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        if not root:
            return root

        if root.val == key:
            # if not root.left and not root.right:
            #     root = None
            # elif not root.left and root.right:
            #     root = root.right
            # elif not root.right and root.left:
            #     root = root.left
            if not root.left or not root.right:
                root = root.left if root.left else root.right
            else:
                successor = root.right
                while successor.left:
                    successor = successor.left
                root.val = successor.val
                root.right = self.deleteNode(root.right, successor.val)

        elif root.val > key:
            root.left = self.deleteNode(root.left, key)
        else:
            root.right = self.deleteNode(root.right, key)

        return root
```

注意到我们简化了一长串的 `if-elif-else`, 只是做了逻辑上面的优化，令代码更加优雅。

