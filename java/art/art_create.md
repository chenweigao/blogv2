---
title: ART Create
date: 2022-10-28
tag:
 - jvm
 - java
category:
 - JAVA
---

## Abstract

Art 的创建过程是一个很复杂的命题，所以我们单独开设一章来对这个过程进行学习。

@todo 增加全局的流程图。

## Art Create

### JNI_CreateJavaVM

当我们选择了 ART 运行时，Zygote 进程在启动过程中，会调用 `libart.so` 里面的函数 `JNI_CreateVM` 来**创建一个 art 虚拟机**，这个函数的实现如下：

```java
// art/runtime/jni/java_vm_ext.cc
// JNI Invocation interface.

extern "C" jint JNI_CreateJavaVM(JavaVM** p_vm, JNIEnv** p_env, void* vm_args) {
  ScopedTrace trace(__FUNCTION__);
  const JavaVMInitArgs* args = static_cast<JavaVMInitArgs*>(vm_args);
  if (JavaVMExt::IsBadJniVersion(args->version)) {
    LOG(ERROR) << "Bad JNI version passed to CreateJavaVM: " << args->version;
    return JNI_EVERSION;
  }
  RuntimeOptions options;
  for (int i = 0; i < args->nOptions; ++i) {
    JavaVMOption* option = &args->options[i];
    options.push_back(std::make_pair(std::string(option->optionString), option->extraInfo));
  }
  bool ignore_unrecognized = args->ignoreUnrecognized;
  if (!Runtime::Create(options, ignore_unrecognized)) {
    return JNI_ERR;
  }

  // Initialize native loader. This step makes sure we have
  // everything set up before we start using JNI.
  android::InitializeNativeLoader();

  Runtime* runtime = Runtime::Current();
  bool started = runtime->Start();
  if (!started) {
    delete Thread::Current()->GetJniEnv();
    delete runtime->GetJavaVM();
    LOG(WARNING) << "CreateJavaVM failed";
    return JNI_ERR;
  }

  *p_env = Thread::Current()->GetJniEnv();
  *p_vm = runtime->GetJavaVM();
  return JNI_OK;
}
```

这个函数不长，其核心的代码是调用 `Runtime::Create` 来进行虚拟机创建；在创建之前，将参数 `vm_args` 转换为 `JavaVMInitArgs` 对象，按照 key-value 的形式保存在 `JavaVMOption` 中，并以该向量作为传入传递给 `Runtime::Create` 来创建虚拟机。

### Runtime::Create

`Runtime::Create` 的实现如下所示：

```java
// art/runtime/runtime.cc

bool Runtime::Create(RuntimeArgumentMap&& runtime_options) {
  // TODO: acquire a static mutex on Runtime to avoid racing.
  if (Runtime::instance_ != nullptr) {
    return false;
  }
  instance_ = new Runtime;
  Locks::SetClientCallback(IsSafeToCallAbort);
  if (!instance_->Init(std::move(runtime_options))) {
    // TODO: Currently deleting the instance will abort the runtime on destruction. Now This will
    // leak memory, instead. Fix the destructor. b/19100793.
    // delete instance_;
    instance_ = nullptr;
    return false;
  }
  return true;
}

bool Runtime::Create(const RuntimeOptions& raw_options, bool ignore_unrecognized) {
  RuntimeArgumentMap runtime_options;
  return ParseOptions(raw_options, ignore_unrecognized, &runtime_options) &&
      Create(std::move(runtime_options));
}
```

上面列举了两个函数，做了参数重载，其实还是调用到了第一个函数。`instance_` 是 Runtime 类的静态成员变量，指向进程中的一个 Runtime 单例，这个单例就是描述当前进程的 art 虚拟机实例；第 5 行判断了这个实例是否已经存在了（即当前进程是否已经创建有一个 ART 虚拟机实例），如果已有的话，函数返回，否则的话，创建一个 art 虚拟机实例（第 8 行），创建的实例保存在静态成员变量 `instance_` 中，然后调用 Runtime 类的成员函数 `Init()` 对新创建的 art 虚拟机进行初始化。

### Runtime::Init()

`Runtime::Init()` 的实现如下所示：

```java
// art/runtime/runtime.cc
bool Runtime::Init(RuntimeArgumentMap&& runtime_options_in) {
    // ...
}
```

由于这个函数 700 多行，所以就不在这边列举源码了。





[^1]: [Android运行时ART加载OAT文件的过程分析](https://blog.csdn.net/Luoshengyang/article/details/39307813)
