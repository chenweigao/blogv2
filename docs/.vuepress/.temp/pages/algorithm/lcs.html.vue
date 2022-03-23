<template><h2 id="summary" tabindex="-1"><a class="header-anchor" href="#summary" aria-hidden="true">#</a> Summary</h2>
<p>LCS 问题有很多的子问题，大致包括以下：</p>
<ul>
<li>
<p>最长公共子串，要求子串在原字符串中是<strong>连续</strong>的</p>
</li>
<li>
<p>最长公共子序列</p>
</li>
<li>
<p>最大子序列</p>
</li>
<li>
<p>最长递增子序列</p>
</li>
</ul>
<h2 id="最长公共子串" tabindex="-1"><a class="header-anchor" href="#最长公共子串" aria-hidden="true">#</a> 最长公共子串</h2>
<h3 id="暴力求解" tabindex="-1"><a class="header-anchor" href="#暴力求解" aria-hidden="true">#</a> 暴力求解</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">LCSubStr</span><span class="token punctuation">(</span>str1<span class="token punctuation">,</span> str2<span class="token punctuation">,</span> m<span class="token punctuation">,</span> n<span class="token punctuation">)</span><span class="token punctuation">:</span>
    LCSuff <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">0</span> <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>m <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span>

    <span class="token comment"># 最长公共子串的长度</span>
    result <span class="token operator">=</span> <span class="token number">0</span>

    <span class="token comment"># str1 中的最后相同的位置</span>
    p <span class="token operator">=</span> <span class="token number">0</span>

    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>m <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>i <span class="token operator">==</span> <span class="token number">0</span> <span class="token keyword">or</span> j <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                LCSuff<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
            <span class="token keyword">elif</span><span class="token punctuation">(</span>str1<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">==</span> str2<span class="token punctuation">[</span>j <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                LCSuff<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> LCSuff<span class="token punctuation">[</span>i<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span>
                result <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>result<span class="token punctuation">,</span> LCSuff<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span>
                p <span class="token operator">=</span> i
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                LCSuff<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>

    <span class="token keyword">return</span> str1<span class="token punctuation">[</span>p <span class="token operator">-</span> result<span class="token punctuation">:</span>p<span class="token punctuation">]</span><span class="token punctuation">,</span> result


X <span class="token operator">=</span> <span class="token string">'OldSite:GeeksforGeeks.org'</span>
Y <span class="token operator">=</span> <span class="token string">'NewSite:GeeksQuiz.com'</span>

m <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>X<span class="token punctuation">)</span>
n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>Y<span class="token punctuation">)</span>

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'Length of Longest Common Substring is'</span><span class="token punctuation">,</span>
      LCSubStr<span class="token punctuation">(</span>X<span class="token punctuation">,</span> Y<span class="token punctuation">,</span> m<span class="token punctuation">,</span> n<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div></template>
