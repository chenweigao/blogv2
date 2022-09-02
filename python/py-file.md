# Python File

## Abstract

本文主要研究 Python 文件操作。

::: tip 打开大文件

很多时候，自带的工具打开大文件是很慢的，我们可以使用 `EmEditor` 工具，免费版还是很好用的。

:::

## linecache

[linecache](https://docs.python.org/3/library/linecache.html#module-linecache) 是 Python 3.10 自带的文件处理模块。

### geline

linecache 可以用来指定行号，然后读取这一行的元素。

```python
>>> import linecache
>>> linecache.getline(linecache.__file__, 8)
'import sys\n'
```

这个函数会返回文件对应的这行结果，举例来说：

```python
def get_line_content_by_line_num(self, line_num=None):
    if not line_num and self._line_num == -1:
        print('give a line num!')
        return

    if not line_num:
        line_num = self._line_num
        content = linecache.getline(self.file, line_num)
        return content
```

对应的测试用例和输出：

```python
def test01(self):
    line_num = 7187
    res = self.s.get_line_content_by_line_num(line_num)
    print(res)
    
# [TID 003c7e] I/ecmascript: 0000541c:aa1003f5 	mov	x21, x16
```

需要注意的一个小细节是，`getline()`函数，而不是 `getlines()`, 这两个的功能是不一样的。

### getlines

`getlines()` 可以用来获取这个文件的所有行，我们也可以根据这个函数来获取范围行的元素，如下所示：

```py
with open(self.file, 'r') as f:
    for i, line in enumerate(f):
        file_lines = linecache.getlines(self.file)[i:i + n]
```

### mutil lines

```python
with open(self.file, 'r') as f:
    for idx, line in enumerate(f, 1):
        ops = []
        for j in range(n):
            next_line = linecache.getline(f.name, idx + j)
            if next_line.strip():
                ops.append(next_line.split()[1])
```

 目前得到文件中的连续行用该方法比较不错。

## line after match xx

代码找到匹配行开始往下数的第 xx 行，例子为第 4 行。

find the header then just take the next xx lines:

### No.1

```python
from itertools import islice

with open("words.txt") as f:
    for line in f:
        if line.rstrip() == "Heading":
            print(list(islice(f, 4))[-1])
            break
line to be extracted
```

需要注意，这种方法可能会使得迭代以外终止，所以不是很好用，等以后加深理解了再研究吧！

### No.2

```py
from linecache import getline
with open("words.txt") as f:
    for ind, line in enumerate(f,1):
        if line.rstrip() == "Heading":
            print(getline(f.name, ind + 4))
            break
line to be extracted
```

### No.3

mutils lines, don't break.

```py
from linecache import getline
with open("words.txt") as f:
    for ind, line in enumerate(f,1):
        if line.rstrip() == "Heading":
            print(getline(f.name, ind + 4))

line to be extracted

other line to be extracted
```



:::tip line 的编号从 1 开始

我们在 python 的文件处理中，很多时候行号都是从 0 开始的，上面代码中使用了 `enumerate(f,1)` 来方便了我们的操作，值得借鉴！

:::



## Q&A

1. `a` 是可访问可修改的吗？
   不是。`a`表示在文件后追加写，append。`a+` 既可以追加到文件中，也可以读取文件中的内容，而 `a` 是不可以读操作的。

## File Rights

| 模式 | 操作              | 文件不存在 | 是否覆盖 |
| ---- | ----------------- | ---------- | -------- |
| r    | read 只读         | 报错       | -        |
| w    | write 可写        | 创建       | 是       |
| a    | append 文件后追加 | 创建       | 否 追加  |
| r+   | 可读 可写         | 报错       | 是       |
| w+   | 可读 可写         | 创建       | 是       |
| a+   | 可读 可写         | 创建       | 否 追加  |

### BCD `fopen()` 手册

> The argument mode points to a string beginning with one of the following sequences (Additional characters may follow these sequences.):

- `r`   Open text file for **reading**.  The stream is positioned at the **beginning** of the file.

- `r+`  Open for **reading and writing**.  The stream is positioned at the **beginning** of the file.

- `w`   Truncate file to **zero length** or create text file for **writing**. The stream is positioned at the **beginning** of the file.

- `w+`  Open for **reading and writing**.  The file is created if it does not exist, otherwise it is **truncated**.  The stream is positioned at the **beginning** of the file.

- `a` Open for **writing**.  The file is created if it does not exist.  The stream is positioned at the **end** of the file.  Subsequent writes to the file will always end up at the then current end of file, irrespective of any intervening fseek(3) or similar.

- `a+`  Open for **reading and writing**.  The file is created if it does not exist.  The stream is positioned at the **end** of the file.  Subsequent writes to the file will always end up at the then current end of file, irrespective of any intervening fseek(3) or similar.
