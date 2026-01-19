---
title: HTA 算法原理与实现
date: 2026-01-18
tags: [profiling, pytorch, gpu, distributed-training, performance, algorithm]
description: "深入分析 Holistic Trace Analysis (HTA) 的核心算法原理、数据结构设计和关键实现细节。"
---

## 概述

Holistic Trace Analysis (HTA) 是 Meta 开源的 PyTorch trace 分析库，其核心价值在于将复杂的 Kineto trace 数据转化为可操作的性能洞察。本文深入分析 HTA 的算法原理和实现要点。

## Trace 数据模型

### Kineto Trace 结构

PyTorch Profiler 生成的 Kineto trace 采用 Chrome Trace Format，核心字段：

```json
{
  "name": "aten::mm",
  "cat": "cpu_op",
  "ph": "X",           // 事件类型: X=完整事件, B/E=开始/结束
  "ts": 1234567890,    // 时间戳 (微秒)
  "dur": 100,          // 持续时间 (微秒)
  "pid": 0,            // 进程 ID
  "tid": 1,            // 线程 ID
  "args": {
    "correlation": 12345,  // CPU-GPU 关联 ID
    "stream": 7            // CUDA stream
  }
}
```

### Correlation ID 机制

CPU 和 GPU 事件通过 `correlation` 字段关联：

```
CPU Thread                    GPU Stream
    │                             │
    ├─ cudaLaunchKernel ─────────►├─ matmul_kernel
    │  (correlation=123)          │  (correlation=123)
    │                             │
```

HTA 利用此机制构建 CPU operator → GPU kernel 的映射关系。

## Idle Time Breakdown 算法

### 问题定义

了解 GPU 空闲时长及其成因，是制定优化策略的关键。当 GPU 上没有 Kernel 在执行时，即视为空闲状态。HTA 开发了一套算法，将空闲时间归类为以下三种类型：

### 三类空闲原因

**1. Host Wait（主机等待）**

CPU 提交 Kernel 的速度不足以让 GPU 保持忙碌，导致 GPU 处于"饥饿"状态。这是 CPU 端瓶颈的典型表现。

优化建议：
- 检查导致减速的 CPU 算子（operators）
- 增大批大小（batch size），提升单次计算量
- 应用算子融合（operator fusion），将多个相邻操作合并为单一 Kernel，减少内存访问和启动开销

**2. Kernel Wait（Kernel 等待）**

连续 Kernel 启动之间的短暂开销累积。每次 Kernel 启动通常需要 3-15μs 的 CPU 开销，当工作负载由大量短时 Kernel 组成时，这些开销会成为性能瓶颈。

优化建议：
- 使用 CUDA Graph 将多个 Kernel 操作捕获为可重放的图结构，将启动开销从"每次执行"降为"一次性"
- 对于迭代执行的工作流尤为有效

**3. Other Wait（其他等待）**

因信息不足而暂时无法明确归因的空闲时间。可能原因包括：
- CUDA 流（streams）之间通过 CUDA 事件（events）进行的同步等待
- Kernel 启动时的调度延迟
- 隐式的 Host-Device 同步点

### 归因判定条件

| 类别 | 判定条件 | 根因 |
|------|----------|------|
| **Host Wait** | GPU 空闲期间 CPU 无 kernel launch 活动 | CPU 成为瓶颈 |
| **Kernel Wait** | 连续 kernel 间隔 < 阈值 (默认 30ns) | kernel launch 固有开销 |
| **Other Wait** | 无法归因到上述两类 | stream 同步、event 等待等 |

### 算法流程

