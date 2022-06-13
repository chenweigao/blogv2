# Memory Hierarchy - Cache

## Introduction

程序员总希望存储是无限的，我们通过一系列的技术手段让程序员产生这种错觉。

本文主要研究存储层次结构中的 cache 环节，本文的行文构成包含如下：

1. 介绍空间局部性原理和时间局部性原理
2. 简单介绍 cache 的基本概念，包括 cache line 各个字段的解析
3. 介绍 cache 的 hit, miss 造成的影响以及可能的解决方案
4. 介绍 cache 的几种映射方式和置换策略
5. 写 cache 相关的技术点
6. cache 一致性问题
7. 其他的相关知识

### Key Word

| key word              | means        | comments |
| --------------------- | ------------ | -------- |
| memory hierarchy      | 内存层次结构 |          |
| principle of locality | 局部性原理   |          |
| temporal locality     | 时间局部性   |          |
| spatial locality      | 空间局部性   |          |



### temporal locality & spatial locality

时间局部性：以 loop 为例

空间局部性：指令是按照顺序执行的；还有一个典型的例子就是数组。

- 存储层次结构如何利用时间局部性和空间局部性？

  主要是 2 个：将经常访问的数据放在距离处理器更近的地方，将多个连续的“块”移动到上层存储中来利用空间局部性。

  接近处理器的存储是比较小和比较快的，除了成本考虑之外，接近处理器的存储比较小的话，其命中率也更高。

- 理解 hit rate, miss rate, hit time, miss penalty

## Cache Abstract

> Caching is perhaps the most important example of the big idea of **prediction**. It relies on the principle of locality to try to find the desired data in the higher levels of the memory hierarchy, and provides mechanisms to ensure that when the prediction is wrong it finds and uses the proper data from the lower levels of the memory hierarchy. The hit rates of the cache prediction on modern computers are often above 95%.

这句话从宏观维度总结了 cache 的一些作用：

- 预测大思想的完美应用
- 依赖了局部性原理

其本质就是试图在存储层次结构的更高层次找到想要的数据。

## Cache line

整个cache 空间被分成了 N 个 line，line 是 cache 交换的最小单位，每个 cache line 通常是 32 byte 或者 64 byte, 对于一个字节我们还需要更加注意，那就是 cache line 包含的内容：

| ———————————– | ——————————– | ———————————– |
| :----------: | :---------: | :----------: |
|    valid     |     tag     |    block     |

其中 block 表示 cache 中缓存的数据，tag 是该 cache line 对应的内存的地址，valid 表示该 cache line 中的数据是否有效。

在此再解释一下 tag 和 valid 的作用[^1]：

### tag

> Because each cache location can contain the contents of a number of different
> memory locations, how do we know whether the data in the cache corresponds
> to a requested word? That is, how do we know whether a requested word is in the
> cache or not?

为了解决上述的问题，我们使用了 tag 这个字段，原始的对于 tag 的定义可以如下所示：

> A field in a table used for a memory hierarchy that contains the address information required to identify whether the associated block in the hierarchy corresponds to a requested word.

其意思就是说对应了内存中的地址信息。

不过我们需要注意一个细节，那就是我们如果使用 direct-mapped（❓❓ 目前看来是这样的，这个以后再好好思考一下），那么这个 tag 就是不需要保存完整的地址信息的。

### valid

> We also need a way to recognize that a cache block does not have valid information. For instance, when a processor starts up, the cache does not have good data, and the tag fields will be meaningless.

valid 的存在是因为我们还需要标识 cache 中的信息是否有效，比如说这边举了一个例子，说的是如果处理器刚刚启动的时候，缓存中的数据肯定是无效的，valid 字段就是起到这样一个作用。

### data

剩下的是 data 或者 block 块，其实在实际的 cache 中，我们长这样（Intrinsity FastMATH data cache 为例）：

| valid | tag  | block 1 | block 2 | …    | block n |
| ----- | ---- | ------- | ------- | ---- | ------- |
| 8     | 18   | 32      | 32      | …    | 32      |

