---
title: Python AI Profiling
date: 2025-06-27
category:
  - Python
  - AI
---

## 1. Python 解释器劫持

### 1.1. site-packages 和 dist-packages

Python 的 site-package 和 dist-package 有什么区别？

在 Python 生态中，`site-packages` 和 `dist-packages` 都是用来存放第三方库（即用 pip、conda、apt、源码等方式安装包的地方） 的目录，但它们有以下区别和联系：

**site-packages**:

**定义**：`site-packages` 是 Python 官方默认用于存放第三方库的目录。

**标准化**： 是 Python [标准库 site 模块](https://docs.python.org/3/library/site.html)支持的标准路径，几乎所有平台与发行版默认都包含该目录。

**典型路径**：
  - Windows: `PythonXY\Lib\site-packages\`
  - macOS/Linux: `/usr/local/lib/pythonX.Y/site-packages/`(系统Python) 或虚拟环境目录下
- **pip、setuptools、conda** 默认都向此路径装包。

**dist-packages**:

**定义**：  `dist-packages` 并非 Python 官方标准目录，而是**Debian/Ubuntu 等 Linux 发行版引入**的用于区分系统级包（如 `apt` 安装）和用户/第三方包（如通过 `pip` 或源码手动装包） 的目录。

**目的**：  避免系统包和用户装包冲突。这样用系统包管理器安装的 python 库放在 `dist-packages`，而通过 pip/user 装的放在 `site-packages`。

**典型路径**：`/usr/lib/pythonX.Y/dist-packages/`
- **dpkg/apt/rpm** 这类系统包管理安装的库（如 `apt install python3-requests`）会被放到此目录。

实际区别

- **主流场景**：
  - **非 Debian/Ubuntu**：只有 `site-packages`，一切包都装这里。
    - **Debian/Ubuntu**：分两类目录，可并存，Python 会自动把两者都加到 `sys.path`，都能 import，但用途分工不同。
- **优先级**：
  - 有时候 `site-packages` 会排在 `dist-packages` 之前（取决于具体 sys.path 顺序），用户包优先。
- **冲突风险**：
  - 若同时存在同名库，`sys.path` 中先出现的目录里的包会被 import，其余目录下会被覆盖。

**总结对比如下：**

|      | site-packages (标准)                        | dist-packages (类 Unix)              |
| ---- | ----------------------------------------- | ----------------------------------- |
| 用途   | 官方标准第三方库路径                                | Debian/Ubuntu 系统包的专用目录              |
| 影响范围 | 各个平台/环境通用                                 | 主要在 Ubuntu/Debian 及衍生系统             |
| 管理者  | pip/conda/setuptools/源码安装                 | apt/dpkg/rpm/系统包管理                  |
| 位置   | `/usr/local/lib/pythonX.Y/site-packages/` | `/usr/lib/pythonX.Y/dist-packages/` |
| 冲突   | 只此一处容易被用户覆盖                               | 容易与 site-packages 存在包版本冲突           |

**总结：**

- `site-packages` 是跨平台 Python 第三方包的通用目录
- `dist-packages` 主要是 Debian/Ubuntu 等为系统包和用户包分离而引入的专用目录，两者都在 sys.path 里，均可 import，实际工作中优先装到虚拟环境或用 pip 管理，以避免冲突。