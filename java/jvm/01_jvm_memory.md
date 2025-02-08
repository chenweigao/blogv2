---
title: JVM Memory
date: 2024-12-15
tag:
 - jvm
 - java
category:
 - JAVA
 - JVM
---

JVM 的软件架构如下：

![img](../images/b9dcbe63-9bfa-4323-8f40-97c48ca6e7a4.png)JAVA 内存布局如下图所示：

![JVM MEM](../images/jvm_mem.webp)

通过对典型应用的 JVM 内存进行拆解，如下：

```shell
Total: reserved=15538605KB, committed=14221757KB

Java Heap (reserved=9601024KB, committed=9601024KB)
Class (reserved=2095827KB, committed=1215827KB)    
	Metadata (reserved=995328KB, committed=993536KB) 
	## 每个类的元数据：类名、方法、字段描述    
	
	Class space (reserved=1048576KB, committed=170368KB) 
	## 为类加载器存储的数据预留的空间
Thread (reserved=43505KB, committed=10101KB) 
## 包括线程栈和线程本地存储    
	stack (reserved=43505KB, committed=10101KB) 
	## 对每个线程分配的栈空间，大小可通过 -Xss 配置

Code (reserved=977086KB, committed=573642KB) # 为 JIT 编译器预留的内存
GC (reserved=495136KB, committed=495136KB) # 为 GC 预留的内存
Compiler (reserved=734KB, committed=734KB)
Internal (reserved=20654KB, committed=20654KB) #JVM 内部使用的内存，依赖于 JVM 的实现
Other (reserved=733088KB, committed=733088KB) 
## Native Memory Tracking, Arena Chunk, Logging, 
## Arguments, Module,Synchronizer, Safepoint, Wisp, null
```



下面章节对这些区域进行逐一说明。

## 1. 栈区

JVM 在运行时的数据区大致如下图所示：

<img src="../images/1ccdb38e-07aa-41a5-9bfb-0d140fe7149f.jpg" alt="1ccdb38e-07aa-41a5-9bfb-0d140fe7149f.jpg" style="display: block; margin: 0 auto; zoom: 50%;" />

准确来说，栈区包括虚拟机栈、本地方法栈；PC 寄存器是很小的一块内存空间，指向当前线程所执行的字节码的行号，如果线程执行的是 Java 方法，则指向虚拟机字节码指令的地址；如果执行的是 native 方法，这个计数器通常为空。
VM Stack 是线程私有，生命周期与线程相同。如章节 1.1 中的图片所示，VM Stack 中有若干的栈帧 (Stack Frame)，每一个 Stack Frame 都对应一个方法。通常大家说的虚拟机中的栈都会特指 VM Stack.
栈区包含若干栈帧，每个栈帧中包括以下信息：
1. 局部变量表（Local Variable Array）：用于存储方法的局部变量和输入的参数。局部变量表以数组形式存储，Java 虚拟机根据字节码对这些变量进行索引和操作。
2. 操作数栈（Operand Stack）：用于执行计算时的操作数存储和结果保留。Java 字节码指令使用操作数栈来完成大多数操作，例如加法、乘法、方法调用等。
3. 动态链接（Dynamic Linking）：包含指向运行时常量池中方法引用的指针。这部分主要用于支持方法调用的运行时解析。
4. 方法返回地址（Return Address）：当方法调用完成后，程序需要知道返回到哪一行继续执行。返回地址存储着调用方法的下一条指令的地址。

附加信息：一些实施可能还会包括其他信息，例如调试信息、异常处理器和栈映射帧等。
本地方法栈主要是为虚拟机使用到的 Native 方法服务。

## 2. 堆

<img src="../images/db26f870-7ab0-4c24-a328-e6c8f86ab699.png" alt="db26f870-7ab0-4c24-a328-e6c8f86ab699.png" style="display: block; margin: 0 auto; zoom:70%;" />

### 2.1. 对象创建与内存布局

JVM 遇到对象创建的字节码时，首先去检查常量池中是否存在这个累的符号引用，并且判断这个符号引用代表的类是否被加载、解析、初始化过，如果没有，则需要进行类的加载过程。
检查后，开始为新对象分配内存，对象大小在类加载完成后确定，JVM 需要从堆上为对象划分一块内存。
对于 JVM 对象在堆内存中的存储布局，可以划分为三个部分：Header, Instance Data 和 Padding.
Header 包含两类信息，一类是对象自身运行时数据，Mark Word；另一部分是类型指针，即对象指向它的类型元数据的指针，通过这个指针，JVM 可以确定这个对象是哪个类的实例。
Instance Data 存储的是在程序代码中所定义的各种类型的字段内容，从父类继承下来的和子类定义的字段都必须记录下来。这部分的存储顺序会影响到该对象的内存占用，可以通过 -XX：FieldsAllocationStyle 参数修改分配策略。
Padding 部分并不是必然存在，主要起到占位符的作用，其主要作用是保证对象的大小是 8 字节的整数倍；由于对象头一般是 32bit 或 64bit, 所以通常对齐的是 Instance Data.

