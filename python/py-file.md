# Python File

## linecache

[`linecache`](https://docs.python.org/3/library/linecache.html#module-linecache) 是 Python 3.10 自带的文件处理模块。

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
