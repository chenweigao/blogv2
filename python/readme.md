---
title: Python
---

# Python

> Python’s simplicity lets you become productive quickly, but this often means you aren’t using everything it has to offer.  With this hands-on guide, you’ll learn how to write effective, idiomatic Python code by leveraging its best—and possibly most neglected—features. Author Luciano Ramalho takes you through Python’s core language features and libraries, and shows you how to make your code shorter, faster, and more readable at the same time.

## Install

### Linux

1. 在 Python 官网下载 tar 包，然后解压
2. 安装必要的库
3. 按照教程[^1]进行安装

```bash
sudo apt-get install build-essential checkinstall libreadline-gplv2-dev libncursesw5-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev
```

```bash
./configure
make
make install
```

执行以上操作后，Python 会安装在 `/usr/local/bin` 目录中，Python 库安装在 `/usr/local/lib/pythonXX`，XX 为你使用的 Python 的版本号

### openssl install

如果遇到了报错，如 opsnssl 版本不正确的话，需要参考这个解决方案[^2]；我们在此对其做一个简单的总结：

1. 下载 openssl 的安装包，并解压
2. 安装 openssl
3. 配置 python 安装时 openssl 路径

其对应的命令如下：

```bash
tar xz openssl-xxx.tar.gz
cd openssl-xxx
./config shared --prefix=/usr/local/
sudo make
sudo make install
```

注意到以上的步骤仅仅是一个示意和参考，其本质就是安装 openssl.

而后创建文件夹并执行：

```bash
mkdir lib
cp ./*.{so,so.1.0.0,a,pc} ./lib
```

需要注意 `so.1.0.0` 替换成自己 openssl 的版本号。

如果安装 openssl  成功之后，我们可以进行 Python 的安装：

```bash
./configure --with-openssl=/usr/src/openssl-1.0.2o --enable-optimizations
make
make install
```

注意 `/usr/src/openssl-1.0.2o` 路径的替换。

### venv

我们此时就可以使用新版的 Python 来创建我们的虚环境了[^3]:

```bash
/usr/local/bin/python3.10 -m venv myvenv
```

然后启动虚环境：

```bash
source myvenv/bin/activate
```





[^1]: [菜鸟教程](https://www.runoob.com/python/python-install.html) 
[^2]: [解决 openssl 版本过低安装失败的问题](https://stackoverflow.com/questions/53543477/building-python-3-7-1-ssl-module-failed)
[^3]: [Virtual Environments and Packages](https://docs.python.org/3/tutorial/venv.html) 

