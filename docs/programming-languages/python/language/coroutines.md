---
title: Coroutines
date: 2019-08-10


---

因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。

相当于每个 CPU 在同一时间只能执行一个线程。

本文还研究了 python 多进程的相关实现。

<!-- more -->

## Q&A

1. GIL 是多线程、多进程的吗？
   某个线程想要执行，必须先拿到GIL，我们可以把GIL看作是“通行证”，并且在一个python进程中，GIL只有一个。拿不到通行证的线程，就不允许进入CPU执行。

   > 解释器被一个全局解释器锁保护着，它确保任何时候都只有一个Python线程执行

   - Python中同一时刻有且只有一个线程会执行
   - Python中的多个线程由于GIL锁的存在无法利用多核CPU
   - Python中的多线程不适合计算密集型的程序

   > CPython 中使用多线程很容易，但它并不是真正的并发，多进程虽然是并发的，但开销却极大。

## Abstract

### Why Coroutiones

- Python 的多线程不能利用多核CPU

因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。

相当于每个 CPU 在同一时间只能执行一个线程。

### 计算密集和I/O 密集

- 计算密集型也叫 CPU 密集型，主要特点是要进行大量的计算，消耗CPU资源，比如计算圆周率、对视频进行高清解码等等，全靠CPU的运算能力。这种计算密集型任务虽然也可以用多任务完成，但是任务越多，花在任务切换的时间就越多，CPU 执行任务的效率就越低，所以，要最高效地利用 CPU，计算密集型任务同时进行的数量应当等于 CPU 的核心数。计算密集型任务由于主要消耗 CPU 资源，因此，代码运行效率至关重要。Python 这样的脚本语言运行效率很低，完全不适合计算密集型任务。对于计算密集型任务，最好用 C 语言编写。

- IO 密集型涉及到网络、磁盘 IO 的任务都是 IO 密集型任务，这类任务的特点就是 CPU 消耗很少，任务大部分时间都在等待 IO 操作完成。

### 并发与并行

并发 concurreny 指的是同一时刻只能有一个程序在运行；

并行 parallelism 与并发的区别在于，其强调计算机确实能够在同一时刻做许多不同的事情。

## 协程上下文切换

协程拥有自己的寄存器上下文和栈。协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈，直接操作栈没有内核切换的开销，可以不加锁地访问全局变量，所以上下文的切换非常快。

:tipping_hand_man:对比与进程和线程的调度（上下文切换）：

- 进程：切换进程上下文，包括分配的内存，数据段，附加段，堆栈段，代码段等
- 线程：切换线程上下文，主要切换堆栈，以及各寄存器。同一个进程里面不同的线程主要是堆栈不同。



## Python 多线程结论

综上，Python 多线程相当于单核多线程。

多线程有两个好处：CPU 并行，IO 并行，单核多线程无法使用多核 CPU，所以在 Python中不能使用多线程来使用多核。

## multiprocessing

Python 多进程可以使用 `multiprocessing` 模块。

### 基本使用

这是一个基本的例子：

```python
import multiprocessing
import time

def task():
    print('Sleeping for 0.5 seconds')
    time.sleep(0.5)
    print('Finished sleeping')

if __name__ == "__main__": 
    start_time = time.perf_counter()
    processes = []

    # Creates 10 processes then starts them
    for i in range(10):
        p = multiprocessing.Process(target = task)
        p.start()
        processes.append(p)
    
    # Joins all the processes 
    for p in processes:
        p.join()

    finish_time = time.perf_counter()

    print(f"Program finished in {finish_time-start_time} seconds")
```



对于可以迭代的对象，可以使用 `p.map`:

```python
def pattern_all_count_mp(self):
    all_functions = find_all_functions()
    p = mp.Pool(8)
    p.map(self.count_function_pattern_distance_with_others_mp, all_functions)
    p.close()
    p.join()
```



在上面的函数中，我们传入了 list 的 `all_functions`, 这个迭代器，而函数 `count_function_pattern_distance_with_others_mp()` 接收的是 `function` 对象。

对于普通的函数调用，可以这么来写：

```python
def test07(self):
    # 筛选 ed == 0 的阈值大于 10 的 pattern, len 长度为 6
    threshold = 10
    file_name = 'dis_count_ed_0_len6.txt'
    p = multiprocessing.Pool(4)
    p.apply_async(self.s.filter_data, args=(threshold, file_name, 6, ))
    # self.s.filter_data(threshold, file_name, 6)
    p.close()
    p.join()
```

为了确保进程都关闭掉了，可以加上`try..finally` 结构，以确保最后的进程是正常结束了。

### API

`join`([*timeout*]), 

一般这行代码会放在我们多进程完成以后的最后一句使用。

## ProcessPoolExecutor

除了 `multiprocessing` 模块之外，我们也可以使用 `ProcessPoolExecutor` 进行并行程序的执行。

### 实例