在上述的例子中，block 有多个，实际构成了总的 data,  而每个 block 的定位是依靠地址中的某几个字节分配的偏移量决定的，比如我们一共有 16 个 block, 则地址字段需要分配 4 bit 用于表示偏移量，有些英文文档中称作 multiplexor，那么我们每个 cache line(entry) 中可以保存的总的数据量为：32 bit * 16。

我们举例一个地址字段来说明这个：

| 31 .. 14 | 13 .. 6 | 5..2                        | 1..0 |
| -------- | ------- | --------------------------- | ---- |
| tag      | index   | byte offset -> block offset |      |

这个例子中的 5..2 bit 就是用作定位偏移得的。

> Intrinsity FastMATH data cache  使用了数据 cache 和 指令 cache 分离的设计。

## hit & miss

cache hit(命中)：读取时间 X 个 cycle

cache miss：读取时间 XX 或者 XXX 个 cycle

所以 hit 和 miss 有很大的性能差距。

### Why cache miss?

有三种情况会导致 cache misss:

1. Compulsory miss, 必须的 miss，如第一次访问程序或者数据时，这些程序或者数据没有在 cache 中
2. Capacity miss, cache 容量满了的时候，新数据到来，需要重新搬移，就 miss 了
3. Conflict miss,  这种情况下，cache 可能还有空闲空间，但是这个地址对应的 cache line 已经被使用了，也会导致 cache miss.

### Ways to lower miss rate

#### 使用较大的 block

较大的 blocks 利用空间局部性原理来降低 miss rate, 通常而言，增加块的大小会降低 miss rate, 但是其存在一个阈值，如果 block 的大小称为缓存很大的一部分，最终 miss rate 反而会上升，这是因为缓存中可以保存的块的数量变少，导致了很多竞争。

除此之外，使用较大的 blocks 会造成 cache 未命中的时候的代价变大，主要是体现在 cache 加载的时候(fetch the block), 这个过程分为两个部分：**the latency to the first word and the transfer**
**time for the rest of the block.** 比较好理解，就用英文表述了。通常而言，这个 transfer time 是随着 block 的增加而增加的。

:::tip

🧡🧡🧡 我们可以获得一个启发：**如果我们可以设计方法降低较大的 block 的 transfer time, 那么我们就可以进一步改善缓存的性能。**

:::

### hide some transfer time

在使用较大的 block 的时候，我们采取一个**隐藏一些传输时间**的方法来减少未命中的惩罚。

- early start
- requested word first or critical word first

❌❌❌ 后续需要重点研究这两个算法。

### Handling cache misses

- 缓存处理起来 hit 的工作相比于 miss 是微不足道的。
- cache miss handing 需要处理器控制单元和单独的控制器合作完成，这个单独的控制器启动内存访问、填充缓存
- 缓存未命中的处理会导致流水线 stall, 此时需要保存所有寄存器的状态
- 缓存未命中（处理指令未命中、处理数据未命中）会导致整个处理器暂停，冻结临时寄存器和程序员可见寄存器的内容，同时等待内存。（注意一下，乱序执行的处理器此时还可以允许执行指令）

处理缓存 miss 的步骤大概可以总结如下（主要研究指定 miss）：

1. 发送 PC 值到内存

   Since the program counter is incremented in the first clock cycle of execution, the address of **the instruction that generates an instruction cache miss** is equal to the value of the program counter minus 4.

   如何理解 the instruction that generates an instruction cache miss? 其实我们只要了解到，cache miss 以后，PC 寄存器向前走了，所以这时候我们需要向后走去找到这个 miss 的指令的地址，然后再去内存中找，就可以了！

2. 控制主存执行读取，并等待内存完成访问

3. 写入缓存，将内存中的数据放入缓存的数据部分，tag 写入地址（from ALU）的高位，并打开有效位

4. 重启指令的执行，这将重新读取指令，这是在缓存中就可以找到该指令

## cache 映射方式

映射方式主要由以下几种：

1. 全关联 cachem, full-associative cache
2. 直接映射 cache, direct-mapped cache
3. 组关联 cache, set-associative cache

### full-associative

悲剧的被比较对象，性能很烂，我们现在不研究这个。

但是这种方式有个优点就是内存中的每个 line(注意到内存中是块存储的，为了方便理解这里也说得 line) 可以映射到任意的 cache line 中，从这个角度看，full-associate 效率更好，但是其查找过于复杂。

