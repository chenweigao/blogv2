<template><h2 id="例题索引" tabindex="-1"><a class="header-anchor" href="#例题索引" aria-hidden="true">#</a> 例题索引</h2>
<table>
<thead>
<tr>
<th>问题</th>
<th>类型</th>
<th>解法</th>
<th>备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>LC560 和为 k 的子数组</td>
<td>前缀和 + dict</td>
<td>最经典的前缀和用法！</td>
<td></td>
</tr>
<tr>
<td>LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？</td>
<td>前缀和综合应用问题</td>
<td>使用到了 <code>accumulate</code></td>
<td></td>
</tr>
<tr>
<td>LC724 寻找数组的中心索引（下标）</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>LC930 和相同的二元子数组</td>
<td>前缀和 + dict</td>
<td>同解法 LC560</td>
<td></td>
</tr>
<tr>
<td>LC525 <a href="https://leetcode-cn.com/problems/contiguous-array/" target="_blank" rel="noopener noreferrer">连续数组<ExternalLinkIcon/></a></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>LC209 长度最小的子数组</td>
<td>前缀和 + 二分</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<nav class="table-of-contents"><ul><li><RouterLink to="#例题索引">例题索引</RouterLink></li><li><RouterLink to="#概述">概述</RouterLink><ul><li><RouterLink to="#前缀和快速求解">前缀和快速求解</RouterLink></li><li><RouterLink to="#前缀和原理">前缀和原理</RouterLink></li></ul></li><li><RouterLink to="#例题解析">例题解析</RouterLink><ul><li><RouterLink to="#lc1588-所有奇数长度子数组的和">LC1588 所有奇数长度子数组的和</RouterLink></li><li><RouterLink to="#lc2055-蜡烛之间的盘子">LC2055 蜡烛之间的盘子</RouterLink></li><li><RouterLink to="#lc560-和为-k-的子数组">LC560 和为 k 的子数组</RouterLink></li><li><RouterLink to="#lc1744-你能在你最喜欢的那天吃到你最喜欢的糖果吗">LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？</RouterLink></li><li><RouterLink to="#lc523-连续的子数组和">LC523 连续的子数组和</RouterLink></li><li><RouterLink to="#lc525-连续数组">LC525 连续数组</RouterLink></li><li><RouterLink to="#lc209-长度最小的子数组">LC209 长度最小的子数组</RouterLink></li></ul></li></ul></nav>
<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h2>
<h3 id="前缀和快速求解" tabindex="-1"><a class="header-anchor" href="#前缀和快速求解" aria-hidden="true">#</a> 前缀和快速求解</h3>
<p>前缀和是一种非常有用的算法思路，应当加以总结。</p>
<p>在 Python 中，可以很方便的求解一个数组的前缀和，如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> <span class="token keyword">from</span> itertools <span class="token keyword">import</span> accumulate
<span class="token operator">>></span><span class="token operator">></span> candiesCount <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">]</span>

<span class="token operator">>></span><span class="token operator">></span> accumulate<span class="token punctuation">(</span>candiesCount<span class="token punctuation">)</span>
<span class="token operator">&lt;</span>itertools<span class="token punctuation">.</span>accumulate <span class="token builtin">object</span> at <span class="token number">0x037ACEA8</span><span class="token operator">></span>

