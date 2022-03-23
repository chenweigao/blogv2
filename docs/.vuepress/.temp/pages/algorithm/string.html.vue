<template><h2 id="string" tabindex="-1"><a class="header-anchor" href="#string" aria-hidden="true">#</a> String</h2>
<h3 id="python-string" tabindex="-1"><a class="header-anchor" href="#python-string" aria-hidden="true">#</a> Python String</h3>
<h4 id="求-string-长度" tabindex="-1"><a class="header-anchor" href="#求-string-长度" aria-hidden="true">#</a> 求 String 长度</h4>
<h3 id="c-string" tabindex="-1"><a class="header-anchor" href="#c-string" aria-hidden="true">#</a> C String</h3>
<h2 id="problems" tabindex="-1"><a class="header-anchor" href="#problems" aria-hidden="true">#</a> Problems</h2>
<p>在算法中，字符串的操作和数组一样，都是很热门的考察点，这篇文章将总结一下常见的有关 string 的算法，方便查阅学习、总结。</p>
<h3 id="判断两个字符串是否只相差一个字母" tabindex="-1"><a class="header-anchor" href="#判断两个字符串是否只相差一个字母" aria-hidden="true">#</a> 判断两个字符串是否只相差一个字母</h3>
<p>注意，针对已经排序的字符串，判断这两个字符串是否只相差一个字母（也就是说第二个字符串比第一个字符串多最后一个字母，如 <code>abc</code> 和 <code>abcd</code> 这种）。</p>
<p>我真的是个猪脑子，可能是加班太多了没有脑子思考了，真的很痛恨加班，对身体和心灵都是巨大的伤害，可怜哦，又是被牺牲的一代人~</p>
<p>言归正传，之前想法是，用 <code>and</code> 或者 <code>or</code> 操作来判断之类的思路，但是这种思路比较烂，正确的做法是：</p>
<p><code>s1 = 'abc', s2 = 'abcd'</code>, 则： <code>s2[:-1] == s1</code>, 直接搞定！</p>
<h3 id="lc521-最长特殊序列1-判断子序列" tabindex="-1"><a class="header-anchor" href="#lc521-最长特殊序列1-判断子序列" aria-hidden="true">#</a> LC521 最长特殊序列1 -- 判断子序列</h3>
<p><a href="https://leetcode-cn.com/problems/longest-uncommon-subsequence-i/" target="_blank" rel="noopener noreferrer">LC521<ExternalLinkIcon/></a></p>
<p>这个题目涉及到基础知识：如何判断一个字符串是否另一个的子序列？ @todo</p>
<blockquote>
<p>给你两个字符串 a 和 b，请返回 这两个字符串中 最长的特殊序列  的长度。如果不存在，则返回 -1 。</p>
</blockquote>
<blockquote>
<p>字符串 s 的子序列是在从 s 中删除任意数量的字符后可以获得的字符串。</p>
<p>例如，&quot;abc&quot; 是 &quot;aebdc&quot; 的子序列，因为删除 &quot;aebdc&quot; 中斜体加粗的字符可以得到 &quot;abc&quot; 。 &quot;aebdc&quot; 的子序列还包括 &quot;aebdc&quot; 、 &quot;aeb&quot; 和 &quot;&quot; (空字符串)。</p>
</blockquote>
<p>但是实际上是想太多了，可以分情况讨论：</p>
<ol>
<li><code>aaa</code> and <code>bbbb</code>, 我们选择 <code>bbbb</code>, 因为其长度为 4, 所以肯定不是 <code>aaa</code> 的子序列；</li>
<li><code>aaa</code> and <code>aaaa</code> 也一样；</li>
<li><code>abc</code> and <code>abc</code>, 就是 3;</li>
<li><code>abcd</code> and <code>abcd</code> 就是 4.</li>
</ol>
<p>合理理解题目非常重要。</p>
<p>实现的代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findLUSlength</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> a<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> b<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> a <span class="token operator">==</span> b<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
        <span class="token keyword">return</span> <span class="token builtin">max</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="查找字符串中第一个出现的不重复的元素-阿里" tabindex="-1"><a class="header-anchor" href="#查找字符串中第一个出现的不重复的元素-阿里" aria-hidden="true">#</a> 查找字符串中第一个出现的不重复的元素（阿里）</h3>
