# Value Prediction

## Value Prediction in a Nutshell

> Value Prediction (VP) is a microarchitectural technique that speculatively breaks true data dependency to increase instruction level parallelism in out-of-order processor cores.[^1]

- branch prediction but for values

MICRO Test of Time Award[^2] 是一个十分具有分量的奖项，收录了微体系结构中经典的具有影响力的论文，关于 VP 的论文 <[ Exceeding the Dataflow Limit Via Value Prediction](http://dl.acm.org/citation.cfm?id=243889)>[^3] 就是 2017 年被该奖项收录。

## MICRO 29

### Abstract

本章节主要研究 *Exceeding the dataflow limit via value prediction* 这篇文章，这篇文章作为经典的 VP 的顶尖著作之一，具有很高的研究价值。

### Taxonomy of Speculative Execution

```mermaid
flowchart TD
	0(Speculative Execution)
	1(Control Speculation)
	2(Data Speculation)
	0 --- 1 & 2
	1.1(Branch Direction \n binary)
	1.2(Branch Target \n mutil-valued)
	1 --- 1.1 & 1.2
	2.1(Data Location)
	2.2(Data Value \n mutil-valued)
	2 --- 2.1 & 2.2
	2.1.1(Aliased \n binary)
	2.1.2(Address \n mutil-valued)
	2.1 --- 2.1.1 & 2.1.2
```

- 对于 Data Speculation 而言，我们分类：预测是否与数据的**位置**或者**值**有关。

- 对于 binary vs mutil-valued 而言，binary 表示的是预测的两种结果，0-1 或者 token vs not-token(branch 中表示 branch 的方向)，mutil-valued 表示的是 brach 的目标，这个目标可能是存在于程序地址的任何空间中的。

### Data Speculation

可以分为两类：

1. those that speculate on the storage location of the data: 存储位置
2. those that speculate on the actual value of the data: 实际的值

对于推测存储位置存在两种 flavor:

1. those that speculate on a specific attribute of the storage location
2. those that speculate on the address of the storage location

### Value Locality

> previously-seen value recurring repeatedly within a storage location.

以前看的的值在存储位置中重复出现。

> Although the concept is general and can be applied to any storage location within a computer system, we have limited our current study to examine only the value locality of general-purpose or floating point registers immediately following instructions that write to those registers.

目前限制了这个 Value Locality 的范围在通用寄存器或者浮点寄存器紧跟着写到这些寄存器指令之后的场景。

不过哪怕是寄存器，以 32-bit 举例，也可能会存在超过 2^32 的值，我们要怎么才能做到预测下一个可能出现的值呢？

> As it turns out, if we narrow the scope of our prediction mechanism by considering each **static instruction** individually, the task becomes much easier and we are able to accurately predict a significant fraction of register values being written by machine instructions.

这篇文章使用了 20 个 benchmark 总结出来了寄存器的 value locality,  特别是 signal cycle 的指定操作寄存器的 value locality 更加明显。

### Exploiting Value Locality

```mermaid
flowchart LR
	0(Exploiting Value Locality)
	1(Value Prediction Unit)
	2(Verifying Predictions)
	0 --- 1 & 2
```

### Value Prediction Unit

文章提出了 VP 单元的两级预测结构：

```mermaid
flowchart TD
	PC(PC of pred. instr.)
	PC --> CT & VPT
	3[\Predicted Value/]
	subgraph CT [Classification Table  CT]
	direction LR
	1.1(valid)
	1.2(pred history)
	1.1 -.- 1.2
	end
	subgraph VPT [Value Prediction Table VPT]
	direction LR
	2.1(valid)
	2.2(value history)
	2.1 -.- 2.2
	end
	CT --> 3
	VPT --> 3
	
	4([Prediction Result]) --> CT
	5([Updated Value]) --> VPT
```

我们对这张图片进行分析：

> the Classification Table (CT) and the Value Prediction Table (VPT), both of which are direct-mapped and indexed by the instruction address (PC) of the instruction being predicted.

> The PC of the instruction being predicted is used to index into the VPT to find a value to predict.

PC 中的指令用于 index 进去 VPT, 找到需要预测的值。与此同时，CT 也被 Index 用于用于决定是否进行预测。当指令完成的时候，*pred histstory* 和 *value history* 两个字段都被更新了。



#### CT

- valid

> The valid field, which consists of either a single bit that indicates a valid entry or a partial or complete tag field that is matched against the upper bits of the PC to indicate a valid field.

这句话主要的意思是：由单个 bit 位组成，表示一个有效的 entry 或者一部分或完整的 tag 字段，与 PC 的高比特位匹配，表示有效的 field.

- prediction history

​		1 bit 或者更多位的 saturating counter(饱和计数器)， 某个预测正确或者错误的时候，这一位的字段增加或者减少。

​		除此之外，还可以将指定分类为可预测和不可预测；这种预测用于决定是否预测特定指令的结果。换言之，CT 将指令分为了两类：通过 VPT 预测和指令和不通过 VPT 预测的指令。

> Increasing the number of bits in the saturating counter adds hysteresis to the classification process and *can help avoid erroneous classifications by ignoring anomalous values and/or destructive interference.*

​	需要注意，增加饱和计数器的 bit 位可能会增加分类过程中的 hystersis(迟滞)；这个迟滞可能的意思是说，增加 bit 位导致的预测结果集后移，这种迟滞，如以前 2-bit, 2 and 3 是预测，3-bit 而言 可能需要 4 以后才可以预测，这就是迟滞。

对于 CT 和 VPT 的相互关系：

> The VPT replacement policy is also governed by the CT prediction history to introduce  hysteresis and avoid replacing useful values with less useful ones.

VPT 的替换策略受到 CT 预测历史的影响，这是为了避免引入不必要的错误值。

总结：

1. 用于在预测正确或者错误的时候饱和计数器自增或者自减
2. 用于对某个指令分类，该指令是否可预测

#### VPT

VPT 的这两个字段的含义说明如下：

- tag

  同 CT，由单个 bit 有效位或者完整或者部分标记。

- value history

  包括 32-bit 或者 64 bit 的值，这些值由 LRU 策略维护（that are maintained with an LRU policy）；当第一次产生指令结果或者预测不正确的时候，这个字段被替换掉。

  需要注意的是，VPT 的替换策略收到 CT 预测历史的影响，以免用了不那么有用的值替换掉有用的值。

### Verifying Predictions

由于值预测本来就是投机性的，所以需要一种机制来验证预测的正确性，并且从错误预测中恢复过来。



## HPCA 19

### Abstract

本章主要研究 HPCA 19 的 *Efficient Load Value Prediction using Multiple Predictors and Filters[^4]*.

首先阐述 VP 的重大意义：

> Value prediction has the potential to break through the performance limitations imposed by true data dependencies.

然后概述使用了比较多的篇幅来说明提升 VP 的预测精度需要硬件帮助，因此本文提出了一种：

>  In this paper, we **analyzed four state-of-the-art load value predictors**, and found that they complement each other.

基于上述的 load value, 作者提出了一个新的复合预测期。

> Based on that finding, we evaluated a **new composite predictor** that combines all four component predictors. 

### Introduction

more ILP, true data limit.

ILP 指的是 Instruction Level Parallelism, 指令级并行。

> In the case of load instructions, it is also possible to predict a load memory address, followed by a data cache access, to generate a speculative value that does not necessarily exhibit value locality.

这个技术可以再研究一下。

### Predictors

本文使用了 4 个先进的预测器，并对他们进行了融合，融合过后的组合预测器性能得到了很大的提升，这 4 个预测器如下表所示：

|                  | Predicts                       | Predicts                         |
| ---------------- | ------------------------------ | -------------------------------- |
|                  | Load values                    | Load addresses                   |
| Context agnostic | Last Value Prediction (LVP)    | Stride Address Prediction (SAP)  |
| Context aware    | Context Value Prediction (CVP) | Context Address Prediction (CAP) |

从表中我们可以看出，本文一共使用的四个预测器，并且可以分类为基于地址的、基于 value 的、上下文是否感知的，本文对这些预测器进行了一个排序（使用顺序，在预测的时候先使用哪个，后使用哪个），我们根据这个排序对这 4 个预测器进行简单的介绍：

1. LVP[^5]
2. CVP
3. SAP
4. CAP

#### LVP

LVP[^5]这个预测器的原理在于：*that consecutive dynamic instances of a static load will often produce the same value*, 翻译过来就是说静态 load 的连续动态实例通常会产生相同的值。

这个预测器是对上下文不感知的。

这边举了两个例子，还需要再深入理解一下，或者去阅读一下原文。

第一个例子（接上面的英文原文）：

> This commonly occurs, for example, with PC-based loads that read large constants.

第二个例子：

> The pattern can also occur when dynamic instances of a static load produce different addresses, such as when sequencing through an array just initialized with memset.

上述两个例子都是举例说明了 LVP 的一些场景。

LVP uses a PC-indexed, tagged prediction table. 其结构如下：

| 14-bit | 64-bit | 3-bit                         |      | 81 bits(total) |
| ------ | ------ | ----------------------------- | ---- | -------------- |
| tag    | value  | saturating confidence counter |      | a entry        |

> LVP is trained when a load executes by hashing the PC bits of a load to access an entry and then updating the entry’s tag and value.

❌❌❌ load PC 的关系不明确，导致这段话不能理解。

目前可以看出来的是，PC 中的一些比特位通过 hash 的方式索引到 LVP 表中的 entry,  一般而言，是对比 tag, 然后看其对应的置信值是否大于阈值。

这个预测器如果遇到了 tag/value 匹配的话，我们就增加置信值，否则不匹配的话，置信值归零。



### Value Prediction

#### Strategies

使用一个 forward probabilistic counter(FPC) 可以减少数字的比特，这个在其他论文中提到了。

目前的理解：使用标量构建置信度，然后再计算出对应的 FPC 矢量。

## Words

| Words              | 含义               |      | Words       | 含义       |
| ------------------ | ------------------ | ---- | ----------- | ---------- |
| impose             | 强制实行、强制推行 |      | Speculation | 推测、猜测 |
| narrow             | 有限的、小的       |      | saturating  | 饱和       |
| hysteresis         | 回差、滞后         |      | speculative | 投机性的   |
| saturating counter | 饱和计数器         |      | govern      | 统治、管理 |
| composite          | 组合、复合         |      | probed      | 探测       |
| mitigate           | 使缓和、使减轻     |      | redundancy  | 冗余       |

饱和计数器理解：对于 2-bit 计数器来说，0 or 3 就是到了饱和的状态，此时自增或者自减都是不会改变值的，所以就饱和了。

## Reference

[^1]: [Championship Value Prediction (CVP)](https://www.microarch.org/cvp1/index.html)
[^2]: [MICRO Test of Time Award](https://www.microarch.org/tot/index.html#winners)
[^3]: M. H. Lipasti and J. P. Shen, "Exceeding the dataflow limit via value prediction," Proceedings of the 29th Annual IEEE/ACM International Symposium on Microarchitecture. MICRO 29, 1996, pp. 226-237, doi: 10.1109/MICRO.1996.566464.
[^4]: R. Sheikh and D. Hower, "Efficient Load Value Prediction Using Multiple Predictors and Filters," 2019 IEEE International Symposium on High Performance Computer Architecture (HPCA), 2019, pp. 454-465, doi: 10.1109/HPCA.2019.00057.
[^5]: Mikko H. Lipasti, Christopher B. Wilkerson, and John Paul Shen. 1996. Value locality and load value prediction. In Proceedings of the seventh international conference on Architectural support for programming languages and operating systems (ASPLOS VII). Association for Computing Machinery, New York, NY, USA, 138–147. https://doi.org/10.1145/237090.237173



