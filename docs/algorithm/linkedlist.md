---
title: Linked List
date: 2022-2-7
---

## Linked List

### Reverse Linked List

- Iterative method

```py
def reverseList(self, head):

    preNode = None
    curNode = head

    while curNode is not None:
        next = curNode.next
        curNode.next = preNode
        preNode = curNode
        curNode = next

    return preNode
```

- Recursive method

 1) Divide the list in two parts - first node and rest of the linked list.
 2) Call reverse for the rest of the linked list.
 3) Link rest to first.
 4) Fix head pointer

由于迭代较快，故建议经常使用迭代法。

### Intersection of Linked List

判断两个链表是否有交叉(Intersection), LC160.

实现思路有：

- 根据链表是否有环判断

先遍历一个链表找到其尾部，然后将尾部的 next 指针指向另一个链表，这样子两个链表就合成了一个链表，判断原来的两个链表是否有交叉也就变成了判断一个**单链表是否有环**。

找出交点的方法是，遍历两个链表，长度较长的链表指针向后移动 |len1 - len2| 个单位，然后开始遍历两个链表，判断节点是否相等（节点的地址）。

- 根据总结的规律判断

该方法比较巧妙，代码如下：

```py
def getIntersectionNode(self, headA, headB):
    if headA is None or headB is None:
        return None

    pa = headA
    pb = headB

    while pa is not pb:
        pa = headB if pa is None else pa.next
        pb = headA if pb is None else pb.next

    return pa
```

核心思路在于，同时遍历两个链表，如果到链表结束，则将指针指向另一个链表，遍历直到两个移动的指针相等。

:::tip 判断单链表是否有环

一般判断单链表是否有环的方法是设置一块一慢两个指针，看其是否会相等。

:::

## Implement LRU

LRU 为最近最少使用算法，常常用于缓存技术中，其实现方式为**循环双向链表**，实现思想为：

将 chche 的所有位置都用双向链表链接起来，当一个位置被命中以后，将该位置指向链表头的位置，新加入的 chche 直接加到链表头中。

这样，在多次进行 cache 操作后，最近被命中的，就会被向链表头方向移动，而没被命中的向链表后面移动。

缓存已满的时候新加入的数据节点插入链表头部，而删除链表的尾节点。

具体的实现代码可以[参考 GitHub](https://github.com/chenweigao/_code/blob/30551f4e92dab06e127be316cd2f3950eda099ef/LeetCode/LC146_LRU_cache_double_linked_list.py)

```py
class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        seld.dic = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
```

思路是初始化一个 `dict` 用于存储，对双向链表进行操作的同时对这个 `dict` 进行赋值操作，`dict` 的结构为：

- key: LRUCache 中的 key

- value: 一个 `Node` 类型的节点，存储其 `prev` 和 `next` 信息以及最关键的 `value`

其 `put()` 方法为：

```py
def put(self, key: int, value: int) -> None:
    if key in self.dic:
        self._remove(dic[key])
    n = Node(key, value)
    self._add(n)
    self.dic[key] = n
    if len(self.dic) > self.capacity:
        first_node = self.head.next
        self._remove(first_node)
        del self.dic[first_node.key]
```

然后使用双向链表的操作进行插入（尾插）和删除（第一个节点）

也可以使用 Python 中的 `collection.OrderedDict` 来进行存储，使用其 `move_to_end()` 和 `popitem()` 方法，具体代码可以[参考这里](https://github.com/chenweigao/_code/blob/30551f4e92dab06e127be316cd2f3950eda099ef/LeetCode/LC146_LRU_ordereddic.py)
