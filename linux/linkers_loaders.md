# Linkers & Loaders

## Abstract

本文章主要是《程序员的自我修养》的读书笔记。

## 目标文件

### 目标文件的格式

- `.o`  目标文件，就是编译后但是还未链接的那些中间文件。
- `.so` Linux 下的动态链接库。
- `.elf` Linux 下的可执行文件。
- `.a` Linux 下的静态链接库。

这些都是按照可执行文件的格式存储的。

为了更加直观，我们把书中的表格也引用过来：

| ELF 文件类型                      | 说明                                                         | 实例                |
| --------------------------------- | ------------------------------------------------------------ | ------------------- |
| 可重定位文件<br />*Relocatable*   | 包含了代码和数据，可以被用来链接成可执行文件或者共享目标文件；静态链接库也可以属于这一类 | .o, .obj            |
| 可执行文件<br />*Executable*      | 包含了可以直接执行的文件，一般都没有扩展名                   | elf, /bin/bash, exe |
| 共享目标文件<br />*Shared Object* | 包含了代码和数据，可以在以下两种情况中应用：<br />1. 链接器使用这种文件跟其他的可重定位文件和共享目录链接，产生新的目标文件；<br />2. 动态连接器将几个这种文件与可执行文件结合，作为进程映像的一部分来执行。 | .so, DLL            |
| 核心转储文件                      | core dump file, 当进程意外终止的时候，系统可以将该进程的地址空间的内容及终止时的一些其他信息转储到核心转储文件 | core dump           |

如果在遇到不确定的情况下，可以在命令行中使用 `file` 命令来查看相应的文件格式。

注意到以上表格中的文件格式都可统一称为**目标文件**。

### Segement

那么目标文件中都有什么呢？除了必须有的编译后的机器指令代码和数据之外，还包括了链接时所需要的一些信息：符号表、调试信息、字符串等。这些链接所需要的信息都被存储在**段(Segment)**中，也可以称作节(Section).

程序代码编译后的机器指令经常被放在**代码段**中，代码段常见的名字有 .code 和 .text; 全局遍历和静态变量数据经常被放在**数据段**中，一般的名字都叫做 .data. 除此之外，还有一个 BSS 段，其中主要保存的就是未初始化的全局变量和局部静态变量。

| 段            | 含义                                                         |
| ------------- | ------------------------------------------------------------ |
| File Header   | 描述了整个文件的属性。<br />除此之外，还会包括一个段表，用于描述文件中各个段的数组，其内容是各个段在该文件中的偏移位置以及段的属性。 |
| .text section | 编译后的机器代码。                                           |
| .data section | 已初始化的全局变量和局部静态变量。                           |
| .bss section  | 未初始化的全局变量和局部静态变量。                           |

分段的原因和优点如下列举：

- 程序被装载后，数据段是可读写的，而代码段（指令区域）是只读的；

- 将代码段和数据段分开，有助于利用到现在计算机的 icache 和 dcache.
- 有利于代码段的共享；

需要注意，有时候会遇到 .rodata 段，这个段中存放的是只读数据，即对这个段的所有操作都当作非法处理；其次还在语义上支持了 C++ 的 `const` 关键字。

### objdump

```bash
objdump -h xxx.o
```

上述的 -h 选项是可以打印出 elf 文件每个段的基本信息。其中需要注意的是，CONTENTS 属性用来表示该段在文件中存在，如果没有这个属性的字段或者是 0, 我们就可以认为这个属性段在文件中是不存在的。

```bash
objdump -s -d xxx.o
```

-s 参数可以将所有段的内容以 16 进制的方式打印出来；

-d 参数可以将所有包含指令的段反汇编。

```bash
objdump -s -d -x xxx.o
```

-x 参数可以打印出详细信息，比如说这个文件里面的段，每个段具体的内容等。

#### example

我们给出来一个示例的 C 文件，方便我们理解：

```c
/*
 * SimpleSection.c
 *
 * Linux:
 * gcc -c SimpleSection.c
 *
 * Windows:
 * cl SimpleSection.c /c /Za
 */
int printf(const char *format, ...);
int global_init_var = 84;
int global_uninit_var;
void func1(int i)
{
    printf("%d\n", i);
}
int main(void)
{
    static int static_var = 85;
    static int static_var2;
    int a = 1;
    int b;
    func1(static_var + static_var2 + a + b);
    return a;
}
```

在控制台执行：

```bash
gcc -c SimpleSection.c
```

然后使用 objdump 查看其信息，-h 选项打印出每一个段的基本信息：

```bash
objdump -h SimpleSection.o
```

出来的信息如下所示(看起来不整洁的话可以换为截图)：

