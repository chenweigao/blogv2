---
title: Art GC - Part 1
date: 2022-11-28
tag:
 - jvm
 - GC
category:
 - JAVA
---



本篇文章首先对 JAVA Art 中的 GC 进行一个全局性的概览，后续如果要研究技术细节等，再另起新的文章进行重点研究。
:::tip
本篇主要研究 ConcurrentCopying GC 的技术细节。
:::

## Forwarding Ptr

在 art 虚拟机中，FW Ptr 是一个很重要的概念，通常在 "mark and sweep" phase 中使用。

整个过程的描述大致为，gc collector 扫描存活对象和其引用的对象，确定这些对象应该继续存活还是被回收，在 mark phase 完成以后，gc collector 开始 "sweep" phase, 在这个 phase 中，会回收那些堆中没有被 "mark" 的对象（这些对象不会再被使用了）；

上面的过程中会存在一个问题，在 mark phase 中被 mark 的对象如果在此期间被移动到了一个新的内存位置，gc 将会给这个对象设置一个 forwading address, 用于表示对象移动到的新的内存地址；

接下来，gc collector 进行引用计数的时候，就可以读取对象的 forwarding address, 如此确保对象的地址是正确的，即使对象发生了移动。

对于上面所说的**对象发生移动**，在不同的 gc collector 中的实现都是不同的，比如我们重点研究的 CC GC, 其把对象从 *from_space* copy 到 *to_space* 的过程，就是发生了对象的移动。对于在 CC GC 中（或者相似的基于 copy 的 GC），FW Ptr 的应用可能是通过以下步骤的：

1. 在 *to_space* 中为需要拷贝的对象分配一个新的 block, 或者分配一个内存，该过程完成后返回 `to_ref` 的地址；
2. collector traverses 对象图，找到 *from_space* 中的存活对象，并且进行 "mark";
3. 在 traverse 过程中，会把 *from_space* 中的存活对象 copy 到 *to_space* 中，在这个过程中，我们的 forwarding address 就生效了，在拷贝的时候，我们给 `from_ref` 设置一个 FW Ptr, 指向 `to_ref`;
4. 如果要发生对象的修改、更新或者拷贝，则都会使用新的 forwarding address;
5. 最后就是 *from_space* 的释放等操作。

## Read Barrier in Art GC

Art 中 Read Barrier 的作用是：在并发场景下，用来确保线程看到最新的对象的值。

当一个线程读取一个对象的引用的时候，会调用到 read barrier 的 intrinsic method, 这个方法用于 check 这个对象的引用(the reference points to an object) 是否正在被移动或者这个对象的引用指向一个 fordwarding address，如果 reference 指向正在被移动的对象，该方法等待对象移动完毕然后更新其引用到新的位置；如果 reference 指向一个 forwarding address, 则这个方法更新引用到新的位置。

:::tip

为了方便理解，引用一段英文原文：

> When a thread reads from a reference to an object, the read barrier intrinsic method is called. The method checks whether the reference points to an object in the process of **being moved**, or whether the reference **points to a forwarding address**. If the reference points to an object in the process of being moved, the method **waits** until the move is completed and then updates the reference to point to the new location. If the reference points to a forwarding address, the method updates the reference to point to the new location.

:::

在上述的解释中，我们提到了一个对象 "be moved", 那么如何确定对象是处于这个状态的呢？我们使用了 forwarding address, 如果一个对象被移动了，那么 forwaring address 就会被创建。

我们现在需要联系 read barrier 和 marking phase，copying phase 之间的关系：

- 在 marking phase 中，read barrier 无需使能，因为该 phase 不发生对象的 copy or move;
- 在 copying phase 中，我们需要了解：
  - 如果一个线程读取到的对象的引用(reference to an object) 正在被 copy, read barrier 将等待对象拷贝完成，之后再进行引用的更新；
  - 上述等待的实现称作"thread suspension", 该技术允许 art gc 暂时地暂停线程（这个线程此时访问正在拷贝的对象的引用）

## Concepts

### reference of object

❓❓如何理解 reference of object?

💚通常的概念如下：

1. 一个对象创建后，会在堆上为其分配内存，the reference of this objct 就是这块内存；我们可以使用变量、表达式来表示指向这个对象存储内存的位置；
2. 在常见的编程语言中，Object 通常用 reference 来表示；一个 reference 可以赋值给变量，按照函数参数传递，或者存储在数据结构中；
3. 通常 reference 包含内存地址或者指向对象内存位置的指针；程序需要访问 Object 的时候，可以通过 reference 实现；
4. 通常 reference 由 runtime 或者虚拟机管理，他们负责追踪对象的 reference, 或者分配、释放内存；

🧡在 GC 中的 reference:

1. 在 GC 中，reference 通常用来确定哪个对象正在被使用或者哪个对象可以安全地被释放；
2. GC collector 追踪所有对象的 reference(references to object), 并且可以识别在程序运行期间哪个对象是可达的，不可达对象在 GC 中被视为垃圾；

