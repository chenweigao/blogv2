<template><h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2>
<p><strong>回溯法</strong>（英语：backtracking）是<a href="https://zh.wikipedia.org/wiki/%E6%9A%B4%E5%8A%9B%E6%90%9C%E5%B0%8B%E6%B3%95" target="_blank" rel="noopener noreferrer">暴力搜索法<ExternalLinkIcon/></a>中的一种。</p>
<p>对于某些计算问题而言，回溯法是一种可以找出所有（或一部分）解的一般性算法，尤其适用于<a href="https://zh.wikipedia.org/wiki/%E7%BA%A6%E6%9D%9F%E8%A1%A5%E5%81%BF%E9%97%AE%E9%A2%98" target="_blank" rel="noopener noreferrer">约束补偿问题<ExternalLinkIcon/></a>（在解决约束满足问题时，我们逐步构造更多的候选解，并且在确定某一部分候选解不可能补全成正确解之后放弃继续搜索这个部分候选解本身及其可以拓展出的子候选解，转而测试其他的部分候选解）。</p>
<!-- more -->
<p>在经典的教科书中，<a href="https://zh.wikipedia.org/wiki/%E5%85%AB%E7%9A%87%E5%90%8E%E9%97%AE%E9%A2%98" target="_blank" rel="noopener noreferrer">八皇后问题<ExternalLinkIcon/></a>展示了回溯法的用例。（八皇后问题是在标准国际象棋棋盘中寻找八个皇后的所有分布，使得没有一个皇后能攻击到另外一个。）</p>
<p>回溯法采用<a href="https://zh.wikipedia.org/wiki/%E8%AF%95%E9%94%99" target="_blank" rel="noopener noreferrer">试错<ExternalLinkIcon/></a>的思想，它尝试分步的去解决一个问题。在分步解决问题的过程中，当它通过尝试发现，现有的分步答案不能得到有效的正确的解答的时候，它将取消上一步甚至是上几步的计算，再通过其它的可能的分步解答再次尝试寻找问题的答案。回溯法通常用最简单的<a href="https://zh.wikipedia.org/wiki/%E9%80%92%E5%BD%92" target="_blank" rel="noopener noreferrer">递归<ExternalLinkIcon/></a>方法来实现，在反复重复上述的步骤后可能出现两种情况：</p>
<ul>
<li>找到一个可能存在的正确的答案</li>
<li>在尝试了所有可能的分步方法后宣告该问题没有答案</li>
</ul>
<p>在最坏的情况下，回溯法会导致一次<a href="https://zh.wikipedia.org/wiki/%E8%AE%A1%E7%AE%97%E5%A4%8D%E6%9D%82%E6%80%A7%E7%90%86%E8%AE%BA" target="_blank" rel="noopener noreferrer">复杂度<ExternalLinkIcon/></a>为<a href="https://zh.wikipedia.org/wiki/%E6%8C%87%E6%95%B8%E6%99%82%E9%96%93" target="_blank" rel="noopener noreferrer">指数时间<ExternalLinkIcon/></a>的计算。</p>
<h2 id="模板" tabindex="-1"><a class="header-anchor" href="#模板" aria-hidden="true">#</a> 模板</h2>
<p>总结回溯的模板如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> choices<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> OK<span class="token punctuation">:</span>
        result<span class="token punctuation">.</span>append<span class="token punctuation">(</span>path<span class="token punctuation">)</span>
        <span class="token keyword">return</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">for</span> choice <span class="token keyword">in</span> choices<span class="token punctuation">:</span>
            make_choices<span class="token punctuation">(</span><span class="token punctuation">)</span>
            back_tarack<span class="token punctuation">(</span>path<span class="token punctuation">,</span> choices<span class="token punctuation">)</span>
            undo_choices<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>其中 path 表示路径，choices 表示做出的选择。</p>
