---
title: stage2 analysis
date: 2026-1-15
category:
  - Python
  - AI
---


## 1. 项目概述

本项目是一个基于深度学习的视频质量过滤系统，采用**生产者-消费者模式**实现高效的视频处理流水线。系统支持多种视频质量检测任务，包括 VFX 特效检测、静态帧检测、旋转异常检测、低质量评估以及异常区域检测。

### 1.1 核心特性

- **多进程并行**：使用 `torchrun` 支持多 GPU 分布式推理
- **流水线架构**：I/O 与计算解耦，最大化 GPU 利用率
- **模型实例池**：独占式模型分配，确保线程安全
- **多数据源支持**：CPFS、Alluxio、OSS 三级数据读取策略

---

## 2. 系统架构

### 2.1 整体架构图

```mermaid
flowchart TB
    subgraph Input["数据输入层"]
        ODPS[(ODPS 数据表)]
        OSS[(OSS 对象存储)]
        CPFS[(CPFS 高速存储)]
        Alluxio[(Alluxio 缓存)]
    end

    subgraph Pipeline["处理流水线"]
        direction TB
        EIP[ElasticInferProcess<br/>弹性推理进程]
        DL[DistributeDataset<br/>分布式数据集]
        
        subgraph Producer["生产者线程池"]
            P1[下载线程 1]
            P2[下载线程 2]
            Pn[下载线程 N]
        end
        
        TQ[任务队列<br/>Task Queue]
        
        subgraph Consumer["消费者线程池"]
            W1[Worker 1]
            W2[Worker 2]
            Wn[Worker N]
        end
        
        RQ[结果队列<br/>Result Queue]
    end

    subgraph Models["模型推理层"]
        direction LR
        VJEPA2[VJEPA2 Base]
        VFX[VFX Filter]
        SimCam[SimCam Filter]
        ROV[Rotation Filter]
        LowQ[Low Quality Filter]
        YOLO[YOLO Detector]
    end

    subgraph Output["数据输出层"]
        ODPS_OUT[(ODPS 输出表)]
    end

    ODPS --> EIP
    EIP --> DL
    DL --> Producer
    
    CPFS --> Producer
    Alluxio --> Producer
    OSS --> Producer
    
    Producer --> TQ
    TQ --> Consumer
    Consumer --> Models
    Consumer --> RQ
    RQ --> EIP
    EIP --> ODPS_OUT
```

### 2.2 进程与线程模型

```mermaid
flowchart LR
    subgraph TorchRun["torchrun 多进程"]
        subgraph Process0["进程 0 (Rank 0)"]
            Main0[主线程]
            DT0[下载线程池]
            WT0[Worker 线程池]
            GPU0[GPU 0]
        end
        
        subgraph Process1["进程 1 (Rank 1)"]
            Main1[主线程]
            DT1[下载线程池]
            WT1[Worker 线程池]
            GPU1[GPU 1]
        end
        
        subgraph ProcessN["进程 N (Rank N)"]
            MainN[主线程]
            DTN[下载线程池]
            WTN[Worker 线程池]
            GPUN[GPU N]
        end
    end

    Main0 --> DT0
    Main0 --> WT0
    WT0 --> GPU0
    
    Main1 --> DT1
    Main1 --> WT1
    WT1 --> GPU1
    
    MainN --> DTN
    MainN --> WTN
    WTN --> GPUN
```

---

## 3. 数据处理流程

### 3.1 完整处理流程

```mermaid
sequenceDiagram
    participant ODPS as ODPS 数据表
    participant EIP as ElasticInferProcess
    participant DL as 下载线程池
    participant TQ as 任务队列
    participant Worker as Worker 线程
    participant Model as 模型推理
    participant RQ as 结果队列

    ODPS->>EIP: 读取视频元数据
    EIP->>DL: 分发下载任务
    
    par 并行下载
        DL->>DL: 尝试 CPFS 读取
        alt CPFS 命中
            DL->>TQ: 放入任务队列
        else CPFS 未命中
            DL->>DL: 尝试 Alluxio 读取
            alt Alluxio 命中
                DL->>TQ: 放入任务队列
            else Alluxio 未命中
                DL->>DL: OSS 下载
                DL->>TQ: 放入任务队列
            end
        end
    end
    
    TQ->>Worker: 获取任务
    Worker->>Model: 执行推理
    
    par 多模型并行推理
        Model->>Model: YOLO 异常检测
        Model->>Model: VFX 过滤
        Model->>Model: SimCam 检测
        Model->>Model: ROV 检测
        Model->>Model: 低质量评估
    end
    
    Model->>Worker: 返回结果
    Worker->>RQ: 放入结果队列
    RQ->>EIP: 批量写入 ODPS
```

