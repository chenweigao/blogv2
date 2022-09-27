---
title: Itertools
Date: 2022-09-27
category:
  - Python
---



本文主要研究 python 中的 itertools 模块，主要参考文档为 python 官方文档[^1] 和官方 API 文档[^2]。

<!-- more -->


## more-itertools

`itertools` 除了几个默认的迭代方法之外，还可以使用更多的迭代器 `more-itertools`, 下面会列举出来源码，可以直接使用源码，也可以使用包来引入。

安装包的命令如下：

```bash
pip install more-itertools
```

### sliding_window

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



## Reference



[^1]: https://docs.python.org/3/library/itertools.html
[^2]: [more-itertools](https://more-itertools.readthedocs.io/en/stable/api.html)
