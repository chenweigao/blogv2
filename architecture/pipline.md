---
title: Pipeline
date: 2022-08-24
category:
 -  Arm
---

## 1. Abstract

本文主要研究流水线技术在计算机体系结构中的应用。流水线技术分为两个大的部分，本部分统一研究流水线的基础知识部分，总体而言可以分为以下几类：

1. data path implications, hazards and examining the performance of pipelines.
2. interaction between pipelining and various aspects of instruction set design
3. etc..

### 1.1. What is pipeline?

> Pipelining is an implementation technique whereby multiple instructions are overlapped
> in execution;

流水线的概念理解较为简单。

> In a computer pipeline, each *step* in the pipeline completes a part of an instruction. 
> 
> Like the assembly line, different steps are completing different parts of different instructions
> in parallel. Each of these steps is called a *pipe stage* or a *pipe segment*.
> The stages are connected one to the next to form a pipe—instructions enter at one end, progress through the stages, and exit at the other end, just as cars would in an assembly line.

在计算机 pipeline 中的每一个 step 都完成指令的一部分，这个 step 在流水线中称作 pipe stage.

> The time required between moving an instruction one step down the pipeline is a *processor cycle.*

上述文字严格定义了 cycle 的概念，即指令向下移动一步所需要的时间。

> Because all stages proceed at the same time, the length of a processor cycle is determined by the time required for the slowest pipe stage.

由于所有的 stage 都同时运行，所以处理器 cycle 的长度取决于**最慢**的 stage 所需的时间。

> In a computer, this processor cycle is almost always 1 clock cycle.

阐述了一个公式：
$$
process\ cycle =  1\ clock \ cycle
$$

> Pipelining yields a reduction in the average execution time per instruction. If the starting point is a processor that takes multiple clock cycles per instruction, then pipelining reduces the CPI.

流水线的主要作用还是降低指令的平均执行时间。另一方面，如果每个指令需要多个处理器时钟周期，那么流水线技术可以降低 CPI.

## 2. RISC V Instruction Set

:::warning 🟢🟢 RISC V 和 ARM 的关系是什么？

都是 RISC 指令集，可以理解为竞争对手。RISC V 是开源的，授权费较低，但是 ARM 生态繁荣，目前国内外也有在做 RISC V 的企业。

:::

虽然阅读的这本书使用的是 RISC V 指令集，但是其他的 RISC 也是类似的。

> All RISC architectures are characterized by a few key properties:
> 
> - All operations on data apply to data in registers and typically change the entire register (32 or 64 bits per register).
> - The only operations that affect memory are load and store operations that move data from memory to a register or to memory from a register, respectively. Load and store operations that load or store less than a full register (e.g., a byte, 16 bits, or 32 bits) are often available.
> - The instruction formats are few in number, with all instructions typically being one size. In RISC V, the register specifiers: `rs1`, `rs2`, and `rd` are always in the same place simplifying the control.
> 
> These simple properties lead to dramatic simplifications in the implementation of pipelining, which is why these instruction sets were designed this way.

所有的 RISC 体系结构都具有以下的关键属性：

- 对数据的所有操作都适用于寄存器中的数据，并且通常会更改整个寄存器。

- 影响存储的唯一操作是 load 和 store. load 是将数据从内存移动到寄存器，store 是将数据从寄存器移动到内存。load 或者 store 小于完整寄存器也是可以的。
  
  ❌❌❌ 第一条和第二条似乎有点矛盾？

- 指令格式的数量很少，所有指令通常都是一个尺寸。

以上简单的熟悉导致了流水线实现的显著简化。

### 2.1. The Classic Five-Stage Pipeline for a RISC Processor

下图简单给出了 RISC V 五个 stage 的具体细节：

```mermaid
flowchart LR
    IF --> ID
    ID --> EX
    EX --> MEM
    MEM --> WB
```

- IF: instruction fetch
- ID: instruction decode
- EX: execution
- MEM: memory access
- WB: write-back

> To start with, we have to determine what happens on every clock cycle of the processor and make sure we don’t try to perform two different operations with the same data path resource on the same clock cycle.

防止在同一个 clock cycle, 同一个 data path resource 上执行两个不同的操作。

> For example, a single ALU cannot be asked to compute an effective address and perform a subtract operation at the same time. Thus, we must ensure that the overlap of instructions in the pipeline cannot cause such a conflict.

比如说我们不能要求单个 ALU 去计算有效地址的同时执行减法操作。因此，我们必须确保管道中的指令的重叠不会产生这种冲突。