### 3.2 单视频处理流程

```mermaid
flowchart TD
    A[视频输入] --> B{异常区域检测}
    B --> C[YOLO 目标检测]
    C --> D{检测到异常?}
    
    D -->|是| E[计算安全裁剪区域]
    E --> F[裁剪视频]
    F --> G[上传裁剪视频到 OSS]
    G --> H[使用裁剪后视频]
    
    D -->|否| H
    
    H --> I[视频预处理]
    I --> J[Decord 解码]
    J --> K[帧采样 & 缩放]
    K --> L[归一化处理]
    
    L --> M{全视频推理}
    M --> N[VFX 过滤器]
    M --> O[SimCam 检测器]
    M --> P[ROV 检测器]
    
    L --> Q{分段推理}
    Q --> R[生成滑动窗口片段]
    R --> S[SimCam 分段检测]
    R --> T[低质量分段评估]
    R --> U[反向帧序列检测]
    
    N --> V[结果聚合]
    O --> V
    P --> V
    S --> V
    T --> V
    U --> V
    
    V --> W[输出 JSON 结果]
```

---

## 4. 模型架构

### 4.1 模型层次结构

```mermaid
classDiagram
    class VideoModel {
        +backbone: Backbone
        +neck: Optional[Neck]
        +head: Head
        +forward(x: Tensor) Tensor
        +from_pretrained(path) VideoModel
    }
    
    class TransformersBackbone {
        +model: AutoModel
        +num_features: int
        +type: str
        +forward(x: Tensor) Tensor
    }
    
    class LinearHead {
        +hidden_size: int
        +num_classes: int
        +forward(x: Tensor) Tensor
    }
    
    class AttentiveHead {
        +input_hidden_states_dim: int
        +num_classes: int
        +depth: int
        +forward(x: Tensor) Tensor
    }
    
    class VfxVideoMAE {
        +model: VideoModel
        +infer(video_data) Tensor
    }
    
    class ComunsimcamoveVideoMAE {
        +model: VideoModel
        +infer(video_data) Tensor
    }
    
    class RovertiscreenVideoMAE {
        +model: VideoModel
        +infer(video_data) Tensor
    }
    
    class LowQualityFilterVideoMAE {
        +model: VideoModel
        +infer(video_data) Tensor
    }
    
    class YOLOModel {
        +model: YOLO
        +predict(frames) Results
    }
    
    VideoModel *-- TransformersBackbone
    VideoModel *-- LinearHead
    VideoModel *-- AttentiveHead
    
    VfxVideoMAE --> VideoModel
    ComunsimcamoveVideoMAE --> VideoModel
    RovertiscreenVideoMAE --> VideoModel
    LowQualityFilterVideoMAE --> VideoModel
```

### 4.2 模型配置

| 模型名称 | Backbone | Head | 输入尺寸 | 帧数 | 任务类型 |
|---------|----------|------|---------|------|---------|
| VFX Filter | VJEPA2-base | LinearHead | 256×256 | 48 | 二分类 |
| SimCam Filter | VJEPA2-base | LinearHead | 256×256 | 48 | 二分类 |
| ROV Filter | VJEPA2-rov-base | LinearHead | 256×256 | 48 | 二分类 |
| Low Quality | VJEPA2-base | AttentiveHead | 256×256 | 48 | 二分类 |
| YOLO Detector | YOLOv8 | - | 960×960 | 1 | 目标检测 |

---

## 5. CPU & GPU 交互

### 5.1 数据流转图

```mermaid
flowchart LR
    subgraph CPU["CPU 处理"]
        direction TB
        C1[视频下载]
        C2[Decord 解码]
        C3[帧采样]
        C4[图像变换]
        C5[数据归一化]
        C6[结果后处理]
    end
    
    subgraph Transfer["数据传输"]
        T1[".to('cuda')"]
        T2[".cpu()"]
    end
    
    subgraph GPU["GPU 处理"]
        direction TB
        G1[Backbone 特征提取]
        G2[Head 分类]
        G3[Softmax 概率计算]
    end
    
    C1 --> C2 --> C3 --> C4 --> C5
    C5 --> T1
    T1 --> G1 --> G2 --> G3
    G3 --> T2
    T2 --> C6
```

