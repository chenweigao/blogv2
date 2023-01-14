---
title: Pandas
date: 2022-09-28
category:
  - Python



---



本文主要研究 pandas, 主要是一些常见的用法和笔记。

<!-- more -->

## DataFrame

DataFrame 是 pandas 中常用的数据结构，掌握其用法对整体 pandas 使用的理解十分重要。

### read_csv()

💚💚💚 不只是可以读 csv 哦。

在实际场景中，笔者存在一个需要读取大的 txt 文件的操作，使用 `read_csv()` 接口可以实现这个功能，在项目中的示例代码如下所示：

```python
import pandas as pd

def get_all_pattern_pandas(self, file=None):
    df = pd.read_csv(file, header=None, sep='\t')
    all_lines = df.itertuples()
    for rows in more_itertools.grouper(all_lines, self.pattern_len, incomplete='ignore'):
        pass
```

上述代码中有些细节需要注意：

1.  `pd.read_csv()` 返回了 df 对象；我们传入了 `header=None` 可以使得不产生制表的 header, 而 `sep='\t'` 就是分割 txt 文件常用的分割符
2.  `df.itertuples()` 可以产生 df 的迭代器对象，是比较快速的迭代方法
3.  `more_itertools.grouper()` 是滑动窗口的接口，可以参考 *\<Itertools\>* 那篇文章

## Example

### 获取某列的数据

我们有时候可能只需要获取某一列的数据，其用法如下：

```python
df = pd.read_csv(self.s.application_log_file, sep=' ', usecols=[16])
print(df.value_counts().sort_values(ascending=False))
df.value_counts().sort_values(ascending=False).to_frame().to_html('tiktok.html')
```

在例子中，我们使用空格进行分割，然后拿到第 16 列的数据；注意经过测试，这个数组是不能指定 -1 等值的，只能从前往后开始数。
