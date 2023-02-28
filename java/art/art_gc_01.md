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


## Art GC Phases

首先以 ConcurrentCopying GC 为例，大致可以分为以下几个阶段：