<h2 id="例题解析" tabindex="-1"><a class="header-anchor" href="#例题解析" aria-hidden="true">#</a> 例题解析</h2>
<h3 id="lc17-电话号码的字母组合" tabindex="-1"><a class="header-anchor" href="#lc17-电话号码的字母组合" aria-hidden="true">#</a> LC17 电话号码的字母组合</h3>
<blockquote>
<p>给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。</p>
<p>给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。</p>
<p>输入：digits = &quot;23&quot;</p>
<p>输出：[&quot;ad&quot;,&quot;ae&quot;,&quot;af&quot;,&quot;bd&quot;,&quot;be&quot;,&quot;bf&quot;,&quot;cd&quot;,&quot;ce&quot;,&quot;cf&quot;]</p>
<p>来源：力扣（LeetCode）</p>
<p>链接：https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>解法：标准回溯：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">letterCombinations</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> digits<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> digits<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

        dig2alph <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token string">'2'</span><span class="token punctuation">:</span> <span class="token string">'abc'</span><span class="token punctuation">,</span>
            <span class="token string">'3'</span><span class="token punctuation">:</span> <span class="token string">'def'</span><span class="token punctuation">,</span>
            <span class="token string">'4'</span><span class="token punctuation">:</span> <span class="token string">'ghi'</span><span class="token punctuation">,</span>
            <span class="token string">'5'</span><span class="token punctuation">:</span> <span class="token string">'jkl'</span><span class="token punctuation">,</span>
            <span class="token string">'6'</span><span class="token punctuation">:</span> <span class="token string">'mno'</span><span class="token punctuation">,</span>
            <span class="token string">'7'</span><span class="token punctuation">:</span> <span class="token string">'pqrs'</span><span class="token punctuation">,</span>
            <span class="token string">'8'</span><span class="token punctuation">:</span> <span class="token string">'tuv'</span><span class="token punctuation">,</span>
            <span class="token string">'9'</span><span class="token punctuation">:</span> <span class="token string">'wxyz'</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> index <span class="token operator">==</span> <span class="token builtin">len</span><span class="token punctuation">(</span>digits<span class="token punctuation">)</span><span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>combination<span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                digit <span class="token operator">=</span> digits<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
                <span class="token keyword">for</span> ch <span class="token keyword">in</span> dig2alph<span class="token punctuation">[</span>digit<span class="token punctuation">]</span><span class="token punctuation">:</span>
                    combination<span class="token punctuation">.</span>append<span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
                    back_track<span class="token punctuation">(</span>index <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
                    combination<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        combination <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        res <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        back_track<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><h3 id="lc22-括号生成" tabindex="-1"><a class="header-anchor" href="#lc22-括号生成" aria-hidden="true">#</a> LC22 括号生成</h3>
<blockquote>
<p>数字 <code>n</code> 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 <strong>有效的</strong> 括号组合。</p>
<p>有效括号组合需满足：左括号必须以正确的顺序闭合。</p>
</blockquote>
<p>解法：回溯。通过 left 和 right 是否&quot;平衡&quot;来筛选一下数据。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">generateParenthesis</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> n<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>A<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">,</span> left<span class="token punctuation">,</span> right<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token comment"># 比如 n == 3 时，生成的括号总数为 2*3 个</span>
            <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">2</span> <span class="token operator">*</span> n<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>
            <span class="token keyword">if</span> left <span class="token operator">&lt;</span> n<span class="token punctuation">:</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">'('</span><span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>A<span class="token punctuation">,</span> left <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> right<span class="token punctuation">)</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> right <span class="token operator">&lt;</span> left<span class="token punctuation">:</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">')'</span><span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>A<span class="token punctuation">,</span> left<span class="token punctuation">,</span> right <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>如果不使用该方法的话，可能需要使用较为“暴力”的解法：
(不过该解法比较适合用来理解回溯的思想)</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>    <span class="token keyword">def</span> <span class="token function">generateParenthesis</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> n<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">:</span>

        <span class="token keyword">def</span> <span class="token function">generate</span><span class="token punctuation">(</span>A<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">2</span> <span class="token operator">*</span> n<span class="token punctuation">:</span>
                <span class="token keyword">if</span> is_valid<span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
                    res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">'('</span><span class="token punctuation">)</span>
                generate<span class="token punctuation">(</span>A<span class="token punctuation">)</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token string">')'</span><span class="token punctuation">)</span>
                generate<span class="token punctuation">(</span>A<span class="token punctuation">)</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        <span class="token keyword">def</span> <span class="token function">is_valid</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
            balance <span class="token operator">=</span> <span class="token number">0</span>
            <span class="token keyword">for</span> ch <span class="token keyword">in</span> A<span class="token punctuation">:</span>
                <span class="token keyword">if</span> ch <span class="token operator">==</span> <span class="token string">'('</span><span class="token punctuation">:</span>
                    balance <span class="token operator">+=</span> <span class="token number">1</span>
                <span class="token keyword">else</span><span class="token punctuation">:</span>
                    balance <span class="token operator">-=</span> <span class="token number">1</span>
                <span class="token keyword">if</span> balance <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">:</span>
                    <span class="token keyword">return</span> <span class="token boolean">False</span>
            <span class="token keyword">return</span> balance <span class="token operator">==</span> <span class="token number">0</span>

        res <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        generate<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><h3 id="lc39-组合总数" tabindex="-1"><a class="header-anchor" href="#lc39-组合总数" aria-hidden="true">#</a> LC39 组合总数</h3>
<blockquote>
<p>给定一个无重复元素的正整数数组 candidates 和一个正整数 target ，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。</p>
<p>candidates 中的数字可以无限制重复被选取。如果至少一个所选数字数量不同，则两种组合是唯一的。</p>
<p>输入: candidates = [2,3,6,7], target = 7</p>
<p>输出: [[7],[2,2,3]]</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/combination-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>套用上述的公式，写出的解法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">combinationSum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> candidates<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span> <span class="token operator">==</span> target <span class="token keyword">and</span> <span class="token builtin">sorted</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span> <span class="token keyword">not</span> <span class="token keyword">in</span> res<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token builtin">sorted</span><span class="token punctuation">(</span>A<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>
            <span class="token keyword">if</span> <span class="token builtin">sum</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span> <span class="token operator">></span> target<span class="token punctuation">:</span>
                <span class="token keyword">return</span>
            <span class="token keyword">for</span> c <span class="token keyword">in</span> candidates<span class="token punctuation">:</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span>c<span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>A<span class="token punctuation">)</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>注意到 sum(A) 大于 target 被剪枝，这样就减少了计算量。第二是通过排序的操作筛选出了已经存在的组合。</p>
<p>但是该算法还存在很大的优化点，因为我们的“剪枝”操作过于原始，在这种<strong>不需要考虑顺序</strong>的题目中，应当考虑更加高效的方法。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution2</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">combinationSum</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> candidates<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>A<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">,</span> cur_sum<span class="token punctuation">,</span> begin<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> cur_sum <span class="token operator">==</span> target<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token builtin">sorted</span><span class="token punctuation">(</span>A<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>
            <span class="token keyword">if</span> cur_sum <span class="token operator">></span> target<span class="token punctuation">:</span>
                <span class="token keyword">return</span>
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>begin<span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>candidates<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token comment"># 剪枝</span>
                <span class="token keyword">if</span> cur_sum <span class="token operator">+</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">></span> target<span class="token punctuation">:</span>
                    <span class="token keyword">return</span>

                cur_sum <span class="token operator">+=</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span>candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token operator">//</span> 不用i<span class="token operator">+</span><span class="token number">1</span>，表示可以重复读取当前的数
                back_track<span class="token punctuation">(</span>A<span class="token punctuation">,</span> cur_sum<span class="token punctuation">,</span> i<span class="token punctuation">)</span>
                cur_sum <span class="token operator">-=</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
        candidates<span class="token punctuation">.</span>sort<span class="token punctuation">(</span><span class="token punctuation">)</span>
        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><p>注意到这个回溯之前我们先进行了排序<code>candidates.sort()</code>,这个剪枝相比于上面的解法高明之处在哪里呢？</p>
<ul>
<li>如果题目要求，结果集不计算顺序，此时需要按顺序搜索，才能做到不重不漏。（为何排序？按照特定搜索指定了 <code>begin</code>）</li>
<li>使用了一个 <code>begin</code>变量，这个变量用于组合问题，不讲究顺序（即 <code>[2, 2, 3]</code> 与 <code>[2, 3, 2]</code> 视为相同列表时），需要按照某种顺序搜索。</li>
</ul>
<p>理解 <code>cur_sum</code>的优点在于：对于刚开始的原始解法，，对于sum已经大于target的情况，其实是依然进入了下一层递归，只是下一层递归结束判断的时候，会判断sum &gt; target的话就返回。其实如果已经知道下一层的sum会大于target，就没有必要进入下一层递归了。所以我们在 for 循环中做了文章，使用 <code>cur_sum</code>来判断如果下一层的 sum 已经大于 target，就没有必要走下去了，而是直接结束本轮 for 循环的遍历。</p>
<p>参考该<a href="https://programmercarl.com/0039.%E7%BB%84%E5%90%88%E6%80%BB%E5%92%8C.html#%E5%89%AA%E6%9E%9D%E4%BC%98%E5%8C%96" target="_blank" rel="noopener noreferrer">blog<ExternalLinkIcon/></a></p>
<h3 id="lc40-组合总数ii" tabindex="-1"><a class="header-anchor" href="#lc40-组合总数ii" aria-hidden="true">#</a> LC40 组合总数II</h3>
<p>不同于 LC39 组合总数，LC40 要求<code>candidates</code> 中的每个数字在每个组合中只能使用一次。</p>
<p>举例而言：</p>
<blockquote>
<p>输入: candidates = [10,1,2,7,6,1,5], target = 8,</p>
<p>输出:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]</p>
<p>来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/combination-sum-ii
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。</p>
</blockquote>
<p>题目的意思是，每个数字在每一个答案里面只能用一次，无法重复使用，因此如何达到这个限制是本题目的难点，解决方案是使用比较高级的剪枝，与上述题目只有一点不同，具体看代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">combinationSum2</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> candidates<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>A<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">,</span> cur_sum<span class="token punctuation">,</span> begin<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> cur_sum <span class="token operator">==</span> target<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>A<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>
            <span class="token keyword">if</span> cur_sum <span class="token operator">></span> target<span class="token punctuation">:</span>
                <span class="token keyword">return</span>

            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>begin<span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>candidates<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> cur_sum <span class="token operator">+</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">></span> target<span class="token punctuation">:</span>
                    <span class="token keyword">return</span>

                <span class="token keyword">if</span> i <span class="token operator">></span> begin <span class="token keyword">and</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> candidates<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>

                cur_sum <span class="token operator">+=</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
                A<span class="token punctuation">.</span>append<span class="token punctuation">(</span>candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>A<span class="token punctuation">,</span> cur_sum<span class="token punctuation">,</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
                cur_sum <span class="token operator">-=</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
                A<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        candidates<span class="token punctuation">.</span>sort<span class="token punctuation">(</span><span class="token punctuation">)</span>
        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p>可以看到，我们在代码中增加了一段剪枝：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">if</span> i <span class="token operator">></span> begin <span class="token keyword">and</span> candidates<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> candidates<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
    <span class="token keyword">continue</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>并且在回溯的时候把 begin 设置为了 <code>i+1</code>，个人的理解是，这一步操作排除了当前层的节点，从下一层开始找，达到了我们剪枝的目的。（去重“同一树层上使用过的”元素）</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>back_track<span class="token punctuation">(</span>A<span class="token punctuation">,</span> cur_sum<span class="token punctuation">,</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>对这个 <code>begin</code>的理解是：其作用相当于标记了 used 元素（使用 used 数组标记效果相同），我们在 sort() 的情况下用 begin 是可以的。</p>
<p><strong>（需要加深理解，不一定正确。）</strong></p>
<h3 id="lc46-全排列" tabindex="-1"><a class="header-anchor" href="#lc46-全排列" aria-hidden="true">#</a> LC46 全排列</h3>
<p>在解决了上面的那些问题以后，全排列问题就变得简单了，全排列问题举例如下：</p>
<blockquote>
<p>给定一个不含重复数字的数组 <code>nums</code> ，返回其 <strong>所有可能的全排列</strong> 。你可以 <strong>按任意顺序</strong> 返回答案。</p>
<p>输入：nums = [1,2,3]</p>
<p>输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]</p>
</blockquote>
<p>该题目使用回溯可以很方便的求解：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">permute</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>path<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>
            
            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">in</span> path<span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>

                path<span class="token punctuation">.</span>append<span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>path<span class="token punctuation">)</span>
                path<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>全排列是经典的回溯问题，套用回溯模板可以很轻松求解。</p>
<h3 id="lc47-全排列ii" tabindex="-1"><a class="header-anchor" href="#lc47-全排列ii" aria-hidden="true">#</a> LC47 全排列II</h3>
<blockquote>
<p>给定一个可包含重复数字的序列 <code>nums</code> ，<strong>按任意顺序</strong> 返回所有不重复的全排列。</p>
<p>输入：nums = [1,1,2]</p>
<p>输出：
[[1,1,2],
[1,2,1],
[2,1,1]]</p>
</blockquote>
<p>解法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">permuteUnique</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> List<span class="token punctuation">,</span> visited<span class="token punctuation">:</span> List<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>path<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>

            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> visited<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>
				
                <span class="token comment"># visited[i - 1] == 1 在该题目中同理，但是性能较差</span>
                <span class="token keyword">if</span> i <span class="token operator">></span> <span class="token number">0</span> <span class="token keyword">and</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> nums<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token keyword">and</span> visited<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>

                visited<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>
                path<span class="token punctuation">.</span>append<span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>path<span class="token punctuation">,</span> visited<span class="token punctuation">)</span>
                visited<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
                path<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        nums<span class="token punctuation">.</span>sort<span class="token punctuation">(</span><span class="token punctuation">)</span>

        visited <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span> <span class="token keyword">for</span> _ <span class="token keyword">in</span> nums<span class="token punctuation">]</span>
        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> visited<span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><p>这道题目不同于<em>全排列</em>的点在于：</p>