```bash
SimpleSection.o:     file format elf64-x86-64

Sections:
Idx Name          Size      VMA               LMA               File off  Algn
  0 .text         00000057  0000000000000000  0000000000000000  00000040  2**0
                  CONTENTS, ALLOC, LOAD, RELOC, READONLY, CODE
  1 .data         00000008  0000000000000000  0000000000000000  00000098  2**2
                  CONTENTS, ALLOC, LOAD, DATA
  2 .bss          00000004  0000000000000000  0000000000000000  000000a0  2**2
                  ALLOC
  3 .rodata       00000004  0000000000000000  0000000000000000  000000a0  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  4 .comment      0000002a  0000000000000000  0000000000000000  000000a4  2**0
                  CONTENTS, READONLY
  5 .note.GNU-stack 00000000  0000000000000000  0000000000000000  000000ce  2**0
                  CONTENTS, READONLY
  6 .eh_frame     00000058  0000000000000000  0000000000000000  000000d0  2**3
                  CONTENTS, ALLOC, LOAD, RELOC, READONLY, DATA
```



同时还有一个 **readelf** 工具可以作为 objdump 的对照：

```bash
$ readelf -h SimpleSection.o                                                     

ELF Header:
  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
  Class:                             ELF64
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              REL (Relocatable file)
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  Entry point address:               0x0
  Start of program headers:          0 (bytes into file)
  Start of section headers:          1104 (bytes into file)
  Flags:                             0x0
  Size of this header:               64 (bytes)
  Size of program headers:           0 (bytes)
  Number of program headers:         0
  Size of section headers:           64 (bytes)
  Number of section headers:         13
  Section header string table index: 12
```



我们使用 -s 参数将所有的内容以 16 进制的方式打印出来，-d 参数将所有包含指令的段反汇编，如下所示：

```bash
$ objdump -s -d SimpleSection.o

SimpleSection.o:     file format elf64-x86-64

Contents of section .text:
 0000 554889e5 4883ec10 897dfc8b 45fc89c6  UH..H....}..E...
 0010 488d3d00 000000b8 00000000 e8000000  H.=.............
 0020 0090c9c3 554889e5 4883ec10 c745f801  ....UH..H....E..
 0030 0000008b 15000000 008b0500 00000001  ................
 0040 c28b45f8 01c28b45 fc01d089 c7e80000  ..E....E........
 0050 00008b45 f8c9c3                      ...E...
Contents of section .data:
 0000 54000000 55000000                    T...U...
Contents of section .rodata:
 0000 25640a00                             %d..
Contents of section .comment:
 0000 00474343 3a202855 62756e74 7520372e  .GCC: (Ubuntu 7.
 0010 352e302d 33756275 6e747531 7e31382e  5.0-3ubuntu1~18.
 0020 30342920 372e352e 3000               04) 7.5.0.
Contents of section .eh_frame:
 0000 14000000 00000000 017a5200 01781001  .........zR..x..
 0010 1b0c0708 90010000 1c000000 1c000000  ................
 0020 00000000 24000000 00410e10 8602430d  ....$....A....C.
 0030 065f0c07 08000000 1c000000 3c000000  ._..........<...
 0040 00000000 33000000 00410e10 8602430d  ....3....A....C.
 0050 066e0c07 08000000                    .n......

Disassembly of section .text:

0000000000000000 <func1>:
   0:   55                      push   %rbp
   1:   48 89 e5                mov    %rsp,%rbp
   4:   48 83 ec 10             sub    $0x10,%rsp
   8:   89 7d fc                mov    %edi,-0x4(%rbp)
   b:   8b 45 fc                mov    -0x4(%rbp),%eax
   e:   89 c6                   mov    %eax,%esi
  10:   48 8d 3d 00 00 00 00    lea    0x0(%rip),%rdi        # 17 <func1+0x17>
  17:   b8 00 00 00 00          mov    $0x0,%eax
  1c:   e8 00 00 00 00          callq  21 <func1+0x21>
  21:   90                      nop
  22:   c9                      leaveq
  23:   c3                      retq

0000000000000024 <main>:
  24:   55                      push   %rbp
  25:   48 89 e5                mov    %rsp,%rbp
  28:   48 83 ec 10             sub    $0x10,%rsp
  2c:   c7 45 f8 01 00 00 00    movl   $0x1,-0x8(%rbp)
  33:   8b 15 00 00 00 00       mov    0x0(%rip),%edx        # 39 <main+0x15>
  39:   8b 05 00 00 00 00       mov    0x0(%rip),%eax        # 3f <main+0x1b>
  3f:   01 c2                   add    %eax,%edx
  41:   8b 45 f8                mov    -0x8(%rbp),%eax
  44:   01 c2                   add    %eax,%edx
  46:   8b 45 fc                mov    -0x4(%rbp),%eax
  49:   01 d0                   add    %edx,%eax
  4b:   89 c7                   mov    %eax,%edi
  4d:   e8 00 00 00 00          callq  52 <main+0x2e>
  52:   8b 45 f8                mov    -0x8(%rbp),%eax
  55:   c9                      leaveq
  56:   c3                      retq
```

这里面有一个细节需要注意，我们如何定位函数的地址，对于 main 函数，我们可以看到其地址是 `0000000000000024`, 而在第 8 行我们可以看到 `0020 0090c9c3 554889e5 4883ec10 c745f801`, 这行的意思就是起始地址是 `0020`, 所以我们 +4 就可以得到函数的起始汇编代码 `55`.

```bash
Contents of section .data:
 0000 54000000 55000000                    T...U...
```

上述 `54000000` 涉及到了**字节序**的问题，这里的实际上存储的是 `0x54` 即十进制的 84.