💛一个对象引用了其他对象如何理解？在 ART 中的内存布局又是如何的呢？

1. 首先，在 ART 的 context 中，object reference 的含义是：*A variable or field that holds a reference to another object*;
2. 如果一个 object 持有另一个 object 的 reference, 那就意味着前者可以访问、修改后者的数据；
3. 基于第 2 点，在 GC 中，如果一个 object 持有另一个 object 的 reference, 则在回收该对象的时候，必须确定其引用的对象不会被意外回收（如果其引用的对象还在被使用的话）；
4. 为了解决这个问题，ART 引入了 read barrier 机制；

### colors in gc

GC 中的染色用来表征到堆中对象的状态：be terms used to refer to the current state of objects in the heap.

- 🤍 White:  not reachable by the programmer, can be safely GC;
- 🤎 Gray: objects that have been discovered by the GC algorithm as potentially reachable, but have not yet been fully processed;
- 🖤Black: objects that have been fully processed by the GC algorithm and are guaranteed to be reachable by the program;

再 mark-and-sweap phase 中，heap 的初始状态都被假定为完全的 White,  GC 从 root 节点开始(set 数据结构) 并且将可达对象标记为 Gray, 然后遍历 Gray 对象，将其引用的对象也标记为 Gray (any objects they reference); 当一个对象和其本身引用的对象都被标记完成以后，将其标记为 Black.

最后，任何留下来的 White 对象都将被垃圾回收。



再 CC GC 中，其实现相比于传统的染色算法更加复杂一些，我们重点先研究一下 Gray 对象：

> - Gray: marked in bitmap, and exists in mark stack
> - Gray-dirty: marked in bitmap, rb_state is gray, corresponding card is dirty, and exists in mark stack

CC GC 中两者的区别在于：

- Gray: bitmap 中 mark 了，并且 mark_stack 中也存在
- Gray-dirty: 除了 Gray 的特征之外，rb_state 是 gary, 并且其卡表也是 dirty

在此稍微说明一下 card 的概念：*refers to a small fixed-size portion of the heap.* 注意主体 heap.

在 CC GC 中，有一件事情需要特别注意：除了 Gray 对象之外，其他所有的对象都不会存在于 mark_stack 中。

## Phases

### Marking Phase

>  Before marking phase
>  
>  1) All objects are white
>  2) Cards are either clean or aged (cannot be asserted without a STW pause)
>  3) Mark bitmap is cleared
>  4) Mark stack is empty

上述很好理解，符合我们染色算法中的定义：在 marking phase 之前，所有的对象都是 White 的；

>  During marking phase
>  
>  1) If a black object holds an inter-region or white reference, then its corresponding card is dirty. In other words, it changes from being  black-clean to black-dirty
>  2) No black-clean object points to a white object

这段比较难理解。

1. Black 对象持有 White 对象的引用，则 Black 对象的 card 是 dirty 的；不难理解，在染色算法中，Black 对象是最后标记的，对象的生命周期的颜色变化一般是：White -> Gray -> Black, 或者 always White;

2. 但是 CC GC 中可能❓会发生一些操作，使得 Black 对象持有了 White 对象的引用，此时 CC GC 的处理是将 该 Black 对象状态转换为 Black-dirty;

3. > Black-dirty: marked in bitmap, and corresponding card is dirty. 
   >
   > Black-clean: marked in bitmap, and corresponding card is clean/aged

4. 没有 black-clean 的对象指向 white object, 我的简单理解就是：都变成了 Black-dirty.

>  After marking phase
>  1) There are no gray objects
>  2) All newly allocated objects are in from space
>  3) No white object can be reachable, directly or otherwise, from a black-clean object

在 Marking Phase 之后:

1. Gray objects 都没有了；
2. 新分配的对象在 from-space; ❓ 这里存疑，还尚不清楚这里是否发生了翻转❌；通常而言，对象的分配也都是在 from-space 中的？ – 后面 Copying Phase 会解答疑问：简单而言，就是在 Marking Phase 中，对象是在 from-space 中分配的；
3. White 对象没有再被 reachable 的了；合理，达到了染色标记的目的。

### Copying Phase

> During copying phase
>  1) Mutators cannot observe white and black-dirty objects
>  2) New allocations are in to-space (newly allocated regions are part of to-space)
>  3) An object in mark stack must have its rb_state = Gray

1. Mutator 线程看不到 White or Black-dirty 对象；
   - 对于这句话的理解，可能要分为几个维度；首先 Copying Phase 是在 Marking Phase 之后的，所以此时应该是：
     - White: 不可达对象
     - Black-dirty: ❓较难理解，其实还是需要弄清楚为什么会产生 Black-dirty 对象？
   - 我们禁止 mutator 线程看到不可达的对象，其中会使用一些技术；@todo 到底是怎么实现的呢？
2. 新分配的对象在 to-space 中；这个好理解，对比前面在 Marking Phase 中，我们只允许新分配的对象在 from-space 中；
3. mark stack 中的对象 rb_state = Gray;  这是在 Copying Phase 中的一个限制
