---
title: Cache
date: 2022-08-24
category:
 -  Arm
---

## 1. Abstract

### 1.1. Introduction

:::note 哲学含义

程序员总希望存储是无限的，我们通过一系列的技术手段让程序员产生这种错觉。

:::

本文主要研究存储层次结构中的 cache 环节，本文的行文构成包含如下：

1. 介绍空间局部性原理和时间局部性原理
2. 简单介绍 cache 的基本概念，包括 cache line 各个字段的解析
3. 介绍 cache 的 hit, miss 发生的原因、造成的影响以及可能的解决方案；包括两个重要的算法和通用的处理 cache miss 的方法
4. 介绍 cache 的几种映射方式和置换策略
5. 写 cache 相关的技术点，Write miss 相关介绍
6. cache 一致性监听协议 MESI(x)
7. 其他的相关知识

### 1.2. Key Word

| key word              | means  | comments |
| --------------------- | ------ | -------- |
| memory hierarchy      | 内存层次结构 |          |
| principle of locality | 局部性原理  |          |
| temporal locality     | 时间局部性  |          |
| spatial locality      | 空间局部性  |          |
| Locality of reference | 访问局部性  |          |

### 1.3. temporal locality & spatial locality

总体而言，可以归纳为访问局部性，其含义是计算机科学领域的应用程序在访问内存的时候，倾向于访问内存中较为靠近的值。

**时间局部性**：以 loop 为例, 被引用过一次的存储器位置在未来会被多次引用

**空间局部性**：指令是按照顺序执行的；如果一个存储器的位置被引用，那么将来他附近的位置也会被引用，典型的例子就是数组。

🧡🧡 **QA**

- 存储层次结构如何利用时间局部性和空间局部性？
  
  主要是 2 个：将经常访问的数据放在距离处理器更近的地方，将多个连续的“块”移动到上层存储中来利用空间局部性。
  
  接近处理器的存储是比较小和比较快的，除了成本考虑之外，接近处理器的存储比较小的话，其命中率也更高。

- 理解 hit rate, miss rate, hit time, miss penalty

局部性是计算机系统中的一种可预测的行为，系统的这种强访问局部性，可以被用来处理内核的指令流水线中的性能优化，如缓存、分支预测、内存预读取等。

## 2. Cache Abstract

> Caching is perhaps the most important example of the big idea of **prediction**. It relies on the principle of locality to try to find the desired data in the higher levels of the memory hierarchy, and provides mechanisms to ensure that when the prediction is wrong it finds and uses the proper data from the lower levels of the memory hierarchy. The hit rates of the cache prediction on modern computers are often above 95%.

这句话从宏观维度总结了 cache 的一些作用：

- 预测大思想的完美应用
- 依赖了局部性原理

其本质就是试图在存储层次结构的更高层次找到想要的数据。

下图是一个关于 cache 结构的全局示意图：

