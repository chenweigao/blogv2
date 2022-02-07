---
title: Some Tools
date: 2021-09-04
tags:
 - tools
categories:
 -  Tools
---

## on-my-zsh

```bash
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

要是 curl 失败的话可以手动下载下来 install.sh 然后执行，其主题的配置文件在 ` ~/.zshrc` 下面。

github 链接是 [https://github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)

## bpytop

https://github.com/aristocratos/bpytop

很好看的资源监控终端

```bash
pip3 install bpytop --upgrade
```

安装之前确保安装了 `psutil` 模块。

也可以参考 `tiptop`, 但是目前还不支持 WSL: https://github.com/nschloe/tiptop