⭐⭐ @todo C-7 的图片可以有效说明这个问题，将来可以添加进来

> First, we use separate instruction and data memories, which we would typically implement with separate instruction and data caches.

使用单独的指令和数据缓存。

> The use of separate caches eliminates a conflict for a single memory that would arise between instruction fetch and data memory access. 
> 
> Notice that if our pipelined processor has a clock cycle that is equal to that of the unpipelined version, the memory system must deliver five times the bandwidth. This increased demand is one cost of higher performance.

使用单独的缓存消除了指令获取数据访问之间可能存在的单个内存冲突。

但是需要注意，其代价是内存系统必须提供五倍的带宽（5 clock cycle 的情况下）。

> Second, the register file is used in the two stages: one for reading in ID and one for writing in WB. These uses are distinct, so we simply show the register file in two places. *Hence, we need to perform two reads and one write every clock cycle.*
> 
> To handle reads and a write to the same register (and for another reason, which will become obvious shortly), we perform the register write in the first half of the clock cycle and the read in the second half.

register file 被两个 stages 用了：在 ID 中读取，在 WB 中写入，这两种用法是不同的。

❌❌ 斜体的没有理解。

为了处理对同一个寄存器的读和写，我们在时钟周期的前半部分执行寄存器写入，后半部分执行读取。

> Third, Figure C.2 does not deal with the PC. To start a new instruction every clock, we must increment and store the PC every clock, and this must be done during the IF stage in preparation for the next instruction. Furthermore, we must also have an adder to compute the potential branch target address during ID. One further problem is that we need the ALU in the ALU stage to evaluate the branch condition. Actually, we don’t really need a full ALU to evaluate the comparison between two registers, but we need enough of the function that it has to occur in this pipestage.

上述描述暂时不是很关键。总的来说还是确保硬件资源如 PC, ALU 等不被同时使用。

> Although it is critical to ensure that instructions in the pipeline do not attempt to use the hardware resources at the same time, we must also ensure that instructions in different stages of the pipeline do not interfere with one another. 
> 
> This separation is done by introducing pipeline registers between successive stages of the pipeline, so that at the end of a clock cycle all the results from a given stage are stored into a register that is used as the input to the next stage on the next clock cycle. Figure C.3 shows the pipeline drawn with these pipeline registers.

虽然确保 pipeline 中的指令不会同时尝试使用硬件资源至关重要，但是我们还必须确保 pipeline 不同阶段的指令不会互相干扰。

这种分离是通过在流水线的连续 stage 之间引入流水线寄存器来实现的，以便于在时钟周期结束时，给定 stage 的结果都存储到一个寄存器中，该寄存器用作下一个 clock cycle 的输入。

> Although many figures will omit such registers for simplicity, they are required to make the pipeline operate properly and must be present.  Of course, similar registers would be needed even in a multicycle data path that had no pipelining (because only values in registers are preserved across clock boundaries). 
> 
> In the case of a pipelined processor, the pipeline registers also play the key role of carrying intermediate results from one stage to another where the source and destination may not be directly adjacent. For example, the register value to be stored during a store instruction is read during ID, but not actually used until MEM; it is passed through two pipeline registers to reach the data memory during the MEM stage. Likewise, the result of an ALU instruction is computed during EX, but not actually stored until WB; it arrives there by passing through two pipeline registers. It is sometimes useful to name the pipeline registers, and we follow the convention of naming them by the pipeline stages they connect, so the registers are called IF/ID, ID/EX, EX/MEM, and MEM/WB.

先说明了流水线寄存器虽然在很多的图里面没有被画出来，但是其必不可少。

再说明了，寄存器中的数据可能不仅仅被严格相邻的两个指令使用。并且进行了举例。

## 3. The Major Hurdle of Pipelining—Pipeline Hazards

> There are situations, called hazards, that prevent the next instruction in the instruction stream from executing during its designated clock cycle. Hazards reduce the performance from the ideal speedup gained by pipelining. There are three classes of hazards:
> 
> 1. **Structural hazards** arise from resource conflicts when the hardware cannot support all possible combinations of instructions simultaneously in overlapped execution. In modern processors, structural hazards occur primarily in special purpose functional units that are less frequently used (such as floating point divide or other complex long running instructions). They are not a major performance factor, assuming programmers and compiler writers are aware of the lower throughput of these instructions. Instead of spending more time on this infrequent case, we focus on the two other hazards that are much more frequent.
> 2. **Data hazards** arise when an instruction depends on the results of a previous instruction in a way that is exposed by the overlapping of instructions in the pipeline.
> 3. **Control hazards** arise from the pipelining of branches and other instructions that change the PC.

