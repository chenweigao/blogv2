---
title: Binder Parcel
date: 2023-07-31
tag:
 - OHOS
 - Android
 - Binder
category:
 - Android
---



## 背景

Pacel 是 IPC 通信中的序列化和反序列化类；



## 从 IPC API 开始

官方给出了 IPC 接口的使用方式，其中规定了 Parcel 相关的操作。

JS 侧的客户端在发送消息的时候需要按照如下的方式使用：

```javascript
import rpc from "@ohos.rpc"
// 使用期约
let option = new rpc.MessageOption()
let data = rpc.MessageParcel.create()
let reply = rpc.MessageParcel.create()
// 往data里写入参数
proxy.sendRequest(1, data, reply, option)
    .then(function(result) {
        if (result.errCode != 0) {
            console.error("send request failed, errCode: " + result.errCode)
            return
        }
        // 从result.reply里读取结果
    })
    .catch(function(e) {
        console.error("send request got exception: " + e)
    }
    .finally(() => {
        data.reclaim()
        reply.reclaim()
    })

// 使用回调函数
function sendRequestCallback(result) {
    try {
        if (result.errCode != 0) {
            console.error("send request failed, errCode: " + result.errCode)
            return
        }
        // 从result.reply里读取结果
    } finally {
        result.data.reclaim()
        result.reply.reclaim()
    }
}
let option = new rpc.MessageOption()
let data = rpc.MessageParcel.create()
let reply = rpc.MessageParcel.create()
// 往data里写入参数
proxy.sendRequest(1, data, reply, option, sendRequestCallback)
```

上述代码介绍了两种使用方式，其重点在于组装好数据：**data** 承载了这个职能。组装好数据之后，通过服务端的代理对象（也可以理解为客户端对象）调用 `sendRequest ` 方法传递数据。如果使用回调函数，则需要在调用 sendRequest 的时候指定好回调函数。

所以说，对于 JS 侧的客户端来说，使用 IPC 重点关注 data 的组装和 sendRequest 的调用即可。我们需要深入分析 Parcel 的原理，就需要带着 "data" 去观察其在 sendRequest 是如何"颠沛流离"的。



### 客户端 data 组装

对于如何组装 data, 此处有一个 demo 可供参考（native 侧的代码，但是原理都是相同的）：

```js
void IpcHelloProxy::Hello(std::string &msg)
{
    MessageOption option;
    MessageParcel data, reply;

    data.WriteString(msg);
    int result = Remote()->SendRequest(IIpcHello::HELLO_TRANSACTION, data, reply, option);
    if (result != 0) {
        printf("[IpcHelloClient]%s: send request failed: %d", __func__, result);
        return;
    }
    std::string replyMsg;
    if (!reply.ReadString(replyMsg)) {
        printf("[IpcHelloClient]%s: read ipc hello reply msg failed", __func__);
        return;
    }
    printf("[IpcHelloClient]%s: ipc hello reply msg: %s", __func__, replyMsg.c_str());
}
```

我们看前半部分代码，发现客户端侧需要传递一个 string 类型的消息，在创建了 MessageParcel 对象后，我们调用 `data.WriteString(msg)` 将消息写入，此时发生了序列化（组装操作），在经过序列化之后，会调用 SendRequest 方法进行消息发送。



## sendRequest 

该函数的定义与实现如下：

```cpp
int IPCObjectProxy::SendRequest(uint32_t code, 
                                MessageParcel &data, 
                                MessageParcel &reply, 
                                MessageOption &option)
{
    if (code != DUMP_TRANSACTION && code > MAX_TRANSACTION_ID) {
        return IPC_PROXY_INVALID_CODE_ERR;
    }

    return SendRequestInner(false, code, data, reply, option);
}
```

参数解析：

- code: TRANSACTION_ID，作为标识符使用
- data: 传递的数据，此时为 MessageParcel 类型
- reply: 从服务端需要得到的消息回应，MessageParcel 类型
- option: MessageOption，看情况是否指定

从代码可以看出，主要还是调用 SendRequestInner 方法：

```cpp{19}
int IPCObjectProxy::SendRequestInner(bool isLocal, uint32_t code, 
    MessageParcel &data, 
    MessageParcel &reply,
    MessageOption &option)
{
    if (IsObjectDead()) {
        return ERR_DEAD_OBJECT;
    }

    IRemoteInvoker *invoker = nullptr;
    if (isLocal) {
        invoker = IPCThreadSkeleton::GetDefaultInvoker();
    } else {
        invoker = IPCThreadSkeleton::GetRemoteInvoker(proto_);
    }
    if (invoker == nullptr) {
        ZLOGE(LABEL, "%{public}s: handle: %{public}u, proto: %{public}d, invoker is null", __func__, handle_, proto_);
        return ERR_NULL_OBJECT;
    }

    int status = invoker->SendRequest(handle_, code, data, reply, option);
    if (status == ERR_DEAD_OBJECT) {
        MarkObjectDied();
    }
    return status;
}
```

