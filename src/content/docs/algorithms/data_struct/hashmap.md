---
title: HashMap
date: 2022-02-07
---

## HashMap

### HashMap in Python - Counter

```py
from collections import Counter
```

在腾讯面试的过程中，被问到了一个题目，要求找出一个数组中第一个单独出现的数字，例如 [2, 4, 2, 3, 1, 3], 则结果应该是 4.

题目如果用 hashmap 去求解的话只需要：

```py

from collections import Counter
nums = [2, 4, 2, 3, 1, 3]

nums_counter = Counter(nums)

res = min(nums_counter, key = nums_counter.get)

```

`Counter` 为 Python 内置的 hashmap, 具体可以查询 [Counter](https://docs.python.org/3/library/collections.html#collections.Counter), 对于那个排序而言，`key` 会指定一个函数用于元素的比较，`nums_counter.get()` 方法用于得到某个 key 的 value 值。

### unordered_map

- What is difference between `map` and `unordered_map`?

    [Stack overflow](https://stackoverflow.com/questions/2196995/is-there-any-advantage-of-using-map-over-unordered-map-in-case-of-trivial-keys)

    [Map vs unordered_map](https://www.geeksforgeeks.org/map-vs-unordered_map-c/)

Conclusion: `unordered_map` is generally use more memory, better for **lookup-retrieval**, much slower at repeatedly inserting and removing elements.

Code example for `map` usage: [GitHub](https://github.com/chenweigao/_code/blob/master/cpp/unordered_map.cpp): 如何遍历、赋值。

关联容器 `unordered_map` 的初始化：

```cpp
unordered_map<char, int> roman = {
    {'I', 1},
    {'V', 5}
};
```

也可以利用 for 循环赋值初始化，具体参照上述 GitHub 示例。

:::tip 拓展
Python map 的初始化比较简单：

```py
mapping = {
    "]":"[",
    "}":"{"
}
```

注意加以区别！
:::

### map

Example: [单词计数器](https://github.com/chenweigao/_code/blob/master/cpp/map_word_count.cpp)

Using map's includes:

```cpp
#include <map>
#include <string>
using Map = std::map<std::string, std::size_t>;

Map my_map;
````

```cpp
auto count()
{
    Map counts;
    for (string w; cin >> w; ++counts[w])
        ;
    return counts;
}
```

Print this map's key and value:

```cpp
for(auto &kv : my_map)
    std::cout << kv.first << : << kv.second << std::endl;
    // words : counts
```
