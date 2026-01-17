
# High-level Function

## str.maketrans()

用于创建字符映射的转换表，接收两个字符串参数，第一个参数表示需要转化的字符，第二个参数表示转换的目标。

```py
in_tab = 'aeiou'
out_tab = '12345'
tran_tab = str.maketrans(in_tab, out_tab)
# tran_tab: {97: 49, 101: 50, 105: 51, 111: 52, 117: 53}

str_test = "this is string example....wow!!!"
str_test.translate(tran_tab)
# th3s 3s str3ng 2x1mpl2....w4w!!!
```

注意到 `str.maketrans()` 可以存在第三个参数，其必须为一个字符串，比如 `string.punctuation`(表示所有的标点符号), 在指定了第三个参数以后，第三个字符串中所有的字符(对应为其 ASCII 码 `ord()`)都会在 tran_tab 字典中被映射为 `None`, 实现的作用为在 `translate()` 时可以去掉字符串中所有的标点(结果会变成 `'th3s 3s 1n 2x1mpl2w4w'`)

LeetCode 上有题目可以使用该方法求解回文子串，具体可以参考[代码](https://github.com/chenweigao/_code/blob/master/LeetCode/LC125_valid_palindrome.py)

## Python import string

```py
import string
dir(string)
```

可以查看 string 的所有参数，然后使用它：

- `string.punctuation`: 所有的标点符号...等使用方法;

- `string.ascii_letters`: 所有的大小写字母；

- `string.digits`: 所有的数字。

## count()

用于统计字符串里某个字符出现的次数 `count()` 方法，语法：

```py
str.count(sub, start=0, end=len(string))
```

- sub -- 搜索的子字符串。
- start -- 字符串开始搜索的位置。默认为第一个字符,第一个字符索引值为0。
- end -- 字符串中结束搜索的位置。字符中第一个字符的索引为 0。默认为字符串的最后一个位置。

该方法返回子字符串在字符串中出现的次数。

理解下面这行代码所实现的功能：

```py
return sum(map(S.count, J))
return not sum(map(({'R': 1, 'L': -1, 'U': 1j, 'D': -1j}).get, moves))
```

第一行代码实现了两个字符串中共同字符的计数。

第二行代码实现了一个计算坐标的方法。

## map()

`map()` 会根据提供的函数对指定序列做映射。

第一个参数 function 以参数序列中的每一个元素调用 function 函数，返回包含每次 function 函数返回值的新列表。

`map()` 函数语法：

```py
map(function, iterable, ...)
```

- function -- 函数，有两个参数

- iterable -- 一个或多个序列

e.g.1. 将一个列表中的整数转化成字符串存储如另一个列表中：

```python
newList = []
for number in oldList: 
    newList.append(str(number))
```

用 `map()` 等效于：

```python
map(str, oldList)
```

## int2list and list2int

- int2list

```py
def int2list(intNum):
    return list(map(int, str(intNum)))
```

解析：

```py
>>> str(123) --> '123'
>>> map(int, str(123)) --> <map object> # python3 以后 map 返回迭代器
>>> list(map(int, str(123))) --> [1,2,3]
```

- list2int

```py
def list2int(aList):
    return int(''.join(list(map(str, aList))))
```

## isinstance()

Python 中判断类型的方法

```py
>>> isinstance(1, int)
True

>>> isinstance([1, 2, 3], list)
True
```

## zip()

`zip(*iterators)`: returns a iterator of tuples.

当最短的迭代器遍历完成以后，停止迭代。

Example 1:

```py
str = ['hello', 'heo', 'helio']
for _ in zip(*str):
    print(list(_))

>> [('h', 'h', 'h'), ('e', 'e', 'e'), ('l', 'o', 'l')]

# zip('ABCD', 'xy') --> Ax By
```

## enumerate()

Example 2(接上 zip 的例子):

[Leetcode 14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)

```py
def longestCommonPrefix(strs):
    if not strs:
        return ""

    for i, _ in enumerate(zip(*strs)):
        if len(set(_)) > 1:
            return strs[0][:i]
    else:
        return min(strs)

test_strs = ["flower","flow","flight"]
print(longestCommonPrefix(test_strs))
```

:::tip
`enumerate()` 列举出来的下标从 0 开始，所以使用 `[:i]` 作为切片 而不是 `[:i-1]`
:::

## reduce(), lcd and gcd

`functools.reduce` 可以应用带有两个参数的函数来将一个可迭代的对象的项转化为单个的值，而干函数的两个参数是下一项和前一次应用该函数的结果。

e.g. 计算10的阶乘：

```python
import functools
product = functools.reduce(lambda x, y: x*y, range(1,11))
```

```py
>>> from functools import reduce
>>> reduce(lambda x, y: x+y, [1, 2, 3])
6
```

### gcd and lcm

- [最小公倍数](https://github.com/chenweigao/_code/blob/master/python/gcd.py)

- [最大公约数](https://github.com/chenweigao/_code/blob/master/python/lcm.py)

:::tip
最小公倍数 = 两整数的乘积 / 最大公约数

lcm(x,y) = x * y / gcd(x,y)
:::

## Bit operation

| 运算符 | 描述     |
| ------ | -------- |
| &      | 按位与   |
| \|     | 按位或   |
| ^      | 按位异或 |
| ~      | 按位取反 |
| <<     | 左移     |
| \>>    | 右移     |

`str(bin(x^y).count'1')` 计算了两个整数之间的 Hamming distance.

Questions: to think what this code did:

```python
#LC693
class Solution:
    def hasAlternatingBits(self, n):
        if not n:
            return False
        num = n ^ (n >> 1)
        return not (num & (num + 1))
```

## all()

```py
all(iterable, /)
    Return True if bool(x) is True for all values x in the iterable.
If the iterable is empty, return True.
```

This is **example 1**(LeetCode 728) about the usage:

``` python
class Solution:
    def selfDividingNumbers(self, left, right):
        """
        :type left: int
        :type right: int
        :rtype: List[int]
        """
       # return [num for num in range(left, right+1) 
   	   # if all((int(d) and not num % int(d)) for d in str(num))]
        is_self_dividing = lambda num: '0' not in str(num) 
        and all([num % int(digit) == 0 for digit in str(num)])
        x = filter(is_self_dividing, range(left, right + 1))
        return list(x)
```

该段代码使用了 `all` 的特性，并且在最后返回了一个 filter 的可迭代对象，然后转化成 list,得到结果。

**example 2** (LeetCode 766):

```python
class Solution:
    def isToeplitzMatrix(self, matrix):
        """
        :type matrix: List[List[int]]
        :rtype: bool
        """
        return all(matrix[i][j] == matrix[i+1][j+1] 
                   for i in range(len(matrix) - 1) for j in range(len(matrix[0]) -1))
```

Tips: `len(matrix)` gets the number of rows, `len(matrix[0])` gets the number of columns.

## filter()

假设你想从考试分数的一个列表中删除所有的 0 分，如下的循环可以完成这个任务：

```python
newList = []
for number in oldList:
    if number > 0 :
        newList.append(number)
```

如果使用 `filter()` 则只需要如下代码：

```python
newList = list(filter(isPositive, oldList))
```

再使用`lambda`表达式创建匿名函数：

```python
newList = list(filter(lambda number: number > 0, oldList))
```

## __name__

`__name__` 这个系统变量显示了当前模块执行过程中的名称，`__main__` 一般作为函数的入口，或者整个工程开始运行的入口。

```python
#test.py
def HaveFun():
    if __name__ == '__main__':
        print('My name is %s' % __name__)
    else:
        print('Someone else called me! my name is %s' % __name__)
HaveFun()
```

output: `My name is __mian__`

```py
#main.py
import test
test.HaveFun()
```

output:

```bash
Someone else called me! my name is test
Someone else called me! my name is test
```

## random()

```py
import random
import string
src = string.digits + string.ascii_letters
password = random.sample(src, 4)
print(''.join(password))
```

利用 `random.sample()` 生成 4 位随机密码。

## Collections

### OrderedDict

```py
from collections import OrderedDict
```

`OrderedDict` 是一个可以记录其插入次序的字典，可以结合排序，构造一个排序的字典。

> If the value of a certain key is changed, the position of the key remains unchanged in OrderedDict.
> Deleting and re-inserting the same key will push it to the back as OrderedDict however maintains the order of insertion.

- `move_to_end()`: 将该元素放置于字典的尾部

- `popitem(last=True)`: pop 元素使其成为先进先出队列

[这是一道华为的笔试题，用于处理一些文件日志功能](https://github.com/chenweigao/_code/blob/f43526c616e0d3799bbc6d1e2f703ebc2e9ad355/interview/huawei2016_2.py)

## decorators

### @property

In Python, `property()` is a built-in function that creates and returns a property object. The signature of this function is:

```py
property(fget=None, fset=None, fdel=None, doc=None)
```

where, `fget` is function to get value of the attribute, `fset` is function to set value of the attribute, `fdel` is function to delete the attribute and `doc` is a string (like a comment).

To better understand this, [see this blog](https://www.programiz.com/python-programming/property).

一般情况下，我们在定义一个类的时候可能会涉及到访问这个类中的私有元素，一般情况下我们会使用一个函数来返回它，但是 Python 中可以使用 `@property` 装饰器来优雅地实现这个功能。

```py
class ClassName(object):

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

# use the value of 'name'
c = ClassName()
c.name
# return the self._name's value
c.name = 'weigao'
# ok
```

还有一个例子可以参考这里 [Thread code](https://github.com/chenweigao/multi_thread_and_process/blob/master/threading_Thread.py)

```py
class Screen(object):
    @property
    def width(self):
        return self._width

    @width.setter
    def width(self, value):
        self._width = value

    @property
    def resolution(self):
        return self._width * 1024
```

在上述例子中，`width` 为可读写的，而 `resolution` 为只读属性。


## urllib

### Reading json file from URL

```python
from urllib import request
import json

with request.urlopen('http://118.24.241.17/path.json') as f:
    data = f.read()
    data_json = json.loads(data.decode('utf8'))
```

`data_json` is the json file we need.

## Regular Expression - re 正则表达式

[参考这篇教程：正则表达式30分钟入门教程](https://deerchao.net/tutorials/regex/regex.htm)

在 Python 中，如果想使用正则表达式：

```python
import re
re.match(r'^[1-9]\d{4,11}$', nums)

pattern = re.compile(r'some regular expression')
re.findall(pattern, sentence)
# find all matched of pattern in sentence
```

>  第三方模块 [regex](https://pypi.org/project/regex/) , 提供了与标准库 [`re`](https://docs.python.org/zh-cn/3/library/re.html#module-re) 模块兼容的 API 接口，同时，还提供了更多功能和更全面的 Unicode 支持。

```python
prog = re.compile(pattern)
result = prog.match(string)

# 等价于
result = re.match(pattern, string)
```



## requests

```py
import requests
import urllib.parse

data = {
    "name": "weigao",
    "age": 20
}

json_data = json.dumps(data)
# '{"name": "weigao", "age": 20}'

values = urllib.parse.urlencode({"data": json_data})
# 'data=%7B%22name%22%3A+%22weigao%22%2C+%22age%22%3A+20%7D'

url='http://api.weixin.oa.com/itilalarmcgi/sendmsg'

response = requests.post(url, data=values)
```


## Networks and Interprocess Communication

### Coroutines-协程

> 协程通过 `async/await` 语法进行声明，是编写异步应用的推荐方式。[官方教程](https://docs.python.org/zh-cn/3/library/asyncio-task.html)

协程有两个紧密关联的概念：

1. 协程函数：定义形式为 `asyncio def` 的函数

2. 协程对象：调用协程函数所返回的对象

在 Python 中，**单线程 + 异步 I/O** 的编程模型被称为协程，有了协程的支持，就可以基于事件驱动编写高效的多任务程序。

### asyncio

```py
import asyncio
```

- 运行一个协程使用 `asyncio.run()`, 该函数用于函数运行的入口

- 等待一个协程使用 `asyncio.sleep(1)`

- 使用协程并发处理多任务使用 `asyncio.gather()`

记住协程是 `await` 对象！[基础的用法可以参考代码](https://github.com/chenweigao/multi_thread_and_process/blob/master/asyncio_coroutines.py)
