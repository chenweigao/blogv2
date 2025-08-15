---
title: AMD IBS
date: 2025-05-07
tags:
  - architecture
  - x86
---
AMD IBS（Instruction-Based Sampling，基于指令采样）是 AMD 处理器中一项硬件级性能分析技术，用于监控和记录处理器执行的指令流，为开发者和系统管理员提供细粒度的性能洞察。

## 1. IBS?

IBS 是一种**基于已执行指令**的硬件采样技术。与传统基于事件计数的采样（如周期、缓存未命中等）不同，IBS 能够采集**指令级别**的丰富信息，比如：

- 每条采样指令是否命中 L1/L2/L3 缓存

- 是否发生 TLB miss

- 分支预测是否成功

- 指令类型（load、store、branch、ret 等）

- 执行延迟、流水线 stalls 情况

- 内存地址访问路径（可选）

## 2. IBS 的两种采样模式

IBS 提供两种模式：

### 2.1. **IBS Fetch Sampling（IBS-Fetch）**

- 针对**指令获取阶段**。

- 可分析：

  - 指令是否来自 L1 I-cache

  - 指令 TLB miss

  - ITLB/TLB walk 等

### 2.2. **IBS Operation Sampling（IBS-Op）**

- 针对**指令执行阶段**。

- 可分析：

  - 指令是否为 Load/Store

  - Load 是否命中 L1/L2/L3 或内存

  - Load 延迟、分支指令是否预测成功

  - Load 地址（可选开启）

## 3. 优缺点

下面是 IBS 的优点列举：

| **特性**      | **优势**              |
| ----------- | ------------------- |
| 精确性         | 每条采样指令都已实际执行，避免“猜测” |
| 低开销         | 硬件实现，支持大规模部署        |
| 可获取微架构细节    | 如分支预测失败、流水线停顿等      |
| 支持用户态/内核态分析 | 便于深入系统级性能瓶颈分析       |

## 4. 用法解析

> [!tip]
> 确保内核已经安装 IBS 驱动。

### 4.1. 使用 perf 采集

我们选取 AMD 的 Genoa 机型举例，使用如下命令采集 IBS 数据：

```bash
perf record -c 1000000 -C0-7 -a -e ibs_op/l3missonly=1/ --raw-samples sleep 30
```

0-7 core 表示 CCD 0, `-c 1000000` 表示每 100w 条指令采样一次，l3missonly 表示只监控 l3 miss 的指令，类似于一个 filter 的作用。

其输出是所有 load/store 指令的相关信息，我们使用下面命令对输出进行筛选并求平均值，就可以拿到访存指令的 Miss Latency：

```bash
perf report -D | grep -B4 "PERF_RECORD_SAMPLE" | grep -A5 "DRAM" | grep -o "DcMissLat......." | awk '{sum += $2; count++} END {if (count > 0) print sum / count}'
```

### 4.2. 技术原理简述

`ibs_op/l3missonly=1/` 用于指定 **只采样那些导致 L3 cache miss 的 load/store 指令**。开启该选项时，**只有穿透 L3 cache，访问 DRAM 或远程 CCD 的 memory 操作才会被采样**。也就是说，**只会记录那些因为 L3 cache miss 而最终访问 DRAM 或远程 CCD 的 load/store 指令。**

**导致 L3 Cache Miss 的指令**，通常是 memory load/store 指令，具体包括：

| **类型**       | **示例**           | **说明**                                    |
| ------------ | ---------------- | ----------------------------------------- |
| **Load**     | mov rax, [rbx]   | 从内存读取，未在 L3 命中（访问 DRAM 或远程）               |
| **Store**    | mov [rcx], rdx   | 少数 store 也可能触发读取（如 write-allocate），未命中 L3 |
| **Prefetch** | prefetcht0 [rsi] | 若触发实际 memory 访问且 L3 miss，也可能记录            |
| **特殊指令**     | 取决于是否访问 memory   | 比如 cmp [rdi], eax 也涉及 load                |

**不会采样的指令：**

