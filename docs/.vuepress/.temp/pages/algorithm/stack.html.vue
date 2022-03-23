<template><nav class="table-of-contents"><ul><li><RouterLink to="#abstract">Abstract</RouterLink></li><li><RouterLink to="#stack-problem">Stack Problem</RouterLink><ul><li><RouterLink to="#valid-parentheses-括号匹配">Valid Parentheses(括号匹配)</RouterLink></li><li><RouterLink to="#validate-stack-sequence">Validate Stack Sequence</RouterLink></li><li><RouterLink to="#next-greater-element">Next Greater Element</RouterLink></li><li><RouterLink to="#用两个栈实现一个队列">用两个栈实现一个队列</RouterLink></li><li><RouterLink to="#用两个队列实现一个栈">用两个队列实现一个栈</RouterLink></li><li><RouterLink to="#括号匹配">括号匹配</RouterLink></li><li><RouterLink to="#后缀表达式">后缀表达式</RouterLink></li></ul></li></ul></nav>
<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2>
<p>todo</p>
<h2 id="stack-problem" tabindex="-1"><a class="header-anchor" href="#stack-problem" aria-hidden="true">#</a> Stack Problem</h2>
<h3 id="valid-parentheses-括号匹配" tabindex="-1"><a class="header-anchor" href="#valid-parentheses-括号匹配" aria-hidden="true">#</a> Valid Parentheses(括号匹配)</h3>
<p>堆栈在处理递归问题时非常有用，对于<strong>括号匹配</strong>，是栈应用的经典案例：</p>
<ol>
<li>
<p>Initialize a stack S: 初始化栈</p>
</li>
<li>
<p>Process each bracket(括号) of the expression one at a time.</p>
</li>
<li>
<p>If we encounter an opening bracket, then we check the element on the top of the stack. (遇到左括号则入栈)</p>
</li>
<li>
<p>If the element at the top of the stack is an openning bracket <strong>of the same type</strong>, the we <strong>pop</strong> it off the stack and continue processing. (栈顶元素和外面相匹配，则出栈继续)</p>
</li>
<li>
<p>Else this implies an invaild expression.</p>
</li>
<li>
<p>In the end, if we are left with a stack still having elements, then this implies an invaild expression. (栈不空则表达式非法)</p>
</li>
</ol>
<p>Implementation:</p>
<p>简单版本：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">isValid</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
    stack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> ch <span class="token keyword">in</span> s<span class="token punctuation">:</span>
        <span class="token keyword">if</span> ch <span class="token keyword">in</span> <span class="token punctuation">[</span><span class="token string">'('</span><span class="token punctuation">,</span> <span class="token string">'['</span><span class="token punctuation">,</span> <span class="token string">'{'</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
            stack<span class="token punctuation">.</span>append<span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
        <span class="token keyword">else</span><span class="token punctuation">:</span>
            <span class="token comment"># for the case "]"</span>
            <span class="token keyword">if</span> stack <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
            <span class="token keyword">if</span> ch <span class="token operator">==</span> <span class="token string">')'</span> <span class="token keyword">and</span> stack<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token string">'('</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
            <span class="token keyword">if</span> ch <span class="token operator">==</span> <span class="token string">']'</span> <span class="token keyword">and</span> stack<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token string">'['</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
            <span class="token keyword">if</span> ch <span class="token operator">==</span> <span class="token string">'}'</span> <span class="token keyword">and</span> stack<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token string">'{'</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
            stack<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> stack <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>优化版本，基本思路一致：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">isValid</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> s<span class="token punctuation">:</span> <span class="token builtin">str</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
    stack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    mapping <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"]"</span><span class="token punctuation">:</span><span class="token string">"["</span><span class="token punctuation">,</span> <span class="token string">"}"</span><span class="token punctuation">:</span><span class="token string">"{"</span><span class="token punctuation">,</span> <span class="token string">")"</span><span class="token punctuation">:</span><span class="token string">"("</span><span class="token punctuation">}</span>

    <span class="token keyword">for</span> ch <span class="token keyword">in</span> s<span class="token punctuation">:</span>
        <span class="token keyword">if</span> ch <span class="token keyword">in</span> mapping<span class="token punctuation">.</span>keys<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token comment"># 右括号，进行判断</span>
            <span class="token keyword">if</span> stack <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
            <span class="token keyword">if</span> stack<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> mapping<span class="token punctuation">[</span>ch<span class="token punctuation">]</span><span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">False</span>
        <span class="token keyword">else</span><span class="token punctuation">:</span>
            stack<span class="token punctuation">.</span>append<span class="token punctuation">(</span>ch<span class="token punctuation">)</span> <span class="token comment"># 左括号，入栈</span>
    <span class="token keyword">return</span> stack <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p><a href="https://github.com/chenweigao/_code/blob/master/cpp/stack_valid_parenttheses.cpp" target="_blank" rel="noopener noreferrer">Solution of C++<ExternalLinkIcon/></a></p>
