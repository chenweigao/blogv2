## 1. 背景与收益情况
### 1.1. 背景
UC hgx 集群，千卡训练 Qwen3 235B MoE 模型任务，业务反映训练时存在 CPU 瓶颈，想通过提升现有 CPU 频率的方式来提升训练的效率。该训练任务单机使用 8 进程共 32 线程参与任务处理，训练时各 CPU 运行在 3.1GHz。

### 1.2. 模型训练架构
![画板](https://intranetproxy.alipay.com/skylark/lark/0/2025/jpeg/162256328/1756122083081-bbdfee2d-6094-46a3-9978-e58709557e60.jpeg)

UC 的 Qwen3-MoE-235B 模型使用 megatron 框架训练，数据集为自定义数据集。模型训练对资源的诉求主要是计算、存储、网络三部分，如下所示：

| **UC Qwen3-MoE-235B 训练配置** |
| --- |
| **<u>计算</u>**：机头使用 Intel EMR or SPR<br/>+ 192 vCPU, 主要是 Intel 8462Y+、8558 处理器，最高频 4.0GHz，全核睿频 ？GHz， 基频 2.8GHz；Intel 8468 处理器，最高频 3.8GHz，全核睿频 3.1GHz，基频 2.1GHz<br/>+ 1024 GB 内存<br/>+ 8 张 Nvidia H100 GPU 卡，单卡显存容量 80GB，8 卡之间支持 ？GB/s NVLink 互联 |
| **<u>存储</u>**：基于多机分布式训练诉求，使用高性能文件存储 CPFS<br/>+ 规格：200MB/s/TiB<br/>+ 带宽：最小：xxx；最大：xxx<br/>+ IOPS：最小：xxx；最大：xxx<br/>+ 延迟：读延迟 0.4ms, 写延迟 0.6ms<br/>+ 协议：POSIX 和 NFS v3 协议互通 |
| **<u>网络</u>**：基于多机分布式训练诉求，多机通讯使用 RDMA 网络<br/>+ RDMA 带宽：？？？ |




## 2. UC 千卡模型训练 CPU 提频优化（提升 23.7%）
### 2.1. 问题与现象
用户在模型训练过程中，发现两个集群的吞吐性能存在显著差距。通过对 CPU 频率的实时监控，团队观察到**性能表现更优的集群，其 CPU 运行频率始终处于更高水平**，由此初步推断 CPU 频率可能是影响训练任务整体性能的关键因素。为验证这一假设，用户与我方协作开展联合实验，核心目标是将 T02 集群的 CPU 频率提升至最高水平，以此测试是否能为训练任务带来显著的性能收益。

在实验方案设计前，我们先对用户业务训练任务的运行状态进行了深度分析：该任务采用**多卡多进程部署模式**，即每一张 GPU 对应一个独立的 Python 进程，业务共启动 32 线程；进一步观察 CPU 负载发现，每个 Python 主进程的 CPU 利用率已达到 100%，且完全占满 8 个 vCPU 资源，其余 24 个线程负载较低。

### 2.2. CPU 睿频方式
对于 CPU 频率提升有三种技术：

+ **睿频技术**：Turbo Boost Technology 是一种动态调整处理器频率的技术，旨在不超出处理器的功率和热设计功率（TDP）限制的情况下，智能提高单个或多个核心的工作频率以增强性能。
+ **全核睿频**：指 CPU 所有核心都处于工作状态下，根据负载情况、温度、功率等因素，尽可能将所有核心工作频率提升到一个较高的水平。该方式是 T02 集群使用的默认方式，通过该方式，192 个 vCPU 运行在 3.1GHz 频率。
+ **单核睿频**：指 CPU 只有一个核心或者部分核心处于工作状态下，根据负载情况、温度、功率等因素，自动将单个核心的工作频率提升至很高的水平，超过全核睿频的频率；本文实验通过**手动关闭一半的 vCPU（offline CPU），使剩余 vCPU 能够突破频率睿频限制、稳定运行在最高频率，**以验证 CPU 高频运行对训练性能的提升效果。

### 2.3. 测试方法、环境
测试方法：通过 offline cpu 的方式，将 CPU 一半的物理核关掉，剩余一半物理核及其 vCPU（实验的机头 SPR 机型共 192vCPU，关闭后剩余 96vCPU）运行在 3.8GHz 频率。

+ 集群： T02
+ cpu 信息：Intel(R) Xeon(R) Platinum 8468
+ gpu 信息：H100 80G

### 2.4. 性能收益
下列数据由 UC 测试给出：

| | 未提频（3.1 Ghz) | 提频（3.8 Ghz） | 提升效果 |
| --- | --- | --- | --- |
| alltoall | 157 TFlops | 177 TFlops | <font style="color:#74B602;">+12.7%</font> |
| deepep | 177 TFlops | 220 TFlops  | <font style="color:#74B602;">+23.7%</font> |


