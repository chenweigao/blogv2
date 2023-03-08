---
title: ART dex2oat
date: 2022-10-28
tag:
 - jvm
 - java
category:
 - JAVA
---

## Abstract

本文主要研究 art 中的 dex2oat 模块。

写作本文的目的在于，笔者在研究 `getCharNoCheck` 的 native 实现的时候，发现其调用的路径是与 dex2oat 有关的，所以对这个模块进行简单的研究；

第一阶段本文主要研究，Andriod 运行时 art 加载 oat 文件的过程分析，写作时间2022年10月28日；

第二阶段主要对本文进行补充，包括 oat 文件结构的研究；

## Art & oat

### oat 文件的产生

首先需要弄明白，oat 文件是如何产生的？首先是 Art 虚拟机的创建过程，我们在前文已经进行了研究。

@todo



### dex2oat 什么时候被触发

dex2oat 进程的启动，可以分为两类：

1. Installd 进程触发的 dex2oat

   - 应用安装；包括普通安装和通过 shellCmd 安装，安装一个 app 的过程中需要编译 dex 文件，会通知 Installd 来触发一个 dex2oat 进程

   - 开机扫描，开机过程中，PMS 扫描已安装 app 过程，判断需要优化时，则会对 installd 发出通知

   - BackgroundDexOptService，空闲时段或者开机之后触发的 Backgroud 的 Job，会通知 installd 进行dex2oat

   - OTADexoptService, 疑似 OTA 过程中触发

2. 由 app 中直接调用的 dex2oat；App 进程 fork 出一个子进程，子进程用来执行 dex2oat, 编译相关的 dex, 父进程进行 waitpid 等待，等待完成后再运行其他逻辑。

   - 微信安装后的首次启动，有 dex2oat 的调用；

   - 淘宝安装后的首次搜索，有 dex2oat 的调用

## dex2oat code

### main()

dex2oat 的 main 函数定义如下：

```cpp
// art/dex2oat/dex2oat.cc
int main(int argc, char** argv) {
  int result = static_cast<int>(art::Dex2oat(argc, argv));
  // Everything was done, do an explicit exit here to avoid running Runtime destructors that take
  // time (bug 10645725) unless we're a debug or instrumented build or running on a memory tool.
  // Note: The Dex2Oat class should not destruct the runtime in this case.
  if (!art::kIsDebugBuild && !art::kIsPGOInstrumentation && !art::kRunningOnMemoryTool) {
    art::FastExit(result);
  }
  return result;
}
```

在 main 函数中，调用了 `Dex2oat`；



[^1]: [dex2oat介绍](https://huanle19891345.github.io/en/android/art/1%E7%B1%BB%E7%BC%96%E8%AF%91/dex2oat%E4%BB%8B%E7%BB%8D/)

