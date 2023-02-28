# XV6(6.828)

> xv6: a simple, Unix-like teaching operating system.

## Foreword and acknowledgements

### RISC-V(risk-five)

1. An open standard instruction set architecture (ISA)
2. Open source
3. A RISC architecture, a load–store architecture;

### XV6

XV6 is a Linux example kernel, re-implementation.

Understanding xv6 is a good start toward understanding any of these systems and many others.

### Register

> In computer engineering, a load–store architecture is an instruction set architecture that divides instructions into two categories: **memory access** (load and store between memory and registers[^1]) and **ALU operations** (which only occur between registers).

关于寄存器：寄存器可以分为 Processor register 和 Register, 前者是在 CPU 核内，后者是在 CPU 核外，核外寄存器通过地址访问。

一个处理器通常包含多种类型的寄存器，寄存器可以分为以下几种：

| Name                    | Abbr | Means                                                        | Remark                                     |
| ----------------------- | ---- | ------------------------------------------------------------ | ------------------------------------------ |
| Program Counter         | PC   | A program counter keeps track of the next instruction to be executed. | 主要记录下一条要执行的指令                 |
| Instruction Register    | IR   | Instruction Register is a register which holds the instruction to be decoded by the control unit. | 记录控制单元解码的指定                     |
| Memory Address Register | MAR  | Memory Address Register is a register which points to the memory location which the CPU plans to access, either for reading or writing. | 指向 CPU 要访问的存储位置                  |
| Memory Buffer Register  | MBR  | which is also referred to as the memory data register (MDR) is used for storage data either for coming to the CPU or data being transferred by the CPU. | 存储进入 CPU 的数据或者是被 CPU 传输的数据 |
| Accumulator             | ACC  | a general purpose used for strong variables, temporary results and results produced by arithmetic logic until of the CPU. | 累加器                                     |

寄存器的 size：一般寄存器由的数量由其可以承载的 bits 数量来衡量，如 32-bit 寄存器、64-bit 寄存器等。

GPU 上的寄存器远远多于 CPU 上寄存器的数量。

## Operation System Interfaces

操作系统的作用主要可以归类为以下几点：

1. 在多个程序之间共享一台计算机；
2. 管理底层硬件；在多个程序之间共享硬件，使得我们感知程序是在同一时间运行；
3. 提供程序之间的交互、共享数据或者协同工作。

而接口的作用就是操作系统为用户提供服务的方式。

## References

[^1]: [Processor register](https://en.wikipedia.org/wiki/Processor_register), 寄存器；Processor register 为处理器寄存器。
