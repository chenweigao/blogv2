---
title: Binary Tree
date: 2022-2-7
---

[[toc]]

## Traversal

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
