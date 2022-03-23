<template><h2 id="summary" tabindex="-1"><a class="header-anchor" href="#summary" aria-hidden="true">#</a> Summary</h2>
<h3 id="_1-二分搜索模板" tabindex="-1"><a class="header-anchor" href="#_1-二分搜索模板" aria-hidden="true">#</a> 1. 二分搜索模板</h3>
<h3 id="_1-1-基本的二分搜索算法" tabindex="-1"><a class="header-anchor" href="#_1-1-基本的二分搜索算法" aria-hidden="true">#</a> 1.1 基本的二分搜索算法</h3>
<ol>
<li>
<p>手工实现</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">search</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
        l<span class="token punctuation">,</span> r <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token keyword">while</span> l <span class="token operator">&lt;=</span> r<span class="token punctuation">:</span>
            mid <span class="token operator">=</span> l <span class="token operator">+</span> <span class="token punctuation">(</span>r <span class="token operator">-</span> l<span class="token punctuation">)</span> <span class="token operator">//</span> <span class="token number">2</span>
            <span class="token keyword">if</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&lt;</span> target<span class="token punctuation">:</span>
                l <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span>
            <span class="token keyword">elif</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">></span> target<span class="token punctuation">:</span>
                r <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> mid

        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div></li>
<li>
<p>使用 Python <code>bisect</code> 库</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">search_2</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> bisect<span class="token punctuation">.</span>bisect_left<span class="token punctuation">(</span>nums<span class="token punctuation">,</span> target<span class="token punctuation">)</span>
        <span class="token keyword">if</span> res <span class="token operator">!=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token keyword">and</span> nums<span class="token punctuation">[</span>res<span class="token punctuation">]</span> <span class="token operator">==</span> target<span class="token punctuation">:</span>
            <span class="token keyword">return</span> res
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></li>
</ol>
<h3 id="_1-2-寻找左侧边界的二分搜索" tabindex="-1"><a class="header-anchor" href="#_1-2-寻找左侧边界的二分搜索" aria-hidden="true">#</a> 1.2 寻找左侧边界的二分搜索</h3>
<ol>
<li>
<p>手工实现</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">search</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        l<span class="token punctuation">,</span> r <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token keyword">while</span> l <span class="token operator">&lt;=</span> r<span class="token punctuation">:</span>
            mid <span class="token operator">=</span> l <span class="token operator">+</span> <span class="token punctuation">(</span>r <span class="token operator">-</span> l<span class="token punctuation">)</span> <span class="token operator">//</span> <span class="token number">2</span>
            <span class="token keyword">if</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&lt;</span> target<span class="token punctuation">:</span>
                l <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span>
            <span class="token keyword">elif</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">></span> target<span class="token punctuation">:</span>
                r <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span>
            <span class="token keyword">elif</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">==</span> target<span class="token punctuation">:</span>
                <span class="token comment"># 暂时不能返回，需要收缩右边界，锁定左侧边界</span>
                r <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token comment"># 检查越界情况。注意这边下面两个条件是二选一的</span>
        <span class="token keyword">if</span> l <span class="token operator">>=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token keyword">or</span> nums<span class="token punctuation">[</span>l<span class="token punctuation">]</span> <span class="token operator">!=</span> target<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
        <span class="token keyword">return</span> l
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div></li>
<li>
<p>使用 <code>bisect</code></p>
<p>手工实现在很多情况下都需要调试，比较慢，因此使用 <code>bisect</code> 比较方便，其使用方式如下：</p>
<ul>
<li>
<p>找到 <em>Find rightmost value less than target</em>：找到小于目标元素，离目标元素最近的元素（肯定在左边）。如 <code>[-1, 1, 3, 5, 9, 12]</code> 目标元素 2, 则返回了 1，表示 2 可以插入到 1 和 3 之间。对应的下标 <code>res - 1</code> 就是 1 的下标。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">search2</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> bisect<span class="token punctuation">.</span>bisect_left<span class="token punctuation">(</span>nums<span class="token punctuation">,</span> target<span class="token punctuation">)</span>
        <span class="token keyword">if</span> res<span class="token punctuation">:</span>
            <span class="token keyword">return</span> nums<span class="token punctuation">[</span>res <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></li>
<li>
<p>找到 <em>Find rightmost value less than or equal to target</em></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">search3</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> bisect<span class="token punctuation">.</span>bisect_right<span class="token punctuation">(</span>nums<span class="token punctuation">,</span> target<span class="token punctuation">)</span>
        <span class="token keyword">if</span> res<span class="token punctuation">:</span>
            <span class="token keyword">return</span> nums<span class="token punctuation">[</span>res <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></li>
</ul>
<h3 id="_1-3-寻找右侧边界的二分搜索" tabindex="-1"><a class="header-anchor" href="#_1-3-寻找右侧边界的二分搜索" aria-hidden="true">#</a> 1.3 寻找右侧边界的二分搜索</h3>
<ol>
<li>
<p>手工实现</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">search</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        l<span class="token punctuation">,</span> r <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token keyword">while</span> l <span class="token operator">&lt;=</span> r<span class="token punctuation">:</span>
            mid <span class="token operator">=</span> l <span class="token operator">+</span> <span class="token punctuation">(</span>r <span class="token operator">-</span> l<span class="token punctuation">)</span> <span class="token operator">//</span> <span class="token number">2</span>
            <span class="token keyword">if</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&lt;</span> target<span class="token punctuation">:</span>
                l <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span>
            <span class="token keyword">elif</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">></span> target<span class="token punctuation">:</span>
                r <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span>
            <span class="token keyword">elif</span> nums<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">==</span> target<span class="token punctuation">:</span>
                <span class="token comment"># 暂时不能返回，需要收缩左边界，锁定右侧边界</span>
                l <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token comment"># 检查越界情况。注意这边下面两个条件是二选一的</span>
        <span class="token keyword">if</span> r <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token keyword">or</span> nums<span class="token punctuation">[</span>l<span class="token punctuation">]</span> <span class="token operator">!=</span> target<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
        <span class="token keyword">return</span> r
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div></li>
<li>
<p>使用库</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">find_gt</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token string">'Find leftmost value greater than x'</span>
    i <span class="token operator">=</span> bisect_right<span class="token punctuation">(</span>a<span class="token punctuation">,</span> x<span class="token punctuation">)</span>
    <span class="token keyword">if</span> i <span class="token operator">!=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">raise</span> ValueError

<span class="token keyword">def</span> <span class="token function">find_ge</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token string">'Find leftmost item greater than or equal to x'</span>
    i <span class="token operator">=</span> bisect_left<span class="token punctuation">(</span>a<span class="token punctuation">,</span> x<span class="token punctuation">)</span>
    <span class="token keyword">if</span> i <span class="token operator">!=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">raise</span> ValueError
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div></li>
</ol>
</li>
</ol>
<h3 id="_1-3-参考" tabindex="-1"><a class="header-anchor" href="#_1-3-参考" aria-hidden="true">#</a> 1.3 参考</h3>
<p>在二分查找中，要特别注意边界的问题，二分查找的边界，分为 <code>[left, right)</code> 和 <code>[left, right]</code>.</p>
<ul>
<li>初始化时，形式为 <code>left = 0, right = n</code>, 其中 <code>n</code> 表示数组的长度，由于数组取不到下标 <code>n</code>, 故为左闭右开区间；</li>
<li>初始化时，形式为 <code>left = 0, right = n - 1</code>, 故为左闭右闭区间。</li>
</ul>
<div class="custom-container danger"><p class="custom-container-title">bug!!!</p>
<p>对于左闭右开区间(<code>[left, right)</code> )而言，应注意：</p>
<p>在写代码时，应当注意边界条件：</p>
<p>如果初始化为左闭右开区间，则当 <code>mid</code> 的值小于要查找的值的时候，<code>left = mid  + 1</code> 是正确的</p>
<p>而当 <code>mid</code> 的值大于要查找的值的时候（这时候需要向左查找），此时如果让 <code>right</code> 赋值为 <code>mid - 1</code>, 则有可能存在 <code>mid - 1</code> 正好是要查找的值的情况，要十分慎重。</p>
</div>
<p>基于此，在写二分查找时，可以基于以下原则：<a href="https://github.com/chenweigao/_code/blob/master/cpp/binary_search.cpp" target="_blank" rel="noopener noreferrer">标准程序参考链接<ExternalLinkIcon/></a></p>
<ol>
<li>使用左右闭区间初始化，查找后条件应当变成：<code>left = mid + 1</code> and <code>right = mid -1</code>, 否则会出现死循环；</li>
<li>使用左闭右开区间初始化，查找后条件应当是：<code>left = mid + 1</code> and <code>right = mid</code>;</li>
<li><code>left</code> 初值为 <code>-1</code>, 循环条件使用 <code>while(left + 1 != right)</code>;</li>
<li>对边界条件专门进行判断。</li>
</ol>
<h2 id="二分查找思路整理" tabindex="-1"><a class="header-anchor" href="#二分查找思路整理" aria-hidden="true">#</a> 二分查找思路整理</h2>
<p>有下面的例子，可以分为四种问题，提出二分查找：</p>
<p><img src="/binary_search/binary_search_1.png" alt="binary_search_1" loading="lazy"></p>
<p>从一个新的角度区理解这个问题，该问题可以变为：<strong>找出图中的蓝红边界，即求出未知数K</strong>。</p>
<p><img src="/binary_search/binary_search_2.png" alt="binary_search_2" loading="lazy"></p>
<p>针对此问题，可以写出伪代码如下所示：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>l = -1, r = N
while l + 1 != r
  m = (l + r) / 2 取下界
  if isBlue(m)
    l = m
  else
    r = m
return l or r
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>有了以上的伪代码，图1 中的问题答案分别为：</p>
<p><img src="/binary_search/binary_search_3.png" alt="binary_search_3" loading="lazy"></p>
<p>参考视频：https://www.bilibili.com/video/BV1d54y1q7k7</p>
<h2 id="code" tabindex="-1"><a class="header-anchor" href="#code" aria-hidden="true">#</a> Code</h2>
<h3 id="wiki-伪代码" tabindex="-1"><a class="header-anchor" href="#wiki-伪代码" aria-hidden="true">#</a> wiki 伪代码</h3>
<div class="custom-container tip"><p class="custom-container-title">记住口诀</p>
<p><strong>mid 在前，先小后大，先左后右</strong></p>
<p>解析：mid 总是在比较的左边：mid &lt; target; 先写 mid 小于，对应左边 l = mid + 1; 再写 mid 大于，对应右边。</p>
</div>
<div class="language-c ext-c line-numbers-mode"><pre v-pre class="language-c"><code>function <span class="token function">binary_search</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> n<span class="token punctuation">,</span> T<span class="token punctuation">)</span><span class="token operator">:</span>
    L <span class="token operator">:</span><span class="token operator">=</span> <span class="token number">0</span>
    R <span class="token operator">:</span><span class="token operator">=</span> n − <span class="token number">1</span>
    <span class="token keyword">while</span> L <span class="token operator">&lt;=</span> R<span class="token operator">:</span>
        m <span class="token operator">:</span><span class="token operator">=</span> <span class="token function">floor</span><span class="token punctuation">(</span><span class="token punctuation">(</span>L <span class="token operator">+</span> R<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> A<span class="token punctuation">[</span>m<span class="token punctuation">]</span> <span class="token operator">&lt;</span> T<span class="token operator">:</span>
            L <span class="token operator">:</span><span class="token operator">=</span> m <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> A<span class="token punctuation">[</span>m<span class="token punctuation">]</span> <span class="token operator">></span> T<span class="token operator">:</span>
            R <span class="token operator">:</span><span class="token operator">=</span> m <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token keyword">else</span><span class="token operator">:</span>
            <span class="token keyword">return</span> m
    <span class="token keyword">return</span> unsuccessful
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="查找插入位置" tabindex="-1"><a class="header-anchor" href="#查找插入位置" aria-hidden="true">#</a> 查找插入位置</h3>
<p>二分查找有序序列中某个元素的位置，如果没找到，则返回其需要插入的位置(LC 035):</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>File <span class="token keyword">not</span> found</code></pre><div class="line-numbers" aria-hidden="true"></div></div><h3 id="bisect" tabindex="-1"><a class="header-anchor" href="#bisect" aria-hidden="true">#</a> bisect</h3>
<p>或者使用 Python 自带的 <strong>bisect</strong>:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> bisect
nums <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">]</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>bisect<span class="token punctuation">.</span>bisect<span class="token punctuation">(</span>nums<span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>bisect<span class="token punctuation">.</span>bisect_left<span class="token punctuation">(</span>nums<span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>注意到，<code>bisect()</code> 默认会查找元素需要插入的位置，如果是重复的元素，则会返回其最右侧可以插入的位置，使用 <code>bisect_left()</code> 可以返回其左侧位置。</p>
<h3 id="向上、下取整" tabindex="-1"><a class="header-anchor" href="#向上、下取整" aria-hidden="true">#</a> 向上、下取整</h3>
<ol>
<li>
<p>使用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mo stretchy="false">(</mo><mi>A</mi><mo>+</mo><mi>B</mi><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><mi>B</mi></mfrac></mrow><annotation encoding="application/x-tex">\frac {(A+B-1)} {B}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.355em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.01em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.05017em;">B</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.485em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight">A</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.05017em;">B</span><span class="mbin mtight">−</span><span class="mord mtight">1</span><span class="mclose mtight">)</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span> 计算</p>
</li>
<li>
<p>使用 <code>math.ceil()</code> 和 <code>math.floor()</code>:</p>
</li>
</ol>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>imprt math
math<span class="token punctuation">.</span>ceil<span class="token punctuation">(</span><span class="token number">7</span><span class="token operator">/</span><span class="token number">4</span><span class="token punctuation">)</span> <span class="token comment"># 2</span>
math<span class="token punctuation">.</span>floor<span class="token punctuation">(</span><span class="token number">7</span><span class="token operator">/</span><span class="token number">4</span><span class="token punctuation">)</span> <span class="token comment"># 1 or 7//4</span>
<span class="token builtin">round</span><span class="token punctuation">(</span><span class="token number">2.6</span><span class="token punctuation">)</span> <span class="token comment"># 3 四舍五入</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>一般而言，我们在快速排序或者二分查找中如果要计算 mid, 则可以使用 $$mid = left + \frac{right - left}{2}$$ 来计算，可以参考<a href="https://github.com/chenweigao/_code/blob/master/data_struct/binary_search.py" target="_blank" rel="noopener noreferrer">二分查找 python 代码<ExternalLinkIcon/></a></p>
<h2 id="problems" tabindex="-1"><a class="header-anchor" href="#problems" aria-hidden="true">#</a> Problems</h2>
<h3 id="查找二维数组中是否存在某个元素" tabindex="-1"><a class="header-anchor" href="#查找二维数组中是否存在某个元素" aria-hidden="true">#</a> 查找二维数组中是否存在某个元素</h3>
<p>在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。
请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。</p>
<p>/docs/.vuepress/code/algorithm/find_in_array.py</p>
<div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p>注意到这里用到了 <strong>先小(&lt;)后大(&gt;), 先左(l)后右</strong> 的口诀。</p>
</div>
<h3 id="完全平方数" tabindex="-1"><a class="header-anchor" href="#完全平方数" aria-hidden="true">#</a> 完全平方数</h3>
<p>使用二分查找判断某个数是否完全平方数：</p>
<p>/docs/.vuepress/code/algorithm/isPerfectSquare.py</p>
<h3 id="数字在排序数组中出现的次数" tabindex="-1"><a class="header-anchor" href="#数字在排序数组中出现的次数" aria-hidden="true">#</a> 数字在排序数组中出现的次数</h3>
<blockquote>
<p>统计一个数字在排序数组中出现的次数。</p>
</blockquote>
<p>使用二分查找，首先查找在前面出现的位置 start, 再查找在后面出现的位置 end, 然后相减得到答案。</p>
<p>这个题目对查找插入位置的概念进行了强化：</p>
<p>@/docs/.vuepress/code/algorithm/get_number_of_k.py</p>
<h3 id="find-peak-element-寻找峰值" tabindex="-1"><a class="header-anchor" href="#find-peak-element-寻找峰值" aria-hidden="true">#</a> Find Peak Element - 寻找峰值</h3>
<blockquote>
<p>找寻一个数组的峰值</p>
<p>输入: nums = [1,2,1,3,5,6,4]</p>
<p>输出: 1 或 5</p>
<p>解释: 你的函数可以返回索引 1，其峰值元素为 2；或者返回索引 5， 其峰值元素为 6。</p>
</blockquote>
<p>这道题目只要求返回一个峰值，所以可以从前往后遍历，遇到符合条件的返回即可，暴力解法和二分法的代码如下：</p>
<p>@/docs/.vuepress/code/algorithm/findPeakElement.py</p>
<h3 id="_875-爱吃香蕉的珂珂" tabindex="-1"><a class="header-anchor" href="#_875-爱吃香蕉的珂珂" aria-hidden="true">#</a> 875. 爱吃香蕉的珂珂</h3>
<blockquote>
<p>珂珂喜欢吃香蕉。这里有 N 堆香蕉，第 i 堆中有 piles[i] 根香蕉。警卫已经离开了，将在 H 小时后回来。</p>
<p>珂珂可以决定她吃香蕉的速度 K （单位：根/小时）。每个小时，她将会选择一堆香蕉，从中吃掉 K 根。如果这堆香蕉少于 K 根，她将吃掉这堆的所有香蕉，然后这一小时内不会再吃更多的香蕉。</p>
<p>珂珂喜欢慢慢吃，但仍然想在警卫回来前吃掉所有的香蕉。</p>
<p>返回她可以在 H 小时内吃掉所有香蕉的最小速度 K（K 为整数）。</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/koko-eating-bananas
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>下面两种解法展示了不同边界条件下该如何处理：</p>
<p>/docs/.vuepress/code/algorithm/binary_search_koko_1.py</p>
<p>/docs/.vuepress/code/algorithm/binary_search_koko_2.py</p>
</template>
