<template><p>📑📑📑 深度优先搜索算法</p>
<p>📑📑📑 广度优先搜索算法</p>
<!-- more -->
<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2>
<h3 id="深度优先搜索算法" tabindex="-1"><a class="header-anchor" href="#深度优先搜索算法" aria-hidden="true">#</a> 深度优先搜索算法</h3>
<p>英语：Depth-First-Search，DFS是一种用于遍历或搜索树或图的算法。其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个结点只能访问一次.</p>
<p>因发明「深度优先搜索算法」，约翰 · 霍普克洛夫特与罗伯特 · 塔扬在1986年共同获得计算机领域的最高奖：图灵奖。</p>
<h3 id="广度优先搜索算法" tabindex="-1"><a class="header-anchor" href="#广度优先搜索算法" aria-hidden="true">#</a> 广度优先搜索算法</h3>
<p>Breadth-First Search，缩写为 BFS，又称为宽度优先搜索，是一种图形搜索算法。简单的说，BFS 是从根结点开始，沿着树的宽度遍历树的结点。如果所有结点均被访问，则算法中止。</p>
<p>广度优先搜索也广泛应用在图论问题中。</p>
<h2 id="problems-content" tabindex="-1"><a class="header-anchor" href="#problems-content" aria-hidden="true">#</a> Problems content</h2>
<ul>
<li>
<p><a href="https://leetcode.com/problems/number-of-islands/" target="_blank" rel="noopener noreferrer">number of island: LC200<ExternalLinkIcon/></a></p>
</li>
<li>
<p><a href="https://leetcode.com/problems/target-sum/" target="_blank" rel="noopener noreferrer">Target Sum: LC494<ExternalLinkIcon/></a></p>
</li>
</ul>
<table>
<thead>
<tr>
<th>问题</th>
<th>链接</th>
<th>类型</th>
<th>备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>LC104 二叉树的最大深度</td>
<td><a href="https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/" target="_blank" rel="noopener noreferrer">104. 二叉树的最大深度<ExternalLinkIcon/></a></td>
<td>DFS, BFS</td>
<td></td>
</tr>
<tr>
<td>LC329 矩阵中的最长递增路径</td>
<td><a href="https://leetcode-cn.com/problems/longest-increasing-path-in-a-matrix/" target="_blank" rel="noopener noreferrer">LC 329<ExternalLinkIcon/></a></td>
<td>DFS</td>
<td></td>
</tr>
<tr>
<td>LC841. 钥匙和房间</td>
<td>https://leetcode-cn.com/problems/keys-and-rooms</td>
<td>DFS, BFS</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<h2 id="dfs" tabindex="-1"><a class="header-anchor" href="#dfs" aria-hidden="true">#</a> DFS</h2>
<h3 id="概览" tabindex="-1"><a class="header-anchor" href="#概览" aria-hidden="true">#</a> 概览</h3>
<ol>
<li>遇到一个问题，如何确定可以使用 DFS 求解？</li>
<li>使用 DFS 求解的一般套路是什么？DFS 一般会用到了<strong>递归</strong>的概念，所以我们写出来的代码结构也应该是递归的。而对于递归，我们有的时候可以递归函数本身，有的时候需要写辅助函数来进行递归。</li>
<li>上述 DFS 求解问题可以总结为 <strong>自底向上方法</strong>。</li>
</ol>
<h3 id="lc104-二叉树的最大深度" tabindex="-1"><a class="header-anchor" href="#lc104-二叉树的最大深度" aria-hidden="true">#</a> LC104 二叉树的最大深度</h3>
<p><a href="https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/" target="_blank" rel="noopener noreferrer">104. 二叉树的最大深度<ExternalLinkIcon/></a></p>
<h4 id="问题分析" tabindex="-1"><a class="header-anchor" href="#问题分析" aria-hidden="true">#</a> 问题分析</h4>
<p>💓💓💓 <strong>思考</strong> 🧡🧡🧡</p>
<p>如何用 DFS 的思维来思考这个问题呢？</p>
<p>假设我们已经知道了左子树和右子树的最大深度 <code>l</code>, <code>r</code>, 那么整个二叉树的最大深度就是根节点的深度 1 加上左右子树中的最大深度，用公式表达是：</p>
<p class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>d</mi><mi>e</mi><mi>p</mi><mi>t</mi><mi>h</mi><mo>=</mo><mi>m</mi><mi>a</mi><mi>x</mi><mo stretchy="false">(</mo><mi>l</mi><mo separator="true">,</mo><mi>r</mi><mo stretchy="false">)</mo><mo>+</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">depth = max(l, r) + 1
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">d</span><span class="mord mathnormal">e</span><span class="mord mathnormal">pt</span><span class="mord mathnormal">h</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">ma</span><span class="mord mathnormal">x</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">1</span></span></span></span></span></p>
<p>所以我们可以使用深度有限搜索来计算二叉树的最大深度，具体而言就是递归计算出二叉树左子树和右子树的最大深度，然后再使用上述公式直接计算出二叉树的最大深度。</p>
<p>而二叉树左右子树的深度也都可以通过相同的方法递归获得，递归在访问到空节点时退出。</p>
<h4 id="复杂度分析" tabindex="-1"><a class="header-anchor" href="#复杂度分析" aria-hidden="true">#</a> 复杂度分析</h4>
<p>该问题使用 DFS 求解，其时间复杂度为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>O</mi><mo stretchy="false">(</mo><mi>n</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">O(n)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">O</span><span class="mopen">(</span><span class="mord mathnormal">n</span><span class="mclose">)</span></span></span></span>, 每个节点在递归中只被遍历一次。</p>
<p>其空间复杂度为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>O</mi><mo stretchy="false">(</mo><mi>h</mi><mi>e</mi><mi>i</mi><mi>g</mi><mi>h</mi><mi>t</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">O(height)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">O</span><span class="mopen">(</span><span class="mord mathnormal">h</span><span class="mord mathnormal">e</span><span class="mord mathnormal">i</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">h</span><span class="mord mathnormal">t</span><span class="mclose">)</span></span></span></span>，与二叉树的高度有关。由于递归需要栈空间，而栈空间取决于递归的深度，因此空间复杂度等价于二叉树的高度。</p>
<h4 id="问题求解" tabindex="-1"><a class="header-anchor" href="#问题求解" aria-hidden="true">#</a> 问题求解</h4>
<p>这个题目存在 DFS 和 BFS 解法，下面是这个题目的 DFS 解法：</p>
<ul>
<li>
<p>解法：使用辅助函数来进行递归：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">maxDepth</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>

        <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>node<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token keyword">not</span> node<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token number">0</span>

            <span class="token keyword">return</span> <span class="token builtin">max</span><span class="token punctuation">(</span>dfs<span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">,</span> dfs<span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span>

        <span class="token keyword">return</span> dfs<span class="token punctuation">(</span>root<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>上述做法使用了一个 <code>dfs()</code>辅助函数进行递归，我们也可以不使用辅助函数。</p>
</li>
<li>
<p>解法：直接递归：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">maxDepth</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        <span class="token keyword">return</span> <span class="token builtin">max</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>maxDepth<span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>maxDepth<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>这个不带辅助函数的解法是比带辅助函数的解法稍慢的，但是代码更加简洁。</p>
</li>
</ul>
<h3 id="lc101-对称二叉树" tabindex="-1"><a class="header-anchor" href="#lc101-对称二叉树" aria-hidden="true">#</a> LC101 对称二叉树</h3>
<p><a href="https://leetcode-cn.com/problems/symmetric-tree/" target="_blank" rel="noopener noreferrer">101. 对称二叉树<ExternalLinkIcon/></a></p>
<p>这是该题目的 DFS（递归）解法。</p>
<p>代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">SolutionDFS</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">isSymmetric</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token comment"># 反例 [1]</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">.</span>right <span class="token keyword">and</span> <span class="token keyword">not</span> root<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">True</span>

        <span class="token comment"># if not root.left or not root.right:</span>
        <span class="token comment">#     return False</span>

        <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>left<span class="token punctuation">,</span> right<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># 递归终止条件，两个节点都为空</span>
            <span class="token keyword">if</span> <span class="token keyword">not</span> left <span class="token keyword">and</span> <span class="token keyword">not</span> right<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">True</span>

            <span class="token keyword">if</span> <span class="token keyword">not</span> left <span class="token keyword">or</span> <span class="token keyword">not</span> right<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>

            <span class="token keyword">if</span> left<span class="token punctuation">.</span>val <span class="token operator">!=</span> right<span class="token punctuation">.</span>val<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>

            <span class="token keyword">return</span> dfs<span class="token punctuation">(</span>left<span class="token punctuation">.</span>left<span class="token punctuation">,</span> right<span class="token punctuation">.</span>right<span class="token punctuation">)</span> <span class="token keyword">and</span> dfs<span class="token punctuation">(</span>left<span class="token punctuation">.</span>right<span class="token punctuation">,</span> right<span class="token punctuation">.</span>left<span class="token punctuation">)</span>

        <span class="token keyword">return</span> dfs<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">,</span> root<span class="token punctuation">.</span>right<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>从代码中我们可以看出，我们定义递归终止条件：</p>
<ol>
<li>两个节点都为空，返回 True, 递归终止</li>
<li>两个节点中有一个不存在，不对称，返回 False</li>
<li>两个节点的值不相等，返回 False</li>
</ol>
<p>在这些条件满足以后，我们对 <code>left.left</code> 和 <code>right.right</code>等分别递归即可求出结果。</p>
<h3 id="lc329-矩阵中的最长递增路径" tabindex="-1"><a class="header-anchor" href="#lc329-矩阵中的最长递增路径" aria-hidden="true">#</a> LC329 矩阵中的最长递增路径</h3>
<blockquote>
<p>给定一个整数矩阵，找出最长递增路径的长度。</p>
<p>对于每个单元格，你可以往上，下，左，右四个方向移动。 你不能在对角线方向上移动或移动到边界外（即不允许环绕）。</p>
</blockquote>
<p>这是一道迷宫搜索问题，可以使用 DFS 搜索，这样可以熟悉 DFS 的步骤。实现代码如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> <span class="token operator">*</span>args<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>dirs <span class="token operator">=</span> <span class="token punctuation">[</span>
            <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span>
        <span class="token punctuation">]</span>
        self<span class="token punctuation">.</span>m <span class="token operator">=</span> <span class="token boolean">None</span>
        self<span class="token punctuation">.</span>n <span class="token operator">=</span> <span class="token boolean">None</span>

    <span class="token keyword">def</span> <span class="token function">longestIncreasingPath</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> matrix<span class="token punctuation">:</span> <span class="token string">'List[List[int]]'</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>matrix<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        self<span class="token punctuation">.</span>m <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>matrix<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>matrix<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        ans <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>m<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>n<span class="token punctuation">)</span><span class="token punctuation">:</span>
                ans <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>matrix<span class="token punctuation">,</span> i<span class="token punctuation">,</span> j<span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> ans

    <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> matrix<span class="token punctuation">,</span> i<span class="token punctuation">,</span> j<span class="token punctuation">)</span><span class="token punctuation">:</span>
        ans <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> d <span class="token keyword">in</span> self<span class="token punctuation">.</span>dirs<span class="token punctuation">:</span>
            x <span class="token operator">=</span> i <span class="token operator">+</span> d<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
            y <span class="token operator">=</span> j <span class="token operator">+</span> d<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>
            <span class="token keyword">if</span> x <span class="token operator">>=</span> <span class="token number">0</span> <span class="token keyword">and</span> x <span class="token operator">&lt;</span> self<span class="token punctuation">.</span>m <span class="token keyword">and</span> y <span class="token operator">>=</span> <span class="token number">0</span> <span class="token keyword">and</span> y <span class="token operator">&lt;</span> self<span class="token punctuation">.</span>n <span class="token keyword">and</span> matrix<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token punctuation">[</span>y<span class="token punctuation">]</span> <span class="token operator">></span> matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">:</span>
                ans <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>matrix<span class="token punctuation">,</span> x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">)</span>
        ans <span class="token operator">+=</span> <span class="token number">1</span>
        <span class="token keyword">return</span> ans

nums <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span>
<span class="token punctuation">]</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>Solution<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>longestIncreasingPath<span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br></div></div><h3 id="lc841-钥匙和房间" tabindex="-1"><a class="header-anchor" href="#lc841-钥匙和房间" aria-hidden="true">#</a> LC841. 钥匙和房间</h3>
<blockquote>
<p>有 N 个房间，开始时你位于 0 号房间。每个房间有不同的号码：0，1，2，...，N-1，并且房间里可能有一些钥匙能使你进入下一个房间。</p>
<p>在形式上，对于每个房间 i 都有一个钥匙列表 rooms[i]，每个钥匙 rooms[i][j] 由 [0,1，...，N-1] 中的一个整数表示，其中 N = rooms.length。 钥匙 rooms[i][j] = v 可以打开编号为 v 的房间。</p>
<p>最初，除 0 号房间外的其余所有房间都被锁住。</p>
<p>你可以自由地在房间之间来回走动。</p>
<p>如果能进入每个房间返回 true，否则返回 false。</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/keys-and-rooms
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>其 DFS 解法如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">canVisitAllRooms</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> rooms<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>rooms<span class="token punctuation">)</span>
        visited <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        num <span class="token operator">=</span> <span class="token number">0</span>

        <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>i<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            visited<span class="token punctuation">.</span>add<span class="token punctuation">(</span>i<span class="token punctuation">)</span>
            <span class="token keyword">nonlocal</span> num
            num <span class="token operator">+=</span> <span class="token number">1</span>
            <span class="token keyword">for</span> it <span class="token keyword">in</span> rooms<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> it <span class="token keyword">not</span> <span class="token keyword">in</span> visited<span class="token punctuation">:</span>
                    dfs<span class="token punctuation">(</span>it<span class="token punctuation">)</span>

        dfs<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> num <span class="token operator">==</span> n
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h3 id="lc200-岛屿数量" tabindex="-1"><a class="header-anchor" href="#lc200-岛屿数量" aria-hidden="true">#</a> LC200 岛屿数量</h3>
<blockquote>
<p>给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。</p>
<p>岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。</p>
<p>此外，你可以假设该网格的四条边均被水包围。</p>
<p>示例 1：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>输出：1</p>
<p>来源：力扣（LeetCode）</p>
<p>链接：https://leetcode-cn.com/problems/number-of-islands</p>
<p>著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>DFS 解法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>

    <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> grid<span class="token punctuation">,</span> i<span class="token punctuation">,</span> j<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> i <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token keyword">or</span> j <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token keyword">or</span> i <span class="token operator">>=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>grid<span class="token punctuation">)</span> <span class="token keyword">or</span> j <span class="token operator">>=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>grid<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token keyword">or</span> grid<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token string">'1'</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span>
        grid<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">'#'</span>
        self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>grid<span class="token punctuation">,</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> j<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>grid<span class="token punctuation">,</span> i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> j<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>grid<span class="token punctuation">,</span> i<span class="token punctuation">,</span> j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>grid<span class="token punctuation">,</span> i<span class="token punctuation">,</span> j <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">numIslands</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> grid<span class="token punctuation">)</span><span class="token punctuation">:</span>
        count <span class="token operator">=</span> <span class="token number">0</span>

        <span class="token keyword">if</span> <span class="token keyword">not</span> grid<span class="token punctuation">:</span>
            <span class="token keyword">return</span> count
        
        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>grid<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> j <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>grid<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> grid<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token string">'1'</span><span class="token punctuation">:</span>
                    self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>grid<span class="token punctuation">,</span> i<span class="token punctuation">,</span> j<span class="token punctuation">)</span> <span class="token comment"># mark the visited</span>
                    count <span class="token operator">+=</span> <span class="token number">1</span>
        <span class="token keyword">return</span> count
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="bfs" tabindex="-1"><a class="header-anchor" href="#bfs" aria-hidden="true">#</a> BFS</h2>
<h3 id="概览-1" tabindex="-1"><a class="header-anchor" href="#概览-1" aria-hidden="true">#</a> 概览</h3>
<ol>
<li>BFS 问题的本质就是让你在一副“图”中找到从起点 start 到终点 target 的最近距离；</li>
<li>BFS 的核心数据结构是队列；</li>
<li>BFS 常用 visited 结构来标记是否走过某段路程，避免走回头路；</li>
<li>BFS 在队列初始化的时候一般会加入将起点加入队列中；</li>
<li>在写 BFS 前要明确终止条件。</li>
</ol>
<h3 id="lc111-二叉树的最小深度" tabindex="-1"><a class="header-anchor" href="#lc111-二叉树的最小深度" aria-hidden="true">#</a> LC111. 二叉树的最小深度</h3>
<p><a href="https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/" target="_blank" rel="noopener noreferrer">二叉树的最小深度<ExternalLinkIcon/></a></p>
<p>🏀🏀🏀 我们根据“概览”中的原则对这个问题进行分析：起点就是 root 节点，终点就是最靠近根节点的那个叶子节点（叶子节点的左右子节点都是 null）。</p>
<p>其使用 BFS 的解法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># Definition for a binary tree node.</span>
<span class="token comment"># class TreeNode:</span>
<span class="token comment">#     def __init__(self, val=0, left=None, right=None):</span>
<span class="token comment">#         self.val = val</span>
<span class="token comment">#         self.left = left</span>
<span class="token comment">#         self.right = right</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">minDepth</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        
        queue <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">)</span>
        first_node <span class="token operator">=</span> <span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
        queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span>first_node<span class="token punctuation">)</span>

        <span class="token keyword">while</span> queue<span class="token punctuation">:</span>
            node<span class="token punctuation">,</span> depth <span class="token operator">=</span> queue<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token comment"># 判断是否到达终点，终止条件</span>
            <span class="token keyword">if</span> <span class="token keyword">not</span> node<span class="token punctuation">.</span>left <span class="token keyword">and</span> <span class="token keyword">not</span> node<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
                <span class="token keyword">return</span> depth
            <span class="token keyword">if</span> node<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
                queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> node<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
                queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h3 id="lc104-二叉树的最大深度-1" tabindex="-1"><a class="header-anchor" href="#lc104-二叉树的最大深度-1" aria-hidden="true">#</a> LC104 二叉树的最大深度</h3>
