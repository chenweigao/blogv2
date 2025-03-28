---
title: THP 整理
date: 2025-03-17
---

## 1. hugepages

在 Linux 内核中，shmemhugepages、anonhugepages 和 pmdhugepages 这几个术语都与 **Transparent Huge Pages (THP)** 和 **Huge Pages** 相关，主要涉及如何使用更大的页（通常是 2MB 或 1GB）来减少 TLB（Translation Lookaside Buffer）miss，提高内存访问性能。

---

### 1.1. 1 . ShmemHugePages（共享内存 Huge Pages）

适用于 **tmpfs（shmem）和 SysV 共享内存（shmget/shmat）**，如果启用了 THP，则共享内存也可以使用 Huge Pages。

受 sysfs 配置项影响：

```
cat /sys/kernel/mm/transparent_hugepage/shmem_enabled
```


可用 `/proc/meminfo` 监测：

ShmemHugePages: 当前 `tmpfs/shmem` 使用的 Huge Pages 数量。

一些数据库（如 PostgreSQL）利用共享内存，可能会受到 ShmemHugePages 影响。

---

### 1.2. 2 . AnonHugePages（匿名 Huge Pages）

适用于 **匿名内存映射（如堆、栈、mmap (匿名)）**，自动使用 THP。

受 sysfs 配置项影响：

```bash
/sys/kernel/mm/transparent_hugepage/enabled

/sys/kernel/mm/transparent_hugepage/defrag
```

可用 `/proc/meminfo` 监测：

AnonHugePages: 当前匿名 Huge Pages 使用情况。例如，大量 malloc () 分配的内存可能会使用 AnonHugePages。

---

### 1.3. 3 . PMDHugePages（PMD 级 Huge Pages）

PMD (Page Middle Directory) 级别的 Huge Pages（通常是 **2MB** 大小）。

PMDHugePages 是 Huge Pages 实现的一部分，适用于 64-bit 架构（x86-64、ARM64）。

主要用于 THP，当 THP 作用于 **匿名页（anonhugepages）或共享页（shmemhugepages）** 时，就会尝试分配 PMD Huge Pages。

/sys/kernel/debug/mm/hugepages 可以用于调试 PMD 级 Huge Pages 统计信息。

---

### 1.4. 总结

| **名称**         | **作用域**           | **触发条件**               | **监测项**                        |
| -------------- | ----------------- | ---------------------- | ------------------------------ |
| shmemhugepages | tmpfs、SysV 共享内存   | THP 开启 & shmem_enabled | ShmemHugePages                 |
| anonhugepages  | malloc ()、匿名 mmap | THP 开启                 | AnonHugePages                  |
| pmdhugepages   | PMD 级 Huge Pages  | THP 分配 2MB Huge Pages  | /sys/kernel/debug/mm/hugepages |

**建议优化策略**：

1. 若要 控制 THP 行为，可以调整 /sys/kernel/mm/transparent_hugepage/ 下的相关参数，如 enabled=always/madvise/never、shmem_enabled 等。

2. 若要 优化数据库（如 PostgreSQL、MySQL），可能需要手动配置 HugeTLBfs 或者调整 shmemhugepages 相关参数。

3. 在 HPC、AI 训练等场景下，可以考虑 预分配 Huge Pages（使用 hugetlbfs）以减少内存碎片和 THP 分配的开销。

## 2. tmpfs & THP

>  C++ 的 THP 无感使能，tmpfs 加上 huge 的 mount 参数使用 THP，如何理解？

在 Linux 中，**Transparent Huge Pages (THP)** 允许内核自动使用 **Huge Pages** 来优化内存管理，减少 TLB (Translation Lookaside Buffer) misses，提高性能。你的问题涉及在 tmpfs（基于内存的文件系统）上使用 THP，无感使能（transparent enablement）。

无感使能 THP 意味着：

1. 进程本身**不需要显式申请 Huge Pages**（比如 mmap () 方式显式使用 MAP_HUGETLB）。
2. 由**内核透明地分配 Huge Pages**，使应用程序可以自动受益于更高效的内存管理，而无需修改代码。

### 2.1. 在 tmpfs 上使用 THP
  
tmpfs 是一个基于 RAM 的文件系统，默认情况下使用 **普通 4KB 页面**。如果想让 tmpfs 上的文件自动使用 Huge Pages，可以在挂载 tmpfs 时加上 huge 选项。

**挂载方式**:

```bash
mount -t tmpfs -o size=2G,huge=always tmpfs /mnt/tmpfs
```

其中：

- `size=2G` 让 tmpfs 最大使用 2GB 内存。注意在使能的时候用设备的实际大小。

- `huge=always` 指定 **始终使用** THP（即 2MB 或 1GB 大页）。

**可选参数**, huge= 参数有以下取值：

- `always`（总是启用 THP，大部分情况下推荐）

- `within_size`（如果可以分配 huge pages，则使用，否则回退到 4KB）

- `never`（禁用 THP）

  