### 2.2. Code Cache
CodeCache 内存主要存储 JVM 动态生成的代码。动态生成的代码最主要的是 JIT 编译后的代码，其次动态生成的代码，本地方法代码（JNI）也会存在 CodeCache 中。
上章节提到的 NonProfiledHotCodeHeap 是属于 JIT 编译的产物，所以是 CodeCache 的一部分。
code cache 会被分成三块区域，可以使用 `jcmd <pid> Compiler.codecache` 打印出各个区域的情况，如下图所示：

<img src="../images/codecache.jpg" alt="codecache" style="display: block; margin: 0 auto; zoom: 25%;" />

这三个区域的含义如下：
1. non-nmethods, 也叫做 JVM internal (non-method) code，通常包括 compiler buffers 和 bytecode interpreter 等，这些代码通常永久保存在 codecache 中；itable/vtable stub 这些函数就保存在该区域。
2. profiled nmethods，表示被 profiled 但是 lightly optimized 的 code heap 区域，profiled nmethods 的生命周期较短；由 ProfiledCodeHeapSize 控制大小；
3. non-profiled nmethods，被 fully optimized 的 C2 编译，生命周期较长；由 NonProfiledCodeHeapSize 控制大小；为了更高的性能优化，我们在 non-profiled 区再开辟了一块空间用于存储 non-profiled-hot-code, 这个 heap 区域一般比较小，由 NonProfiledHotCodeHeapSize 控制，该区域存储的 hotest code 能在 non-profile heap 中再进行冷热分离，提高性能。
其内存布局如下图所示：

JVM 的 THP 重排就是针对 non-profiled code heap 中的 non-profiled hot code heap 进行了重排。

### 2.3. 浅堆和深堆

浅堆和深堆通常是计算机科学中特别是在垃圾回收领域讨论的两个概念。它们通常用于分析对象在内存中的占用情况。

1. **浅堆（Shallow Heap）** 浅堆大小指的是一个**对象本身在堆内存中的大小**，不包括该对象引用的其他对象所占的内存。例如，一个 Java 对象的浅堆大小只计算该对象的数据字段和对象头（如类元数据引用、锁信息等）所占据的内存。
2. **深堆（Retained Heap）** 深堆大小是指对象本身以及从该对象可达的所有其他对象所占的内存之和。这意味着它考虑了整个对象图的内存占用，是一个递归的大小计算。计算深堆大小通常用于了解某个对象及其相关对象链的整体内存使用情况。

在性能分析中，浅堆和深堆的区别可以帮助开发者识别内存泄漏和优化内存使用。例如，通过分析一个应用程序中某个对象的深堆大小，开发者可以识别出由于复杂的对象引用导致的高内存消耗情况。

在使用工具进行堆分析时（如 Java 的 VisualVM 或 Eclipse MAT），这些概念可以帮助更有效地理解内存分布和定位性能问题。

## 3. 堆外内存

堆外内存有以下作用:
  - **高性能计算**: 对于需要高速读写的数据，直接操作堆外内存能够避免 JVM 内部的某些开销。
  - **网络传输**: 在网络编程中，特别是使用 NIO(非阻塞I/O)时，可以直接将数据从堆外内存发送到网络上或者从网络接收到堆外内存中，从而减少了复制数据的过程。
  - **大数据处理**: 当处理非常大的数据集时，合理利用堆外内存可以帮助更好地控制内存使用情况。

可以通过`ByteBuffer.allocateDirect()`方法来申请一块直接缓冲区，这块内存就是位于 JVM 堆外的。使用 Unsafe 类也可以直接操作内存地址，但这种方式比较底层，通常不推荐常规使用。

其优缺点如下：
  - 减少了垃圾收集的工作量，因为这部分内存不由GC管理。
  - 与操作系统更紧密地集成，有时候能提供更好的性能表现。
  - 管理不当容易造成内存泄漏问题，因为这些内存不会被自动回收。
  - 分配和释放堆外内存可能会比普通的堆内存消耗更多时间。

监控堆外内存的使用情况非常重要，可以通过设置 JVM 参数如 `-XX:MaxDirectMemorySize` 来限制最大可使用的直接内存大小。使用工具如 VisualVM、JConsole 等可以帮助查看当前应用的堆外内存使用状况。如果发现有内存泄露的问题，可能需要深入代码检查是否有未正确释放的直接缓冲区。

虽然使用堆外内存可以带来一定的性能提升，但也增加了程序复杂性和潜在的风险。因此，在决定是否使用之前应该仔细权衡利弊。需要注意的是，尽管堆外内存不受 JVM GC的影响，但如果整个系统内存不足，还是有可能导致OutOfMemoryError 错误的发生。

总之，合理地利用 JVM 堆外内存可以在特定场景下显著改善应用程序的性能，但是也需要注意相关的管理和优化工作。


## 4. Reference

- [苹果的堆内存管理与分析](https://developer.apple.com/cn/videos/play/wwdc2024/10173/?spm=ata.21736010.0.0.13622830DuCZPL)，可以作为目标。