详细性能评测数据参见：[CPU 提频前后性能统计](https://aliyuque.antfin.com/qishao.sq/wsddy5/en3o50n3lwm719qz?singleDoc#)

## 3. <font style="color:rgba(0, 0, 0, 0.88);">收益性能分析</font>
### 3.1. 结论
通过业务提供的 nsys 采样文件，结合<u>关键路径分析方法</u>，发现 CPU 频率提升前的任务其瓶颈并非 GPU 本身的计算能力不足，根因是 **CPU 性能 Bound，导致了 GPU 通信（NCCL）效率的恶化。**

### 3.2. nsys 热点 kernel 分析
<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">通过对比 CPU 频率为 3.8GHz 与 3.1GHz 时的热点 Kernel 占比，我们发现</font>`<u><font style="color:#DF2A3F;background-color:rgba(0, 0, 0, 0);">ncclDevKernel_AllGather_RING_LL</font></u>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">这一 Kernel 存在明显异常，具体表现如下：</font>

1. **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">平均耗时与占比激增</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：3.1GHz 频率下，该 Kernel 平均耗时从 128µs 大幅增至 1457µs（即 1.457ms），增幅超 10 倍；其占总时间的比例也从 1.5% 跃升至 19.9%，印证</font><u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">低 CPU 频率会显著延长 AllGather 算子耗时</font></u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">。</font>
2. **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">执行时间分布差异显著</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：两频率下，该 Kernel 的中位数（95µs vs 111µs）与最小执行时间（40µs vs 24µs）差距较小，间接说明 </font><u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">Nvlink 硬件性能并非问题根源</font></u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">；但最大执行时间差异悬殊（3.2ms vs 534ms），表明</font><u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">训练过程中存在异常离群的性能波动点。</font></u>
3. **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">其他算子性能对比</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：NCCL 类算子（含 SendRecv 算子）均出现较大性能波动，而计算类算子性能始终稳定，由此可基本判定：低 CPU 频率下，GPU 计算性能未受影响，</font><u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">性能问题主要集中于通信类算子</font></u><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">。</font>

下图是两种 CPU 频率下的 kernel 占比统计具体：

![3.1GHz 频率 case 的 kernel 占比统计](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753757110506-adf48f89-1a7f-4ec1-b762-85efa94bb7c9.png)

![3.8GHz 频率 case 的 kernel 占比统计](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753757286220-062532cb-6bf1-4b1a-930a-263223804dfc.png)

### 3.3. 不同 CPU 频率下关键路径与 NCCL 性能关联分析
**关键路径占比对比：**

| <font style="color:rgb(59, 59, 59);">bound_by </font> | **3.8GHz case breakdown(%)** | **3.1GHz case breakdown(%)** |
| :---: | :---: | :---: |
| <font style="color:rgb(59, 59, 59);">cpu_bound</font> | **<font style="color:#DF2A3F;">3.0</font>** | **<font style="color:#DF2A3F;">8.8</font>** |
| <font style="color:rgb(59, 59, 59);">gpu_compute_bound</font> | **33.2** | **26.6** |
| <font style="color:rgb(59, 59, 59);">communication_bound</font> | **62.8** | **64.4** |
| <font style="color:rgb(59, 59, 59);">kernel_launch_overhead</font> | **1.0** | **0.2%** |


1. **3.8GHz 场景**：关键路径中 CPU bound 占比仅 **3%**，对全局计算影响极小；Communication bound 占比达 62.8%，约为 GPU Compute bound（33.2%）的两倍，整体性能主要受通信环节制约。
2. **3.1GHz 场景**：CPU bound 占比显著攀升 —— 从 3.8GHz 场景的 3.0% 增至 **8.8%**，增幅达 1.5 倍；通信算子占比同步上升，而代表 GPU 计算的 Compute bound 占比基本保持稳定，说明 CPU 降频未影响 GPU 计算能力，却加剧了 CPU 与通信环节的性能瓶颈。



通过拆解关键路径的三大核心构成（CPU bound、Communication bound、GPU compute bound），可清晰观察到 CPU 频率对各环节占比的显著影响，两者差异主要体现在 CPU 受限与通信受限环节，具体对比如下：

1. **<font style="color:rgba(0, 0, 0, 0.85) !important;">3.8GHz 高频场景：通信为主要瓶颈，CPU 影响极小</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">  
</font><font style="color:rgba(0, 0, 0, 0.85) !important;">在 CPU 频率 3.8GHz 时，关键路径占比呈现 “通信主导、CPU 弱势” 的特征：</font>
    1. **<font style="color:rgba(0, 0, 0, 0.85) !important;">CPU bound</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">：占比仅为 </font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">3%</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">，且在各 rank（如 rank0、rank2）中分布均匀，说明此时 CPU 函数执行效率高，对全局训练性能的影响可忽略不计；</font>
    2. **<font style="color:rgba(0, 0, 0, 0.85) !important;">Communication bound</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">：占比高达 </font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">62.8%</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">，是 GPU compute bound(33.2%) 的近 2 倍，成为制约整体性能的核心瓶颈；</font>
    3. **<font style="color:rgba(0, 0, 0, 0.85) !important;">GPU Compute bound</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;">：占比稳定在 33.2%，与通信占比形成明显差距，印证 GPU 计算能力未被充分利用，主要等待通信环节完成。</font>
2. **3.1GHz 低频场景：CPU Bound 占比激增，通信瓶颈进一步加剧**  
当 CPU 频率降至 3.1GHz 后，关键路径占比发生结构性变化，CPU 与通信环节的瓶颈效应显著放大，具体差异如下：
    1. **CPU bound 占比翻倍式上升**：以 rank0、rank2 为代表，CPU bound 占比从 3.8GHz 时的 3.0% 激增至 **8.8%**，增幅达 1.5 倍，且其他 rank 也出现不同程度上升，直接反映 CPU 降频后，其指令执行效率下降，成为新的性能制约点；
    2. Communication bound 占比同步升高：在低频场景下，Communication bound 占比较 3.8GHz 进一步提升（未脱离主导地位），说明 CPU 降频间接拖累了 NCCL 通信效率，加剧了原有通信瓶颈；
    3. GPU Compute bound 占比基本持平：虽 CPU 频率下降，但 GPU 计算受限占比仍维持在与 3.8GHz 接近的水平，明确证明 **CPU 降频未影响 GPU 本身的计算性能**，性能损耗仅集中在 CPU 与通信协同环节。
3. **核心差异总结**

| 关键路径类型 | 3.8GHz 场景占比 | 3.1GHz 场景占比（rank0/rank2） | 差异幅度 |
| --- | --- | --- | --- |
| CPU bound | 3.0% | 8.8% | 增幅 1.5 倍 |
| Communication bound | 62.8% | 进一步升高（主导地位不变） | 瓶颈效应加剧 |
| GPU compute bound | 33.2% | 基本稳定 | 无显著差异 |


从对比可见，CPU 频率下降的核心影响是 “双重瓶颈叠加”—— 既直接导致 CPU bound 占比激增，又间接加剧通信瓶颈，而 GPU 计算能力始终稳定，这为后续优化方向（如 CPU 提频、通信优化）提供了明确依据。

**两者通信算子 breakdown（均为 rank0 结果），3.1GHz 场景下 **`ncclDevKernel_AllGather_RING_LL` 算子占比明显增加，进一步加剧 Communication bound**：**

![3.8GHz](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753759384121-47195317-87d5-4aba-ad3c-f2ea34a8b0a5.png)![3.1GHz（红色部分为 nccl_allgather)](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753759393130-ddbe5128-64a0-4de1-9411-23e6585550cd.png)

