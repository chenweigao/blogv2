<template><blockquote>
<p>Python’s simplicity lets you become productive quickly, but this often means you aren’t using everything it has to offer.  With this hands-on guide, you’ll learn how to write        effective, idiomatic Python code by leveraging its best—and possibly most neglected—features. Author Luciano Ramalho takes you through Python’s core language features and            libraries, and shows you how to make your code shorter, faster, and more readable at the same time.</p>
</blockquote>
<!-- more -->
<h2 id="python-文件操作" tabindex="-1"><a class="header-anchor" href="#python-文件操作" aria-hidden="true">#</a> Python 文件操作</h2>
<h3 id="q-a" tabindex="-1"><a class="header-anchor" href="#q-a" aria-hidden="true">#</a> Q&amp;A</h3>
<ol>
<li><code>a</code> 是可访问可修改的吗？
不是。<code>a</code>表示在文件后追加写，append。<code>a+</code> 既可以追加到文件中，也可以读取文件中的内容，而 <code>a</code> 是不可以读操作的。</li>
</ol>
<h3 id="summary" tabindex="-1"><a class="header-anchor" href="#summary" aria-hidden="true">#</a> Summary</h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>操作</th>
<th>文件不存在</th>
<th>是否覆盖</th>
</tr>
</thead>
<tbody>
<tr>
<td>r</td>
<td>read 只读</td>
<td>报错</td>
<td>-</td>
</tr>
<tr>
<td>w</td>
<td>write 可写</td>
<td>创建</td>
<td>是</td>
</tr>
<tr>
<td>a</td>
<td>append 文件后追加</td>
<td>创建</td>
<td>否 追加</td>
</tr>
<tr>
<td>r+</td>
<td>可读 可写</td>
<td>报错</td>
<td>是</td>
</tr>
<tr>
<td>w+</td>
<td>可读 可写</td>
<td>创建</td>
<td>是</td>
</tr>
<tr>
<td>a+</td>
<td>可读 可写</td>
<td>创建</td>
<td>否 追加</td>
</tr>
</tbody>
</table>
<h3 id="bcd-fopen-手册" tabindex="-1"><a class="header-anchor" href="#bcd-fopen-手册" aria-hidden="true">#</a> BCD <code>fopen()</code> 手册</h3>
<blockquote>
<p>The argument mode points to a string beginning with one of the following sequences (Additional characters may follow these sequences.):</p>
</blockquote>
<ul>
<li>
<p><code>r</code>   Open text file for <strong>reading</strong>.  The stream is positioned at the
<strong>beginning</strong> of the file.</p>
</li>
<li>
<p><code>r+</code>  Open for <strong>reading and writing</strong>.  The stream is positioned at the
<strong>beginning</strong> of the file.</p>
</li>
<li>
<p><code>w</code>   Truncate file to <strong>zero length</strong> or create text file for <strong>writing</strong>.
The stream is positioned at the <strong>beginning</strong> of the file.</p>
</li>
<li>
<p><code>w+</code>  Open for <strong>reading and writing</strong>.  The file is created if it does not
exist, otherwise it is <strong>truncated</strong>.  The stream is positioned at
the <strong>beginning</strong> of the file.</p>
</li>
<li>
<p><code>a</code> Open for <strong>writing</strong>.  The file is created if it does not exist.  The
stream is positioned at the <strong>end</strong> of the file.  Subsequent writes
to the file will always end up at the then current end of file,
irrespective of any intervening fseek(3) or similar.</p>
</li>
<li>
<p><code>a+</code>  Open for <strong>reading and writing</strong>.  The file is created if it does not
exist.  The stream is positioned at the <strong>end</strong> of the file.  Subse-
quent writes to the file will always end up at the then current
end of file, irrespective of any intervening fseek(3) or similar.</p>
</li>
</ul>
<h2 id="data-struct" tabindex="-1"><a class="header-anchor" href="#data-struct" aria-hidden="true">#</a> Data Struct</h2>
<h3 id="slicing" tabindex="-1"><a class="header-anchor" href="#slicing" aria-hidden="true">#</a> Slicing</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> s <span class="token operator">=</span> <span class="token string">'bicycle'</span>
<span class="token operator">>></span><span class="token operator">></span> s<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">:</span><span class="token punctuation">]</span>
<span class="token string">'ycle'</span>
<span class="token operator">>></span><span class="token operator">></span> s<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token number">3</span><span class="token punctuation">]</span>
<span class="token string">'bic'</span>
<span class="token operator">>></span><span class="token operator">></span> s<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token number">3</span><span class="token punctuation">]</span>
<span class="token string">'bye'</span>
<span class="token operator">>></span><span class="token operator">></span> s<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
<span class="token string">'elcycib'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>If you want to <em>reverse a string</em>, the last example is a choice.</p>
<ul>
<li>assigning to slices</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> l <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> l
<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span>
<span class="token operator">>></span><span class="token operator">></span> l<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">:</span><span class="token number">5</span><span class="token punctuation">]</span>
<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span>
<span class="token operator">>></span><span class="token operator">></span> l<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">:</span><span class="token number">5</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">20</span><span class="token punctuation">,</span><span class="token number">30</span><span class="token punctuation">]</span>
<span class="token operator">>></span><span class="token operator">></span> l
<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">30</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>what you can see is that <strong>[2,3,4]</strong> is replaced by <strong>[20,30]</strong></p>
<h3 id="list" tabindex="-1"><a class="header-anchor" href="#list" aria-hidden="true">#</a> List</h3>
<ul>
<li>
<p>list of list</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> board <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token number">3</span> <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
<span class="token operator">>></span><span class="token operator">></span> board
<span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
<span class="token operator">>></span><span class="token operator">></span> board<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">'x'</span>
<span class="token operator">>></span><span class="token operator">></span> board
<span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'x'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>The first line is the right way to multiply it,rather than:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> wrong_board <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token number">3</span>
<span class="token operator">>></span><span class="token operator">></span> wrong_board<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
<span class="token operator">>></span><span class="token operator">></span> wrong_board
<span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token string">'_'</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div></li>
<li>
<p><code>list.sort()</code> &amp; <code>sorted(list)</code></p>
<p>The <code>list.sort()</code> method sorts a list in-place, that is, without making a copy.</p>
<p>In contrast, the built-in function <code>sorted(list)</code> creates a new list and returns it.</p>
</li>
</ul>
<h3 id="sort-and-sorted" tabindex="-1"><a class="header-anchor" href="#sort-and-sorted" aria-hidden="true">#</a> sort and sorted</h3>
<div class="custom-container tip"><p class="custom-container-title">skill</p>
<p>在对 list 排序时， 可以使用 <code>sorted()</code> 或者 <code>sort()</code> + <code>deepcopy()</code> 两种方式</p>
<p><RouterLink to="/algorithm/python/">example code</RouterLink></p>
</div>
<ol>
<li>
<p>sorted()</p>
<p>descending order (降序)</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">max_n</span><span class="token punctuation">(</span>lst<span class="token punctuation">,</span> n<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">,</span> reverse<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token builtin">sorted</span><span class="token punctuation">(</span>lst<span class="token punctuation">,</span> reverse<span class="token operator">=</span>reverse<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">:</span>n<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></li>
<li>
<p>sort() + deepcopy()</p>
<p>ascending order (升序)</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">from</span> copy <span class="token keyword">import</span> deepcopy

