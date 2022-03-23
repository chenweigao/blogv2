<template><h2 id="概览" tabindex="-1"><a class="header-anchor" href="#概览" aria-hidden="true">#</a> 概览</h2>
<p>背包问题可以大致分为三类，分别是：</p>
<ol>
<li>背包组合问题</li>
<li>True/False 问题</li>
<li>最大最小问题</li>
</ol>
<p>其基础的背包问题一般由两个模型演变而来：</p>
<ol>
<li>0-1 背包问题</li>
<li>完全背包问题</li>
</ol>
<p>本文先研究 0-1 背包和完全背包，而后对其他问题进行研究。</p>
<h2 id="例题索引" tabindex="-1"><a class="header-anchor" href="#例题索引" aria-hidden="true">#</a> 例题索引</h2>
<h3 id="_0-1-背包" tabindex="-1"><a class="header-anchor" href="#_0-1-背包" aria-hidden="true">#</a> 0-1 背包</h3>
<table>
<thead>
<tr>
<th>问题</th>
<th>类型</th>
<th>递推公式</th>
<th>备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>例题 LC474：1和0</td>
<td>0-1 背包最大最小值问题</td>
<td><code>dp[i] = max(dp[i], dp[i-num] + 1)</code></td>
<td>两个背包</td>
</tr>
<tr>
<td>例题 LC416：分割等和子集</td>
<td>0-1 背包True/False问题</td>
<td><code>dp[i] = dp[i] or dp[i - num]</code></td>
<td></td>
</tr>
<tr>
<td>例题 LC494：目标和</td>
<td>0-1 背包组合问题</td>
<td><code>dp[i] += dp[i - num]</code></td>
<td></td>
</tr>
<tr>
<td>例题 LC1049：最后一块石头的重量 III</td>
<td>0-1 背包最大最小值问题</td>
<td><code>dp[i] = max(dp[i], dp[i-stone] + stone)</code></td>
<td></td>
</tr>
</tbody>
</table>
<h3 id="完全背包" tabindex="-1"><a class="header-anchor" href="#完全背包" aria-hidden="true">#</a> 完全背包</h3>
<table>
<thead>
<tr>
<th>问题</th>
<th>类型</th>
<th>递推公式</th>
<th>备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>例题 LC322：零钱兑换</td>
<td>完全背包最大最小值问题</td>
<td><code>dp[i] = min(dp[i], dp[i - coin] + 1)</code></td>
<td></td>
</tr>
<tr>
<td>例题 LC279：完全平方数</td>
<td>完全背包最大最小值问题</td>
<td><code>dp[i] = min(dp[i], dp[i - num] + 1)</code></td>
<td></td>
</tr>
<tr>
<td>例题 LC518：零钱兑换2</td>
<td>完全背包组合问题</td>
<td><code>dp[i] += dp[i - coin]</code></td>
<td></td>
</tr>
<tr>
<td>例题 LC377：组合总数 IV</td>
<td>完全背包组合问题</td>
<td><code>dp[i] += dp[i - num]</code></td>
<td>考虑顺序，<code>target</code> 放在外循环</td>
</tr>
<tr>
<td>例题 LC139：单词拆分</td>
<td>完全背包 True/False问题</td>
<td><code>dp[i] = dp[i] or dp[i - len(word)]</code></td>
<td>考虑顺序</td>
</tr>
</tbody>
</table>
<h2 id="_0-1-背包-1" tabindex="-1"><a class="header-anchor" href="#_0-1-背包-1" aria-hidden="true">#</a> 0-1 背包</h2>
<p>0-1 背包问题比较简单，其特点是每种物品仅有一件，可以选择放或者不放。求解将哪些物品装入背包可使价值总和最大。</p>
<h3 id="递推公式" tabindex="-1"><a class="header-anchor" href="#递推公式" aria-hidden="true">#</a> 递推公式</h3>
<p><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">(</mo><mi>i</mi><mo separator="true">,</mo><mi>v</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">F(i, v)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">(</span><span class="mord mathnormal">i</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mclose">)</span></span></span></span> 是前 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 件物品恰放入一个容量为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>v</mi></mrow><annotation encoding="application/x-tex">v</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span></span></span></span> 的背包可以获得的最大价值，其状态转移方程如下所示：</p>
<p><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">[</mo><mi>i</mi><mo separator="true">,</mo><mi>v</mi><mo stretchy="false">]</mo><mo>=</mo><mi>m</mi><mi>a</mi><mi>x</mi><mo stretchy="false">(</mo><mi>f</mi><mo stretchy="false">[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo separator="true">,</mo><mi>v</mi><mo stretchy="false">]</mo><mo separator="true">,</mo><mi>f</mi><mo stretchy="false">[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo separator="true">,</mo><mi>v</mi><mo>−</mo><msub><mi>C</mi><mi>i</mi></msub><mo stretchy="false">]</mo><mo>+</mo><msub><mi>W</mi><mi>i</mi></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">F[i,v] = max(f[i-1, v], f[i-1, v-C_i] + W_i)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mclose">]</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">ma</span><span class="mord mathnormal">x</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mclose">]</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0715em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">]</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.1389em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></p>
<p>这个递推公式表示在只考虑 <strong>将第 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 件物品放入容量为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>v</mi></mrow><annotation encoding="application/x-tex">v</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span></span></span></span> 的背包中</strong> 这个子问题，可以包含两种情况：</p>
<ol>
<li>不放第 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 件物品，问题等价于 <strong>前 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">i-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7429em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 件物品放入容量为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>v</mi></mrow><annotation encoding="application/x-tex">v</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span></span></span></span> 的背包中</strong>；
<ol>
<li>放第 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 件物品，问题等价于 <strong>前 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">i-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7429em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 件物品放入剩下容量为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>v</mi><mo>−</mo><msub><mi>C</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">v - C_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0715em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 的背包中，再加上放第 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi></mrow><annotation encoding="application/x-tex">i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">i</span></span></span></span> 件物品的重量 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>W</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">W_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.1389em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span></strong></li>
</ol>
</li>
</ol>
<h3 id="例题-经典背包问题" tabindex="-1"><a class="header-anchor" href="#例题-经典背包问题" aria-hidden="true">#</a> 例题 经典背包问题</h3>
<p>我们首先要会求解经典背包问题，举例来说：</p>
<p>背包容量：size = 90</p>
<p>每个物品的重量：costs = [71, 69, 1]</p>
<p>每个物品的价值：values = [100, 1, 2]</p>
<p>我们要求解在装更可能多的物品的条件下，使得背包内物品价值的总值最大。</p>
<p>我们使用二维 dp 可以写出如下代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">solution</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> weights<span class="token punctuation">,</span> values<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> size<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>

        n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>weights<span class="token punctuation">)</span>
        <span class="token comment"># 我们定义 dp 数组 dp[i][w], 对于前 i 个物品，当前背包容量为 w，可以装的最大价值是 dp[i][w]</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>size <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">]</span>
        <span class="token comment"># 循环中遍历物品</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> n<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># 内层循环遍历背包容量</span>
            <span class="token comment"># for j in range(size + 1) 等同</span>
            <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>size<span class="token punctuation">,</span> weights<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token comment"># 当前背包装不下</span>
                <span class="token keyword">if</span> weights<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">></span> j<span class="token punctuation">:</span>
                    dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span>
                <span class="token keyword">else</span><span class="token punctuation">:</span>
                    dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>j <span class="token operator">-</span> weights<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">+</span> values<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> dp<span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>在上述代码中，我们踩了几个坑：</p>