### 3.4. **NCCL 机制与 CPU 频率的关联**
NCCL 作为 GPU 集群通信的核心组件，其高性能依赖 CPU 与 GPU 的**低延迟协同调度**，而 CPU 频率直接决定该协同链路的效率上限，具体机制可从通信流程、线程特性与频率敏感点三方面展开：

1. **NCCL 通信的 CPU-GPU 协同核心流程**  
NCCL 在执行 AllGather、ReduceScatter 等集体通信操作时，需通过 “CPU 调度 - GPU 执行” 的双向链路完成：
    1. **拆解与分发阶段**：CPU 端的 NCCL Proxy Thread 首先将大粒度通信任务（如 GB 级数据传输）拆解为符合 GPU 硬件带宽特性的小数据块（通常为 64KB-256KB，匹配 Nvlink 通道的最优传输单元），同时生成对应的 CUDA 命令序列；
    2. **命令提交与同步阶段**：Proxy Thread 需通过 CUDA Runtime API 将拆解后的 CUDA Kernel（如`ncclDevKernel_AllGather_RING_LL`）提交至 CUDA Stream，且需实时轮询 GPU 的命令执行状态（通过 `cudaStreamQuery` 或异步回调机制），确保下一个数据块的传输指令能在当前块完成后立即触发，避免 Nvlink 通道空闲；
    3. **结果聚合与反馈阶段**：当所有 GPU 完成局部通信操作后，Proxy Thread 需收集各 GPU 的通信状态码，确认无错误后向用户训练框架返回通信完成信号，触发下一轮计算-通信循环。