<p><a href="https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/" target="_blank" rel="noopener noreferrer">104. 二叉树的最大深度<ExternalLinkIcon/></a></p>
<p>对比求二叉树的最小深度，其代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">maxDepth</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token number">1</span>
        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            node<span class="token punctuation">,</span> depth <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            res <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> depth<span class="token punctuation">)</span>
            <span class="token keyword">if</span> node<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
                q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> node<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
                q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>除此之外，该题目还存在 DFS 解法，可以参考上文。</p>
<h3 id="lc102-二叉树的层序遍历" tabindex="-1"><a class="header-anchor" href="#lc102-二叉树的层序遍历" aria-hidden="true">#</a> LC102 二叉树的层序遍历</h3>
<p><a href="https://leetcode-cn.com/problems/binary-tree-level-order-traversal/" target="_blank" rel="noopener noreferrer">102. 二叉树的层序遍历<ExternalLinkIcon/></a></p>
<p>二叉树的层序遍历也会使用到 BFS 的思想，这个题目存在以下几个难点：</p>
<ol>
<li>如何构造最终的结果，即类似于 <code>[[3], [9,20], [15,7]]</code> 这样的 List of List 的形式？</li>
<li>能否继续使用上面的解法模板来求解这个问题？模板是否具有普适性？</li>
</ol>
<p>接下来看第一版本的代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">levelOrder</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span>root<span class="token punctuation">]</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            size <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>q<span class="token punctuation">)</span>
            tmp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
            <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>size<span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token comment"># 在 for 循环中把 q 这个队列拿空</span>
                <span class="token comment"># 第一次 for 迭代循环的是 root 节点</span>
                node <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token keyword">if</span> node<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">)</span>
                <span class="token keyword">if</span> node<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">)</span>
                tmp<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>val<span class="token punctuation">)</span>

            <span class="token keyword">if</span> tmp<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>tmp<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><p>可以看出：</p>
