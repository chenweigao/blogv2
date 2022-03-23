<template><h2 id="记忆化搜索" tabindex="-1"><a class="header-anchor" href="#记忆化搜索" aria-hidden="true">#</a> 记忆化搜索</h2>
<h3 id="记忆化搜索概览" tabindex="-1"><a class="header-anchor" href="#记忆化搜索概览" aria-hidden="true">#</a> 记忆化搜索概览</h3>
<p>记忆化搜索和 DP 是有很多相似之处的，所以把记忆化搜索放在 DP 里面进行研究。</p>
<p>总的来说，我们写记忆化搜索算法的步骤大致为：</p>
<ul>
<li>使用BFS记忆化：
<ol>
<li>写出这道题的暴力搜索程序（如 DFS）</li>
<li>将这个 DFS 改写城“无需外部变量”的 DFS</li>
<li>添加记忆化数组</li>
</ol>
</li>
<li>使用状态转移方程记忆化：
<ol>
<li>把这道题目的 DP 和方程写出来</li>
<li>根据它们写出 DFS 函数</li>
<li>添加记忆化数组</li>
</ol>
</li>
</ul>
<p>其优点在于：</p>
<ol>
<li>避免搜索到无用状态</li>
</ol>
<p>其缺点在于：</p>
<ol>
<li>不能滚动数组</li>
<li>有些优化较难</li>
<li>效率较低但是不至于 TLE</li>
</ol>
<h3 id="lc638-大礼包" tabindex="-1"><a class="header-anchor" href="#lc638-大礼包" aria-hidden="true">#</a> LC638 大礼包</h3>
<p><a href="https://leetcode-cn.com/problems/shopping-offers/" target="_blank" rel="noopener noreferrer">638. 大礼包<ExternalLinkIcon/></a></p>
<p>这道题目可以利用记忆化搜索的方式去求解。</p>
<p>首先按照例子解释一下这个用例：</p>
<blockquote>
<p>price = [2, 5] // A,B 对应的价格</p>
<p>special = [[3, 0, 5], [1, 2, 10]] // 表示折扣, 3A 0B 的大礼包价格是 5</p>
<p>needs = [3, 2] // 需要买的总的数量</p>
</blockquote>
<ol>
<li>
<p>我们该怎么合理使用大礼包呢？</p>
<p>按照记忆化搜索的思路，我们首先过滤掉无用的状态，即过滤掉不需要计算的大礼包，可以分几种情况来判断哪些大礼包是我们不需要的：</p>
<ul>
<li>根据题目要求「不能购买超出购物清单指定数量的物品」，如果大礼包里面的所有物品加起来超过我们要买的物品总数了，那么这个大礼包不能要；</li>
<li>大礼包不划算则不选这个大礼包（不划算指的是我单独买这些物品，下来大礼包反而贵了）</li>
<li>大礼包内不包含我们要买的物品，也不能买</li>
</ul>
<p>以上的条件就是我们记忆化搜索时可以用来筛选的条件。</p>
</li>
<li>
<p>根据题目要求，我们可以写出大致的状态转移方程。</p>
<ul>
<li>
<p>我们用 <code>dp </code>表示满足购物清单 <code>needs </code>需要的最小花费</p>
</li>
<li>
<p>我们思考满足购物清单 <code>needs </code>的最后一次购买，其可以分为两种情况：</p>
<ol>
<li>购买大礼包</li>
<li>不购买大礼包</li>
</ol>
</li>
<li>
<p>我们如果购买大礼包的时候，可以遍历每一个大礼包，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>p</mi><mi>r</mi><mi>i</mi><mi>c</mi><msub><mi>e</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">price_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.854em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">c</span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 表示第 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 个大礼包的价格，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi><mi>e</mi><mi>e</mi><mi>d</mi><msub><mi>s</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">needs_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord mathnormal">n</span><span class="mord mathnormal">ee</span><span class="mord mathnormal">d</span><span class="mord"><span class="mord mathnormal">s</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 表示大礼包中的物品清单，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi><mi>e</mi><mi>e</mi><mi>d</mi><mi>s</mi><mo>−</mo><mi>n</mi><mi>e</mi><mi>e</mi><mi>d</mi><msub><mi>s</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">needs - needs_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7778em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">n</span><span class="mord mathnormal">ee</span><span class="mord mathnormal">d</span><span class="mord mathnormal">s</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8444em;vertical-align:-0.15em;"></span><span class="mord mathnormal">n</span><span class="mord mathnormal">ee</span><span class="mord mathnormal">d</span><span class="mord"><span class="mord mathnormal">s</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 表示购物清单 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi><mi>e</mi><mi>e</mi><mi>d</mi><mi>s</mi></mrow><annotation encoding="application/x-tex">needs</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">n</span><span class="mord mathnormal">ee</span><span class="mord mathnormal">d</span><span class="mord mathnormal">s</span></span></span></span> 减去第 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 个大礼包中包含的物品清单后剩余的物品清单。</p>
</li>
</ul>
</li>
</ol>
<p>先附上官方题解，这个题解目前还有很多的疑问点：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">shoppingOffers</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> price<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> special<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> needs<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>price<span class="token punctuation">)</span>
        filter_special <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">for</span> sp <span class="token keyword">in</span> special<span class="token punctuation">:</span>
            <span class="token comment"># 比如在第一个例子中 i == 2</span>
            <span class="token comment"># 第二个条件表示大礼包是有优惠的，这时候我们选择该礼包</span>
            <span class="token keyword">if</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>sp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span> <span class="token keyword">and</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>sp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">*</span> price<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">></span> sp<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
                filter_special<span class="token punctuation">.</span>append<span class="token punctuation">(</span>sp<span class="token punctuation">)</span>

        <span class="token decorator annotation punctuation">@lru_cache</span><span class="token punctuation">(</span><span class="token boolean">None</span><span class="token punctuation">)</span>
        <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>cur_needs<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># 在不购买大礼包的时候，购买购物清单中所有物品需要的花费</span>
            min_price <span class="token operator">=</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>need <span class="token operator">*</span> price<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">for</span> i<span class="token punctuation">,</span> need <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span>cur_needs<span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">for</span> cur_special <span class="token keyword">in</span> filter_special<span class="token punctuation">:</span>
                special_price <span class="token operator">=</span> cur_special<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
                nxt_needs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
                <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">:</span>
                    <span class="token keyword">if</span> cur_special<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">></span> cur_needs<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">:</span>
                        <span class="token comment"># 不购买多于当前订单数量的物品</span>
                        <span class="token keyword">break</span>
                    <span class="token comment"># 还剩下多少物品需要购买</span>
                    nxt_needs<span class="token punctuation">.</span>append<span class="token punctuation">(</span>cur_needs<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> cur_special<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token comment"># why, 如果上述遍历完成，满足数量条件，大礼包可以购买</span>
                <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nxt_needs<span class="token punctuation">)</span> <span class="token operator">==</span> n<span class="token punctuation">:</span>
                    min_price <span class="token operator">=</span> <span class="token builtin">min</span><span class="token punctuation">(</span>min_price<span class="token punctuation">,</span> dfs<span class="token punctuation">(</span><span class="token builtin">tuple</span><span class="token punctuation">(</span>nxt_needs<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> special_price<span class="token punctuation">)</span>

            <span class="token keyword">return</span> min_price

        <span class="token keyword">return</span> dfs<span class="token punctuation">(</span><span class="token builtin">tuple</span><span class="token punctuation">(</span>needs<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><p>对应的测试用例：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>s <span class="token operator">=</span> Solution<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">test_1</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token comment"># 折扣对应的价格</span>
        price <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span>
        <span class="token comment"># 表示折扣</span>
        special <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
        <span class="token comment"># 需要买的数量</span>
        needs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span>

        res <span class="token operator">=</span> self<span class="token punctuation">.</span>s<span class="token punctuation">.</span>shoppingOffers<span class="token punctuation">(</span>price<span class="token punctuation">,</span> special<span class="token punctuation">,</span> needs<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>assertEqual<span class="token punctuation">(</span><span class="token number">14</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div></template>