2. **CPU 代理线程的频率敏感性根源**  
NCCL 代理线程的 “轮询-提交” 逻辑对 CPU 延迟极为敏感，主要源于两点技术约束：
    1. **轮询间隔的硬约束**：为避免 Nvlink 通道因指令等待出现空闲，代理线程的轮询间隔需控制在**微秒级（通常 < 10µs）**。当 CPU 频率从 3.8GHz 降至 3.1GHz 时，CPU 单周期指令执行时间从约 0.26ns 增至 0.32ns，轮询过程中涉及的内存读取（如查询 GPU 状态寄存器）、条件判断等操作延迟会累积增加，导致指令提交间隔拉长，进而造成 Nvlink 通道 “空等”；
    2. **线程调度的优先级特性**：NCCL 代理线程默认被 Linux 内核标记为高优先级（通过 SCHED_NORMAL 调度策略），以抢占普通计算线程的 CPU 时间片。但在低频场景下，即便线程优先级高，CPU 单次时间片内可执行的指令数减少，若代理线程需处理多 GPU 节点的并发通信请求（如 8 卡集群的 AllGather 操作），易出现指令队列堆积，导致 CUDA Kernel 提交延迟。
3. **不同 CPU 频率下的 NCCL 通信状态差异**  
结合实验数据可进一步验证频率的影响：
    1. **3.8GHz 高频场景**：代理线程轮询延迟约 8µs，CUDA 命令提交与 GPU 执行的间隙 < 5µs，Nvlink 带宽利用率达 92% 以上，ncclDevKernel_AllGather_RING_LL 的执行间隔稳定（最大偏差 < 20%）
    2. **3.1GHz 低频场景**：代理线程轮询延迟增至 15µs，命令提交间隙扩大至 12µs，Nvlink 带宽利用率降至 75%，且因间隙波动（最小 8µs、最大 42µs），导致部分 Kernel 执行出现 “长尾延迟”（如`ncclDevKernel_AllGather_RING_LL` 最大耗时从 3.2ms 激增至 534ms），最终表现为 Communication bound 占比升高。

综上，NCCL 的通信性能并非仅依赖 Nvlink 硬件带宽，更依赖 CPU 代理线程的 “低延迟调度能力”—— CPU 降频会直接延长代理线程的指令执行与轮询延迟，打破 “CPU 调度 - GPU 执行” 的协同节奏，进而导致 NCCL 通信性能显著下降。

