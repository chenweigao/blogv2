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

## 实战 Makefile

### 概览

通过本章节很多例子，我们在实际的环境中进行编译，然后做细微的修改。希望通过这个目的，我们可以掌握 makefile 的基本用法，也会修改项目中的 makefile, 并最终使编译通过。

### 单文件夹例子

#### hello world

我们先准备一个很简单的 C 程序 `main.c`：

```c
#include <stdio.h>

int main() {
        printf("hello makefile 01\n");
}
```

然后执行最简单的 `g++`:

```bash
$ g++ main.c
$ ./a.out
hello makefile 01
```

我们将其改造成 makfile 的形式，其文件树结构如下：

```bash
$ tree                                                                                                                                 
.
|-- main.c
|-- makefile
```

其中 makefile 的内容为：

```makefile
objects = main.o

test: $(objects)
        cc -o test $(objects)

main.o: main.c
        cc -c main.c

.PHONY: clean
clean:
        rm test $(objects)
```

这里面有几点是需要注意的：

1. 第 6 行我们指定了 main.o 生成所需要的依赖，这个不指定的话会报失败的。

2. 第 7 行我们使用了 `cc` 用于编译，我们也可以使用 `g++`:

   ```makefile
   objects = main.o
   
   test: $(objects)
           g++ -o test $(objects)
   
   main.o: main.c
           g++ -c main.c
   
   .PHONY: clean
   clean:
           rm test $(objects)
   ```

   🛑🛑拓展实验🛑🛑 特别需要注意的是，第 7 行我们也可以使用 `g++ -c main.c -o main.o`, 但是在这里我们没有指定，也编译出来了 `main.o`, 说明这个可能是自动生成的，为此我们尝试一下：

   ```bash
   $ g++ -c main.c
   $ ls
   main.c  main.o  makefile
   ```

   这是自动推导了，但是如果我们不指定 `-c` 的话，就不会自动推导， 而是会生成一个可执行的 `a.out`：

   ```bash
   $ g++ -c main.c
   $ ls
   a.out  main.c  makefile
   ```

3. clean 命令用于清除 make 生成的那些文件，直接执行 `make clean` 即可

4. `.PHONY` 表示 `clean` 是个伪目标文件。

我们执行 `make` 命令，其输出可以参考：

```bash
$ make                                                                                                                                 
cc -c main.c
cc -o test main.o
```

从这个里面，我们可以看出来，make 命令一共执行了 2 步，第一步是先生成 `main.o`, 然后再生成 target `test`.

#### 自定义的头文件

很多时候我们使用的都不是标准库的头文件，我们会自己写头文件，然后引用，对于这种情况，makefile 该怎么编写呢？

先给出一个简单的头文件 `zhanshen.h`:

```c
int add(int x, int y) {
        return x + y;
}
```

这个头文件中定义了最简单的一个函数，我们在 `main.c` 中调用一下这个：

```c
#include <stdio.h>
#include "zhanshen.h"

int main() {
        printf("hello makefile 01\n");
        int res = add(1, 2);
        printf("zhanshen sum 1+2=%d\n", res);
        return 0;
}
```

然后使用最简单的方式验证一下：

```bash
$ g++ main.c

$ ls
a.out  main.c  makefile  zhanshen.h

$ ./a.out                                                                   
hello makefile 01
zhanshen sum 1+2=3
```

然后其实我们的 makefile 不需要做任何的修改，可以直接使用，因为是在同一个路径下面的，所以自己就找到了：

```bash
$ make
g++ -c main.c
g++ -o test main.o

$ ls
main.c  main.o  makefile  test  zhanshen.h

$ ./tes
hello makefile 01
zhanshen sum 1+2=3
```

### 多文件夹例子

#### 例子01

但是在日常的生产活动中，我们都是多文件夹的，所以这种情况我们需要研究。

我们的文件结构如下：

```bash
.
|-- include
|   `-- zhanshen.h
|-- main.c
`-- makefile

1 directory, 3 files
```

我们把上章节的例子中的 `zhanshen.h` 移到了新建的 `include` 文件夹中去了，这时候我们执行 `make` 命令观察一下：

```bash
$ make

g++ -c main.c
main.c:2:10: fatal error: zhanshen.h: No such file or directory
 #include "zhanshen.h"
          ^~~~~~~~~~~~
compilation terminated.
makefile:7: recipe for target 'main.o' failed
make: *** [main.o] Error 1
```

很明显，找不到了头文件了，此时该怎么办呢？我们需要修改 makefie:

```makefile
objects = main.o

test: $(objects)
        g++ -o test $(objects)

main.o: main.c
        g++ -c main.c -I include

.PHONY: clean
clean:
        rm test $(objects)
```

重点在第 7 行，我们增加了 `-I` 选项，后面跟随了我们 `zhanshen.h` 所在的目录，这样 makefile 就能自己去 `include` 文件夹下面找到 `zhanshen.h` 了。

#### 例子02

在日常的生产中，我们通常不会在头文件中去定义函数（接口）的具体实现，头文件只是用作一个申明的作用，在这种情况下，我们的代码结构可能是这样的：

```bash
.
|-- include
|   |-- zhanshen.c
|   `-- zhanshen.h
|-- main.c
`-- makefile
```

新增的 `zhanshen.c` 内容如下：

```c
#include "zhanshen.h"
int add(int x, int y) {
        return x + y;
}
```

修改后的 `zhanshen.h` 内容如下：

```c
#ifndef __SUM_H__
#define __SUM_H__
int add(int x, int y);
#endif
```

此时我们执行 `make` 命令会报错：

```bash
$ make

g++ -o test main.o
main.o: In function `main':
main.c:(.text+0x1f): undefined reference to `add(int, int)'
collect2: error: ld returned 1 exit status
makefile:4: recipe for target 'test' failed
make: *** [test] Error 1
```

（这个错误折磨了我好几天，郁闷，太菜了，郁闷）

解决方案是，对 makefile 进行改造：

```makefile
objects = main.o zhanshen.o

test: $(objects)
        g++ -o test $(objects)

main.o: main.c include/zhanshen.h
        g++ -c main.c -I include

zhanshen.o:
        g++ -c include/zhanshen.c

.PHONY: clean
clean:
        rm test $(objects)
```

## Reference

[^1]: [跟我一起写Makefile](https://seisman.github.io/how-to-write-makefile/index.html)
[^2]: [Makefile-Templates GitHub](https://github.com/TheNetAdmin/Makefile-Templates.git)
