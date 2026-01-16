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

TP 是「张量并行」（Tensor Parallelism）的缩写，本质是通过**拆分模型的核心张量（如权重、输入输出特征）**，让多个 GPU 协同完成单个==层==的计算。其目的是突破单卡**显存**的限制，支撑更大模型的训练。

- DP 是「数据分，模型不分」；
- TP 是「模型分（层内张量），数据不分」；
- PP 是「模型分（层间分段），数据也分（流水线批次）」。

### 1.3. 如何拆分张量？

大模型的核心计算是「线性层（FC）」和「注意力层（Attention）」，两者本质都是**矩阵乘法**（如 `Y = X × W`，X 是输入特征，W 是权重矩阵，Y 是输出特征）。TP 的核心就是对这些矩阵进行「合理拆分」，让多卡并行计算，最后合并结果。

TP 可以有两种拆分张量的方式：按输出维度拆分权重（Column-Split）和按输入维度拆分权重（Row-Split），


## 2. debug

### 2.1. NCCL debug

```bash
export TORCH_SHOW_CPP_STACKTRACES=1
export CUDA_LAUNCH_BLOCKING=1
export TORCH_DISTRIBUTED_DEBUG=DETAIL
export NCCL_DEBUG=INFO
export NCCL_ASYNC_ERROR_HANDLING=1
```