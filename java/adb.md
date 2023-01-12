---
title: Android ADB Command
date: 2023-01-12
tag:
 - adb
category:
 - Android

---

## Base

1. 查看是否连接成功[^1]

   ```shell
   adb devices
   ```

2. 锁定、解锁

   ```shell
   adb shell input keyevent 26
   
   adb shell input keyevent 82
   ```

   

3. 重启、关机

   ```bash
   adb shell reboot # 重启
   
   adb shell reboot -p # 关机
   ```

4. 蓝牙

   ```bash
   adb shell service call bluetooth_manager 6 # 打开蓝牙
   
   adb shell service call bluetooth_manager 9 # 关闭蓝牙
   ```

5. WiFi

   ```bash
   adb shell svc wifi enable # 打开wifi
   
   adb shell svc wifi disable # 关闭wifi
   
   # 打开wifi设置界面
   
   adb shell am start -a android.intent.action.MAIN -n com.android.settings/.wifi.WifiSettings
   ```

## APP

1. 安装、删除

   ```bash
   adb install abc.apk # 第一次安装。如果手机上已经有此app,则会报错。
   
   adb uninstall com.example.appname
   ```

2. 启动 APP

   ```bash
   adb shell am start -n com.package.name/com.package.name.MainActivity
   
   adb shell am start -n com.package.name/.MainActivity
   ```

   - 启动抖音

     ```bash
     adb shell am start -n com.ss.android.ugc.aweme/com.ss.android.ugc.aweme.splash.SplashActivity
     ```

     

## Tap and Slide

1. slide

   ```bash
   adb shell input touchscreen swipe 930 880 930 380 # 向上滑
   
   adb shell input touchscreen swipe 930 880 330 880 # 向左滑
   
   adb shell input touchscreen swipe 330 880 930 880 # 向右滑
   
   adb shell input touchscreen swipe 930 380 930 880 # 向下滑
   ```

2. tap

   ```bash
   adb shell input mouse tap 100 500
   ```

   

 

[^1]: [安卓自动化工具(附自动刷抖音脚本实例)](http://static.kancloud.cn/mhsm/dyzsfx/2381667)