```python
# 输入: GPU kernel 事件列表 (按 stream 分组, 按时间排序)
# 输出: 每个空闲区间的归因类别

for each stream:
    kernels = sorted(stream.kernels, by=start_time)
    for i in range(len(kernels) - 1):
        gap_start = kernels[i].end_time
        gap_end = kernels[i+1].start_time
        gap_duration = gap_end - gap_start
        
        if gap_duration <= 0:
            continue  # kernel 重叠，无空闲
        
        if gap_duration < consecutive_kernel_delay:
            category = KERNEL_WAIT
        else:
            # 检查 gap 期间是否有 CPU 端的 kernel launch
            cpu_launches = find_cpu_launches_in_range(gap_start, gap_end)
            if cpu_launches is empty:
                category = HOST_WAIT
            else:
                category = OTHER_WAIT
```

> **kernel wait：CPU 早就调用了下一个 kernel（`curr_ts_runtime <= prev_end_ts`），但两个 kernel 在 GPU 上之间仍有一段“小于阈值 consecutive_kernel_delay 的短 idle 间隙”，这段 idle 记为 kernel wait**。

### Host Wait 判定细节

Host Wait 的核心判断：在 GPU 空闲期间，CPU 是否有"动作"。

```python
def is_host_wait(gap_start, gap_end, cpu_events):
    """
    如果 gap 期间没有 cudaLaunchKernel 等 runtime 调用，
    说明 CPU 还没来得及提交 kernel，GPU 在等 CPU。
    """
    for event in cpu_events:
        if event.category == "cuda_runtime":
            if event.start_time >= gap_start and event.end_time <= gap_end:
                return False  # CPU 有活动，不是 host wait
    return True
```

> **host wait：CPU 发起下一次 kernel 调用的时间晚于上一个 kernel 结束时间（`curr_ts_runtime > prev_end_ts`）**。
### Kernel Wait 阈值选择

**归因算法说明**: Host Wait 可理解为"GPU 因 CPU 原因而停滞的时间"。对于 Kernel Wait 的归因，采用以下启发式规则：当连续 Kernel 之间的空闲间隔小于特定阈值时，将其归类为 Kernel Wait。

默认阈值 30ns 的依据：
- CUDA kernel launch 的最小开销约 5-20μs (CPU 端)
- GPU 端连续 kernel 切换的硬件开销约 10-50ns
- 30ns 是保守估计，可根据实际硬件调整

## Temporal Breakdown 算法

### 时间分类

将 GPU 时间轴划分为三类：

1. **Compute Time**: 计算 kernel 运行时间
2. **Non-Compute Time**: 通信 (NCCL) 和内存 (memcpy/memset) kernel 时间
3. **Idle Time**: 无 kernel 运行

### Kernel 类型识别

```python
def classify_kernel(kernel_name: str) -> KernelType:
    # 通信 kernel: NCCL 前缀
    if kernel_name.startswith("nccl"):
        return KernelType.COMM
    
    # 内存 kernel: memcpy/memset
    if kernel_name in ["Memcpy_H2D", "Memcpy_D2H", "Memcpy_D2D", "Memset"]:
        return KernelType.MEM
    
    # 其他为计算 kernel
    return KernelType.COMP
```

### 重叠时间处理

当多个 stream 上的 kernel 并行执行时，需要正确处理重叠：

```python
def compute_temporal_breakdown(kernels_by_stream):
    """
    使用扫描线算法处理多 stream 重叠
    """
    events = []
    for stream, kernels in kernels_by_stream.items():
        for k in kernels:
            events.append((k.start, 'START', k.type, stream))
            events.append((k.end, 'END', k.type, stream))
    
    events.sort(key=lambda x: (x[0], x[1] == 'START'))  # END 优先
    
    active_kernels = defaultdict(int)  # type -> count
    last_time = events[0][0]
    breakdown = {COMP: 0, COMM: 0, MEM: 0, IDLE: 0}
    
    for time, event_type, kernel_type, stream in events:
        duration = time - last_time
        
        if sum(active_kernels.values()) == 0:
            breakdown[IDLE] += duration
        elif active_kernels[COMP] > 0:
            # 计算优先：有计算 kernel 运行时，时间算作 compute
            breakdown[COMP] += duration
        else:
            # 否则按 COMM > MEM 优先级
            if active_kernels[COMM] > 0:
                breakdown[COMM] += duration
            else:
                breakdown[MEM] += duration
        
        if event_type == 'START':
            active_kernels[kernel_type] += 1
        else:
            active_kernels[kernel_type] -= 1
        
        last_time = time
    
    return breakdown
```

