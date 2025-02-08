---
title: G1 GC
date: 2024-12-18
tag:
 - jvm
 - GC
category:
 - JAVA
---

## Abstract

G1 GC 有几个特点：
1. 一款能够建立起“停顿时间模型”(Pause Prediction Model)的收集器;
   1. 在 G1 之前，垃圾回收算法收集的目标范围要么是整个新生代(Minor GC), 要么就是整个老年代(Major GC), 再要么就是整个Java堆(Full GC)
   2. G1 GC 支持按照 region 回收，根据用户指定的期望回收时间，决定需要回收的 region


1. 支持 Mixed GC
2. 
3. 因为按照 region 回收，所以需要解决跨 region 引用的问题，引入了双向卡表

G1 GC 的过程如下：

1. Initial Mark: 仅仅只是标记一下 GC Roots 能直接关联到的对象，并且修改 TAMS 指针的值，让下一阶段用户线程并发运行时，能正确地在可用的 Region 中分配新对象。这个阶段需要停顿线程，但耗时很短，而且是借用进行 Minor GC 的时候同步完成的，所以 G1 收集器在这个阶段实际并没有额外的停顿。
2. Concurrent Marking: 仅仅只是标记一下 GC Roots 能直接关联到的对象，并且修改 TAMS 指针的值，让下一阶段用户线程并发运行时，能正确地在可用的 Region 中分配新对象。这个阶段需要停顿线程，但耗时很短，而且是借用进行 Minor GC 的时候同步完成的，所以 G1 收集器在这个阶段实际并没有额外的停顿。
3. Final Marking: 对用户线程做另一个短暂的暂停，用于处理并发阶段结束后仍遗留下来的最后那少量的SATB 记录。
4. Live Data Counting and Evacuation: 负责更新 Region 的统计数据，对各个 Region 的回收价值和成本进行排序，根据用户所期望的停顿时间来制定回收计划，可以自由选择任意多个 Region 构成回收集，然后把决定回收的那一部分 Region 的存活对象复制到空的 Region 中，再清理掉整个旧 Region 的全部空间。这里的操作涉及存活对象的移动，是必须暂停用户线程，由多条收集器线程并行完成的。

不允许初始标记与 Mixed GC 一起捎带执行！对于其中的原因：
1. 初始标记阶段是一个 STW 的阶段，需要确保标记根对象的准确性，所以在 safepoint 进行，防止并发线程对内存状态的修改干扰标记结果。
2. Concurrent Mark 阶段依赖于 Initial Mark 阶段的结果完整。
3. 在 Initial Mark 阶段堆的内存布局和状态（根对象集、Remember Set）需要是静态的，以确保标记过程中的正确性；如果此时允许 Concurrent Mark 运行，会导致内存对象状态的变更，可能破坏标记的完整性和正确性。
4. 同时运行 Initial Mark 和 Concurrent Mark 会引入资源竞争和逻辑复杂性：Initial Mark 依赖 Concurrent Mark 线程的调度状态（如线程是否终止），如果两个阶段同时运行，需要额外的同步和冲突检测，可能增加实现的复杂性和运行时开销。
5. G1 GC 的设计基于分阶段、并发与暂停结合的策略：将标记工作分为清晰的几个阶段，如 Initial Mark 和 Concurrent Mark；在需要高精度的阶段（如 Initial Mark）采用 STW 模式，而在可以容忍一定滞后的阶段（如 Concurrent Mark）采用并发模式。