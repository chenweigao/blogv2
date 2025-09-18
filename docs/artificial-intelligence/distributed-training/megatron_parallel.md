---
title: Megatron & Parallel
date: 2025-09-18
---
## 1. 并行策略
### 1.1. 概览 (case)

```bash
export MP_SIZE=4
export PP_SIZE=1
export EP_SIZE=8

--tensor-model-parallel-size 1

# 解析参数
--expert-model-parallel-size ${EP_SIZE}
--tensor-model-parallel-size $MP_SIZE
--pipeline-model-parallel-size $PP_SIZE

```

对应的专家数量 128，单机 8 卡。

### 1.2. TP

`MP_SIZE=4` 标识了 TP 的配置。