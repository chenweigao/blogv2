# size_t

## Abstract

这篇文章主要研究 `size_t` 的定义和使用，通过这篇文章，希望能做到理解 `size_t`, 这篇文章思考并解决以下问题：
1. 什么是 `size_t`?
2. 为什么会有 `size_t`?
3. `size_t` 的底层实现原理是什么？
4. 我们该什么时候使用 `size_t`?

## size_t

> `size_t` 是一个与机器相关的 unsigned 类型，在64位系统中为 long long unsigned int，非 64 位系统中为 long unsigned int。

上述是百度百科对于 `size_t` 的简单说明，我在遇到 `size_t` 的时候，是在求解一个 leetcode 题目时，我调用了 `<string.h>` 中的 `strlen()` 函数，我是这么写的：

```c
int len = strlen(sentence);
```

此时 IDE 出现了警告：*Clang-Tidy: Narrowing conversion from 'unsigned long long' to signed type 'int' is implementation-defined.*

然后我点进去 `strlen()` 函数的申明，在源码中如下：

```c
size_t __cdecl strlen(const char *_Str);
```

可以发现，在源码中，`strlen()` 函数的返回类型是 `size_t` 而不是我们期望的 `int`! 

在查阅资料后发现，在标准 C 库中的许多函数使用的参数或者返回值都是使用的字节表示的对象大小，比如说 `malloc(n)` 函数的参数 `n` 制定了需要申请的空间大小，我们来看 `malloc()` 函数的定义：

```c
void *__cdecl malloc(size_t _Size);
```

在此之前，我一直使用 `int` 类型作为这些函数的返回值。

类似的，`memcpy()` 的定义如下：

```c
void *memcpy(void *s1, void const *s2, size_t n);
```

也是用到了 `size_t`.


### why size_t matters

why size_t matters?[^1] 这篇文章讲述了 `size_t` 的重要性，本章结合这篇博文，对 `size_t` 进行一个简单的理解。

`size_t` 解决了可移植问题。

我们结合 `memcpy()` 的定义来理解这个可移植性问题，我们知道 `memcpy(s1, s2, n)` 的作用是将 s2 指向地址开始的 n 个字节拷贝到 s1 指向的地址，返回 s1, 其可以拷贝任何类型。第三个参数使用 `size_t` 的好处在于，可以避免使用 int 的时候出现有符号的情况，其次 unsigned int 也可以表示更大的数据范围。在绝大部分的机器上，unsigned int 的数据范围比 int 整整大一倍。

平台可以自定义 `size_t` 的类型，int 小于等于数据线宽度，size_t 大于等于地址线宽度。

目前的 int 普遍是 32 位，而 size_t 在主流平台中都是 64 位。

### size_t

- 从命名上来看，也很直观，含义或者全程就是 'size_type', 大小的类型，后面加 '_t' 是为了防止命名空间冲突，或者说是一个缩写。

- size_t 是一种整形的类型，不管其在平台是 unsigned int 还是 unsigned long, 都是整形

- `sizeof` 运算的结果类型是 `size_t`

- 类似的还有 `wchar_t`, `ptrdiff_t`; `ptrdiff_t` 表示两个指针之间的距离的数据类型。

- size_t 的可能是这样的：

```c
typedef unsigned int size_t;
```


## Reference

[^1]: <https://jeremybai.github.io/blog/2014/09/10/size-t>
[^2]: [About size_t and ptrdiff_t](https://pvs-studio.com/en/blog/posts/cpp/a0050/)