:::tip[关键设计]
当 compute 和 communication kernel 重叠时，时间计入 compute。这反映了"重叠是好的"这一优化目标。
:::

## Communication-Computation Overlap 算法

### 定义

$$\text{Overlap \%} = \frac{\sum \text{(COMP 与 COMM 重叠时间)}}{\sum \text{(COMM 总时间)}} \times 100$$

### 实现思路

```python
def compute_overlap(comp_intervals, comm_intervals):
    """
    comp_intervals: [(start, end), ...] 计算 kernel 区间
    comm_intervals: [(start, end), ...] 通信 kernel 区间
    """
    total_comm_time = sum(end - start for start, end in comm_intervals)
    
    # 合并计算区间 (处理重叠)
    merged_comp = merge_intervals(comp_intervals)
    
    overlap_time = 0
    for comm_start, comm_end in comm_intervals:
        for comp_start, comp_end in merged_comp:
            # 计算交集
            overlap_start = max(comm_start, comp_start)
            overlap_end = min(comm_end, comp_end)
            if overlap_start < overlap_end:
                overlap_time += overlap_end - overlap_start
    
    return overlap_time / total_comm_time * 100 if total_comm_time > 0 else 0
```

## Queue Length 计算

### 概念

Queue Length = 某 CUDA stream 上待执行的操作数量。当 queue length ≥ 1024 时，CPU 会阻塞。

### 算法

```python
def compute_queue_length_series(cpu_launches, gpu_kernels, stream):
    """
    CPU launch 时 queue_length++
    GPU kernel 完成时 queue_length--
    """
    events = []
    
    for launch in cpu_launches:
        if launch.stream == stream:
            events.append((launch.start_time, +1, 'launch'))
    
    for kernel in gpu_kernels:
        if kernel.stream == stream:
            events.append((kernel.end_time, -1, 'complete'))
    
    events.sort(key=lambda x: x[0])
    
    queue_length = 0
    series = []
    for ts, delta, _ in events:
        queue_length += delta
        series.append((ts, queue_length))
    
    return series
```

## CUDA Kernel Launch Statistics

### 三个关键指标

1. **CPU Duration**: `cudaLaunchKernel` 等 runtime 调用的耗时
2. **GPU Duration**: 对应 GPU kernel 的执行时间
3. **Launch Delay**: GPU kernel 开始时间 - CPU runtime 结束时间

```
Timeline:
CPU: |--cudaLaunchKernel--|
                          ^
                          |  launch_delay
                          v
GPU:                      |----kernel----|
```

### 异常检测

```python
def detect_anomalies(launch_stats, runtime_cutoff=50, delay_cutoff=100):
    """
    runtime_cutoff: CPU runtime 异常阈值 (μs)
    delay_cutoff: launch delay 异常阈值 (μs)
    """
    short_kernels = []      # GPU 时间 < CPU 时间
    runtime_outliers = []   # CPU runtime > cutoff
    delay_outliers = []     # launch delay > cutoff
    
    for stat in launch_stats:
        if stat.gpu_duration < stat.cpu_duration:
            short_kernels.append(stat)
        if stat.cpu_duration > runtime_cutoff:
            runtime_outliers.append(stat)
        if stat.launch_delay > delay_cutoff:
            delay_outliers.append(stat)
    
    return short_kernels, runtime_outliers, delay_outliers
```

**Short GPU Kernels** 意味着 kernel 太小，launch overhead 占比过高，应考虑 kernel fusion。