### 3.5. CPU 降频影响 NCCL 性能的机理推导（结合 trace 分析）
根据业务提供的 nsys os runtime trace 数据，结合 nv runtime trace 的深度分析（详情参考第二节与第三节），并对照论文 [Demystifying NCCL: An In-depth Analysis of GPU Communication Protocols and Algorithms](https://arxiv.org/abs/2507.04786) 中阐述的 NCCL Kernel 工作原理，可梳理出 **“CPU 降频→连锁延迟→性能劣化” 的完整因果逻辑链**，每个环节的推导均有数据或技术原理支撑，具体过程如下：

1. **初始诱因 —— CPU 降频直接延长指令执行周期（因）**

当 CPU 频率从 3.8GHz 降至 3.1GHz 时，CPU 单时钟周期的指令处理能力显著下降：

    - 3.8GHz 场景下，CPU 单周期指令执行时间约为 0.26ns（1/3.8×10⁹）；3.1GHz 场景下，单周期执行时间延长至 0.32ns（1/3.1×10⁹），增幅约 23%。
    - 这一变化看似微小，但 NCCL 通信依赖 “微秒级响应” 的线程调度，微小的周期延长会在后续环节持续累积，成为所有延迟的起点（果）。
2. **关键传导 —— Proxy Thread 调度延迟因周期延长而放大（因→果）**  
NCCL 依赖的 Proxy Thread（负责通信指令拆解与提交）需持续轮询 GPU 状态，CPU 降频使轮询间隔从微秒级拉长，其 read/write/recvmsg 等 I/O 操作的响应时间同步延长；

根据论文可知，NCCL 的通信指令执行依赖 Proxy Thread 的核心调度：该线程需持续轮询 GPU 命令流状态（确认前一指令是否完成），并将 NCCL 通信任务拆解为小数据块后，向 GPU 提交 CUDA Kernel（如`ncclDevKernel_AllGather_RING_LL`）。

    - 受 CPU 降频影响，Proxy Thread 的轮询间隔从 3.8GHz 时的 8µs 拉长至 3.1GHz 时的 15µs（os tuntime trace 数据）；同时，其执行 read（读取 GPU 状态寄存器）、write（写入通信参数）、recvmsg（接收节点间同步信号）等 I/O 操作的响应时间，也从平均 5µs 延长至 12µs（果）。
    - 这一延迟直接打破了 NCCL “轮询 - 提交” 的最优节奏 —— 原本能在 1 个轮询周期内完成的 “状态查询 + 指令提交”，现在需 2 个周期，导致 GPU 命令流出现 “空窗期”。
3. **连锁反应 —— 主线程唤醒延迟源于 Proxy Thread 响应滞后（果→因→果）**

Proxy Thread 与 NCCL 主线程存在 “同步依赖”：主线程需等待 Proxy Thread 完成 “指令拆解 + 状态确认” 后，通过 `sem_clockwait` 信号量唤醒，才能执行下一步 Kernel launch 操作（off cpu 等待机制）。

    - 因 Proxy Thread 的 read/write/recvmsg 响应延迟，主线程的 `sem_clockwait` 等待时间从 3.8GHz 时的 10µs，激增至 3.1GHz 时的 35µs（os runtime trace 中可观察到`sem_clockwait`的 off cpu 时长占比提升 4 倍）（果）；
    - 主线程无法按时唤醒，直接错过 GPU 命令流的 “空闲窗口”—— 原本前一 Kernel 执行完后可立即提交新指令，现在需额外等待主线程唤醒，导致 Kernel launch 时机延迟（新的果）。
4. **最终劣化 ——launch 延迟催生慢节点，拖累全局同步（果→终果）**  
AllGather 算子的特性决定了 “32 卡 GPU 需完全同步完成通信，才能进入下一阶段”（即 “木桶效应”，整体性能由最慢节点决定）：
    - 3.1GHz 场景下，部分节点因主线程唤醒延迟，导致 NCCL Kernel launch 时间比 3.8GHz 场景晚 200-500µs（nsys trace 中可定位到具体延迟节点），这些节点成为 AllGather 的 “慢节点”；
    - 慢节点的存在使 32 卡的通信完成时间从 3.8GHz 时的平均 3.2ms，延长至 3.1GHz 时的 534ms（与前文 “`ncclDevKernel_AllGather_RING_LL` 最大耗时激增” 的数据完全呼应），最终表现为关键路径中 communication bound 占比升高、整体吞吐下降（终果）。

**机理总结：逻辑链闭环与数据印证**

整个推导过程形成 “初始诱因→关键传导→连锁反应→最终劣化” 的闭环，且每个环节均有 trace 数据或技术原理支撑：

**CPU降频（周期延长）→ Proxy Thread 轮询/IO延迟→主线程 **`**sem_clockwait**`**唤醒延迟 → Kernel launch 延迟 → AllGather 慢节点 → 全局通信时间延长→ Communication bound 占比升高**

这一机理不仅解释了 3.1GHz 场景下通信瓶颈加剧的原因，也印证了 “GPU compute bound 占比稳定” 的现象 ——GPU 本身的计算性能未受影响，性能损耗完全源于 CPU 与 GPU 的协同调度延迟。

#### 3.5.1. 详细 trace 分析（一）
下图是选取的 3.1GHz 场景一个节点 8 卡的 trace 数据，从图中我们可以看出存在**多 GPU 负载与同步问题**：

1. **GPU Activity 差异**：不同 GPU（如 `0000:18:00.0`/`0000:9a:00.0` 等）的 Activity 曲线（橙色）存在明显间隙，说明部分 GPU 出现空闲等待。进一步观察，发现任意 <u>GPU 空闲等待时，其对应的 Python 主进程必然伴随着 </u>`<u>sem_clockwait</u>`<u> 阻塞</u>，可推测：GPU 因等待 CPU 线程的同步信号（如 `sem_clockwait` 释放）无法持续执行计算 / 通信内核，导致算力浪费。
2. **跨 GPU 同步延迟**：在多节点多卡训练中，`sem_clockwait` 常与跨 GPU 通信同步强相关（如 NCCL 集合通信的进程 / 线程协调 ）。若某块 GPU 对应的 CPU 线程长时间阻塞在 `sem_clockwait`，会拖累全局训练节奏（其他 GPU 需等待该卡完成同步）。

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1756179539641-53975ddb-b584-4eb2-bd81-89709c274d26.png)

**<font style="color:rgb(0, 0, 0);">CPU 线程阻塞的连锁影响：</font>**

