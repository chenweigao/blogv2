import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as p,e as t,a as n,f as o}from"./app-22cda79c.js";const e={},c=n("p",null,"因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。",-1),l=n("p",null,"相当于每个 CPU 在同一时间只能执行一个线程。",-1),i=n("p",null,"本文还研究了 python 多进程的相关实现。",-1),u=o(`<h2 id="q-a" tabindex="-1"><a class="header-anchor" href="#q-a" aria-hidden="true">#</a> Q&amp;A</h2><ol><li><p>GIL 是多线程、多进程的吗？<br> 某个线程想要执行，必须先拿到GIL，我们可以把GIL看作是“通行证”，并且在一个python进程中，GIL只有一个。拿不到通行证的线程，就不允许进入CPU执行。</p><blockquote><p>解释器被一个全局解释器锁保护着，它确保任何时候都只有一个Python线程执行</p></blockquote><ul><li>Python中同一时刻有且只有一个线程会执行</li><li>Python中的多个线程由于GIL锁的存在无法利用多核CPU</li><li>Python中的多线程不适合计算密集型的程序</li></ul><blockquote><p>CPython 中使用多线程很容易，但它并不是真正的并发，多进程虽然是并发的，但开销却极大。</p></blockquote></li></ol><h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><h3 id="why-coroutiones" tabindex="-1"><a class="header-anchor" href="#why-coroutiones" aria-hidden="true">#</a> Why Coroutiones</h3><ul><li>Python 的多线程不能利用多核CPU</li></ul><p>因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。</p><p>相当于每个 CPU 在同一时间只能执行一个线程。</p><h3 id="计算密集和i-o-密集" tabindex="-1"><a class="header-anchor" href="#计算密集和i-o-密集" aria-hidden="true">#</a> 计算密集和I/O 密集</h3><ul><li><p>计算密集型也叫 CPU 密集型，主要特点是要进行大量的计算，消耗CPU资源，比如计算圆周率、对视频进行高清解码等等，全靠CPU的运算能力。这种计算密集型任务虽然也可以用多任务完成，但是任务越多，花在任务切换的时间就越多，CPU 执行任务的效率就越低，所以，要最高效地利用 CPU，计算密集型任务同时进行的数量应当等于 CPU 的核心数。计算密集型任务由于主要消耗 CPU 资源，因此，代码运行效率至关重要。Python 这样的脚本语言运行效率很低，完全不适合计算密集型任务。对于计算密集型任务，最好用 C 语言编写。</p></li><li><p>IO 密集型涉及到网络、磁盘 IO 的任务都是 IO 密集型任务，这类任务的特点就是 CPU 消耗很少，任务大部分时间都在等待 IO 操作完成。</p></li></ul><h3 id="并发与并行" tabindex="-1"><a class="header-anchor" href="#并发与并行" aria-hidden="true">#</a> 并发与并行</h3><p>并发 concurreny 指的是同一时刻只能有一个程序在运行；</p><p>并行 parallelism 与并发的区别在于，其强调计算机确实能够在同一时刻做许多不同的事情。</p><h2 id="协程上下文切换" tabindex="-1"><a class="header-anchor" href="#协程上下文切换" aria-hidden="true">#</a> 协程上下文切换</h2><p>协程拥有自己的寄存器上下文和栈。协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈，直接操作栈没有内核切换的开销，可以不加锁地访问全局变量，所以上下文的切换非常快。</p><p>💁‍♂️对比与进程和线程的调度（上下文切换）：</p><ul><li>进程：切换进程上下文，包括分配的内存，数据段，附加段，堆栈段，代码段等</li><li>线程：切换线程上下文，主要切换堆栈，以及各寄存器。同一个进程里面不同的线程主要是堆栈不同。</li></ul><h2 id="python-多线程结论" tabindex="-1"><a class="header-anchor" href="#python-多线程结论" aria-hidden="true">#</a> Python 多线程结论</h2><p>综上，Python 多线程相当于单核多线程。</p><p>多线程有两个好处：CPU 并行，IO 并行，单核多线程无法使用多核 CPU，所以在 Python中不能使用多线程来使用多核。</p><h2 id="multiprocessing" tabindex="-1"><a class="header-anchor" href="#multiprocessing" aria-hidden="true">#</a> multiprocessing</h2><p>Python 多进程可以使用 <code>multiprocessing</code> 模块。</p><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h3><p>这是一个基本的例子：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">import</span> multiprocessing
<span class="token keyword">import</span> time

<span class="token keyword">def</span> <span class="token function">task</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;Sleeping for 0.5 seconds&#39;</span><span class="token punctuation">)</span>
    time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;Finished sleeping&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&quot;__main__&quot;</span><span class="token punctuation">:</span> 
    start_time <span class="token operator">=</span> time<span class="token punctuation">.</span>perf_counter<span class="token punctuation">(</span><span class="token punctuation">)</span>
    processes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token comment"># Creates 10 processes then starts them</span>
    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        p <span class="token operator">=</span> multiprocessing<span class="token punctuation">.</span>Process<span class="token punctuation">(</span>target <span class="token operator">=</span> task<span class="token punctuation">)</span>
        p<span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>
        processes<span class="token punctuation">.</span>append<span class="token punctuation">(</span>p<span class="token punctuation">)</span>
    
    <span class="token comment"># Joins all the processes </span>
    <span class="token keyword">for</span> p <span class="token keyword">in</span> processes<span class="token punctuation">:</span>
        p<span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">)</span>

    finish_time <span class="token operator">=</span> time<span class="token punctuation">.</span>perf_counter<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&quot;Program finished in </span><span class="token interpolation"><span class="token punctuation">{</span>finish_time<span class="token operator">-</span>start_time<span class="token punctuation">}</span></span><span class="token string"> seconds&quot;</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于可以迭代的对象，可以使用 <code>p.map</code>:</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">pattern_all_count_mp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
    all_functions <span class="token operator">=</span> find_all_functions<span class="token punctuation">(</span><span class="token punctuation">)</span>
    p <span class="token operator">=</span> mp<span class="token punctuation">.</span>Pool<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span>
    p<span class="token punctuation">.</span><span class="token builtin">map</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>count_function_pattern_distance_with_others_mp<span class="token punctuation">,</span> all_functions<span class="token punctuation">)</span>
    p<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>
    p<span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre></div><p>在上面的函数中，我们传入了 list 的 <code>all_functions</code>, 这个迭代器，而函数 <code>count_function_pattern_distance_with_others_mp()</code> 接收的是 <code>function</code> 对象。</p><p>对于普通的函数调用，可以这么来写：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">test07</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># 筛选 ed == 0 的阈值大于 10 的 pattern, len 长度为 6</span>
    threshold <span class="token operator">=</span> <span class="token number">10</span>
    file_name <span class="token operator">=</span> <span class="token string">&#39;dis_count_ed_0_len6.txt&#39;</span>
    p <span class="token operator">=</span> multiprocessing<span class="token punctuation">.</span>Pool<span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span>
    p<span class="token punctuation">.</span>apply_async<span class="token punctuation">(</span>self<span class="token punctuation">.</span>s<span class="token punctuation">.</span>filter_data<span class="token punctuation">,</span> args<span class="token operator">=</span><span class="token punctuation">(</span>threshold<span class="token punctuation">,</span> file_name<span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token comment"># self.s.filter_data(threshold, file_name, 6)</span>
    p<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>
    p<span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre></div><p>为了确保进程都关闭掉了，可以加上<code>try..finally</code> 结构，以确保最后的进程是正常结束了。</p><h3 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h3><p><code>join</code>([<em>timeout</em>]),</p><p>一般这行代码会放在我们多进程完成以后的最后一句使用。</p><h2 id="processpoolexecutor" tabindex="-1"><a class="header-anchor" href="#processpoolexecutor" aria-hidden="true">#</a> ProcessPoolExecutor</h2><p>除了 <code>multiprocessing</code> 模块之外，我们也可以使用 <code>ProcessPoolExecutor</code> 进行并行程序的执行。</p><h3 id="实例" tabindex="-1"><a class="header-anchor" href="#实例" aria-hidden="true">#</a> 实例</h3><p>先举一个在项目中遇到的实例，用于说明 python 多进程程序的运行原理。</p><ul><li><p>我们有一个函数，其需要使用多进程进行运行：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">PatternAllSimilar</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">pattern_all</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> not_use<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token comment">#.. function code</span>
</code></pre></div><p>需要注意，因为笔者现在还不确定这个使用方式是不是可以不指定给多进行迭代的参数（后文确定了，该接口是必须有这个的），所以定义了一个 <code>not_use</code> 参数，上层会进行传递，但是在函数中不会对其使用。</p></li><li><p>现在可以使用多进程运行之：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&#39;__main__&#39;</span><span class="token punctuation">:</span>
    logging<span class="token punctuation">.</span>basicConfig<span class="token punctuation">(</span>stream<span class="token operator">=</span>sys<span class="token punctuation">.</span>stdout<span class="token punctuation">,</span> level<span class="token operator">=</span>logging<span class="token punctuation">.</span>INFO<span class="token punctuation">)</span>
    s <span class="token operator">=</span> PatternAllSimilar<span class="token punctuation">(</span><span class="token punctuation">)</span>
    not_use <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> ProcessPoolExecutor<span class="token punctuation">(</span>max_workers<span class="token operator">=</span><span class="token number">8</span><span class="token punctuation">)</span> <span class="token keyword">as</span> pool<span class="token punctuation">:</span>
        <span class="token keyword">for</span> _ <span class="token keyword">in</span> pool<span class="token punctuation">.</span><span class="token builtin">map</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>pattern_all<span class="token punctuation">,</span> not_use<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">pass</span>
    pool<span class="token punctuation">.</span>shutdown<span class="token punctuation">(</span>cancel_futures<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
</code></pre></div><p>笔者在调试这个多进程程序的时候，发现其一直不 work，表现在不进入多进程的程序中，程序一闪而过就执行完了，最后找了很多资料，发觉需要注意以下几点：</p><ol><li><p>如果有文件操作，确定指定了正确的文件路径；所以说我们在执行的时候可以使用下面的逻辑来检查文件和 <code>sys.path</code> 的正确性：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">if</span> <span class="token keyword">not</span> os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>exists<span class="token punctuation">(</span>s<span class="token punctuation">.</span>file_split<span class="token punctuation">)</span><span class="token punctuation">:</span>
    logging<span class="token punctuation">.</span>error<span class="token punctuation">(</span><span class="token string">&quot;The file {} is not exists!!&quot;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>file_split<span class="token punctuation">)</span><span class="token punctuation">)</span>
    logging<span class="token punctuation">.</span>debug<span class="token punctuation">(</span><span class="token string">&quot;sys.path is {}&quot;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>sys<span class="token punctuation">.</span>path<span class="token punctuation">)</span><span class="token punctuation">)</span>
    exit<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment"># if in __mian__</span>
</code></pre></div></li><li><p>确保我们的多进程的相关执行在 <code>__main__</code> 函数中；</p></li><li><p>使用 <code>with</code> 语句，并且最后对多进程进行关闭。</p></li></ol></li></ul><h3 id="about-pool-map" tabindex="-1"><a class="header-anchor" href="#about-pool-map" aria-hidden="true">#</a> About pool.map</h3><div class="hint-container warning"><p class="hint-container-title">注意</p><p>在深入使用了这个接口以后，我发现其并不能很好地适用于所有的并行场景。这种方法要求必须是一个迭代器传入给函数，然后函数负责单一一次的计算，所以说要使用这个接口来进行并行计算的话，是需要传入我们需要计算的迭代器对象的，这就意味着，要传入一个<strong>很大的对象</strong>，内存此时就不够了。</p><p>所以说，这个方法由于上述限制，提升的性能十分有限。</p></div><p>为了解决这个问题，笔者在尝试了很久之后，发现可以使用迭代器去生成大的数组，其中逻辑比较绕，代码如下：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">get_all_pattern_list</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> <span class="token builtin">file</span><span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> <span class="token builtin">file</span><span class="token punctuation">:</span>
            <span class="token builtin">file</span> <span class="token operator">=</span> self<span class="token punctuation">.</span>file_split
        pattern_list <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token builtin">file</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> fs<span class="token punctuation">:</span>
            <span class="token keyword">for</span> idx <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>get_line_count<span class="token punctuation">(</span>fs<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>pattern_len<span class="token punctuation">)</span><span class="token punctuation">:</span>
                logging<span class="token punctuation">.</span>debug<span class="token punctuation">(</span><span class="token string">&#39;start to get line {} pattern&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>idx<span class="token punctuation">)</span><span class="token punctuation">)</span>
                lines <span class="token operator">=</span> linecache<span class="token punctuation">.</span>getlines<span class="token punctuation">(</span>fs<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">[</span>idx<span class="token punctuation">:</span> idx <span class="token operator">+</span> self<span class="token punctuation">.</span>pattern_len<span class="token punctuation">]</span>
                <span class="token keyword">try</span><span class="token punctuation">:</span>
                    ins <span class="token operator">=</span> <span class="token punctuation">[</span>_<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token keyword">if</span> _ <span class="token keyword">else</span> <span class="token string">&#39;nop&#39;</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> lines<span class="token punctuation">]</span>
                    <span class="token keyword">yield</span> idx<span class="token punctuation">,</span> ins
                <span class="token keyword">except</span> IndexError<span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面函数的作用是读取文件中的每一行，然后从文件中得到一个 pattern, 最后使用 <code>yield</code> 的方式输出。</p><p>在多进程的实现函数中，可以这么实现（实现函数每一次处理一个迭代器对象，<code>pattern_tup</code> 包括的内容为 <code>(line_number, pattern)</code>, 而上一个函数返回了所有的这些 <code>pattern_tup</code> 的集合：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">get_pattern_similar</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> pattern_tup<span class="token punctuation">)</span><span class="token punctuation">:</span>
        line_number<span class="token punctuation">,</span> p2 <span class="token operator">=</span> pattern_tup
        pattern_count <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>file_split<span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> fs<span class="token punctuation">:</span>
            <span class="token keyword">for</span> idx <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>get_line_count<span class="token punctuation">(</span>fs<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>pattern_len<span class="token punctuation">)</span><span class="token punctuation">:</span>
                logging<span class="token punctuation">.</span>debug<span class="token punctuation">(</span><span class="token string">&#39;start to get line {} pattern&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>idx<span class="token punctuation">)</span><span class="token punctuation">)</span>
                lines <span class="token operator">=</span> linecache<span class="token punctuation">.</span>getlines<span class="token punctuation">(</span>fs<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">[</span>idx<span class="token punctuation">:</span> idx <span class="token operator">+</span> self<span class="token punctuation">.</span>pattern_len<span class="token punctuation">]</span>
                <span class="token keyword">try</span><span class="token punctuation">:</span>
                    ins <span class="token operator">=</span> <span class="token punctuation">[</span>_<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token keyword">if</span> _ <span class="token keyword">else</span> <span class="token string">&#39;nop&#39;</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> lines<span class="token punctuation">]</span>
                    ed <span class="token operator">=</span> self<span class="token punctuation">.</span>ed<span class="token punctuation">.</span>edit_distance_faster<span class="token punctuation">(</span>ins<span class="token punctuation">,</span> p2<span class="token punctuation">)</span>
                    <span class="token keyword">if</span> ed <span class="token operator">&lt;=</span> self<span class="token punctuation">.</span>threshold<span class="token punctuation">:</span>
                        pattern_count <span class="token operator">+=</span> <span class="token number">1</span>
                <span class="token keyword">except</span> IndexError<span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>

        <span class="token keyword">return</span> pattern_count<span class="token punctuation">,</span> line_number<span class="token punctuation">,</span> p2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后就可以使用这个接口的方式来调用了：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>res <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token punctuation">)</span>
start <span class="token operator">=</span> time<span class="token punctuation">.</span>time<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">with</span> ProcessPoolExecutor<span class="token punctuation">(</span>max_workers<span class="token operator">=</span>worker_count<span class="token punctuation">)</span> <span class="token keyword">as</span> pool<span class="token punctuation">:</span>
    <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>res_file<span class="token punctuation">,</span> <span class="token string">&#39;w+&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        <span class="token keyword">for</span> items <span class="token keyword">in</span> pool<span class="token punctuation">.</span><span class="token builtin">map</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>get_pattern_similar<span class="token punctuation">,</span> s<span class="token punctuation">.</span>get_all_pattern_list<span class="token punctuation">(</span><span class="token builtin">file</span><span class="token operator">=</span>s<span class="token punctuation">.</span>file_split<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            count<span class="token punctuation">,</span> lineno<span class="token punctuation">,</span> pattern <span class="token operator">=</span> items
            <span class="token keyword">if</span> lineno <span class="token keyword">and</span> pattern<span class="token punctuation">:</span>
                key <span class="token operator">=</span> <span class="token punctuation">(</span>lineno<span class="token punctuation">,</span> <span class="token string">&#39;,&#39;</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>pattern<span class="token punctuation">)</span><span class="token punctuation">)</span>
                res<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> count
                logging<span class="token punctuation">.</span>info<span class="token punctuation">(</span><span class="token string">&#39;pattern {} found a similar, now is {}&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> res<span class="token punctuation">.</span>get<span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                line <span class="token operator">=</span> <span class="token string">&#39;{};{};{}\\n&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>key<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> key<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> count<span class="token punctuation">)</span>
                f<span class="token punctuation">.</span>writelines<span class="token punctuation">(</span>line<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其核心代码为第 5 行，打开文件是为了将结果及时写入到文件中；</p><p>我们再仔细看看第 5 行，加深理解：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">for</span> items <span class="token keyword">in</span> pool<span class="token punctuation">.</span><span class="token builtin">map</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>get_pattern_similar<span class="token punctuation">,</span> s<span class="token punctuation">.</span>get_all_pattern_list<span class="token punctuation">(</span><span class="token builtin">file</span><span class="token operator">=</span>s<span class="token punctuation">.</span>file_split<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
</code></pre></div><p><code>s.get_all_pattern_list(file=s.file_split)</code> 就是迭代器，也是我们接口中需要传入的 <code>not_use</code>, 至此也证明了这个接口中的可迭代对象是必不可少的。</p>`,51);function k(r,d){return a(),p("div",null,[c,l,i,t(" more "),u])}const v=s(e,[["render",k],["__file","coroutines.html.vue"]]);export{v as default};