讲述了三种冒险方式。

> Hazards in pipelines can make it necessary to stall the pipeline. Avoiding a hazard
> often requires that some instructions in the pipeline be allowed to proceed while others are delayed. For the pipelines we discuss in this appendix, when an instruction is stalled, all instructions issued later than the stalled instruction—and hence not as far along in the pipeline—are also stalled. Instructions issued earlier than the stalled instruction—and hence farther along in the pipeline—must continue, because otherwise the hazard will never clear. As a result, no new instructions are fetched during the stall.Wewill see several examples of howpipeline stalls operate in this section— don’t worry, they aren’t as complex as they might sound!

说了几个避免冒险的方式。

### 3.1. Performance of Pipelines With Stalls

主要是讲述性能优化，暂不研究。

### 3.2. Data Hazards

@todo

### 3.3. Branch Hazards

@todo

### 3.4. Reducing the Cost of Branches Through Prediction

> As pipelines get deeper and the potential penalty of branches increases, using delayed branches and similar schemes becomes insufficient. 
> 
> Instead, we need to turn to more aggressive means for predicting branches. Such schemes fall into two classes: low-cost static schemes that rely on information available at compile time and strategies that predict branches dynamically based on program behavior. We discuss both approaches here.

随着流水线的加深，其潜在的惩罚增加，使用一些弱鸡的方法已经不再那么高效了。

🔴🔴🔴 @todo 分支预测的意义还需要再继续研究

所以说我们需要转向更积极的方法来预测分支，此类方案分为两类：

1. 依赖编译时可用信息的低成本静态方案
2. 基于程序行为的动态分支预测

#### 3.4.1. Static Branch Prediction

@todo

#### 3.4.2. Dynamic Branch Prediction and Branch-Prediction Buffers

> The simplest dynamic branch-prediction scheme is a branch-prediction buffer or branch history table. A branch-prediction buffer is a small memory indexed by the lower portion of the address of the branch instruction. The memory contains a bit that says whether the branch was recently taken or not. This scheme is the simplest sort of buffer; it has no tags and is useful only to reduce the branch delay when it is longer than the time to compute the possible target PCs.

最简单的动态分支预测是分支预测 buffer 或者分支预测 table. 具体的细节较为简单，不多赘述。

> With such a buffer, we don’t know, in fact, if the prediction is correct—it may have been put there by another branch that has the same low-order address bits. But this doesn’t matter. The prediction is a hint that is assumed to be correct, and fetching begins in the predicted direction. If the hint turns out to be wrong, the prediction bit is inverted and stored back.

即使有这个 buffer, 我们也无从得知，预测是否正确。但是这没关系，因为预测是被假定为一个正确的提示，fetch 从预测的方向开始，如果这个提示最终被证明是错误的，那么预测位的那个 bit 就被反转过来。

❌❌❌ 此时有一个问题，分支预测错误之后，流水线被反转了么？

> This buffer is effectively a cache where every access is a hit, and, as we will see, the performance of the buffer depends on both how often the prediction is for the branch of interest and how accurate the prediction is when it matches. Before we analyze the performance, it is useful to make a small, but important, improvement in the accuracy of the branch-prediction scheme.

buffer 的性能取决于预测兴趣分支的频率和预测匹配时的准确性。

## 4. How Is Pipelining Implemented?

> Before we proceed to basic pipelining, we need to review a simple implementation of an unpipelined version of RISC V.

先研究一个没有流水线版本的 RISC V.

### 4.1. A Simple Implementation of RISC V

> In this subsection, we focus on a pipeline for an integer subset of RISC V that consists of l*oad-store word, branch equal, and integer ALU* operations. 
> 
> Later in this appendix we will incorporate the basic floating-point operations. Although we discuss only a subset of RISC V, the basic principles can be extended to handle all the instructions; for example, adding store involves some additional computing of the immediate field. We initially used a less aggressive implementation of a branch instruction. We show how to implement the more aggressive version at the end of this section.

我们讨论 RISC V 的一个子集。

> Every RISC V instruction can be implemented in, at most, 5 clock cycles. The 5
> clock cycles are as follows:

接下来说明 5 个 clock cycle 的分别构成：

1. Instruction fetch cycle(IF)
   
   ```
   IR <- Mem[PC];
   NPC <- PC + 4;
   ```
   
   > Operation—Send out the PC and fetch the instruction from memory into the instruction register (IR); increment the PC by 4 to address the next sequential instruction. The IR is used to hold the instruction that will be needed on subsequent clock cycles; likewise, the register NPC is used to hold the next sequential PC.