<ol>
<li>
<p>在每次迭代中，我们都保证了把同一层的元素进行迭代；即队列中存储的元素永远是在同一层的元素，然后计算出这些元素的个数，用 for 循环逐一进行遍历。</p>
<div class="custom-container warning"><p class="custom-container-title">❗❗❗ BFS 为什么要使用队列？</p>
<p>在这里我理解了为什么 BFS 要使用队列这个数据结构，我们用 for 循环逐一进行遍历的时候，还没被遍历到的“上一层”元素都是在队列头部的，使用队列能保证这些上一层元素都被“踢”出去，而不影响本层新进来的元素。</p>
</div>
</li>
<li>
<p>这个题目的关键就是用 for 循环保证了同一层元素的遍历。</p>
</li>
</ol>
<h3 id="lc107-二叉树的层序遍历ii" tabindex="-1"><a class="header-anchor" href="#lc107-二叉树的层序遍历ii" aria-hidden="true">#</a> LC107 二叉树的层序遍历II</h3>
<p><a href="https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/" target="_blank" rel="noopener noreferrer">107. 二叉树的层序遍历 II<ExternalLinkIcon/></a></p>
<p>这个题目不同于二叉树层次遍历的地方在于，**给定一个二叉树，返回其节点值自底向上的层序遍历。 **</p>
<p>为了达到这个效果，我们可以在每次遍历之后，将结果放在结果集的头部，这样就可以得到我们想要的输出形式了。</p>
<p>其相对于上述代码的不同在于：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>res <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment"># 向左端插入</span>
res<span class="token punctuation">.</span>appendleft<span class="token punctuation">(</span>tmp<span class="token punctuation">)</span>