<span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">list</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>candiesCount<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">16</span><span class="token punctuation">,</span> <span class="token number">19</span><span class="token punctuation">,</span> <span class="token number">27</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="前缀和原理" tabindex="-1"><a class="header-anchor" href="#前缀和原理" aria-hidden="true">#</a> 前缀和原理</h3>
<p>前缀和关键问题在于：<strong>如何快速得到某个子数组的和？<strong>这就使用到了</strong>前缀和</strong>的技巧。</p>
<p>写伪代码实现前缀和：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span>
pre_sum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> n
<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">:</span>
    pre_sum<span class="token punctuation">[</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>上面代码求出的前缀和 <code>pre_sum</code> 的含义为：<code>pre_sum[i]</code> 为 <code>nums[0:i-1]</code>的和。</p>
<p>如果要求解  <code>nums[i..j]</code> 的和，则可以使用 <code>pre_sum[j+1] - pre_sum[i]</code> 即可。</p>
<p>如果在实际的应用中，感觉到上述的方法较为复杂，要使用 <code>accumulate</code> 方法，则需要注意到以下问题：</p>
<p>按照概述中的例子来举例：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>nums         <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span>  <span class="token number">5</span><span class="token punctuation">,</span>  <span class="token number">3</span><span class="token punctuation">,</span>  <span class="token number">8</span><span class="token punctuation">]</span>
pre_sum      <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">16</span><span class="token punctuation">,</span> <span class="token number">19</span><span class="token punctuation">,</span> <span class="token number">27</span><span class="token punctuation">]</span> <span class="token comment"># </span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>画个表格，方便理解：</p>
<table>
<thead>
<tr>
<th>i</th>
<th>0</th>
<th>1</th>
<th>2</th>
<th>3</th>
<th>4</th>
</tr>
</thead>
<tbody>
<tr>
<td>nums</td>
<td>7</td>
<td>4</td>
<td>5</td>
<td>3</td>
<td>8</td>
</tr>
<tr>
<td>pre_sum</td>
<td>7</td>
<td>11</td>
<td>16</td>
<td>19</td>
<td>27</td>
</tr>
</tbody>
</table>
<p>要求解<code>nums[1...3]</code>，可以看到，其实际的区间和为 4 + 5 + 3 为 12，对应的 <code>pre_sum[3] - pre_sum[0]</code> 为 19 - 7 = 12。</p>
<div class="custom-container tip"><p class="custom-container-title">结论</p>
<p>故得出结论：在实际的编写代码过程中，<code>nums[i..j] = pre_sum[j] - pre_sum[i - 1]</code>，但是这种方式要注意，数组越界！</p>
<p>或者将 <code>pre_sum</code> 初始化为：<code>[0] + accumulate(nums)</code>，<code>nums[i..j] = pre_sum[j+1] - pre_sum[i]</code> 即可。</p>
</div>
<h2 id="例题解析" tabindex="-1"><a class="header-anchor" href="#例题解析" aria-hidden="true">#</a> 例题解析</h2>
<h3 id="lc1588-所有奇数长度子数组的和" tabindex="-1"><a class="header-anchor" href="#lc1588-所有奇数长度子数组的和" aria-hidden="true">#</a> LC1588 所有奇数长度子数组的和</h3>
<p><a href="https://leetcode-cn.com/problems/sum-of-all-odd-length-subarrays/" target="_blank" rel="noopener noreferrer">LC1588<ExternalLinkIcon/></a></p>
<p>这道题可以帮助理解：如何获取数组中所有奇数长度的子数组，并求和。比较基础的处理方法，考验编程的基础。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> unittest
<span class="token keyword">from</span> typing <span class="token keyword">import</span> List


