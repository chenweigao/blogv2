<template><h2 id="hashmap" tabindex="-1"><a class="header-anchor" href="#hashmap" aria-hidden="true">#</a> HashMap</h2>
<h3 id="hashmap-in-python-counter" tabindex="-1"><a class="header-anchor" href="#hashmap-in-python-counter" aria-hidden="true">#</a> HashMap in Python - Counter</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">from</span> collections <span class="token keyword">import</span> Counter
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>在腾讯面试的过程中，被问到了一个题目，要求找出一个数组中第一个单独出现的数字，例如 [2, 4, 2, 3, 1, 3], 则结果应该是 4.</p>
<p>题目如果用 hashmap 去求解的话只需要：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> collections <span class="token keyword">import</span> Counter
nums <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>

nums_counter <span class="token operator">=</span> Counter<span class="token punctuation">(</span>nums<span class="token punctuation">)</span>

res <span class="token operator">=</span> <span class="token builtin">min</span><span class="token punctuation">(</span>nums_counter<span class="token punctuation">,</span> key <span class="token operator">=</span> nums_counter<span class="token punctuation">.</span>get<span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><code>Counter</code> 为 Python 内置的 hashmap, 具体可以查询 <a href="https://docs.python.org/3/library/collections.html#collections.Counter" target="_blank" rel="noopener noreferrer">Counter<ExternalLinkIcon/></a>, 对于那个排序而言，<code>key</code> 会指定一个函数用于元素的比较，<code>nums_counter.get()</code> 方法用于得到某个 key 的 value 值。</p>
<h3 id="unordered-map" tabindex="-1"><a class="header-anchor" href="#unordered-map" aria-hidden="true">#</a> unordered_map</h3>
<ul>
<li>
<p>What is difference between <code>map</code> and <code>unordered_map</code>?</p>
<p><a href="https://stackoverflow.com/questions/2196995/is-there-any-advantage-of-using-map-over-unordered-map-in-case-of-trivial-keys" target="_blank" rel="noopener noreferrer">Stack overflow<ExternalLinkIcon/></a></p>
<p><a href="https://www.geeksforgeeks.org/map-vs-unordered_map-c/" target="_blank" rel="noopener noreferrer">Map vs unordered_map<ExternalLinkIcon/></a></p>
</li>
</ul>
<p>Conclusion: <code>unordered_map</code> is generally use more memory, better for <strong>lookup-retrieval</strong>, much slower at repeatedly inserting and removing elements.</p>
<p>Code example for <code>map</code> usage: <a href="https://github.com/chenweigao/_code/blob/master/cpp/unordered_map.cpp" target="_blank" rel="noopener noreferrer">GitHub<ExternalLinkIcon/></a>: 如何遍历、赋值。</p>
<p>关联容器 <code>unordered_map</code> 的初始化：</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code>unordered_map<span class="token operator">&lt;</span><span class="token keyword">char</span><span class="token punctuation">,</span> <span class="token keyword">int</span><span class="token operator">></span> roman <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token punctuation">{</span><span class="token char">'I'</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span><span class="token char">'V'</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>也可以利用 for 循环赋值初始化，具体参照上述 GitHub 示例。</p>
<div class="custom-container tip"><p class="custom-container-title">拓展</p>
<p>Python map 的初始化比较简单：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>mapping <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string">"]"</span><span class="token punctuation">:</span><span class="token string">"["</span><span class="token punctuation">,</span>
    <span class="token string">"}"</span><span class="token punctuation">:</span><span class="token string">"{"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>注意加以区别！</p>
</div>
<h3 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> map</h3>
<p>Example: <a href="https://github.com/chenweigao/_code/blob/master/cpp/map_word_count.cpp" target="_blank" rel="noopener noreferrer">单词计数器<ExternalLinkIcon/></a></p>
<p>Using map's includes:</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;map></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;string></span></span>
<span class="token keyword">using</span> Map <span class="token operator">=</span> std<span class="token double-colon punctuation">::</span>map<span class="token operator">&lt;</span>std<span class="token double-colon punctuation">::</span>string<span class="token punctuation">,</span> std<span class="token double-colon punctuation">::</span>size_t<span class="token operator">></span><span class="token punctuation">;</span>

Map my_map<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code><span class="token keyword">auto</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    Map counts<span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span>string w<span class="token punctuation">;</span> cin <span class="token operator">>></span> w<span class="token punctuation">;</span> <span class="token operator">++</span>counts<span class="token punctuation">[</span>w<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token punctuation">;</span>
    <span class="token keyword">return</span> counts<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Print this map's key and value:</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code><span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">auto</span> <span class="token operator">&amp;</span>kv <span class="token operator">:</span> my_map<span class="token punctuation">)</span>
    std<span class="token double-colon punctuation">::</span>cout <span class="token operator">&lt;&lt;</span> kv<span class="token punctuation">.</span>first <span class="token operator">&lt;&lt;</span> <span class="token operator">:</span> <span class="token operator">&lt;&lt;</span> kv<span class="token punctuation">.</span>second <span class="token operator">&lt;&lt;</span> std<span class="token double-colon punctuation">::</span>endl<span class="token punctuation">;</span>
    <span class="token comment">// words : counts</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></template>