### 2.2. 如何验证 THP 是否生效

  
**查看 THP 配置**:

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
```

可能的值：

• [always] madvise never（THP 总是启用）

• always [madvise] never（仅对 madvise () 适用）

• always madvise [never]（禁用 THP）

  

**查看 tmpfs 是否使用 THP**:


挂载后，可以通过 `cat /proc/mounts | grep tmpfs` 确认 huge=always 是否生效：

```bash
cat /proc/mounts | grep tmpfs
```

检查 tmpfs 目录下的文件映射：

```bash
grep AnonHugePages /proc/meminfo
```

如果 AnonHugePages 有显著增加，则说明 THP 在 tmpfs 上生效了。

  

**使用 pagemap 观察**:


可以用 pagemap 观察进程的内存页大小：

```bash
cat /proc/<pid>/smaps | grep "AnonHugePages"
```

如果看到 AnonHugePages 占据较大比例，说明 Huge Pages 已被应用。


### 2.3. 可能的性能影响

尽管 THP 带来许多优势，但在某些情况下：

• **可能导致碎片化**，特别是长期运行的系统。

• **可能增加内存使用**，如果进程实际使用的内存较少，而 THP 仍然分配了 2MB 页面，则可能会浪费一些内存。

如果遇到问题，可以改为 `huge=within_siz` e 或 `huge=never` 进行调试。

### 2.4. 总结 

tmpfs 加 huge=always，让 Linux 内核在 tmpfs 上**自动分配 Huge Pages**，提高性能，无需修改应用代码。

适用于 **数据库、AI 训练、大数据缓存** 等场景，减少 TLB miss，提升访问效率。

通过 /proc/meminfo 和 smaps 可检查 THP 是否生效。

在某些工作负载下，可能需要权衡**内存使用 vs. 访问效率**，可以调整 huge=within_size 以获得更好的兼容性。

  
你在 AMD 这边做 EPYC 和 AI/HPC 相关的优化，这块 THP 结合 NUMA 亲和性、RDMA、大页回收等策略的优化，可能会是一个有意思的方向，像 PostgreSQL、TensorFlow 之类的 workload 都可以针对性优化，甚至可以看看 AMD SEV + THP 在安全计算场景下的影响。

## 3. mount 用法

### 3.1. remount

`mount -o remount` 主要用于重新挂载已挂载的文件系统，并修改挂载选项。如果要增加 `size=2G,huge=always` 选项，命令如下：

```bash
mount -o remount,size=2G,huge=always <挂载点>
```

其中：<挂载点> 是你的目标挂载目录，例如 /dev/shm。


如果要针对 tmpfs 重新挂载 /dev/shm，可以使用：

```bash
mount -o remount,size=2M,huge=always tmpfs /dev/shm
```

或者：

```bash
mount -o remount,size=2M,huge=always /dev/shm
```

**验证挂载选项：**

运行以下命令检查是否成功应用：

```bash
mount | grep /dev/shm
```

如果你想确保这些更改在系统重启后仍然生效，需要在 /etc/fstab 中添加或修改相应的挂载项，例如：

```bash
tmpfs /dev/shm tmpfs defaults,size=2M,huge=always 0 0
```

然后执行：

```bash
mount -o remount /dev/shm
```

以应用新的挂载选项。

### 3.2. deug

> mount -o remount,size=2M,huge=always /home/t4/kubernetes/lib/kubelet/pods/405d43ee-5053-498e-9ceb-0d19c9c20ba7/volumes/kubernetes.io~empty-dir/tmpfs-index
> 
> mount: /home/t4/kubernetes/lib/kubelet/pods/405d43ee-5053-498e-9ceb-0d19c9c20ba7/volumes/kubernetes.io~empty-dir/tmpfs-index: **mount point not mounted or bad option.**

这个错误通常是由于以下几个原因导致的：

1. **挂载点未实际挂载**

你可以先检查该路径是否已经被挂载：

```bash
mount | grep tmpfs-index
```

如果没有输出，说明该路径没有挂载，需要先挂载它。例如：

```bash
mount -t tmpfs -o size=843750000k,huge=always tmpfs /home/t4/kubernetes/lib/kubelet/pods/405d43ee-5053-498e-9ceb-0d19c9c20ba7/volumes/kubernetes.io~empty-dir/tmpfs-index
```

  

2. **挂载点类型不支持 huge=always 选项**

`huge=always` 选项通常用于 tmpfs 文件系统，但如果当前 mount 设备不是 tmpfs，它可能会报错。你可以检查它的文件系统类型：

```bash
df -T /home/t4/kubernetes/lib/kubelet/pods/405d43ee-5053-498e-9ceb-0d19c9c20ba7/volumes/kubernetes.io~empty-dir/tmpfs-index
```

如果它不是 tmpfs，你需要先卸载并重新以 tmpfs 挂载：

```bash
umount -l /home/t4/kubernetes/lib/kubelet/pods/405d43ee-5053-498e-9ceb-0d19c9c20ba7/volumes/kubernetes.io~empty-dir/tmpfs-index

mount -t tmpfs -o size=2G,huge=always tmpfs /home/t4/kubernetes/lib/kubelet/pods/405d43ee-5053-498e-9ceb-0d19c9c20ba7/volumes/kubernetes.io~empty-dir/tmpfs-index
```

  

3. **Kubernetes 管理的 emptyDir 可能限制手动挂载**

在 Kubernetes 中，emptyDir 可能会自动管理 tmpfs，手动调整可能会失败。你可以尝试修改 Kubernetes Pod 配置中的 emptyDir 选项。例如：

```yaml
volumes:
- name: tmpfs-index
  emptyDir:
    medium: "Memory"
    sizeLimit: 2Mi
```

然后重新部署 Pod，使其生效。

你可以先确认当前的挂载状态，再决定是否需要重新挂载或者修改 Pod 配置。