上述最重要的是调用 `invoker->SendRequest`:

```cpp
int BinderInvoker::SendRequest(int handle, uint32_t code, 
                               MessageParcel &data, MessageParcel &reply,
    						   MessageOption &option)
{
    int error = ERR_NONE;
    uint32_t flags = static_cast<uint32_t>(option.GetFlags());
    MessageParcel &newData = const_cast<MessageParcel &>(data);
    size_t oldWritePosition = newData.GetWritePosition();
    HiTraceId traceId = HiTraceChain::GetId();
    // set client send trace point if trace is enabled
    HiTraceId childId = HitraceInvoker::TraceClientSend(handle, code, newData, flags, traceId);
    if (!TranslateDBinderProxy(handle, data)) {
        return IPC_INVOKER_WRITE_TRANS_ERR;
    }
    // 需要重点关注的代码逻辑
    if (!WriteTransaction(BC_TRANSACTION, flags, handle, code, data, nullptr)) {
        newData.RewindWrite(oldWritePosition);
        ZLOGE(LABEL, "WriteTransaction ERROR");
#ifndef BUILD_PUBLIC_VERSION
        ReportDriverEvent(DbinderErrorCode::COMMON_DRIVER_ERROR, std::string(DbinderErrorCode::ERROR_TYPE),
            DbinderErrorCode::IPC_DRIVER, std::string(DbinderErrorCode::ERROR_CODE),
            DbinderErrorCode::TRANSACT_DATA_FAILURE);
#endif
        return IPC_INVOKER_WRITE_TRANS_ERR;
    }
	
    // 是否异步
    if ((flags & TF_ONE_WAY) != 0) {
        error = WaitForCompletion(nullptr);
    } else {
        error = WaitForCompletion(&reply);
    }
    HitraceInvoker::TraceClientReceieve(handle, code, flags, traceId, childId);
    // restore Parcel data
    newData.RewindWrite(oldWritePosition);
    if (error != ERR_NONE) {
        ZLOGE(LABEL, "%{public}s: handle=%{public}d result = %{public}d", __func__, handle, error);
    }
    return error;
}
```

WriteTransaction 方法非常重要：

```cpp
bool BinderInvoker::WriteTransaction(int cmd, uint32_t flags, 
                                     int32_t handle, uint32_t code, 
                                     const MessageParcel &data,
     								 const int32_t *status)
{
    binder_transaction_data tr {};
    tr.target.handle = (uint32_t)handle;
    tr.code = code;
    tr.flags = flags;
    tr.flags |= TF_ACCEPT_FDS;
    if (data.GetDataSize() > 0) {
        // Send this parcel's data through the binder.
        tr.data_size = data.GetDataSize();
        tr.data.ptr.buffer = (binder_uintptr_t)data.GetData();
        tr.offsets_size = data.GetOffsetsSize() * sizeof(binder_size_t);
        tr.data.ptr.offsets = data.GetObjectOffsets();
    } else if (status != nullptr) {
        // Send this parcel's status through the binder.
        tr.flags |= TF_STATUS_CODE;
        tr.data_size = sizeof(int32_t);
        tr.data.ptr.buffer = reinterpret_cast<uintptr_t>(status);
        tr.offsets_size = 0;
        tr.data.ptr.offsets = 0;
    }

    if (!output_.WriteInt32(cmd)) {
        ZLOGE(LABEL, "WriteTransaction Command failure");
        return false;
    }
    return output_.WriteBuffer(&tr, sizeof(binder_transaction_data));
}
```

这里出现了一个非常重要的数据结构 binder_transaction_data：

```cpp
struct binder_transaction_data {
    union {
        __u32 handle;
        binder_uintptr_t ptr;
    } target;
    binder_uintptr_t cookie;
    __u32 code;
    __u32 flags;
    pid_t sender_pid;
    uid_t sender_euid;
    binder_size_t data_size;
    binder_size_t offsets_size;
    union {
        struct {
            binder_uintptr_t buffer;
            binder_uintptr_t offsets;
        } ptr;
        __u8 buf[8];
    } data;
};
```

我们使用到了其中一些很重要的结构：

1. tr.data.ptr.buffer: 一个指针，标识着序列化 buffer 的起始地址，其值为 `(binder_uintptr_t)data.GetData()`
2. tr.data_size：和 `data.GetDataSize()` 接口强相关，返回 dataSize_ 指针，标识目前已缓冲数据的总部容量
3. offset:
   1. tr.offsets_size
   2. tr.data.ptr.offsets 

从上面的分析可以看出，我们需要了解 MessageParcel 的两个重要方法：`GetData()` 和 `GetDataSize()`:

