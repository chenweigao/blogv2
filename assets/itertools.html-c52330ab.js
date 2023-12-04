import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as e,c,e as l,a as n,b as s,d as t,f as i}from"./app-22cda79c.js";const r={},u=n("p",null,[s("本文主要研究 python 中的 itertools 模块，包括对 "),n("code",null,"more-itertools"),s(" 的研究工作：")],-1),k=n("ul",null,[n("li",null,"sliding_window, 滑动窗口的实现")],-1),d=i(`<p>主要参考文档为 python 官方文档<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup> 和官方 API 文档<sup class="footnote-ref"><a href="#footnote2">[2]</a><a class="footnote-anchor" id="footnote-ref2"></a></sup>。</p><h2 id="more-itertools" tabindex="-1"><a class="header-anchor" href="#more-itertools" aria-hidden="true">#</a> more-itertools</h2><p><code>itertools</code> 除了几个默认的迭代方法之外，还可以使用更多的迭代器 <code>more-itertools</code>, 下面会列举出来源码，可以直接使用源码，也可以使用包来引入。</p><p>安装包的命令如下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>pip <span class="token function">install</span> more-itertools
</code></pre></div><h2 id="sliding-window" tabindex="-1"><a class="header-anchor" href="#sliding-window" aria-hidden="true">#</a> sliding_window</h2><h3 id="stride-1-sliding" tabindex="-1"><a class="header-anchor" href="#stride-1-sliding" aria-hidden="true">#</a> stride 1 sliding</h3><p>代码实现如下：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">sliding_window</span><span class="token punctuation">(</span>iterable<span class="token punctuation">,</span> n<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># sliding_window(&#39;ABCDEFG&#39;, 4) -&gt; ABCD BCDE CDEF DEFG</span>
    it <span class="token operator">=</span> <span class="token builtin">iter</span><span class="token punctuation">(</span>iterable<span class="token punctuation">)</span>
    window <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span>islice<span class="token punctuation">(</span>it<span class="token punctuation">,</span> n<span class="token punctuation">)</span><span class="token punctuation">,</span> maxlen<span class="token operator">=</span>n<span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>window<span class="token punctuation">)</span> <span class="token operator">==</span> n<span class="token punctuation">:</span>
        <span class="token keyword">yield</span> <span class="token builtin">tuple</span><span class="token punctuation">(</span>window<span class="token punctuation">)</span>
    <span class="token keyword">for</span> x <span class="token keyword">in</span> it<span class="token punctuation">:</span>
        window<span class="token punctuation">.</span>append<span class="token punctuation">(</span>x<span class="token punctuation">)</span>
        <span class="token keyword">yield</span> <span class="token builtin">tuple</span><span class="token punctuation">(</span>window<span class="token punctuation">)</span>
</code></pre></div><h3 id="grouper-sliding-non-overlapping" tabindex="-1"><a class="header-anchor" href="#grouper-sliding-non-overlapping" aria-hidden="true">#</a> grouper: sliding non-overlapping</h3><p>我们也可以使用固定长度的不 overlap 的方式来进行滑动：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">grouper</span><span class="token punctuation">(</span>iterable<span class="token punctuation">,</span> n<span class="token punctuation">,</span> <span class="token operator">*</span><span class="token punctuation">,</span> incomplete<span class="token operator">=</span><span class="token string">&#39;fill&#39;</span><span class="token punctuation">,</span> fillvalue<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token string">&quot;Collect data into non-overlapping fixed-length chunks or blocks&quot;</span>
    <span class="token comment"># grouper(&#39;ABCDEFG&#39;, 3, fillvalue=&#39;x&#39;) --&gt; ABC DEF Gxx</span>
    <span class="token comment"># grouper(&#39;ABCDEFG&#39;, 3, incomplete=&#39;strict&#39;) --&gt; ABC DEF ValueError</span>
    <span class="token comment"># grouper(&#39;ABCDEFG&#39;, 3, incomplete=&#39;ignore&#39;) --&gt; ABC DEF</span>
    args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">iter</span><span class="token punctuation">(</span>iterable<span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">*</span> n
    <span class="token keyword">if</span> incomplete <span class="token operator">==</span> <span class="token string">&#39;fill&#39;</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> zip_longest<span class="token punctuation">(</span><span class="token operator">*</span>args<span class="token punctuation">,</span> fillvalue<span class="token operator">=</span>fillvalue<span class="token punctuation">)</span>
    <span class="token keyword">if</span> incomplete <span class="token operator">==</span> <span class="token string">&#39;strict&#39;</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">zip</span><span class="token punctuation">(</span><span class="token operator">*</span>args<span class="token punctuation">,</span> strict<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> incomplete <span class="token operator">==</span> <span class="token string">&#39;ignore&#39;</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">zip</span><span class="token punctuation">(</span><span class="token operator">*</span>args<span class="token punctuation">)</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">raise</span> ValueError<span class="token punctuation">(</span><span class="token string">&#39;Expected fill, strict, or ignore&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> example</h3><p>因为是 API 所以我们可以直接调用，在实战中的演示如下：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">get_all_pattern_pandas</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> <span class="token builtin">file</span><span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    pattern_list <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    visited <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    df <span class="token operator">=</span> pandas<span class="token punctuation">.</span>read_csv<span class="token punctuation">(</span><span class="token builtin">file</span><span class="token punctuation">,</span> header<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">,</span> sep<span class="token operator">=</span><span class="token string">&#39;\\t&#39;</span><span class="token punctuation">)</span>
    all_lines <span class="token operator">=</span> df<span class="token punctuation">.</span>itertuples<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">for</span> rows <span class="token keyword">in</span> more_itertools<span class="token punctuation">.</span>grouper<span class="token punctuation">(</span>all_lines<span class="token punctuation">,</span> self<span class="token punctuation">.</span>pattern_len<span class="token punctuation">,</span> incomplete<span class="token operator">=</span><span class="token string">&#39;ignore&#39;</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        opcode_list <span class="token operator">=</span> <span class="token punctuation">[</span>get_opcode_from_row<span class="token punctuation">(</span>row<span class="token punctuation">)</span> <span class="token keyword">for</span> row <span class="token keyword">in</span> rows<span class="token punctuation">]</span>
        <span class="token keyword">yield</span> opcode_list
</code></pre></div><h2 id="nth" tabindex="-1"><a class="header-anchor" href="#nth" aria-hidden="true">#</a> nth</h2><p>这个接口可以返回 iterable 中的 第 n 个元素：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">nth</span><span class="token punctuation">(</span>iterable<span class="token punctuation">,</span> n<span class="token punctuation">,</span> default<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token string">&quot;Returns the nth item or a default value&quot;</span>
    <span class="token keyword">return</span> <span class="token builtin">next</span><span class="token punctuation">(</span>islice<span class="token punctuation">(</span>iterable<span class="token punctuation">,</span> n<span class="token punctuation">,</span> <span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">,</span> default<span class="token punctuation">)</span>
</code></pre></div><h2 id="product" tabindex="-1"><a class="header-anchor" href="#product" aria-hidden="true">#</a> product</h2><p>返回排列组合：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">product</span><span class="token punctuation">(</span><span class="token operator">*</span>args<span class="token punctuation">,</span> repeat<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># product(&#39;ABCD&#39;, &#39;xy&#39;) --&gt; Ax Ay Bx By Cx Cy Dx Dy</span>
    <span class="token comment"># product(range(2), repeat=3) --&gt; 000 001 010 011 100 101 110 111</span>
    pools <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">tuple</span><span class="token punctuation">(</span>pool<span class="token punctuation">)</span> <span class="token keyword">for</span> pool <span class="token keyword">in</span> args<span class="token punctuation">]</span> <span class="token operator">*</span> repeat
    result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> pool <span class="token keyword">in</span> pools<span class="token punctuation">:</span>
        result <span class="token operator">=</span> <span class="token punctuation">[</span>x<span class="token operator">+</span><span class="token punctuation">[</span>y<span class="token punctuation">]</span> <span class="token keyword">for</span> x <span class="token keyword">in</span> result <span class="token keyword">for</span> y <span class="token keyword">in</span> pool<span class="token punctuation">]</span>
    <span class="token keyword">for</span> prod <span class="token keyword">in</span> result<span class="token punctuation">:</span>
        <span class="token keyword">yield</span> <span class="token builtin">tuple</span><span class="token punctuation">(</span>prod<span class="token punctuation">)</span>
</code></pre></div><hr class="footnotes-sep">`,22),h={class:"footnotes"},f={class:"footnotes-list"},g={id:"footnote1",class:"footnote-item"},m={href:"https://docs.python.org/3/library/itertools.html",target:"_blank",rel:"noopener noreferrer"},y=n("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1),w={id:"footnote2",class:"footnote-item"},b={href:"https://more-itertools.readthedocs.io/en/stable/api.html",target:"_blank",rel:"noopener noreferrer"},v=n("a",{href:"#footnote-ref2",class:"footnote-backref"},"↩︎",-1);function _(x,C){const a=p("ExternalLinkIcon");return e(),c("div",null,[u,k,l(" more "),d,n("section",h,[n("ol",f,[n("li",g,[n("p",null,[n("a",m,[s("docs.python.org"),t(a)]),s(),y])]),n("li",w,[n("p",null,[n("a",b,[s("more-itertools"),t(a)]),s(),v])])])])])}const D=o(r,[["render",_],["__file","itertools.html.vue"]]);export{D as default};