先举一个在项目中遇到的实例，用于说明 python 多进程程序的运行原理。

- 我们有一个函数，其需要使用多进程进行运行：

  ```python
  class PatternAllSimilar:
      def pattern_all(self, not_use=None):
          #.. function code
  ```

  需要注意，因为笔者现在还不确定这个使用方式是不是可以不指定给多进行迭代的参数（后文确定了，该接口是必须有这个的），所以定义了一个 `not_use` 参数，上层会进行传递，但是在函数中不会对其使用。

- 现在可以使用多进程运行之：

  ```python
  if __name__ == '__main__':
      logging.basicConfig(stream=sys.stdout, level=logging.INFO)
      s = PatternAllSimilar()
      not_use = list(range(10))
  
      with ProcessPoolExecutor(max_workers=8) as pool:
          for _ in pool.map(s.pattern_all, not_use):
              pass
      pool.shutdown(cancel_futures=True)
  ```

  笔者在调试这个多进程程序的时候，发现其一直不 work，表现在不进入多进程的程序中，程序一闪而过就执行完了，最后找了很多资料，发觉需要注意以下几点：

  1. 如果有文件操作，确定指定了正确的文件路径；所以说我们在执行的时候可以使用下面的逻辑来检查文件和 `sys.path` 的正确性：

     ```python
     if not os.path.exists(s.file_split):
         logging.error("The file {} is not exists!!".format(s.file_split))
         logging.debug("sys.path is {}".format(sys.path))
         exit(1) # if in __mian__
     ```

  2. 确保我们的多进程的相关执行在 `__main__` 函数中；

  3. 使用 `with` 语句，并且最后对多进程进行关闭。

### About pool.map

:::warning

在深入使用了这个接口以后，我发现其并不能很好地适用于所有的并行场景。这种方法要求必须是一个迭代器传入给函数，然后函数负责单一一次的计算，所以说要使用这个接口来进行并行计算的话，是需要传入我们需要计算的迭代器对象的，这就意味着，要传入一个**很大的对象**，内存此时就不够了。

所以说，这个方法由于上述限制，提升的性能十分有限。

:::

为了解决这个问题，笔者在尝试了很久之后，发现可以使用迭代器去生成大的数组，其中逻辑比较绕，代码如下：

```python
    def get_all_pattern_list(self, file=None):
        if not file:
            file = self.file_split
        pattern_list = []
        with open(file, 'r') as fs:
            for idx in range(0, self.get_line_count(fs.name), self.pattern_len):
                logging.debug('start to get line {} pattern'.format(idx))
                lines = linecache.getlines(fs.name)[idx: idx + self.pattern_len]
                try:
                    ins = [_.split()[1] if _ else 'nop' for _ in lines]
                    yield idx, ins
                except IndexError:
                    continue
```

上面函数的作用是读取文件中的每一行，然后从文件中得到一个 pattern, 最后使用 `yield` 的方式输出。

在多进程的实现函数中，可以这么实现（实现函数每一次处理一个迭代器对象，`pattern_tup` 包括的内容为 `(line_number, pattern)`, 而上一个函数返回了所有的这些 `pattern_tup` 的集合：

```python
    def get_pattern_similar(self, pattern_tup):
        line_number, p2 = pattern_tup
        pattern_count = 0
        with open(self.file_split, 'r') as fs:
            for idx in range(0, self.get_line_count(fs.name), self.pattern_len):
                logging.debug('start to get line {} pattern'.format(idx))
                lines = linecache.getlines(fs.name)[idx: idx + self.pattern_len]
                try:
                    ins = [_.split()[1] if _ else 'nop' for _ in lines]
                    ed = self.ed.edit_distance_faster(ins, p2)
                    if ed <= self.threshold:
                        pattern_count += 1
                except IndexError:
                    continue

        return pattern_count, line_number, p2
```

最后就可以使用这个接口的方式来调用了：

```python
res = collections.defaultdict()
start = time.time()
with ProcessPoolExecutor(max_workers=worker_count) as pool:
    with open(s.res_file, 'w+') as f:
        for items in pool.map(s.get_pattern_similar, s.get_all_pattern_list(file=s.file_split)):
            count, lineno, pattern = items
            if lineno and pattern:
                key = (lineno, ','.join(pattern))
                res[key] = count
                logging.info('pattern {} found a similar, now is {}'.format(key, res.get(key)))
                line = '{};{};{}\n'.format(key[0], key[1], count)
                f.writelines(line)
```

其核心代码为第 5 行，打开文件是为了将结果及时写入到文件中；

我们再仔细看看第 5 行，加深理解：

```python
for items in pool.map(s.get_pattern_similar, s.get_all_pattern_list(file=s.file_split)):
```

`s.get_all_pattern_list(file=s.file_split)` 就是迭代器，也是我们接口中需要传入的 `not_use`, 至此也证明了这个接口中的可迭代对象是必不可少的。