### 5.2 显存管理策略

```mermaid
flowchart TD
    A[模型加载阶段] --> B[Rank 0 下载模型]
    B --> C[创建同步文件]
    C --> D[其他 Rank 等待]
    D --> E[所有 Rank 加载模型到 GPU]
    
    E --> F[模型预热阶段]
    F --> G[创建模型实例池]
    G --> H[每个模型创建 N 个实例]
    H --> I[实例放入 Queue]
    
    I --> J[推理阶段]
    J --> K{获取模型实例}
    K -->|成功| L[执行推理]
    L --> M[归还实例到池]
    M --> K
    
    K -->|超时| N[抛出异常]
    
    J --> O{定期清理}
    O -->|每10个任务| P[torch.cuda.empty_cache]
    P --> J
```

### 5.3 模型实例池机制

```python
# 独占式模型获取（上下文管理器）
@contextmanager
def acquire_model_instance(model_name, timeout=300):
    """
    以独占方式获取模型实例
    
    使用方法:
        with acquire_model_instance('VfxFilterInfer') as model:
            output = model.infer(video_data)
    """
    pool = _model_instance_pools[model_name]
    model = pool.get(timeout=timeout)  # 阻塞等待
    try:
        yield model
    finally:
        pool.put(model)  # 归还实例
```

---

## 6. 关键模块说明

### 6.1 模块依赖关系

```mermaid
graph TD
    A[video_filter_parallel.py] --> B[src/main.py]
    A --> C[src/video_analyze_utils/video_infer.py]
    A --> D[mdl/distribute_dataset.py]
    A --> E[mdl/elastic_infer.py]
    
    B --> C
    B --> F[src/video_transformers/infer.py]
    B --> G[src/video_abnormal_region_detect/src/core.py]
    
    C --> F
    
    F --> H[src/video_transformers/modeling.py]
    F --> I[src/video_transformers/backbones/transformers.py]
    F --> J[src/video_transformers/pytorchvideo_wrapper/data/video_loader.py]
    
    G --> K[src/video_abnormal_region_detect/src/infer.py]
    
    H --> I
    H --> L[src/video_transformers/heads.py]
```

### 6.2 核心模块功能

| 模块 | 功能描述 |
|------|---------|
| `video_filter_parallel.py` | 入口文件，实现生产者-消费者流水线 |
| `src/main.py` | 单视频处理核心逻辑 |
| `src/video_analyze_utils/video_infer.py` | 模型实例池管理，推理任务封装 |
| `src/video_transformers/infer.py` | VideoMAE 模型封装，数据加载器 |
| `src/video_transformers/modeling.py` | VideoModel 模型定义 |
| `src/video_transformers/backbones/transformers.py` | VJEPA2 Backbone 实现 |
| `src/video_abnormal_region_detect/src/core.py` | 异常区域检测与裁剪 |
| `src/video_abnormal_region_detect/src/infer.py` | YOLO 模型推理 |

---

## 7. 配置参数

### 7.1 全局配置

```python
# 并发控制
MAX_CONCURRENT_DOWNLOADS = 6  # 最大下载并发数
MAX_CONCURRENT_WORKERS = 6    # 最大 Worker 数
MODEL_INSTANCES_NUM = 6       # 每种模型的实例数
MAX_QUEUE_SIZE = 16           # 任务队列最大深度

# 磁盘限制
DISK_LIMIT_BYTES = 180 * 1024**3  # 180 GB

# 模型下载
MOS_MAX_WORKERS = 16  # MOS 下载并发数
```

### 7.2 命令行参数

| 参数 | 默认值 | 说明 |
|------|-------|------|
| `--tables` | "" | ODPS 输入表名 |
| `--outputs` | "" | ODPS 输出表名 |
| `--vfx_enable` | "true" | 启用 VFX 过滤器 |
| `--com_enable` | "true" | 启用运镜检测器 |
| `--rov_enable` | "true" | 启用旋转检测器 |
| `--low_quality_enable` | "true" | 启用低质量评估器 |

---

## 8. 数据流格式

### 8.1 输入数据格式

```json
{
  "video_id": "string",
  "oss_bucket": "string",
  "video_path": "string",
  "video_tag": "string",
  "info": "{\"use_alluxio\": true, ...}"
}
```

### 8.2 输出数据格式

