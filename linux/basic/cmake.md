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

## Argument

### Verbose

我们可以设置 make 时候 debug 信息，如下所示：

```bash
make clean
make VERBOSE=1
```

### DESTDIR

这个可以用来设置 CMAKE_INSTALL_PREFIX  的位置：

```cmake
make install DESTDIR=/tmp/stage
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
| CMAKE_INSTALL_PREFIX     | `make install` 产生，默认值是 `/usr/local/`                  |      |
| CMAKE_C_FLAGS            | compile flags                                                |      |
| CMAKE_CXX_FLAGS          | compile flags                                                |      |
| xxx_INCLUDE_DIRS         | 三方库找到的话对应的位置<br />A variable pointing to the include directory for the library. |      |
| xxx_LIBRARY              | A variable pointing to the library path.                     |      |
| XXX_FOUND                | 某个第三方库是否找到                                         |      |
| CMAKE_CXX_STANDARD       | 指定 C++ 的版本                                              |      |

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

除此之外也支持 shared lib:

```cmake
add_library(hello_library SHARED
    src/Hello.cpp
)
```

上述代码会创建出一个 `libhello_library.so`.

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

### install

> CMake offers the ability to add a `make install` target to allow a user to install binaries, libraries and other files.

cmake 支持获取二进制文件，安装的位置存储在环境变量 **CMAKE_INSTALL_PREFIX** 中，举例如下：

```cmake
install (TARGETS cmake_examples_inst_bin
    DESTINATION bin)
```

或者 lib 文件(输出在 ${CMAKE_INSTALL_PREFIX}/bin)：

```cmake
install (TARGETS cmake_examples_inst
    LIBRARY DESTINATION lib)
```

或者说目录（输出在 ${CMAKE_INSTALL_PREFIX}/include）：

```cmake
install(DIRECTORY ${PROJECT_SOURCE_DIR}/include/
    DESTINATION include)
```

或者说文件（输出在 ${CMAKE_INSTALL_PREFIX}/etc）：

```cmake
install (FILES cmake-examples.conf
    DESTINATION etc)
```



对于这个，我们涉及到了使用 `make install`, 所以需要再说明一下，我们对上面存在四个 `install` 的 CMake 文件进行 make,　其步骤如下：

```bash
$ mkdir build
$ cd build/
$ cmake ..
$ make
$ sudo make install 
```

其对应的输出如下：

```bash
Install the project...
-- Install configuration: ""
-- Installing: /usr/local/bin/cmake_examples_inst_bin
-- Set runtime path of "/usr/local/bin/cmake_examples_inst_bin" to ""
-- Installing: /usr/local/lib/libcmake_examples_inst.so
-- Up-to-date: /usr/local/include
-- Installing: /usr/local/include/installing
-- Installing: /usr/local/include/installing/Hello.h
-- Installing: /usr/local/etc/cmake-examples.conf
```

我们在执行完 `sudo make install ` 命令后会生成一个 `install_manifest.txt` 文件，其内容如下：

```bash
/usr/local/bin/cmake_examples_inst_bin
/usr/local/lib/libcmake_examples_inst.so
/usr/local/include/installing/Hello.h
```

❓❓❓ 如果要看到输出：

```bash
$ LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib cmake_examples_inst_bin
Hello Install!
```



还有一点，如果我们要更改 **CMAKE_INSTALL_PREFIX** 这个环境变量的默认值的话，可以这么操作：

```cmake
if( CMAKE_INSTALL_PREFIX_INITIALIZED_TO_DEFAULT )
  message(STATUS "Setting default CMAKE_INSTALL_PREFIX path to ${CMAKE_BINARY_DIR}/install")
  set(CMAKE_INSTALL_PREFIX "${CMAKE_BINARY_DIR}/install" CACHE STRING "The path to use for make install" FORCE)
endif()
```

或者这样：

```cmake
make install DESTDIR=/tmp/stage
```



我们执行完后，需要进行卸载，命令如下：

```cmake
sudo xargs rm < install_manifest.txt
```

🧡🧡🧡 我之前使用了 `make clean` 似乎也达到了效果，但是仔细观察发现，libcmake_examples_inst.so 这个文件没有被干掉，所以还是要使用上面的方式！需要注意。

### target_compile_definitions

target_compile_definitions() 这个函数就是用来设置 compile flags 的，我们引用原文：

CMake supports setting compile flags in a number of different ways:

- using target_compile_definitions() function
- using the CMAKE_C_FLAGS and CMAKE_CXX_FLAGS variables.

举例如下：

```cmake
target_compile_definitions(cmake_examples_compile_flags
    PRIVATE EX3
)
```

这个会造成在编译的时候加入定义 EX3.

### find_package

如果要使用第三方库的话，我们需要进行查找，如下所示：

```cmake 
find_package(Boost 1.46.1 REQUIRED COMPONENTS filesystem system)
```

我们如果需要验证是否找到了这个包，可以通过生成的变量 `XXX_FOUND` 来进行判断，如下所示：

```cmake
if(Boost_FOUND)
    message ("boost found")
    include_directories(${Boost_INCLUDE_DIRS})
