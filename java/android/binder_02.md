---
title: Binder 内存管理
date: 2023-07-18
tag:
 - kernel
 - Android
 - Binder
category:
 - Android
 - Kernel
---



## 概览

Binder 内存管理指的是：管理 binder mmap 映射的这块**缓冲区**。其中有两个关键的数据结构：

**binder_alloc**：缓冲区分配器，对每个使用 binder 进行 IPC 通信的进程，事先建立一个缓冲区；

**binder_buffer**: 描述缓冲区的数据结构

本文先对这两个关键的数据结构进行研究，然后再逐一分析使用这些数据结构的相关函数和算法。

## 数据结构分析

### binder_alloc

```c
struct binder_alloc {
    struct mutex mutex;
    
    // 指向调用 mmap 时分配的 vm_area_struct（描述用户空间的虚拟地址）
    struct vm_area_struct *vma; 
    // 该进程的用户空间及相关信息
    struct mm_struct *vma_vm_mm; 
    // vm_area_struct 的起始地址
    void __user *buffer; 
    // 一个双向循环链表
    struct list_head buffers; 
    // 红黑树，管理所有可分配的 binder_buffer, 按 buffer 大小排序
    struct rb_root free_buffers; 
    // 管理所有已分配的 binder_buffer, 按 buffer 的起始的用户空间虚拟地址排序
    struct rb_root allocated_buffers; 
    size_t free_async_space; 
    // 数组，每个元素对应一个物理页，用于物理页回收
    struct binder_lru_page *pages; 
    // 整个缓冲区大小
    size_t buffer_size; 
    uint32_t buffer_free;
    int pid;
    size_t pages_high;
};
```

`vm_area_struct` 数据结构用于描述用户空间的虚拟地址，其中包括虚拟地址相关的信息。

在缓冲区初始化或者分配以后，内存中会多出如下几个数据结构：

