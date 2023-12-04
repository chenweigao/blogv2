import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as c,c as l,a as n,b as s,d as e,f as t}from"./app-22cda79c.js";const i="/assets/buffers-e7889637.png",r={},u=t(`<h2 id="概览" tabindex="-1"><a class="header-anchor" href="#概览" aria-hidden="true">#</a> 概览</h2><p>Binder 内存管理指的是：管理 binder mmap 映射的这块<strong>缓冲区</strong>。其中有两个关键的数据结构：</p><p><strong>binder_alloc</strong>：缓冲区分配器，对每个使用 binder 进行 IPC 通信的进程，事先建立一个缓冲区；</p><p><strong>binder_buffer</strong>: 描述缓冲区的数据结构</p><p>本文先对这两个关键的数据结构进行研究，然后再逐一分析使用这些数据结构的相关函数和算法。</p><h2 id="数据结构分析" tabindex="-1"><a class="header-anchor" href="#数据结构分析" aria-hidden="true">#</a> 数据结构分析</h2><h3 id="binder-alloc" tabindex="-1"><a class="header-anchor" href="#binder-alloc" aria-hidden="true">#</a> binder_alloc</h3><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">binder_alloc</span> <span class="token punctuation">{</span>
    <span class="token keyword">struct</span> <span class="token class-name">mutex</span> mutex<span class="token punctuation">;</span>
    
    <span class="token comment">// 指向调用 mmap 时分配的 vm_area_struct（描述用户空间的虚拟地址）</span>
    <span class="token keyword">struct</span> <span class="token class-name">vm_area_struct</span> <span class="token operator">*</span>vma<span class="token punctuation">;</span> 
    <span class="token comment">// 该进程的用户空间及相关信息</span>
    <span class="token keyword">struct</span> <span class="token class-name">mm_struct</span> <span class="token operator">*</span>vma_vm_mm<span class="token punctuation">;</span> 
    <span class="token comment">// vm_area_struct 的起始地址</span>
    <span class="token keyword">void</span> __user <span class="token operator">*</span>buffer<span class="token punctuation">;</span> 
    <span class="token comment">// 一个双向循环链表</span>
    <span class="token keyword">struct</span> <span class="token class-name">list_head</span> buffers<span class="token punctuation">;</span> 
    <span class="token comment">// 红黑树，管理所有可分配的 binder_buffer, 按 buffer 大小排序</span>
    <span class="token keyword">struct</span> <span class="token class-name">rb_root</span> free_buffers<span class="token punctuation">;</span> 
    <span class="token comment">// 管理所有已分配的 binder_buffer, 按 buffer 的起始的用户空间虚拟地址排序</span>
    <span class="token keyword">struct</span> <span class="token class-name">rb_root</span> allocated_buffers<span class="token punctuation">;</span> 
    <span class="token class-name">size_t</span> free_async_space<span class="token punctuation">;</span> 
    <span class="token comment">// 数组，每个元素对应一个物理页，用于物理页回收</span>
    <span class="token keyword">struct</span> <span class="token class-name">binder_lru_page</span> <span class="token operator">*</span>pages<span class="token punctuation">;</span> 
    <span class="token comment">// 整个缓冲区大小</span>
    <span class="token class-name">size_t</span> buffer_size<span class="token punctuation">;</span> 
    <span class="token class-name">uint32_t</span> buffer_free<span class="token punctuation">;</span>
    <span class="token keyword">int</span> pid<span class="token punctuation">;</span>
    <span class="token class-name">size_t</span> pages_high<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>vm_area_struct</code> 数据结构用于描述用户空间的虚拟地址，其中包括虚拟地址相关的信息。</p><p>在缓冲区初始化或者分配以后，内存中会多出如下几个数据结构：</p><p><img src="`+i+`" alt="binder_alloc"></p><p>需要注意，其中 allocated_buffers 红黑树此时是一个空树。</p><h3 id="binder-buffer" tabindex="-1"><a class="header-anchor" href="#binder-buffer" aria-hidden="true">#</a> binder_buffer</h3><p>binder_buffer 数据结构用于表示缓冲区：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">binder_buffer</span> <span class="token punctuation">{</span>
    <span class="token comment">/*  表示链表中的一个节点；将 binder_buffer 插入 binder_alloc 的 buffer 链表时，
     *  就是将该 entry 插入链表中；遍历链表的时候           
     *  拿到该 entry, 可通过 API 获取对应的 binder_buffer 
     */</span>
    <span class="token keyword">struct</span> <span class="token class-name">list_head</span> entry<span class="token punctuation">;</span> <span class="token comment">/* free and allocated entries by address */</span>
    <span class="token comment">// 在红黑树中 binder_buff 的表示：free_buffers 和 allocated_buffers </span>
    <span class="token keyword">struct</span> <span class="token class-name">rb_node</span> rb_node<span class="token punctuation">;</span> <span class="token comment">/* free entry by size or allocated entry */</span>
                <span class="token comment">/* by address */</span>
    <span class="token keyword">unsigned</span> free<span class="token operator">:</span><span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">// 标识该 buffer 是空闲的</span>
    <span class="token keyword">unsigned</span> allow_user_free<span class="token operator">:</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> async_transaction<span class="token operator">:</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> debug_id<span class="token operator">:</span><span class="token number">29</span><span class="token punctuation">;</span>
    <span class="token keyword">struct</span> <span class="token class-name">binder_transaction</span> <span class="token operator">*</span>transaction<span class="token punctuation">;</span> <span class="token comment">// 与该缓冲区关联的 binder_transaction</span>
    <span class="token keyword">struct</span> <span class="token class-name">binder_node</span> <span class="token operator">*</span>target_node<span class="token punctuation">;</span> <span class="token comment">// 与该缓冲区关联的 binder_node</span>
    <span class="token class-name">size_t</span> data_size<span class="token punctuation">;</span> <span class="token comment">// transaction 数据的大小</span>
    <span class="token class-name">size_t</span> offsets_size<span class="token punctuation">;</span> <span class="token comment">// offsets 数组的大小</span>
    <span class="token class-name">size_t</span> extra_buffers_size<span class="token punctuation">;</span> <span class="token comment">// 其他对象的空间大小</span>
    <span class="token keyword">void</span> __user <span class="token operator">*</span>user_data<span class="token punctuation">;</span> <span class="token comment">// 用户空间的虚拟地址，指向该缓冲区的起始位置</span>
    <span class="token keyword">int</span>    pid<span class="token punctuation">;</span> <span class="token comment">// 所属进程的 id</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mmap-的两个函数" tabindex="-1"><a class="header-anchor" href="#mmap-的两个函数" aria-hidden="true">#</a> mmap 的两个函数</h2><p>有两个函数和 mmap 和上述的两个数据结构息息相关：</p>`,17),d={href:"https://link.juejin.cn/?target=https%3A%2F%2Fcs.android.com%2Fandroid%2F_%2Fandroid%2Fkernel%2Fcommon%2F%2B%2Fandroid13-5.15%3Adrivers%2Fandroid%2Fbinder_alloc.c%3Bbpv%3D0%3Bbpt%3D0%3Bl%3D739",target:"_blank",rel:"noopener noreferrer"},k={href:"https://link.juejin.cn/?target=https%3A%2F%2Fcs.android.com%2Fandroid%2F_%2Fandroid%2Fkernel%2Fcommon%2F%2B%2Fandroid13-5.15%3Adrivers%2Fandroid%2Fbinder_alloc.c%3Bl%3D1207%3Bbpv%3D0%3Bbpt%3D0",target:"_blank",rel:"noopener noreferrer"},m=t(`<ol><li><p>通过 kmap 建立内核空间虚拟地址和物理页的映射</p></li><li><p>通过 copy_from_user 按页拷贝</p></li><li><p>通过 kunmap 取消映射</p></li></ol><h3 id="binder-alloc-mmap-handler" tabindex="-1"><a class="header-anchor" href="#binder-alloc-mmap-handler" aria-hidden="true">#</a> binder_alloc_mmap_handler()</h3><p>todo</p><h3 id="binder-alloc-copy-user-to-buffer" tabindex="-1"><a class="header-anchor" href="#binder-alloc-copy-user-to-buffer" aria-hidden="true">#</a> binder_alloc_copy_user_to_buffer()</h3><p>其代码如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">/**
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
 */</span>
<span class="token keyword">unsigned</span> <span class="token keyword">long</span>
<span class="token function">binder_alloc_copy_user_to_buffer</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">binder_alloc</span> <span class="token operator">*</span>alloc<span class="token punctuation">,</span>
				 <span class="token keyword">struct</span> <span class="token class-name">binder_buffer</span> <span class="token operator">*</span>buffer<span class="token punctuation">,</span>
				 <span class="token class-name">binder_size_t</span> buffer_offset<span class="token punctuation">,</span>
				 <span class="token keyword">const</span> <span class="token keyword">void</span> __user <span class="token operator">*</span>from<span class="token punctuation">,</span>
				 <span class="token class-name">size_t</span> bytes<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">check_buffer</span><span class="token punctuation">(</span>alloc<span class="token punctuation">,</span> buffer<span class="token punctuation">,</span> buffer_offset<span class="token punctuation">,</span> bytes<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span> bytes<span class="token punctuation">;</span>

	<span class="token keyword">while</span> <span class="token punctuation">(</span>bytes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">unsigned</span> <span class="token keyword">long</span> size<span class="token punctuation">;</span>
		<span class="token keyword">unsigned</span> <span class="token keyword">long</span> ret<span class="token punctuation">;</span>
		<span class="token keyword">struct</span> <span class="token class-name">page</span> <span class="token operator">*</span>page<span class="token punctuation">;</span>
		<span class="token class-name">pgoff_t</span> pgoff<span class="token punctuation">;</span>
		<span class="token keyword">void</span> <span class="token operator">*</span>kptr<span class="token punctuation">;</span>

		page <span class="token operator">=</span> <span class="token function">binder_alloc_get_page</span><span class="token punctuation">(</span>alloc<span class="token punctuation">,</span> buffer<span class="token punctuation">,</span>
					     buffer_offset<span class="token punctuation">,</span> <span class="token operator">&amp;</span>pgoff<span class="token punctuation">)</span><span class="token punctuation">;</span>
		size <span class="token operator">=</span> <span class="token class-name">min_t</span><span class="token punctuation">(</span><span class="token class-name">size_t</span><span class="token punctuation">,</span> bytes<span class="token punctuation">,</span> PAGE_SIZE <span class="token operator">-</span> pgoff<span class="token punctuation">)</span><span class="token punctuation">;</span>
		kptr <span class="token operator">=</span> <span class="token function">kmap</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span> <span class="token operator">+</span> pgoff<span class="token punctuation">;</span>
		ret <span class="token operator">=</span> <span class="token function">copy_from_user</span><span class="token punctuation">(</span>kptr<span class="token punctuation">,</span> from<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token function">kunmap</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">if</span> <span class="token punctuation">(</span>ret<span class="token punctuation">)</span>
			<span class="token keyword">return</span> bytes <span class="token operator">-</span> size <span class="token operator">+</span> ret<span class="token punctuation">;</span>
		bytes <span class="token operator">-=</span> size<span class="token punctuation">;</span>
		from <span class="token operator">+=</span> size<span class="token punctuation">;</span>
		buffer_offset <span class="token operator">+=</span> size<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="caller-binder-transaction" tabindex="-1"><a class="header-anchor" href="#caller-binder-transaction" aria-hidden="true">#</a> caller: binder_transaction()</h4><p>binder_alloc_copy_user_to_buffer 函数在 binder_transaction 中被调用。</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">binder_alloc_copy_user_to_buffer</span><span class="token punctuation">(</span>
				<span class="token operator">&amp;</span>target_proc<span class="token operator">-&gt;</span>alloc<span class="token punctuation">,</span>
				t<span class="token operator">-&gt;</span>buffer<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span>
				<span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">void</span> __user <span class="token operator">*</span><span class="token punctuation">)</span>
					<span class="token punctuation">(</span><span class="token class-name">uintptr_t</span><span class="token punctuation">)</span>tr<span class="token operator">-&gt;</span>data<span class="token punctuation">.</span>ptr<span class="token punctuation">.</span>buffer<span class="token punctuation">,</span>
				tr<span class="token operator">-&gt;</span>data_size<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre></div><p>重点关注其中的 buffer, 来自于 <strong>t-&gt;buffer</strong>, t 是一个 <em>struct</em> binder_transaction *t, binder_transaction 中有一个 binder_buffer 类型的成员变量; 其赋值的语句如下：</p><div class="language-c" data-ext="c"><pre class="language-c"><code>t <span class="token operator">=</span> <span class="token function">kzalloc</span><span class="token punctuation">(</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token operator">*</span>t<span class="token punctuation">)</span><span class="token punctuation">,</span> GFP_KERNEL<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><ul><li>第一个参数，含义为 size</li><li>第二个参数，含义为分配的内存类型</li></ul><p><code>kzalloc</code> 函数的定义和实现如下：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token comment">/**
 * kzalloc - allocate memory. The memory is set to zero.
 * @size: how many bytes of memory are required.
 * @flags: the type of memory to allocate (see kmalloc).
 */</span>
<span class="token keyword">static</span> <span class="token keyword">inline</span> <span class="token keyword">void</span> <span class="token operator">*</span><span class="token function">kzalloc</span><span class="token punctuation">(</span><span class="token class-name">size_t</span> size<span class="token punctuation">,</span> <span class="token class-name">gfp_t</span> flags<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token function">kmalloc</span><span class="token punctuation">(</span>size<span class="token punctuation">,</span> flags <span class="token operator">|</span> __GFP_ZERO<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p><code>kzalloc()</code> 分配一个指定大小的内存块，并将其初始化为 0。它类似于 <code>kmalloc()</code>，但会自动将分配的内存清零，以避免敏感数据泄露。</p><p>如果分配成功，则返回指向分配内存块的指针。注意，这个函数分配的是内核中的虚拟内存。</p><div class="hint-container tip"><p class="hint-container-title">关于 malloc 内存分配</p><p>malloc 内存分配的时候，内核会给申请者分配一个物理页，如果不够的话，再触发缺页异常。</p></div><hr><p>接下来再看 tr-&gt;data.ptr.buffer 的含义，这是第四个参数 <em>@from: userspace pointer to source buffer</em>；tr 是 binder_transaction 自带的参数，类型为 binder_transaction_data, 数据结构如下：</p><div class="language-c" data-ext="c"><pre class="language-c"><code>	<span class="token keyword">union</span> <span class="token punctuation">{</span>
		<span class="token keyword">struct</span> <span class="token punctuation">{</span>
			<span class="token comment">/* transaction data */</span>
			<span class="token class-name">binder_uintptr_t</span>	buffer<span class="token punctuation">;</span>
			<span class="token comment">/* offsets from buffer to flat_binder_object structs */</span>
			<span class="token class-name">binder_uintptr_t</span>	offsets<span class="token punctuation">;</span>
		<span class="token punctuation">}</span> ptr<span class="token punctuation">;</span>
		__u8	buf<span class="token punctuation">[</span><span class="token number">8</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span> data<span class="token punctuation">;</span>
</code></pre></div><p>最后一个参数也是来自于 tr.</p><h4 id="callee" tabindex="-1"><a class="header-anchor" href="#callee" aria-hidden="true">#</a> callee</h4>`,22);function b(v,f){const a=o("ExternalLinkIcon");return c(),l("div",null,[u,n("p",null,[n("strong",null,[n("a",d,[s("binder_alloc_mmap_handler()"),e(a)])]),s("：用户分配空间，参数 struct binder_alloc *alloc 和 struct vm_area_struct *vma")]),n("p",null,[n("strong",null,[n("a",k,[s("binder_alloc_copy_user_to_buffer()"),e(a)])]),s("：将客户端的数据 copy 到缓冲区，逐个物理页处理。")]),m])}const h=p(r,[["render",b],["__file","binder_02.html.vue"]]);export{h as default};