<span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">sumOddLengthSubarrays</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> arr<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token triple-quoted-string string">"""
        奇数子序列的和，如何与前缀和联系起来？
        前缀和的本质是为了求解数组区间的和，我们枚举所有的奇数数组区间，然后求和
        """</span>
        presum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            presum<span class="token punctuation">[</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> presum<span class="token punctuation">[</span>i<span class="token punctuation">]</span>

        res <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> start <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            length <span class="token operator">=</span> <span class="token number">1</span>
            <span class="token keyword">while</span> length <span class="token operator">+</span> start <span class="token operator">&lt;=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">:</span>
                end <span class="token operator">=</span> start <span class="token operator">+</span> length <span class="token operator">-</span> <span class="token number">1</span>
                res <span class="token operator">+=</span> presum<span class="token punctuation">[</span>end<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">-</span> presum<span class="token punctuation">[</span>start<span class="token punctuation">]</span>
                length <span class="token operator">+=</span> <span class="token number">2</span>

        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>特别的，如果是 C++/C 实现，可以如下所示：</p>
<div class="language-c ext-c line-numbers-mode"><pre v-pre class="language-c"><code><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> start <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> start <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> start<span class="token operator">++</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> length <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> start <span class="token operator">+</span> length <span class="token operator">&lt;=</span> n<span class="token punctuation">;</span> length <span class="token operator">+=</span> <span class="token number">2</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">int</span> end <span class="token operator">=</span> start <span class="token operator">+</span> length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> start<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> end<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            sum <span class="token operator">+=</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="lc2055-蜡烛之间的盘子" tabindex="-1"><a class="header-anchor" href="#lc2055-蜡烛之间的盘子" aria-hidden="true">#</a> LC2055 蜡烛之间的盘子</h3>
<p><a href="https://leetcode-cn.com/problems/plates-between-candles/" target="_blank" rel="noopener noreferrer">LC2055<ExternalLinkIcon/></a></p>
<p>直接看代码和测试用例：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">platesBetweenCandles</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> queries<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token triple-quoted-string string">"""
        先找到最左边的 | 再找到最右边的 | 然后计算之间 * 的个数
        但是暴力解法会超时，区间和一类的解法就使用前缀和的思想
        """</span>
        <span class="token comment"># 先计算每个位置为止蜡烛的数量前缀和数组</span>
        n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span>
        presum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token string">'*'</span><span class="token punctuation">:</span>
                presum<span class="token punctuation">[</span>i<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> presum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                presum<span class="token punctuation">[</span>i<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> presum<span class="token punctuation">[</span>i<span class="token punctuation">]</span>

        <span class="token comment"># 找到左右两个蜡烛的位置，注意到如果直接从左右两边搜索还是会超时，所以需要优化</span>
        <span class="token comment"># 我们尝试使用数组来维护这个边界</span>
        left<span class="token punctuation">,</span> right <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> n<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> n
        l<span class="token punctuation">,</span> r <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token string">'|'</span><span class="token punctuation">:</span>
                l <span class="token operator">=</span> i
            left<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> l

        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token string">'|'</span><span class="token punctuation">:</span>
                r <span class="token operator">=</span> i
            right<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> r
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">for</span> query <span class="token keyword">in</span> queries<span class="token punctuation">:</span>
            <span class="token comment"># 注意理解这边：right, left</span>
            x<span class="token punctuation">,</span> y <span class="token operator">=</span> right<span class="token punctuation">[</span>query<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> left<span class="token punctuation">[</span>query<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
            <span class="token keyword">if</span> x <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token keyword">or</span> y <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token keyword">or</span> x <span class="token operator">>=</span> y<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>presum<span class="token punctuation">[</span>y<span class="token punctuation">]</span> <span class="token operator">-</span> presum<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><p>测试用例如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">TestSolution</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>s <span class="token operator">=</span> Solution<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>setUp<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">tearDown</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>s <span class="token operator">=</span> <span class="token boolean">None</span>

    <span class="token keyword">def</span> <span class="token function">test_01</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        s <span class="token operator">=</span> <span class="token string">"**|**|***|"</span>
        <span class="token comment"># presum = [0, 1, 2, 2, 3, 4, 4, 5, 6, 7, 7]</span>
        queries <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
        res <span class="token operator">=</span> self<span class="token punctuation">.</span>s<span class="token punctuation">.</span>platesBetweenCandles<span class="token punctuation">(</span>s<span class="token punctuation">,</span> queries<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>assertEqual<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">test_02</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        s <span class="token operator">=</span> <span class="token string">"***|**|*****|**||**|*"</span>
        queries <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">17</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">14</span><span class="token punctuation">,</span> <span class="token number">17</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">,</span> <span class="token number">16</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
        res <span class="token operator">=</span> self<span class="token punctuation">.</span>s<span class="token punctuation">.</span>platesBetweenCandles<span class="token punctuation">(</span>s<span class="token punctuation">,</span> queries<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>assertEqual<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    unittest<span class="token punctuation">.</span>main<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><h3 id="lc560-和为-k-的子数组" tabindex="-1"><a class="header-anchor" href="#lc560-和为-k-的子数组" aria-hidden="true">#</a> LC560 和为 k 的子数组</h3>
<blockquote>
<p>给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续的子数组的个数。</p>
<p>示例 1 :</p>
<p>输入:nums = [1,1,1], k = 2</p>
<p>输出: 2 , [1,1] 与 [1,1] 为两种不同的情况。</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/subarray-sum-equals-k
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<h4 id="解法1-直接用前缀和-超时" tabindex="-1"><a class="header-anchor" href="#解法1-直接用前缀和-超时" aria-hidden="true">#</a> 解法1：直接用前缀和（超时）</h4>
<p>应用前缀和求解这个问题的时候，很容易写出如下的代码，但是该方法超时：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">subarraySum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
    <span class="token comment"># 求出前缀和数组</span>
    pre_sum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token builtin">list</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span>
    count <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># nums[i..j] = pre_sum[j+1] - pre_sum[i]</span>
            <span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">-</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> k<span class="token punctuation">:</span>
                count <span class="token operator">+=</span> <span class="token number">1</span>
     <span class="token keyword">return</span> count

<span class="token comment"># 小优化，j 从 i + 1 开始循环，提高可读性</span>
<span class="token keyword">def</span> <span class="token function">subarraySum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
    pre_sum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token builtin">list</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span>
    count <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># nums[i..j] = pre_sum[j+1] - pre_sum[i]</span>
            <span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">-</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> k<span class="token punctuation">:</span>
                count <span class="token operator">+=</span> <span class="token number">1</span>
     <span class="token keyword">return</span> count
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><h4 id="解法2-优化解法-hash-map" tabindex="-1"><a class="header-anchor" href="#解法2-优化解法-hash-map" aria-hidden="true">#</a> 解法2：优化解法（hash map）</h4>
<p>如果分析上面解法1的时间复杂度，不难看出，其时间复杂度为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>O</mi><mo stretchy="false">(</mo><msup><mi>n</mi><mn>2</mn></msup><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">O(n^2)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.0641em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">O</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span>，所以进行如下优化：</p>
<p>上述的判断语句：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">-</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> k<span class="token punctuation">:</span>
	count <span class="token operator">+=</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>等价于：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> pre_sum<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">-</span> k<span class="token punctuation">:</span>
    count <span class="token operator">+=</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>如此可以把循环进行颠倒：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment">#原来的循环</span>
<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">-</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> k<span class="token punctuation">:</span>
            count <span class="token operator">+=</span> <span class="token number">1</span>

<span class="token comment"># 颠倒后的循环</span>
<span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
	<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> pre_sum<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">-</span> k<span class="token punctuation">:</span>
            count <span class="token operator">+=</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>其含义是，<strong>有多少个 <code>i</code> 满足 <code>pre_sum[i]</code> 的值为 <code>pre_sum[j] - k</code></strong>。所以我们可以通过 hashmap 存储每一个 <code>pre_sum[i]</code> 的值，直接找到满足条件的 <code>pre_sum[i]</code> 的个数。</p>
<p>因此我们使用 hashmap，在计算前缀和的同时把前缀和的每个值出现的次数都记录在 hashmap 中。</p>
<p><s>（因此可以使用 hash map 记录下来有几个 <code>pre_sum[i]</code> 和 <code>pre_sum[j+1] - k </code> 相等，干掉内层的 for 循环。）</s></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">subarraySum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
    <span class="token comment"># # 使用 hash 表优化</span>
    <span class="token comment"># # 存储前缀和出现的次数</span>
    _dict <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span>
    _dict<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>

    count <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token comment"># 前缀和 nums[0..i]</span>
    sum_0_i <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        sum_0_i <span class="token operator">+=</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
        sum_0_j <span class="token operator">=</span> sum_0_i <span class="token operator">-</span> k
        <span class="token keyword">if</span> sum_0_j <span class="token keyword">in</span> _dict<span class="token punctuation">:</span>
            count <span class="token operator">+=</span> _dict<span class="token punctuation">[</span>sum_0_j<span class="token punctuation">]</span>
        _dict<span class="token punctuation">[</span>sum_0_i<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
        
    <span class="token keyword">return</span> count
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h4 id="解法3-对比理解" tabindex="-1"><a class="header-anchor" href="#解法3-对比理解" aria-hidden="true">#</a> 解法3：对比理解</h4>
<p>使用下面的解法，对比理解这个题目：</p>
<p>首先看优化后的 for 循环:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
	<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> pre_sum<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">-</span> k<span class="token punctuation">:</span>
            count <span class="token operator">+=</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution4</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">subarraySum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        mapping <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span>
        <span class="token comment"># 前缀和 0 出现 1 次</span>
        mapping<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>
        count <span class="token operator">=</span> <span class="token number">0</span>
        presum_j <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
            presum_j <span class="token operator">+=</span> num
            <span class="token comment"># 查找有多少个 presum[i] 等于 presum[j] - k</span>
            <span class="token comment"># 要求解的 presum[i] 的个数</span>
            <span class="token keyword">if</span> presum_j <span class="token operator">-</span> k <span class="token keyword">in</span> mapping<span class="token punctuation">:</span>
                count <span class="token operator">+=</span> mapping<span class="token punctuation">.</span>get<span class="token punctuation">(</span>presum_j <span class="token operator">-</span> k<span class="token punctuation">)</span>

            <span class="token comment"># 更新 presum[j] 的个数</span>
            <span class="token keyword">if</span> presum_j <span class="token keyword">in</span> mapping<span class="token punctuation">:</span>
                mapping<span class="token punctuation">[</span>presum_j<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                mapping<span class="token punctuation">[</span>presum_j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>
        <span class="token keyword">return</span> count
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h3 id="lc1744-你能在你最喜欢的那天吃到你最喜欢的糖果吗" tabindex="-1"><a class="header-anchor" href="#lc1744-你能在你最喜欢的那天吃到你最喜欢的糖果吗" aria-hidden="true">#</a> LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？</h3>
<p><a href="https://leetcode-cn.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day/" target="_blank" rel="noopener noreferrer">LC1744 你能在你最喜欢的那天吃到你最喜欢的糖果吗？<ExternalLinkIcon/></a></p>
<p>这个题目描述比较复杂，关键在于从题目中进行抽象，得出可以用前缀和求解的思路。</p>
<blockquote>
<p>输入：candiesCount = [7,4,5,3,8], queries = [[0,2,2],[4,2,4],[2,13,1000000000]]</p>
<p>输出：[true,false,true]</p>
<p>提示：</p>
<ol>
<li>在第 0 天吃 2 颗糖果(类型 0），第 1 天吃 2 颗糖果（类型 0），第 2 天你可以吃到类型 0 的糖果。</li>
<li>每天你最多吃 4 颗糖果。即使第 0 天吃 4 颗糖果（类型 0），第 1 天吃 4 颗糖果（类型 0 和类型 1），你也没办法在第 2 天吃到类型 4 的糖果。换言之，你没法在每天吃 4 颗糖果的限制下在第 2 天吃到第 4 类糖果。</li>
<li>如果你每天吃 1 颗糖果，你可以在第 13 天吃到类型 2 的糖果。</li>
</ol>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>巧妙用到了前缀和，解法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">canEat</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> candiesCount<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> queries<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">bool</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token comment"># 求前缀和</span>
        pre_sum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token builtin">list</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>candiesCount<span class="token punctuation">)</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">for</span> _type<span class="token punctuation">,</span> day<span class="token punctuation">,</span> cap <span class="token keyword">in</span> queries<span class="token punctuation">:</span>
            <span class="token comment"># 题意是从 0 开始，所以要 +1</span>
            min_can_eat<span class="token punctuation">,</span> max_can_eat <span class="token operator">=</span> day <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>day <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> cap
            <span class="token comment"># 表示自己喜欢吃的糖果的区间</span>
            first_favor_candy<span class="token punctuation">,</span> last_favor_candy <span class="token operator">=</span> pre_sum<span class="token punctuation">[</span>_type<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> pre_sum<span class="token punctuation">[</span>_type<span class="token punctuation">]</span> <span class="token operator">+</span> candiesCount<span class="token punctuation">[</span>_type<span class="token punctuation">]</span>
            res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>min_can_eat <span class="token operator">&lt;=</span> last_favor_candy <span class="token keyword">and</span> max_can_eat <span class="token operator">>=</span> first_favor_candy<span class="token punctuation">)</span>

        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>其中有个题解非常形象，可以参考：<a href="https://leetcode-cn.com/problems/can-you-eat-your-favorite-candy-on-your-favorite-day/solution/python3-shu-zhou-jie-ti-yi-tu-ming-liao-debzu/" target="_blank" rel="noopener noreferrer">题解<ExternalLinkIcon/></a></p>
<h3 id="lc523-连续的子数组和" tabindex="-1"><a class="header-anchor" href="#lc523-连续的子数组和" aria-hidden="true">#</a> LC523 连续的子数组和</h3>
<blockquote>
<p>给你一个整数数组 nums 和一个整数 k ，编写一个函数来判断该数组是否含有同时满足下述条件的连续子数组：</p>
<p>子数组大小 至少为 2 ，且
子数组元素总和为 k 的倍数。
如果存在，返回 true ；否则，返回 false 。</p>
<p>如果存在一个整数 n ，令整数 x 符合 x = n * k ，则称 x 是 k 的一个倍数。</p>
<p>示例 1：</p>
<p>输入：nums = [23,2,4,6,7], k = 6</p>
<p>输出：true</p>
<p>解释：[2,4] 是一个大小为 2 的子数组，并且和为 6 。</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/continuous-subarray-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>这道题目也是一个经典的前缀和应用，需要注意，直接暴力求解前缀和问题一般都会超时，需要进行优化，最终的代码如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">checkSubarraySum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        mapping <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">}</span>
        <span class="token keyword">for</span> i<span class="token punctuation">,</span> prefix <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># 保证 k!=0</span>
            key <span class="token operator">=</span> prefix <span class="token operator">%</span> k <span class="token keyword">if</span> k <span class="token keyword">else</span> prefix
            <span class="token keyword">if</span> key <span class="token keyword">not</span> <span class="token keyword">in</span> mapping<span class="token punctuation">:</span>
                mapping<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> i
            <span class="token keyword">elif</span> i <span class="token operator">-</span> mapping<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">>=</span> <span class="token number">2</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">True</span>
        <span class="token keyword">return</span> <span class="token boolean">False</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h4 id="lc-560-解法3-模板" tabindex="-1"><a class="header-anchor" href="#lc-560-解法3-模板" aria-hidden="true">#</a> LC 560 解法3：模板</h4>
<p>作为对比，如果要设计出来一个模板的话，可以将上述代码套入求解 LC560：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">subarraySum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        mapping <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span>
        mapping<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>
        count <span class="token operator">=</span> <span class="token number">0</span>

        <span class="token keyword">for</span> i<span class="token punctuation">,</span> prefix <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            key <span class="token operator">=</span> prefix <span class="token operator">-</span> k
            <span class="token keyword">if</span> key <span class="token keyword">not</span> <span class="token keyword">in</span> mapping<span class="token punctuation">:</span>
                mapping<span class="token punctuation">[</span>prefix<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                count <span class="token operator">+=</span> mapping<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
                mapping<span class="token punctuation">[</span>prefix<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
        <span class="token keyword">return</span> count
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="lc525-连续数组" tabindex="-1"><a class="header-anchor" href="#lc525-连续数组" aria-hidden="true">#</a> LC525 连续数组</h3>
<blockquote>
<p>给定一个二进制数组 nums , 找到含有相同数量的 0 和 1 的最长连续子数组，并返回该子数组的长度。</p>
<p>示例 1:</p>
<p>输入: nums = [0,1]</p>
<p>输出: 2</p>
<p>说明: [0, 1] 是具有相同数量0和1的最长连续子数组。</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/contiguous-array
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>题目分析：这道题目首先把数组中的 0 全部替换成 1，那就等价于找和为 0 的最长连续数组。不同于上面 LC560 的是，这道题目要求返回的是子数组的长度。</p>
<p>如果这道题目按照上述模板进行的话，可能会有些难理解，所以，模板不能万能的，关键还是要理解！</p>
<h4 id="解法一-模板" tabindex="-1"><a class="header-anchor" href="#解法一-模板" aria-hidden="true">#</a> 解法一：模板</h4>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findMaxLength</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        _nums <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">if</span> num <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
                _nums<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                _nums<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>

        <span class="token comment"># 遇到前缀和，首先联想到 hash map</span>
        mapping <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span>
        mapping<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
        max_len <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> i<span class="token punctuation">,</span> prefix <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span>accumulate<span class="token punctuation">(</span>_nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            key <span class="token operator">=</span> prefix <span class="token operator">-</span> <span class="token number">0</span>
            <span class="token comment"># 如果存在1和0的数量差值相等的地方，那么说明后者到前者之前1和0的数量相等！</span>
            <span class="token comment"># 换句话说，就是前缀和相等的地方，求解前缀和数组出现相等地方的最大距离</span>
            <span class="token keyword">if</span> key <span class="token keyword">not</span> <span class="token keyword">in</span> mapping<span class="token punctuation">:</span>
                mapping<span class="token punctuation">[</span>prefix<span class="token punctuation">]</span> <span class="token operator">=</span> i
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                max_len <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>max_len<span class="token punctuation">,</span> i <span class="token operator">-</span> mapping<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> max_len
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h3 id="lc209-长度最小的子数组" tabindex="-1"><a class="header-anchor" href="#lc209-长度最小的子数组" aria-hidden="true">#</a> LC209 长度最小的子数组</h3>
<blockquote>
<p>给定一个含有 n 个正整数的数组和一个正整数 target 。</p>
<p>找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。</p>
<p>示例 1：</p>
<p>输入：target = 7, nums = [2,3,1,2,4,3]</p>
<p>输出：2</p>
<p>解释：子数组 [4,3] 是该条件下的长度最小的子数组。</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/minimum-size-subarray-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>解析：可以使用前缀和来求解。</p>
<p>牢记前缀和的推导：<code>nums[i:j]</code>的和等于 <code>pre_sum[j + 1] - pre_sum[i]</code>，当初始化为 [0] + presums 的时候。</p>
<p>如果是初始化为 presums 的时候，前缀和就应该是 <code>pre_sum[j] - pre_sum[i-1]</code>，其实是等价的，就看下标的不同。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">minSubArrayLen</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        ans <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token comment"># 求前缀和，这种方式求解的前缀和 nums[i:j] = pre[j+1] - pre[i]</span>
        pre_sum <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token builtin">list</span><span class="token punctuation">(</span>itertools<span class="token punctuation">.</span>accumulate<span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span>

        <span class="token comment"># 推导一下：我们在确定左边界 i 的时候，需要求解 sum(nums[i:j]) >= target, 也就是说相当于 pre[j+1] - pre[i] >= target</span>
        <span class="token comment"># 移项可得 pre[j+1] >= pre[i] + target</span>
        <span class="token comment"># 也就是说需要找到那个 j 在数组中的插入位置</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>pre_sum<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            find <span class="token operator">=</span> pre_sum<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> target
            bound <span class="token operator">=</span> bisect<span class="token punctuation">.</span>bisect_left<span class="token punctuation">(</span>pre_sum<span class="token punctuation">,</span> find<span class="token punctuation">)</span>
            <span class="token keyword">if</span> bound <span class="token operator">!=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>pre_sum<span class="token punctuation">)</span><span class="token punctuation">:</span>
                ans <span class="token operator">=</span> <span class="token builtin">min</span><span class="token punctuation">(</span>bound <span class="token operator">-</span> i<span class="token punctuation">,</span> ans<span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token number">0</span> <span class="token keyword">if</span> ans <span class="token operator">==</span> <span class="token builtin">len</span><span class="token punctuation">(</span>pre_sum<span class="token punctuation">)</span> <span class="token keyword">else</span> ans

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div></template>
