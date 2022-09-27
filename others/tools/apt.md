---
title: apt
date: 2018-09-08
---

# apt source

Source:[USTC](http://mirrors.ustc.edu.cn/)

```bash
sudo vim /etc/apt/source.list
```

or use the command:

```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
```

For Kali Linux:

```bash
deb https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
```

For more information [USTC Open Source](http://mirrors.ustc.edu.cn/)

Finally:

`sudo apt-get update`