<span class="token comment"># 返回时进行类型转换</span>
<span class="token keyword">return</span> <span class="token builtin">list</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>当然也可以使用上面的代码直接将结果反转。</p>
<h3 id="lc103-二叉树的锯齿形层序遍历" tabindex="-1"><a class="header-anchor" href="#lc103-二叉树的锯齿形层序遍历" aria-hidden="true">#</a> LC103 二叉树的锯齿形层序遍历</h3>
<p><a href="https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/" target="_blank" rel="noopener noreferrer">103. 二叉树的锯齿形层序遍历<ExternalLinkIcon/></a></p>
<p>这道题目是上面二叉树层序遍历的变种题目，题目的描述为：</p>
<blockquote>
<p>给定一个二叉树，返回其节点值的锯齿形层序遍历。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。</p>
</blockquote>
<p>我们对题目进行分析可以发现遍历顺序和层级的关系：</p>
<table>
<thead>
<tr>
<th>层数</th>
<th>遍历顺序</th>
</tr>
</thead>
<tbody>
<tr>
<td>第一层（root）</td>
<td>从左往右</td>
</tr>
<tr>
<td>第二层</td>
<td>从右往左</td>
</tr>
<tr>
<td>第三次</td>
<td>从左往右</td>
</tr>
<tr>
<td>第四层</td>
<td>从右往左</td>
</tr>
<tr>
<td><strong>奇数层</strong></td>
<td>从左往右</td>
</tr>
<tr>
<td><strong>偶数层</strong></td>
<td>从右往左</td>
</tr>
</tbody>
</table>
<p>我们发现遍历的顺序是和层级有关的，因此我们可以根据层级来确定遍历顺序：</p>
<p>🔴🔴🔴 <strong>遍历顺序</strong>，需要注意的是，我们一定要在队列中先添加左节点，再添加右节点，这个顺序需要保证，才能与后面的 <code>depth % 2 == 0</code> 配套。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">zigzagLevelOrder</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        depth <span class="token operator">=</span> <span class="token number">1</span>
        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            size <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>q<span class="token punctuation">)</span>
            tmp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
            <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>size<span class="token punctuation">)</span><span class="token punctuation">:</span>
                node<span class="token punctuation">,</span> depth <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token comment"># 注意遍历顺序</span>
                <span class="token keyword">if</span> node<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">if</span> node<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">,</span> depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

                tmp<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
                
            <span class="token keyword">if</span> depth <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
                <span class="token comment"># 偶数层从右往左</span>
                tmp<span class="token punctuation">.</span>reverse<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> tmp<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>tmp<span class="token punctuation">)</span>

        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><h3 id="lc101-对称二叉树-1" tabindex="-1"><a class="header-anchor" href="#lc101-对称二叉树-1" aria-hidden="true">#</a> LC101 对称二叉树</h3>
<p><a href="https://leetcode-cn.com/problems/symmetric-tree/" target="_blank" rel="noopener noreferrer">101. 对称二叉树<ExternalLinkIcon/></a></p>
<p>给定二叉树，判断二叉树是否镜像对称。</p>
<div class="language-txt ext-txt line-numbers-mode"><pre v-pre class="language-txt"><code>    1
   / \
  2   2
 / \ / \
3  4 4  3
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>可以看出，上述中就是一个对称的二叉树，我们得出一个简单的规律：</p>
<ol>
<li>对于某个节点，如果其没有左节点或者右节点，那么其肯定不是一个对称二叉树；</li>
<li>对于某个节点，其兄弟节点的左右节点值要与自己的左右节点值对应相等。我们该如何保证这个呢？</li>
</ol>
<p>其对应的代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">isSymmetric</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> TreeNode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>

        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            left<span class="token punctuation">,</span> right <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> <span class="token keyword">not</span> left <span class="token keyword">and</span> <span class="token keyword">not</span> right<span class="token punctuation">:</span>
                <span class="token keyword">continue</span>
            <span class="token keyword">if</span> <span class="token keyword">not</span> left <span class="token keyword">or</span> <span class="token keyword">not</span> right<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
            <span class="token keyword">if</span> left<span class="token punctuation">.</span>val <span class="token operator">!=</span> right<span class="token punctuation">.</span>val<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>

            q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>left<span class="token punctuation">.</span>left<span class="token punctuation">,</span> right<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">)</span>
            q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>left<span class="token punctuation">.</span>right<span class="token punctuation">,</span> right<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token boolean">True</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>这种解法的思路在于，在队列中同时取出两个节点 left, right，然后判断其值是否相等，再将他们的孩子中按照 <code>(left.left, right.right)</code> 一组，<code>(left.right, right.left)</code>一组放入队列中。</p>
<p>还有一种解法是，往队列中放 4 次元素，按照 <code>left.left, right.right, left.right, right.left</code> 的顺序，然后逐一判断即可。</p>
<h3 id="lc841-钥匙和房间-1" tabindex="-1"><a class="header-anchor" href="#lc841-钥匙和房间-1" aria-hidden="true">#</a> LC841 钥匙和房间</h3>
<p>很经典的一道题目，从举例看一下这道题目：</p>
<blockquote>
<p>输入：[[1,3],[3,0,1],[2],[0]]</p>
<p>输出：false</p>
<p>解释：我们不能进入 2 号房间。</p>
</blockquote>
<p>初始的时候是可以进入 0 号房间的，然后看能不能根据这个房间的钥匙把每个房间都走了。</p>
<p>下面是上述问题的 BFS 解法：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">canVisitAllRooms</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> rooms<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>rooms<span class="token punctuation">)</span>
        queue <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        visited <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">}</span>

        <span class="token keyword">while</span> queue<span class="token punctuation">:</span>
            x <span class="token operator">=</span> queue<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">for</span> it <span class="token keyword">in</span> rooms<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> it <span class="token keyword">not</span> <span class="token keyword">in</span> visited<span class="token punctuation">:</span>
                    visited<span class="token punctuation">.</span>add<span class="token punctuation">(</span>it<span class="token punctuation">)</span>
                    queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span>it<span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token builtin">len</span><span class="token punctuation">(</span>visited<span class="token punctuation">)</span> <span class="token operator">==</span> n
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="lc200-岛屿数量-1" tabindex="-1"><a class="header-anchor" href="#lc200-岛屿数量-1" aria-hidden="true">#</a> LC200 岛屿数量</h3>
<blockquote>
<p>题目描述见 DFS 描述。</p>
</blockquote>
<p>BFS 解法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">numIslands</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> grid<span class="token punctuation">)</span><span class="token punctuation">:</span>
        row <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>grid<span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> row<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        col <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>grid<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> r <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>row<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">for</span> c <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>col<span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> grid<span class="token punctuation">[</span>r<span class="token punctuation">]</span><span class="token punctuation">[</span>c<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token string">'1'</span><span class="token punctuation">:</span>
                    <span class="token comment"># 开始 BFS</span>
                    res <span class="token operator">+=</span> <span class="token number">1</span>
                    q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">(</span>r<span class="token punctuation">,</span> c<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
                    <span class="token keyword">while</span> q<span class="token punctuation">:</span>
                        nr<span class="token punctuation">,</span> nc <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
                        <span class="token keyword">for</span> x<span class="token punctuation">,</span> y <span class="token keyword">in</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>nr <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span> nc<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>nr<span class="token punctuation">,</span> nc <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>nr <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> nc<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>nr<span class="token punctuation">,</span> nc <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
                            <span class="token keyword">if</span> <span class="token number">0</span> <span class="token operator">&lt;=</span> x <span class="token operator">&lt;</span> row <span class="token keyword">and</span> <span class="token number">0</span> <span class="token operator">&lt;=</span> y <span class="token operator">&lt;</span> col <span class="token keyword">and</span> grid<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token punctuation">[</span>y<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token string">'1'</span><span class="token punctuation">:</span>
                                q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">)</span>
                                grid<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token punctuation">[</span>y<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">'0'</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h3 id="lc210-课程表" tabindex="-1"><a class="header-anchor" href="#lc210-课程表" aria-hidden="true">#</a> LC210 课程表</h3>
