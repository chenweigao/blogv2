---
title: 深入解析 G1 GC
date: 2024-12-18
tags:
  - JVM
  - GC
category:
  - Java
---

## 1. 基础知识

几种引用类型：

| 引用类型                   | 功能特点                                |
| ---------------------- | ----------------------------------- |
| 强引用（Strong Reference）  | 被强引用关联的对象永远不会被垃圾收集器回收掉              |
| 软引用（Soft Reference）    | 软引用关联的对象，只有当系统将要发生内存溢出时，才会去回收软引用的对象 |
| 弱引用（Weak Reference）    | 只被弱引用关联的对象，只要发生垃圾收集事件，就会被回收         |
| 虚引用（Phantom Reference） | 被虚引用关联的对象的唯一作用是能在这个对象被回收时收到一个系统通知   |

几种 GC 算法的简单对比：

| 回收器类型                      | 回收算法         | 特点                                |
| -------------------------- | ------------ | --------------------------------- |
| Serial New / Serial Old回收器 | 复制算法/标记-整理算法 | 单线程复制回收，简单高效，但会暂停程序导致停顿           |
| ParNew New / ParNew Old回收器 | 复制算法/标记-整理算法 | 多线程复制回收，降低了停顿时间，但容易增加上下文切换        |
| Parallel Scavenge回收器       | 复制算法         | 并行回收器，追求高吞吐量，高效利用CPU              |
| CMS回收器                     | 标记-清理算法      | 老年代回收器，高并发、低停顿，追求最短GC回收停顿时间，响应时间快 |
| G1回收器                      | 标记-整理+复制算法   | 高并发、低停顿、可预测停顿时间                   |

## 2. 概述

:::tip G1 GC 核心特点

G1（Garbage First）GC 是 Java 虚拟机（JVM）中的一种高效垃圾回收器，它具备以下核心特点：

1. 基于停顿时间预测模型（Pause Prediction Model）

2. 支持 Mixed GC

3. Region 管理与跨区域引用处理

:::

下面是详细解释：

在 G1 之前，垃圾回收通常分为：

- **Minor GC**：回收整个新生代（Young Generation）。
- **Major GC**：回收整个老年代（Old Generation）。
- **Full GC**：回收整个 Java 堆。  

由于这些传统 GC 机制可能会导致较长的停顿时间，G1 GC 采用了 **Region**（分区）管理方式，使得回收可以在更细粒度上进行，并能够根据用户设定的最大停顿时间（例如 `-XX:MaxGCPauseMillis`）来优化回收过程。

G1 GC 结合了部分年轻代和老年代的回收，在 Mixed GC 过程中，G1 可以回收部分老年代的对象，而不是等待老年代堆满后触发 Full GC，从而减少长时间停顿的可能性。

由于 G1 采用基于 Region 的回收机制，因此需要处理对象跨 Region 的引用问题。为此，G1 引入了 **双向卡表（Bi-directional Card Table）**，用于维护跨 Region 引用的信息，确保 GC 过程的准确性和高效性。

---

## 3. G1 GC 工作流程

G1 GC 主要由以下几个阶段组成：

### 3.1. Initial Mark（初始标记）

- 目标：标记 GC Roots 直接可达的对象，并更新 **TAMS（Top-at-Mark-Start）指针**，确保并发阶段对象分配的正确性。
- 该阶段为 **STW（Stop-the-World）**，但执行时间很短，通常会借助 **Minor GC** 一同完成，以减少额外的停顿。

### 3.2. Concurrent Marking（并发标记）

- 目标：遍历整个堆，计算各个 Region 存活对象的比例，为后续回收决策提供数据支持。
- 该阶段与应用线程 **并发执行**，不会影响应用的正常运行。
- G1 GC 采用 **SATB（Snapshot-At-The-Beginning）** 记忆集，以确保并发标记期间的对象引用变更不会影响标记准确性。

### 3.3. Final Marking（最终标记）

- 目标：在并发标记结束后，进行一个 **短暂的 STW 停顿**，处理 SATB 记录的剩余引用变更，确保标记信息的完整性。
- 该阶段的停顿时间依然较短。

