---
title: Bat Script
date: 2023-02-11
tag:
 - script
category:
 -  Tools
---

## Basic


@todo

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