| **类型**                  | **原因**                           |
| ----------------------- | -------------------------------- |
| L1 或 L2 命中              | 不满足 L3 miss 条件                   |
| L3 命中                   | 被过滤掉（不设置 l3missonly=0 就不会记录）     |
| 非访存指令（ALU、branch、NOP等）  | 不涉及 memory load/store，自然不会触发采样   |
| Instruction fetch（指令本身） | ibs_op 是采样 **data 操作指令**，不关注取指行为 |

IBS 在每个周期可捕获一条指令的详细微架构信息。设置 l3missonly=1 后：

- IBS 会观察 micro-op 是否触发了 memory 访问；

- 如果访问 L3 时没有命中（即发生 L3 miss）；

- 且满足采样周期条件（如 -c 1000000）；

- 则记录该指令样本，包括：

  - 虚拟/物理地址

  - DRAM 延迟（DcMissLat=xxx）

  - 访存类型（load/store）

  - 是否在 NUMA 本地 / 远程

## 5. 内容解析

### 5.1. 概览

我们列举其中的一个 sample:

```txt
0x17e310 [0x78]: event: 9
.
. ... raw event: size 120 bytes
.  0000:  09 00 00 00 01 40 78 00 26 35 14 81 ff ff ff ff  .....@x.&5......
.  0010:  00 00 00 00 00 00 00 00 7b 16 49 89 e4 6b 00 00  ........{.I..k..
.  0020:  aa 83 01 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
.  0030:  44 00 00 00 ff 0b 00 00 24 f4 07 00 41 05 00 00  D.......$...A...
.  0040:  26 35 14 81 ff ff ff ff 00 02 f7 04 00 00 00 00  &5..............
.  0050:  23 00 00 00 00 00 00 00 a1 00 d7 14 dc 01 00 00  #...............
.  0060:  84 57 3b 7c 9f 89 ff ff 84 57 3b 7c 1f 01 00 00  .W;|.....W;|....
.  0070:  34 35 14 81 ff ff ff ff                          45......        

ibs_op_ctl: 000005410007f424 MaxCnt   1000000 L3MissOnly 1 En 1 Val 1 CntCtl 0=cycles CurCnt      1345
IbsOpRip: ffffffff81143526
ibs_op_data: 0000000004f70200 CompToRetCtr   512 TagToRetCtr  1271 BrnRet 0  RipInvalid 0 BrnFuse 0 Microcode 0
ibs_op_data2: 0000000000000023 RmtNode 0 DataSrc 3=DRAM
ibs_op_data3: 000001dc14d700a1 LdOp 1 StOp 0 DcL1TlbMiss 0 DcL2TlbMiss 0 DcL1TlbHit2M 0 DcL1TlbHit1G 1 DcL2TlbHit2M 0 DcMiss 1 DcMisAcc 0 DcWcMemAcc 0 DcUcMemAcc 0 DcLockedOp 0 DcMissNoMabAlloc 1 DcLinAddrValid 1 DcPhyAddrValid 1 DcL2TlbHit1G 0 L2Miss 1 SwPf 0 OpMemWidth  4 bytes OpDcMissOpenMemReqs  5 DcMissLat   476 TlbRefillLat     0
IbsDCLinAd: ffff899f7c3b5784
IbsDCPhysAd: 0000011f7c3b5784
0 118629299983995 0x17e310 [0x78]: PERF_RECORD_SAMPLE(IP, 0x4001): 0/0: 0xffffffff81143526 period: 1000000 addr: 0
 ... thread: swapper:0
 ...... dso: /proc/kcore
```

样本结构简要概览：

| **字段**                    | **含义**                            |
| ------------------------- | --------------------------------- |
| event: 9                  | 表示 PERF_RECORD_SAMPLE 类型事件        |
| raw event: size 120 bytes | 原始样本数据大小                          |
| ibs_op_ctl                | IBS 控制字段：采样周期、是否只采样 L3 miss、当前计数等 |
| IbsOpRip                  | 被采样指令的虚拟地址（RIP）                   |
| ibs_op_data               | 包含分支、指令完成到 retire 的延迟等            |
| ibs_op_data2              | 数据来源（如 DRAM、本地/远程 node）           |
| ibs_op_data3              | 包括访存类型、是否 miss、是否 locked、延迟等详细信息  |
| IbsDCLinAd                | 访存指令的 virtual address             |
| IbsDCPhysAd               | 访存指令的 physical address            |
| PERF_RECORD_SAMPLE        | 样本事件总结，包括指令地址、触发周期、线程等            |