<ol>
<li>
<p>二维 DP 数组的定义，<code>dp = [[0] * (size + 1) for _ in range(n)]</code> 中 <code>size + 1</code> 表示列，<code>n</code> 表示行。</p>
<p>🆚🆚🆚🆚🆚 如果这样比较难记忆，不如直接使用 numpy 去定义，非常方便：<code>dp = np.zeros(shape=(n, size + 1))</code>.</p>
</li>
<li>
<p>对于 <code>dp </code>数组的定义，我们可以理解为：<code>dp[i][j]</code> 的含义为前 <code>i</code> 个物品，当前背包可用容量为 <code>j</code>，当前装下来的总价值</p>
</li>
<li>
<p>对于递推公式，是一个经典的递推，不过多解释</p>
</li>
<li>
<p>❗🔴🔴🔴 有一点需要特别注意，那就是两重 for 循环的遍历细节。</p>
<ol>
<li>第一重从 1 开始正向遍历</li>
<li>第二重遍历是和背包的总容量有关的，我们从 0 开始遍历到背包的容量为止；我们也可以从背包的容量遍历到当前要放的物品的重量停止，因为再往下就没有意义了。这两种遍历方式在本题中都是 OK 的。</li>
</ol>
</li>
</ol>
<p>🧡💛💚💙 优化</p>
<p>我们靠二维 DP 的方法求解，加深理解以后，我们可以套公式写出一维 DP 的求解，套用公式的要点在于：</p>
<ol>
<li>0-1 背包倒着循环，不考虑物品顺序，物品循环放在外侧</li>
<li>求解的是最大最小值问题，递推公式<code>dp[i] = max(dp[i], dp[i-num] + 1)</code></li>
</ol>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">solution2</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> weights<span class="token punctuation">,</span> values<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> size<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>

        <span class="token comment"># 我们拿容量去定义 dp</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> size

        <span class="token comment"># 按照背包问题的套路，遍历物品</span>
        <span class="token keyword">for</span> idx<span class="token punctuation">,</span> weight <span class="token keyword">in</span> <span class="token builtin">enumerate</span><span class="token punctuation">(</span>weights<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>size<span class="token punctuation">,</span> weight <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> weight<span class="token punctuation">]</span> <span class="token operator">+</span> values<span class="token punctuation">[</span>idx<span class="token punctuation">]</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>如此，我们就进行了统一。</p>
