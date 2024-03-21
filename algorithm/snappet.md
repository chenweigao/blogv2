---
title:  Code Snappet
date: 2024-03-21
tag:
 - algorithm
 - other
category:
 - Algorithm
---

## Binary Search Example


下述代码是为了将相邻的 PC 进行合并，并产生新的 PC 和计数，比如说：


![image](https://github.com/chenweigao/blogv2/assets/19328388/987b78f2-891d-46d6-8cc0-be3003447383)

有一系列的 PC 列表，此时我们需要将连续的 PC 合并到一起，它们后面的技术也增加到合并的结果中。

```python
def merge_continuous_addresses(address_list, count_list):
    result = {}

    i = 0
    while i < len(address_list):
        address = address_list[i]
        count = count_list[i]

        j = i + 1
        current_sum = count

        while j < len(address_list) and int(address_list[j], 16) == int(address, 16) + 4 * (j - i):
            current_sum += count_list[j]
            j += 1

        result[address] = current_sum
        i = j

    return result
```

而下面的这个例子则是用于查找：

```python
def find_function_for_pc(functions, pc):
    left = 0
    right = len(functions) - 1

    while left <= right:
        mid = (left + right) // 2
        start_address, function_size, function_name = functions[mid]

        if int(start_address, 16) <= int(pc, 16) < int(start_address, 16) + int(function_size, 16):
            return function_name
        elif pc < start_address:
            right = mid - 1
        else:
            left = mid + 1

    return None
```

已知我们有一个由 'FUNCTION_PC, FUNCTION_SIZE, FUNCTION_NAME' 组成的符号信息，目的是：给定一个 PC, 从符号信息中找到这个 PC 对应的函数名字。

在这种情况下，使用二分查找的效率就会高很多。
