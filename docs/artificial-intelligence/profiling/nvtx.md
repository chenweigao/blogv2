---
title: NVTX 原理分析
date: 2026-01-12
---
## 1. 与 Runtime 交互

参考代码位置：
- C/C++ 头文件：`c/include/nvtx3`
- 示例注入：`tools/sample-injection`

```mermaid
flowchart TD
  A[应用程序<br>调用 NVTX API] --> B[NVTX 分发层<br>Header-only]
  B -->|首次调用| C{找到注入库?}
  
  C -- 否 --> D[函数指针为空<br>直接返回<br>≈零开销]
  
  C -- 是 --> E[初始化回调表<br>填充函数指针]
  E --> F[后续 API<br>直接经指针跳转]
  F --> G[工具实现层<br>记录/统计/转发]
```

```
应用程序调用 nvtxRangePushA("foo")
        ↓
NVTX 运行时检查是否有注入库
        ↓
首次调用时加载注入库，调用 InitializeInjectionNvtx2()
        ↓
注入库填充回调表
        ↓
后续调用直接路由到注入库的 impl::RangePushA()
```
