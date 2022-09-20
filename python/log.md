# logging



## Abstract

Python 自带了 `logging` 模块，可以很方便我们进行日志打印。本文章主要总结几个使用该模块的时候需要注意的问题和实战示例。

其基本的使用方法如下：

```python
>>> import logging
>>> logging.warning('Watch out!')
WARNING:root:Watch out!
```



## Log level

Python 的日志可以分为几个级别：

| Task                                                        | Level for task                                               |      |
| ----------------------------------------------------------- | ------------------------------------------------------------ | ---- |
| console 级别                                                | `print()`                                                    |      |
| events that occur during normal operation of a program      | `logging.info()` or `logging.debug()`                        |      |
| Issue a warning regarding a particular runtime event        | `logging.warn()`                                             |      |
| Report an error                                             | Raise Exception                                              |      |
| Report suppression of an error without raising an exception | `logging.error()` or `logging.exception` or `logging.critical()` |      |

The logging functions are named after the level or severity of the events they are used to track. The standard levels and their applicability are described below (in increasing order of severity):

| Level      | When it’s used                                               |
| :--------- | :----------------------------------------------------------- |
| `DEBUG`    | Detailed information, typically of interest only when diagnosing problems. |
| `INFO`     | Confirmation that things are working as expected.            |
| `WARNING`  | An indication that something unexpected happened, or indicative of some problem in the near future (e.g. ‘disk space low’). The software is still working as expected. |
| `ERROR`    | Due to a more serious problem, the software has not been able to perform some function. |
| `CRITICAL` | A serious error, indicating that the program itself may be unable to continue running. |

The default level is `WARNING`, which means that only events of this level and above will be tracked, unless the logging package is configured to do otherwise.

​	

## Logging to a file

### to file

如果我们想将日志打印到文件中，则需要进行日志的配置，配置的方法如下：

```python
import logging
logging.basicConfig(filename='example.log', encoding='utf-8', level=logging.DEBUG)
```

注意到这个配置只需要配置一次就全局生效了，具体来说，只有第一的调用是生效了的。

### to console

如果我们想打印到控制台的话，可以使用如下的配置：

```python
logging.basicConfig(stream=sys.stdout, level=logging.INFO)
```

:::tip 💚💚💚在命令行中指令日志的打印级别

可以使用 `--log=INFO` 来制定日志的打印级别。

:::

## Logging Format

在使用 `logging` 模块的时候，遇到了要打印多个参数但是报错的问题，针对这个问题，我们使用标准的 `format` 语法，可以避免错误，如下：

```python
logging.info('pattern {} similar res is {}, write to file...'.format(pattern_1, res))
```

相比于 `%d` 的方式，上述的方式较新。

## Logging in different plarform

我们可以同一套代码在不同的平台使用不同的日志配置，如下所示：

```python
if platform.system() == 'Linux':
    logging.basicConfig(filename='wechat_sendmessage_st_021.log', level=logging.INFO)
    logging.info('you are in linux, confining the linux sys config...')
    s.file_split = '/srv/workspace/workcode/tmpfile/wechat_sendmessage_st_021.txt'
    worker_count = 8
else:
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
    logging.info('you are in windows, confining the windows sys config...')
    s.file_split = '../../oat/trace_converted/wechat_sendmessage_st_021.txt'
    worker_count = 4
```

上面代码，我们在 windows 环境下面使用控制台输出，而在 Linux 下面使用文件输出。

