---
title: nccl-test run
date: 2025-10-15
tags:
  - AI
  - 高性能通信
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