<h3 id="例题-lc474-1和0" tabindex="-1"><a class="header-anchor" href="#例题-lc474-1和0" aria-hidden="true">#</a> 例题 LC474：1和0</h3>
<h4 id="_474-一和零" tabindex="-1"><a class="header-anchor" href="#_474-一和零" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/ones-and-zeroes/" target="_blank" rel="noopener noreferrer">474. 一和零<ExternalLinkIcon/></a></h4>
<blockquote>
<p>问题分析：给你一个二进制字符串数组 <code>strs</code> 和两个整数 <code>m</code> 和 <code>n</code> 。请你找出并返回 <code>strs</code> 的最大子集的大小，该子集中最多有 <code>m</code> 个 <code>0</code> 和 <code>n</code> 个 <code>1</code> 。如果 <code>x</code> 的所有元素也是 <code>y</code> 的元素，集合 <code>x</code> 是集合 <code>y</code> 的 子集 。</p>
<p>输入：strs = [&quot;10&quot;, &quot;0001&quot;, &quot;111001&quot;, &quot;1&quot;, &quot;0&quot;], m = 5, n = 3</p>
<p>输出：4</p>
<p>解释：最多有 5 个 0 和 3 个 1 的最大子集是 {&quot;10&quot;,&quot;0001&quot;,&quot;1&quot;,&quot;0&quot;} ，因此答案是 4 。
其他满足题意但较小的子集包括 {&quot;0001&quot;,&quot;1&quot;} 和 {&quot;10&quot;,&quot;1&quot;,&quot;0&quot;} 。{&quot;111001&quot;} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。</p>
</blockquote>
<p>初看这道题较难理解，需要翻译一下，给定 <code>m</code> 和 <code>n</code>，表示背包中最多有 5 个 0 和 3 个 1 -- target，要求是子集，则表示不能重复选 -- 0-1 背包。</p>
<p>这就是 <strong>最大最小值的 0-1 背包问题</strong>。</p>
<p>求解代码如下所示，掌握几个关键点：</p>
<ol>
<li><strong>0-1 背包倒着循环</strong>。为什么要倒着循环？这是因为我们的递推公式中使用到了 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">i-1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7429em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span> 这个中间状态，倒着循环能够保证在推 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">[</mo><mi>i</mi><mo separator="true">,</mo><mi>v</mi><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">F[i,v]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mclose">]</span></span></span></span> 的时候能够取用 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo separator="true">,</mo><mi>v</mi><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">F[i-1, v]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mclose">]</span></span></span></span>  的值。</li>
<li>背包问题外层循环物体、内层循环容量。</li>
<li>最大最小问题的递推公式。</li>
<li>状态转移数组初始化的时候初始化为 0</li>
</ol>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findMaxForm</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> strs<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">,</span> m<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> n<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> strs<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
         dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>m <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span>

        <span class="token comment"># 遍历 nums</span>
        <span class="token keyword">for</span> s <span class="token keyword">in</span> strs<span class="token punctuation">:</span> 
            zero <span class="token operator">=</span> s<span class="token punctuation">.</span>count<span class="token punctuation">(</span><span class="token string">'0'</span><span class="token punctuation">)</span>
            one <span class="token operator">=</span> s<span class="token punctuation">.</span>count<span class="token punctuation">(</span><span class="token string">'1'</span><span class="token punctuation">)</span>
            <span class="token comment"># 0-1 背包从后往前</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>m<span class="token punctuation">,</span> zero <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">,</span> one <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                    dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> zero<span class="token punctuation">]</span><span class="token punctuation">[</span>j <span class="token operator">-</span> one<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span>m<span class="token punctuation">]</span><span class="token punctuation">[</span>n<span class="token punctuation">]</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>总结来说，这道题目并不是最典型的 0 - 1 背包问题，普通的 0-1 背包问题只有一种容量，但是该背包问题存在 0 和 1 两种容量，每个物品（字符串）均需要分别占用 0 和 1 的若干容量，并且所有物品的价值均为 1。是一个较为典型的二维动态规划问题。</p>
