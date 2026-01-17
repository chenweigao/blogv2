# Distributed Training

分布式训练技术和大规模模型训练。

## 📚 现有文档

- [Megatron Parallel](./megatron_parallel.md) - Megatron 并行策略
- [NCCL Test](./nccl-test.md) - NCCL 通信测试

## 🔧 主题概览

### 1. 并行策略

#### Data Parallelism
- DistributedDataParallel (DDP) - PyTorch 数据并行
- Horovod - 跨框架分布式训练
- Parameter Server - 参数服务器架构

#### Model Parallelism
- Pipeline Parallelism - 流水线并行
- Tensor Parallelism - 张量并行
- Sequence Parallelism - 序列并行

#### Advanced Techniques
- 3D Parallelism - 三维并行策略
- Expert Parallelism - 专家并行 (MoE)
- Gradient Compression - 梯度压缩

### 2. 大模型训练

#### Training Systems
- DeepSpeed - Microsoft 分布式训练
- FairScale - Facebook 可扩展训练
- Megatron-LM - NVIDIA 大模型训练

#### Communication Optimization
- NCCL - NVIDIA 集合通信库
- Gloo - Facebook 通信库
- MPI - 消息传递接口

### 3. 集群管理

- Kubernetes for ML - K8s 机器学习部署
- Slurm - 作业调度系统
- Ray - 分布式计算框架
