---
title: Numa and Socket
date: 2022-08-25
category:
  - Arm
  - Computer Architecture
tags:
  - cpu
---

## 1. GPT

### 1.1. NUMA & Socket

在服务器架构中，NUMA（Non-Uniform Memory Access）和 Socket（CPU 插槽）是紧密相关但又不同的概念：

**1. NUMA 体系结构**

NUMA 是一种内存访问架构，在多处理器系统中，每个 CPU 访问本地内存的速度比访问远程（其他 CPU 连接的）内存更快。NUMA 的关键点：

• 每个 NUMA 节点（Node）包含一个或多个 CPU 核心及其本地内存。

• 访问本地 NUMA 节点的内存（Local Memory）速度更快，而访问远程 NUMA 节点的内存（Remote Memory）则会有更高的延迟。
  
**2. Socket（CPU 插槽）**

Socket 是物理概念，表示主板上可以安装一个物理 CPU（或者多个 Die 组成的 CPU ）。现代服务器通常有多个 CPU Socket。

**3. NUMA 和 Socket 的关系**

• <font color="#f79646">单 Socket 服务器</font>：如果是单 CPU（单 Socket），那么所有的 CPU 核心共享相同的内存，没有 NUMA 架构，属于 **UMA（Uniform Memory Access）**。

• <font color="#f79646">双 Socket 或多 Socket 服务器</font>：每个物理 CPU 插槽通常对应一个 NUMA 节点，每个 NUMA 节点有自己的本地 DRAM 控制器。

• CPU 之间通过 **Infinity Fabric（AMD）或 UPI（Intel）** 互连，访问远程 NUMA 节点的内存。

例如，在 2 Socket 服务器中：

- Socket 0 -> NUMA Node 0 -> 本地 DRAM 0

- Socket 1 -> NUMA Node 1 -> 本地 DRAM 1

- Socket 0 访问 NUMA Node 1 的内存会有更高延迟。

### 1.2. Chiplet 设计下的 NUMA

AMD EPYC 处理器采用 Chiplet（小芯片）架构，一个物理 CPU 内部可能包含多个 CCX（Core Complex） 或 CCD（Core Complex Die），每个 CCD 可能会形成一个 NUMA 节点。

例如：

- 64 核 EPYC CPU 可能有 8 个 CCD，每个 CCD 可能是一个 NUMA 节点（NUMA per CCD）。

- 也可以通过 BIOS 配置，将多个 CCD 组合成较少的 NUMA 节点（NUMA per Socket）。

### 1.3. 总结

|**术语**|**概念**|
|---|---|
|Socket|物理 CPU 插槽，安装一个 CPU|
|NUMA|内存访问架构，优化多 CPU 系统的内存访问|
|NUMA Node|由一个 CPU（或 Chiplet）及其本地内存组成的单元|
|多 Socket 服务器|每个 Socket 可能是一个 NUMA 节点|

不同架构下，NUMA 和 Socket 的映射关系可能有所不同，在优化软件性能时，需要考虑 NUMA 亲和性（NUMA Affinity），合理调度 CPU 线程和内存，以减少远程访问延迟。

## 2. GPT - 一个比喻

好的，我们用一个形象的比喻来解释 NUMA 和 Socket 的关系，把它想象成一个公司办公楼里的**茶水间**和**员工办公室**。

### 2.1. 比喻 ：办公室 & 茶水间

**Socket（CPU 插槽）** → **办公楼**

• 服务器上的每个物理 CPU 就像是一座独立的办公楼（Socket）。

• 一台服务器可能有 1 座、2 座甚至 4 座办公楼（1P、2P 或 4P 服务器）。

**NUMA 节点** → **茶水间**

• 每栋办公楼内部可能有一个或多个茶水间（NUMA 节点），这些茶水间专门供附近的员工（CPU 核心）使用。

• 在 NUMA 架构下，每个办公楼（CPU Socket）通常有自己的茶水间（本地内存），供楼里的员工（CPU 核心）优先使用。

**本地访问 vs 远程访问**

• 员工（CPU 核心）取水时，最优选择是去**自己楼里的茶水间**（访问本地 NUMA 内存，低延迟）。

• 如果自己楼里的水不够用了（本地 NUMA 内存不够），只能去**别的楼的茶水间**（访问远程 NUMA 内存，延迟变高）。


### 2.2. 单 Socket vs 多 Socket

**单 Socket 服务器（UMA 架构）**

   - 只有 **一栋办公楼**，所有人共用一个茶水间。
   - 访问内存（喝水）很均衡，没有远程访问的概念。

**双 Socket 服务器（NUMA 架构）**

• 现在公司扩建，变成了 **两栋办公楼**，每栋楼有自己的茶水间（NUMA 节点）。

• 楼 A 里的员工优先用楼 A 的茶水间，楼 B 里的员工优先用楼 B 的茶水间。

• 但如果 A 楼的水不够了，A 楼的人可以去 B 楼取水（远程 NUMA 访问），但会更耗时。

