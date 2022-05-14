# Makefile

## Abstract

我们对 makefile 的目标是，能读懂大型项目中的 makefile, 能写简单的 makefile.

## 基础概念

什么是 makefile?[^1] 什么是 make 命令，我们首先需要了解这些基础概念。make 命令在执行的时候，我们需要一个 makefile, 去告诉 make 程序如何编译和链接程序。

### makefile 的规则

先看一段简单的例子：

```makefile
target ... : prerequisites ...
    command
    ...
    ...
```

1. target … 

   这个可以是一个目标文件，也可以是一个执行文件，也可以是一个标签。*…* 表示 target 可以有多个

2. prerequisites ...

   生成该 target 的依赖项

3. commad

   命令。注意到可以是任意命令，正常而言，我们使用 `gcc` 或者 `g++` 这些命令，但是如果你要在这边写什么 `cd`, `ls` 命令也是可以的，即任意的 shell 命令，但是注意到我们的命令是要服务于 target 的

### Hello world

如此，我们可以写一个简单的例子（关于 Makefile 的例子，我们可以参考这个[^2]）：

```makefile
edit : main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o

main.o : main.c defs.h
    cc -c main.c
kbd.o : kbd.c defs.h command.h
    cc -c kbd.c
command.o : command.c defs.h command.h
    cc -c command.c
display.o : display.c defs.h buffer.h
    cc -c display.c
insert.o : insert.c defs.h buffer.h
    cc -c insert.c
search.o : search.c defs.h buffer.h
    cc -c search.c
files.o : files.c defs.h buffer.h command.h
    cc -c files.c
utils.o : utils.c defs.h
    cc -c utils.c
clean :
    rm edit main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o
```

这是一个比较简单的例子，我们暂且把其叫做 makefile 的 hello world 程序，暂且不用关心其中的文件细节。上述代码需要产生 `edit` 这个 target, 但是这个 target 依赖了若干个 `.o`, 其生成的命令就是第 3 行的命令，注意到行数太长的时候我们可以进行换行。

注意到因为 edit 依赖了很多 `.o`, 所以我们要对这些依赖的逐一生成，以 `main.o` 为例（代码第 6 行），我们可以看出生成 `main.o` 的生成依赖于 `main.c` 和 `defs.h`, 所以我们把这个写到后面来，这个例子中的文件结构可以看到的话，肯定是 `main.c` 和 `defs.h` 在一个文件夹中，我们实际生产中遇到的结构一般都不会这么简单，后面例子我们将分析复杂的形式。

`clean` 命令就是说我们把生成的文件进行一个消除，不要 `xxx.o` 这个目标文件了，做一个清理的工作。额外一提，我们这个 clean 不是一个 target, 其冒号后什么也没有，可以将其理解为一个动作的名字。

### makefile 变量

我们不难看出，上面的例子太麻烦了，比如说：

```makefile
edit : main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \
        insert.o search.o files.o utils.o
```

在这几行代码里面，这几个 `xxx.o` 文件就被一直使用了，后面如果我们要新增依赖项，那么这两个地方都需要改，万一漏了没改，那岂不是悲剧了？所以说我们提出了**变量**这个概念，其和编程语言中的变量概念类似，可以简单理解为 C 语言中的宏。

我们定义一个变量：

```makefile
objects = main.o kbd.o command.o display.o \
     insert.o search.o files.o utils.o
```





## Reference

[^1]: [跟我一起写Makefile](https://seisman.github.io/how-to-write-makefile/index.html)
[^2]: [Makefile-Templates GitHub](https://github.com/TheNetAdmin/Makefile-Templates.git)