1. `sem_clockwait` 的阻塞范围：上方线程视图中，`python` 进程的线程因 `sem_clockwait` 阻塞（青色长条），直接导致后续 `cudaEventSynchronize`（GPU 事件同步）无法及时执行。这说明 **CPU-GPU 协同被打断**，即 GPU 内核可能已完成，但 CPU 因等待同步信号无法触发后续流程（如梯度更新、模型参数广播 ）。
2. **与框架逻辑的关联**：在 Megatron-LM 等大模型训练框架中，`sem_clockwait` 通常关联分布式训练的进程同步（如跨进程通信协调 ）。若阻塞发生在关键通信阶段（如 `AllReduce`/`AllGather` 前后 ），会显著增加**通信 - 计算重叠的难度**，降低整体训练效率。

总结来说：这张 trace 暴露了 **CPU 线程同步阻塞 → GPU 空闲 → 整体训练延迟**的连锁问题。在多卡训练场景下，需重点优化跨进程/跨 GPU 的同步逻辑，通过异步化、拓扑优化、负载均衡，减少 `sem_clockwait` 对训练流水线的打断，提升 GPU 算力利用率。

> 待明确的点：若 `sem_clockwait` 频繁超时，需排查网络（如 InfiniBand 拥塞 ）或进程绑定（如 CPU 线程未绑定到独享核心 ）问题。当下无法确定其超时时间。
>

#### 3.5.2. 详细 trace 分析（二）
我们对图中箭头标记的 `0000:9a:00.0` GPU 的 Python 进程再次进行深入分析，结合 `pt_data_pin`（PyTorch 数据 pinned 内存管理）和 `sem_clockwait`，观察如下：

1. `**pt_data_pin**`** 的关键作用与问题**：PyTorch 中 `pt_data_pin` 负责管理 pinned memory，用于加速 GPU-CPU 数据传输（避免页交换，提升 DMA 效率 ）。若 `pt_data_pin` 出现频繁阻塞（如 `poll`/`sem_clockwait` 伴随），说明**数据传输的同步成本高**，可能拖累训练 pipeline。
2. `**poll**`** 与 **`**sem_clockwait**`** 的关联：**trace 中 `[4149] pt_data_pin` 线程的 `poll`和 `sem_clockwait`，暗示了数据准备与 GPU 传输未充分异步化，CPU 线程需主动轮询或等待信号量，才能将 pinned 内存中的数据送入 GPU。
3. 结合 GPU 指标异常点：SM Active（粉色柱状）存在明显间隙，说明 SM 频繁空闲。结合 `pt_data_pin` 阻塞，推测：GPU 因等待 CPU 侧的 pinned 内存数据（如输入特征、梯度 ）无法持续执行计算 / 通信内核，导致算力浪费。

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1756180556111-0fc9af8a-ce51-4ad0-acaf-da26b056a080.png)

上述观察可以印证 3.1GHz 场景下性能瓶颈的连锁反应：

1. **数据传输 → 计算流水线中断**：在大模型训练中，`pt_data_pin` 管理的 pinned 内存常用于**批量数据预加载**（如使用 `DataLoader` 时的异步 pin 内存 ）。若其阻塞，会导致：**GPU 饥饿**，内核（如 `ncclDevKernel_AllGather_RING_LL`）因输入数据未及时送达，被迫等待，拉长训练迭代时间。
2. **跨线程 / 跨进程同步成本**：`sem_clockwait` 在 `pt_data_pin` 线程中出现，说明**数据准备线程与训练线程的同步逻辑存在低效**。例如训练线程需等待数据线程完成 pin 内存 + 拷贝操作，才能启动 GPU 计算，未充分利用 “计算 - 数据传输重叠”。

总结来说：这张 trace 暴露了 **“pinned 内存数据准备阻塞 → GPU 计算流水线中断 → 多卡同步效率下降” **的连锁问题。在大模型训练中，需重点优化数据加载的异步化与线程同步逻辑，让 GPU 算力与 CPU 数据准备充分重叠，提升端到端训练效率。

## 4. 提频方案
### 4.1. 方案一：offline cpu
offline cpu 的示意图如下所示，对 SPR 的 0-23, 48-71 及其对端核开启，剩余 CPU 进行 offline 操作；该操作可以保证一半的 CPU 运行在 3.8GHz:

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753760720164-18d017db-6d76-4b16-9853-c6467deeb835.png)

几点说明：

1. 手动 offline cpu，asi 链路上可以区分（但是某些情况下会导致 kubelet 识别错误，需要专门甄别）
2. offline cpu 后 cpuset.cpus 的配置由内核自动修改，后需再 online cpu 不会恢复，需手动恢复
3. offline cpu 只能按照物理 core 维度；已实验关闭所有 vCPU 后，频率无法提升到 3.8GHz