<p>这道题目是阿里面试的第一道算法题目，题目意思大概如下：</p>
<p><a href="https://leetcode.com/problems/first-unique-character-in-a-string/" target="_blank" rel="noopener noreferrer">https://leetcode.com/problems/first-unique-character-in-a-string/<ExternalLinkIcon/></a></p>
<p>类似于这道题目，但是不同的是需要返回这个字符，而不是字符的下标，解决方法的比较优秀的解法是使用<strong>hash map</strong>，但是面试的时候限定了这个题目不能使用任何的自带库，所以 <code>unordered_map</code> 是无法使用的，我们需要自己创建一个 hash(这也是最快的解法)：</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
<span class="token keyword">public</span><span class="token operator">:</span>
    <span class="token keyword">int</span> <span class="token function">firstUniqChar</span><span class="token punctuation">(</span>string s<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> hash<span class="token punctuation">[</span><span class="token number">26</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">auto</span> <span class="token operator">&amp;</span>c<span class="token operator">:</span> s<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            hash<span class="token punctuation">[</span>c<span class="token punctuation">]</span><span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> s<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>hash<span class="token punctuation">[</span>s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span> j<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>使用 <code>unordered_map</code> 的解法如下：</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
<span class="token keyword">public</span><span class="token operator">:</span>
    <span class="token keyword">int</span> <span class="token function">firstUniqChar</span><span class="token punctuation">(</span>string s<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        unordered_map<span class="token operator">&lt;</span><span class="token keyword">char</span><span class="token punctuation">,</span> <span class="token keyword">int</span><span class="token operator">></span> hash<span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">auto</span> <span class="token operator">&amp;</span>ch<span class="token operator">:</span> s<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            hash<span class="token punctuation">[</span>ch<span class="token punctuation">]</span><span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> s<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>hash<span class="token punctuation">[</span>s<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span> i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>


</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>如果使用 python 的话，使用 hash_map 容器 <code>collections.Counter()</code>:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">firstUniqChar</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        counter <span class="token operator">=</span> collections<span class="token punctuation">.</span>Counter<span class="token punctuation">(</span>s<span class="token punctuation">)</span>
        <span class="token keyword">for</span> idx<span class="token punctuation">,</span> ch <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> counter<span class="token punctuation">[</span>ch<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> idx
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>或者自己创建一个 dict：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">firstUniqChar</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>

        dic <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token keyword">for</span> ch <span class="token keyword">in</span> s<span class="token punctuation">:</span>
            dic<span class="token punctuation">[</span>ch<span class="token punctuation">]</span> <span class="token operator">=</span> dic<span class="token punctuation">.</span>get<span class="token punctuation">(</span>ch<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> dic<span class="token punctuation">.</span>get<span class="token punctuation">(</span>s<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> i
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="替换字符串中的空格" tabindex="-1"><a class="header-anchor" href="#替换字符串中的空格" aria-hidden="true">#</a> 替换字符串中的空格</h3>
<blockquote>
<p>请实现一个函数，将一个字符串中的每个空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。</p>
</blockquote>
<p>这道题目用python 实现比较简单：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">replaceSpace</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">)</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token string">''</span>
        <span class="token keyword">for</span> ch <span class="token keyword">in</span> s<span class="token punctuation">:</span>
            <span class="token keyword">if</span> ch <span class="token operator">==</span> <span class="token string">' '</span><span class="token punctuation">:</span>
                res <span class="token operator">+=</span> <span class="token string">'%20'</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                res <span class="token operator">+=</span> ch
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>但是用 C++ 实现会比较麻烦：</p>
<div class="language-cpp ext-cpp line-numbers-mode"><pre v-pre class="language-cpp"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
<span class="token keyword">public</span><span class="token operator">:</span>
    <span class="token keyword">void</span> <span class="token function">replaceSpace</span><span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span>str<span class="token punctuation">,</span><span class="token keyword">int</span> length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">char</span> s<span class="token punctuation">;</span>
        <span class="token keyword">int</span> newlen <span class="token operator">=</span> length<span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token char">'\0'</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token char">' '</span><span class="token punctuation">)</span>
            <span class="token punctuation">{</span>
                newlen <span class="token operator">+=</span> <span class="token number">2</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        str <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token function">malloc</span><span class="token punctuation">(</span>newlen <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">char</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> newlen <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">>=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token char">' '</span><span class="token punctuation">)</span>
            <span class="token punctuation">{</span>
                str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token char">'0'</span><span class="token punctuation">;</span>
                str<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token char">'2'</span><span class="token punctuation">;</span>
                str<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">2</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token char">'%'</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">else</span>
            <span class="token punctuation">{</span>
                str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> str<span class="token punctuation">[</span>length<span class="token punctuation">]</span><span class="token punctuation">;</span>
                length<span class="token operator">--</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><p>放在这里可以参考。</p>
</template>
