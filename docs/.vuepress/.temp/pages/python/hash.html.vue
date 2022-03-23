<template><p>以前很擅长写这个，现在记性不太好了，今天练习了一下，写在这里备忘一下。</p>
<h2 id="_1-hash-map-in-python" tabindex="-1"><a class="header-anchor" href="#_1-hash-map-in-python" aria-hidden="true">#</a> 1. Hash Map in Python</h2>
<h3 id="_1-1-implement" tabindex="-1"><a class="header-anchor" href="#_1-1-implement" aria-hidden="true">#</a> 1.1 Implement</h3>
<p>Python 中的 Hash Map 使用方法很多，以后会慢慢复习到，现在先写上基本的实现。</p>
<p>LeetCode 的一个题目涉及到了这个问题：<a href="https://leetcode.com/problems/number-of-good-pairs/" target="_blank" rel="noopener noreferrer">1512. Number of Good Pairs<ExternalLinkIcon/></a></p>
<p>对于这个题目的实现如下：</p>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/algorithm/hash_map_1.py</p>
<p>具体的<a href="https://github.com/chenweigao/_code/blob/master/LeetCode/LC1512_Number_of_good_pairs.py" target="_blank" rel="noopener noreferrer">完整示例<ExternalLinkIcon/></a>可以参考 GitHub。</p>
<h2 id="_2-collections-counter" tabindex="-1"><a class="header-anchor" href="#_2-collections-counter" aria-hidden="true">#</a> 2. collections.Counter()</h2>
<h4 id="_2-1-values" tabindex="-1"><a class="header-anchor" href="#_2-1-values" aria-hidden="true">#</a> 2.1 .values()</h4>
<p>这是 python 官方库的实现方式，使用前需要先导入 <code>collections</code> 依赖。</p>
<p>以 leetcode 的 <a href="https://leetcode-cn.com/problems/unique-number-of-occurrences/" target="_blank" rel="noopener noreferrer">1207<ExternalLinkIcon/></a> 题目举例来说明用法：</p>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/algorithm/hash_map_2.py</p>
<p>该题目中使用了 <code>collections.Counter()</code> 获得字典，而后通过 <code>.values()</code> 拿到字典中的 value 集合，最后通过将其转化为 set 来判断是否与原有字典长度相等达到解决问题的目的。</p>
<h2 id="_3-ordereddict" tabindex="-1"><a class="header-anchor" href="#_3-ordereddict" aria-hidden="true">#</a> 3. OrderedDict</h2>
<h3 id="_3-1-abstract" tabindex="-1"><a class="header-anchor" href="#_3-1-abstract" aria-hidden="true">#</a> 3.1 Abstract</h3>
<h4 id="init" tabindex="-1"><a class="header-anchor" href="#init" aria-hidden="true">#</a> init</h4>
<p><code>OrderedDict</code> 是 python3 内置的数据结构，其主要存在两个函数可以供我们使用：</p>
<ol>
<li><code>move_to_end</code></li>
<li><code>popitem</code></li>
</ol>
<p>初始化 <code>OrderedDict</code>:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> collections

d <span class="token operator">=</span> collections<span class="token punctuation">.</span>OrderedDict<span class="token punctuation">.</span>fromkeys<span class="token punctuation">(</span><span class="token string">'abcde'</span><span class="token punctuation">)</span>

<span class="token comment"># 'abcde'</span>
d_str <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>d<span class="token punctuation">.</span>keys<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h4 id="move-to-end" tabindex="-1"><a class="header-anchor" href="#move-to-end" aria-hidden="true">#</a> move_to_end()</h4>
<p>使用 <code>move_to_end</code>, 参数 <code>last</code> 指定为 True（默认值），则将特定的元素移动到 dict 的最后面，指定为 False 移动到 dict 的最前面。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># 将 b 移动到最前面</span>
d<span class="token punctuation">.</span>move_to_end<span class="token punctuation">(</span><span class="token string">'b'</span><span class="token punctuation">,</span> last<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">)</span>
<span class="token comment"># 将 b 移动到最后面, 默认是 true</span>
d<span class="token punctuation">.</span>move_to_end<span class="token punctuation">(</span><span class="token string">'b'</span><span class="token punctuation">,</span> last<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="popitem" tabindex="-1"><a class="header-anchor" href="#popitem" aria-hidden="true">#</a> popitem()</h4>
<p>使用 <code>popitem</code>，参数 <code>last</code> 指定为 True（默认值），则移除 dict 中最后的元素，指定为 False 则移除 dict 中最左的元素。</p>
<ol>
<li>
<p><code>popitem()</code> 默认参数。删除最后的元素！<code>('b', None)</code> 没有了~</p>
<p>之前的 dict 为：<code>OrderedDict([('a', None), ('c', None), ('d', None), ('e', None), ('b', None)])</code></p>
<p>使用 <code>popitem()</code>：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>item_of_b <span class="token operator">=</span> d<span class="token punctuation">.</span>popitem<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>将 dict 中的最后一个元素 <strong>b</strong> 进行了删除，成了 <code>OrderedDict([('a', None), ('c', None), ('d', None), ('e', None)])</code></p>
</li>
<li>
<p><code>popitem(last=False)</code> 。删除最左边的元素！</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>item_of_a <span class="token operator">=</span> d<span class="token punctuation">.</span>popitem<span class="token punctuation">(</span>last<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><code>OrderedDict([('a', None), ('c', None), ('d', None), ('e', None), ('b', None)])</code> --&gt; <code>OrderedDict([('c', None), ('d', None), ('e', None), ('b', None)])</code></p>
</li>
</ol>
</template>
