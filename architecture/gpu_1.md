---
title: GPU 体系结构
date: 2025-03-06
category:
  - GPU
  - AI
---

## 1. 量化研究方法

## 2. 4.4 图形处理器

CPU 程序员的挑战不只是在 GPU 上获得出色的性能，还有==协调系统处理器与 GPU 上的计算调度，以及系统存储器与 GPU 存储器之间的数据传输==。

GPU 中的并行：多线程、MIMD、SIMD 和指令级并行。

NVIDIA 将 CUDA 编程定义为 **SIMT** -- ==单指令多线程==。

并行执行和线程管理由 GPU 硬件负责，而不是由应用程序或者操作系统完成。[详解见 Q1](#q1)

>  The hardware Thread Block Scheduler assigns Thread Blocks to multithreaded SIMD Processors, and the hardware Thread Scheduler picks which thread of SIMD instructions to run each clock cycle within a SIMD Processor.

硬件线程块调度器（Thread Block Scheduler）将线程块（Thread Blocks）分配给多线程 SIMD 处理器（multithreaded SIMD Processors），而硬件线程调度器（Thread Scheduler）在每个时钟周期内选择要在 SIMD 处理器中运行的 SIMD 指令线程（thread of SIMD instructions）。详细解释见 [Q2](#q2)


## 3. Q1

> 并行执行和线程管理由 GPU 硬件负责，而不是由应用程序或者操作系统完成。

这句话的含义是：在 GPU 中，并行任务的执行和线程调度完全由硬件架构直接管理，而非依赖应用程序或操作系统的软件层面控制。这种设计使得 GPU 能够高效实现大规模并行计算，同时降低编程复杂度。

### 3.1. 具体解释

以下是具体解释：

**硬件直接管理并行执行**：GPU 通过 **SIMT（单指令多线程）** 架构实现并行性。其核心思想是：单条指令同时控制多个线程，这些线程**共享指令流但处理不同的数据**。例如，一个线程束（Warp）包含 32 或 64 个线程，由硬件调度器自动分配到流多处理器（SM）的计算单元上执行。同一 Warp 内的线程必须执行相同指令，但每个线程的数据路径独立，因此可以灵活处理分支逻辑（如条件判断）。
相比之下，CPU 的并行执行依赖操作系统的线程调度（如多核任务分配），而 GPU 的线程调度完全由硬件实现，无需软件介入。

**线程模型的硬件抽象**：GPU 的编程模型（如 CUDA）提供了线程网格（Grid）、线程块（Block）和线程（Thread）的逻辑划分，但实际的线程分配与执行由硬件完成：

- 线程网格（Grid）：由多个线程块组成，表示整个计算任务的规模。
- 线程块（Block）：一组线程的集合，绑定到一个流多处理器（SM）上执行。同一块内的线程可通过共享内存协作。
- 线程（Thread）：最小执行单元，由硬件直接调度。
程序员只需定义线程结构（如 `>>`），硬件自动将线程块分配到 SM，并通过线程调度器管理 Warp 的执行顺序，隐藏内存延迟。

**硬件资源的自动分配**：GPU 的硬件设计专门优化了线程管理：

- 流多处理器（SM）：每个 SM 包含多个计算核心（CUDA Core）、共享内存、寄存器文件等资源。SM 可同时运行多个线程块，通过上下文切换（Context Switch）高效利用硬件资源。
- 线程调度器：SM 中的调度器（如 Warp Scheduler）根据线程状态（如是否等待数据）动态选择可执行的 Warp，最大化硬件利用率。
- 内存层次：全局内存、共享内存等的访问由硬件自动优化，减少程序员对内存延迟的显式处理。

### 3.2. 举例：Grid/Block/Thread

关系的示意图如下所示：(图中表示 $A = B * C$, 两个向量相乘，每个向量的长度为 8192 个元素)。

1. 每个 SIMD 线程指令计算 32 个元素；
2. 每个线程块包含 16 个 SIMD 线程；
3. 网格包含 16 个线程块。

![a](./images/Pasted%20image%2020250310191138. png =400x)



### 3.3. 与 CPU 的对比

CPU：依赖操作系统管理线程调度（如多核任务分配），线程切换和资源分配由软件控制，适合复杂逻辑和低延迟任务。

GPU：硬件直接管理线程，通过 SIMT 架构和大量线程掩盖内存延迟，适合数据并行任务（如矩阵运算、图像处理）。

总结：GPU 的硬件设计使得并行执行和线程管理成为“黑箱”，程序员只需关注任务的并行划分（如线程块大小），而具体的线程调度、资源分配和延迟隐藏均由硬件自动完成。这种设计大幅提升了并行计算效率，同时降低了编程复杂度。

**GPU 的硬件设计如何隐藏线程管理细节并提升并行计算效率**

GPU（图形处理器）的架构与传统 CPU 有着根本性的不同，它专为大规模并行计算优化，能够同时运行成千上万个线程。GPU 之所以能够高效执行并行计算，关键在于其硬件设计隐藏了线程调度、资源分配以及延迟隐藏的复杂性，使得开发者只需要关注任务的并行划分，而无需直接管理底层的并行执行细节。

---

#### 3.3.1. GPU 线程管理的“黑箱”特性

在 GPU 上，程序员通常通过 CUDA（NVIDIA）或 HIP（AMD）等并行计算框架，定义计算任务的并行性。开发者需要做的主要工作是：

• 确定数据并行模式：任务如何划分为多个线程进行处理。

• 选择线程块大小（Thread Block Size）：GPU 计算通常基于“线程块（Thread Block）”的概念，程序员需要决定每个块中的线程数。

• 确定网格（Grid）结构：将线程块映射到更大范围的计算任务。

然而，一旦任务被划分好，线程的具体执行顺序、分派到哪个计算单元、如何进行调度、如何隐藏延迟等，完全由 GPU 硬件自动管理，这与**传统 CPU 上需要开发者手动优化线程调度**和同步的做法形成鲜明对比。

---

#### 3.3.2. GPU 自动完成的线程管理机制

GPU 硬件通过多个机制隐藏线程管理细节，从而优化计算效率：
  

**(1) 线程调度（Warp Scheduling）**

GPU 的基本执行单元是“Warp”或“Wavefront”（如 NVIDIA 的 Warp 由 32 个线程组成，AMD 的 Wavefront 通常为 64 个线程）。GPU 的硬件调度器负责：

- 自动分配 Warp 到计算单元（Streaming Multiprocessors, SM）
- 在不同 Warp 之间交错执行，以最大化硬件利用率
- 屏蔽不同线程的执行细节，开发者不需要关心线程具体如何被调度

例如，在 CPU 上，如果多个线程争夺相同的核心，可能会导致复杂的上下文切换（context switch），而 GPU 通过“零开销线程切换”机制，在一个 Warp 执行遇到内存访问延迟时，硬件可以快速切换到另一个 Warp，隐藏延迟，从而提高计算效率。

  

**(2) 资源分配（Register & Shared Memory Management）**

GPU 采用分层存储架构，包括：

• 寄存器（Register File）

• 共享内存（Shared Memory）

• 全局内存（Global Memory）

• 纹理/常量内存（Texture/Constant Memory）

  
不同线程块的资源分配由硬件自动管理：

- GPU 会根据线程块的大小，自动划分可用的寄存器和共享内存，**确保线程间不会发生资源冲突**
- 程序员无需手动管理内存访问模式，硬件会自动进行 **数据合并（Memory Coalescing）** 以优化内存访问

在 CPU 上，开发者需要手动进行缓存优化，而在 GPU 上，很多缓存优化（如 L2 Cache、共享内存）由硬件完成，大大减少了程序优化的复杂度。

  

**(3) 延迟隐藏（Latency Hiding）**


CPU 主要依靠深度流水线（Deep Pipeline）和分支预测（Branch Prediction） 来减少指令执行的延迟，而 GPU 采用了**大规模线程切换（Thread-Level Parallelism, TLP）** 来隐藏延迟：

- 当某个 Warp 等待内存访问时，GPU 硬件会自动调度另一个 Warp 执行，避免计算单元空闲
- 这种策略能够充分利用 GPU 的超大存储带宽（如 HBM 高带宽存储），在数百至数千个线程间动态调度计算任务

这种延迟隐藏机制使得程序员不需要像在 CPU 上那样进行复杂的流水线优化、寄存器重命名等，而是交给 GPU 硬件自动优化。

---

#### 3.3.3. GPU 这种硬件设计的优势

  
**(1) 降低编程复杂度**

由于线程管理和调度均由硬件完成，开发者只需要关注：

• 如何划分计算任务

• 如何选择合理的线程块大小

• 如何优化数据访问模式（如避免共享内存冲突）

相较于 CPU 上需要手动管理线程、同步、缓存等，GPU 的这种设计大大降低了并行编程的门槛，使得更多开发者能够利用 GPU 进行加速计算。

  
**(2) 提升并行计算效率**

• 由于 GPU 能够同时管理数万个线程，并通过自动调度 Warp 来优化资源利用率，使得 GPU 在数据并行任务上展现出极高的吞吐率

• 通过零开销线程切换，GPU 在面对高延迟操作（如全局内存访问）时依然能够保持高效执行，而 CPU 可能会因为缓存未命中导致停滞

• 通过自动资源分配和寄存器优化，避免了 CPU 上需要手动进行的复杂优化

  
**(3) 适用于大规模计算任务**

GPU 的这种设计特别适合：

- 深度学习和 AI 训练（如 TensorFlow、PyTorch）：因为矩阵计算可以高度并行化

- 科学计算和 HPC（如气候模拟、基因计算）：涉及大量浮点运算的任务

- 大规模图形渲染（如游戏和视觉计算）：GPU 本就是为并行渲染设计的

- 数据库加速（如 GPU 加速 SQL 查询）：高吞吐率可以显著提升查询性能

---

#### 3.3.4. 结论

GPU 通过将**线程调度、资源分配、延迟隐藏等低层细节封装在硬件中**，使得开发者能够更专注于任务的并行划分，而无需关心具体的线程管理。这种“黑箱”设计使得 GPU 能够高效执行大规模并行计算任务，同时大幅降低了并行编程的复杂度，从而推动了 AI、HPC、图形渲染等领域的快速发展。

这种架构的核心理念是**让硬件管理并行性，让开发者专注于计算逻辑**，从而最大化计算资源的利用率，实现高效的并行计算。
## 4. Q2

>  硬件线程块调度器（Thread Block Scheduler）将线程块（Thread Blocks）分配给多线程 SIMD 处理器（multithreaded SIMD Processors），而硬件线程调度器（Thread Scheduler）在每个时钟周期内选择要在 SIMD 处理器中运行的 SIMD 指令线程（thread of SIMD instructions）。

这句话描述了 GPU 内部的线程块调度（Thread Block Scheduling） 和线程调度（Thread Scheduling） 两个层次的机制，并且强调了线程调度是逐个时钟周期进行的，也就是在每个 SIMD 处理器内部的指令选择是动态的。

### 4.1. 硬件线程块调度器 （Thread Block Scheduler）

1. 负责将线程块（Thread Blocks） 分配给多线程 SIMD 处理器（Multithreaded SIMD Processors）。
2. 在 GPU 计算模型（如 CUDA、HIP、OpenCL）中，一个计算任务通常会被划分成多个线程块，每个线程块内部包含多个线程（Threads）。
3. 由于 GPU 由多个 SIMD 处理单元（如 Streaming Multiprocessors（SM） 或 Compute Units（CU））组成，因此需要线程块调度器负责把任务均匀分配到这些处理单元上。

如果一个 GPU 有 8 个 SIMD 处理单元，而计算任务包含 64 个线程块，线程块调度器可能会将每个 SIMD 处理单元分配 8 个线程块，确保所有计算单元都参与计算，从而最大化吞吐量。

---

### 4.2. 硬件线程调度器 （Thread Scheduler）

- 负责在每个 SIMD 处理器内部，每个时钟周期（clock cycle） 选择一个要执行的 SIMD 指令线程（thread of SIMD instructions）。

- 由于 GPU 采用 SIMT（Single Instruction, Multiple Threads） 计算模式，每个 SIMD 处理单元可以同时执行多个 Warp（NVIDIA）/Wavefront（AMD），但由于计算资源有限，必须在多个候选线程中选择合适的线程执行。

**关键点：**

1. 多个 Warp/Wavefront 竞争执行权：在一个 SIMD 处理单元内部，可能有几十到上百个 Warp/Wavefront 处于就绪（ready） 状态，但一次只能执行一个 Warp/Wavefront 的 SIMD 指令。

2. 调度发生在每个时钟周期：线程调度器在每个时钟周期（clock cycle） 都会选择一个 Warp/Wavefront，执行它的下一条 SIMD 指令。

3. 影响调度决策的因素：

	- 指令依赖性（Instruction Dependencies）： 如果某个 Warp/Wavefront 需要的数据还没准备好，调度器可能会跳过它，选择另一个 Warp/Wavefront。
	- 寄存器压力（Register Pressure）： 如果某个 Warp/Wavefront 占用了太多寄存器，可能会降低调度器的灵活性。
	- 内存访问延迟（Memory Latency）： 如果某个 Warp/Wavefront 需要访问 DRAM，调度器可能会选择另一个不受内存访问限制的 Warp/Wavefront 先执行。

### 4.3. 示例 

假设一个 SIMD 处理器可以并行执行 32 个线程（即 1 个 Warp/Wavefront），但它可能维护了 64 个 Warp/Wavefront 在等待执行。

线程调度器会在每个时钟周期选择一个就绪（ready） 的 Warp/Wavefront，执行其中的 SIMD 指令。

如果某个 Warp/Wavefront 的内存访问未完成，线程调度器可能会选择另一个已经准备好执行的 Warp/Wavefront，以隐藏延迟（latency hiding）。

---

### 4.4. 总结

**Thread Block Scheduler（线程块调度器）**：
- 作用： 负责在多个 SIMD 处理单元（如 SM/CU） 之间分配线程块（Thread Blocks）。
- 目标： 确保所有 SIMD 处理单元都参与计算，提高吞吐量。

**Thread Scheduler（线程调度器）：**
- 作用： 负责在每个 SIMD 处理单元内部，每个时钟周期（clock cycle） 选择一个 Warp/Wavefront，执行其中的 SIMD 指令。
- 目标： 通过动态调度 Warp/Wavefront，最大化计算资源的利用率，同时隐藏内存访问延迟。

---

### 4.5. 直观比喻

可以把整个 GPU 计算过程比作工厂流水线：

1. Thread Block Scheduler 类似于车间经理，负责把不同的任务分配给多个生产线（SIMD 处理单元）。
2. Thread Scheduler 类似于生产线上的调度员，每秒钟（每个时钟周期）都要决定当前哪条生产线上的工作站（Warp/Wavefront）应该执行下一步任务。

这样，GPU 通过多层次调度，在硬件层面实现高吞吐量并行计算，有效地利用计算资源。