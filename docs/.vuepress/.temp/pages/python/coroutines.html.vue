<template><p>因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。</p>
<p>相当于每个 CPU 在同一时间只能执行一个线程。</p>
<!-- more -->
<h2 id="q-a" tabindex="-1"><a class="header-anchor" href="#q-a" aria-hidden="true">#</a> Q&amp;A</h2>
<ol>
<li>
<p>GIL 是多线程、多进程的吗？
某个线程想要执行，必须先拿到GIL，我们可以把GIL看作是“通行证”，并且在一个python进程中，GIL只有一个。拿不到通行证的线程，就不允许进入CPU执行。</p>
<blockquote>
<p>解释器被一个全局解释器锁保护着，它确保任何时候都只有一个Python线程执行</p>
</blockquote>
<ul>
<li>Python中同一时刻有且只有一个线程会执行</li>
<li>Python中的多个线程由于GIL锁的存在无法利用多核CPU</li>
<li>Python中的多线程不适合计算密集型的程序</li>
</ul>
<blockquote>
<p>CPython 中使用多线程很容易，但它并不是真正的并发，多进程虽然是并发的，但开销却极大。</p>
</blockquote>
</li>
</ol>
<h2 id="why-coroutiones" tabindex="-1"><a class="header-anchor" href="#why-coroutiones" aria-hidden="true">#</a> Why Coroutiones</h2>
<ul>
<li>Python 的多线程不能利用多核CPU</li>
</ul>
<p>因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。</p>
<p>相当于每个 CPU 在同一时间只能执行一个线程。</p>
<h2 id="计算密集和i-o-密集" tabindex="-1"><a class="header-anchor" href="#计算密集和i-o-密集" aria-hidden="true">#</a> 计算密集和I/O 密集</h2>
<h3 id="计算密集型" tabindex="-1"><a class="header-anchor" href="#计算密集型" aria-hidden="true">#</a> 计算密集型</h3>
<p>也叫 CPU 密集型，主要特点是要进行大量的计算，消耗CPU资源，比如计算圆周率、对视频进行高清解码等等，全靠CPU的运算能力。这种计算密集型任务虽然也可以用多任务完成，但是任务越多，花在任务切换的时间就越多，CPU 执行任务的效率就越低，所以，要最高效地利用 CPU，计算密集型任务同时进行的数量应当等于 CPU 的核心数。</p>
<p>计算密集型任务由于主要消耗 CPU 资源，因此，代码运行效率至关重要。Python 这样的脚本语言运行效率很低，完全不适合计算密集型任务。对于计算密集型任务，最好用 C 语言编写。</p>
<h3 id="i-o-密集型" tabindex="-1"><a class="header-anchor" href="#i-o-密集型" aria-hidden="true">#</a> I/O 密集型</h3>
<p>IO 密集型涉及到网络、磁盘 IO 的任务都是 IO 密集型任务，这类任务的特点就是 CPU 消耗很少，任务大部分时间都在等待 IO 操作完成。</p>
<h2 id="协程上下文切换" tabindex="-1"><a class="header-anchor" href="#协程上下文切换" aria-hidden="true">#</a> 协程上下文切换</h2>
<p>协程拥有自己的寄存器上下文和栈。协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈，直接操作栈没有内核切换的开销，可以不加锁地访问全局变量，所以上下文的切换非常快。</p>
<p>💁‍♂️对比与进程和线程的调度（上下文切换）：</p>
<ul>
<li>进程：切换进程上下文，包括分配的内存，数据段，附加段，堆栈段，代码段等</li>
<li>线程：切换线程上下文，主要切换堆栈，以及各寄存器。同一个进程里面不同的线程主要是堆栈不同。</li>
</ul>
<h2 id="python-多线程结论" tabindex="-1"><a class="header-anchor" href="#python-多线程结论" aria-hidden="true">#</a> Python 多线程结论</h2>
<p>综上，Python 多线程相当于单核多线程。</p>
<p>多线程有两个好处：CPU 并行，IO 并行，单核多线程无法使用多核 CPU，所以在 Python中不能使用多线程来使用多核。</p>
<h2 id="并发和并行" tabindex="-1"><a class="header-anchor" href="#并发和并行" aria-hidden="true">#</a> 并发和并行</h2>
<h3 id="并发" tabindex="-1"><a class="header-anchor" href="#并发" aria-hidden="true">#</a> 并发</h3>
</template>