<p><a href="https://leetcode-cn.com/problems/course-schedule-ii/" target="_blank" rel="noopener noreferrer">210. 课程表 II<ExternalLinkIcon/></a></p>
<blockquote>
<p>现在你总共有 numCourses 门课需要选，记为 0 到 numCourses - 1。给你一个数组 prerequisites ，其中 prerequisites[i] = [ai, bi] ，表示在选修课程 ai 前 必须 先选修 bi 。</p>
<p>例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示：[0,1] 。</p>
<p>返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，你只要返回 任意一种 就可以了。如果不可能完成所有课程，返回 一个空数组 。</p>
<p><strong>示例 1</strong>：</p>
<ul>
<li>输入：numCourses = 2, prerequisites = [[1,0]]</li>
<li>输出：[0,1]</li>
<li>解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1] 。</li>
</ul>
<p><strong>示例 2</strong>：</p>
<ul>
<li>输入：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]</li>
<li>输出：[0,2,1,3]</li>
<li>解释：总共有 4 门课程。要学习课程 3，你应该先完成课程 1 和课程 2。并且课程 1 和课程 2 都应该排在课程 0 之后。
因此，一个正确的课程顺序是 [0,1,2,3] 。另一个正确的排序是 [0,2,1,3] 。</li>
</ul>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/course-schedule-ii
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>这道题目比较综合，出的还是很不错的，我们整理思路如下：</p>
<ol>
<li>我们初始化每个课程，按照 index 把节点的入度全部初始化为 0, 注意到每个节点的入度我们都计算一下。</li>
<li>我们维护一个 dict, key 是这个节点，value 是和这个节点的前驱</li>
<li>然后对整体使用 BFS</li>
</ol>
<p>比如 <code>[1,0]</code> 这对数据，1 的入度这时候需要 +1, 而在字典中我们将 1 的前驱 0 （多个前驱用列表保存）存储起来。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findOrder</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> numCourses<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> prerequisites<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        edges <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">list</span><span class="token punctuation">)</span>
        <span class="token comment"># 存储节点的入度</span>
        indeg <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> numCourses

        <span class="token comment"># 选修 ai 前必须先选修 bi</span>
        <span class="token keyword">for</span> ai<span class="token punctuation">,</span> bi <span class="token keyword">in</span> prerequisites<span class="token punctuation">:</span>
            indeg<span class="token punctuation">[</span>ai<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
            edges<span class="token punctuation">[</span>bi<span class="token punctuation">]</span><span class="token punctuation">.</span>append<span class="token punctuation">(</span>ai<span class="token punctuation">)</span>

        <span class="token comment"># 将所有入度为0的节点放入队列中</span>
        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span>_ <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>numCourses<span class="token punctuation">)</span> <span class="token keyword">if</span> indeg<span class="token punctuation">[</span>_<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

        <span class="token comment"># bfs</span>
        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            node <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">)</span>
            <span class="token keyword">for</span> v <span class="token keyword">in</span> edges<span class="token punctuation">[</span>node<span class="token punctuation">]</span><span class="token punctuation">:</span>
                indeg<span class="token punctuation">[</span>v<span class="token punctuation">]</span> <span class="token operator">-=</span> <span class="token number">1</span>
                <span class="token keyword">if</span> indeg<span class="token punctuation">[</span>v<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span>v<span class="token punctuation">)</span>

        <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">!=</span> numCourses<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><h3 id="lc977-找到小镇的法官" tabindex="-1"><a class="header-anchor" href="#lc977-找到小镇的法官" aria-hidden="true">#</a> LC977 找到小镇的法官</h3>
<p><a href="https://leetcode-cn.com/problems/find-the-town-judge/" target="_blank" rel="noopener noreferrer">997. 找到小镇的法官<ExternalLinkIcon/></a></p>
<p>这道题目与LC210 类似，都是关于入度和出度的。</p>
<blockquote>
<p>在一个小镇里，按从 1 到 n 为 n 个人进行编号。传言称，这些人中有一个是小镇上的秘密法官。</p>
<p>如果小镇的法官真的存在，那么：</p>
<p>小镇的法官不相信任何人。</p>
<p>每个人（除了小镇法官外）都信任小镇的法官。</p>
<p>只有一个人同时满足条件 1 和条件 2 。</p>
<p>给定数组 trust，该数组由信任对 trust[i] = [a, b] 组成，表示编号为 a 的人信任编号为 b 的人。</p>
<p>如果小镇存在秘密法官并且可以确定他的身份，请返回该法官的编号。否则，返回 -1。</p>
<p>示例 1：</p>
<p>输入：n = 2, trust = [[1,2]]</p>
<p>输出：2</p>
<p>示例 2：</p>
<p>输入：n = 3, trust = [[1,3],[2,3]]</p>
<p>输出：3</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/find-the-town-judge
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findJudge</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> n<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> trust<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        trust_in <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        trust_out <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token keyword">for</span> me<span class="token punctuation">,</span> other <span class="token keyword">in</span> trust<span class="token punctuation">:</span>
            <span class="token comment"># 我信任了别人</span>
            trust_out<span class="token punctuation">[</span>me<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
            <span class="token comment"># 别人信任了我</span>
            trust_in<span class="token punctuation">[</span>other<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>

        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> n <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> trust_in<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> n <span class="token operator">-</span> <span class="token number">1</span> <span class="token keyword">and</span> trust_out<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> i
        <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="lc752-打开转盘锁" tabindex="-1"><a class="header-anchor" href="#lc752-打开转盘锁" aria-hidden="true">#</a> LC752 打开转盘锁</h3>
<p><a href="https://leetcode-cn.com/problems/open-the-lock/" target="_blank" rel="noopener noreferrer">752. 打开转盘锁<ExternalLinkIcon/></a></p>
<p>问题分析：</p>
<ul>
<li>
<p>我们可以定义 add, minus 来表示转盘密码 +1 或者 -1 的操作，注意到 0、9 这些边界值，将这个操作单独拎出来。</p>
</li>
<li>
<p>从题目中我们可以知道，有一些密码的组合是不能转到的，不然就算失败了，而为了达到不访问这些组合的效果，我们可以把这些组合和 visited 数组放到一起。</p>
</li>
<li>
<p>对这个问题进行抽象，一个锁共有 4 个位置，每个位置都可以向下或者向上转动，所以每个位置都有 2 种转动的可能，4 个位置共有 8 个可能。也就是说，‘xxxx’ 这个组合对应着 8 种下一个状态，8 种下一个状态中的每一个也是这样的结构，对应 8 种下一个状态… <em>这就像是一幅图，每个节点有 8 个相邻的节点</em>。</p>
</li>
</ul>
<p>编码：</p>
<ol>
<li>
<p>先写基础的 add, minus 方法</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">add</span><span class="token punctuation">(</span>num<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token string">'0'</span> <span class="token keyword">if</span> num <span class="token operator">==</span> <span class="token string">'9'</span> <span class="token keyword">else</span> <span class="token builtin">str</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>

<span class="token keyword">def</span> <span class="token function">minus</span><span class="token punctuation">(</span>num<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token string">'9'</span> <span class="token keyword">if</span> num <span class="token operator">==</span> <span class="token string">'0'</span> <span class="token keyword">else</span> <span class="token builtin">str</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></li>
<li>
<p>除此之外，我们还需要写一个辅助函数，计算某个状态在一次拨动以后能到达的所有下一个状态(前面分析过，这个状态有 8 个)，如<code>0000</code>可以到达的 <code>1000</code>, <code>0100</code>等。</p>
<p>这个在 Python 中有很多写法，其中最容易理解的写法为：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># 给定一个 status, 计算出来他能拨到的所有 8 个 status</span>
<span class="token keyword">def</span> <span class="token function">get_status</span><span class="token punctuation">(</span>status<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
    <span class="token comment"># list 方便赋值</span>
    status_list <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span>
    res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token comment"># 存储起来，等复位</span>
        tmp <span class="token operator">=</span> status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
        up <span class="token operator">=</span> add<span class="token punctuation">(</span>status<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
        status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> up
        res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>status_list<span class="token punctuation">)</span><span class="token punctuation">)</span>

        down <span class="token operator">=</span> minus<span class="token punctuation">(</span>status<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
        status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> down
        res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>status_list<span class="token punctuation">)</span><span class="token punctuation">)</span>

        <span class="token comment"># 复位</span>
        status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> tmp
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>比较高级的技巧是使用 <code>yield </code> 生成器，在此给个参考：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">get</span><span class="token punctuation">(</span>status<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    status_list <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span>
    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        tmp <span class="token operator">=</span> status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
        
        status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> add<span class="token punctuation">(</span>tmp<span class="token punctuation">)</span>
        <span class="token keyword">yield</span> <span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>status_list<span class="token punctuation">)</span>
        
        status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> minus<span class="token punctuation">(</span>tmp<span class="token punctuation">)</span>
        <span class="token keyword">yield</span> <span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>status_list<span class="token punctuation">)</span>
        
        status_list<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> tmp
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div></li>
<li>
<p>套用 BFS 框架。</p>
<p>根据题意，锁的初始数字为 <code>'0000'</code>，所以我们在队列中将这个元素初始化进去。</p>
<div class="custom-container warning"><p class="custom-container-title">关于队列初始化的基本语法技巧，需要注意</p>
<p>Python 中我们一般这么初始化队列：<code>q = collections.deque([1])</code></p>
<p>❌🚫❌ <code>q = collections.deque(1)</code> 是错误的！会报错 <em>TypeError: 'int' object is not iterable.</em></p>
<p>而在添加的时候，直接使用 <code>q.append(2)</code> 即可，这时候结果是 <code>[1,2]</code>；</p>
<p>❌🚫❌ 举个反例，如果觉得一次可以添加多个：<code>q.append([3,4])</code>, 就会得到这样的结果：<code>deque([1, 2, [3, 4]])</code>!</p>
<p>一般而言，我们在求解 BFS 问题的时候，会给每个候选项加上其对应的次数，放在一个元组中，其初始化就类似于这样：<code>q = collections.deque([('0000', 1)])</code>, 这种做法与初始化一个空的队列，然后将元组 <code>('0000', 1)</code> 添加进去是相同的效果(LC111. 二叉树的最小深度 使用了这个写法)。</p>
</div>
<p>结合上面的分析，我们套用 BFS 的框架可以得出求解该题目的主题框架：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token string">'0000'</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
visited <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">'0000'</span><span class="token punctuation">}</span>
<span class="token comment"># 将 deadends 这个 list 添加到 visited 这个 set 中</span>
visited <span class="token operator">|</span><span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span>deadends<span class="token punctuation">)</span>
<span class="token comment"># 这种方法同理</span>
<span class="token comment"># visited.update(deadends)</span>
<span class="token keyword">while</span> q<span class="token punctuation">:</span>
    status<span class="token punctuation">,</span> step <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">for</span> state <span class="token keyword">in</span> get_status<span class="token punctuation">(</span>status<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> state <span class="token keyword">not</span> <span class="token keyword">in</span> visited<span class="token punctuation">:</span>
            <span class="token keyword">if</span> state <span class="token operator">==</span> target<span class="token punctuation">:</span>
                <span class="token keyword">return</span> step
            visited<span class="token punctuation">.</span>add<span class="token punctuation">(</span>state<span class="token punctuation">)</span>
            q<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">,</span> step <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>上述代码中有几个细节需要注意：</p>
