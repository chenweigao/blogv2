---
title: Bat Script
date: 2023-02-11
tag:
 - script
category:
 -  Tools


---

## Basic

### 重命名(Move)文件夹

如果想按照日期来重命名文件夹的话，可以使用如下的方式：

```powershell
for /f %%a in ('powershell -Command "Get-Date -format yyyyMMdd_HHmm_ss"') do set datetime=%%a
move anr\anr anr\anr_%datetime%
```

注意使用 `move`， 使用 `ren` 会失败。

## Usage: Android

这个章节介绍使用 bat 脚本来进行安卓 adb 的一些操作，主要是一些实例，方便日后需要的时候进行查阅。

### 滑动屏幕

```bat
@echo off

rem Set the duration of the slide in milliseconds
set duration=1000

rem Get the width and height of the screen
for /f "tokens=2 delims=:" %%a in ('adb shell wm size') do set screen_size=%%a
set /a width=%screen_size:~0,4%
set /a height=%screen_size:~5,4%

rem Calculate the x and y coordinates for the start and end points of the slide
set /a x1=%width% / 2
set /a x2=%x1%
set /a y1=%height% / 4
set /a y2=%height% / 4 * 3

rem Perform the slide 300 times
set count=0
:loop
adb shell input swipe %x1% %y1% %x2% %y2% %duration%
set /a count=%count% + 1
if %count% equ 300 goto end
goto loop

:end
```

## Usage: With Python

### 在 bat 中使用 Python 脚本

@todo



## for loop

```powershell
for /f "tokens=3" %%a in ('adb -s %serial_no% shell "ps -T -p %pid% | grep HeapTaskDaemon"') do set tid=%%a
```

在上面的命令中，我们使用了 `for` 循环来检验命令输出，并设置给变量。`token=3` 表示的含义是：以空格分隔的第 3 个变量。

如果我们需要使用多个变量，那么可以这么写：

```powershell
for /f "tokens=3,4 delims=," %%a in ('adb -s %serial_no% shell "ps -T -p %pid% | grep HeapTaskDaemon"') do (
    set tid=%%a
    set tmp=%%b
)
```

在这个例子中，我们设置了两个变量，并且使用了分隔符，默认的分隔符是空格，可以加以注意。

## timeout

如果我们想防止脚本被意外的按键终结，可以增加以下的 `timeout` 命令：

```powershell
timeout /nobreak /t 5 > nul
```

如果说需要按任意按键跳过的，则可以如下实现：

```powershell
TIMEOUT /T 90
```
