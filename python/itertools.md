---
title: Itertools
date: 2022-09-27
category:
  - Python

---



本文主要研究 python 中的 itertools 模块，包括对 `more-itertools` 的研究工作：

- sliding_window, 滑动窗口的实现

<!-- more -->

主要参考文档为 python 官方文档[^1] 和官方 API 文档[^2]。


## more-itertools

`itertools` 除了几个默认的迭代方法之外，还可以使用更多的迭代器 `more-itertools`, 下面会列举出来源码，可以直接使用源码，也可以使用包来引入。

安装包的命令如下：

```bash
pip install more-itertools
```

## sliding_window

### stride 1 sliding

代码实现如下：

```python
def sliding_window(iterable, n):
    # sliding_window('ABCDEFG', 4) -> ABCD BCDE CDEF DEFG
    it = iter(iterable)
    window = collections.deque(islice(it, n), maxlen=n)
    if len(window) == n:
        yield tuple(window)
    for x in it:
        window.append(x)
        yield tuple(window)
```

### grouper: sliding non-overlapping

我们也可以使用固定长度的不 overlap 的方式来进行滑动：

```python
def grouper(iterable, n, *, incomplete='fill', fillvalue=None):
    "Collect data into non-overlapping fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3, fillvalue='x') --> ABC DEF Gxx
    # grouper('ABCDEFG', 3, incomplete='strict') --> ABC DEF ValueError
    # grouper('ABCDEFG', 3, incomplete='ignore') --> ABC DEF
    args = [iter(iterable)] * n
    if incomplete == 'fill':
        return zip_longest(*args, fillvalue=fillvalue)
    if incomplete == 'strict':
        return zip(*args, strict=True)
    if incomplete == 'ignore':
        return zip(*args)
    else:
        raise ValueError('Expected fill, strict, or ignore')
```

### example

因为是 API 所以我们可以直接调用，在实战中的演示如下：

```python
def get_all_pattern_pandas(self, file=None):
    pattern_list = []
    visited = list()
    df = pandas.read_csv(file, header=None, sep='\t')
    all_lines = df.itertuples()
    for rows in more_itertools.grouper(all_lines, self.pattern_len, incomplete='ignore'):
        opcode_list = [get_opcode_from_row(row) for row in rows]
        yield opcode_list
```



## nth

这个接口可以返回 iterable 中的 第 n 个元素：

```python
def nth(iterable, n, default=None):
    "Returns the nth item or a default value"
    return next(islice(iterable, n, None), default)
```



## product

返回排列组合：

```python
def product(*args, repeat=1):
    # product('ABCD', 'xy') --> Ax Ay Bx By Cx Cy Dx Dy
    # product(range(2), repeat=3) --> 000 001 010 011 100 101 110 111
    pools = [tuple(pool) for pool in args] * repeat
    result = [[]]
    for pool in pools:
        result = [x+[y] for x in result for y in pool]
    for prod in result:
        yield tuple(prod)
```





[^1]: [docs.python.org](https://docs.python.org/3/library/itertools.html)
[^2]: [more-itertools](https://more-itertools.readthedocs.io/en/stable/api.html)