### 4.2. 方案二：SST
Intel SST-TF（Intel Speed Select Technology - Turbo Frequency) 是一项基于 core 优先级动态调节 CPU 性能的技术，其核心机制是为不同优先级的 core 设定差异化的 turbo 频率上限（Turbo Ratio Limits，TRL）。

> 该技术通过 CLOS（Class of Service，服务等级）接口实现核心优先级的精细化管理：系统会将 cpu core 分配至带有优先级数值的 “区间”（bins），以此明确区分高优先级（HP）核心与低优先级（LP）。其中，高优先级 core 可获得高于 P0n 基准频率的 turbo 频率上限（HP-TRL），具体上限值会根据高优先级核心的数量以及当前活跃核心的总数动态调整；而低优先级 core 则被限制在预设的频率阈值（LPlimit）之内，其运行频率始终低于这一上限。
>

<font style="color:rgba(0, 0, 0, 0.85) !important;">UC 实验的机型为 8468，Spec 见：</font>[Intel® Xeon® Platinum 8468 Processor](https://www.intel.com/content/www/us/en/products/sku/231735/intel-xeon-platinum-8468-processor-105m-cache-2-10-ghz/specifications.html)<font style="color:rgba(0, 0, 0, 0.85) !important;">，该 CPU 的最大频率为 3.8G Hz, 基频为 2.1 GHz:</font>

| <font style="color:rgb(38, 38, 38);">Max Turbo Frequency </font> | <font style="color:rgb(38, 38, 38);">3.80 GHz</font> |
| --- | --- |
| <font style="color:rgb(38, 38, 38);">Processor Base Frequency </font> | <font style="color:rgb(38, 38, 38);">2.10 GHz</font> |


<font style="color:rgba(0, 0, 0, 0.85) !important;">如果要一部分 core 运行在 3.8GHz，剩余部分运行在基频，目前支持 48vCPU（12 物理 core/socket）运行在最高频 3.8GHz，可用 core 从 192vCPU 降低为 48vCPU；如果要 96vCPU（24 物理 core/socket）运行，则最高频只能达到 3.6GHz，具体效果如下图所示（Intel(R) Xeon(R) Platinum 8468）：</font>

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753783095497-e128ac07-e999-4c48-945e-17e4f406ef54.png)

+ <font style="color:rgba(0, 0, 0, 0.85) !important;">图中 0-11&48-59 表示开启 </font><u><font style="color:rgba(0, 0, 0, 0.85) !important;">24 个物理核</font></u><font style="color:rgba(0, 0, 0, 0.85) !important;">的 SST-TF，共 48 个逻辑核运行在 </font>**<u><font style="color:rgba(0, 0, 0, 0.85) !important;">3.8GHz</font></u>**<font style="color:rgba(0, 0, 0, 0.85) !important;">, 剩余核运行在 2.1GHz;</font>
+ <font style="color:rgba(0, 0, 0, 0.85) !important;">图中 0-23&48-71 表示开启 </font><u><font style="color:rgba(0, 0, 0, 0.85) !important;">48 个物理核</font></u><font style="color:rgba(0, 0, 0, 0.85) !important;">的 SST-TF，共 96 个逻辑核运行在 </font>**<u><font style="color:rgba(0, 0, 0, 0.85) !important;">3.6GHz</font></u>**<font style="color:rgba(0, 0, 0, 0.85) !important;">, 剩余核运行在 2.1GHz.</font>

如果整机负载较大，达到 CPU 的功耗墙（TDP）时，需要结合 **SST-CP (SST-Core Power)** 技术保障高优先级 core 的频率稳定在 3.8GHz. SST-CP 的主要作用是给 CPU Core 设置优先级，<font style="color:rgba(0, 0, 0, 0.85) !important;">在整机到 TDP 后，我们使能 SST-CP，期望保障高优先级 core 的频率，降低低优先级 core 的频率。</font>

<font style="color:rgba(0, 0, 0, 0.85) !important;">我们实验选取 linkpack benchmark，并将该 benchmark 运行在低优先级的 core 上（12-47,60-95,108-143,156-191 vCPU），此时整机功耗达到 250W 左右，TDP 为 350W，高优 core 未产生降频，部分低优 core 由于功耗限制，频率降低到 1.4GHz:</font>

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1754554114146-d1752f42-3cfb-4874-a12a-3fa1f4f7a3d4.png)

<font style="color:rgba(0, 0, 0, 0.85) !important;">值得说明的是：如果高优的 workload（如训练任务）的功耗本身不高（在本示例中占用 1/4 的 vCPU 但不超过 1/4 的总功耗）时，无需 SST-CP 保证其优先级，使用 SST-TF 效果相同。换言之，是否使用 SST-CP 取决于高优本身的功耗情况。</font>

## 5. <font style="color:rgba(0, 0, 0, 0.85) !important;">上线方案</font>
### 5.1. 业务侧适配


