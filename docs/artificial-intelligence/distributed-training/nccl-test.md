---
title: nccl-test run
date: 2025-10-15
tags:
  - AI
  - 高性能通信
---

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

