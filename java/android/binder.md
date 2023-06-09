---
title: Research on Binder
date: 2023-06-07
tag:
 - kernel
 - Android
category:
 - Android

---

## Overview

kernel 侧实现：kernel/linux-5.10/drivers/android/binder.c

## IPC 通信

binder 相比于传统的 IPC 通信拥有比较大的优势：其只需要进行一次拷贝。IPC 通信的原理大致如下：



## mmap 技术

mmap(), 或者称之为内存映射技术，是实现 binder 的重要技术之一。

mmap() 可以将一个文件、一段物理内存或者其他对象映射到**进程的虚拟地址空间**。在内存映射技术中，操作系统会为每个映射的文件或设备创建一个虚拟地址空间，然后将该虚拟地址空间中的每个地址都映射到文件或设备的实际物理地址上。

❤️❤️ 对于这句话的理解，物理内存（物理页）–> 虚拟内存（虚拟页）；物理页是内核管理物理页的基本单位。

❌❌ 目前来看：这种映射本身操作系统就会完成，那么 mmap 做了什么呢？

mmap 有一个重要的理念：访问文件（如果映射的是文件）就像是访问内存一样。



## Reference

1. [mmap 接口解析：《一文读懂 mmap 原理》](https://juejin.cn/post/6956031662916534279)

2. [IPC 通信与 binder 基础介绍：《Android Binder原理图解》](https://developer.aliyun.com/article/933229)

3. [binder 基本原理：《Android Binder原理（一）学习Binder前必须要了解的知识点》](https://blog.csdn.net/itachi85/article/details/102713845)
