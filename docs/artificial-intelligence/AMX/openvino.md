---
title: OpenVino
date: 2025-07-14
tags:
  - AI
  - intel
---
## 1. Note

>  CPU 上深度学习推理优化主要有两种方式：数学库优化（基于Intel® MKL-DNN）和深度学习推理 SDK 优化（Intel OpenVINO）。这两种方式均包含了 SIMD 指令集的加速。

MKL-DNN 现已演化为 oneDNN.

- OpenVINO 可以充分使用英特尔的各种硬件的加速资源，包括 CPU、GPU、VPU、FPGA，这些资源能够提升深度学习的算法推理性能。

转化方法：**Model Optimizer**、bounding box nms、scale 部分 C++ 重新实现、或官方提供模型。

