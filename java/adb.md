---
title: Android ADB Command
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

### 启动 APP

```bash
adb shell am start -n com.package.name/com.package.name.MainActivity

adb shell am start -n com.package.name/.MainActivity
```

- 启动抖音

  ```bash
  adb shell am start -n com.ss.android.ugc.aweme/com.ss.android.ugc.aweme.splash.SplashActivity
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



 

[^1]: [安卓自动化工具(附自动刷抖音脚本实例)](http://static.kancloud.cn/mhsm/dyzsfx/2381667)