## Frequent CUDA Kernel Sequences

### 问题

识别由特定 CPU operator 频繁触发的 GPU kernel 序列，用于发现 fusion 机会。

### 算法：序列模式挖掘

```python
def find_frequent_sequences(operator_name, trace, min_len=3, top_k=5):
    """
    1. 找到所有名为 operator_name 的 CPU op
    2. 对每个 op，收集其触发的 GPU kernel 序列
    3. 统计序列频率
    """
    sequences = []
    
    for op in trace.cpu_ops:
        if op.name == operator_name:
            # 通过 correlation ID 找到关联的 GPU kernels
            kernels = trace.get_gpu_kernels_by_correlation(op.correlation_ids)
            kernel_names = tuple(k.name for k in sorted(kernels, key=lambda x: x.start))
            if len(kernel_names) >= min_len:
                sequences.append(kernel_names)
    
    # 统计频率
    from collections import Counter
    freq = Counter(sequences)
    
    return freq.most_common(top_k)
```

## 关键数据结构

### Trace 类

```python
class Trace:
    def __init__(self, trace_dir):
        self.trace_files: Dict[int, str]  # rank -> file path
        self.symbol_table: SymbolTable    # 字符串池化
        self.traces: Dict[int, pd.DataFrame]  # rank -> events dataframe
    
    def load_traces(self):
        """加载并解析所有 rank 的 trace 文件"""
        for rank, path in self.trace_files.items():
            raw = json.load(open(path))
            df = self._parse_events(raw['traceEvents'])
            self.traces[rank] = df
```

### Symbol Table 优化

Trace 中大量重复字符串（kernel 名、op 名），使用符号表池化：

```python
class SymbolTable:
    def __init__(self):
        self._str_to_id: Dict[str, int] = {}
        self._id_to_str: List[str] = []
    
    def get_id(self, s: str) -> int:
        if s not in self._str_to_id:
            self._str_to_id[s] = len(self._id_to_str)
            self._id_to_str.append(s)
        return self._str_to_id[s]
    
    def get_str(self, id: int) -> str:
        return self._id_to_str[id]
```

DataFrame 中存储 int ID 而非 string，显著减少内存占用。

## 性能优化技巧

### 1. 向量化操作

避免 Python 循环，使用 pandas/numpy 向量化：

```python
# Bad: Python loop
for i, row in df.iterrows():
    if row['duration'] > threshold:
        result.append(row)

# Good: Vectorized
result = df[df['duration'] > threshold]
```

### 2. 按需加载

大型 trace 文件可能数 GB，按需加载特定 rank：

```python
def get_trace_for_rank(self, rank: int) -> pd.DataFrame:
    if rank not in self._loaded_traces:
        self._loaded_traces[rank] = self._load_single_trace(rank)
    return self._loaded_traces[rank]
```

### 3. 预计算索引

频繁查询的字段建立索引：

```python
# 按 stream 分组的 kernel 索引
self._kernels_by_stream: Dict[int, pd.DataFrame] = {}
for stream in df['stream'].unique():
    self._kernels_by_stream[stream] = df[df['stream'] == stream]
```

## 与 Critical Path Analysis 的关系

HTA 的 Lightweight Critical Path Analysis 构建在上述基础设施之上：

1. **节点**: 利用 Trace 类解析的事件
2. **边**: 利用 correlation ID 建立 CPU-GPU 关联
3. **同步边**: 利用 CUDA sync 事件（需 PyTorch 特定版本支持）

详细的关键路径算法原理参见 [Critical Path of AI Trace](./critical_path.md)。

## 参考资料

- [HTA GitHub Repository](https://github.com/facebookresearch/HolisticTraceAnalysis)
- [PyTorch Blog: Trace Analysis for the Masses](https://pytorch.org/blog/trace-analysis-for-masses/)
- [HTA Documentation](https://hta.readthedocs.io/)