MessageParcel 集成自 Parcel, 这两个重要的方法的实现都可以从 Parcel 类中找到，文件路径为：commonlibrary/c_utils/base/src/parcel.cpp

```cpp
uintptr_t Parcel::GetData() const
{
    return reinterpret_cast<uintptr_t>(data_);
}

size_t Parcel::GetDataSize() const
{
    return dataSize_;
}
```

这两个函数都是返回了两个数据结构：

1. data_: 缓存数据的首地址
2. dataSize_: 目前已经缓存的数据的总容量

还有几个重要的数据结构如下所示：

```cpp
Parcel:
private:
    uint8_t *data_;	// 缓存数据的首地址
    size_t readCursor_; // 下一个数据的首地址
    size_t writeCursor_;
    size_t dataSize_; // 当前数据大小
    size_t dataCapacity_; // 数据总容量
    size_t maxDataCapacity_;
    binder_size_t *objectOffsets_;
    size_t objectCursor_;
    size_t objectsCapacity_;
    Allocator *allocator_;
    std::vector<sptr<Parcelable>> objectHolder_;
    bool writable_ = true;
```

还有offset 相关的：

```cpp
binder_size_t Parcel::GetObjectOffsets() const
{
    return reinterpret_cast<binder_size_t>(objectOffsets_);
}
```

以及

```cpp
size_t Parcel::GetOffsetsSize() const
{
    return objectCursor_;
}
```

我们将这些信息存储在 tr 中，然后再对 tr 进行操作：

首先是写入 cmd, 实现如下：

```cpp
    if (!output_.WriteInt32(cmd)) {
        ZLOGE(LABEL, "WriteTransaction Command failure");
        return false;
    }
```

WriteInt32 方法是 Parcel 中的一个方法：

```cpp
bool Parcel::WriteInt32(int32_t value)
{
    return Write<int32_t>(value);
}
```

```cpp
template <typename T>
bool Parcel::Write(T value)
{
    size_t desireCapacity = sizeof(T);

    if (EnsureWritableCapacity(desireCapacity)) {
        *reinterpret_cast<T *>(data_ + writeCursor_) = value;
        writeCursor_ += desireCapacity;
        dataSize_ += desireCapacity;
        return true;
    }

    return false;
}
```

在 Write 方法中，重点关注第 7 行，我们给 parcel buffer 中的两个变量进行了修改：

`*reinterpret_cast<T *>(data_ + writeCursor_) = value;` 给 data_ + writeCursor_ 地址中填充 value, 填充之后 writeCursor_ 向前移动，dataSize_ 的容量增加。

在 BinderInvoker::WriteTransaction 的最后，将 tr 写入 buffer 中：

```cpp
return output_.WriteBuffer(&tr, sizeof(binder_transaction_data));
```

```cpp
bool Parcel::WriteBuffer(const void *data, size_t size)
{
    if (data == nullptr || size == 0) {
        return false;
    }

    size_t padSize = GetPadSize(size);
    size_t desireCapacity = size + padSize;

    // in case of desireCapacity overflow
    if (desireCapacity < size || desireCapacity < padSize) {
        return false;
    }

    if (EnsureWritableCapacity(desireCapacity)) {
        if (!WriteDataBytes(data, size)) {
            return false;
        }
        WritePadBytes(padSize);
        return true;
    }

    return false;
}
```

其中重要的写入数据 Parcel::WriteDataBytes 的实现在：

```cpp
bool Parcel::WriteDataBytes(const void *data, size_t size)
{
    void *dest = data_ + writeCursor_;
    size_t writableBytes = GetWritableBytes();
    if (memcpy_s(dest, writableBytes, data, size) != EOK) {
        return false;
    }
    writeCursor_ += size;
    dataSize_ += size;
    return true;
}
```

$data\_ + writeCursor\_$ 可以确定要写写入数据的地址， 通过 $dataCapacity\_ - writeCursor\_$ 进行计算，将这些数据作为参数传递给 `memcpy_s` 进行数据的 copy. 如果这次的 copy 没有成功的话，我们需要调用到 WritePadBytes 再进行一次 copy:

```cpp
void Parcel::WritePadBytes(size_t padSize)
{
    uint8_t *dest = data_ + writeCursor_;
    static const int MAX_MASK_NUM = 4;
#if __BYTE_ORDER == __LITTLE_ENDIAN
    static const size_t mask[MAX_MASK_NUM] = { 0xFFFFFFFF, 0x00ffffff, 0x0000ffff, 0x000000ff };
#else
    static const size_t mask[MAX_MASK_NUM] = { 0xFFFFFFFF, 0xffffff00, 0xffff0000, 0xff000000 };
#endif
    *reinterpret_cast<uint32_t *>(dest + padSize - MAX_MASK_NUM) &= mask[padSize];
    writeCursor_ += padSize;
    dataSize_ += padSize;
}
```