<p>Explaination:</p>
<ul>
<li>我们遍历字符串 s, 遇到左括号则入栈，遇到右括号 (keys) 则弹出栈顶元素进行比较（在栈非空的前提下）</li>
<li>最终返回值：栈空则合法，等价于 <code>return stack==[]</code></li>
</ul>
<h3 id="validate-stack-sequence" tabindex="-1"><a class="header-anchor" href="#validate-stack-sequence" aria-hidden="true">#</a> Validate Stack Sequence</h3>
<p>给定入栈和出栈序列，判断是否合法：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">validateStackSequences</span><span class="token punctuation">(</span>pushed<span class="token punctuation">:</span> <span class="token string">'List[int]'</span><span class="token punctuation">,</span> popped<span class="token punctuation">:</span> <span class="token string">'List[int]'</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
    i <span class="token operator">=</span> <span class="token number">0</span>
    stack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> x <span class="token keyword">in</span> pushed<span class="token punctuation">:</span>
        stack<span class="token punctuation">.</span>append<span class="token punctuation">(</span>x<span class="token punctuation">)</span>
        <span class="token keyword">while</span> stack <span class="token keyword">and</span> i <span class="token operator">&lt;</span> <span class="token builtin">len</span><span class="token punctuation">(</span>popped<span class="token punctuation">)</span> <span class="token keyword">and</span> stack<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">==</span> popped<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">:</span>
            stack<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
            i <span class="token operator">+=</span> <span class="token number">1</span>
    <span class="token keyword">return</span> stack <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token comment"># returen i == len(poped)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>注意到我们不改变 <code>pushed</code> 和 <code>poped</code>, 而是使用一个 <code>stack = []</code> 作为辅助操作。</p>
<p>当没有找到与 <code>stack</code> 栈顶元素相等的元素时，不停地往 <code>stack</code> 中添加元素，</p>
<h3 id="next-greater-element" tabindex="-1"><a class="header-anchor" href="#next-greater-element" aria-hidden="true">#</a> Next Greater Element</h3>
<p><a href="https://leetcode.com/problems/next-greater-element-i/" target="_blank" rel="noopener noreferrer">https://leetcode.com/problems/next-greater-element-i/<ExternalLinkIcon/></a></p>
<p>这道题目的大意是给定两个 List, 比如：</p>
<p><code>find_nums</code>: [4, 1, 2], <code>nums</code>:      [1, 3, 4, 2]</p>
<p>需要找出 <code>nums</code> 中 <code>find_nums</code> 对应的下一个比它大的元素，未找到就返回 -1, 在这个例子中的结果是：</p>
<p><code>res</code>:       [-1, 3, -1]</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">nextGreaterElement</span><span class="token punctuation">(</span>find_nums<span class="token punctuation">,</span> nums<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># [4, 1, 2]</span>
    <span class="token comment"># [1, 3, 4, 2]</span>
    <span class="token comment"># [-1, 3, -1]</span>

    stack <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    dic <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

    <span class="token keyword">for</span> num <span class="token keyword">in</span> nums<span class="token punctuation">:</span>
        <span class="token keyword">while</span> stack <span class="token operator">!=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">and</span> stack<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span> num<span class="token punctuation">:</span>
            dic<span class="token punctuation">[</span>stack<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">=</span> num
            stack<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
        stack<span class="token punctuation">.</span>append<span class="token punctuation">(</span>num<span class="token punctuation">)</span>

    res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> find_num <span class="token keyword">in</span> find_nums<span class="token punctuation">:</span>
        res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>dic<span class="token punctuation">.</span>get<span class="token punctuation">(</span>find_num<span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>当栈顶元素小于 <code>num</code> 时，在字典中添加栈顶元素, <code>num</code> 表示栈顶元素的 next greater element 是 <code>num</code></p>
<p><code>stack</code> 在上述例子中的顺序变化为：[1] -&gt; [3] -&gt; [4] -&gt; [4, 2]</p>
<p><code>dic</code> 为 {1: 3, 3: 4}</p>
<h3 id="用两个栈实现一个队列" tabindex="-1"><a class="header-anchor" href="#用两个栈实现一个队列" aria-hidden="true">#</a> 用两个栈实现一个队列</h3>
<p>这是面试中的经典问题，应当熟练掌握。</p>
<p><a href="https://leetcode.com/problems/implement-queue-using-stacks/" target="_blank" rel="noopener noreferrer">Leetcode 232<ExternalLinkIcon/></a></p>
<p>所谓两个栈实现一个队列，应当是指实现队列的 <strong>尾插</strong> 和 <strong>头删</strong> 两个操作。</p>
<p>我们定义两个栈 S1 和 S2：</p>
<ul>
<li>S1：只进行插入数据</li>
<li>S2：删除 S1 中的数据</li>
</ul>
<p>！注意 S2 不为空时不要从 S1 中添加数据，类似于下图三的情况。</p>
<p><img src="/stack_queue.jpg" alt="stcak_queue" loading="lazy"></p>
<p>代码实现如下，思路就是使用两个栈，一个做插入，一个做删除：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># -*- coding:utf-8 -*-</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>s1 <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        self<span class="token punctuation">.</span>s2 <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">def</span> <span class="token function">push</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>s1<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">pop</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> self<span class="token punctuation">.</span>s2 <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
            <span class="token keyword">while</span> self<span class="token punctuation">.</span>s1<span class="token punctuation">:</span>
                self<span class="token punctuation">.</span>s2<span class="token punctuation">.</span>append<span class="token punctuation">(</span>self<span class="token punctuation">.</span>s1<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token keyword">return</span> self<span class="token punctuation">.</span>s2<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>s2<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="用两个队列实现一个栈" tabindex="-1"><a class="header-anchor" href="#用两个队列实现一个栈" aria-hidden="true">#</a> 用两个队列实现一个栈</h3>
<h3 id="括号匹配" tabindex="-1"><a class="header-anchor" href="#括号匹配" aria-hidden="true">#</a> 括号匹配</h3>
<h3 id="后缀表达式" tabindex="-1"><a class="header-anchor" href="#后缀表达式" aria-hidden="true">#</a> 后缀表达式</h3>
</template>