<ul>
<li>
<p>初始化队列，我们初始化队列为 <code>('0000', 1)</code>，最终在找到目标后返回了 <code>step</code>；其实我们初始化为 <code>('0000', 0)</code>，在找到目标后返回 <code>step + 1</code>也是可以的。</p>
</li>
<li>
<p>❓❓❓ 如何将一个 list 全部加入 set 中呢？有两种做法:</p>
<ol>
<li>
<p><code>visited |= set(deadends)</code></p>
</li>
<li>
<p><code>visited.update(deadends)</code></p>
</li>
</ol>
</li>
</ul>
</li>
<li>
<p>特殊场景考虑</p>
<p>除了上述的解法之外，我们还需要考虑到几种特殊场景的用例：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># 处理异常场景</span>
<span class="token keyword">if</span> <span class="token string">'0000'</span> <span class="token keyword">in</span> deadends<span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span>
<span class="token keyword">if</span> target <span class="token operator">==</span> <span class="token string">'0000'</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div></li>
</ol>
<h3 id="lc133-克隆图" tabindex="-1"><a class="header-anchor" href="#lc133-克隆图" aria-hidden="true">#</a> LC133 克隆图</h3>
<p><a href="https://leetcode-cn.com/problems/clone-graph/" target="_blank" rel="noopener noreferrer">133. 克隆图<ExternalLinkIcon/></a></p>
<blockquote>
<p>给你无向 <strong><a href="https://baike.baidu.com/item/%E8%BF%9E%E9%80%9A%E5%9B%BE/6460995?fr=aladdin" target="_blank" rel="noopener noreferrer">连通<ExternalLinkIcon/></a></strong> 图中一个节点的引用，请你返回该图的 <a href="https://baike.baidu.com/item/%E6%B7%B1%E6%8B%B7%E8%B4%9D/22785317?fr=aladdin" target="_blank" rel="noopener noreferrer"><strong>深拷贝</strong><ExternalLinkIcon/></a>（克隆）。</p>
</blockquote>
<p>初看这个题目，很难将其和 BFS 关联到，我们进行分析：</p>
<div class="language-txt ext-txt line-numbers-mode"><pre v-pre class="language-txt"><code>输入：adjList = [[2,4],[1,3],[2,4],[1,3]]