else()
    message (FATAL_ERROR "Cannot find Boost")
endif()
```

上面出现了一个 `${Boost_INCLUDE_DIRS}`， 原理类似，就是找到的话，我们会生成一个这样的变量供我们使用。

### set

我们可以指定 c++ 的版本，如下所示：

```cmake
set(CMAKE_CXX_STANDARD 11)
```

当然我们还有基础的方法：

```cmake
if(COMPILER_SUPPORTS_CXX11)#
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
elseif(COMPILER_SUPPORTS_CXX0X)#
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++0x")
else()
    message(STATUS "The compiler ${CMAKE_CXX_COMPILER} has no C++11 support. Please use a different C++ compiler.")
endif()
```

### target_compile_features

其用法如下，我们设置了 `cxx_auto_type` 这个 feature：

```cmake
target_compile_features(hello_cpp11 PUBLIC cxx_auto_type)
```

在执行 `cmake ..` 的时候，我们可以看到打印：

```cmake
message("List of compile features: ${CMAKE_CXX_COMPILE_FEATURES}")
```

```bash
List of compile features: cxx_template_template_parameters;cxx_alias_templates;...
```

就是说，我们的所有 feature 都是保存在了 `CMAKE_CXX_COMPILE_FEATURES` 这个变量中。

### message 

有的时候我们需要打印出一些变量来用于调试，我们可以使用 `mesage()` 来实现：

```cmake
cmake_minimum_required(VERSION 3.5)

# Set the project name
project (hello_cmake)

# print project name variable
message ("project name is ${PROJECT_NAME}")

# Add an executable
add_executable(hello_cmake main.cpp)
```

其输出如下所示：

```shell
project name is hello_cmake
```



## Compiler Option

### clang

CMake exposes options to control the programs used to compile and link your code. These programs include:

- CMAKE_C_COMPILER - The program used to compile c code.
- CMAKE_CXX_COMPILER - The program used to compile c++ code.
- CMAKE_LINKER - The program used to link your binary.

（如果要进行验证，首先安装 clang: `sudo apt-get install clang-3.6`）

```cmake
cmake .. -DCMAKE_C_COMPILER=clang-3.6 -DCMAKE_CXX_COMPILER=clang++-3.6
```

### ninja

我们可以指定构建工具进行构建，如 ninja:

```bash
cmake .. -G Ninja
```

```bash
$ ls
CMakeCache.txt  CMakeFiles  build.ninja  cmake_install.cmake  hello_cmake  rules.ninja
```

## Sub Projects

### add_subdirectory

其用法如下：

```cmake
add_subdirectory(sublibrary1)
add_subdirectory(sublibrary2)
add_subdirectory(subbinary)
```

为了加深理解，我们给出这个含有子目录的文件结构：

```xml
.
|-- CMakeLists.txt
|-- README.adoc
|-- subbinary
|   |-- CMakeLists.txt
|   `-- main.cpp
|-- sublibrary1
|   |-- CMakeLists.txt
|   |-- include
|   |   `-- sublib1
|   |       `-- sublib1.h
|   `-- src
|       `-- sublib1.cpp
`-- sublibrary2
    |-- CMakeLists.txt
    `-- include
        `-- sublib2
            `-- sublib2.h
```

可以看到，和 Cmake 文件同在一个路径的有 subbinary， subbinary1 和 subbinary2 三个，所以我们 add_subdirectory 使用了三个。

其更加稳妥的用法如下：

```cpp
if(EXISTS ${PRJ_TOP_DIR}/src)
  add_subdirectory(src)
endif()
```


## Reference

[^1]: <https://github.com/ttroy50/cmake-examples>
[^2]: <https://cmake.org/cmake/help/latest/guide/tutorial/index.html>
[^3]: [Useful Variables](https://gitlab.kitware.com/cmake/community/-/wikis/doc/cmake/Useful-Variables)

