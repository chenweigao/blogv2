---
title: Binder Phases
date: 2023-06-25
tag:
 - kernel
 - Android
 - Binder
category:
 - Android
---



本文主要讲述 Binder 流程中的各个阶段，起到一个 Overview 的目的。

<!-- more -->

## Phases Overview

我们想对 binder 做性能优化（这块部分如果后续较为完善的话可以考虑独立出去），可以从几个 phase 进行分解：

- 🐇🐇 phase 1: app to BpBinder: 从 app 到 Binder 客户端。
- phase 2: BpBinder to driver
- phase 3: driver send logic
- 🐇🐇 phase 4: driver to BBinder 
- 🐇🐇 phase 5: BBinder to server
- phase 6: server logic
- phase 7: server back BBinder
- phase 8: BBinder back driver
- phase 9: driver reply logic
- phase 10: driver back BpBinder
- phase 11: BpBinder back app

为方便理解，我们引用下面的图来进行参考说明。

![binder phases](http://gityuan.com/images/binder/binder_start_service/binder_ipc_arch.jpg)



## Phase 1

**App to BpBinder**, 图中的 AMP clinet 到 BpBinder 的过程，这个过程主要发生了以下事情：

在 APP 侧，调用 `startService()`,  在调用该函数之间，会调用到其他的逻辑，我们分别给出一个 OHOS 的示例和 Android 的示例。

### OHOS

列举了两种方式：期约和回调函数。

```javascript
import rpc from "@ohos.rpc"
// 使用期约

let option = new rpc.MessageOption()
let data = rpc.MessageParcel.create()
let reply = rpc.MessageParcel.create()
// 往 data 里写入参数

proxy.sendRequest(1, data, reply, option)
    .then(function (result) {
        if (result.errCode != 0) {
            console.error("send request failed, errCode: " + result.errCode)
            return
        }
        // 从result.reply里读取结果
    })
    .catch(function (e) {
        console.error("send request got exception: " + e);
    })
    .finally(() => {
        data.reclaim()
        reply.reclaim()
    })
```

使用期约的情况下，客户端完成了几件事情。首先是往 Parcel 对象中写入参数，而后是调用 proxy 的 sendRequest 方法，得到服务端的回复后进行处理。

我们所说的 App to BpBinder 的过程就是：客户端数据封装 –> 调用 BpBinder(在 OHOS 中称作 Proxy) 提供的方法。



```javascript
// 使用回调函数
function sendRequestCallback(result) {
            try {
                if (result.errCode != 0) {
                    console.error("send request failed, errCode: " + result.errCode)
                    return
                }
                // 从 result.reply 里读取结果
            } finally {
                result.data.reclaim()
                result.reply.reclaim()
            }
        }
let option = new rpc.MessageOption()
let data = rpc.MessageParcel.create()
let reply = rpc.MessageParcel.create()

// 往 data 里写入参数
proxy.sendRequest(1, data, reply, option, sendRequestCallback)
```

使用回调函数的过程较为简单，直接是封装数据 –> 发送请求（在我们 phase 1 的过程中）

### Android

```java
public ComponentName startService(IApplicationThread caller, 
                                  Intent service, String resolvedType, 
                                  String callingPackage, int userId) 
    throws RemoteException {
    // 获取或创建 Parcel 对象
    Parcel data = Parcel.obtain();
    Parcel reply = Parcel.obtain();
    data.writeInterfaceToken(IActivityManager.descriptor);
    data.writeStrongBinder(caller != null ? caller.asBinder() : null);
    service.writeToParcel(data, 0);
    // 写入 Parcel 数据
    data.writeString(resolvedType);
    data.writeString(callingPackage);
    data.writeInt(userId);

    // 通过 Binder 传递数据
    mRemote.transact(START_SERVICE_TRANSACTION, data, reply, 0);
    // 读取应答消息的异常情况
    reply.readException();
    // 根据 reply 数据来创建 ComponentName 对象
    ComponentName res = ComponentName.readFromParcel(reply);

    data.recycle();
    reply.recycle();
    return res;
}
```

和 JS 的过程基本上一致，挑选其中一些细节进行说明：

➡️➡️ Parcel.obtain() 完成了什么事情？从缓存池中获取一个 Parcel 对象。

```java
public static Parcel obtain() {
    // sOwnedPool 为 Parcel 对象的缓存池
    final Parcel[] pool = sOwnedPool;
    synchronized (pool) {
        Parcel p;
        // POOL_SIZE = 6
        for (int i=0; i<POOL_SIZE; i++) {
            p = pool[i];
            if (p != null) {
                pool[i] = null;
                return p;
            }
        }
    }
    //当缓存池没有现成的 Parcel 对象，则直接创建
    return new Parcel(0);
}
```

关于 Parcel 对象的创建，我们留到 **Pracel** 章节进行详细说明。

### Phase 1 Summary

🩸🩸 从上面上个场景的代码分析我们可以看出来，主要的操作耗时还是在 Pracel 过程中。在后续的研究中，我们可以看到 Pracel 对象的创建和 native world 也是息息相关的，所以这一个 phase 是存在一些优化的空间在的。

## Phase 2

**BpBinder to driver**, 这个过程主要是从客户端 native 到 driver 的过程。

### OHOS

从上文我们了解到，客户端会调用 proxy 的 sendRequest 方法，对应的实现如下：

```cpp
```



### Android

从上文我们了解到，客户端调用到 native 是通过 mRemote.transact 来实现的，该方法的实现如下：

```java
final class BinderProxy implements IBinder {
    public boolean transact(int code, Parcel data, Parcel reply, int flags) 
        throws RemoteException {
        //用于检测 Parcel 大小是否大于 800k
        Binder.checkParcel(this, code, data, "Unreasonably large binder buffer");
        // 调用 native
        return transactNative(code, data, reply, flags);
    }
}
```

这个方法的功能非常简单，主要完成对 native 方法 **transactNative** 的调用。

:::note transactNative 参数

mRemote.transact() 方法中的 

- code: START_SERVICE_TRANSACTION,
- data 保存 `descriptor`，`caller`,  `intent`,  `resolvedType`,  `callingPackage`, `userId`这 6 项信息。

:::

transactNative 方法对应的 native 函数为 android_os_BinderProxy_transact.

> android_util_Binder.cpp

```cpp
static jboolean android_os_BinderProxy_transact(JNIEnv* env, jobject obj,
    jint code, jobject dataObj, jobject replyObj, jint flags)
{
    ...
    //将 java Parcel 转为 C++ Parcel
    Parcel* data = parcelForJavaObject(env, dataObj);
    Parcel* reply = parcelForJavaObject(env, replyObj);

    //gBinderProxyOffsets.mObject 中保存的是 new BpBinder(handle) 对象
    IBinder* target = (IBinder*) env->GetLongField(obj, gBinderProxyOffsets.mObject);
    ...

    //此处便是 BpBinder::transact()
    status_t err = target->transact(code, *data, reply, flags);
    ...

    //最后根据 transact 执行具体情况，抛出相应的 Exception
    signalExceptionForError(env, obj, err, true , data->dataSize());
    return JNI_FALSE;
}
```

抛开无关细节，主要是调用 target->transact 方法，target 是一个 BpBinder 对象：

> BpBinder.cpp

```cpp
status_t BpBinder::transact(
    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags)
{
    if (mAlive) {
        status_t status = IPCThreadState::self()->transact(
            mHandle, code, data, reply, flags);
        if (status == DEAD_OBJECT) mAlive = 0;
        return status;
    }
    return DEAD_OBJECT;
}
```

上述函数采取了单例模式，确保每个线程只有一个实例对象。主要还是调用到 IPCThreadState::transact 方法：

> IPCThreadState.cpp

```cpp
status_t IPCThreadState::transact(int32_t handle,
                                  uint32_t code, const Parcel& data,
                                  Parcel* reply, uint32_t flags)
{
    status_t err = data.errorCheck(); // 数据错误检查
    flags |= TF_ACCEPT_FDS;
    ....
    if (err == NO_ERROR) {
         // 传输数据
        err = writeTransactionData(BC_TRANSACTION, flags, handle, code, data, NULL);
    }

    if (err != NO_ERROR) {
        if (reply) reply->setError(err);
        return (mLastError = err);
    }

    // 默认情况下，都是采用非 oneway 的方式, 也就是需要等待服务端的返回结果、同步
    if ((flags & TF_ONE_WAY) == 0) {
        if (reply) {
            // reply 对象不为空
            err = waitForResponse(reply);
        }else {
            Parcel fakeReply;
            err = waitForResponse(&fakeReply);
        }
    } else {
        err = waitForResponse(NULL, NULL);
    }
    return err;
}
```

通常情况下会走同步模式，也就是 oneway。两个模式都会调用到 waitForResponse 函数。

在看 waitForResponse 函数之间，我们先简单说明一下 transact 的主要过程：

首先、执行 writeTransactionData（第 10 行）向 mOut 写入数据，此时 mIn 还没有数据；

然后执行 waitForResponse 方法，该方法循环执行，直到收到应答消息，此间调用 talkWithDriver 和驱动交互，收到应答消息后写入 mIn, 根据响应码分类操作。

如果我们不再往下研究的话，此时客户端视角下的通信已经完成了，而我们的 phase 2 就是到此为止。

writeTransactionData 的实现大致如下：

> IPCThreadState.cpp

```cpp
status_t IPCThreadState::writeTransactionData(int32_t cmd, uint32_t binderFlags,
    int32_t handle, uint32_t code, const Parcel& data, status_t* statusBuffer)
{
    binder_transaction_data tr;

    tr.target.ptr = 0;
    tr.target.handle = handle; // handle 指向 AMS
    tr.code = code;            // START_SERVICE_TRANSACTION
    tr.flags = binderFlags;    // 0
    tr.cookie = 0;
    tr.sender_pid = 0;
    tr.sender_euid = 0;

    const status_t err = data.errorCheck();
    if (err == NO_ERROR) {
        // data 为 startService 相关信息
        tr.data_size = data.ipcDataSize();   // mDataSize
        tr.data.ptr.buffer = data.ipcData(); // mData 指针
        tr.offsets_size = data.ipcObjectsCount()*sizeof(binder_size_t); // mObjectsSize
        tr.data.ptr.offsets = data.ipcObjects(); // mObjects 指针
    }
    ...
    mOut.writeInt32(cmd);         // cmd = BC_TRANSACTION
    mOut.write(&tr, sizeof(tr));  // 写入 binder_transaction_data数据
    return NO_ERROR;
}
```

23-24 行将数据写入了 mOut, 写入的类型是 binder_transaction_data 类型。

waitForResponse  的实现大概如下：

```cpp
status_t IPCThreadState::waitForResponse(Parcel *reply, status_t *acquireResult)
{
    int32_t cmd;
    int32_t err;

    while (1) {
        if ((err=talkWithDriver()) < NO_ERROR) break;
        err = mIn.errorCheck();
        if (err < NO_ERROR) break; //当存在 error 则退出循环

         //每当跟 Driver 交互一次，若 mIn 收到数据则往下执行一次 BR 命令
        if (mIn.dataAvail() == 0) continue;

        cmd = mIn.readInt32();

        switch (cmd) {
        case BR_TRANSACTION_COMPLETE:
            //只有当不需要 reply, 也就是 oneway 时才会跳出循环,否则还需要等待.
            if (!reply && !acquireResult) goto finish; break;

        case BR_DEAD_REPLY:
            err = DEAD_OBJECT;         goto finish;
        case BR_FAILED_REPLY:
            err = FAILED_TRANSACTION;  goto finish;
        case BR_REPLY: ...             goto finish;

        default:
            err = executeCommand(cmd);
            if (err != NO_ERROR) goto finish;
            break;
        }
    }

finish:
    if (err != NO_ERROR) {
        if (reply) reply->setError(err); // 将发送的错误代码返回给最初的调用者
    }
    return err;
}
```

这里面又引入了关键的操作：talkWithDriver 和 executeCommand; 

这两者的功能是：执行 binder 读写操作，也就是 BINDER_WRITE_READ, 会经过 syscall, 进入 Binder 驱动，调用驱动中的 binder_ioctl 函数。在 default 的情况下，会调用后者；其他情况下是在 talkWithDriver  对 executeCommand 进行调用。

OK，Phase 2 到此为止。

### Phase 2 Summary

总结一下，BpBinder 到 Binder Driver 做了什么事情？

首先，我们找到 native 层的方法，
