# Python Data Struct


## Slicing

```py
>>> s = 'bicycle'
>>> s[3:]
'ycle'
>>> s[:3]
'bic'
>>> s[::3]
'bye'
>>> s[::-1]
'elcycib'
```

If you want to *reverse a string*, the last example is a choice.

- assigning to slices

```python
>>> l = list(range(10))
>>> l
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> l[2:5]
[2, 3, 4]
>>> l[2:5] = [20,30]
>>> l
[0, 1, 20, 30, 5, 6, 7, 8, 9]
```

what you can see is that **[2,3,4]** is replaced by **[20,30]**

## List

- list of list

  ```python
  >>> board = [['_'] * 3 for i in range(3)]
  >>> board
  [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']]
  >>> board[1][2] = 'x'
  >>> board
  [['_', '_', '_'], ['_', '_', 'x'], ['_', '_', '_']]
  ```

  The first line is the right way to multiply it,rather than:

  ```python
  >>> wrong_board = [['_'] * 3] * 3
  >>> wrong_board[1][2] = 0
  >>> wrong_board
  [['_', '_', 0], ['_', '_', 0], ['_', '_', 0]]
  ```

- `list.sort()` & `sorted(list)`

  The `list.sort()` method sorts a list in-place, that is, without making a copy.

  In contrast, the built-in function `sorted(list)` creates a new list and returns it.

- 找到列表中每一行的最大元素和每一列的最大元素

```python
        row = len(heights)
        col = len(heights[0])
      
        max_row = [0] * row
        max_col = [0] * col

        for i in range(row):
            max_row[i] = max(heights[i])

        for j in range(col):
            for i in range(row):
                max_col[j] = max(heights[i][j], max_col[j])
```

## sort and sorted

:::tip skill
在对 list 排序时， 可以使用 `sorted()` 或者 `sort()` + `deepcopy()` 两种方式

[example code](/algorithm/python/)
:::

1. sorted()

    descending order (降序)

    ```py
    def max_n(lst, n=1, reverse=True):
        return sorted(lst, reverse=reverse)[:n]
    ```

2. sort() + deepcopy()

    ascending order (升序)

    ```py
    from copy import deepcopy
    
    def min_n(lst, n=1):
        numbers = deepcopy(lst)
        numbers.sort()
        return numbers[:n]
    ```

- make list a stack or queue

  The .append and .pop methods make a list usable as a stack or a queue (if you use .append and .pop(0), you get LIFO, Last in First out, behavior).
  
  But inserting and removing from the left of a list (the 0-index end) is costly because the entire list must be shifted.

- deques and queues

  ```python
  from collections import deque
  dq = deque(range(10), maxlen=10)
  # dq: deque([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], maxlen=10)
  dq.rotate(3)
  # [7, 8, 9, 0, 1, 2, 3, 4, 5, 6]
  # this function rotates items from the right end
  # and when dp.rotate(-3) is from the left
  dq.appendleft(-1)
  # [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  dq.extend([11, 22, 33])
  # [3, 4, 5, 6, 7, 8, 9, 11, 22, 33]
  # default is insert from right
  ```

  What is different between `append()` and `extend()`? here is an example:

  ```python
  >>> dp
  # deque([10, 30, 20, 10, 3, 4, 5, 6, 7, 8], maxlen=10)
  
  >>> dp.appendleft([1, 2])
  # deque([[1, 2], 10, 30, 20, 10, 3, 4, 5, 6, 7], maxlen=10)
  
  >>> dp.extendleft([1, 2])
  # deque([2, 1, [1, 2], 10, 30, 20, 10, 3, 4, 5], maxlen=10)
  ```

  Note that `extendleft(iter)` works by appending each successive item of the iter argument to the left of the deque, therefore the final position of the items is reversed.

## Bisect

`#bisect: [baɪ'sɛkt]`

> Bisection is the general activity of dividing a geometric figure into two equal parts

## Set

Python 的集合是一个十分方便的对于元素可以操作的序列，除了去掉重复元素外，还可以进行稽核之间的运算。

```python
student = {'Tom', 'Jim', 'Mary', 'Tom', 'Jack', 'Rose'}
print(student)   # 输出集合，重复的元素被自动去掉

a = set('abracadabra')
b = set('alacazam')

print(a - b)     # a 和 b 的差集

print(a | b)     # a 和 b 的并集

print(a & b)     # a 和 b 的交集

print(a ^ b)     # a 和 b 中不同时存在的元素
```

set 的集合运算十分有用，看下面的代码：

``` python
class Solution:
    def findWords(self, words):
        """
        :type words: List[str]
        :rtype: List[str]
        """
        a = set('qwertyuiop')
        b = set('asdfghjkl')
        c = set('zxcvbnm')
        ans = []
        for word in words:
            w = set(word.lower())
            if (w & a == w) or (w & b == w) or (w & c == w):
                ans.append(word)
        return ans
```

上述代码实现了一个求解某序列是否在键盘的同一行的操作，通过求交集看是否结果等于自身就可以很方便地求解出结果。

### set usage

1. 使用 set 一般用于 **判断一个值是否存在其中**
2. when to keep elements sorted and unique.

Example: 忽略常见单词，只对不在集合中的单词统计出现次数：

```cpp
set<string> exclude = {"some", "words"};
//code
if(exclude.find(word) == exclude.end()) {
    //code
}
```

对比如果使用 vector 实现：

```cpp
vector<string> exclude = {"some", "words"};
//code
auto is_exclude = std::binary_search(exclude.cbegin(), exclude.cend(), word);
//bool binary_search()
auto reply = is_exclude ? "excluded" : "not excluded";
```
