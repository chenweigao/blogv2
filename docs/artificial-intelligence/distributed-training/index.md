# Distributed Training

分布式训练技术和大规模模型训练方案。

## 📚 分布式策略

### Data Parallelism
- [DistributedDataParallel (DDP)](./ddp.md) - PyTorch 数据并行
- [Horovod](./horovod.md) - 跨框架分布式训练
- [Parameter Server](./parameter-server.md) - 参数服务器架构

### Model Parallelism
- [Pipeline Parallelism](./pipeline-parallel.md) - 流水线并行
- [Tensor Parallelism](./tensor-parallel.md) - 张量并行
- [Sequence Parallelism](./sequence-parallel.md) - 序列并行

### Advanced Techniques
- [3D Parallelism](./3d-parallelism.md) - 三维并行策略
- [Expert Parallelism](./expert-parallel.md) - 专家并行 (MoE)
- [Gradient Compression](./gradient-compression.md) - 梯度压缩

## 🚀 大模型训练

### Training Systems
- [DeepSpeed](./deepspeed.md) - Microsoft 分布式训练
- [FairScale](./fairscale.md) - Facebook 可扩展训练
- [Megatron-LM](./megatron.md) - NVIDIA 大模型训练

### Communication Optimization
- [NCCL](./nccl.md) - NVIDIA 集合通信库
- [Gloo](./gloo.md) - Facebook 通信库
- [MPI](./mpi.md) - 消息传递接口

## 🔧 集群管理

- [Kubernetes for ML](./k8s-ml.md) - K8s 机器学习部署
- [Slurm](./slurm.md) - 作业调度系统
- [Ray](./ray.md) - 分布式计算框架