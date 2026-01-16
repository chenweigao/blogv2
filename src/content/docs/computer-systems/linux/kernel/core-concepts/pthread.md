---
title: Pthread
date: 2025-03-19
---

## 1. pthread_cond_timedwait

### 1.1. 什么是 pthread?

pthread（POSIX Threads）是一组用于多线程编程的 API，提供了一套标准化的线程创建、同步和管理的机制，主要用于类 Unix 操作系统（如 Linux 和 macOS）。它允许程序在多个线程之间并行执行任务，提高程序的并发性和性能。


### 1.2. pthread_cond_timedwait 主要做什么？


`pthread_cond_timedwait` 是 pthread 提供的一个用于**线程同步**的函数，它的主要作用是：

让当前线程等待一个**条件变量（condition variable）** 满足某个条件，并在指定的时间内阻塞（超时机制）。

如果在超时时间内，条件变量被其他线程**唤醒**，线程会继续执行。

如果超时时间到了仍然没有被唤醒，线程会返回超时错误（ETIMEDOUT）。

  
### 1.3. 函数原型

```
#include <pthread.h>
#include <time.h>

int pthread_cond_timedwait(pthread_cond_t *restrict cond, 
                           pthread_mutex_t *restrict mutex, 
                           const struct timespec *restrict abstime);
```

**参数**：

- `cond`：指向**条件变量**的指针。

- `mutex`：指向**互斥锁（mutex）** 的指针，必须在调用 `pthread_cond_timedwait` 之前加锁。

- `abstime`：超时时间，格式为 `struct timespec`，表示**绝对时间**（不是相对时间）。

  
**返回值**：

- 0：成功（被唤醒）。

- ETIMEDOUT：超时，条件变量未被满足。

- 其他错误代码：如 EINVAL（无效参数）或 EPERM（线程未持有互斥锁）。

  

### 1.4. 基本用法

```c
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

void *thread_func(void *arg) {
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    ts.tv_sec += 5;  // 等待 5 秒

    pthread_mutex_lock(&mutex);
    printf("线程等待条件变量...\n");

    int ret = pthread_cond_timedwait(&cond, &mutex, &ts);
    if (ret == 0) {
        printf("线程被唤醒\n");
    } else {
        printf("等待超时\n");
    }

    pthread_mutex_unlock(&mutex);
    return NULL;
}

int main() {
    pthread_t thread;
    pthread_create(&thread, NULL, thread_func, NULL);

    sleep(2);  // 模拟某种条件满足
    pthread_mutex_lock(&mutex);
    pthread_cond_signal(&cond);  // 唤醒等待的线程
    pthread_mutex_unlock(&mutex);

    pthread_join(thread, NULL);
    return 0;
}
```

### 1.5. 关键点

• **必须持有 mutex 才能调用 pthread_cond_timedwait**，否则会导致未定义行为。

• **条件变量要与 mutex 配合使用**，防止多个线程同时检查和修改共享数据时出现竞争条件（race condition）。

• abstime 是**绝对时间**，所以要用 clock_gettime() 获取当前时间并加上超时时间。

  

### 1.6. 应用场景

• 线程等待某个事件发生，比如数据可用、任务完成。

• 需要设置超时机制的场景，例如网络超时、数据库超时、任务超时等。

这函数是 pthread_cond_wait 的**超时版本**，用于避免线程无限期阻塞。