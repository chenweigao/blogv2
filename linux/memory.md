# Memory Hierarchy

## Introduction

memory hierarchy 翻译为内存层次结构。

principle of locality 局部性原理。

程序员总希望存储是无限的，我们通过一系列的技术手段让程序员产生这种错觉。

### temporal locality & spatial locality

时间局部性：以 loop 为例

空间局部性：指令是按照顺序执行的；还有一个典型的例子就是数组。

- 存储层次结构如何利用时间局部性和空间局部性？

  主要是 2 个：将经常访问的数据放在距离处理器更近的地方，将多个连续的“块”移动到上层存储中来利用空间局部性。

  接近处理器的存储是比较小和比较快的，除了成本考虑之外，接近处理器的存储比较小的话，其命中率也更高。

- 理解 hit rate, miss rate, hit time, miss penalty

## Cache

> Caching is perhaps the most important example of the big idea of **prediction**. It relies on the principle of locality to try to find the desired data in the higher levels of the memory hierarchy, and provides mechanisms to ensure that when the prediction is wrong it finds and uses the proper data from the lower levels of the memory hierarchy. The hit rates of the cache prediction on modern computers are often above 95%.

这句话从宏观维度总结了 cache 的一些作用：

- 预测大思想的完美应用
- 依赖了局部性原理

其本质就是试图在存储层次结构的更高层次找到想要的数据。

### Basic: valid & tag

整个cache 空间被分成了 N 个 line，line 是 cache 交换的最小单位，每个 cache line 通常是 32 byte 或者 64 byte, 对于一个字节我们还需要更加注意，那就是 cache line 包含的内容：

| valid | tag  | block |
| ----- | ---- | ----- |

其中 block 表示 cache 中缓存的数据，tag 是该 cache line 对应的内存的地址，valid 表示该 cache line 中的数据是否有效。

在此再解释一下 tag 和 valid 的作用[^1]：

#### tag

> Because each cache location can contain the contents of a number of different
> memory locations, how do we know whether the data in the cache corresponds
> to a requested word? That is, how do we know whether a requested word is in the
> cache or not?

为了解决上述的问题，我们使用了 tag 这个字段，原始的对于 tag 的定义可以如下所示：

> A field in a table used for a memory hierarchy that contains the address information required to identify whether the associated block in the hierarchy corresponds to a requested word.

其意思就是说对应了内存中的地址信息。

不过我们需要注意一个细节，那就是我们如果使用 direct-mapped（❓❓ 目前看来是这样的，这个以后再好好思考一下），那么这个 tag 就是不需要保存完整的地址信息的。

#### valid

> We also need a way to recognize that a cache block does not have valid information. For instance, when a processor starts up, the cache does not have good data, and the tag fields will be meaningless.

valid 的存在是因为我们还需要标识 cache 中的信息是否有效，比如说这边举了一个例子，说的是如果处理器刚刚启动的时候，缓存中的数据肯定是无效的，valid 字段就是起到这样一个作用。

#### hit & miss

cache hit(命中)：读取时间 X 个 cycle

cache miss：读取时间 XX 或者 XXX 个 cycle

所以 hit 和 miss 有很大的性能差距。

### cache 映射方式

映射方式主要由以下几种：

1. 全关联 cachem, full-associative cache
2. 直接映射 cache, direct-mapped cache
3. 组关联 cache, set-associative cache

#### full-associative

悲剧的被比较对消，性能很烂，我们现在不研究这个。

但是这种方式有个优点就是内存中的每个 line(注意到内存中是块存储的，为了方便理解这里也说得 line) 可以映射到任意的 cache line 中，从这个角度看，full-associate 效率更好，但是其查找过于复杂。

#### direct-mapped

主要的思想是把内存分为 N 个page, 每一个 page 的大小和 cache 相同，page 中的 line0 只能映射到 cache 中的 line0, 以此类推。

#### set-associative

组关联 direvt-mapped 的方式是处理器上比较常用的，但是在某些特定的情况下会存在很大的缺陷，所以现代的商用处理器都是用 set-associative cache 来解决这个问题，这也是我们这节要研究的。

set-associative 将 cache 分成了多个 way, direvt-mapped == 1 way set-associative， 使用多少个 cache way 也是一种权衡的结果。

