---
title: nccl-test run
date: 2025-10-15
tags: 
  -  AI
  -  高性能通信
---

# nccl-test benchmark

本文主要介绍 NCCL 测试工具 nccl-test，以及其安装、运行方式；除此之外，分析、学习 nccl-test 的运行原理。

## 1. Install

```bash
apt-get update && apt-get install -y infiniband-diags ibverbs-utils libibverbs-dev libfabric1 libfabric-dev libpsm2-dev openmpi-bin openmpi-common libopenmpi-dev libgtk2.0-dev librdmacm-dev libpsm2-dev git
```

```bash
git clone https://github.com/NVIDIA/nccl-tests.git
```

```bash
make MPI=1 MPI_HOME=/usr/lib/x86_64-linux-gnu/openmpi/
```

## 2. Introduction

### 2.1. mpirun

mpirun 是一个用于启动和管理  MPI（消息传递接口）程序的实用程序。它允许您在单个节点或多个节点上并行运行程序。如下所示，我们有两台机器，使用 mpirun 在两台机器上分别运行一个 pwd 命令。

```bash
/usr/local/openmpi/bin/mpirun --allow-run-as-root -np 2 -hostfile hostfile pwd
```

```bash
# 2台机器，16 张 GPU卡，执行 all_reduce_perf 测试
mpirun -np 16 \
 -H 172.16.2.8:8,172.16.2.13:8 \
 --allow-run-as-root -bind-to none -map-by slot \
 -x NCCL_DEBUG=INFO \
 -x NCCL_IB_GID_INDEX=3 \
 -x NCCL_IB_DISABLE=0 \
 -x NCCL_SOCKET_IFNAME=eth0 \
 -x NCCL_NET_GDR_LEVEL=2 \
 -x NCCL_IB_QPS_PER_CONNECTION=4 \
 -x NCCL_IB_TC=160 \
 -x LD_LIBRARY_PATH -x PATH \
 -mca coll_hcoll_enable 0 -mca pml ob1 -mca btl_tcp_if_include eth0 -mca btl ^openib \
 all_reduce_perf -b 32M -e 1G -i 1000 -f 2 -g 1

```

这个命令是分别在 172.16.2.8，172.16.2.13 两个 host 上，各启动 8 个（IP 后面的冒号指定每个 host 上的进程数）all_reduce_perf 进程。

## 3. 运行时配置

### 3.1. 参数

有两个参数需要关注：

- `-n,--iters <iteration count>`，迭代次数，默认为 20。即执行多少组 nccl 操作，作为一次测试操作。并取平均值作为测试结果（单次测试结果可能会不准确）；

- `-m,--agg_iters <aggregated iteration count>`，每次迭代中要聚合在一起的操作次数。默认值为：1。每一次迭代中，要再执行几次聚合操作（其实和普通 nccl 操作一样）；
