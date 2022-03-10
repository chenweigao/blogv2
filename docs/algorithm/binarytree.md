---
title: Binary Tree
date: 2022-2-7
---

[[toc]]

## Traversal

### Preorder Traversal

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


### Level Order Traversal

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