### direct-mapped

主要的思想是把内存分为 N 个page, 每一个 page 的大小和 cache 相同，page 中的 line0 只能映射到 cache 中的 line0, 以此类推。

### set-associative

组关联 direvt-mapped 的方式是处理器上比较常用的，但是在某些特定的情况下会存在很大的缺陷，所以现代的商用处理器都是用 set-associative cache 来解决这个问题，这也是我们这节要研究的。

set-associative 将 cache 分成了多个 way, direvt-mapped == 1 way set-associative， 使用多少个 cache way 也是一种权衡的结果。

## 置换策略

1. 随机
2. FIFO 先进先出
3. LRU 最近最少使用

LRU 我们使用的最多，并且性能也最好。

## Cache Write

所谓 cache 写，指的就是 cpu 修改了 cache 中的数据的时候，内存的数据也要随之改变。为了达到这个目的，cache 提供了几种写策略：

1. Write through
2. Write buffer
3. Write back

### Write through

核心策略：每次 CPU 修改了 cache 中的内容，cache 立即更新（cache 控制器）内存中的内容。

这种方式会有大量写内存的操作，所以效率较低。

### Write buffer

> A queue that holds data while the data are waiting to be written to memory.

Write buffer 中保存了准备写入内存的数据，处理器同时写入 cache 和 write buffer, 而在写入主存完成后，write buffer 中的数据就 free 掉了。

这种方法的缺点在于，如果这个 write buffer 已经满了，那么处理器来写这个的时候必须停止，等待 write buffer 中出现新的空位。

这个之中还有一个矛盾在于，如果处理器生成写入的速率大于内存可以完成的写入速率，那么拿什么 write buffer 都不会起作用的。

### Write back: dirty

核心策略：CPU 或者内核修改了 cache 中的内容的时候，cache 不会立即更新内存内容，而是等到这个 cache line 因为某种原因需要从 cache 中移除的时候，cache 才去更新内存中的内容。

cache 为了知道某个 line 的内容有没有被修改，于是增加了一个新的标志位：**dirty**, 增加以后的 cache line 结构如下所示：

| dirty | valid | tag  | block |
| ----- | ----- | ---- | ----- |

具体的 dirty 的用法如下：

- dirty 位为 1, 表示这个数据已经被修改
- dirty 位为 0, 表示这个数据和内存中的数据是一致的

程序 cache 不需要 dirty 标志位，数据 cache 需要 dirty 标志位。

几个特点：

> By comparison, in a write-through cache, writes can always be done in one cycle.

很多 write back 策略还包括着 write buffer 用于在 miss 的时候减少 miss 惩罚，是这么做的：修改后的块被移动到 write buffer 中，Assuming another miss does not occur immediately, this technique halves the miss penalty when a dirty block must be replaced.

### Write miss

Write miss 这个第一眼看过去似乎是比较奇特的，写也会 Miss 吗？当然会了，这里的写 miss 指的是没有写在缓存里面。

考虑 write through 场景下的一个 write miss, 在 write through 中，有两种策略：

1. write allocate

   在缓存中分配一个 block, 然后用内存中的 block 覆盖之。

2. no write allocate

   更新内存中的 block, 但是不放入 cache 中。这种场景可能适用于计算机清零某一页的内容这样的情况，有些计算机是允许按页更改写入分配策略的。

## cache 一致性

### Example

定义：主要体现在不同 core 的 cache 中数据不同。

	-----------------------------------------
	|       多核处理器                       |
	| -----------------   ----------------  |
	| |     core 0     |  |     core 1    | |
	| |  cache 0(x = 3)|  | cache 1(x = 5)| |
	| ------------------  ----------------- |
	|-------------------------------------- |
	
		------------------------------
		|     memory (x = 3)          |
		|                             |
		-------------------------------

core 0 和 core 1 中的 x 容易出现数据不一致的情况，比如 core 0 将 x 进行了修改，但是 core 1 不知道 x 已经被修改了，还在使用旧值，这样就会导致数据不一致的问题。

处理器提供了两个操作来保证 cache 的一致性：

1. Wirte invalidate
2. Write update

### Write invalidate

