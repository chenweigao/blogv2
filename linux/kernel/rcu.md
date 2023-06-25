---
title: RCU(todo)
date: 2023-06-25
author: weigao
category:
 -  Kernel
---

## RCU

什么是 RCU 状态？

> 在Linux内核中，RCU（Read-Copy-Update）是一种读取数据不加锁的机制，它通过使用复制而不是传统的互斥量机制来实现对共享数据结构的并发安全。

也就是说 RCU 是一种同步机制，其可以支持一个写操作和多个读操作同时进行。对比而言，读写锁是一种排他锁，写的同时不允许其他读的操作。

❗本文为了研究清楚 idle, 故针对 idle 流程中的 RCU 进行研究。

::: info 🔗 名词解释

+ Grace period: 宽限期
+ Quiescent state: 静止态

:::

## QS

在 RCU（Read-Copy-Update）机制中，QS（Quiescent State）是指一个 RCU 线程已经处理完正在使用的共享数据并即将睡眠时所处的状态。

在 QS 中，RCU 线程不再持有任何共享数据，并且等待其他线程完成对共享数据的访问并退出 read-side 临界区。在所有线程退出 read-side 临界区后，RCU 线程才会进入睡眠状态，等待下一次需要访问共享数据时再被唤醒。

RCU 的 QS 机制是用来保证 RCU 的正确性和高效性，因为当某个 RCW 对共享数据进行修改时，RCU 不能立即释放内存，需要等待所有正在使用共享数据的线程都退出 read-side 临界区，即进入了 QS，才能安全地释放该共享数据占用的内存。

> ❓❓❓ 普通的 QS: CPU 发生进程切换，或是运行在用户态都标志着它进入了 QS[^3]

这段引用较难理解？

Extended QS：CPU 执行 **idle** 进程、进入中断、运行在用户态的 tickless 模式下标志着它进入 EQS；

RCU 是一个非常有用的内核机制，可以大幅度提升多 CPU 系统中并发读取共享数据的性能。然而，在过去的一些 RCU 实现中，需要定期调用 tick 以帮助检测 CPU 是否空闲并进行相应的操作。这样，系统就不可能真正进入 tickless 模式，因为为了保证 RCU 正确性，tick 仍然需要启动。为了解决这种矛盾，Linux 内核引入了一种新的 RCU 实现方法：RCU-Dynticks。该实现允许 RCU 在不定期使用计时器的情况下执行，从而允许系统真正进入 tickless 模式。具体来说，当所有 RCU 线程都被阻塞时，RCU-Dynticks 可以安全地关闭计时器，以避免后台 tick 等待造成的功耗和延迟。RCU-Dynticks 实现对应了 EQS 状态。



## rcu_idle_enter

`rcu_idle_enter()`是Linux内核中的一个函数，它用于将CPU置于RCU空闲状态，以便让RCU子系统在RCU调度器中执行后台工作。在具体实现上，该函数会挂起当前CPU的所有进程并使其休眠，以便其他CPU可以更快地访问共享资源。

具体来说，`rcu_idle_enter()`的功能可以简单地概括为以下几个方面：

1. 检查当前CPU是否已经成功进入空闲状态（即没有正在运行或等待运行的进程）。
2. 如果当前CPU还有进程在运行，则调用相应的函数停止这些进程的运行，并等待它们进入休眠状态。
3. 如果当前CPU已经成功进入空闲状态，则向RCU调度器发送空闲通知，通知RCU子系统开始执行后台任务。

需要注意的是，当CPU处于RCU空闲状态时，只有RCU子系统中的相关线程可以运行，其他进程无法在该CPU上运行，这可以避免竞态条件和死锁等问题。当后台任务完成后，调度器会自动唤醒CPU并恢复正常的进程调度。

## note_gp_changes

这个函数名字中的 `gp` 的含义是 **grace period**, 表示 RCU 的宽限期或者临界区。gp 的结束时间是在所有的 CPU 都经过一次静止态（QS）的时候。

这个函数位于 kernel/linux-5.10/kernel/rcu/tree.c 这个路径下面，对于 tree.c 这个文件，对于 tree 的含义，找到了一个解释：

> 还有一种分类可以通过内核源码中 RCU 文件名可以看到，分为 Tiny RCU 和 Tree RCU。Tiny RCU 适用于嵌入式系统单 CPU 的场景，而 Tree RCU 则适用于大型系统。

根据这个线索，我们从源码路径下面果然是看到了 tiny.c 这个文件。

