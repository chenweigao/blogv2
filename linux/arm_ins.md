# ARM Instruction

## Abstract 

本文章作为一个 ARM 指令的速查表使用。

```assembly
MNEMONIC{S}{condition} {Rd}, Operand1, Operand2
```

上面就是 ARM 汇编指令的一个通用的格式说明，下面对每一个字段进行具体的说明：

- MNEMONIC: 指令的助记符，如 ADD
- S: 可选的扩展位，如果指令后带了这个，将根据计算结果更新 CPSR 寄存器中相应的 FLAG
- condition: 执行条件，如果没有指定，则默认位 AL（无条件执行）
- Rd: 目的寄存器
- Operand1: 第一个操作数，可以是寄存器或者立即数
- Operand2: 第二个操作数，可变的，可以是一个寄存器或者立即数，甚至带移位操作的寄存器

对于 Operand2 的解释和研究举例：

```assembly
#123		@ - 立即数
Rx			@ - 寄存器，如 R1
Rx, ASR n	 @ - 对寄存器中的值进行算术右移 n 位后的值
Rx RRX		@ - 对寄存器中的值进行带扩展的循环右移 1 位后的值
```



## Instruction

| Instruction | Example | Remark       |
| ----------- | ------- | ------------ |
| SUB         |         | 不进位的减法 |
|             |         |              |

### sub

减法指令，并且是不进位的减法。

### ldr

加载一个寄存器：

- 32 位常量
- 地址

用于从存储器中将一个 32 位的字数据传送到目的寄存器中。

```assembly
ldr x0, [x1]          ; 将寄存器 x1 的值作为地址，取该内存地址的值放入寄存器 x0 中 
ldr w8, [sp, #0x8]    ; 将栈内存 [sp + 0x8] 处的值读取到 w8 寄存器中 
ldr x0, [x1, #4]!     ; 将寄存器 x1 的值加上 4 作为内存地址, 取该内存地址的值放入寄存器 x0 中, 然后将寄存器 x1 的值加上 4 放入寄存器 x1 中 
ldr x0, [x1], #4      ; 将寄存器 x1 的值作为内存地址，取内该存地址的值放入寄存器 x0 中, 再将寄存器 x1 的值加上 4 放入寄存器 x1 中 
ldr x0, [x1, x2]      ; 将寄存器 x1 和寄存器 x2 的值相加作为地址，取该内存地址的值放入寄存器 x0 中 
```



### stp

入栈指令

### str

(store register) 将寄存器中的值写入到内存中，如：

```assembly
str w9, [sp, #0x8] 
```

将寄存器 w9 中的值保存到栈内存 `[sp + 0x8]` 处。

### strb

(store register byte) 将寄存器中的值写入到内存中（只存储一个字节），如：

```assembly
strb w8, [sp, #7] 
```

将寄存器 w8 中的低 1 字节的值保存到栈内存 `[sp + 7]` 处

### b

（branch）跳转到某地址（无返回）, 不会改变 *lr (x30)* 寄存器的值；一般是本方法内的跳转，如 `while` 循环，`if else` 等 ，如：

```assembly
b LBB0_1      ; 直接跳转到标签 ‘LLB0_1’ 处开始执行
```

b 指令的一些变体[^2]

`bl 指令` 跳转到标号出执行

`b.le` ：判断上面cmp的值是小于等于 执行标号，否则直接往下走

`b.ge` 大于等于 执行地址 否则往下

`b.lt` 判断上面camp的值是 小于 执行后面的地址中的方法 否则直接往下走

`b.gt` 大于 执行地址 否则往下

`b.eq` 等于 执行地址 否则往下

`b.hi` 比较结果是无符号大于，执行地址中的方法，否则不跳转

`b.hs` 指令是判断是否无符号小于

`b.ls` 指令是判断是否无符号大于

`b.lo` 指令是判断是否无符号大于等于

### tst

把一个寄存器的内容和另一个寄存器的内容进行按位与操作，并根据结果更新 CPSR 中条件标志位的值，当前运算结果为 1,  则 Z=0, 反之 Z=1.

### fcvtz

浮点数转换为定点数。

### cbz

和 0 比较（Compare），如果结果为零（Zero）就转移（只能跳到后面的指令）;

```assembly
CBZ Rn, label
```

*`\*`Rn`\*`*

is the register holding the operand.

*`\*`label`\*`*

is the branch destination.

同样的，还有不为 0 的时候跳转：

```assembly
CBNZ Rn, label
```

### tbnz

```assembly
TBNZ X1, #3, label
```

上述汇编的含义为，如果 `x1` 寄存器的第三位不为 0, 则跳转到 label.

## 内存读写

ARM 使用加载存储模型进行内存访问，这意味着只有加载/存储（**LDR 和 STR**）指令才能访问内存。在 x86 上，大多数指令都可以直接对内存中的数据进行操作，而在ARM上，**必须先将内存中的数据从内存移到寄存器中，然后再进行操作**。这意味着递增ARM上特定内存地址上的 32 位值将需要三种类型的指令（加载，递增和存储），以便首先将特定地址上的值加载到寄存器中，在寄存器中递增值，以及将其从寄存器存储回存储器[^1]。



## 位操作

### UBFX

举例说明：

```assembly
ubfx	x10, x3, #3, #29
```

含义为从 `x3` 寄存器的第 3 位开始，提取 29 位到 `x10` 寄存器中。剩余高位用 0 填充，即 无符号位域提取指令。

UBFX 指令一般有两种用法：

```assembly
UBFX Wd, Wn, #lsb, #width ; 32-bit
UBFX Xd, Xn, #lsb, #width ; 64-bit
```

### AND

`AND` 为按位与操作。

### lsl

`lsl` 为逻辑左移指令。

```assembly
lsl	w9, w11, w9
```

左移指令分两种，可以给定寄存器或者立即数进行移位：

```ass
LSL <Wd>, <Wn>, #<shift> ; 32-bit
LSL <Xd>, <Xn>, #<shift> ; 64-bit
```

or

```assembly
LSL <Wd>, <Wn>, <Wm> ; 32-bit
LSL <Xd>, <Xn>, <Xm> ; 64-bit
```





## Reference

[^1]: https://azeria-labs.com/memory-instructions-load-and-store-part-4/

[^2]: https://juejin.cn/post/6978137866152968222