![binder_alloc](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aae579325be40da8e163be807ffa309~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

需要注意，其中 allocated_buffers 红黑树此时是一个空树。

### binder_buffer

binder_buffer 数据结构用于表示缓冲区：

```c
struct binder_buffer {
    /*  表示链表中的一个节点；将 binder_buffer 插入 binder_alloc 的 buffer 链表时，
     *  就是将该 entry 插入链表中；遍历链表的时候           
     *  拿到该 entry, 可通过 API 获取对应的 binder_buffer 
     */
    struct list_head entry; /* free and allocated entries by address */
    // 在红黑树中 binder_buff 的表示：free_buffers 和 allocated_buffers 
    struct rb_node rb_node; /* free entry by size or allocated entry */
                /* by address */
    unsigned free:1; // 标识该 buffer 是空闲的
    unsigned allow_user_free:1;
    unsigned async_transaction:1;
    unsigned debug_id:29;
    struct binder_transaction *transaction; // 与该缓冲区关联的 binder_transaction
    struct binder_node *target_node; // 与该缓冲区关联的 binder_node
    size_t data_size; // transaction 数据的大小
    size_t offsets_size; // offsets 数组的大小
    size_t extra_buffers_size; // 其他对象的空间大小
    void __user *user_data; // 用户空间的虚拟地址，指向该缓冲区的起始位置
    int    pid; // 所属进程的 id
};
```

## mmap 的两个函数

有两个函数和 mmap 和上述的两个数据结构息息相关：

**[binder_alloc_mmap_handler()](https://link.juejin.cn/?target=https%3A%2F%2Fcs.android.com%2Fandroid%2F_%2Fandroid%2Fkernel%2Fcommon%2F%2B%2Fandroid13-5.15%3Adrivers%2Fandroid%2Fbinder_alloc.c%3Bbpv%3D0%3Bbpt%3D0%3Bl%3D739)**：用户分配空间，参数 struct binder_alloc *alloc 和 struct vm_area_struct *vma

**[binder_alloc_copy_user_to_buffer()](https://link.juejin.cn/?target=https%3A%2F%2Fcs.android.com%2Fandroid%2F_%2Fandroid%2Fkernel%2Fcommon%2F%2B%2Fandroid13-5.15%3Adrivers%2Fandroid%2Fbinder_alloc.c%3Bl%3D1207%3Bbpv%3D0%3Bbpt%3D0)**：将客户端的数据 copy 到缓冲区，逐个物理页处理。

1. 通过 kmap 建立内核空间虚拟地址和物理页的映射

2. 通过 copy_from_user 按页拷贝

3. 通过 kunmap 取消映射

### binder_alloc_mmap_handler()

todo

### binder_alloc_copy_user_to_buffer()

其代码如下：

```c
/**
 * binder_alloc_copy_user_to_buffer() - copy src user to tgt user
 * @alloc: binder_alloc for this proc
 * (指向 binder_alloc 数据结构)
 * @buffer: binder buffer to be accessed
 * （指向 binder_buff 数据结构）从缓存区中划分出一小块，用于接收客户端数据；
 * buffer 是否已经分配物理内存？取决于 kzmalloc
 * @buffer_offset: offset into @buffer data
 * @from: userspace pointer to source buffer
 * @bytes: bytes to copy
 *
 * Copy bytes from source userspace to target buffer.
 *
 * Return: bytes remaining to be copied
 */
unsigned long
binder_alloc_copy_user_to_buffer(struct binder_alloc *alloc,
				 struct binder_buffer *buffer,
				 binder_size_t buffer_offset,
				 const void __user *from,
				 size_t bytes)
{
	if (!check_buffer(alloc, buffer, buffer_offset, bytes))
		return bytes;

	while (bytes) {
		unsigned long size;
		unsigned long ret;
		struct page *page;
		pgoff_t pgoff;
		void *kptr;

		page = binder_alloc_get_page(alloc, buffer,
					     buffer_offset, &pgoff);
		size = min_t(size_t, bytes, PAGE_SIZE - pgoff);
		kptr = kmap(page) + pgoff;
		ret = copy_from_user(kptr, from, size);
		kunmap(page);
		if (ret)
			return bytes - size + ret;
		bytes -= size;
		from += size;
		buffer_offset += size;
	}
	return 0;
}
```

#### caller: binder_transaction() 

binder_alloc_copy_user_to_buffer 函数在 binder_transaction 中被调用。

```c
if(binder_alloc_copy_user_to_buffer(
				&target_proc->alloc,
				t->buffer, 0,
				(const void __user *)
					(uintptr_t)tr->data.ptr.buffer,
				tr->data_size)))
```

重点关注其中的 buffer, 来自于 **t->buffer**, t 是一个 *struct* binder_transaction *t, binder_transaction 中有一个 binder_buffer 类型的成员变量;  其赋值的语句如下：

```c
t = kzalloc(sizeof(*t), GFP_KERNEL);
```

- 第一个参数，含义为 size
- 第二个参数，含义为分配的内存类型

`kzalloc` 函数的定义和实现如下：

```c
/**
 * kzalloc - allocate memory. The memory is set to zero.
 * @size: how many bytes of memory are required.
 * @flags: the type of memory to allocate (see kmalloc).
 */
static inline void *kzalloc(size_t size, gfp_t flags)
{
	return kmalloc(size, flags | __GFP_ZERO);
}
```

`kzalloc()` 分配一个指定大小的内存块，并将其初始化为 0。它类似于 `kmalloc()`，但会自动将分配的内存清零，以避免敏感数据泄露。

如果分配成功，则返回指向分配内存块的指针。注意，这个函数分配的是内核中的虚拟内存。

:::tip 关于 malloc 内存分配

malloc 内存分配的时候，内核会给申请者分配一个物理页，如果不够的话，再触发缺页异常。

:::

---

接下来再看 tr->data.ptr.buffer 的含义，这是第四个参数 *@from: userspace pointer to source buffer*；tr 是 binder_transaction 自带的参数，类型为 binder_transaction_data, 数据结构如下：

```c
	union {
		struct {
			/* transaction data */
			binder_uintptr_t	buffer;
			/* offsets from buffer to flat_binder_object structs */
			binder_uintptr_t	offsets;
		} ptr;
		__u8	buf[8];
	} data;
```

最后一个参数也是来自于 tr.



#### callee

