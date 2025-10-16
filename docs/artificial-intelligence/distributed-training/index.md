# Distributed Training

分布式训练技术和大规模模型训练方案。

为了满足 LLM 训练的计算需求，各个厂商均构建了由高性能 GPU 组成的大规模训练集群，并通过高带宽链路互连。下图描述了现代集群大规模训练的通用技术栈，如图所示，Infra 团队管理最核心资源并提供训练优化，在其支持下，算法团队专注于通过各个训练方法将 LLM 适配到面向用户的应用程序。在集团场景下，训练集群还支持其他深度学习任务，例如推荐模型（淘天）和数据生成模型（DT）。

![](./images/index-1760498130374.png)

## 1. 📚 分布式策略

### 1.1. Data Parallelism
- [DistributedDataParallel (DDP)](./ddp.md) - PyTorch 数据并行
- [Horovod](./horovod.md) - 跨框架分布式训练
- [Parameter Server](./parameter-server.md) - 参数服务器架构

### 1.2. Model Parallelism
- [Pipeline Parallelism](./pipeline-parallel.md) - 流水线并行
- [Tensor Parallelism](./tensor-parallel.md) - 张量并行
- [Sequence Parallelism](./sequence-parallel.md) - 序列并行

### 1.3. Advanced Techniques
- [3D Parallelism](./3d-parallelism.md) - 三维并行策略
- [Expert Parallelism](./expert-parallel.md) - 专家并行 (MoE)
- [Gradient Compression](./gradient-compression.md) - 梯度压缩

## 2. 🚀 大模型训练

### 2.1. Training Systems
- [DeepSpeed](./deepspeed.md) - Microsoft 分布式训练
- [FairScale](./fairscale.md) - Facebook 可扩展训练
- [Megatron-LM](./megatron.md) - NVIDIA 大模型训练

### 2.2. Communication Optimization
- [NCCL](./nccl.md) - NVIDIA 集合通信库
- [Gloo](./gloo.md) - Facebook 通信库
- [MPI](./mpi.md) - 消息传递接口

## 3. 🔧 集群管理

- [Kubernetes for ML](./k8s-ml.md) - K8s 机器学习部署
- [Slurm](./slurm.md) - 作业调度系统
- [Ray](./ray.md) - 分布式计算框架