接下来进行逐行解析：

### 5.2. ibs_op_ctl

> ibs_op_ctl: 000005410007f424 MaxCnt   1000000 L3MissOnly 1 En 1 Val 1 CntCtl 0=cycles CurCnt      1345

属于控制字段，拆解如下：

| **位字段**           | **含义**                   |
| ----------------- | ------------------------ |
| MaxCnt = 1000000  | 设置每采样一次需执行的指令数（周期）       |
| L3MissOnly = 1    | **只采样 L3 miss 的访存指令**    |
| En = 1            | 采样启用                     |
| Val = 1           | 当前样本有效                   |
| CurCnt = 1345     | 当前样本指令周期倒数计数（用于调节分布）     |
| CntCtl 0 = cycles | 使用周期控制采样（而非 retired 指令数） |

### 5.3. IbsOpRip

> IbsOpRip: ffffffff81143526

采样到的 **指令虚拟地址（RIP）**：

- 该例子对应内核空间：ffffffff81xxxxxx，可能是某个内核函数中发生的访存

- 可用 `addr2line -e /boot/vmlinux ffffffff81143526` 映射函数名

### 5.4. ibs_op_data

> ibs_op_data: 0000000004f70200 CompToRetCtr   512 TagToRetCtr  1271 BrnRet 0  RipInvalid 0 BrnFuse 0 Microcode 0

| 字段                 | 含义                                    |
| ------------------ | ------------------------------------- |
| CompToRetCtr = 512 | 指令完成到 retire 的延迟                      |
| TagToRetCtr = 1271 | 分派到 retire 之间的延迟（可能表示 pipeline stall） |
| BrnRet = 0         | 非分支指令                                 |
| Microcode = 0      | 非 microcode 执行                        |
| RipInvalid = 0     | RIP 有效                                |

### 5.5. ibs_op_data2

> ibs_op_data2: 0000000000000023 RmtNode 0 DataSrc 3=DRAM

| **字段**      | **含义**                                  |
| ----------- | --------------------------------------- |
| RmtNode = 0 | 本地 NUMA node                            |
| DataSrc = 3 | **数据来源是 DRAM**（常见编码：3=DRAM，4=远程，6=IO 等） |

### 5.6. ibs_op_data3

> ibs_op_data3: 000001dc14d700a1 LdOp 1 StOp 0 DcL1TlbMiss 0 DcL2TlbMiss 0 DcL1TlbHit2M 0 DcL1TlbHit1G 1 DcL2TlbHit2M 0 DcMiss 1 DcMisAcc 0 DcWcMemAcc 0 DcUcMemAcc 0 DcLockedOp 0 DcMissNoMabAlloc 1 DcLinAddrValid 1 DcPhyAddrValid 1 DcL2TlbHit1G 0 L2Miss 1 SwPf 0 OpMemWidth  4 bytes OpDcMissOpenMemReqs  5 DcMissLat   476 TlbRefillLat     0

这是最关键的字段之一，包含了 memory 延迟与 miss 类型，逐项如下：

| **字段**                                  | **含义**                                  |
| --------------------------------------- | --------------------------------------- |
| LdOp = 1                                | 是 load 指令                               |
| StOp = 0                                | 非 store 指令                              |
| DcMiss = 1                              | 数据 cache miss                           |
| L2Miss = 1                              | L2 miss                                 |
| ==DcMissLat = 476==                     | **内存访问延迟为 476 cycles**（重点）              |
| OpMemWidth = 4                          | 操作内存宽度为 4 字节                            |
| OpDcMissOpenMemReqs = 5                 | 此时 memory pipeline 有 5 个 outstanding 请求 |
| DcLockedOp = 0                          | 非锁操作                                    |
| DcLinAddrValid = 1 / DcPhyAddrValid = 1 | 地址有效                                    |
| TlbRefillLat = 0                        | 没有 TLB refill latency                   |
| DcL1TlbMiss = 0 / DcL2TlbMiss = 0       | 没有 TLB miss                             |

