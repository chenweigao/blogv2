# Effective Python

## Function Closure

([EP 15](https://github.com/chenweigao/_code/blob/master/Effective_Python/EP15.py))有的时候需要将重要的消息或者意外的事件优先显示在其他内容前面，可以使用以下代码：

```python
def sort_priority(values, group):
    found = False

    def helper(x):
        nonlocal found
        if x in group:
            found = True
            return (0, x)
        return (1, x)
    values.sort(key=helper)
    return found
```

上述代码把 `helper()` 这个闭包函数，传给 `sort` 方法的 `key` 参数。

**思考**：第 7 行和第 8 行的 return 的含义？

## Generator

([EP 16](https://github.com/chenweigao/_code/blob/master/Effective_Python/EP16.py))生成器是使用 `yield` 表达式的函数，为了提高编程效率，考虑用**生成器来改写直接返回列表的函数**。调用生成器时，会返回迭代器。

在这个例子中的错误示例中，使用 `append` 把所有的结果都放在列表里面，如果输入量非常大的话，会导致程序消耗尽内存而奔溃。