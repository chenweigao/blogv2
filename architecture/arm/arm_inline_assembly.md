---
title: Arm In-line Assembly
date: 2022-12-03
category:
 -  Arm


---

## __asm

Example[^1]:

```cpp
#include <stdio.h>

int add(int i, int j)
{
  int res = 0;
  __asm ("ADD %[result], %[input_i], %[input_j]"
    : [result] "=r" (res)
    : [input_i] "r" (i), [input_j] "r" (j)
  );
  return res;
}

int main(void)
{
  int a = 1;
  int b = 2;
  int c = 0;

  c = add(a,b);

  printf("Result of %d + %d = %d\n", a, b, c);
}
```

我们仔细研究上述的例子，可以看到，其内嵌了一条 `ADD` 指令，其语法如下所示：

```cpp
__asm [volatile] (code); /* Basic inline assembly syntax */
```

其中的 code 就是我们需要内嵌的汇编代码，其中 `[volatile]` 是可选的，后续我们再对此进行说明。

如果将 code 展开的话，如下所示：

```cpp
/* Extended inline assembly syntax */ 
__asm [volatile] (code_template 
       : output_operand_list 
      [: input_operand_list 
      [: clobbered_register_list]] 
  );
```

我们总共有 3 个 **”:“**,  每一个后面都有不同的含义，下面对其进行具体说明。（注意 *[]* 符号包含住表示的是这个参数是可选的）

### output

第一个 ：冒号后面跟汇编代码的输出；有几个细节需要注意：

- "=r" 而不是 "r", 在输出中
- `%[variable]` 的 % 是在最前面的

### input 

第二个后面跟汇编代码的输入，如下所示：

```cpp
__asm ("ADD R0, %[input_i], %[input_j]"
    :  /* This is an empty output operand list */
    : [input_i] "r" (i), [input_j] "r" (j)
  );
```

在这个例子中，我们将 `input_i` 和 `input_j` 的值相加放入寄存器 `R0` 中，每一个 input 都使用逗号分隔开，三个字段 `[input_i] "r" (i)` 的含义分别是符号名称，约束字符串和 C 表达式。

### clobbered_register_list

这个里面指定寄存器，嵌入式汇编代码中指定的寄存器可能会产生冲突，因此需要把这些寄存器列举出来，表示其可以在编译的时候被重命名。

## Real Example

### prfm

下面例子是实战中写的汇编示例，使用了 `prfm` 指令：

```cpp
  #if defined(__arm__)
  int i=0, j=0, res=0;
    __asm__ __volatile__(
      "add %[result], %[input_i], %[input_j]\n\t"
      : [result] "+r" (res)
      : [input_i] "r" (i), [input_j] "r" (j)
    );
    
  __asm__ __volatile__(
    "prfm pldl2strm, [%[ptr], #256]"
    :
    : [ptr] "r" (ref)
  );
  #endif
```

### __builtin_prefetch()

`__builtin_prefetch()` 接口的使用，我们列举几个 art 的例子，看一下大佬门是怎么使用预取，保证提前量，或者将预取的功效发挥到最大的：

```cpp
while (mark_stack_pos_ != 0 && prefetch_fifo.size() < kFifoSize) {
    mirror::Object* const mark_stack_obj = mark_stack_[--mark_stack_pos_].AsMirrorPtr();
    DCHECK(mark_stack_obj != nullptr);
    __builtin_prefetch(mark_stack_obj);
    prefetch_fifo.push_back(mark_stack_obj);
}
if (UNLIKELY(prefetch_fifo.empty())) {
    break;
}
obj = prefetch_fifo.front();
prefetch_fifo.pop_front();
```

上述代码的预取位置在 `push_back` 前面，因为堆栈操作需要一定的时延，所以说利用这个时延在堆栈之前进行预取。

其次就是利用 fifo 数据结构，但是在实践中使用该方法，并无太大的增益。

### prefetch in for loop

```cpp
uint8_t* begin = reinterpret_cast<uint8_t*>(new_run) + headerSizes[idx];
for (size_t i = 0; i < num_of_bytes; i += kPrefetchStride) {
    __builtin_prefetch(begin + i);
}
```

如果需要保证提前量，可以如下例子：

```cpp
  size_t bytes_freed = 0;
  for (size_t i = 0; i < num_ptrs; i++) {
    mirror::Object* ptr = ptrs[i];
    const size_t look_ahead = 8;
    if (kPrefetchDuringDlMallocFreeList && i + look_ahead < num_ptrs) {
      // The head of chunk for the allocation is sizeof(size_t) behind the allocation.
      __builtin_prefetch(reinterpret_cast<char*>(ptrs[i + look_ahead]) - sizeof(size_t));
    }
    bytes_freed += AllocationSizeNonvirtual(ptr, nullptr);
  }
```



### mrs pmu

下面这个是读取 PMU 寄存器中的数据的示例：

```cpp
static inline uint64_t arch_counter_get_cntpct() {
    uint64_t cval = 0;
#if defined(__aarch64__)
  __asm__ __volatile__(
    // "mrs %[res], PMCCNTR_EL0"
    "mrs %[res], CNTVCT_EL0"
    : [res] "=r" (cval)
    :
  );
  // LOG(INFO) << "[PREFETCH], COUNTER IS " << cval;
#endif
  return cval;
}
```

`CNTVCT_EL0` 寄存器为一个不需要开启用户态访问权限也能访问到的寄存器。

### memcpy

下面这个是嵌入 `memecpy` 的例子：

```cpp
#if defined(__aarch64__) && defined(xxx)
  if () { // copy len 16
    __asm__ __volatile__(
    "ldp x5, x4 ,[%[src], #8]\n\t"
    "stp x5, x4 ,[%[dst], #8]\n\t"
    :
    : [src] "r" (from_ref), [dst] "r" (to_ref)
    : "x4", "x5"
    );
  } else if () { // copy length 24
    __asm__ __volatile__(
    "ldp x5, x4 ,[%[src], #8]\n\t"
    "ldr x6 ,[%[src], #24]\n\t"
    "stp x5, x4 ,[%[dst], #8]\n\t"
    "str x6 ,[%[dst], #24]\n\t"
    :
    : [src] "r" (from_ref), [dst] "r" (to_ref)
    : "x4", "x5", "x6"
    );
  } else if () { // copy length 32
    __asm__ __volatile__(
    "ldp x5, x4 ,[%[src], #8]\n\t"
    "ldp x7, x6 ,[%[src], #24]\n\t"
    "stp x5, x4 ,[%[dst], #8]\n\t"
    "stp x7, x6 ,[%[dst], #24]\n\t"
    :
    : [src] "r" (from_ref), [dst] "r" (to_ref)
    : "x4", "x5", "x6", "x7"
    );
  } else {
    memcpy(xxx);
  }
#else
	// some code
#endif
```

例子比较长，但是可以供参考，这是比较完备的举例。









[^1]: [ARM 官方文档](https://developer.arm.com/documentation/100748/0616/Using-Assembly-and-Intrinsics-in-C-or-C---Code/Writing-inline-assembly-code)