输出：[[2,4],[1,3],[2,4],[1,3]]
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>我们可以看到，题目是给出了邻接表，让我们按照这个邻接表对图进行深拷贝。这个邻接表的含义是：<code>[2,4]</code> 表示第一个节点 <code>1</code>的邻居为节点 <code>2</code> 和节点 <code>4</code>（节点 index 从 1 开始），以此类推。</p>
<p>🎈🎈🎈 思考。</p>
<p>从这个题目中，我们要明白：<strong>BFS 设立之初就是为的图的遍历</strong>，这个题目真可谓是返璞归真。</p>
<p>那么，我们要怎么深拷贝这个图呢？</p>
<ol>
<li>我们解析邻接表，邻接表的两个无向边可以确定一个有向边。</li>
<li>我们知道了邻接表，但是如果直接解析，可能会进入死循环，我们需要使用 <code>visited</code> 数组来进行标记。</li>
</ol>
<p>如何设计算法：</p>
<ol>
<li>
<p>使用一个哈希表来记录 visited 过的节点。将 key 设置为原始图中的节点， value 设置为克隆图中对应的节点。</p>
</li>
<li>
<p>题目中给定的节点加入队列，克隆该节点并且存储到哈希表中。</p>
</li>
</ol>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">cloneGraph</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> node<span class="token punctuation">:</span> <span class="token string">'Node'</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token string">'Node'</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> node<span class="token punctuation">:</span>
            <span class="token keyword">return</span> node

        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span>node<span class="token punctuation">]</span><span class="token punctuation">)</span>
        visited <span class="token operator">=</span> <span class="token builtin">dict</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        visited<span class="token punctuation">[</span>node<span class="token punctuation">]</span> <span class="token operator">=</span> Node<span class="token punctuation">(</span>node<span class="token punctuation">.</span>val<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            head <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">for</span> neighbor <span class="token keyword">in</span> head<span class="token punctuation">.</span>neighbors<span class="token punctuation">:</span>
                <span class="token keyword">if</span> neighbor <span class="token keyword">not</span> <span class="token keyword">in</span> visited<span class="token punctuation">.</span>keys<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span>neighbor<span class="token punctuation">)</span>
                    visited<span class="token punctuation">[</span>neighbor<span class="token punctuation">]</span> <span class="token operator">=</span> Node<span class="token punctuation">(</span>neighbor<span class="token punctuation">.</span>val<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
                visited<span class="token punctuation">[</span>head<span class="token punctuation">]</span><span class="token punctuation">.</span>neighbors<span class="token punctuation">.</span>append<span class="token punctuation">(</span>visited<span class="token punctuation">[</span>neighbor<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> visited<span class="token punctuation">[</span>node<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>这个题目较为复杂，还需要多多理解！</p>
<h3 id="lc2039-网络空闲的时刻" tabindex="-1"><a class="header-anchor" href="#lc2039-网络空闲的时刻" aria-hidden="true">#</a> LC2039 网络空闲的时刻</h3>
<p>这个题目<a href="https://leetcode-cn.com/problems/the-time-when-the-network-becomes-idle/" target="_blank" rel="noopener noreferrer">描述<ExternalLinkIcon/></a>比较复杂，核心思路是使用 BFS 对图进行遍历，看代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">networkBecomesIdle</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> edges<span class="token punctuation">:</span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> patience<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>
        n <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>patience<span class="token punctuation">)</span>
        g <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">list</span><span class="token punctuation">)</span>
        <span class="token keyword">for</span> u<span class="token punctuation">,</span> v <span class="token keyword">in</span> edges<span class="token punctuation">:</span>
            g<span class="token punctuation">[</span>u<span class="token punctuation">]</span><span class="token punctuation">.</span>append<span class="token punctuation">(</span>v<span class="token punctuation">)</span>
            g<span class="token punctuation">[</span>v<span class="token punctuation">]</span><span class="token punctuation">.</span>append<span class="token punctuation">(</span>u<span class="token punctuation">)</span>
            
        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        visited <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token boolean">True</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token boolean">False</span><span class="token punctuation">]</span> <span class="token operator">*</span> <span class="token punctuation">(</span>n<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token number">0</span>
        dist <span class="token operator">=</span> <span class="token number">1</span>
        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            <span class="token keyword">for</span> _ <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>q<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                u <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token keyword">for</span> v <span class="token keyword">in</span> g<span class="token punctuation">[</span>u<span class="token punctuation">]</span><span class="token punctuation">:</span>
                    <span class="token keyword">if</span> visited<span class="token punctuation">[</span>v<span class="token punctuation">]</span><span class="token punctuation">:</span>  
                        <span class="token keyword">continue</span>
                    visited<span class="token punctuation">[</span>v<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">True</span>
                    q<span class="token punctuation">.</span>append<span class="token punctuation">(</span>v<span class="token punctuation">)</span>
                    res <span class="token operator">=</span> <span class="token builtin">max</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> <span class="token punctuation">(</span>dist <span class="token operator">*</span> <span class="token number">2</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">//</span>
                            patience<span class="token punctuation">[</span>v<span class="token punctuation">]</span> <span class="token operator">*</span> patience<span class="token punctuation">[</span>v<span class="token punctuation">]</span> <span class="token operator">+</span> dist <span class="token operator">*</span> <span class="token number">2</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
            dist <span class="token operator">+=</span> <span class="token number">1</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><p>其对应的测试代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>s <span class="token operator">=</span> Solution<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">test</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        edges <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
        patience <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span>
        res <span class="token operator">=</span> self<span class="token punctuation">.</span>s<span class="token punctuation">.</span>networkBecomesIdle<span class="token punctuation">(</span>edges<span class="token punctuation">,</span> patience<span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">test2</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        edges <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">17</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">14</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">19</span><span class="token punctuation">,</span> <span class="token number">13</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">13</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>
            <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">15</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">18</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">14</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">17</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">16</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">16</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">19</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
        patience <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">]</span>
        res <span class="token operator">=</span> self<span class="token punctuation">.</span>s<span class="token punctuation">.</span>networkBecomesIdle<span class="token punctuation">(</span>edges<span class="token punctuation">,</span> patience<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>assertEqual<span class="token punctuation">(</span><span class="token number">67</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h3 id="lc365-水壶问题" tabindex="-1"><a class="header-anchor" href="#lc365-水壶问题" aria-hidden="true">#</a> LC365 水壶问题</h3>
<p>两个水壶 x, y 和无限多的水，能否通过使用这两个水壶，得到恰好 z 容量的水？</p>
<p>我们把这个问题理解为一个 BFS 问题，其关键点在于：状态的转换。我们设置初始状态为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(0, 0)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">0</span><span class="mclose">)</span></span></span></span>, 而经过转化后的中间状态为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>a</mi><mo separator="true">,</mo><mi>b</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(a, b)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mclose">)</span></span></span></span>, 其状态上限为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>x</mi><mo separator="true">,</mo><mi>y</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(x, y)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mclose">)</span></span></span></span>, 每一次递归的状态都放入 BFS 的队列中进行判断，而后向后搜索，其代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">canMeasureWater</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> x<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> y<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> z<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> x <span class="token operator">+</span> y <span class="token operator">&lt;</span> z<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>

        <span class="token keyword">if</span> x <span class="token operator">></span> y<span class="token punctuation">:</span>
            x<span class="token punctuation">,</span> y <span class="token operator">=</span> y<span class="token punctuation">,</span> x

        q <span class="token operator">=</span> collections<span class="token punctuation">.</span>deque<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        visited <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        visited<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

        <span class="token keyword">while</span> q<span class="token punctuation">:</span>
            a<span class="token punctuation">,</span> b <span class="token operator">=</span> q<span class="token punctuation">.</span>popleft<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> a <span class="token operator">+</span> b <span class="token operator">==</span> z<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">True</span>

            states <span class="token operator">=</span> <span class="token builtin">set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

            states<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            states<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">)</span>
            states<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">)</span>
            states<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token comment"># y -> x</span>
            states<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token builtin">min</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> b <span class="token operator">+</span> a<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span> <span class="token keyword">if</span> a <span class="token operator">+</span> b <span class="token operator">&lt;</span> x <span class="token keyword">else</span> b <span class="token operator">-</span> <span class="token punctuation">(</span>x <span class="token operator">-</span> a<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token comment"># x -> y</span>
            states<span class="token punctuation">.</span>add<span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token number">0</span> <span class="token keyword">if</span> a <span class="token operator">+</span> b <span class="token operator">&lt;</span> y <span class="token keyword">else</span> a <span class="token operator">-</span> <span class="token punctuation">(</span>y <span class="token operator">-</span> b<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token builtin">min</span><span class="token punctuation">(</span>a <span class="token operator">+</span> b<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

            <span class="token keyword">for</span> state <span class="token keyword">in</span> states<span class="token punctuation">:</span>
                <span class="token keyword">if</span> state <span class="token keyword">in</span> visited<span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>
                visited<span class="token punctuation">.</span>add<span class="token punctuation">(</span>state<span class="token punctuation">)</span>
                q<span class="token punctuation">.</span>append<span class="token punctuation">(</span>state<span class="token punctuation">)</span>

        <span class="token keyword">return</span> <span class="token boolean">False</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><p>在这个问题中，我们需要把所有的状态转化点都列举出来：</p>
<table>
<thead>
<tr>
<th style="text-align:center">动作</th>
<th>状态</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>a</mi><mo separator="true">,</mo><mi>b</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(a,b)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mclose">)</span></span></span></span></td>
<td>初始状态（后面用 a,b 标识壶号）</td>
<td></td>
</tr>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mi>b</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(0, b)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mclose">)</span></span></span></span></td>
<td>a 壶倒空</td>
<td></td>
</tr>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>a</mi><mo separator="true">,</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(a, 0)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">0</span><span class="mclose">)</span></span></span></span></td>
<td>b 壶倒空</td>
<td></td>
</tr>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>x</mi><mo separator="true">,</mo><mi>b</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(x, b)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mclose">)</span></span></span></span></td>
<td>a 壶倒满</td>
<td></td>
</tr>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>a</mi><mo separator="true">,</mo><mi>y</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(a, y)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mclose">)</span></span></span></span></td>
<td>b 壶倒满</td>
<td></td>
</tr>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>m</mi><mi>i</mi><mi>n</mi><mo stretchy="false">(</mo><mi>x</mi><mo separator="true">,</mo><mi>b</mi><mo>+</mo><mi>a</mi><mo stretchy="false">)</mo><mo separator="true">,</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(min(x, b + a), 0)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">min</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">a</span><span class="mclose">)</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">0</span><span class="mclose">)</span></span></span></span> or <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>m</mi><mi>i</mi><mi>n</mi><mo stretchy="false">(</mo><mi>x</mi><mo separator="true">,</mo><mi>b</mi><mo>+</mo><mi>a</mi><mo stretchy="false">)</mo><mo separator="true">,</mo><mi>b</mi><mo>−</mo><mo stretchy="false">(</mo><mi>x</mi><mo>−</mo><mi>a</mi><mo stretchy="false">)</mo><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(min(x, b + a), b - (x - a))</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">min</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">a</span><span class="mclose">)</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">a</span><span class="mclose">))</span></span></span></span></td>
<td>将 b 壶全部倒入 a 壶</td>
<td></td>
</tr>
<tr>
<td style="text-align:center"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mi>m</mi><mi>i</mi><mi>n</mi><mo stretchy="false">(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo separator="true">,</mo><mi>y</mi><mo stretchy="false">)</mo><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(0, min(a+b, y))</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">min</span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">b</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mclose">))</span></span></span></span> or <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>a</mi><mo>−</mo><mo stretchy="false">(</mo><mi>y</mi><mo>−</mo><mi>b</mi><mo stretchy="false">)</mo><mo separator="true">,</mo><mi>m</mi><mi>i</mi><mi>n</mi><mo stretchy="false">(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo separator="true">,</mo><mi>y</mi><mo stretchy="false">)</mo><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(a - (y - b), min(a + b, y))</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">b</span><span class="mclose">)</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">min</span><span class="mopen">(</span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">b</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mclose">))</span></span></span></span></td>
<td>将 a 壶全部倒入 b 壶</td>
<td></td>
</tr>
</tbody>
</table>
<p>我们需要重点理解一下后面两种情况：</p>
<ol>
<li><em>将 b 壶倒入 a 壶</em>：此时我们可以确定：
<ol>
<li>如果 b 壶全被倒空了。那么这时候有两种情况：第一种是把全部的 b 都倒进去了，但是没有倒满（<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi><mo>+</mo><mi>a</mi></mrow><annotation encoding="application/x-tex">b + a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7778em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">a</span></span></span></span>）；第二种情况是到进去了，此时杯子的容量不够了(<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span>)。</li>
<li>如果 b 壶没有被倒空。那么此时 b 壶中应该是有剩下的水的，什么时候会剩下呢？如果 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a + b</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">b</span></span></span></span> 的容量小于 a 壶的容量 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span> 时候，肯定会有部分的水剩下在了 b 壶里面。那么剩下了多少呢？我们知道 a 壶可以倒入 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>−</mo><mi>a</mi></mrow><annotation encoding="application/x-tex">x - a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">a</span></span></span></span> 容量的水，那么剩下的水就是 b 壶现有的水减去 a 壶可以倒入的水 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi><mo>−</mo><mo stretchy="false">(</mo><mi>x</mi><mo>−</mo><mi>a</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">b - (x -a)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7778em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">b</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">a</span><span class="mclose">)</span></span></span></span>。</li>
</ol>
</li>
<li><em>将 a 壶倒入 b 壶</em>：和上面的分析同理。</li>
</ol>
</template>
