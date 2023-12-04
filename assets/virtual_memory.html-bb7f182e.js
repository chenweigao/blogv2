import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as l,c as p,d as r,a as e,b as a,f as s}from"./app-22cda79c.js";const c={},h=s(`<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><p>本文主要讲述和理解虚拟内存（后文简称 VM， VA 等）的概念，行文可能较为跳跃，需要特别注意。</p><h2 id="virtual-memory" tabindex="-1"><a class="header-anchor" href="#virtual-memory" aria-hidden="true">#</a> Virtual Memory</h2><h3 id="abstract-1" tabindex="-1"><a class="header-anchor" href="#abstract-1" aria-hidden="true">#</a> Abstract</h3><blockquote><p>Virtual memory is a technique used by operating systems to enable programs to <strong>use more memory than is physically available</strong> in the system. When a program accesses memory, the address it uses is a virtual address, which is <strong>translated by the hardware into a physical address</strong> that corresponds to a location in physical memory. This translation process can be slow, especially if it has to be performed every time the program accesses memory.</p></blockquote><details class="hint-container details"><summary>自己的简单理解 2023-03-02</summary><ol><li>虚拟内存的存在使得程序可以使用比可用物理内存更多的存储空间（程序员想要无限多的存储空间）</li><li>虚拟地址是由物理地址转化而来的</li><li>这种转换过程一般会比较缓慢（引出后续 TLB）</li></ol></details><h3 id="虚拟内存与进程" tabindex="-1"><a class="header-anchor" href="#虚拟内存与进程" aria-hidden="true">#</a> 虚拟内存与进程</h3><p>关于虚拟内存与进程的关系，有一些新的理解：虚拟内存是保证进程之间隔离的重要机制之一。</p><p>从目前得到的信息而言，内核使用以下的技术来保证进程之间的隔离：</p><pre><code>  1. 虚拟内存
  2. 进程控制块(PCB)
</code></pre><p>对于虚拟内存而言，每个进程都有自己的地址空间，其中包含代码、数据和栈。这样，每个进程之间的内存空间都是相互隔离的，一个进程无法访问另一个进程的内存。</p><p>🐇🐇🐇 那么，虚拟内存具体是如何实现进程之间的隔离的？<br> 虚拟内存为每个进程提供了单独的地址空间，以实现进程之间的隔离。这种隔离是把物理内存分成大小相等的页来实现的（从虚拟内存的角度看，页就是内存的最小单位）；当进程访问其虚拟地址空间中的某个页时，操作系统会加载虚拟页对应的物理页（MMU: 将虚拟地址转化为物理地址），在这个过程中，操作系统会检查当前进程是否有权限访问该页面。也就是说：一个进程无法访问其他进程的地址空间。</p><p>问题：两个进程的虚拟地址空间可能会是什么样子的？</p><p>进程 A 的虚拟地址空间：</p><p>0x00000000 ~ 0x7fffffff 用户空间<br> 0x80000000 ~ 0xffffffff 内核空间</p><p>进程 B 的虚拟地址空间：</p><p>0x00000000 ~ 0x7fffffff 用户空间<br> 0x80000000 ~ 0xffffffff 内核空间</p><p>A, B 是两个独立的进程，所以虽然用户空间的地址范围相同，但是使用的虚拟地址是不同的；哪怕虚拟地址相同，也会对应不同的物理地址。</p><h3 id="虚拟进程与页表" tabindex="-1"><a class="header-anchor" href="#虚拟进程与页表" aria-hidden="true">#</a> 虚拟进程与页表</h3><p>我们上面说，进程隔离的一个很重要的机制保证就是虚拟内存，那么从底层来看，是怎么实现的呢？答案是<strong>页表</strong>，笔者对页表的理解如下：</p><ol><li><p>每个进程都拥有自己的页表；<br> 具体而言，Linux 为每个进程都维护一个 <code>task_struct</code> 结构体（进程描述符 PCB, 无论怎么称呼），task_struct -&gt; mm_struct 结构体成员用来保存该进程的页表。</p><blockquote><p>在进程切换的过程中，内核把新的页表的地址写入 CR3 控制寄存器。CR3中含有页目录表的物理内存基地址，因此该寄存器也被称为页目录基地址寄存器 PDBR(Page-Directory Base address Register)<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup></p></blockquote></li><li><p>每个进程（线程）绑定到自己的页表，页表不同意味着物理页不同（MMU 负责地址转换，不同的页表无法对应到一个物理页）</p></li></ol><p>对于一个进程而言，操作系统如何保证其访问权限？检查当前操作系统进程是否可以访问目标内存地址，具体到指令级别：验证当前指令是否允许访问特定内存地址；这个过程的实现是通过 MMU 来做的：CPU生成一个虚拟地址，虚拟地址经过 MMU 进行转换，将虚拟地址分解为页号和页内偏移，然后 MMU 查找页表，计算出最终的物理地址，查找时会检测非法或者权限。</p><p>OK，现在有一个很重要的问题：进程间通信的时候，我们都需要把数据 copy 到 kernel space, 因为进程的地址空间是隔离的，而 kernel space 是进程共享的；如果说，我们要绕过 kernel 直接进行进程间通信，需要解决以下问题：</p><ol><li>如何在用户态能看到其他进程的页表？（假设现在我们不用 Linux, 我们自己是可以实现这样的机制的）</li><li>如果说直接访问其他进程的页表有安全隐患，那么我们是否可以在用户态创建一个共享的页表？</li></ol><h3 id="understanding" tabindex="-1"><a class="header-anchor" href="#understanding" aria-hidden="true">#</a> Understanding</h3>`,25),d=s('<ul><li><p>虚拟内存可以理解成在主存和辅存（磁盘、硬盘）之间进行数据缓存管理的一级存储层次。</p><blockquote><p>Virtual memory is the name for the level of memory hierarchy that manages <strong>caching</strong> between the <strong>main memory</strong> and <strong>secondary memory</strong>.</p></blockquote><p>从这个原文中我们理解，其本质还是可以理解为一个 cache.</p></li><li><p>虚拟内存允许单个程序将其地址空间扩展到超出主存的限制。</p><p>这句话我是这么理解的：虚拟内存一般可以设置为主存的 1.5 倍大小（建议值），主存也可以理解为辅存的 cache, 所以说虚拟内存在主存和辅存之间，其最大的大小限制应该是辅存的大小。</p><p>虽然虚拟存储是为了小容量的存储看起来像大容量的存储，但是主存和辅存之间的性能差异意味着，如果程序经常访问比它拥有的物理存储更多的虚拟存储，程序运行会非常慢。这样的程序会不停的在主存和辅存之间交换页面，这种情况称作：<strong>thrashing</strong></p></li><li><p>虚拟内存支持以<strong>受保护的方式</strong>在多个同时活跃的进程之间共享主存。</p><p>为什么要用受保护的方式，其原因有 2 点：</p><ol><li>保护多个应用程序不会同时访问到同一块物理地址。（官方行文：允许多个进程共享一个主存；保护机制确保：一个恶意进程不能写另一个用户进程或者操作系统的地址空间）</li><li>防止一个进程读另一个进程的数据</li></ol><p>🟠🟠 这边还涉及到一个问题，就是进程切换的时候，页表是怎么处理的？</p></li></ul><h2 id="tlb" tabindex="-1"><a class="header-anchor" href="#tlb" aria-hidden="true">#</a> TLB</h2><h3 id="what-is-tlb" tabindex="-1"><a class="header-anchor" href="#what-is-tlb" aria-hidden="true">#</a> What is TLB?</h3><blockquote><p>TLB stands for <strong>Translation Lookaside Buffer</strong>, and it is a <strong>hardware cache</strong> that is used in computer architecture to <strong>speed up virtual memory access.</strong></p></blockquote><blockquote><p>The TLB is a cache that stores recently used virtual-to-physical address translations, making it possible to <strong>quickly retrieve the physical address</strong> for a given virtual address. When a program requests a memory access, the hardware first checks the TLB to see if it contains the translation for the virtual address. If the translation is in the TLB, the hardware can use it to quickly access the corresponding physical address. If the translation is not in the TLB, the hardware has to perform the translation, which takes more time.</p></blockquote><details class="hint-container details"><summary>对上述描述的简单理解</summary><ol><li>TLB 存储了最近使用过的 <em>virtual-to-physical</em> 地址转换；这也印证了为什么有些说法称 TLB 就像缓存中的一个条目，TLB 就是缓存了这一转换信息</li><li>程序访存请求过来以后，硬件会首先检查 TLB, 命中的话，很快返回虚拟地址对应的物理地址；如果缺失的话，就需要花费较多的时间进行地址转换</li></ol></details><p>也可以这么称呼：<strong>加快地址转化：TLB</strong>。TLB 的一些描述可以参考如下：</p><ul><li><p>页表存储在主存中，所以程序的每次访存请求至少需要两次访问：查页表获得物理地址、获得物理地址中的数据。</p></li><li><p>现代处理器设计了一个特殊的 cache 用于追踪最近使用过的地址转化（应用局部性原理），这个 cache 结构称为快表（TLB）</p><p>简而言之：TLB 作为页表的 cache 而存在（注意页表是在主存中，方便理解 ）</p></li><li><p>TLB 的结构和原理如下图：</p></li></ul><p>​ @todo 💚💚💚 TLB 结构图</p><h3 id="tlb-miss" tabindex="-1"><a class="header-anchor" href="#tlb-miss" aria-hidden="true">#</a> TLB Miss</h3><blockquote><p>A TLB miss occurs when the hardware attempts to translate a virtual memory address into a physical memory address and <strong>cannot find the translation in the Translation Lookaside Buffer (TLB)</strong>. When this happens, the hardware has to <strong>perform a full page table walk</strong> to find the translation, which is a more time-consuming process than using the TLB.</p></blockquote><p>TLB 失效，顾名思义就是 TLB 中没有表项能与虚拟地址匹配。按照上面的说法就是，TLB 失效是在 TLB 中没有找到地址转换。</p><p>TLB 失效表明两种可能性之一：</p><ol><li>页在内存中，但是 TLB 中没有创建</li><li>页不在内存中，需要把控制权转接给操作系统处理缺页失效</li></ol><blockquote><p>TLB misses can happen for several reasons. For example, if a <strong>program accesses memory that has not been recently accessed</strong>, the corresponding translation may have been evicted from the TLB due to space constraints. Similarly, TLB misses can occur when the <strong>operating system swaps pages</strong> in and out of physical memory, or when a program executes a system call that causes a context switch.</p></blockquote><p>TLB 失效的原因可能是：</p><ol><li>程序访问的地址近期没有被访问过，由于 TLB 空间的限制，这个 translation 可能就没有被存储在 TLB 中（page 在内存中）</li><li>操作系统 swap pages(page 没在内存中)</li></ol><p>这两者就可以对应上述两点 TLB 失效的两种可能。</p><div class="hint-container note"><p class="hint-container-title">如何处理缺页失效或者 TLB 失效？</p><p>核心：通过<strong>例外机制</strong>来中断活跃进程，将控制转移到操作系统，然后再恢复执行被中断的进程。</p><p>两个特殊的控制寄存器：SEPC 和 SCAUSE.</p></div><p>除此之外，如果我们检测到某个系统的 TLB Miss 比较高的话，可以使用如下的措施：</p><blockquote><p>To mitigate the impact of TLB misses, modern processors often employ techniques such as <strong>multi-level TLBs</strong>, <strong>TLB prefetching</strong>, and <strong>hardware page table walkers</strong>, which can reduce the likelihood and latency of TLB misses. Additionally, operating systems can optimize memory management strategies to minimize the number of TLB misses, such as using <strong>huge pages</strong> or transparent huge pages to reduce the size of page tables and increase TLB hit rates.</p></blockquote><ol><li>multi-level TLBs (two-level page table structure in arm)</li><li>TLB prefetching</li><li>hardware page table walkers</li><li>huge pages(reduce page table size, increase TLB hit)</li></ol><h2 id="page" tabindex="-1"><a class="header-anchor" href="#page" aria-hidden="true">#</a> Page</h2><p>💚💚💚💚 @todo 这边附上图 5-28</p><h3 id="页面大小的权衡" tabindex="-1"><a class="header-anchor" href="#页面大小的权衡" aria-hidden="true">#</a> 页面大小的权衡</h3><p>页面大小是比较常见的体系结构参数。如果选择一个偏大的页面的话，其优点可以如下所示：</p><ol><li>页表的大小与页面的大小成反比；增大页面的大小可以节省存储器；</li><li>较大页面可使得缓存更大；</li><li>传递较大页面效率更高；</li><li>TLB 的条目数量有限，较大页面意味着可以高效地映射更多存储器，最终可以减少 TLB 缺失</li></ol><p>较小页面则可以节省内存，防止内部碎片化；还有一个问题就是较大的页面可能会延长调用一个进程的时间，因为进程启动的时候，很多进程很小。</p><div class="hint-container note"><p class="hint-container-title">页表和 TLB 的关系</p><p>TLB 用于加速虚拟地址到物理地址的映射过程，而页表是实现虚拟内存管理的核心数据结构之一。如果 TLB 中没有缓存映射关系的话，CPU 就需要对页表进行查找，并将这个映射关系添加到 TLB 中以供下次使用。</p></div><h3 id="page-fault" tabindex="-1"><a class="header-anchor" href="#page-fault" aria-hidden="true">#</a> Page Fault</h3><ul><li><p>如果 virtual page 的有效位无效，那么就发生缺页失效。其本质是程序在执行过程中中需要访问的某一页数据或者代码不在内存中。</p></li><li><p>缺页失效发生的时候，如果内存中的所有页表都在使用的话，需要选择一页进行替换。</p></li><li><p>替换的时候使用近似 LRU 算法，因为实现完整的 LRU 算法代价太高。ARM V8 使用了一个 access bit 来实现这个。</p></li></ul><h3 id="virtual-page-number-and-page-offset" tabindex="-1"><a class="header-anchor" href="#virtual-page-number-and-page-offset" aria-hidden="true">#</a> Virtual page number and Page offset</h3><p>Virtual Address 可以分为两个部分：Virtual page number 和 Page offset, 可以翻译为虚拟页号和页内偏移量。</p><h4 id="virtual-page-number" tabindex="-1"><a class="header-anchor" href="#virtual-page-number" aria-hidden="true">#</a> Virtual Page Number</h4><p>Virtual Page Number (VPN) 是用于标识要访问的 page, 这个字段会用于虚拟地址到物理地址的转换。</p>',35),m=e("p",null,[a("VPN 的大小取决于虚拟地址空间的和虚拟存储系统使用的 page 大小；举例而言，一个系统有 32-bit 虚拟地址，4KB page, 则 VPN 的大小为 "),e("span",{class:"katex"},[e("span",{class:"katex-mathml"},[e("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[e("semantics",null,[e("mrow",null,[e("msup",null,[e("mn",null,"2"),e("mn",null,"20")])]),e("annotation",{encoding:"application/x-tex"},"2^{20}")])])]),e("span",{class:"katex-html","aria-hidden":"true"},[e("span",{class:"base"},[e("span",{class:"strut",style:{height:"0.8141em"}}),e("span",{class:"mord"},[e("span",{class:"mord"},"2"),e("span",{class:"msupsub"},[e("span",{class:"vlist-t"},[e("span",{class:"vlist-r"},[e("span",{class:"vlist",style:{height:"0.8141em"}},[e("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[e("span",{class:"pstrut",style:{height:"2.7em"}}),e("span",{class:"sizing reset-size6 size3 mtight"},[e("span",{class:"mord mtight"},[e("span",{class:"mord mtight"},"20")])])])])])])])])])])]),a(" bit, 其需要在地址空间中表示 "),e("span",{class:"katex"},[e("span",{class:"katex-mathml"},[e("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[e("semantics",null,[e("mrow",null,[e("msup",null,[e("mn",null,"2"),e("mn",null,"20")])]),e("annotation",{encoding:"application/x-tex"},"2^{20}")])])]),e("span",{class:"katex-html","aria-hidden":"true"},[e("span",{class:"base"},[e("span",{class:"strut",style:{height:"0.8141em"}}),e("span",{class:"mord"},[e("span",{class:"mord"},"2"),e("span",{class:"msupsub"},[e("span",{class:"vlist-t"},[e("span",{class:"vlist-r"},[e("span",{class:"vlist",style:{height:"0.8141em"}},[e("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[e("span",{class:"pstrut",style:{height:"2.7em"}}),e("span",{class:"sizing reset-size6 size3 mtight"},[e("span",{class:"mord mtight"},[e("span",{class:"mord mtight"},"20")])])])])])])])])])])]),a(" 个 page. 对于为什么需要 20 bit, 其计算方法就是 "),e("span",{class:"katex"},[e("span",{class:"katex-mathml"},[e("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[e("semantics",null,[e("mrow",null,[e("mn",null,"32"),e("mo",null,"−"),e("mn",null,"12"),e("mo",null,"="),e("mn",null,"20")]),e("annotation",{encoding:"application/x-tex"},"32 - 12 = 20")])])]),e("span",{class:"katex-html","aria-hidden":"true"},[e("span",{class:"base"},[e("span",{class:"strut",style:{height:"0.7278em","vertical-align":"-0.0833em"}}),e("span",{class:"mord"},"32"),e("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),e("span",{class:"mbin"},"−"),e("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),e("span",{class:"base"},[e("span",{class:"strut",style:{height:"0.6444em"}}),e("span",{class:"mord"},"12"),e("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),e("span",{class:"mrel"},"="),e("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),e("span",{class:"base"},[e("span",{class:"strut",style:{height:"0.6444em"}}),e("span",{class:"mord"},"20")])])]),a(", 其中 4KB 的 page 占用了 12 bit 的标识，剩下的 20 位就留给了 VPN.")],-1),u=s('<p>❤️❤️❤️ <strong>VPN and TLB</strong></p><p>VPN 和 TLB 之间的关系需要加以理解：</p><blockquote><p>When a program accesses a virtual memory address, the processor extracts the virtual page number from the address and uses it as the index into the TLB cache.</p></blockquote><p>从上面可知：VPN 用于索引 TLB, 即 VPN -&gt; PPN(Physical Page Number).</p><details class="hint-container details"><summary>个人理解 TLB 和 VPN</summary><p>对于上面的解释，如果我们假定有 20 bit 用于 VPN, 那么 TLB 的 tag compare address + TLB index (这两个合起来就是 TLB entry) 的大小就为 20 bit.</p><p>(not sure) TLB index 的大小取决于 TLB 的映射方式，或者说，取决于 TLB entires 的数量 (<em>The TLB contains <strong>entries</strong> that map virtual page numbers to physical page numbers, along with other metadata such as access permissions and cache coherency information.</em>)。</p><p>当 TLB index 确定的时候，TLB tag compare address 的位数也就确定了。</p></details><h4 id="page-offset" tabindex="-1"><a class="header-anchor" href="#page-offset" aria-hidden="true">#</a> Page Offset</h4><p>Page Offset 用于确定页表中数据的具体位置，通常而言，其比 Virtual page number 要小。以一个 4KB 的 page 而言，其需要 12 bit 来标识在这个 4KB page 中的 byte offset.</p><h3 id="页表的映射方式" tabindex="-1"><a class="header-anchor" href="#页表的映射方式" aria-hidden="true">#</a> 页表的映射方式？</h3><p>页表通常选择使用全相联的方式，出于以下几个原因（页表使用全相联 + 额外的页表）：</p><ol><li>全相联具有优越性，因为失效代价比较高</li><li>全相联允许软件使用负责的替换策略以降低失效率</li><li>全相联很容易索引，并且不需要额外的硬件，也不需要进行查找</li></ol><h3 id="tlb-和-cache-的映射方式" tabindex="-1"><a class="header-anchor" href="#tlb-和-cache-的映射方式" aria-hidden="true">#</a> TLB 和 cache 的映射方式？</h3><p>通常选用组相连，一些系统使用直接映射，看中其访问时间短并且实现简单。</p><hr class="footnotes-sep">',13),g={class:"footnotes"},f={class:"footnotes-list"},b={id:"footnote1",class:"footnote-item"},y={href:"https://www.zhihu.com/question/63375062/answer/1403291487",target:"_blank",rel:"noopener noreferrer"},L=e("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1);function B(T,x){const n=t("Mermaid"),i=t("ExternalLinkIcon");return l(),p("div",null,[h,r(n,{id:"mermaid-114",code:"eJxLy8kvT85ILCpR8Ani4sxMMdR4MXPWs+75T9tan66doQkW0jXUeLJjN5D7dFLPi30g8Sc7u19O3/J8VsvzPZMRyow0ns7Z8HRuw/OVu4CyL7a1vtjfDtEIVWAMMxxoVNOKJzvWAk14sn/us64lEAUKurp2CmALFdTAtBGUNobqB7rk6ZJZT3aserpryvMpK56v6H66q//Fuv0vp6973rny+YQ2iANg1gFd9GTHEqDyZ1t2v9je/GL/bJCO1o1Pdq1GdRfcYqANMCt1jbgAiI2M5g=="}),d,m,u,e("section",g,[e("ol",f,[e("li",b,[e("p",null,[e("a",y,[a("知乎：操作系统中的多级页表到底是为了解决什么问题？"),r(i)]),a(),L])])])])])}const w=o(c,[["render",B],["__file","virtual_memory.html.vue"]]);export{w as default};