<p>上述代码是经过了状态压缩后的结果，如果不考虑状态压缩的话，可以定义三维 dp，state: <code>dp[i][j][k]</code>，i 可以表示选择的物品为前 i 个，j 和 k 分别表示背包 0 和背包 1 的数量限制。在递推过程中，最外循环 i 对应的最新的值，<code>dp[i][j][k] = max(dp[i-1][j-zeros][k-ones]+1, dp[i-1][j][k])</code>，将第一维压缩后便得到和代码相同的递推公式。</p>
<h3 id="例题-lc-416-分割等和子集" tabindex="-1"><a class="header-anchor" href="#例题-lc-416-分割等和子集" aria-hidden="true">#</a> 例题 LC 416：分割等和子集</h3>
<h4 id="_416-分割等和子集" tabindex="-1"><a class="header-anchor" href="#_416-分割等和子集" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/partition-equal-subset-sum/" target="_blank" rel="noopener noreferrer">416. 分割等和子集<ExternalLinkIcon/></a></h4>
<blockquote>
<p>给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。</p>
<p>示例 1：</p>
<p>输入：nums = [1,5,11,5]</p>
<p>输出：true</p>
<p>解释：数组可以分割成 [1, 5, 5] 和 [11] 。</p>
</blockquote>
<p>分析题目可知：</p>
<ol>
<li>0-1 背包问题，循环倒着来</li>
<li>Trur/False 问题，递推公式为：<code>dp[i] = d[i] or dp[i -num]</code></li>
</ol>
<p>该题目的要求可以理解为：从背包中找若干个物品，其价值和正好为背包容量的一半。</p>
<p>代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">canPartition</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>

        <span class="token keyword">if</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>

        left_target <span class="token operator">=</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">//</span> <span class="token number">2</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token boolean">True</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token boolean">False</span><span class="token punctuation">]</span> <span class="token operator">*</span> left_target
        <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>left_target<span class="token punctuation">,</span> num <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">or</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> num<span class="token punctuation">]</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span>left_target<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="例题-lc-494-目标和" tabindex="-1"><a class="header-anchor" href="#例题-lc-494-目标和" aria-hidden="true">#</a> 例题 LC 494：目标和</h3>
<h4 id="_494-目标和" tabindex="-1"><a class="header-anchor" href="#_494-目标和" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/target-sum/" target="_blank" rel="noopener noreferrer">494. 目标和<ExternalLinkIcon/></a></h4>
<blockquote>
<p>给你一个整数数组 nums 和一个整数 target 。</p>
<p>向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：</p>
<p>例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 &quot;+2-1&quot; 。
返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。</p>
<p>示例 1：</p>
<p>输入：nums = [1,1,1,1,1], target = 3</p>
<p>输出：5</p>
<p>解释：一共有 5 种方法让最终目标和为 3 。
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3</p>
</blockquote>
<p>分析题目可知：</p>
<ol>
<li>0-1 背包问题，循环倒着来</li>
<li>背包组合问题，递推公式：<code>dp[i] += dp[i-num]</code></li>
</ol>
<p>该题目给出了目标和，可以根据这个条件求解出背包的目标，进而写出代码。需要找出的 目标 为(数组的和 + target) // 2。</p>
<p>证明过程为：全部的可分为 +, -，分左右，左右的和为 left + right = sum(nums)，要的 target = left - right，相加可得 2 * left = sum(nums) + target， 由于 target 肯定有解，left * 2 则必须是偶数。</p>
<p>代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findTargetSumWays</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> target <span class="token operator">></span> <span class="token builtin">sum</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        left_target <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token builtin">sum</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">+</span> target<span class="token punctuation">)</span> <span class="token operator">//</span> <span class="token number">2</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token builtin">sum</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token operator">+</span> target<span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>

        <span class="token comment"># 组合问题解 dp[i] += dp[i - num]</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> left_target
        <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>left_target<span class="token punctuation">,</span> num <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+=</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> num<span class="token punctuation">]</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span>left_target<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="lc1049-最后一块石头的重量-iii" tabindex="-1"><a class="header-anchor" href="#lc1049-最后一块石头的重量-iii" aria-hidden="true">#</a> LC1049 最后一块石头的重量 III</h3>