![](https://documentation-service.arm.com/static/5ff5c9fd89a395015c28fc72?token=)

### 2.1. way & set

从上图中有一个疑问，way 和 set 的区别是什么？

> In a cache, a "way" refers to a set of cache entries that have the same index but different tags. The number of ways in a cache is **determined by the cache's associativity**, which is the number of cache entries that can map to the same index. Each way contains a set of cache entries that are grouped together based on their index.
> 
> In contrast, a "set" in a cache refers to a group of cache entries that share the same index. A set can contain multiple cache entries, with each entry having a unique tag. The number of sets in a cache is determined by the cache size and block size.

从上述文字也不是很好理解，再参考以下的引文：

> Suppose we have a 4-way set-associative cache with 8 cache entries and a block size of 64 bytes. This means that the cache has 8 sets, each with 4 ways.
> 
> Here's an example of how the cache might be organized:
> 
> ```
> Set 0:
> Way 0: [Tag 0][Data][Control]
> Way 1: [Tag 1][Data][Control]
> Way 2: [Tag 2][Data][Control]
> Way 3: [Tag 3][Data][Control]
> 
> Set 1:
> Way 0: [Tag 4][Data][Control]
> Way 1: [Tag 5][Data][Control]
> Way 2: [Tag 6][Data][Control]
> Way 3: [Tag 7][Data][Control]
> 
> ...
> 
> Set 7:
> Way 0: [Tag 28][Data][Control]
> Way 1: [Tag 29][Data][Control]
> Way 2: [Tag 30][Data][Control]
> Way 3: [Tag 31][Data][Control]
> ```
> 
> In this example, each set contains 4 ways, and each way contains a cache entry with a unique tag, data, and control bits. When the processor requests data from memory, the cache uses the memory address to determine the index and tag of the requested data. The cache then checks the corresponding set and looks for the requested data in each way of that set until it finds the data or determines that it is not in the cache.

一个 way 多个 cacheline(通常而言)

> To add the cache line to the previous text figure, we can modify it as follows:
> 
> ```
> Set 0:
> Way 0: 
>     [Tag 0][Data][Control] 
>     [Tag 1][Data][Control] 
>     [Tag 2][Data][Control] 
>     [Tag 3][Data][Control]
> ```

上述的例子说明了：一个 way 是由很多个 cache entries 组成的（这点在下面的图中也可以得到印证）

以下是一个例子：

> here's an example to illustrate the relationship between cache size, way, and set:
> 
> Let's say we have a cache with a total size of 64 KB, a block size of 64 bytes, and a 4-way set-associative mapping.
> 
> To determine the number of sets in the cache, we can divide the cache size by the product of the block size and the associativity. In this case, we have:
> 
> Number of sets = cache size / (block size x associativity)
> Number of sets = 64 KB / (64 bytes x 4)
> Number of sets = 256
> 
> This means that the cache has 256 sets. Each set contains four ways, as specified by the 4-way set-associative mapping.
> 
> To determine the number of cache entries in the cache, we can multiply the number of sets by the number of ways. In this case, we have:
> 
> Number of cache entries = number of sets x number of ways
> Number of cache entries = 256 x 4
> Number of cache entries = 1024
> 
> This means that the cache has a total of 1024 cache entries. Each cache entry consists of a block of 64 bytes, as specified by the block size.
> 
> When the processor requests data from memory, the cache uses the memory address to determine the index and tag of the requested data. The cache then checks the corresponding set and looks for the requested data in each of the four ways of that set until it finds the data or determines that it is not in the cache.
> 
> Overall, this example illustrates how the cache size, block size, and associativity determine the number of sets, ways, and cache entries in a cache, and how these components work together to efficiently cache frequently accessed data and reduce the time spent waiting for data to be fetched from main memory.

量化研究方法如下所描述：

> The set associative organization has four sets with **two blocks** per set, called two-way set associative.

## 3. Cache line

整个cache 空间被分成了 N 个 line，line 是 cache 交换的最小单位，每个 cache line 通常是 32 byte 或者 64 byte, 对于一个字节我们还需要更加注意，那就是 cache line 包含的内容：

参考 arm 官方的示意图：

![](https://documentation-service.arm.com/static/5ff5c9fd89a395015c28fc6c?token=)

有些时候也会用 tag, valid, block 表示，其中 block 表示 cache 中缓存的数据，tag 是该 cache line 对应的内存的地址，valid 表示该 cache line 中的数据是否有效。

也有如下的表示方法：

```
+-----------------+----------------------+---------------+
|      Tag        |        Data          |   Control     |
+-----------------+----------------------+---------------+
|      n bits     |        m bytes       |   k bits      |
+-----------------+----------------------+---------------+
```

在上述图中，cache line 被表示成了三个部分：

1. **Tag**: identify the memory address associated with the cache entry
2. **Data**: contains the actual data or instructions stored in the cache entry
3. **Control**: contains the control bits used to manage the cache entry, such as indicating whether the entry is **valid** or not, whether it has been **modified**, and whether it is available for use.

通过对比这两者的不同，我们明白，不同的体系结构中的 cacheline 设计都是存在差异的。

下面章节解释一下 tag 和 valid 的作用[^1]。

### 3.1. tag

> Because each cache location can contain the contents of a number of different
> memory locations, how do we know whether the data in the cache corresponds
> to a requested word? That is, how do we know whether a requested word is in the
> cache or not?

为了解决上述的问题（我们要访问的内容是不是在 cache 里面），我们使用了 tag 这个字段，原始的对于 tag 的定义可以如下所示：

> A field in a table used for a memory hierarchy that contains the address information required to identify whether the associated block in the hierarchy corresponds to a requested word.

其意思就是说对应了内存中的地址信息。

（❌❌ 之前错误的理解）不过我们需要注意一个细节，那就是我们如果使用 direct-mapped（目前看来是这样的，这个以后再好好思考一下），那么这个 tag 就是不需要保存完整的地址信息的。

✔️✔️ 对于上述说法的正确理解是：tag 所需要使用的位数大小是取决于微架构实际的设计的，和地址信息非强相关；为了更好理解，我们在此重复研究这张图片：

![A real-life example](https://documentation-service.arm.com/static/5ff5c9fd89a395015c28fc35?token=)

从图（很重要，所以在本文中出现多次）中我们可以看出，我们取了虚拟地址的 19 位用于 tag 的匹配；而我们图中有 256 条 cache line, 其计算方式是根据 cache 的总大小(32KB/4 set) 除以每条 cacheline 的大小(32byte) 得到的。

:::tip tag 匹配时需要全量比较吗？

注意我们无论使用什么映射方式，要确定要访问的内存是不是在 cache 中，均是通过比较 tag 的方式来实现的。

这就意味着：我们**需要和所有的 entry 的 tag 字段进行比较**。通常而言，这个过程是比较耗时的；但是硬件设计通过一些优化的手段，可以加速或者并行这个比较的过程。

从另一个方面来说，cache 越大，那么我们需要比较的次数就越多；但是更小的 cache 会导致更高的 miss rate, 最终影响性能。

:::

### 3.2. valid

> We also need a way to recognize that a cache block does not have valid information. For instance, when a processor starts up, the cache does not have good data, and the tag fields will be meaningless.

valid 的存在是因为我们还需要标识 cache 中的信息是否有效，比如说这边举了一个例子，说的是如果处理器刚刚启动的时候，缓存中的数据肯定是无效的，valid 字段就是起到这样一个作用。

### 3.3. 💯data

剩下的是 data 或者 block 块，其实在实际的 cache 中，我们长这样（Intrinsity FastMATH data cache 为例）：

| valid | tag | block 1 | block 2 | …   | block n |
| ----- | --- | ------- | ------- | --- | ------- |
| 8     | 18  | 32      | 32      | …   | 32      |

在上述的例子中，block 有多个，实际构成了总的 data,  而每个 block 的定位是依靠地址中的某几个字节分配的偏移量决定的，比如我们一共有 16 个 block, 则地址字段需要分配 4 bit 用于表示偏移量，有些英文文档中称作 multiplexor，那么我们每个 cache line(entry) 中可以保存的总的数据量为：32 bit * 16。

我们举例一个地址字段来说明这个：

| 31 .. 14 | 13 .. 6 | 5..2                        | 1..0 |
| -------- | ------- | --------------------------- | ---- |
| tag      | index   | byte offset -> block offset |      |

这个例子中的 5..2 bit 就是用作定位偏移得的。

> Intrinsity FastMATH data cache  使用了数据 cache 和 指令 cache 分离的设计。

上述的说明属于比较专业的说法，我们还可以使用较为简单的方式来进行理解（可能会缺少一些严谨性）

访存地址可以被分为两部分：**块地址+块内位移**。其中块地址用于查找该块在 cache 中的位置，块内位移用于确定所访问的数据在块内的位置。

:::note 分页 VS 分段

上述的访存地址计算的方式是适用于*页虚拟存储器*， 对于段虚拟寄存器，可以用两个字来表示：段号+段内偏移。关于虚拟内存可以参考另外的一遍文章《Virtual Memory》

:::

## 4. cache 映射方式

映射方式主要由以下几种：

1. 全相联 cachem, full-associative cache
2. 直接映射 cache, direct-mapped cache
3. 组相联 cache, set-associative cache
- 如果一个块可以放在缓存中的任意位置，那么就是全相联的；
- 如果每个块只能出现在缓冲中的一个位置，就说该缓存是直接映射的；映射的方式为 **（块地址）MOD （缓存中的块数）**；
- 如果一个块可以放在缓存中由有限个位置组成的组（set）中，就说该缓存是组相联的；在组内，这个块可以放在任意位置；如果组中 n 个块，就叫做 n 路组相联。

### 4.1. full-associative

悲剧的被比较对象，性能很烂，我们现在不研究这个。

但是这种方式有个优点就是内存中的每个 line(注意到内存中是块存储的，为了方便理解这里也说得 line) 可以映射到任意的 cache line 中，从这个角度看，full-associate 效率更好，但是其查找过于复杂。

🧡🧡 言外之意在于，优秀的查找算法前提下，这种方式还是可以应用的。

### 4.2. direct-mapped

主要的思想是把内存分为 N 个 page, 每一个 page 的大小和 cache 相同，page 中的 Line 0 只能映射到 cache 中的 Line 0, 以此类推。

其示意图如下所示：

![direct-mapped](https://documentation-service.arm.com/static/5ff5c9fd89a395015c28fc8e?token=)

直接映射意味着确定的映射方式，如图中的 0x00, 0x40, 0x80 都只能映射到 Line 0 中。

### 4.3. set-associative

direvt-mapped 的方式是处理器上比较常用的，但是在某些特定的情况下会存在很大的缺陷，所以现代的商用处理器都是用 set-associative cache 来解决这个问题，这也是我们这节要研究的。

set-associative 将 cache 分成了多个 way, `direvt-mapped == 1 way set-associative`， 使用多少个 cache way 也是一种权衡的结果。

举例，以下是四路组相联的结构（一路是直接映射）：

| set | tag   | data  |     | tag   | data  |     | tag   | data  |     | tag   | data  |
|:---:| ----- | ----- | --- | ----- | ----- | --- | ----- | ----- | --- | ----- | ----- |
| 0   | way 0 | way 0 |     | way 1 | way 1 |     | way 2 | way 2 |     | way 3 | way 3 |
| 1   |       |       |     |       |       |     |       |       |     |       |       |
| …   |       |       |     |       |       |     |       |       |     |       |       |
| n   |       |       |     |       |       |     |       |       |     |       |       |

#### 4.3.1. Arm docs: Set associative caches

> With this kind of cache organization, the cache is divided into a number of equally-sized pieces, called *ways*.[^3]

cache 被分割成为了一些相同大小的块，称作 ways.

> A memory location can then map to a way rather than a line. The index field of the address continues to be used to select a particular line, but now it points to an individual line in each way. Commonly, there are 2- or 4-ways, but some ARM implementations have used higher numbers.

![arm_cache_set_ass](https://documentation-service.arm.com/static/5ff5c9fd89a395015c28fc56?token=)

如上图所示，这是一个 2-way cache 的结构示意图；在上图中：Data from address `0x00` (or `0x40`, or `0x80`) might be found in line 0 of either (but not both) of the two cache ways.

#### 4.3.2. Arm docs: A real-life example

![A real-life example](https://documentation-service.arm.com/static/5ff5c9fd89a395015c28fc35?token=)

Figure: a 4-way set associative 32KB data cache, with an 8-word(1 word equals 16 bits) cache line length. This kind of cache structure can be found on the Cortex-A7 or Cortex-A9 processors.

- cache line 的大小是 32 bytes(8 word = 8 * 32 bits =32 bytes, 注意一个 word 在 arm 中是 32bits)

- cache 总大小为 32KB

- 连接方式是 4 路组相连

由此我们可以计算出来，每个 way 的 cacheline 数量为：$32KB/4/32=256$, 所以我们每个 way 会有 256 条 cacheline. 这就意味着我们需要 8 bits 来在 way 中索引，在途中就是用 [12:5] 来索引的；除此之外，我们需要使用 [4:2] 来索引 cache line 中的 8 个 word. 剩下的 [31:13] 用于 tag.

❤️ 有一点需要注意的是，图中出现了 4 个 way 叠加处理，每个 way 都是由 256 条 cacheline 组成的；图中并未体现出多个 set，只画了一个 set. 现在再体会一下这句话：A way is a subset of the cache entries in a set that have the same index but different tags.

:::details Arm 原文参考

> The cache line length is eight words (32 bytes) and you have 4-ways. 32KB divided by 4 (the number of ways), divided by 32 (the number of bytes in each line) gives you a figure of 256 lines in each way. This means that you require eight bits to index a line within a way (bits [12:5]). Here, you must use bits [4:2] of the address to select from the eight words within the line, though the number of bits which are required to index into the line depends on whether you are accessing a word, halfword, or byte. The remaining bits [31:13] in this case will be used as a tag.

:::

#### 4.3.3. QA

1. 我们知道，cacheline 包括 tag, set index 和 offset bit, 其中 offset bit 用于定位数据在 cacheline 中具体的偏移，那么是如何仅根据一个 offset 就能确定具体的数据要取多少个 byte 呢？
   
   要解答这个问题，我们需要知道，在 ldr 或者其他访存类指令发出以后，CPU 是知道这次访问需要的数据大小的(byte); 我之前想不明白的是，是如何知道的呢？其实很简单，我们在指令上已经指定了需要访问的数据大小，如 `ldr x1, #234` 就是通过寄存器指定我们需要的访问是 16 字节。

### 4.4. Summary

三种方式的对比：

| 机制   | 组的数量              | 每组中块的数量     |
|:----:|:-----------------:|:-----------:|
| 全相联  | 1                 | cache 中块的数量 |
| 直接映射 | cache 中块的数量       | 1           |
| 组相联  | cache 中块的数量 / 相联度 | 相联度（通常2~16） |

增加相联度的好处通常是降低失效率，失效率的改进来自于减少对于同一位置的竞争而产生的失效。

三种方式进行查找的对比：

| 机制   | 定位方法         | 需要比较的次数  |
|:----:|:------------:|:--------:|
| 全相联  | 查找所有cache 表项 | cache 容量 |
|      | 独立的查找表       | 0        |
| 直接映射 | 索引           | 1        |
| 组相联  | 索引组，组中的元素    | 相联度      |

## 5. hit & miss

cache hit(命中)：读取时间 X 个 cycle

cache miss：读取时间 XX 或者 XXX 个 cycle

所以 hit 和 miss 有很大的性能差距。

### 5.1. Why cache miss?

有三种情况会导致 cache misss:

1. Compulsory miss, 必须的 miss，如第一次访问程序或者数据时，这些程序或者数据没有在 cache 中
2. Capacity miss, cache 容量满了的时候，新数据到来，需要重新搬移，就 miss 了；或者还存在一种情况是 cache 无法包含程序执行期间所需的所有块。
3. Conflict miss,  这种情况下，cache 可能还有空闲空间，但是这个地址对应的 cache line 已经被使用了，也会导致 cache miss.

```mermaid
flowchart LR
    1(3C)
    1.1(Compulsory miss, 强制失效)
    1.2(Capacity miss, 容量失效)
    1.3(Conflict miss, 冲突失效)
    1 --> 1.1 & 1.2 & 1.3
    1.2.1(增加cache)
    1.2 -.- 1.2.1
```

### 5.2. Ways to lower miss rate

#### 5.2.1. 使用较大的 block

较大的 blocks 利用空间局部性原理来降低 miss rate, 通常而言，增加块的大小会降低 miss rate, 但是其存在一个阈值，如果 block 的大小成为缓存很大的一部分，最终 miss rate 反而会上升，这是因为缓存中可以保存的块的数量变少，导致了很多竞争。

除此之外，使用较大的 blocks 会造成 cache 未命中的时候的代价变大，主要是体现在 cache 加载的时候(fetch the block), 这个过程分为两个部分：**the latency to the first word and the transfer**

🧡🧡🧡 我们可以获得一个启发：**如果我们可以设计方法降低较大的 block 的 transfer time, 那么我们就可以进一步改善缓存的性能。**

### 5.3. hide some transfer time

在使用较大的 block 的时候，我们采取一个**隐藏一些传输时间**的方法来减少未命中的惩罚。

- early start
- requested word first or critical word first

❌❌❌ 后续需要重点研究这两个算法。

### 5.4. Handling cache misses

- 缓存处理起来 hit 的工作相比于 miss 是微不足道的。
- cache miss handing 需要处理器控制单元和单独的控制器合作完成，这个单独的控制器启动内存访问、填充缓存
- 缓存未命中的处理会导致流水线 stall, 此时需要保存所有寄存器的状态
- 缓存未命中（处理指令未命中、处理数据未命中）会导致整个处理器暂停，冻结临时寄存器和程序员可见寄存器的内容，同时等待内存。（注意一下，乱序执行的处理器此时还可以允许执行指令）

处理缓存 miss 的步骤大概可以总结如下（主要研究指令 miss）：

1. 发送 PC 值到内存
   
   Since the program counter is incremented in the first clock cycle of execution, the address of **the instruction that generates an instruction cache miss** is equal to the value of the program counter minus 4.
   
   如何理解 the instruction that generates an instruction cache miss? 其实我们只要了解到，cache miss 以后，PC 寄存器向前走了，所以这时候我们需要向后走去找到这个 miss 的指令的地址，然后再去内存中找，就可以了！

2. 控制主存执行读取，并等待内存完成访问

3. 写入缓存，将内存中的数据放入缓存的数据部分，tag 写入地址（from ALU）的高位，并打开有效位

4. 重启指令的执行，这将重新读取指令，这是在缓存中就可以找到该指令

## 6. 置换策略

1. 随机
2. FIFO 先进先出
3. LRU 最近最少使用

LRU 我们使用的最多，并且性能也最好。

关于替换策略的选择，也有一些考量在里面，并不是 LRU 就一定是最好的，我们举例说明：

- 在相联度不低（2，4）的层次结构中实现 LRU 的代价太高，所以一般使用近似实现
- 随着 cache 容量变大，两种替换策略的性能差异也逐渐缩小
- 在虚拟存储中，使用 LRU 是因为失效代价很大，失效率的微小降低都显得十分重要；并且其失效相对不那么频繁发生，LRU 也可以由软件近似实现

## 7. Cache Write

所谓 cache 写，指的就是 cpu 修改了 cache 中的数据的时候，内存的数据也要随之改变。为了达到这个目的，cache 提供了几种写策略：

1. Write through
2. Write buffer
3. Write back

### 7.1. Write through

核心策略：每次 CPU 修改了 cache 中的内容，cache 立即更新（cache 控制器）内存中的内容。

这种方式会有大量写内存的操作，所以效率较低。

### 7.2. Write buffer

> A queue that holds data while the data are waiting to be written to memory.

Write buffer 中保存了准备写入内存的数据，处理器同时写入 cache 和 write buffer, 而在写入主存完成后，write buffer 中的数据就 free 掉了。

这种方法的缺点在于，如果这个 write buffer 已经满了，那么处理器来写这个的时候必须停止，等待 write buffer 中出现新的空位。

这个之中还有一个矛盾在于，如果处理器生成写入的速率大于内存可以完成的写入速率，那么拿什么 write buffer 都不会起作用的。

### 7.3. Write back: dirty

核心策略：CPU 或者内核修改了 cache 中的内容的时候，cache 不会立即更新内存内容，而是等到这个 cache line 因为某种原因需要从 cache 中移除的时候，cache 才去更新内存中的内容。

cache 为了知道某个 line 的内容有没有被修改，于是增加了一个新的标志位：**dirty**, 增加以后的 cache line 结构如下所示：

| dirty | valid | tag | block |
| ----- | ----- | --- | ----- |

具体的 dirty 的用法如下：

- dirty 位为 1, 表示这个数据已经被修改
- dirty 位为 0, 表示这个数据和内存中的数据是一致的

程序 cache 不需要 dirty 标志位，数据 cache 需要 dirty 标志位。

几个特点：

> By comparison, in a write-through cache, writes can always be done in one cycle.

很多 write back 策略还包括着 write buffer 用于在 miss 的时候减少 miss 惩罚，是这么做的：修改后的块被移动到 write buffer 中，Assuming another miss does not occur immediately, this technique halves the miss penalty when a dirty block must be replaced.

### 7.4. Write miss

Write miss 这个第一眼看过去似乎是比较奇特的，写也会 Miss 吗？当然会了，这里的写 miss 指的是没有写在缓存里面。

考虑 write through 场景下的一个 write miss, 在 write through 中，有两种策略：

1. write allocate
   
   在缓存中分配一个 block, 然后用内存中的 block 覆盖之。

2. no write allocate
   
   更新内存中的 block, 但是不放入 cache 中。这种场景可能适用于计算机清零某一页的内容这样的情况，有些计算机是允许按页更改写入分配策略的。

## 8. cache 一致性

### 8.1. Example

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

### 8.2. Write invalidate

置无效，其核心思想为：当一个 core 修改了一份数据，其他 core 上如果有这份数据的复制，就置为无效。

这种方法的优点在于，比较简单，而且无效标志位 valid 在 cache line 中有对应的字段，这意味着置无效就是把 cache 的一个 line 直接写为无效了，这个 cache line 中其他有效的数据也不能被使用了。

大部分处理器都使用这个操作。

### 8.3. Write update

写更新：当一个内核修改了一份数据，其他的地方如果有这份数据的赋值，就更新到最新值。

其缺点是会产生频繁的更新动作。

## 9. cache 一致性协议

### 9.1. MESI

主要研究基于 Write invalidate 的一致性协议。比较经典的协议就是 MESI 协议。

复习一下：cache line 中有两个字段是 dirty 和 valid, 分别表示数据是否被修改和数据是否有效。但是在多核处理器中，多个核会存在共享数据的情况，MESI 协议就可以描述这种共享状态。

MESI 协议中有 2 bit 用于 cache line 的状态位，如下表：

| 状态  | 全程        | 描述                                     |
| --- | --------- | -------------------------------------- |
| M   | Modified  | 这行数据被修改了，和内存中的数据不一致                    |
| E   | Exclusive | 这行数据有效，数据和内存中一致，数据只存在于本 core 的 cache 中 |
| S   | Shared    | 这行数据有效，数据和内存中一致，数据存在于很多 cache 中        |
| I   | Invalid   | 这行数据无效                                 |

M 和 E 需要重点理解一下，很明显这四个状态是互斥的，也就是说：

- 状态为 M 的时候，这行数据是 dirty 的，但是数据是这个 cache 独有的。除了这个 M 意外，其他的状态下数据都是 clean 的（无效状态是无效的）
- 状态位 E 的时候，这行数据是 clean 的，并且数据是这个 cache 独有的
- 状态位 S 的时候，这行数据是 clean 的，cache 可以从其他 cache 处同步数据，也可以从内存处同步，协议对此没有做任何要求。

在 MESI 协议中，**cache 控制器**是可以监听 snoop 其他的 cache 的读写操作。

### 9.2. Other MESI

AMD 演化了 MOESI 协议，多了一个 O 状态，这个状态是 S 和 M 状态的一种合体，表示本 cache line 中的数据和内存中的数据不一致，不过其他的核可以有这份数据的复制，复制了这份数据的核的这行 cache 的状态为 S.

Intel I7 演化了 MESIF 协议，多的 F 状态表示 Forward, 其含义是可以把数据直接传给其他内核的 cache, 而 shared 则不能。

MESIX 统一都可以称为监听协议(snoop)，监听协议的缺点在于沟通成本很高，所以有一种集中管理的目录协议，可以后续研究。

## 10. 片内可寻址存储器

通常而言，cache 对用户（程序员）是透明的，但是在 DSP 等性能要求很高的处理器中，处理器存储的一部分作为 cache, 另一部分作为可寻址寄存器，程序员可以直接访问这部分空间。

这种在做法可以有效地控制 cache miss, 所以我们也称片内可寻址寄存器为：**软件管理的 cache**.

片内可寻址寄存器的应用：一般而言，cache 是等到 CPU 要使用数据的时候，才从内存中去拿数据的，片内可寻址寄存器可以通过软件控制 DMA，将以后需要的数据提前搬到处理器内部，这就节省了很多 CPU 的等待时间。DMA 是专门负责数据搬移的模块。

为什么会是软件去做这件事呢？因为程序是可以知道 CPU 什么时候将要访问数据的，而 cache 不知道。但是这种方法对软件的编写难度造成了很大的挑战。

## 11. Bypass

> In addition, some CPU instructions may be explicitly **designed to bypass the cache**. For example, some architectures have special **instructions** that allow the CPU to read or write data directly to main memory **without going through the cache**. These instructions are typically used for low-level system operations that require direct access to the main memory or for performance-critical applications where caching may introduce additional latency or overhead.

在 ARM 中，无需访问 cache 直接获取数据的指令有：

> the ARM architecture has several special instructions that allow the CPU to bypass the cache and access data directly from the main memory or peripheral devices. Here are a few examples:
> 
> 1. LDM/STM instructions: The Load Multiple (LDM) and Store Multiple (STM) instructions allow the CPU to load or store multiple registers directly to or from the main memory without going through the cache. These instructions are commonly used for low-level system operations such as interrupt handling and context switching.
> 2. LDR/STR instructions with the "B" flag: The Load Register (LDR) and Store Register (STR) instructions have a "B" flag that allows the CPU to bypass the cache and access data directly from the main memory. This flag is typically used for performance-critical applications where caching may introduce additional latency or overhead.
> 3. DMA instructions: The Direct Memory Access (DMA) instructions allow the CPU to bypass the cache and transfer data directly between the main memory and peripheral devices. These instructions are commonly used for high-speed data transfer operations such as video and audio processing.
> 
> Overall, the ARM architecture provides several special instructions that allow the CPU to bypass the cache and access data directly from the main memory or peripheral devices, depending on the specific requirements of the application or system.

## 12. Others

### 12.1. 内存对齐

为什么要内存对齐(memory memory)[^2]：

1. 平台原因：不是所有的硬件平台都可以访问任意地址上的任意数据，某些平台只能在特定的地址处取某些特定类型的数据，否则抛出硬件异常。
2. 性能原因：如果访问未对齐的内存，处理器需要两次访存操作；而对齐的内存只需要一次访存操作。

## 13. Reference

[^1]: Computer Organization and Design_ The Hardware Software Interface_ ARM Edition
[一文轻松理解内存对齐](https://cloud.tencent.com/developer/article/1727794)

[^3]: [Set associative caches](https://developer.arm.com/documentation/den0013/d/Caches/Cache-architecture/Set-associative-caches)
