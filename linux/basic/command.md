
---
title: Linux Command
date: 2023-07-19
category:
 - Linux
 - Kernel

---



本文主要记录常见的 Linux 命令，特别是那些经常遇到但是容易忘记的命令用法。

<!-- more -->

## scp

SCP（Secure Copy）是一个在计算机之间安全传输文件的命令行工具，它使用 SSH 协议进行加密传输。以下是 SCP 的用法：

1. 从本地到远程：将本地文件复制到远程服务器。

   ```shell
   scp [选项] <本地文件路径> <远程用户名@远程主机地址:目标路径>
   ```

   示例：

   ```shell
   scp /path/to/local/file.txt username@remote:/path/on/remote/
   ```

2. 从远程到本地：将远程服务器上的文件复制到本地。

   ```shell
   scp [选项] <远程用户名@远程主机地址:源文件路径> <本地目标路径>
   ```

   示例：

   ```shell
   scp username@remote:/path/to/remote/file.txt /path/on/local/
   ```

3. 复制整个目录：使用 `-r` 选项来递归复制整个目录。

   ```shell
   scp -r [选项] <源目录路径> <目标目录路径>
   ```

   示例：

   ```shell
   scp -r username@remote:/path/to/remote/directory /path/on/local/
   ```

4. 指定端口号：如果 SSH 服务器监听的端口不是默认的 22 号端口，可以使用 `-P` 选项指定端口号。

   ```shell
   scp -P <端口号> [选项] <源文件路径> <目标路径>
   ```

   示例：

   ```shell
   scp -P 2222 /path/to/local/file.txt username@remote:/path/on/remote/
   ```

以上就是 SCP 的基本用法，通过 SCP 可以实现在本地和远程服务器之间安全地传输文件。

## 压缩/解压缩

在 Linux 中，你可以使用不同的命令和工具来进行文件和目录的压缩和解压缩。下面是一些常用的命令和工具：

1. 压缩文件/目录：

   - Gzip：使用 gzip 命令压缩文件，生成以 `.gz` 结尾的压缩文件。

     ```
     shell复制代码gzip <文件名>
     ```

   - Tar：使用 tar 命令创建归档文件，并结合其他压缩工具（如 gzip 或 bzip2）进行压缩。

     ```
     shell复制代码tar czf <压缩文件名.tar.gz> <要压缩的文件/目录>
     ```

     可选的压缩工具有：

     - `z`：使用 gzip 压缩文件，生成 `.tar.gz` 文件。
     - `j`：使用 bzip2 压缩文件，生成 `.tar.bz2` 文件。
     - `J`：使用 xz 压缩文件，生成 `.tar.xz` 文件。

2. 解压缩文件/目录：

   - Gzip：使用 gzip 命令解压缩 `.gz` 文件。

     ```shell
     gzip -d <文件名.gz>
     ```

   - Tar：使用 tar 命令解压缩 `.tar` 文件。

     ```shell
     tar xf <压缩文件名.tar>
     ```

     如果压缩文件是经过 gzip、bzip2 或 xz 压缩的，你可以使用相应的解压缩工具结合 tar 使用。例如，解压缩 `.tar.gz` 文件：

     ```shell
     tar xzf <压缩文件名.tar.gz>
     ```

3. 压缩和解压缩组合操作：

   如果你想在一个命令中同时进行压缩和解压缩操作，可以使用管道（pipe）来将多个命令连接起来。

   - 压缩一个目录并将其打包为 tar 文件，并通过 gzip 进行压缩：

     ```shell
     tar cf - <目录> | gzip > <压缩文件名.tar.gz>
     ```

   - 解压缩一个经过 gzip 压缩的 tar 文件：

     ```shell
     gunzip -c <压缩文件名.tar.gz> | tar xf -
     ```

这些是一些常用的 Linux 压缩和解压缩命令和工具。根据你的需求和压缩文件的类型，选择合适的命令和选项来进行操作。
