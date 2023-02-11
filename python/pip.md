# pip

## 临时指定
```bash
pip install pythonModuleName -i https://pypi.douban.com/simple
```

## 永久指定

### windows

在 c:/windows/user/your-name/pip/ 下，新建文件 `pip.ini`:

```bash
[global]
trusted-host=mirrors.tools.huawei.com
index-url=http://mirrors.tools.huawei.com/pypi/simple/
```

如果找不到这个文件夹，就新建一个。

在有些 winodws 电脑中，可能不是这个文件夹，那么快速找到这个文件夹的方法是：在 windows 的资源管理器中输入 `%APPDATA%`, 会跳转到一个文件夹下，然后在这个文件夹下面新建 pip 文件夹，然后新建 `pip.ini` 文件，输入一下内容：

```bash
[global]
timeout = 6000
index-url = https://pypi.douban.com/simple
trusted-host = pypi.douban.com
```

### Linux

在 ~/.pip/ 下创建 `pip.conf`:

```nginx
[global] 
trusted-host=mirrors.tools.huawei.com
index-url=http://mirrors.tools.huawei.com/pypi/simple/ 
```
