---
title: 深入解析 G1 GC
date: 2024-12-18
tags:
  - JVM
  - GC
category:
  - Java
---

## 概述

G1（Garbage First）GC 是 Java 虚拟机（JVM）中的一种高效垃圾回收器，它具备以下核心特点：

1. **基于停顿时间预测模型（Pause Prediction Model）**  
   在 G1 之前，垃圾回收通常分为：
   - **Minor GC**：回收整个新生代（Young Generation）。
   - **Major GC**：回收整个老年代（Old Generation）。
   - **Full GC**：回收整个 Java 堆。  
   由于这些传统 GC 机制可能会导致较长的停顿时间，G1 GC 采用了 **Region**（分区）管理方式，使得回收可以在更细粒度上进行，并能够根据用户设定的最大停顿时间（例如 `-XX:MaxGCPauseMillis`）来优化回收过程。

2. **支持 Mixed GC**  
   G1 GC 结合了部分年轻代和老年代的回收，在 Mixed GC 过程中，G1 可以回收部分老年代的对象，而不是等待老年代堆满后触发 Full GC，从而减少长时间停顿的可能性。

3. **Region 管理与跨区域引用处理**  
   由于 G1 采用基于 Region 的回收机制，因此需要处理对象跨 Region 的引用问题。为此，G1 引入了 **双向卡表（Bi-directional Card Table）**，用于维护跨 Region 引用的信息，确保 GC 过程的准确性和高效性。

---

## G1 GC 工作流程

G1 GC 主要由以下几个阶段组成：

### 1. Initial Mark（初始标记）

- 目标：标记 GC Roots 直接可达的对象，并更新 **TAMS（Top-at-Mark-Start）指针**，确保并发阶段对象分配的正确性。
- 该阶段为 **STW（Stop-the-World）**，但执行时间很短，通常会借助 **Minor GC** 一同完成，以减少额外的停顿。

### 2. Concurrent Marking（并发标记）

- 目标：遍历整个堆，计算各个 Region 存活对象的比例，为后续回收决策提供数据支持。
- 该阶段与应用线程 **并发执行**，不会影响应用的正常运行。
- G1 GC 采用 **SATB（Snapshot-At-The-Beginning）** 记忆集，以确保并发标记期间的对象引用变更不会影响标记准确性。

### 3. Final Marking（最终标记）

- 目标：在并发标记结束后，进行一个 **短暂的 STW 停顿**，处理 SATB 记录的剩余引用变更，确保标记信息的完整性。
- 该阶段的停顿时间依然较短。

### 4. Live Data Counting & Evacuation（存活数据统计与回收）

- 目标：
  1. 统计各个 Region 的存活数据，并对其回收价值进行排序。
  2. 根据用户设定的最大停顿时间，决定哪些 Region 需要回收（构建回收集）。
  3. 将存活对象复制到空 Region，并清理旧 Region，以释放内存空间。
- 该阶段涉及对象的 **移动**，因此需要 **STW**，但 G1 采用 **多线程并行处理** 来提高效率。

---

## 为什么 Initial Mark 不能与 Mixed GC 共同执行？

在 G1 GC 设计中，**Initial Mark 不能与 Mixed GC 共同执行**，主要原因如下：

1. **确保标记的准确性**  
   初始标记阶段是 **STW** 过程，需要在 **safepoint**（安全点）完成，以防止应用线程对堆内存的修改干扰标记结果。

2. **Concurrent Mark 依赖于 Initial Mark 结果**  
   并发标记阶段的起点是 Initial Mark 的标记结果，因此必须先完成 Initial Mark，才能进入下一步。

3. **堆的内存布局需要稳定**  
   在 Initial Mark 阶段，堆的根对象集合（GC Roots）和 Remember Set 需要保持 **静态**，以确保标记的正确性。如果此时允许 Mixed GC 运行，可能会导致堆对象状态发生变化，进而破坏标记的完整性。

4. **避免资源竞争和复杂的同步机制**  
   Initial Mark 依赖于 Concurrent Mark 线程的调度状态（如线程是否终止）。如果两者同时运行，需要额外的同步与冲突检测，增加了实现的复杂性和运行时开销。

5. **符合 G1 GC 的阶段化设计**  
   G1 采用了 **分阶段、并发与暂停结合** 的策略：
   - 在 **高精度** 需求的阶段（如 Initial Mark）采用 **STW** 模式。
   - 在 **可容忍一定滞后** 的阶段（如 Concurrent Mark）采用 **并发执行**，减少对应用的影响。

---

## 结论

G1 GC 作为一种现代化的垃圾回收器，通过 **Region 分区管理**、**停顿时间控制** 和 **并发标记**，提供了 **更可预测、更低停顿** 的垃圾回收方案。它适用于大堆（通常 4GB 以上）且对低延迟有较高要求的应用，如 **高性能服务器、金融交易系统、实时交互应用等**。

在实际应用中，合理配置 G1 GC 的参数，如 `-XX:MaxGCPauseMillis`、`-XX:InitiatingHeapOccupancyPercent`，可以进一步优化性能，平衡吞吐量与停顿时间。

---

以上优化后的文章更加清晰、专业，并且补充了一些技术细节，使其更具参考价值。如果需要进一步修改或补充，请告诉我！