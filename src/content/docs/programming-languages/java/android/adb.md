---
title: Adb Command And Script
shortTitle: Adb
date: 2023-01-12
tag:
 - adb
category:
 - Android

---

## Base

### devices

查看是否连接成功[^1]

```shell
adb devices
```

### 锁定、解锁

```shell
adb shell input keyevent 26

adb shell input keyevent 82
```

:::tip keyevent 26

keyevent 26 表示的是**按下电源按钮**，所以说如果我们手机屏幕状态是打开的话，会导致屏幕状态切换为开启状态，针对这个情况，我们可以在脚本中使用判断：

```powershell
for /f "tokens=*" %%a in ('adb -s %serial_no% shell "dumpsys deviceidle | grep mScreenOn"') do set screen_state=%%a

if "%screen_state%" == "mScreenOn=true" (
    echo %screen_state% is on
	adb -s %serial_no% shell input keyevent 82
) else (
    echo %screen_state% is off
	adb -s %serial_no% shell input keyevent 26
	adb -s %serial_no% shell input keyevent 82
)
```

如果屏幕状态是开启的话，我们就直接点解锁；否则的话，我们开启屏幕再解锁。
:::


### 重启、关机

```bash
adb shell reboot # 重启

adb shell reboot -p # 关机
```

### 蓝牙

```bash
adb shell service call bluetooth_manager 6 # 打开蓝牙

adb shell service call bluetooth_manager 9 # 关闭蓝牙
```

### Wi-Fi

```shell
adb shell svc wifi enable # 打开wifi

adb shell svc wifi disable # 关闭wifi

# 打开wifi设置界面

adb shell am start -a android.intent.action.MAIN -n com.android.settings/.wifi.WifiSettings
```

## APP

### 安装、删除

```bash
adb install abc.apk # 第一次安装。如果手机上已经有此app,则会报错。

adb uninstall com.example.appname
```

### 获取 APP Activity

1. 手动打开 APP

2. 使用 adb 命令：

   ```bash
   adb shell dumpsys window | grep mCurrentFocus
   
   # or
   dumpsys window | grep mCurrentFocus
   ```

3. 此时可以看到输入类似于下面：

   *mCurrentFocus=Window{a4d3e62 u0 **com.example.myapplication/com.example.myapplication.MainActivity**}*

   其中以 `com.xxx` 那一段就是 APP 的 Activity.

   :::tip

   该方法如果想知道 APP 的包名，使用方法是：`pm list package -3` 列出所有应用，其中 `-3` 表示列举出第三方应用。

   但是通常而言，我们打开该 APP 并执行命令，是能够从 Activity 的前半部分得到包名的。

   :::

### 启动 APP

```bash
adb shell am start -n com.package.name/com.package.name.MainActivity

adb shell am start -n com.package.name/.MainActivity
```

举例：启动抖音

```bash
adb shell am start -n com.ss.android.ugc.aweme/com.ss.android.ugc.aweme.splash.SplashActivity
```

### 关闭 APP

```bash
adb shell am force-stop com.some.package
```

:::warning

`force-stop` 后面跟着的是 APP 的包名，而 `start` 后面是 APP 的 activity.

:::

### 获取 Pid

很多时候，我们需要获取到 APP 进程对应的 PID，当我们知道 APP 的包名的时候，一切都变得非常简单：

```bash
adb shell pidof package_name
```

:::details bat script example

这是一个关于如何获取 PID 的 bat script 例子：

```powershell
@echo off
set /p serial_no=<./serial_no.txt
echo serial_no is %serial_no%

set PACKAGE_NAME=com.example.myapplication

for /f "tokens=*" %%a in ('adb -s %serial_no% shell  pidof %PACKAGE_NAME%') do set PID=%%a

if "%PID%"=="" (
  echo Error: %PACKAGE_NAME% is not running
  exit /b 1
)

echo PID of %PACKAGE_NAME% is %PID%
```

:::

### 获取 Tid

我们在知道 Pid 和我们的线程名称的时候，可以很轻松地获取到线程的 Tid:

```powershell
set thread_name=HeapTaskDaemon
for /f "tokens=3" %%a in ('adb -s %serial_no% shell "ps -T -p %PID% | grep %thread_name%"') do set tid=%%a
```

## Tap and Slide

### slide

```bash
adb shell input touchscreen swipe 930 880 930 380 # 向上滑

adb shell input touchscreen swipe 930 880 330 880 # 向左滑

adb shell input touchscreen swipe 330 880 930 880 # 向右滑

adb shell input touchscreen swipe 930 380 930 880 # 向下滑
```

### tap

```bash
adb shell input mouse tap 100 500
```

## Other Skill

### 等待设备重启

如果想等到设备重启完成以后再进行下一步操作，可以在 adb 命令之间增加：

```bash
adb wait-for-device
```

经过实测，后面的命令会等到设备重启完成之后再执行。

### 写 SN

1、执行命令进入fastboot：adb reboot bootloader
2、fastboot getvar nve:SN@12345678  @后面为想要修改成为的SN编号

3、fastboot reboot 重启 

4、查看单板SN号是否修改成功：adb devices

写完之后进行验证：

```bash
adb devices
fastboot devices
adb shell "getprop ro.serialno"
```

## Push Path

对于一些情况，我们可能需要 push 进去文件完成更新，所以这一节对此做出列举。

### art

如果要推送 art, 其实现如下：

```bash
adb remount
adb push .\lib64\libart.so /system/apex/com.android.art.debug/lib64/libart.so
adb push .\lib\libart.so /system/apex/com.android.art.debug/lib/libart.so
adb reboot
pause
```

如果要推送 apex 包，其实现如下（编译产物 `com.android.art.apex`）：

```bash
adb shell rm /cache/overlay/system/upper/apex/com.android.art.apex
adb reboot

adb wait-for-device

adb remount
adb push com.android.art.apex /system/apex/
adb reboot
```



:::details 增加上设备序列号的推送程序

```bash
set /p serial_no=<./serial_no.txt
echo serial_no is %serial_no%

adb -s %serial_no% remount
adb -s %serial_no%  push .\lib64\libart.so /system/apex/com.android.art.debug/lib64/libart.so
adb -s %serial_no%  push .\lib\libart.so /system/apex/com.android.art.debug/lib/libart.so
adb -s %serial_no%  reboot

adb -s %serial_no% wait-for-device

adb -s %serial_no% shell "getprop ro.serialno"

pause
```

:::

 

[^1]: [安卓自动化工具(附自动刷抖音脚本实例)](http://static.kancloud.cn/mhsm/dyzsfx/2381667)
