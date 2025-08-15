---
title: virtualenv&Visdom
date: 2019-12-20
---

## 1. 虚环境

安装 Python3 虚环境

```python
virtualenv -p python3 envname
virtualenv -p python3 envname
```

启动使用：

```bash
source racv/bin/activate
```

http://201.117.21.195/

### 1.1. 标准启动方式

根据书籍《Black.Hat.Python.2nd.Edition.2021.4》介绍的，可以用如下的顺序正确使用虚环境。

```shell
sudo apt-get install python3-venv
```

安装完成以后：

```bash
mkdir bhp
cd bhp
python3 -m venv venv3
source venv3/bin/active
```

在 python 环境中，还可以用 pip 搜索包：

```bash
pip search hashcrack
```

如果是在 windows 中，尝试使用 pip 安装虚环境：

```bash
pip install virtualenv -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
pip install virtualenvwrapper-win
```

然后新建一个虚环境：

```bash
mkvirtualenv my-first-env
```

使用这个 env:

```shell
workon my-first-env
```

如果要退出当前的虚环境：

```bash
deactivate
```

如果要删除这个 env:

```bash
rmvirtualenv my-first-env
```


## 2. 远程访问 Visdom

重定向 8097 端口到本地：

```python
ssh -L 18097:127.0.0.1:8097 username@remote_server_ip
```

在服务器上启动 visdom server：

```python
python3 -m visdom.server
```

查看 GPU 的信息：

```bash
nvidia-smi
```

## 3. 查看 Python 路径

有的时候我们可能需要查看一下 python 的安装路径，可以使用如下的方法：

```bash
python
>>> import sys
>>> sys.path
```

## 4. 设置 pip 源

### 4.1. windows 

直接在 user 目录中创建一个 pip 目录，而后创建一个 `pip.ini` 文件：

```ini
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

### 4.2. linux

修改 ~/.pip/pip.conf (没有就创建一个)。