<span class="token keyword">def</span> <span class="token function">min_n</span><span class="token punctuation">(</span>lst<span class="token punctuation">,</span> n<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    numbers <span class="token operator">=</span> deepcopy<span class="token punctuation">(</span>lst<span class="token punctuation">)</span>
    numbers<span class="token punctuation">.</span>sort<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> numbers<span class="token punctuation">[</span><span class="token punctuation">:</span>n<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div></li>
</ol>
<ul>
<li>
<p>make list a stack or queue</p>
<p>The .append and .pop methods make a list usable as a stack or a queue (if you use .append and .pop(0), you get LIFO, Last in First out, behavior).</p>
<p>But inserting and removing from the left of a list (the 0-index end) is costly because the entire list must be shifted.</p>
</li>
<li>
<p>deques and queues</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">from</span> collections <span class="token keyword">import</span> deque
dq <span class="token operator">=</span> deque<span class="token punctuation">(</span><span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span> maxlen<span class="token operator">=</span><span class="token number">10</span><span class="token punctuation">)</span>
<span class="token comment"># dq: deque([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], maxlen=10)</span>
dq<span class="token punctuation">.</span>rotate<span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>
<span class="token comment"># [7, 8, 9, 0, 1, 2, 3, 4, 5, 6]</span>
<span class="token comment"># this function rotates items from the right end</span>
<span class="token comment"># and when dp.rotate(-3) is from the left</span>
dq<span class="token punctuation">.</span>appendleft<span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token comment"># [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9]</span>
dq<span class="token punctuation">.</span>extend<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">22</span><span class="token punctuation">,</span> <span class="token number">33</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token comment"># [3, 4, 5, 6, 7, 8, 9, 11, 22, 33]</span>
<span class="token comment"># default is insert from right</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>What is different between <code>append()</code> and <code>extend()</code>? here is an example:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> dp
<span class="token comment"># deque([10, 30, 20, 10, 3, 4, 5, 6, 7, 8], maxlen=10)</span>

<span class="token operator">>></span><span class="token operator">></span> dp<span class="token punctuation">.</span>appendleft<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token comment"># deque([[1, 2], 10, 30, 20, 10, 3, 4, 5, 6, 7], maxlen=10)</span>

<span class="token operator">>></span><span class="token operator">></span> dp<span class="token punctuation">.</span>extendleft<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token comment"># deque([2, 1, [1, 2], 10, 30, 20, 10, 3, 4, 5], maxlen=10)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>Note that <code>extendleft(iter)</code> works by appending each successive item of the iter argument to the left of the deque, therefore the final position of the items is reversed.</p>
</li>
</ul>
<h3 id="bisect" tabindex="-1"><a class="header-anchor" href="#bisect" aria-hidden="true">#</a> Bisect</h3>
<p><code>#bisect: [baɪ'sɛkt]</code></p>
<blockquote>
<p>Bisection is the general activity of dividing a geometric figure into two equal parts</p>
</blockquote>
<h3 id="set" tabindex="-1"><a class="header-anchor" href="#set" aria-hidden="true">#</a> Set</h3>
<p>Python 的集合是一个十分方便的对于元素可以操作的序列，除了去掉重复元素外，还可以进行稽核之间的运算。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>student <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">'Tom'</span><span class="token punctuation">,</span> <span class="token string">'Jim'</span><span class="token punctuation">,</span> <span class="token string">'Mary'</span><span class="token punctuation">,</span> <span class="token string">'Tom'</span><span class="token punctuation">,</span> <span class="token string">'Jack'</span><span class="token punctuation">,</span> <span class="token string">'Rose'</span><span class="token punctuation">}</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>student<span class="token punctuation">)</span>   <span class="token comment"># 输出集合，重复的元素被自动去掉</span>

a <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token string">'abracadabra'</span><span class="token punctuation">)</span>
b <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token string">'alacazam'</span><span class="token punctuation">)</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>a <span class="token operator">-</span> b<span class="token punctuation">)</span>     <span class="token comment"># a 和 b 的差集</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>a <span class="token operator">|</span> b<span class="token punctuation">)</span>     <span class="token comment"># a 和 b 的并集</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>a <span class="token operator">&amp;</span> b<span class="token punctuation">)</span>     <span class="token comment"># a 和 b 的交集</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>a <span class="token operator">^</span> b<span class="token punctuation">)</span>     <span class="token comment"># a 和 b 中不同时存在的元素</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>set 的集合运算十分有用，看下面的代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findWords</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> words<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token triple-quoted-string string">"""
        :type words: List[str]
        :rtype: List[str]
        """</span>
        a <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token string">'qwertyuiop'</span><span class="token punctuation">)</span>
        b <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token string">'asdfghjkl'</span><span class="token punctuation">)</span>
        c <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token string">'zxcvbnm'</span><span class="token punctuation">)</span>
        ans <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">for</span> word <span class="token keyword">in</span> words<span class="token punctuation">:</span>
            w <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span>word<span class="token punctuation">.</span>lower<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>w <span class="token operator">&amp;</span> a <span class="token operator">==</span> w<span class="token punctuation">)</span> <span class="token keyword">or</span> <span class="token punctuation">(</span>w <span class="token operator">&amp;</span> b <span class="token operator">==</span> w<span class="token punctuation">)</span> <span class="token keyword">or</span> <span class="token punctuation">(</span>w <span class="token operator">&amp;</span> c <span class="token operator">==</span> w<span class="token punctuation">)</span><span class="token punctuation">:</span>
                ans<span class="token punctuation">.</span>append<span class="token punctuation">(</span>word<span class="token punctuation">)</span>
        <span class="token keyword">return</span> ans
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>上述代码实现了一个求解某序列是否在键盘的同一行的操作，通过求交集看是否结果等于自身就可以很方便地求解出结果。</p>
<h3 id="set-1" tabindex="-1"><a class="header-anchor" href="#set-1" aria-hidden="true">#</a> set</h3>
<ol>
<li>使用 set 一般用于 <strong>判断一个值是否存在其中</strong></li>
<li>when to keep elements sorted and unique.</li>
</ol>
<p>Example: 忽略常见单词，只对不在集合中的单词统计出现次数：</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code>set<span class="token operator">&lt;</span>string<span class="token operator">></span> exclude <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"some"</span><span class="token punctuation">,</span> <span class="token string">"words"</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">//code</span>
<span class="token keyword">if</span><span class="token punctuation">(</span>exclude<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span> <span class="token operator">==</span> exclude<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//code</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>对比如果使用 vector 实现：</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code>vector<span class="token operator">&lt;</span>string<span class="token operator">></span> exclude <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"some"</span><span class="token punctuation">,</span> <span class="token string">"words"</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">//code</span>
<span class="token keyword">auto</span> is_exclude <span class="token operator">=</span> std<span class="token double-colon punctuation">::</span><span class="token function">binary_search</span><span class="token punctuation">(</span>exclude<span class="token punctuation">.</span><span class="token function">cbegin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> exclude<span class="token punctuation">.</span><span class="token function">cend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> word<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//bool binary_search()</span>
<span class="token keyword">auto</span> reply <span class="token operator">=</span> is_exclude <span class="token operator">?</span> <span class="token string">"excluded"</span> <span class="token operator">:</span> <span class="token string">"not excluded"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="high-level-function" tabindex="-1"><a class="header-anchor" href="#high-level-function" aria-hidden="true">#</a> High-level Function</h2>
<h3 id="str-maketrans" tabindex="-1"><a class="header-anchor" href="#str-maketrans" aria-hidden="true">#</a> str.maketrans()</h3>
<p>用于创建字符映射的转换表，接收两个字符串参数，第一个参数表示需要转化的字符，第二个参数表示转换的目标。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>in_tab <span class="token operator">=</span> <span class="token string">'aeiou'</span>
out_tab <span class="token operator">=</span> <span class="token string">'12345'</span>
tran_tab <span class="token operator">=</span> <span class="token builtin">str</span><span class="token punctuation">.</span>maketrans<span class="token punctuation">(</span>in_tab<span class="token punctuation">,</span> out_tab<span class="token punctuation">)</span>
<span class="token comment"># tran_tab: {97: 49, 101: 50, 105: 51, 111: 52, 117: 53}</span>

str_test <span class="token operator">=</span> <span class="token string">"this is string example....wow!!!"</span>
str_test<span class="token punctuation">.</span>translate<span class="token punctuation">(</span>tran_tab<span class="token punctuation">)</span>
<span class="token comment"># th3s 3s str3ng 2x1mpl2....w4w!!!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>注意到 <code>str.maketrans()</code> 可以存在第三个参数，其必须为一个字符串，比如 <code>string.punctuation</code>(表示所有的标点符号), 在指定了第三个参数以后，第三个字符串中所有的字符(对应为其 ASCII 码 <code>ord()</code>)都会在 tran_tab 字典中被映射为 <code>None</code>, 实现的作用为在 <code>translate()</code> 时可以去掉字符串中所有的标点(结果会变成 <code>'th3s 3s 1n 2x1mpl2w4w'</code>)</p>
<p>LeetCode 上有题目可以使用该方法求解回文子串，具体可以参考<a href="https://github.com/chenweigao/_code/blob/master/LeetCode/LC125_valid_palindrome.py" target="_blank" rel="noopener noreferrer">代码<ExternalLinkIcon/></a></p>
<h3 id="python-import-string" tabindex="-1"><a class="header-anchor" href="#python-import-string" aria-hidden="true">#</a> Python import string</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> string
<span class="token builtin">dir</span><span class="token punctuation">(</span>string<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>可以查看 string 的所有参数，然后使用它：</p>
<ul>
<li>
<p><code>string.punctuation</code>: 所有的标点符号...等使用方法;</p>
</li>
<li>
<p><code>string.ascii_letters</code>: 所有的大小写字母；</p>
</li>
<li>
<p><code>string.digits</code>: 所有的数字。</p>
</li>
</ul>
<h3 id="count" tabindex="-1"><a class="header-anchor" href="#count" aria-hidden="true">#</a> count()</h3>
<p>用于统计字符串里某个字符出现的次数 <code>count()</code> 方法，语法：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">str</span><span class="token punctuation">.</span>count<span class="token punctuation">(</span>sub<span class="token punctuation">,</span> start<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span> end<span class="token operator">=</span><span class="token builtin">len</span><span class="token punctuation">(</span>string<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><ul>
<li>sub -- 搜索的子字符串。</li>
<li>start -- 字符串开始搜索的位置。默认为第一个字符,第一个字符索引值为0。</li>
<li>end -- 字符串中结束搜索的位置。字符中第一个字符的索引为 0。默认为字符串的最后一个位置。</li>
</ul>
<p>该方法返回子字符串在字符串中出现的次数。</p>
<p>理解下面这行代码所实现的功能：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">return</span> <span class="token builtin">sum</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span>S<span class="token punctuation">.</span>count<span class="token punctuation">,</span> J<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token keyword">return</span> <span class="token keyword">not</span> <span class="token builtin">sum</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token string">'R'</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'L'</span><span class="token punctuation">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'U'</span><span class="token punctuation">:</span> <span class="token number">1j</span><span class="token punctuation">,</span> <span class="token string">'D'</span><span class="token punctuation">:</span> <span class="token operator">-</span><span class="token number">1j</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span>get<span class="token punctuation">,</span> moves<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>第一行代码实现了两个字符串中共同字符的计数。</p>
<p>第二行代码实现了一个计算坐标的方法。</p>
<h3 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> map()</h3>
<p><code>map()</code> 会根据提供的函数对指定序列做映射。</p>
<p>第一个参数 function 以参数序列中的每一个元素调用 function 函数，返回包含每次 function 函数返回值的新列表。</p>
<p><code>map()</code> 函数语法：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">map</span><span class="token punctuation">(</span>function<span class="token punctuation">,</span> iterable<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><ul>
<li>
<p>function -- 函数，有两个参数</p>
</li>
<li>
<p>iterable -- 一个或多个序列</p>
</li>
</ul>
<p>e.g.1. 将一个列表中的整数转化成字符串存储如另一个列表中：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>newList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token keyword">for</span> number <span class="token keyword">in</span> oldList<span class="token punctuation">:</span> 
    newList<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token builtin">str</span><span class="token punctuation">(</span>number<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>用 <code>map()</code> 等效于：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token builtin">str</span><span class="token punctuation">,</span> oldList<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="int2list-and-list2int" tabindex="-1"><a class="header-anchor" href="#int2list-and-list2int" aria-hidden="true">#</a> int2list and list2int</h3>
<ul>
<li>int2list</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">int2list</span><span class="token punctuation">(</span>intNum<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token builtin">str</span><span class="token punctuation">(</span>intNum<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>解析：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">str</span><span class="token punctuation">(</span><span class="token number">123</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">-</span><span class="token operator">></span> <span class="token string">'123'</span>
<span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">map</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token builtin">str</span><span class="token punctuation">(</span><span class="token number">123</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">-</span><span class="token operator">></span> <span class="token operator">&lt;</span><span class="token builtin">map</span> <span class="token builtin">object</span><span class="token operator">></span> <span class="token comment"># python3 以后 map 返回迭代器</span>
<span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token builtin">str</span><span class="token punctuation">(</span><span class="token number">123</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul>
<li>list2int</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">list2int</span><span class="token punctuation">(</span>aList<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token builtin">int</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token builtin">str</span><span class="token punctuation">,</span> aList<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="isinstance" tabindex="-1"><a class="header-anchor" href="#isinstance" aria-hidden="true">#</a> isinstance()</h3>
<p>Python 中判断类型的方法</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">isinstance</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token builtin">int</span><span class="token punctuation">)</span>
<span class="token boolean">True</span>

<span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">isinstance</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token builtin">list</span><span class="token punctuation">)</span>
<span class="token boolean">True</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="zip" tabindex="-1"><a class="header-anchor" href="#zip" aria-hidden="true">#</a> zip()</h3>
<p><code>zip(*iterators)</code>: returns a iterator of tuples.</p>
<p>当最短的迭代器遍历完成以后，停止迭代。</p>
<p>Example 1:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">str</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'hello'</span><span class="token punctuation">,</span> <span class="token string">'heo'</span><span class="token punctuation">,</span> <span class="token string">'helio'</span><span class="token punctuation">]</span>
<span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">zip</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token builtin">str</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token builtin">list</span><span class="token punctuation">(</span>_<span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token operator">>></span> <span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token string">'h'</span><span class="token punctuation">,</span> <span class="token string">'h'</span><span class="token punctuation">,</span> <span class="token string">'h'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token string">'e'</span><span class="token punctuation">,</span> <span class="token string">'e'</span><span class="token punctuation">,</span> <span class="token string">'e'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token string">'l'</span><span class="token punctuation">,</span> <span class="token string">'o'</span><span class="token punctuation">,</span> <span class="token string">'l'</span><span class="token punctuation">)</span><span class="token punctuation">]</span>

<span class="token comment"># zip('ABCD', 'xy') --> Ax By</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="enumerate" tabindex="-1"><a class="header-anchor" href="#enumerate" aria-hidden="true">#</a> enumerate()</h3>
<p>Example 2(接上 zip 的例子):</p>
<p><a href="https://leetcode.com/problems/longest-common-prefix/" target="_blank" rel="noopener noreferrer">Leetcode 14. Longest Common Prefix<ExternalLinkIcon/></a></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">longestCommonPrefix</span><span class="token punctuation">(</span>strs<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> <span class="token keyword">not</span> strs<span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">""</span>

    <span class="token keyword">for</span> i<span class="token punctuation">,</span> _ <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span><span class="token builtin">zip</span><span class="token punctuation">(</span><span class="token operator">*</span>strs<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span><span class="token builtin">set</span><span class="token punctuation">(</span>_<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">1</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> strs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">:</span>i<span class="token punctuation">]</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">min</span><span class="token punctuation">(</span>strs<span class="token punctuation">)</span>

test_strs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"flower"</span><span class="token punctuation">,</span><span class="token string">"flow"</span><span class="token punctuation">,</span><span class="token string">"flight"</span><span class="token punctuation">]</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>longestCommonPrefix<span class="token punctuation">(</span>test_strs<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p><code>enumerate()</code> 列举出来的下标从 0 开始，所以使用 <code>[:i]</code> 作为切片 而不是 <code>[:i-1]</code></p>
</div>
<h3 id="reduce-lcd-and-gcd" tabindex="-1"><a class="header-anchor" href="#reduce-lcd-and-gcd" aria-hidden="true">#</a> reduce(), lcd and gcd</h3>
<p><code>functools.reduce</code> 可以应用带有两个参数的函数来将一个可迭代的对象的项转化为单个的值，而干函数的两个参数是下一项和前一次应用该函数的结果。</p>
<p>e.g. 计算10的阶乘：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> functools
product <span class="token operator">=</span> functools<span class="token punctuation">.</span><span class="token builtin">reduce</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> x<span class="token punctuation">,</span> y<span class="token punctuation">:</span> x<span class="token operator">*</span>y<span class="token punctuation">,</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> <span class="token keyword">from</span> functools <span class="token keyword">import</span> <span class="token builtin">reduce</span>
<span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">reduce</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> x<span class="token punctuation">,</span> y<span class="token punctuation">:</span> x<span class="token operator">+</span>y<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token number">6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="gcd-and-lcm" tabindex="-1"><a class="header-anchor" href="#gcd-and-lcm" aria-hidden="true">#</a> gcd and lcm</h4>
<ul>
<li>
<p><a href="https://github.com/chenweigao/_code/blob/master/python/gcd.py" target="_blank" rel="noopener noreferrer">最小公倍数<ExternalLinkIcon/></a></p>
</li>
<li>
<p><a href="https://github.com/chenweigao/_code/blob/master/python/lcm.py" target="_blank" rel="noopener noreferrer">最大公约数<ExternalLinkIcon/></a></p>
</li>
</ul>
<div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p>最小公倍数 = 两整数的乘积 / 最大公约数</p>
<p>lcm(x,y) = x * y / gcd(x,y)</p>
</div>
<h3 id="bit-operation" tabindex="-1"><a class="header-anchor" href="#bit-operation" aria-hidden="true">#</a> Bit operation</h3>
<table>
<thead>
<tr>
<th>运算符</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>&amp;</td>
<td>按位与</td>
</tr>
<tr>
<td>|</td>
<td>按位或</td>
</tr>
<tr>
<td>^</td>
<td>按位异或</td>
</tr>
<tr>
<td>~</td>
<td>按位取反</td>
</tr>
<tr>
<td>&lt;&lt;</td>
<td>左移</td>
</tr>
<tr>
<td>&gt;&gt;</td>
<td>右移</td>
</tr>
</tbody>
</table>
<p><code>str(bin(x^y).count'1')</code> 计算了两个整数之间的 Hamming distance.</p>
<p>Questions: to think what this code did:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment">#LC693</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">hasAlternatingBits</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> n<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> n<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>
        num <span class="token operator">=</span> n <span class="token operator">^</span> <span class="token punctuation">(</span>n <span class="token operator">>></span> <span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token keyword">not</span> <span class="token punctuation">(</span>num <span class="token operator">&amp;</span> <span class="token punctuation">(</span>num <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="all" tabindex="-1"><a class="header-anchor" href="#all" aria-hidden="true">#</a> all()</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">all</span><span class="token punctuation">(</span>iterable<span class="token punctuation">,</span> <span class="token operator">/</span><span class="token punctuation">)</span>
    Return <span class="token boolean">True</span> <span class="token keyword">if</span> <span class="token builtin">bool</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span> <span class="token keyword">is</span> <span class="token boolean">True</span> <span class="token keyword">for</span> <span class="token builtin">all</span> values x <span class="token keyword">in</span> the iterable<span class="token punctuation">.</span>
If the iterable <span class="token keyword">is</span> empty<span class="token punctuation">,</span> <span class="token keyword">return</span> <span class="token boolean">True</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>This is <strong>example 1</strong>(LeetCode 728) about the usage:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">selfDividingNumbers</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> left<span class="token punctuation">,</span> right<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token triple-quoted-string string">"""
        :type left: int
        :type right: int
        :rtype: List[int]
        """</span>
       <span class="token comment"># return [num for num in range(left, right+1) </span>
   	   <span class="token comment"># if all((int(d) and not num % int(d)) for d in str(num))]</span>
        is_self_dividing <span class="token operator">=</span> <span class="token keyword">lambda</span> num<span class="token punctuation">:</span> <span class="token string">'0'</span> <span class="token keyword">not</span> <span class="token keyword">in</span> <span class="token builtin">str</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span> 
        <span class="token keyword">and</span> <span class="token builtin">all</span><span class="token punctuation">(</span><span class="token punctuation">[</span>num <span class="token operator">%</span> <span class="token builtin">int</span><span class="token punctuation">(</span>digit<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token keyword">for</span> digit <span class="token keyword">in</span> <span class="token builtin">str</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        x <span class="token operator">=</span> <span class="token builtin">filter</span><span class="token punctuation">(</span>is_self_dividing<span class="token punctuation">,</span> <span class="token builtin">range</span><span class="token punctuation">(</span>left<span class="token punctuation">,</span> right <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token builtin">list</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>该段代码使用了 <code>all</code> 的特性，并且在最后返回了一个 filter 的可迭代对象，然后转化成 list,得到结果。</p>
<p><strong>example 2</strong> (LeetCode 766):</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">isToeplitzMatrix</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> matrix<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token triple-quoted-string string">"""
        :type matrix: List[List[int]]
        :rtype: bool
        """</span>
        <span class="token keyword">return</span> <span class="token builtin">all</span><span class="token punctuation">(</span>matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">==</span> matrix<span class="token punctuation">[</span>i<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> 
                   <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>matrix<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>matrix<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>Tips: <code>len(matrix)</code> gets the number of rows, <code>len(matrix[0])</code> gets the number of columns.</p>
<h3 id="filter" tabindex="-1"><a class="header-anchor" href="#filter" aria-hidden="true">#</a> filter()</h3>
<p>假设你想从考试分数的一个列表中删除所有的 0 分，如下的循环可以完成这个任务：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>newList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token keyword">for</span> number <span class="token keyword">in</span> oldList<span class="token punctuation">:</span>
    <span class="token keyword">if</span> number <span class="token operator">></span> <span class="token number">0</span> <span class="token punctuation">:</span>
        newList<span class="token punctuation">.</span>append<span class="token punctuation">(</span>number<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>如果使用 <code>filter()</code> 则只需要如下代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>newList <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">filter</span><span class="token punctuation">(</span>isPositive<span class="token punctuation">,</span> oldList<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>再使用<code>lambda</code>表达式创建匿名函数：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>newList <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">filter</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> number<span class="token punctuation">:</span> number <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">,</span> oldList<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> <strong>name</strong></h3>
<p><code>__name__</code> 这个系统变量显示了当前模块执行过程中的名称，<code>__main__</code> 一般作为函数的入口，或者整个工程开始运行的入口。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment">#test.py</span>
<span class="token keyword">def</span> <span class="token function">HaveFun</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'My name is %s'</span> <span class="token operator">%</span> __name__<span class="token punctuation">)</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'Someone else called me! my name is %s'</span> <span class="token operator">%</span> __name__<span class="token punctuation">)</span>
HaveFun<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>output: <code>My name is __mian__</code></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment">#main.py</span>
<span class="token keyword">import</span> test
test<span class="token punctuation">.</span>HaveFun<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>output:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>Someone <span class="token keyword">else</span> called me<span class="token operator">!</span> my name is <span class="token builtin class-name">test</span>
Someone <span class="token keyword">else</span> called me<span class="token operator">!</span> my name is <span class="token builtin class-name">test</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="random" tabindex="-1"><a class="header-anchor" href="#random" aria-hidden="true">#</a> random()</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> random
<span class="token keyword">import</span> string
src <span class="token operator">=</span> string<span class="token punctuation">.</span>digits <span class="token operator">+</span> string<span class="token punctuation">.</span>ascii_letters
password <span class="token operator">=</span> random<span class="token punctuation">.</span>sample<span class="token punctuation">(</span>src<span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>password<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>利用 <code>random.sample()</code> 生成 4 位随机密码。</p>
<h2 id="collections" tabindex="-1"><a class="header-anchor" href="#collections" aria-hidden="true">#</a> Collections</h2>
<h3 id="ordereddict" tabindex="-1"><a class="header-anchor" href="#ordereddict" aria-hidden="true">#</a> OrderedDict</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">from</span> collections <span class="token keyword">import</span> OrderedDict
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><code>OrderedDict</code> 是一个可以记录其插入次序的字典，可以结合排序，构造一个排序的字典。</p>
<blockquote>
<p>If the value of a certain key is changed, the position of the key remains unchanged in OrderedDict.
Deleting and re-inserting the same key will push it to the back as OrderedDict however maintains the order of insertion.</p>
</blockquote>
<ul>
<li>
<p><code>move_to_end()</code>: 将该元素放置于字典的尾部</p>
</li>
<li>
<p><code>popitem(last=True)</code>: pop 元素使其成为先进先出队列</p>
</li>
</ul>
<p><a href="https://github.com/chenweigao/_code/blob/f43526c616e0d3799bbc6d1e2f703ebc2e9ad355/interview/huawei2016_2.py" target="_blank" rel="noopener noreferrer">这是一道华为的笔试题，用于处理一些文件日志功能<ExternalLinkIcon/></a></p>
<h2 id="decorators" tabindex="-1"><a class="header-anchor" href="#decorators" aria-hidden="true">#</a> decorators</h2>
<h3 id="property" tabindex="-1"><a class="header-anchor" href="#property" aria-hidden="true">#</a> @property</h3>
<p>In Python, <code>property()</code> is a built-in function that creates and returns a property object. The signature of this function is:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token builtin">property</span><span class="token punctuation">(</span>fget<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">,</span> fset<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">,</span> fdel<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">,</span> doc<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>where, <code>fget</code> is function to get value of the attribute, <code>fset</code> is function to set value of the attribute, <code>fdel</code> is function to delete the attribute and <code>doc</code> is a string (like a comment).</p>
<p>To better understand this, <a href="https://www.programiz.com/python-programming/property" target="_blank" rel="noopener noreferrer">see this blog<ExternalLinkIcon/></a>.</p>
<p>一般情况下，我们在定义一个类的时候可能会涉及到访问这个类中的私有元素，一般情况下我们会使用一个函数来返回它，但是 Python 中可以使用 <code>@property</code> 装饰器来优雅地实现这个功能。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">ClassName</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>

    <span class="token decorator annotation punctuation">@property</span>
    <span class="token keyword">def</span> <span class="token function">name</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>_name

    <span class="token decorator annotation punctuation">@name<span class="token punctuation">.</span>setter</span>
    <span class="token keyword">def</span> <span class="token function">name</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>_name <span class="token operator">=</span> value

<span class="token comment"># use the value of 'name'</span>
c <span class="token operator">=</span> ClassName<span class="token punctuation">(</span><span class="token punctuation">)</span>
c<span class="token punctuation">.</span>name
<span class="token comment"># return the self._name's value</span>
c<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">'weigao'</span>
<span class="token comment"># ok</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>还有一个例子可以参考这里 <a href="https://github.com/chenweigao/multi_thread_and_process/blob/master/threading_Thread.py" target="_blank" rel="noopener noreferrer">Thread code<ExternalLinkIcon/></a></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Screen</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token decorator annotation punctuation">@property</span>
    <span class="token keyword">def</span> <span class="token function">width</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>_width

    <span class="token decorator annotation punctuation">@width<span class="token punctuation">.</span>setter</span>
    <span class="token keyword">def</span> <span class="token function">width</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>_width <span class="token operator">=</span> value

    <span class="token decorator annotation punctuation">@property</span>
    <span class="token keyword">def</span> <span class="token function">resolution</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>_width <span class="token operator">*</span> <span class="token number">1024</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>在上述例子中，<code>width</code> 为可读写的，而 <code>resolution</code> 为只读属性。</p>
<h2 id="effective-python" tabindex="-1"><a class="header-anchor" href="#effective-python" aria-hidden="true">#</a> Effective Python</h2>
<h3 id="function-closure" tabindex="-1"><a class="header-anchor" href="#function-closure" aria-hidden="true">#</a> Function Closure</h3>
<p>(<a href="https://github.com/chenweigao/_code/blob/master/Effective_Python/EP15.py" target="_blank" rel="noopener noreferrer">EP 15<ExternalLinkIcon/></a>)有的时候需要将重要的消息或者意外的事件优先显示在其他内容前面，可以使用以下代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">sort_priority</span><span class="token punctuation">(</span>values<span class="token punctuation">,</span> group<span class="token punctuation">)</span><span class="token punctuation">:</span>
    found <span class="token operator">=</span> <span class="token boolean">False</span>

    <span class="token keyword">def</span> <span class="token function">helper</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">nonlocal</span> found
        <span class="token keyword">if</span> x <span class="token keyword">in</span> group<span class="token punctuation">:</span>
            found <span class="token operator">=</span> <span class="token boolean">True</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> x<span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> x<span class="token punctuation">)</span>
    values<span class="token punctuation">.</span>sort<span class="token punctuation">(</span>key<span class="token operator">=</span>helper<span class="token punctuation">)</span>
    <span class="token keyword">return</span> found
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>上述代码把 <code>helper()</code> 这个闭包函数，传给 <code>sort</code> 方法的 <code>key</code> 参数。</p>
<p><strong>思考</strong>：第 7 行和第 8 行的 return 的含义？</p>
<h3 id="generator" tabindex="-1"><a class="header-anchor" href="#generator" aria-hidden="true">#</a> Generator</h3>
<p>(<a href="https://github.com/chenweigao/_code/blob/master/Effective_Python/EP16.py" target="_blank" rel="noopener noreferrer">EP 16<ExternalLinkIcon/></a>)生成器是使用 <code>yield</code> 表达式的函数，为了提高编程效率，考虑用<strong>生成器来改写直接返回列表的函数</strong>。调用生成器时，会返回迭代器。</p>
<p>在这个例子中的错误示例中，使用 <code>append</code> 把所有的结果都放在列表里面，如果输入量非常大的话，会导致程序消耗尽内存而奔溃。</p>
<h2 id="urllib" tabindex="-1"><a class="header-anchor" href="#urllib" aria-hidden="true">#</a> urllib</h2>
<h3 id="reading-json-file-from-url" tabindex="-1"><a class="header-anchor" href="#reading-json-file-from-url" aria-hidden="true">#</a> Reading json file from URL</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">from</span> urllib <span class="token keyword">import</span> request
<span class="token keyword">import</span> json

<span class="token keyword">with</span> request<span class="token punctuation">.</span>urlopen<span class="token punctuation">(</span><span class="token string">'http://118.24.241.17/path.json'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
    data <span class="token operator">=</span> f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>
    data_json <span class="token operator">=</span> json<span class="token punctuation">.</span>loads<span class="token punctuation">(</span>data<span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token string">'utf8'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><code>data_json</code> is the json file we need.</p>
<h2 id="regular-expression-re-正则表达式" tabindex="-1"><a class="header-anchor" href="#regular-expression-re-正则表达式" aria-hidden="true">#</a> Regular Expression - re 正则表达式</h2>
<p><a href="https://deerchao.net/tutorials/regex/regex.htm" target="_blank" rel="noopener noreferrer">参考这篇教程：正则表达式30分钟入门教程<ExternalLinkIcon/></a></p>
<p>在 Python 中，如果想使用正则表达式：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> re
re<span class="token punctuation">.</span><span class="token keyword">match</span><span class="token punctuation">(</span><span class="token string">r'^[1-9]\d{4,11}$'</span><span class="token punctuation">,</span> nums<span class="token punctuation">)</span>

pattern <span class="token operator">=</span> re<span class="token punctuation">.</span><span class="token builtin">compile</span><span class="token punctuation">(</span><span class="token string">r'some regular expression'</span><span class="token punctuation">)</span>
re<span class="token punctuation">.</span>findall<span class="token punctuation">(</span>pattern<span class="token punctuation">,</span> sentence<span class="token punctuation">)</span>
<span class="token comment"># find all matched of pattern in sentence</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><blockquote>
<p>第三方模块 <a href="https://pypi.org/project/regex/" target="_blank" rel="noopener noreferrer">regex<ExternalLinkIcon/></a> , 提供了与标准库 <a href="https://docs.python.org/zh-cn/3/library/re.html#module-re" target="_blank" rel="noopener noreferrer"><code>re</code><ExternalLinkIcon/></a> 模块兼容的 API 接口，同时，还提供了更多功能和更全面的 Unicode 支持。</p>
</blockquote>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>prog <span class="token operator">=</span> re<span class="token punctuation">.</span><span class="token builtin">compile</span><span class="token punctuation">(</span>pattern<span class="token punctuation">)</span>
result <span class="token operator">=</span> prog<span class="token punctuation">.</span><span class="token keyword">match</span><span class="token punctuation">(</span>string<span class="token punctuation">)</span>

<span class="token comment"># 等价于</span>
result <span class="token operator">=</span> re<span class="token punctuation">.</span><span class="token keyword">match</span><span class="token punctuation">(</span>pattern<span class="token punctuation">,</span> string<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="requests" tabindex="-1"><a class="header-anchor" href="#requests" aria-hidden="true">#</a> requests</h2>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> requests
<span class="token keyword">import</span> urllib<span class="token punctuation">.</span>parse

data <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"weigao"</span><span class="token punctuation">,</span>
    <span class="token string">"age"</span><span class="token punctuation">:</span> <span class="token number">20</span>
<span class="token punctuation">}</span>

json_data <span class="token operator">=</span> json<span class="token punctuation">.</span>dumps<span class="token punctuation">(</span>data<span class="token punctuation">)</span>
<span class="token comment"># '{"name": "weigao", "age": 20}'</span>

values <span class="token operator">=</span> urllib<span class="token punctuation">.</span>parse<span class="token punctuation">.</span>urlencode<span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token string">"data"</span><span class="token punctuation">:</span> json_data<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment"># 'data=%7B%22name%22%3A+%22weigao%22%2C+%22age%22%3A+20%7D'</span>

url<span class="token operator">=</span><span class="token string">'http://api.weixin.oa.com/itilalarmcgi/sendmsg'</span>

response <span class="token operator">=</span> requests<span class="token punctuation">.</span>post<span class="token punctuation">(</span>url<span class="token punctuation">,</span> data<span class="token operator">=</span>values<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h2 id="python-tools" tabindex="-1"><a class="header-anchor" href="#python-tools" aria-hidden="true">#</a> Python Tools</h2>
<h3 id="ipython" tabindex="-1"><a class="header-anchor" href="#ipython" aria-hidden="true">#</a> IPython</h3>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pip <span class="token function">install</span> jupyter
jupyter notebook
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="timeit" tabindex="-1"><a class="header-anchor" href="#timeit" aria-hidden="true">#</a> %timeit</h3>
<p>In <code>IPython</code>, we could use <code>%timeit</code> to calculate the time consume of a command:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>In <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token operator">%</span>timeit <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span>

In <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token operator">%</span>timeit <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="personalized" tabindex="-1"><a class="header-anchor" href="#personalized" aria-hidden="true">#</a> Personalized</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> sys
sys<span class="token punctuation">.</span>ps1
<span class="token string">'>>>'</span>

sys<span class="token punctuation">.</span>ps1 <span class="token operator">=</span> <span class="token string">'cwg-python>>'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>这样就可以改变解释器前面的那个外观了，注意修改后退出不会保存修改的结果。</p>
<h3 id="file-server" tabindex="-1"><a class="header-anchor" href="#file-server" aria-hidden="true">#</a> File Server</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>python <span class="token operator">-</span>m http<span class="token punctuation">.</span>server
<span class="token comment">#default port: 8000</span>

python <span class="token operator">-</span>m http<span class="token punctuation">.</span>server <span class="token number">80</span>
<span class="token comment">#in port 80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="networks-and-interprocess-communication" tabindex="-1"><a class="header-anchor" href="#networks-and-interprocess-communication" aria-hidden="true">#</a> Networks and Interprocess Communication</h2>
<h3 id="coroutines-协程" tabindex="-1"><a class="header-anchor" href="#coroutines-协程" aria-hidden="true">#</a> Coroutines-协程</h3>
<blockquote>
<p>协程通过 <code>async/await</code> 语法进行声明，是编写异步应用的推荐方式。<a href="https://docs.python.org/zh-cn/3/library/asyncio-task.html" target="_blank" rel="noopener noreferrer">官方教程<ExternalLinkIcon/></a></p>
</blockquote>
<p>协程有两个紧密关联的概念：</p>
<ol>
<li>
<p>协程函数：定义形式为 <code>asyncio def</code> 的函数</p>
</li>
<li>
<p>协程对象：调用协程函数所返回的对象</p>
</li>
</ol>
<p>在 Python 中，<strong>单线程 + 异步 I/O</strong> 的编程模型被称为协程，有了协程的支持，就可以基于事件驱动编写高效的多任务程序。</p>
<h3 id="asyncio" tabindex="-1"><a class="header-anchor" href="#asyncio" aria-hidden="true">#</a> asyncio</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> asyncio
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><ul>
<li>
<p>运行一个协程使用 <code>asyncio.run()</code>, 该函数用于函数运行的入口</p>
</li>
<li>
<p>等待一个协程使用 <code>asyncio.sleep(1)</code></p>
</li>
<li>
<p>使用协程并发处理多任务使用 <code>asyncio.gather()</code></p>
</li>
</ul>
<p>记住协程是 <code>await</code> 对象！<a href="https://github.com/chenweigao/multi_thread_and_process/blob/master/asyncio_coroutines.py" target="_blank" rel="noopener noreferrer">基础的用法可以参考代码<ExternalLinkIcon/></a></p>
</template>
