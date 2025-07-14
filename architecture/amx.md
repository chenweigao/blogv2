---
title: AMX 指令
date: 2025-06-16
category:
  - Computer Architecture
tags:
  - x86
  - architecture
---
## 1. bf16

其结构如下图所示：
![](./images/amx-1750062373190.png)

## 2. AMX

其设计的核心是支持矩阵乘法（GEMM）和矩阵-向量乘法（GEMV）；AMX 的计算模型引入了新的矩阵寄存器空间 Tile Register, 由 Tmm0~ Tmm7 组成[^1]。

- 每个 Tile 是一个二维的矩阵寄存器（行数固定、列数可变）
- 默认一个 Tile 可以支持最多 **16 行 * 64 字节（512 位）**
- 数据类型支持 BBF16, INT8, FP16, FP32


[^1]: https://deeprec.readthedocs.io/zh/latest/AMX.html