其操作是发送出去 PC 并将指令从内存中读取出来到**指令寄存器 IR**；将 PC 递增 4 以寻址下一个顺序指令。IR 用于保存后续时钟周期所需的指令，同样，寄存器 *NPC 用于保存下一个顺序 PC*.

2. Instruction decode/register fetch cycle (ID)
   
   ```
   A <- Regs[rs1];
   B <- Regs[rs2];
   Imm <- sign-extended immediate field of IR;
   ```
   
   > Operation—Decode the instruction and access the register file to read the registers (`rs1` and `rs2` are the register specifiers). The outputs of the general-purpose registers are read into two temporary registers (A and B) for use in later clock cycles. The lower 16 bits of the IR are also sign extended and stored into the temporary register `Imm`, for use in the next cycle. 
   > 
   > Decoding is done in parallel with reading registers, which is possible because these fields are at a fixed location in the RISC V instruction format. Because the immediate portion of a load and an ALU immediate is located in an identical place in every RISC V instruction, the sign-extended immediate is also calculated during this cycle in case it is needed in the next cycle. For stores, a separate sign-extension is needed, because the immediate field is split in two pieces.

其操作是解码指令并访问 register file 以读取寄存器，通用寄存器的输出被读入两个临时寄存器 A 和 B, 以便于在后续的时钟周期中使用。IR 的低 16 bit也被扩展并存储到临时寄存器 `Imm` 中，供下一个 cycle 使用。

解码与读取寄存器并行完成，这是可能的，因为这些字段在 RISC V 指令格式中处于固定位置。

❌❌ immediate filed 相关的研究。

3. Execution/effective address cycle (EX)

> The ALU operates on the operands prepared in the prior cycle, performing one of four functions depending on the RISC V instruction type:
> 
> - Memory reference:
>   `ALU Output <- A + Imm;`
>   Operation—The ALU adds the operands to form the effective address and places the result into the register ALU Output.
> - Register-register ALU instruction:
>   `ALU Output <- A func B;`
>   Operation—The ALU performs the operation specified by the function code (a combination of the func3 and func7 fields) on the value in register A and on the value in register B. The result is placed in the temporary register ALU Output.
> - Register-Immediate ALU instruction:
>   `ALUOutput <- A op Imm`;
>   Operation—The ALU performs the operation specified by the opcode on the value in register A and on the value in register Imm. The result is placed in the temporary register ALU Output.
> - Branch:
>   `ALU Output <- NPC + (Imm << 2);`
>   `Cond <- (A == B)`
>   Operation—The ALU adds the NPC to the sign-extended immediate value in Imm, which is shifted left by 2 bits to create a word offset, to compute the address of the branch target. Register A, which has been read in the prior cycle, is checked to determine whether the branch is taken, by comparison with Register B, because we consider only branch equal.

讲述 EX 步骤所做的事情。ALU 对上个 cycle 的操作数进行操作，根据 RISC V 指令类型操作下列四个函数中的一个：

1. 内存引用；寄存器的值加上立即数，计算出来有效地址并作为 ALU 的输出；
2. 寄存器之间；ALU 对寄存器 A 和 B 中的值执行指定功能代码，结果放在 ALU 输出寄存器；
3. 寄存器和立即数；寄存器 A 的值 op 立即数；
4. 分支；ALU 将 NPC 添加到 Imm 的符号扩展立即值中，该立即值偏移 2 位以创建字偏移，用于计算分支目标的地址。通过与寄存器 B 相比，检查在上一个周期中读取的寄存器 A, 以确定是否采用分支。

> The load-store architecture of RISC V means that effective address and execution cycles can be combined into a single clock cycle, because no instruction needs to simultaneously calculate a data address, calculate an instruction target address, and perform an operation on the data. The other integer instructions not included herein are jumps of various forms, which are similar to branches.

4. Memory access/branch completion cycle (MEM)

> The PC is updated for all instructions: `PC <- NPC`;
> 
> - Memory reference:
>   `LMD <- Mem[ALUOutput] or Mem[ALUOutput] <- B;`
>   Operation—Access memory if needed. If the instruction is a load, data return from memory and are placed in the LMD (load memory data) register; if it is a store, then the data from the B register are written into memory. In either case, the address used is the one computed during the prior cycle and stored in the register ALU Output.
> - Branch:
>   `if (cond) PC <- ALUOutput`
>   Operation—If the instruction branches, the PC is replaced with the branch destination
>   address in the register ALU Output.