置无效，其核心思想为：当一个 core 修改了一份数据，其他 core 上如果有这份数据的复制，就置为无效。

这种方法的优点在于，比较简单，而且无效标志位 valid 在 cache line 中有对应的字段，这意味着置无效就是把 cache 的一个 line 直接写为无效了，这个 cache line 中其他有效的数据也不能被使用了。

大部分处理器都使用这个操作。

### Write update

写更新：当一个内核修改了一份数据，其他的地方如果有这份数据的赋值，就更新到最新值。

其缺点是会产生频繁的更新动作。

## cache 一致性协议

### MESI

主要研究基于 Write invalidate 的一致性协议。比较经典的协议就是 MESI 协议。

复习一下：cache line 中有两个字段是 dirty 和 valid, 分别表示数据是否被修改和数据是否有效。但是在多核处理器中，多个核会存在共享数据的情况，MESI 协议就可以描述这种共享状态。

MESI 协议中有 2 bit 用于 cache line 的状态位，如下表：

| 状态 | 全程      | 描述                                                         |
| ---- | --------- | ------------------------------------------------------------ |
| M    | Modified  | 这行数据被修改了，和内存中的数据不一致                       |
| E    | Exclusive | 这行数据有效，数据和内存中一致，数据只存在于本 core 的 cache 中 |
| S    | Shared    | 这行数据有效，数据和内存中一致，数据存在于很多 cache 中      |
| I    | Invalid   | 这行数据无效                                                 |

M 和 E 需要重点理解一下，很明显这四个状态是互斥的，也就是说：

- 状态为 M 的时候，这行数据是 dirty 的，但是数据是这个 cache 独有的。除了这个 M 意外，其他的状态下数据都是 clean 的（无效状态是无效的）
- 状态位 E 的时候，这行数据是 clean 的，并且数据是这个 cache 独有的
- 状态位 S 的时候，这行数据是 clean 的，cache 可以从其他 cache 处同步数据，也可以从内存处同步，协议对此没有做任何要求。

在 MESI 协议中，cache 控制器是可以监听 snoop 其他的 cache 的读写操作。

### Other MESI

AMD 演化了 MOESI 协议，多了一个 O 状态，这个状态是 S 和 M 状态的一种合体，表示本 cache line 中的数据和内存中的数据不一致，不过其他的核可以有这份数据的复制，复制了这份数据的核的这行 cache 的状态位 S.

Intel I7 演化了 MESIF 协议，多的 F 状态表示 Forward, 其含义是可以把数据直接传给其他内核的 cache, 而 shared 则不能。

MESIX 统一都可以称为监听协议(snoop)，监听协议的缺点在于沟通成本很高，所以有一种集中管理的目录协议，可以后续研究。

## 片内可寻址存储器

通常而言，cache 对用户（程序员）是透明的，但是在 DSP 等性能要求很高的处理器中，处理器存储的一部分作为 cache, 另一部分作为可寻址寄存器，程序员可以直接访问这部分空间。

这种在做法可以有效地控制 cache miss, 所以我们也称片内可寻址寄存器为：**软件管理的 cache**.

片内可寻址寄存器的应用：一般而言，cache 是等到 CPU 要使用数据的时候，才从内存中去拿数据的，片内可寻址寄存器可以通过软件控制 DMA，将以后需要的数据提前搬到处理器内部，这就节省了很多 CPU 的等待时间。DMA 是专门负责数据搬移的模块。

为什么会是软件去做这件事呢？因为程序是可以知道 CPU 什么时候将要访问数据的，而 cache 不知道。但是这种方法对软件的编写难度造成了很大的挑战。



## Others

### 内存对齐 

为什么要内存对齐(memory memory)[^2]：

1. 平台原因：不是所有的硬件平台都可以访问任意地址上的任意数据，某些平台只能在特定的地址处取某些特定类型的数据，否则抛出硬件异常。
2. 性能原因：如果访问未对齐的内存，处理器需要两次访存操作；而对齐的内存只需要一次访存操作。

## Reference

[^1]: Computer Organization and Design_ The Hardware Software Interface_ ARM Edition
[^2]: [一文轻松理解内存对齐](https://cloud.tencent.com/developer/article/1727794)

