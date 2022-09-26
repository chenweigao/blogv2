---
index: -1

---

# Python

@todo

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

如果遇到了报错，如 opsnssl 版本不正确的话，需要参考这个解决方案[^2]



[^1]: [菜鸟教程](https://www.runoob.com/python/python-install.html)
[^2]: [解决 openssl 版本过低安装失败的问题](https://stackoverflow.com/questions/53543477/building-python-3-7-1-ssl-module-failed)