### 置换策略

1. 随机
2. FIFO 先进先出
3. LRU 最近最少使用

LRU 我们使用的最多，并且性能也最好。

### Cache Write

所谓 cache 写，指的就是 cpu 修改了 cache 中的数据的时候，内存的数据也要随之改变。为了达到这个目的，cache 提供了两种写策略：

1. Write through
2. Write back

#### Write through

核心策略：每次 CPU 修改了 cache 中的内容，cache 立即更新（cache 控制器）内存中的内容。

这种方式会有大量写内存的操作，所以效率较低。

#### Write back

核心策略：CPU 或者内核修改了 cache 中的内容的时候，cache 不会立即更新内存内容，而是等到这个 cache line 因为某种原因需要从 cache 中移除的时候，cache 才去更新内存中的内容。

cache 为了知道某个 line 的内容有没有被修改，于是增加了一个新的标志位：**dirty**, 增加以后的 cache line 结构如下所示：

| dirty | valid | tag  | block |
| ----- | ----- | ---- | ----- |

具体的 dirty 的用法如下：

- dirty 位为 1, 表示这个数据已经被修改
- dirty 位为 0, 表示这个数据和内存中的数据是一致的

程序 cache 不需要 dirty 标志位，数据 cache 需要 dirty 标志位。

### cache 一致性

#### Example

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

#### Write invalidate

置无效，其核心思想为：当一个 core 修改了一份数据，其他 core 上如果有这份数据的复制，就置为无效。

这种方法的优点在于，比较简单，而且无效标志位 valid 在 cache line 中有对应的字段，这意味着置无效就是把 cache 的一个 line 直接写为无效了，这个 cache line 中其他有效的数据也不能被使用了。

大部分处理器都使用这个操作。

#### Write update

写更新：当一个内核修改了一份数据，其他的地方如果有这份数据的赋值，就更新到最新值。

其缺点是会产生频繁的更新动作。

### cache 一致性协议

#### MESI

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
- 状态位 S 的时候，这行数据是 clean 的，cache 可以从其他 cache 处同步数据，也可以从内存处同步，协议对此没有做认可要求。

在 MESI 协议中，cache 控制器是可以监听 snoop 其他的 cache 的读写操作。

#### Other MESI

AMD 演化了 MOESI 协议，多了一个 O 状态，这个状态是 S 和 M 状态的一种合体，表示本 cache line 中的数据和内存中的数据不一致，不过其他的核可以有这份数据的复制，复制了这份数据的核的这行 cache 的状态位 S.

Intel I7 演化了 MESIF 协议，多的 F 状态表示 Forward, 其含义是可以把数据直接传给其他内核的 cache, 而 shared 则不能。

MESIX 统一都可以称为监听协议(snoop)，监听协议的缺点在于沟通成本很高，所以有一种集中管理的目录协议，可以后续研究。

### 片内可寻址存储器

通常而言，cache 对用户（程序员）是透明的，但是在 DSP 等性能要求很高的处理器中，处理器存储的一部分作为 cache, 另一部分作为可寻址寄存器，程序员可以直接访问这部分空间。

这种在做法可以有效地控制 cache miss, 所以我们也称片内可寻址寄存器为：**软件管理的 cache**.

片内可寻址寄存器的应用：一般而言，cache 是等到 CPU 要使用数据的时候，才从内存中去拿数据的，片内可寻址寄存器可以通过软件控制 DMA，将以后需要的数据提前搬到处理器内部，这就节省了很多 CPU 的等待时间。DMA 是专门负责数据搬移的模块。

为什么会是软件去做这件事呢？因为程序是可以知道 CPU 什么时候将要访问数据的，而 cache 不知道。但是这种方法对软件的编写难度造成了很大的挑战。

### Why cache miss

有三种情况会导致 cache misss:

1. Compulsory miss, 必须的 miss，如第一次访问程序或者数据时，这些程序或者数据没有在 cache 中
2. Capacity miss, cache 容量满了的时候，新数据到来，需要重新搬移，就 miss 了
3. Conflict miss,  这种情况下，cache 可能还有空闲空间，但是这个地址对应的 cache line 已经被使用了，也会导致 cache miss.

## Reference

[^1]: Computer Organization and Design_ The Hardware Software Interface_ ARM Edition
