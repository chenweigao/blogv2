---
title: Critical Path of AI Trace
date: 2026-01-04
category:
  - Algorithm
  - AI
---

> 本文重点说明 GPU kernel trace/timeline 的关键路径算法原理、实现思路及可视化示例。
>
## 1. 算法基本概念与理论基础

### 1.1. 问题目标

目标：针对 GPU trace（Chrome trace 风格），从所有事件中找出 端到端关键路径（critical path），并对这条路径上的时间进行 原因归因（CPU/GPU 计算/通信/内核间延迟/Launch Overhead 等）。
关键路径定义：在一个带权有向图上，从任意起点到任意终点，使得 路径总权重（时间）最大 的那条路径，即：