```json
{
  "video_id": "string",
  "oss_bucket": "string",
  "video_oss_url": "string",
  "video_tag": "string",
  "info": {
    "abnormal_region_info": {...},
    "abnormal_region_crop": {...},
    "vfx_filter": {
      "result": {"VFX_video": 0.1, "normal_video": 0.9},
      "label": "normal_video",
      "prob": 0.9
    },
    "simcam_filter": {...},
    "rotate_vertical_filter": {...},
    "seg_simcam_filter": {
      "0": {"duration": [0, 4], "simcam_filter": {...}},
      "1": {"duration": [3, 7], "simcam_filter": {...}}
    },
    "inverse_seg_simcam_filter": {...}
  },
  "result_info": {
    "succeed": "true",
    "start_time": "2025-01-15T10:00:00",
    "end_time": "2025-01-15T10:00:05",
    "avg_cost": 5.0,
    "device_name": "NVIDIA A100",
    "device_info": {...}
  }
}
```

---

## 9. 性能优化策略

### 9.1 I/O 优化

```mermaid
flowchart LR
    subgraph Strategy["三级存储策略"]
        A[CPFS<br/>本地高速存储] -->|未命中| B[Alluxio<br/>分布式缓存]
        B -->|未命中| C[OSS<br/>对象存储]
    end
    
    subgraph Parallel["并行下载"]
        D[下载线程 1]
        E[下载线程 2]
        F[下载线程 N]
    end
    
    Strategy --> Parallel
```

### 9.2 计算优化

1. **模型实例池**：预创建多个模型实例，避免推理时的模型加载开销
2. **FP16 推理**：使用半精度浮点数减少显存占用和计算时间
3. **批量处理**：多帧批量送入 YOLO 进行检测
4. **异步任务**：使用 `async_thread_tasks_with_name` 并行执行多个推理任务

### 9.3 内存优化

1. **定期显存清理**：每 10 个任务执行 `torch.cuda.empty_cache()`
2. **及时删除中间变量**：推理完成后立即 `del` 不需要的张量
3. **流式视频处理**：使用 Decord 流式解码，避免一次性加载整个视频

---

## 10. 错误处理

### 10.1 错误处理流程

```mermaid
flowchart TD
    A[任务执行] --> B{下载成功?}
    B -->|否| C[记录下载错误]
    C --> D[构造失败结果]
    D --> E[放入结果队列]
    
    B -->|是| F{推理成功?}
    F -->|否| G[记录推理错误]
    G --> H[构造失败结果]
    H --> E
    
    F -->|是| I[构造成功结果]
    I --> E
    
    E --> J[清理本地文件]
    J --> K[继续下一个任务]
```

### 10.2 重试机制

- 模型推理任务继承 `RetryTask`，支持自动重试
- 模型实例获取支持超时机制（默认 300 秒）
- 任务队列操作支持超时（默认 1200 秒）

---

## 11. 部署架构

### 11.1 分布式部署

```mermaid
flowchart TB
    subgraph Cluster["GPU 集群"]
        subgraph Node1["节点 1"]
            GPU1_0[GPU 0]
            GPU1_1[GPU 1]
        end
        
        subgraph Node2["节点 2"]
            GPU2_0[GPU 0]
            GPU2_1[GPU 1]
        end
    end
    
    subgraph Storage["存储系统"]
        CPFS[(CPFS)]
        OSS[(OSS)]
    end
    
    subgraph Data["数据系统"]
        ODPS[(ODPS)]
    end
    
    ODPS --> Node1
    ODPS --> Node2
    
    CPFS --> Node1
    CPFS --> Node2
    
    OSS --> Node1
    OSS --> Node2
```

### 11.2 启动命令

```bash
# 单机多卡
torchrun --nproc_per_node=8 video_filter_parallel.py \
    --tables "odps://project/table/ds=20250115" \
    --outputs "odps://project/output_table/ds=20250115" \
    --vfx_enable true \
    --com_enable true \
    --rov_enable true \
    --low_quality_enable true
```

---

## 12. 总结

本项目实现了一个高效的视频质量过滤系统，主要特点包括：

1. **生产者-消费者架构**：解耦 I/O 和计算，最大化资源利用率
2. **多模型并行推理**：支持 VFX、SimCam、ROV、低质量等多种检测任务
3. **模型实例池**：独占式分配确保线程安全，预热机制减少冷启动开销
4. **三级存储策略**：CPFS → Alluxio → OSS，优化数据读取性能
5. **分布式支持**：基于 torchrun 的多进程多 GPU 推理
