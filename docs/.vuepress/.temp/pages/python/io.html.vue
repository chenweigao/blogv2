<template><h2 id="new-coder-input" tabindex="-1"><a class="header-anchor" href="#new-coder-input" aria-hidden="true">#</a> New-Coder Input</h2>
<p>牛客网上面刷题时可能用到的多组输入输出：</p>
<ul>
<li>输入 m, n 两个数：</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>str_in <span class="token operator">=</span> <span class="token builtin">input</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
m<span class="token punctuation">,</span> n <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">(</span>_<span class="token punctuation">)</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> str_in<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><ul>
<li>多组输入，第一行 n 表示数的数量，第二行输入这 n 个数：</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>n<span class="token punctuation">,</span> m <span class="token operator">=</span> <span class="token builtin">input</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token builtin">input</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><ul>
<li>输入有多组数据：</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> sys

s <span class="token operator">=</span> sys<span class="token punctuation">.</span>stdin<span class="token punctuation">.</span>readline<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>strip<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">if</span> <span class="token keyword">not</span> s<span class="token punctuation">:</span>
    <span class="token keyword">break</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="format-output" tabindex="-1"><a class="header-anchor" href="#format-output" aria-hidden="true">#</a> Format Output</h2>
<p>When output, we can use <code>str()</code>, <code>repr()</code> and <code>print()</code>, the different between them could be found in <a href="http://www.runoob.com/python3/python3-inputoutput.html" target="_blank" rel="noopener noreferrer">Python3 Tutorial<ExternalLinkIcon/></a>.</p>
<p>The usage of <code>format</code> , one thing to note :</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'{0} and {1}'</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span><span class="token string">'Google'</span><span class="token punctuation">,</span> <span class="token string">'Baidu'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> Google <span class="token keyword">and</span> Baidu
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'{1} and {0}'</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span><span class="token string">'Google'</span><span class="token punctuation">,</span> <span class="token string">'Baidu'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> Baidu <span class="token keyword">and</span> Google

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f'some string'</span></span><span class="token punctuation">)</span>
<span class="token comment"># raw string</span>

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'{0:2d} {1:3f}'</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token comment"># specifies the length of the placeholder</span>

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'{name}: age}'</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>name <span class="token operator">=</span> <span class="token string">'weigao'</span><span class="token punctuation">,</span> age <span class="token operator">=</span> <span class="token string">'18'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> weigao<span class="token punctuation">:</span> <span class="token number">18</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>The <code>%</code> also can be use to format output, but it is an old way, so use it as little as possible.</p>
<h3 id="input" tabindex="-1"><a class="header-anchor" href="#input" aria-hidden="true">#</a> Input</h3>
<p>Python provides the <code>input()</code> function from the standard input to a line, and the default standard input is the keyboard.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">str</span> <span class="token operator">=</span> <span class="token builtin">input</span><span class="token punctuation">(</span><span class="token string">"please input: "</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"your input is: "</span><span class="token punctuation">,</span> <span class="token builtin">str</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>In <strong>Newcoder</strong> programming test, somethings we need custom input, there are some ways for us to reference:</p>
<ul>
<li>Mutil input and output</li>
</ul>
<p>例如第一行表示接下来要输入的行数，接下来若干行输入，并且涉及多组输入输出时：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        n <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span><span class="token builtin">input</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        lists <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">(</span><span class="token builtin">input</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">]</span>
        <span class="token comment"># the code</span>
    <span class="token keyword">except</span><span class="token punctuation">:</span>
        <span class="token keyword">break</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div></template>
