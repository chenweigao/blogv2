# CMake

## Abstract

搞 C 还是离不开这个啊，再怎么还是要研究一下的，本文参考以下比较好的文档：

1. CMake Examples[^1], GitHub 上的 CMake 例子；
2. CMake Tutorial[^2], 官方文档

## Concepts

| Concepts       | Means                                                        |      |
| -------------- | ------------------------------------------------------------ | ---- |
| CMakeLists.txt | 这个文件是存储所有 CMake 命令的文件，注意这个文件的名称：`CMakeLists.txt` 严格区分大小写。 |      |
|                |                                                              |      |
|                |                                                              |      |

## Verbose

我们可以设置 make 时候 debug 信息，如下所示：

```bash
make clean
make VERBOSE=1
```



## ENV

介绍几个环境变量[^3]。

| Variable                 | Means                                                        |      |
| ------------------------ | ------------------------------------------------------------ | ---- |
| PROJECT_NAME             | 命令 `project (hello_cmake)` 执行后会创建一个 变量 `${PROJECT_NAME}`, 其值为 `hello_cmake` |      |
| CMAKE_BINARY_DIR         | 执行 cmake 命令的 root, 或者 top level 的文件夹，后续分析关联见 `Binary Directory`。<br />The root binary / build directory. This is the directory where you ran the cmake command. |      |
| CMAKE_SOURCE_DIR         | The root source directory                                    |      |
| CMAKE_CURRENT_SOURCE_DIR | The current source directory if using sub-projects and directories. |      |
| CMAKE_CURRENT_BINARY_DIR | The build directory you are currently in.                    |      |
| PROJECT_BINARY_DIR       | The build directory for the current project.                 |      |
|                          |                                                              |      |

以后还会增加。

### Binary Directory

> The root or top level folder that you run the cmake command from is known as your **CMAKE_BINARY_DIR** and is the root folder for all your binary files. CMake supports building and generating your binary files both in-place and also out-of-source.

这段话说了可以原地 cmake, 也可以在外面 cmake.

原地 cmake 如下：

```bash
cmake .
```

原地 cmake 的缺点在于：你的源代码和 Makefiles 和目标代码都混在一起了(interspersed)

Out-of-Source cmake 如下：

```bash
mkdir build
cd build/
cmake ..
```

换个地方 cmake 的好处就是，你想重新 cmake 的话，你就把生成的那个文件夹删除了，再 cmake 一次，就 OK 了。

## functions

### target_include_directories

如果存在多个 include 文件夹，则可以使用 `target_include_directories()`， 其作用类似于 `-I`.

```cmake
target_include_directories(target
    PRIVATE
        ${PROJECT_SOURCE_DIR}/include
)
```

`PRIVATE` 标识了 include 的作用域。



```cmake
target_include_directories(hello_library
    PUBLIC
        ${PROJECT_SOURCE_DIR}/include
)
```

This will cause the included directory used in the following places:

- When compiling the library
- When compiling any additional target that links the library.

就是说在编译的时候会找 include 下面的东西，或者是其他链接到这个 library 的也会来这找的。

###  add_library

> The add_library() function is used to create a library from some source files. 

```cmake
add_library(hello_library STATIC
    src/Hello.cpp
)
```

上述代码会创建出一个 `hello_library.a`.

### target_link_libraries

比较好理解，就是链接的：

```cmake
add_executable(hello_binary
    src/main.cpp
)

target_link_libraries( hello_binary
    PRIVATE
        hello_library
)
```

## Reference

[^1]: <https://github.com/ttroy50/cmake-examples>
[^2]: <https://cmake.org/cmake/help/latest/guide/tutorial/index.html>
[^3]: [Useful Variables](https://gitlab.kitware.com/cmake/community/-/wikis/doc/cmake/Useful-Variables)