### 3.4. Live Data Counting & Evacuation（存活数据统计与回收）

**目标：**

1. 统计各个 Region 的存活数据，并对其回收价值进行排序。
2. 根据用户设定的最大停顿时间，决定哪些 Region 需要回收（构建回收集）。
3. 将存活对象复制到空 Region，并清理旧 Region，以释放内存空间。

该阶段涉及对象的 **移动**，因此需要 **STW**，但 G1 采用 **多线程并行处理** 来提高效率。

---

## 4. 为什么 Initial Mark 不能与 Mixed GC 共同执行？

在 G1 GC 设计中，**Initial Mark 不能与 Mixed GC 共同执行**，主要原因如下：

1. 确保标记的准确性： 初始标记阶段是 STW 过程，需要在 safepoint（安全点）完成，以防止应用线程对堆内存的修改干扰标记结果。
2. Concurrent Mark 依赖于 Initial Mark 结果： 并发标记阶段的起点是 Initial Mark 的标记结果，因此必须先完成 Initial Mark，才能进入下一步。
3. 堆的内存布局需要稳定：在 Initial Mark 阶段，堆的根对象集合（GC Roots）和 Remember Set 需要保持 静态，以确保标记的正确性。如果此时允许 Mixed GC 运行，可能会导致堆对象状态发生变化，进而破坏标记的完整性。
4. 避免资源竞争和复杂的同步机制： Initial Mark 依赖于 Concurrent Mark 线程的调度状态（如线程是否终止）。如果两者同时运行，需要额外的同步与冲突检测，增加了实现的复杂性和运行时开销。
5. 符合 G1 GC 的阶段化设计： G1 采用了 分阶段、并发与暂停结合 的策略：在 高精度 需求的阶段（如 Initial Mark）采用 STW 模式。在 可容忍一定滞后 的阶段（如 Concurrent Mark）采用 并发执行，减少对应用的影响。

## 5. G1 GC 选项

### 5.1. MaxNewSize

G1 GC通过动态调整年轻代和老年代的比例来优化垃圾回收效率。`MaxNewSize`设定了年轻代在堆内存中可扩展的上限，确保其不会无限制增长。限制年轻代的最大大小可以防止其占用过多堆空间，从而影响老年代或导致频繁的混合GC（Mixed GC）甚至Full GC。

**默认值**：若未显式设置，G1会根据堆总大小自动计算`MaxNewSize`。通常为堆大小的60%（如`-Xmx`设为4G，则默认`MaxNewSize≈2.4G`）。默认值基于 `NewSize`（年轻代初始大小）和 `MaxNewSize` 的启发式算法，结合GC暂停时间目标（`MaxGCPauseMillis`）动态调整。

与其他参数存在联系：

1. `Xmn`（固定年轻代大小）：若设置`Xmn`（如`-Xmn1g`），则`NewSize`和`MaxNewSize`均被固定为该值，动态调整失效。所以在 G1 GC 中不建议使用该选项，若同时设置`Xmn`和`MaxNewSize`，`Xmn`会覆盖`MaxNewSize`，使动态调整失效。
2. `NewRatio`（年轻代/老年代比例）：在 G1 中不推荐使用，因其与动态调整机制冲突。若需控制比例，应优先使用`MaxNewSize`。
3. `G1HeapRegionSize`：G1 将堆划分为固定大小的 Region（默认 2MB ~ 32MB）。年轻代的最大Region 数为 `MaxNewSize / G1HeapRegionSize`。

如果要从 CMS GC 调整到 G1 GC，则需要将 `-Xmn` 选项删除，更改为：

$$
-XX:MaxNewSize = (-Xmn in CMS) * (SurviviorRatio+1) / (SurvivorRatio+2)
$$

- 在 CMS 中，存在两个 survivor 空间，所以 Xmn 空间会比 G1 的年轻代空间略大一些；

该参数的调优建议：

