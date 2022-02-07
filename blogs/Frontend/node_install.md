---
title: Node.js 安装和 yarn 包管理
date: 2019-9-17
tags:
 - node.js
 - frontend
 - yarn
categories:
 -  Frontend
---


## Install Node.js and npm@latest

在 Linux 下部署可能会存在一些问题，虽然安装方法很多，但是实践下来最好的方法是使用 apt:

1. 安装 node.js

```bash
sudo apt-get install nodejs-legacy
sudo apt-get install npm
```

2. 升级 npm 的版本：

```bash
sudo npm install npm@latest -g
```

3. 安装用于安装 node.js 的模块 n

```bash
sudo npm install n -g
```

4. 通过 n 模块安装指定的 node.js

```bash
sudo n latest
sudo n stable
sudo n lts
```

## Update yarn

如果想更新所有的 package.json 中的依赖到最新版本，则可以使用：

```bash
yarn upgrade-interactive --latest
```

需要手动选择升级的依赖包，按空格键选择，a 键切换所有，i 键反选选择。


## 安装 node-sass 的 bug 解决

Yarn 淘宝源安装，分别复制粘贴以下代码行到黑窗口运行即可

```bash
yarn config set registry https://registry.npm.taobao.org -g

yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```