​        

5. Write-back cycle (WB)

> - Register-register or Register-immediate ALU instruction:
>   `Regs[rd] <- ALU Output;`
> 
> - Load instruction:
>   `Regs[rd] <- LMD;`
>   Operation—Write the result into the register file, whether it comes from the memory system (which is in LMD) or from the ALU (which is in ALU Output) with rd designating the register.

我们做一个简单的总结，首先第一步 IF，也就是我们经常知道的 fetch, 这一步是送出 PC,  将指令存储在 IR 中，PC + 4 到下一条指令的地址，并且存储在 NPC 中（为了方便理解，理解称为 Next-PC）；

接下来进行指令的译码，注意这个和寄存器的读取是可以同时完成的，在这个步骤中，IR 的低 16 位进行了符号扩展，存储在了临时寄存器 Imm 中，供下一个周期使用；

接下来是执行的过程，根据具体的指令决定要执行的类型，其结果存储在了临时寄存器 ALU Output 中；

接下来是访存指令，即 memery access。需要注意到在这个步骤中，更新了 PC 寄存器；不管是寄存器写入还是写出，使用的地址都是上个步骤 ALU Output 的结果；如果是载入 load 指令，则将从 memory 返回的数据放入 LMD(load memory data) 寄存器中，如果是存储 store 指令，则将 B 寄存器的值写入到 memory 中。需要注意到，这一步骤可能是分支指令，如果是分支指令的话，则用寄存器 ALU Output 中的分支目标地址代替 PC.

最后一步是写回操作；目标是写入寄存器堆中。

🟢🟢 注意到上述是不考虑流水线的情况下的实现。

## 5. SQ/FB

处理器流水线语境中，**SQ/FB** 分别指：

- **SQ（Store Queue）**：存储队列  
    用于暂存等待执行的存储指令（Store）相关信息（如地址、数据），确保存储操作按序提交，同时协调与加载指令（Load）的内存访问冲突（如避免 Load 读取尚未写入内存的 Store 数据）。
    
- **FB（Fill Buffer）**：填充缓冲  
    用于处理缓存缺失（Cache Miss）时的数据交互。当加载指令（Load）访问的地址不在缓存中时，FB 会暂存从内存或下级缓存读取的数据，直到数据被写入本级缓存并供指令使用。

简单来说，SQ 管理待执行的存储操作，FB 处理缓存缺失时的数据加载，两者都是处理器后端协调内存访问的关键结构。当它们被填满时，后端无法继续处理新的 Load/Store 指令，进而引发流水线停顿。

### 5.1. 与 ROB 的联系

1. **ROB（重排序缓冲区）**  
    是全局的指令跟踪与排序中心，负责记录所有已发射（issue）但未提交（retire）的指令状态（如是否执行完成、是否有异常等），并确保指令最终按程序顺序提交（避免乱序执行导致的内存一致性或异常处理错误）。  
    简单说，ROB 是 “指令的生命周期管理器”，所有指令（包括算术逻辑指令、内存访问指令）的执行进度都由它跟踪。
    
2. **SQ（Store Queue，存储队列）**  
    是专门针对 **store 指令（写内存指令）** 的缓冲结构。  
    由于乱序执行中 store 指令可能先于前面的 load 指令执行（导致 “写后读” 冲突），或多个 store 指令乱序执行导致内存数据混乱，SQ 的作用是：
    
    - 暂存 store 指令的目标地址和数据，等待指令按程序顺序提交（由 ROB 确认）；
    - 确保 store 指令最终按顺序写入内存（或缓存），避免内存一致性问题；
    - 为 load 指令提供 “forwarding（转发）” 支持：若后续 load 指令读取的地址与 SQ 中未提交的 store 指令地址相同，可直接从 SQ 获取数据（无需访问缓存），提高效率。
3. **FB（Fill Buffer，填充缓冲区）**  
    是专门针对**load 指令（读内存指令）** 的缓冲结构，主要处理 “缓存未命中（cache miss）” 场景：
    
    - 当 load 指令访问的地址不在缓存中时，处理器会向内存发起 “填充请求”（从内存加载数据到缓存），FB 用于暂存该请求的目标地址和从内存加载的数据；
    - 等待数据加载完成后，FB 会将数据转发给目标寄存器（或后续依赖该数据的指令），同时将数据写入缓存；
    - 避免 load 指令因缓存未命中而长期阻塞流水线，FB 可 “暂存未完成的 load 操作”，让处理器继续执行其他无关指令。