### 5.7. IbsDCLinAd / IbsDCPhysAd

> IbsDCLinAd: ffff899f7c3b5784
> IbsDCPhysAd: 0000011f7c3b5784

| **字段**                         | **含义**                 |
| ------------------------------ | ---------------------- |
| IbsDCLinAd = ffff899f7c3b5784  | 访存虚拟地址                 |
| IbsDCPhysAd = 0000011f7c3b5784 | 映射物理地址（可结合页表分析内存 node） |

### 5.8. PERF_RECORD_SAMPLE(IP...)

> 0 118629299983995 0x17e310 [0x78]: PERF_RECORD_SAMPLE(IP, 0x4001): 0/0: 0xffffffff81143526 period: 1000000 addr: 0
> ... thread: swapper:0
> ...... dso: /proc/kcore

这是 perf 报告格式，概括该采样点：

- PERF_RECORD_SAMPLE(IP, 0x4001)：采样事件，包含指令地址

- thread: swapper:0：发生于 idle thread

- dso: /proc/kcore：说明是在内核执行过程中被采样（非用户态）

## 6. 监控使能

对于在日常监控中使能 IBS 并且监控 DcMissLat 指标，有两种方式，分别是使用 perf_event_open + raw IBS 事件和  MSR 直接访问。

### 6.1. 使用 perf_event_open + raw IBS 事件

Linux 的 perf 子系统支持 IBS 的硬件事件，**通过 perf_event_open() 系统调用直接启用 ibs_op 类型事件**，然后从 ring buffer 中读取采样样本，包括 DcMissLat。

> 目前正在咨询 ARM Light Spe 是如何实现监控的，将来可以作为参考。

下面是我列举的一个 demo，用于调用接口：

打开 perf_event_open 配置 ibs_op:

```c
#include <linux/perf_event.h>
#include <asm/unistd.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>

int fd;
struct perf_event_attr attr;

memset(&attr, 0, sizeof(struct perf_event_attr));
attr.type = PERF_TYPE_RAW;   // 对于 IBS，用 RAW 类型
attr.size = sizeof(struct perf_event_attr);
attr.config = 0x1;           // 0x1 = IBS_OP（ibs_op 控制器）
attr.sample_type = PERF_SAMPLE_IP | PERF_SAMPLE_RAW;
attr.sample_period = 1000000;
attr.exclude_kernel = 0;
attr.exclude_user = 0;
attr.disabled = 0;
attr.read_format = 0;

fd = syscall(__NR_perf_event_open, &attr, 0, -1, -1, 0);
```

读取 ring buffer 中的采样样本，需要 mmap 一个 ring buffer，然后循环从中读取：

```c
void* buf = mmap(NULL, mmap_size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
// 解析 perf_event_header，并从中获取 raw sample 中的 DcMissLat
```

raw sample 是个结构体，DcMissLat 在 `ibs_op_data3` 字段里，需要解析其中的 bit field：`DcMissLat = (ibs_op_data3 >> 32) & 0xFFFF`

### 6.2. MSR 直接访问

可以访问 IBS 的硬件 MSR（model specific registers）来启用采样：

| **名称**       | **编号**     | **说明**           |     |
| ------------ | ---------- | ---------------- | --- |
| IBS_OP_CTL   | 0xC0011033 | 控制器寄存器           |     |
| IBS_OP_DATA3 | 0xC001103B | 包含 DcMissLat 等信息 |     |
| IBS_OP_RIP   | 0xC0011035 | 指令地址             |     |
| IBS_OP_DATA  | 0xC0011036 | 执行状态             |     |

可以通过 rdmsr_on_cpu() + 定时中断轮询方式采集，但这种方法依赖内核权限。