<p>https://leetcode-cn.com/problems/last-stone-weight-ii/</p>
<blockquote>
<p>有一堆石头，每块石头的重量都是正整数。</p>
<p>每一回合，从中选出任意两块石头，然后将它们一起粉碎。假设石头的重量分别为 x 和 y，且 x &lt;= y。那么粉碎的可能结果如下：</p>
<p>如果 x == y，那么两块石头都会被完全粉碎；
如果 x != y，那么重量为 x 的石头将会完全粉碎，而重量为 y 的石头新重量为 y-x。
最后，最多只会剩下一块石头。返回此石头最小的可能重量。如果没有石头剩下，就返回 0。</p>
</blockquote>
<p>分析：这是一道比较隐晦的 0-1 背包问题，其 target 值是石头总重量的一半。</p>
<p>0-1 背包倒着来，最大最小递推公式用 max!</p>
<p>代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">lastStoneWeightII</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> stones<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        left_target <span class="token operator">=</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>stones<span class="token punctuation">)</span> <span class="token operator">//</span> <span class="token number">2</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> left_target

        <span class="token keyword">for</span> stone <span class="token keyword">in</span> stones<span class="token punctuation">:</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>left_target<span class="token punctuation">,</span> stone <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> stone<span class="token punctuation">]</span> <span class="token operator">+</span> stone<span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>stones<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">2</span> <span class="token operator">*</span> dp<span class="token punctuation">[</span>left_target<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3>
