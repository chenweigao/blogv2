# Sort

[GitHub Sort code](https://github.com/chenweigao/_code/tree/master/sort)

## Abstract

### Base Sort Function Py

在 Python 中，按照优先级进行排序可以使用 `lis.sort(lombda x: (x[1], x[0]))` 这样的方式。

举例来说，对于要排序的数组：`[(2, 0), (3, 1), (3, 2), (4, 3), (3, 4)]`, 我们对其进行排序：

```python
res.sort(key=lambda x: (-x[0], x[1]))
# [(4, 3), (3, 1), (3, 2), (3, 4), (2, 0)]

# example 2
# before [(3, 0), (3, 1), (3, 2), (3, 3), (3, 4)]
# after  [(3, 0), (3, 1), (3, 2), (3, 3), (3, 4)]
```

此时达到的效果是，**第一个元素降序，第二个元素升序**。

```python
res.sort(key=lambda x: (x[0], x[1]))
# [(2, 0), (3, 1), (3, 2), (3, 4), (4, 3)]
```

此时达到的效果是，**第一个元素升序，第二个元素升序**。这个也是默认的情况。

剩下的可以直接研究，总结来说：`sort` 默认的是升序。

### cmp_to_key

:::tip Python 自定义排序函数

值得一提的是，上述代码我们实现了一个自定义的比较函数，在 python 中自定义比较函数，首先需要对其进行定义，而后使用 `key=cmp_to_key(compare)` 来进行自定义比较，其中 `cmp_to_key` 需要导入：

```python
from functools import cmp_to_key
```
:::

对于这个比较函数，还可以再研究一下：

```python
def compare_test(self, nums: List[int]) -> List[int]:
    def compare(x: int, y: int):
        return x - y

    nums = sorted(nums, key=cmp_to_key(compare))
    return nums
```

测试结果如下：

```python
def test01(self):
    nums = [3, 30, 34, 5, 9]
    res = self.s.compare_test(nums)
    self.assertEqual(sorted(nums), res)
    print(res) # [3, 5, 9, 30, 34]
```

可以看到 `x - y` 比较的结果是使得其升序排列了。

## Sort

### Insertion Sort

直接使用 bisect 模块，可以直接插入某个元素，返回排序好的元素：

```py
import bisect
nums = [1, 3, 4]
bisect.insort(nums, 2)
print(nums)  # [1, 2, 3, 4]
```

### Merge Sort

$T(n) = O(nlog_{2}n)$

another example:

- Counting Inversions

- Matrix Multiplication:
  - Brute Force(暴力):  $O(n^3)$ arithmetic operations

### Quick Sort

- Worst-case running time $O(n^2)​$ :
  - input sorted or reverse sorted, partition around min or max element.
  - one side of partition has no elements.
  - $T(n) = T(0) + T(n–1) + cn$
- Expected running time $O(nlgn)$
  - If we are really lucky, partition splits the array evenly $\frac{2}{n}$ : $T(n)=2T(n/2)+Θ(n)=Θ(nlgn)$

```py
def qsort(arr):
    if not arr:
        return []
    else:
        pivot = arr[0]
        l = [_ for _ in arr if _ < pivot]
        r = [_ for _ in arr[1:] if _ >= pivot]
        return qsort(l) + [pivot] + qsort(r)
```

### Selection Sort

```py
def selection_sort(arr):
​    for i in range(len(arr)):
​        minimum = i
​        for j in range(i+1, len(arr)):
​            if arr[j] < arr[minimum]:
​                minimum = j
​        arr[minimum], arr[i] = arr[i], arr[minimum]
​    return arr
```

## Sort Template

C++ 使用模板降序排列：

```cpp
struct greater
{
    template<class T>
    bool operator()(T const &a, T const &b) const { return a > b; }
};
std::sort(numbers.begin(), numbers.end(), greater());
```

### Swap

1. 基本实现：

    ```cpp
    //引用实现
    swap(int &x, int &y){
    ​    int temp;
    ​    temp = x;
    ​    x= y;
    ​    y =x;
    }
    swap(x, y);

    //指针实现
    swap(int *x, int *y){
    ​       int temp;
    ​       temp = *x;
    ​       *x = *y;
    ​       *y = temp;
    }
    swap(&x, &y);
    ```

2. 异或实现：

    ```cpp
    void swap(int &x, int &y){
    ​    x ^= y;
    ​    y ^= x;
    ​    x ^= y;
    }
    swap(x, y);

    void swap(int *x, int *y){
    ​    *x ^= *y;
    ​    *y ^= *x;
    ​    *x ^= *y;
    }
    swap(&x, &y);
    ```

3. 加减操作：

    ```cpp
    void swap(int &x, int &y){
    ​    x = x + y;
    ​    y = x - y;
    ​    x = x - y;
    }
    swap(x, y);

    void swap(int *x, int *y){
    ​    *x = *x + *y;
    ​    *y = *x - *y;
    ​    *x = *x - *y;
    }
    swap(&x, &y);
    ```

4. 宏定义：

   ```cpp
   #define swap(x, y) { x ^= y; y ^= x; x ^= y; }
   #define swap(x, y) { x = x + y; y = x - y; x = x - y; }
   swap(x, y);
   ```

## Problems

### LC179 最大数

> Given a list of non negative integers, arrange them such that they form the largest number.
> 
> 给定一组非负整数 nums，重新排列每个数的顺序（每个数不可拆分）使之组成一个最大的整数。
> 
> Input: [10,2]
>
> Output: "210"

<https://leetcode-cn.com/problems/largest-number/>

对于这个题目，本质上是一个排序问题，要是不使用自带的排序方法，可以使用冒泡排序的方法。

10 和 2 的大小关系（或者说前后顺序），可以根据 10 + 2 = 102 和 2 + 10 = 210 的大小来判断。

#### 冒泡排序 C

这是百度百科冒泡排序算法的参考：

```c
void bubbleSort(elemType arr[], int len)
{
    elemType temp;
    int i, j;
    for (i = 0; i < len - 1; i++)
        for (j = 0; j < len - 1 - i; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
}
```

#### 一刷

该题目的解法如下：

```python
def largestNumber(self, nums: List[int]) -> str:
    for i in range(len(nums) - 1):
        for j in range(len(nums) - i - 1):
            if int(str(nums[j]) + str(nums[j + 1])) < int(str(nums[j + 1]) + str(nums[j])):
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
    if set(nums) == {0}:
        return '0'
    res = ''.join([str(_) for _ in nums])
    i = 0
    while i < len(res) and res[i] == '0':
        i += 1
        res = res[1:]
    return res
```

附上 leetcode 大神的解法：

```python
class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        nums = list(map(str, nums))
        max_len = max(map(len, nums))
        nums.sort(key=lambda x: x*(max_len // len(x) + 1), reverse=True)
        return ''.join(nums) if nums[0] != '0' else '0'
```

主要到 lambda 表达式中出现了一个 `+1`, 是因为有时候会遇到奇数的情况，比如说：[121, 12] 这种情况，会得出商为 1, 从而产生错误的结果。

#### 二刷

二刷于 2022年4月18日。

我们需要对这个题目进行更加深入的理解，举例来说：

- `[4,42]`: 需要比较 442 和 424, 所以我们需要把 4 放在 42 的前面拼接成最大值 442, 此时我们可以知道，如果对 4 和 42 进行排序的话，那么必须满足：

    $$ 4 > 42 $$

    在这个例子中，442 - 424 > 0

- `[4,45]`: 需要比较 445 和 454, 我们需要把 45 放在 4 的前面拼接成最大值 454.

    在这个例子中，445 - 454 < 0

所以说，我们定义一个比较函数，这个比较函数实现上述比较关系的结果：

```python
def compare(x, y): 
    return int(y+x) - int(x+y)
```

如何理解这个比较函数呢？我们举例，如果要降序排列的话，对应的比较函数如下：

```python
def compare(x, y):
    return y - x
```

最终的实现如下：

```python
from functools import cmp_to_key
from typing import List


class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        def compare(x: str, y: str):
            return int(y + x) - int(x + y)

        nums = sorted(map(str, nums), key=cmp_to_key(compare))
        return '0' if nums[0] == '0' else ''.join(nums)
```