<ul>
<li>集合中有重复的元素，但是最后的结果中不能有重复的组合。我们需要对结果进行去重（直观的思路是用set，但是容易超时）</li>
<li>nums[i] 和 nums[i - 1] 可以理解为同一层的当前选项和同一层的前一个选项</li>
<li>该题目中有两个变量去重，如果仅有<code>num[i] == num[i-1]</code>条件存在，递归时会把相同元素去除，显然不是我们想要的，所以加上了 <code>vistied</code>，防止漏掉元素</li>
<li>如果 <code>visited[i - 1] == 1</code>，说明在同一层，并且 <code>num[i] == num[i-1]</code>，所有可能的组合都早已被这一层第一次出现的那个相同数穷尽了，不需要再画蛇添足。</li>
</ul>
<div class="custom-container warning"><p class="custom-container-title">todo</p>
<p>需要拿 iPad 画图分析一下 visited[i - 1] == 1 和 visited[i - 1] == 0 的剪枝差异，可以参考 <a href="https://leetcode-cn.com/problems/permutations-ii/solution/dai-ma-sui-xiang-lu-dai-ni-xue-tou-hui-s-ki1h/" target="_blank" rel="noopener noreferrer">题解<ExternalLinkIcon/></a></p>
</div>
<h3 id="lc77-组合" tabindex="-1"><a class="header-anchor" href="#lc77-组合" aria-hidden="true">#</a> LC77 组合</h3>
<blockquote>
<p>给定两个整数 <code>n</code> 和 <code>k</code>，返回范围 <code>[1, n]</code> 中所有可能的 <code>k</code> 个数的组合。</p>
<p>你可以按 <strong>任何顺序</strong> 返回答案。</p>
<p>输入：n = 4, k = 2
输出：
[
[2,4],
[3,4],
[2,3],
[1,2],
[1,3],
[1,4],
]</p>
</blockquote>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">combine</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> n<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span>List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        nums <span class="token operator">=</span> <span class="token punctuation">[</span>i <span class="token operator">+</span> <span class="token number">1</span> <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">back_track</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> List<span class="token punctuation">,</span> begin<span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span> <span class="token operator">==</span> k<span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>path<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span>

            <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>begin<span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                <span class="token keyword">if</span> i <span class="token operator">></span> begin <span class="token keyword">and</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> nums<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
                    <span class="token keyword">continue</span>

                path<span class="token punctuation">.</span>append<span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
                back_track<span class="token punctuation">(</span>path<span class="token punctuation">,</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>
                path<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>

        back_track<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div></template>