<p>对比而言，0-1 一维背包的实现方式是：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">zero_one_pack</span><span class="token punctuation">(</span>F<span class="token punctuation">,</span> C<span class="token punctuation">,</span> W<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># 倒着来</span>
    <span class="token keyword">for</span> v <span class="token operator">&lt;</span><span class="token operator">-</span> V to C<span class="token punctuation">:</span>
        F<span class="token punctuation">[</span>v<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span> <span class="token builtin">max</span><span class="token punctuation">(</span>F<span class="token punctuation">[</span>v<span class="token punctuation">]</span><span class="token punctuation">,</span> F<span class="token punctuation">[</span>v <span class="token operator">-</span> C<span class="token punctuation">]</span> <span class="token operator">+</span> W<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>其中 C 表示某个物体的容量，W 表示其价值。</p>
<p>0-1 背包的伪代码可以为：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>F<span class="token punctuation">[</span><span class="token number">0.</span><span class="token punctuation">.</span>V<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span> <span class="token number">0</span>
<span class="token keyword">for</span> i <span class="token operator">&lt;</span><span class="token operator">-</span> <span class="token number">1</span> to N
	zero_one_pack<span class="token punctuation">(</span>Fi<span class="token punctuation">,</span> Ci<span class="token punctuation">,</span> Wi<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul>
<li>0-1背包倒着来</li>
</ul>
<h2 id="完全背包-1" tabindex="-1"><a class="header-anchor" href="#完全背包-1" aria-hidden="true">#</a> 完全背包</h2>
<p>不同于 0-1背包，完全背包中的每种物品都有无限件可以用，求解：将哪些物品装入背包，可使这些物品的耗费的费用总 和不超过背包容量，且价值总和最大。</p>
<h3 id="递推公式-1" tabindex="-1"><a class="header-anchor" href="#递推公式-1" aria-hidden="true">#</a> 递推公式</h3>
<p>完全背包的递推公式和 0-1 背包十分相似，不同的点仅在于：</p>
<ol>
<li>完全背包的内层循环是正着来的。</li>
</ol>
<p>要解释这个原因，就需要一个推导的过程，其是由 0-1背包推导而来的，其递推公式 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">[</mo><mi>i</mi><mo separator="true">,</mo><mi>v</mi><mo stretchy="false">]</mo><mo>=</mo><mi>m</mi><mi>a</mi><mi>x</mi><mrow><mi>F</mi><mo stretchy="false">[</mo><mi>i</mi><mo>−</mo><mn>1</mn><mo separator="true">,</mo><mi>v</mi><mo>−</mo><mi>k</mi><mi>C</mi><mi>i</mi><mo stretchy="false">]</mo><mo>+</mo><mi>k</mi><mi>W</mi><mi>i</mi><mi mathvariant="normal">∣</mi><mn>0</mn><mo>≤</mo><mi>k</mi><mi>C</mi><mi>i</mi><mo>≤</mo><mi>v</mi></mrow></mrow><annotation encoding="application/x-tex">F[i, v] = max{F[i − 1, v − kCi] + kWi | 0 ≤ kCi ≤ v}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mclose">]</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">ma</span><span class="mord mathnormal">x</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">[</span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">i</span><span class="mclose">]</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal">kWi</span><span class="mord">∣0</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span></span></span></span></span>，本质上和 0-1 背包相同。</p>
<h3 id="例题-lc-322-零钱兑换" tabindex="-1"><a class="header-anchor" href="#例题-lc-322-零钱兑换" aria-hidden="true">#</a> 例题 LC 322：零钱兑换</h3>
<h4 id="_322-零钱兑换" tabindex="-1"><a class="header-anchor" href="#_322-零钱兑换" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/coin-change/" target="_blank" rel="noopener noreferrer">322. 零钱兑换<ExternalLinkIcon/></a></h4>
<blockquote>
<p>编写一个函数来计算可以凑成总金额所需的最少的硬币个数。</p>
</blockquote>
<p>从题目中可以得出：</p>
<ol>
<li>完全背包问题：正着循环</li>
<li>最大最小问题，递推公式为：<code>dp[i] = max(dp[i], dp[i-1] + 1)</code></li>
<li>不需要考虑顺序，正常循环</li>
</ol>
<p>题目表述较为简单，直接看代码实现：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">coinChange</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> coins<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> amount<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> coins<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">float</span><span class="token punctuation">(</span><span class="token string">'inf'</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>amount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        dp<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> coin <span class="token keyword">in</span> coins<span class="token punctuation">:</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>coin<span class="token punctuation">,</span> amount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">min</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> coin<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token keyword">if</span> dp<span class="token punctuation">[</span>amount<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token builtin">float</span><span class="token punctuation">(</span><span class="token string">'inf'</span><span class="token punctuation">)</span> <span class="token keyword">else</span> dp<span class="token punctuation">[</span>amount<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>当然也可以改变顺序，这样稍微快一些：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">coinChange</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> coins<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> amount<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> coins<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">float</span><span class="token punctuation">(</span><span class="token string">'inf'</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>amount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        dp<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> amount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> coin <span class="token keyword">in</span> coins<span class="token punctuation">:</span>
                <span class="token keyword">if</span> i <span class="token operator">>=</span> coin<span class="token punctuation">:</span>
                    dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">min</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> coin<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token keyword">if</span> dp<span class="token punctuation">[</span>amount<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token builtin">float</span><span class="token punctuation">(</span><span class="token string">'inf'</span><span class="token punctuation">)</span> <span class="token keyword">else</span> dp<span class="token punctuation">[</span>amount<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>通过代码可以看出，这个问题的实现和完全背包也不尽完全相同，其主要不同在于：</p>
<ol>
<li>循环的位置变了，现在外层循环了背包，内层循环了物品。这种方式在一定程度上可以提高性能，如果把循环顺序调换回来，代码也是可以通过的。但是上述的循环方式性能较好。</li>
<li>在代码中进行了一些优化操作，如 <code>if i &gt;= coin</code> 的判断，就是说背包的大小要大于物品才可以进行装载，这样可以提高性能。这一步省略调代码也是可以通过的。</li>
<li>初始化问题：由于是最小化问题，所以初始化为了 <code>float(inf)</code></li>
</ol>
<h3 id="例题-lc-279-完全平方数" tabindex="-1"><a class="header-anchor" href="#例题-lc-279-完全平方数" aria-hidden="true">#</a> 例题 LC 279：完全平方数</h3>
<h4 id="_279-完全平方数" tabindex="-1"><a class="header-anchor" href="#_279-完全平方数" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/perfect-squares/" target="_blank" rel="noopener noreferrer">279. 完全平方数<ExternalLinkIcon/></a></h4>
<blockquote>
<p>给定正整数 n，找到若干个完全平方数（比如 1, 4, 9, 16, ...）使得它们的和等于 n。你需要让组成和的完全平方数的个数最少。</p>
<p>给你一个整数 n ，返回和为 n 的完全平方数的 最少数量 。</p>
<p>完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。</p>
<p>示例 1：</p>
<p>输入：n = 12</p>
<p>输出：3</p>
<p>解释：12 = 4 + 4 + 4</p>
</blockquote>
<p>从题目中可以得到信息：</p>
<ol>
<li>完全背包问题：正着循环</li>
<li>最大最小问题，递推公式为：<code>dp[i] = max(dp[i], dp[i-1] + 1)</code></li>
<li>不需要考虑顺序，正常循环</li>
</ol>
<p>代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">numSquares</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> n<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token builtin">float</span><span class="token punctuation">(</span><span class="token string">'inf'</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        dp<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>

        <span class="token comment"># 构造物品数组</span>
        nums <span class="token operator">=</span> <span class="token punctuation">[</span>_<span class="token operator">**</span><span class="token number">2</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> n<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">if</span> _<span class="token operator">**</span><span class="token number">2</span> <span class="token operator">&lt;=</span> n<span class="token punctuation">]</span>

        <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>num<span class="token punctuation">,</span> n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token builtin">min</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> num<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token keyword">if</span> dp<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token builtin">float</span><span class="token punctuation">(</span><span class="token string">'inf'</span><span class="token punctuation">)</span> <span class="token keyword">else</span> dp<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="例题-lc-518-零钱兑换2" tabindex="-1"><a class="header-anchor" href="#例题-lc-518-零钱兑换2" aria-hidden="true">#</a> 例题 LC 518：零钱兑换2</h3>
<h4 id="_518-零钱兑换-ii" tabindex="-1"><a class="header-anchor" href="#_518-零钱兑换-ii" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/coin-change-2/" target="_blank" rel="noopener noreferrer">518. 零钱兑换 II<ExternalLinkIcon/></a></h4>
<blockquote>
<p>给定不同面额的硬币和一个总金额。写出函数来计算可以凑成总金额的硬币组合数。假设每一种面额的硬币有无限个。</p>
</blockquote>
<p>这个题目和上述例题都是完全背包问题，但是却存在些许不同：</p>
<ol>
<li>这是一个完全背包且不考虑顺序的组合问题，外层循环还是和 0-1背包保持一致</li>
<li>上面题目求解的是凑成目标数量所需要的最小硬币数；改题目求解的是凑成目标数量的硬币组合数</li>
<li>总结2：上面题目是最大最小问题，该题目是组合问题</li>
<li>组合问题的递推公式为：<code>dp[i] += dp[i -num]</code></li>
</ol>
<p>其代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">change</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> amount<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> coins<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> coins<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
		<span class="token comment"># 就是 dp[0] = 1</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> amount

        <span class="token keyword">for</span> coin <span class="token keyword">in</span> coins<span class="token punctuation">:</span>
            <span class="token comment"># 这是一个优化，可以从 1 开始循环，然后判断 i >= coin</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>coin<span class="token punctuation">,</span> amount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+=</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> coin<span class="token punctuation">]</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span>amount<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="例题-lc-377-组合总数-iv" tabindex="-1"><a class="header-anchor" href="#例题-lc-377-组合总数-iv" aria-hidden="true">#</a> 例题 LC 377： 组合总数 IV</h3>
<h4 id="_377-组合总和-iv" tabindex="-1"><a class="header-anchor" href="#_377-组合总和-iv" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/combination-sum-iv/" target="_blank" rel="noopener noreferrer">377. 组合总和 Ⅳ<ExternalLinkIcon/></a></h4>
<blockquote>
<p>给你一个由 不同 整数组成的数组 nums ，和一个目标整数 target 。请你从 nums 中找出并返回总和为 target 的元素组合的个数。</p>
<p>题目数据保证答案符合 32 位整数范围。</p>
<p>输入：nums = [1,2,3], target = 4</p>
<p>输出：7</p>
<p>解释：
所有可能的组合为：
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
请注意，顺序不同的序列被视作不同的组合。</p>
</blockquote>
<p>这是一个经典的考虑顺序的完全背包组合问题，看到这样的问题，首先确定模板：</p>
<ol>
<li>完全背包问题：正着循环</li>
<li>组合问题：递推公式为：<code>dp[i] += dp[i -num]</code></li>
<li>考虑顺序，把背包放在外层循环</li>
</ol>
<p>很轻松写出代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">combinationSum4</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> nums<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>target <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        dp<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>
        <span class="token comment"># 考虑顺序，target 放在外面</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> target <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
                <span class="token keyword">if</span> i <span class="token operator">>=</span> num<span class="token punctuation">:</span>
                    dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+=</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> num<span class="token punctuation">]</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span>target<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="例题-lc-139-单词拆分" tabindex="-1"><a class="header-anchor" href="#例题-lc-139-单词拆分" aria-hidden="true">#</a> 例题 LC 139：单词拆分</h3>
<h4 id="_139-单词拆分" tabindex="-1"><a class="header-anchor" href="#_139-单词拆分" aria-hidden="true">#</a> <a href="https://leetcode-cn.com/problems/word-break/" target="_blank" rel="noopener noreferrer">139. 单词拆分<ExternalLinkIcon/></a></h4>
<blockquote>
<p>给定一个非空字符串 s 和一个包含非空单词的列表 wordDict，判定 s 是否可以被空格拆分为一个或多个在字典中出现的单词。</p>
<p>说明：</p>
<p>拆分时<strong>可以重复使用</strong>字典中的单词。
你可以假设字典中没有重复的单词。</p>
<p>示例 1：</p>
<p>输入: s = &quot;leetcode&quot;, wordDict = [&quot;leet&quot;, &quot;code&quot;]</p>
<p>输出: true</p>
<p>解释: 返回 true 因为 &quot;leetcode&quot; 可以被拆分成 &quot;leet code&quot;。</p>
</blockquote>
<p>从题目中可以得出信息：</p>
<ol>
<li>完全背包问题，（拆分时<strong>可以重复使用</strong>字典中的单词）：正着循环</li>
<li>true/false 问题，递推公式为：<code>dp[i] = dp[i] or dp[i - num]</code></li>
<li>考虑顺序，背包在外循环</li>
</ol>
<p>代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">wordBreak</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">,</span> wordDict<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> wordDict<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>
		<span class="token comment"># dp[0] = True</span>
        dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token boolean">True</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token boolean">False</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token builtin">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span>

        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> word <span class="token keyword">in</span> wordDict<span class="token punctuation">:</span>
                <span class="token keyword">if</span> i <span class="token operator">-</span> <span class="token builtin">len</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">0</span> <span class="token keyword">and</span> s<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token builtin">len</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span><span class="token punctuation">:</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> word<span class="token punctuation">:</span>
                    dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">or</span> dp<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token builtin">len</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span><span class="token punctuation">]</span>

        <span class="token keyword">return</span> dp<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="总结-1" tabindex="-1"><a class="header-anchor" href="#总结-1" aria-hidden="true">#</a> 总结</h3>
<p>完全背包问题的伪代码如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">CompletePack</span><span class="token punctuation">(</span>F<span class="token punctuation">,</span> C<span class="token punctuation">,</span> W<span class="token punctuation">)</span>
	<span class="token keyword">for</span> v ← C to V
		F<span class="token punctuation">[</span>v<span class="token punctuation">]</span> ← <span class="token builtin">max</span><span class="token punctuation">{</span>F<span class="token punctuation">[</span>v<span class="token punctuation">]</span><span class="token punctuation">,</span> f<span class="token punctuation">[</span>v − C<span class="token punctuation">]</span> <span class="token operator">+</span> W<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>F<span class="token punctuation">[</span><span class="token number">0.</span><span class="token punctuation">.</span>V <span class="token punctuation">]</span> ←<span class="token number">0</span>
<span class="token keyword">for</span> i ← <span class="token number">1</span> to N
    <span class="token keyword">for</span> v ← Ci to V
		F<span class="token punctuation">[</span>v<span class="token punctuation">]</span> ← <span class="token builtin">max</span><span class="token punctuation">(</span>F<span class="token punctuation">[</span>v<span class="token punctuation">]</span><span class="token punctuation">,</span> F<span class="token punctuation">[</span>v − Ci<span class="token punctuation">]</span> <span class="token operator">+</span> Wi<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ul>
<li>完全背包正着来</li>
<li>如果与顺序有关，内循环 coins，外循环 target（背包容量在外）</li>
</ul>
<h2 id="参考文献" tabindex="-1"><a class="header-anchor" href="#参考文献" aria-hidden="true">#</a> 参考文献</h2>
<p><a href="https://leetcode-cn.com/problems/coin-change-2/solution/yi-pian-wen-zhang-chi-tou-bei-bao-wen-ti-2xkk/" target="_blank" rel="noopener noreferrer">一篇文章吃透背包问题！（细致引入+解题模板+例题分析+代码呈现）<ExternalLinkIcon/></a></p>
</template>