**AMD EPYC 的 Chiplet 设计**
- 传统 CPU 是一整块芯片，就像一座楼里有一个大茶水间。
- AMD EPYC 采用 Chiplet 架构，相当于一座办公楼里有多个小茶水间（多个 CCD），不同 CCD 可能是不同的 NUMA 节点。
- 员工去最近的小茶水间取水最快，但如果去其他楼层的茶水间，还是会有些延迟。

### 2.3. 优化策略

**合理安排员工（进程调度）**：
- 让 A 楼的员工尽量在 A 楼工作，B 楼的员工在 B 楼工作，避免频繁跨楼取水（减少远程 NUMA 访问）。
- 这类似于 NUMA 亲和性（NUMA Affinity），确保任务运行在对应 NUMA 节点的 CPU 上，并使用本地内存。

**分配合适的茶水量（内存绑定）**：
- 如果知道 A 楼员工喝水需求大，就提前在 A 楼多准备点水（内存分配策略）。
- 这类似于 NUMA-aware 内存分配，确保进程分配的内存尽量在本地 NUMA 节点。

**总结**

• Socket 就是物理 CPU，相当于一栋办公楼。

• NUMA 节点是 CPU 管辖的本地内存，相当于办公楼里的茶水间。

• CPU 访问本地内存（本楼茶水间）快，访问远程内存（别的楼的茶水间）慢。

• 优化 NUMA 亲和性，就像合理安排员工，让他们用最方便的茶水间，避免跑远路。

这样是不是更直观了？ 😃

## 3. DeepSeek - 解答赏析

NUMA（非一致内存访问）架构与 Socket（物理 CPU 插槽）的关系并非固定，而是取决于硬件设计。以下是两者的核心联系与区别：

**基本定义**

- Socket：**物理概念**，指主板上的 CPU 插槽，每个插槽可安装**一个**物理 CPU（如 Intel Xeon 或 AMD EPYC）。
- NUMA Node：**逻辑概念**，用于管理 CPU 核心、缓存和本地内存，强调内存访问的非均匀性。每个 NUMA 节点通常包含一组 CPU 核心和直接连接的本地内存，访问本地内存的速度显著高于跨节点访问。

**关系的多样性**

- 一对一关系：在大多数单芯片设计中（如传统 Intel 至强处理器），一个 Socket 通常对应一个 NUMA 节点。例如，双插槽服务器中，每个 Socket 对应一个 NUMA 节点，本地内存直接连接到该 Socket 的 CPU。  
- 一对多关系： 在多芯片封装（MCM）设计中（如 AMD EPYC 处理器），一个 Socket 可能包含多个独立芯片（如 4 个 Zeppelin 芯片），每个芯片对应一个 NUMA 节点。此时，单 Socket 可划分为多个 NUMA 节点，每个节点有自己的本地内存和 CPU 核心。
- 多对一关系：  某些特殊设计中，多个 Socket 可能共享一个 NUMA 节点（如通过高速互连总线整合内存控制器），但这种情况较少见。

 **性能影响**

- 本地访问优势：NUMA 节点内的 CPU 访问本地内存延迟低、带宽高，而跨节点访问（如访问其他 Socket 的内存）延迟显著增加。例如，AMD EPYC 的芯片间通过 Infinity Fabric 互连，跨 NUMA 节点的延迟高于本地访问。
  
- 操作系统感知：Linux 通过 `numactl` 或 `lscpu` 可查看 NUMA 拓扑。例如，`numactl -H` 会显示节点间的距离矩阵（node distances），数值越大表示访问延迟越高。

**命令工具：**

- `lscpu`：显示 Socket、NUMA 节点、核心与线程的映射关系。  
- `numactl --hardware`：列出 NUMA 节点的 CPU 和内存分配。  
- `/sys/devices/system/node/`：查看节点与 CPU 的绑定关系。

NUMA 与 Socket 的关系并非绝对，需结合具体硬件设计判断。理解两者的映射对优化多核应用性能至关重要，尤其是在虚拟化、高并发计算和网络处理场景中，需通过绑定策略减少跨节点访问开销。

## 4. 架构图

参考该文章[^1]:

<!-- ![1_bak](./images/03-01-System_socket_die_core_HT.svg) 如果下面图片失效，使用这张 -->
![1](https://frankdenneman.nl/wp-content/uploads/2016/07/03-01-System_socket_die_core_HT.svg)

在上图中：

1. The Intel 2630 v4 is based on the Broadwell microarchitecture and contains **4 memory channels,** with a maximum of 3 DIMMS per channel.
2. Each channel is filled with a single 16 GB DDR4 RAM DIMM. **64 GB memory** is available per CPU with a total of 128 GB in the system.

<!-- ![2bak](./images/03-02-NUMA_VM_local_acces_remote_access.svg) -->
![2](https://frankdenneman.nl/wp-content/uploads/2016/07/03-02-NUMA_VM_local_acces_remote_access.svg)



<!-- ![3_bak](./images/03-05-Broadwell_HCC_Architecture.svg) -->
![3](https://frankdenneman.nl/wp-content/uploads/2016/07/03-05-Broadwell_HCC_Architecture.svg)



## 5. Reference

[^1]: <https://frankdenneman.nl/2016/07/08/numa-deep-dive-part-2-system-architecture/>