- **平衡暂停时间与吞吐量**：
  
  - 增大`MaxNewSize`可能减少年轻代 GC 频率（适合高分配速率应用），但可能导致单次 GC 时间增加。
  
  - 减小`MaxNewSize`可缩短单次 GC 时间，但可能增加 GC 频率。

- **监控与调整**：
  
  - 通过 GC 日志（`-Xlog:gc*`）观察年轻代大小变化及 GC 停顿时间。
  
  - 结合`MaxGCPauseMillis`（目标暂停时间）调整，避免年轻代过大导致目标无法达成。

- **避免过度限制**：过小的`MaxNewSize`可能导致晋升失败（Premature Promotion），增加老年代压力。

### 5.2. G1HeapRegionSize

表示 G1 GC 对应的 Region 大小。

如果需要从 CMS 切换到 G1，则根据以下原则进行转换：

| Xmx      | G1HeapRegionSize |
| -------- | ---------------- |
| 6g - 16g | 16m              |
| 2g - 6g  | 8m or 4m         |
| 1g - 2g  | 4m or 2m         |

注意不要让  G1HeapRegionSize 过小，不然因大对象触发 to-space exhausted 和 full gc 的风险。

### 5.3. InitiatingHeapOccupancyPercent

`-XX:InitiatingHeapOccupancyPercent=45`表示触发 Mixed GC 的阈值（当堆内存使用达到总堆的 45% 时，G1 会启动并发标记），默认 45。

该参数是 G1 GC 的一个重要参数，用于控制何时触发并发标记周期（Concurrent Marking），需要注意，45% 的默认值不适合于所有场景，尤其是在堆较大或者对象分配模式较为特殊的情况下。如果过早触发（值设得太低），会导致频繁启动并发标记，导致额外的 CPU 和内存开销，可能影响应用吞吐量。如果过晚触发（值设得太高），老年代可能积累过多垃圾，导致并发标记完成后没有足够空间晋升对象，触发 Full GC。

**作用：**

1. 该参数指定当整个堆的使用率达到多少百分比时，**触发 G1 GC 的并发标记周期**。
2. 这个标记周期的目的是识别老年代中可回收的对象，为接下来的 Mixed GC 做准备。
3. 默认值是 45，表示当整个堆的使用量达到 45% 时，G1 GC 会开始并发标记。

**调优建议：**

1. 监控堆占用趋势：
   
   - 通过 GC 日志（`-Xlog:gc*`）或工具（如 `jstat`、`VisualVM`）观察老年代的增长速度。
   - 若老年代占用快速上升，需适当 降低 `InitiatingHeapOccupancyPercent`，提前启动并发标记。

2. 避免 Full GC：
   
   - 若日志中出现 `Full GC (Allocation Failure)`，可能是并发标记未及时触发，尝试降低此参数值。

3. 大堆场景的调整：
   
   - 对于堆较大的应用（如 32G 以上），默认值 45% 可能导致并发标记耗时过长。
   - 可适当 提高阈值（如 50% ~ 60%），但需结合 `G1HeapWastePercent` 确保混合 GC 能及时回收空间

**与其他参数的关联：**

- `G1HeapWastePercent`：控制混合 GC 的触发时机（当可回收垃圾占比超过此阈值时，启动混合 GC）。
- `G1MixedGCLiveThresholdPercent`： 决定哪些老年代 Region 会被纳入混合 GC 的回收范围（存活对象比例低于此值的 Region 会被回收）。
- `MaxGCPauseMillis`：间接影响并发标记的启动频率，因为 G1 会动态调整堆的使用策略以满足暂停时间目标。

## 6. 结论

G1 GC 作为一种现代化的垃圾回收器，通过 Region 分区管理、停顿时间控制 和 并发标记，提供了 更可预测、更低停顿 的垃圾回收方案。它适用于大堆（通常 4GB 以上）且对低延迟有较高要求的应用，如 高性能服务器、金融交易系统、实时交互应用等。

在实际应用中，合理配置 G1 GC 的参数，如 *-XX:MaxGCPauseMillis、-XX:InitiatingHeapOccupancyPercent*，可以进一步优化性能，平衡吞吐量与停顿时间。
