---
title: JVM Inst
date: 2024-08-29
tag:
 - jvm
 - java
category:
 - JAVA
---

## Abstract

JAVA 字符串操作的优化。

## Java 对象布局

### Java Array 对象布局


| Java Char Array |                 |            |
| --------------- | --------------- | ---------- |
| Head            | Mark Word       | 4 Bytes    |
|                 | Class Pointer   | 4 Bytes    |
|                 | Length of Array | Offset = 8 |
| Instance Data   | Data of Array   |            |
| Padding         |                 |            |

Data of Array 中的每个 char 占 2 Bytes.

加载Length的流程包括：
1. 需要通过数组实例的基地址加载Length的值。
2. 如果基地址错误，需要返回错误码。
3. 如果length为0，需要返回错误码。

### Java String 对象布局


| Java String   |               |          |
| ------------- | ------------- | -------- |
| Head          | Mark Word     | 4 Bytes  |
|               | Class Pointer | 4 Bytes  |
| Instance Data | Data of Array | Offset=8 |
|               | Raw Data      |          |
| Padding       |               |          |

加载Length的流程包括：
1. 需要通过 String 实例的基地址加载 Length 的值。
2. 如果基地址错误，需要返回错误码。
3. 如果length为0，需要返回错误码。
4. String 的 Length 的最低位是 TAG-bit，表示是否压缩，需要移位去除掉


## MemCpy Opt