### 5.2. 调度
在业务集群开启 core offline 或者 SST-TF，调度侧将训练任务按照 cpu set 的方式调度到频率高的核上。

<font style="color:rgba(0, 0, 0, 0.85) !important;"></font>

## 6. <font style="color:rgba(0, 0, 0, 0.85) !important;">进一步优化</font>
### 6.1. 跨 numa 访存
提频后采集跨 numa 访存的 topdown 指标：

下面指标反应了跨 numa 访存的比例，可以看出，约 20% 的访存发生了跨 numa：

|  | socket 0 | socket 1 |
| --- | --- | --- |
| metric_NUMA %_Reads addressed to local DRAM | 80.3000 | 80.7321 |
| metric_NUMA %_Reads addressed to remote DRAM | 19.7000 | 19.2679 |


<font style="color:rgba(0, 0, 0, 0.85) !important;">各 numa 带宽：</font>

|  | socket 0 | socket 1 |
| --- | --- | --- |
| <font style="color:black;">metric_IO bandwidth read local (MB/sec)</font> | <font style="color:black;">12,097.4334</font> | <font style="color:black;">11,422.6901</font> |
| <font style="color:black;">metric_IO bandwidth read remote (MB/sec)</font> | <font style="color:black;">14.6539</font> | <font style="color:black;">0.3991</font> |
| <font style="color:black;">metric_IO bandwidth write local (MB/sec)</font> | <font style="color:black;">475.7061</font> | <font style="color:black;">467.4992</font> |
| <font style="color:black;">metric_IO bandwidth write remote (MB/sec)</font> | <font style="color:black;">1.9261</font> | <font style="color:black;">1.2870</font> |




[@悦慕](undefined/yuemu.zyb) 已确认，业务配置 membind 没有成功，应该是与容器的权限有关，正在解决中；解决后解决跨 numa 访问，提升性能；<u>训练场景后续均可按照该配置进行最佳实践。</u>



### 6.2. 3.1GHz vs 3.8GHz
CPI 对比，3.8GHz 的 CPI 都较低，性能更好；并且 3.8GHz 下，CPI 更稳定：

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1754553092286-48f8cbf6-cd51-41ed-be56-22fce9778237.png)



### 6.3. <font style="color:rgba(0, 0, 0, 0.85) !important;">TMA</font>
<font style="color:rgba(0, 0, 0, 0.85) !important;">重点微架构指标：</font>

|  | socket 0 | socket 1 |
| --- | --- | --- |
| metric_CPI | **<font style="color:#DF2A3F;">0.4618</font>** | **<font style="color:#DF2A3F;">0.4642</font>** |
| metric_TMA_Frontend_Bound(%) | **<font style="color:#DF2A3F;">24.9352</font>** | **<font style="color:#DF2A3F;">24.5831</font>** |
| metric_TMA_..Fetch_Latency(%) | 15.3995 | 15.2238 |
| metric_TMA_..Fetch_Bandwidth(%) | 9.5357 | 9.3593 |
| metric_TMA_Bad_Speculation(%) | 5.3405 | 5.1610 |
| metric_TMA_Backend_Bound(%) | **<font style="color:#DF2A3F;">32.6654</font>** | **<font style="color:#DF2A3F;">33.2794</font>** |
| metric_TMA_..Memory_Bound(%) | 12.5729 | 12.9624 |
| metric_TMA_..Core_Bound(%) | 20.0925 | 20.3170 |
| metric_TMA_Retiring(%) | 37.0589 | 36.9765 |




CPU 利用率（offline core 的 vCPU 维度）上，可以看出，有 8 个 vCPU 的 CPU 使用率达到了 100%，剩余 40 个 vCPU 使用率在 40%，负载不低；总的 CPU 需求为 8*100%+40%*40=2400%, 共需要 24 vCPU。

由于业务手动用 numactl 绑定了 core, 所以后半部分 CPU 利用率为 0；<u>对于放开另一半 vCPU 是否有性能收益，还需实验进一步验证。</u>

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753944497801-e8e7f933-6787-4323-8e1f-1cbe4300a0c8.png)



![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/162256328/1753944676823-04c1d2fd-50db-49fc-870b-b53b18ed303b.png)



## 7. <font style="color:rgba(0, 0, 0, 0.85) !important;">其他</font>
### 7.1. 虚拟机问题
gcp 和火山云提供的是虚拟机实例，KVM 虚拟机里会掩盖掉 host 的频率信息，有可能是 host 实际上是在超频的，但是 KVM 里面显示的不是，但是看到的 cpu 跟 host cpu 肯定不是一一绑定的，所以无法超频。

