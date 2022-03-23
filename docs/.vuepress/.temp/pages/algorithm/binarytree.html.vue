<template><h2 id="preorder-traversal" tabindex="-1"><a class="header-anchor" href="#preorder-traversal" aria-hidden="true">#</a> Preorder Traversal</h2>
<h3 id="多叉树的前序遍历" tabindex="-1"><a class="header-anchor" href="#多叉树的前序遍历" aria-hidden="true">#</a> 多叉树的前序遍历</h3>
<p>多叉树的前序遍历，给定多叉树，用数组表示：<code>root = [1,null,3,2,4,null,5,6]</code>, 每个层级之间用 <code>null</code> 进行隔离，根据这个输出这棵树的前序遍历结果。</p>
<p>题目中提到了，<strong>递归</strong>的方法比较简单，希望我们用<strong>迭代</strong>的方法进行求解。</p>
<p>题目链接如下：<a href="https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/" target="_blank" rel="noopener noreferrer">LC589 N 叉树的前序遍历<ExternalLinkIcon/></a></p>
<p>需要遍历的多叉树数据结构定义如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Node</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> val<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">,</span> children<span class="token operator">=</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>val <span class="token operator">=</span> val
        self<span class="token punctuation">.</span>children <span class="token operator">=</span> children
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="递归法" tabindex="-1"><a class="header-anchor" href="#递归法" aria-hidden="true">#</a> 递归法</h4>
<p>递归法的实现如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">preorder</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> <span class="token string">'Node'</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>root<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
        <span class="token keyword">return</span> res

    <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> <span class="token string">'Node'</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">None</span>

        res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>root<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
        <span class="token keyword">for</span> child <span class="token keyword">in</span> root<span class="token punctuation">.</span>children<span class="token punctuation">:</span>
            self<span class="token punctuation">.</span>dfs<span class="token punctuation">(</span>child<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>我们定义一个 <code>res</code> 用于存储最终结果，然后先遍历 <code>root</code>, 再遍历 <code>root</code> 所有的子节点，因为存储的时候按照从左到右的顺序存储，因此这种遍历是可以达到前序遍历的效果的。</p>
<h4 id="迭代法" tabindex="-1"><a class="header-anchor" href="#迭代法" aria-hidden="true">#</a> 迭代法</h4>
<p>前序遍历的迭代，要求根-左-右的顺序返回各个节点，我们给出迭代的解法如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">preorder</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> <span class="token string">'Node'</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> List<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> root <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        
        stack <span class="token operator">=</span> <span class="token punctuation">[</span>root<span class="token punctuation">]</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token keyword">while</span> stack<span class="token punctuation">:</span>
            node <span class="token operator">=</span> stack<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span> node <span class="token keyword">is</span> <span class="token keyword">not</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
                res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
                <span class="token comment"># 栈顶元素是左侧元素</span>
                stack<span class="token punctuation">.</span>extend<span class="token punctuation">(</span>node<span class="token punctuation">.</span>children<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
            
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>我们仔细研究一下，这个迭代中有几个关键点：</p>
<ol>
<li>使用了<strong>栈</strong></li>
<li>把 node 的 children 逆序入栈，保证了先出栈的元素一定是最左侧的</li>
</ol>
<p>多多理解，十分巧妙！</p>
<h3 id="二叉树的前序遍历" tabindex="-1"><a class="header-anchor" href="#二叉树的前序遍历" aria-hidden="true">#</a> 二叉树的前序遍历</h3>
<h4 id="递归法-1" tabindex="-1"><a class="header-anchor" href="#递归法-1" aria-hidden="true">#</a> 递归法</h4>
<p>@todo</p>
<h4 id="迭代法-1" tabindex="-1"><a class="header-anchor" href="#迭代法-1" aria-hidden="true">#</a> 迭代法</h4>
<p>@todo</p>
<h2 id="level-order-traversal" tabindex="-1"><a class="header-anchor" href="#level-order-traversal" aria-hidden="true">#</a> Level Order Traversal</h2>
<h3 id="二叉树的层次遍历" tabindex="-1"><a class="header-anchor" href="#二叉树的层次遍历" aria-hidden="true">#</a> 二叉树的层次遍历</h3>
<p><a href="https://leetcode.com/problems/binary-tree-level-order-traversal/" target="_blank" rel="noopener noreferrer">LC102 - Binary Tree Level Order Traversal<ExternalLinkIcon/></a></p>
<p>代码实现如下：</p>
<p><a href="https://github.com/chenweigao/_code/blob/master/python/binary_tree.py" target="_blank" rel="noopener noreferrer">Code GitHub - binary_tree<ExternalLinkIcon/></a></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">levelOrder</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">'''
    二叉树的层次遍历
    '''</span>
    <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>root<span class="token punctuation">.</span>data<span class="token punctuation">]</span><span class="token punctuation">]</span>  <span class="token comment"># 存储层次遍历的结果</span>
    current <span class="token operator">=</span> <span class="token punctuation">[</span>root<span class="token punctuation">]</span>  <span class="token comment"># 存储当前层次内的节点，在循环里面更新</span>

    <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>
        node_list <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>  <span class="token comment"># 临时存储节点</span>
        <span class="token keyword">for</span> node <span class="token keyword">in</span> current<span class="token punctuation">:</span>  <span class="token comment"># 循环内遍历</span>
            <span class="token keyword">if</span> node<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
                node_list<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>left<span class="token punctuation">)</span>
            <span class="token keyword">if</span> node<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
                node_list<span class="token punctuation">.</span>append<span class="token punctuation">(</span>node<span class="token punctuation">.</span>right<span class="token punctuation">)</span>
        <span class="token keyword">if</span> node_list <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">:</span>
            <span class="token keyword">break</span>
        vals <span class="token operator">=</span> <span class="token punctuation">[</span>node<span class="token punctuation">.</span>data <span class="token keyword">for</span> node <span class="token keyword">in</span> node_list<span class="token punctuation">]</span>  <span class="token comment"># 拿出当前层次的节点的值</span>
        result<span class="token punctuation">.</span>append<span class="token punctuation">(</span>vals<span class="token punctuation">)</span>
        current <span class="token operator">=</span> node_list  <span class="token comment"># 更新层次</span>
    <span class="token keyword">return</span> result
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>这是目前可以写出的比较高效的一个算法，应当牢记。</p>
<h2 id="inorder-traversal" tabindex="-1"><a class="header-anchor" href="#inorder-traversal" aria-hidden="true">#</a> Inorder Traversal</h2>
<h3 id="二叉树的中序遍历" tabindex="-1"><a class="header-anchor" href="#二叉树的中序遍历" aria-hidden="true">#</a> 二叉树的中序遍历</h3>
<h4 id="递归法-2" tabindex="-1"><a class="header-anchor" href="#递归法-2" aria-hidden="true">#</a> 递归法</h4>
<p>二叉树的中序遍历递归解法参考如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>root<span class="token punctuation">:</span> Optional<span class="token punctuation">[</span>TreeNode<span class="token punctuation">]</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
        <span class="token keyword">return</span>
    dfs<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
    res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>root<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
    dfs<span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h4 id="迭代法-2" tabindex="-1"><a class="header-anchor" href="#迭代法-2" aria-hidden="true">#</a> 迭代法</h4>
<p>@todo</p>
<h2 id="trie-前缀树" tabindex="-1"><a class="header-anchor" href="#trie-前缀树" aria-hidden="true">#</a> Trie 前缀树</h2>
<p>@todo 实现前缀树</p>
<p>https://leetcode-cn.com/problems/implement-trie-prefix-tree/solution/shi-xian-trie-qian-zhui-shu-by-leetcode-ti500/</p>
<h2 id="bst" tabindex="-1"><a class="header-anchor" href="#bst" aria-hidden="true">#</a> BST</h2>
<p><a href="https://www.geeksforgeeks.org/advantages-of-bst-over-hash-table/" target="_blank" rel="noopener noreferrer">Advantages of BST(Binary Search Tree) over Hash Table<ExternalLinkIcon/></a></p>
<ul>
<li>We can get all keys in sorted order by just doing Inorder Traversal of BST.</li>
<li>Doing order statistics, finding closest lower and greater elements, doing range queries are easy to do with BSTs.</li>
<li>BSTs are easy to implement compared to hashing, we can easily implement our own customized BST.</li>
<li>...</li>
<li>Hash table supports following operations in Θ(1) time: <strong>search insert and delete</strong>, BST is O(logn) for these operation.</li>
</ul>
<h3 id="bst-中序遍历" tabindex="-1"><a class="header-anchor" href="#bst-中序遍历" aria-hidden="true">#</a> BST 中序遍历</h3>
<p><a href="https://github.com/chenweigao/_code/blob/master/data_struct/BST_inorder.py" target="_blank" rel="noopener noreferrer">解法参考代码<ExternalLinkIcon/></a>:</p>
<p>Recursive</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">inorderTraversal</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        self<span class="token punctuation">.</span>inorder<span class="token punctuation">(</span>root<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
        <span class="token keyword">return</span> res

    <span class="token keyword">def</span> <span class="token function">inorder</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">,</span> res<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span>
        <span class="token keyword">if</span> root<span class="token punctuation">.</span>left<span class="token punctuation">:</span>
            self<span class="token punctuation">.</span>inorder<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
        res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>root<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
        <span class="token keyword">if</span> root<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
            self<span class="token punctuation">.</span>inorder<span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h4 id="lc653-两数之和-iv-输入-bst" tabindex="-1"><a class="header-anchor" href="#lc653-两数之和-iv-输入-bst" aria-hidden="true">#</a> LC653 两数之和 IV - 输入 BST</h4>
<blockquote>
<p>给定一个二叉搜索树 root 和一个目标结果 k，如果 BST 中存在两个元素且它们的和等于给定的目标结果，则返回 true。</p>
</blockquote>
<p>这个题目需要用到二叉搜索树和两数之和解法的一些特性：</p>
<ol>
<li>二叉搜索树中序遍历出的结果是有序的（左根右）</li>
<li>两数之和问题可以使用双指针来求解，或者使用 hash map</li>
</ol>
<h5 id="解法1-dfs-hash-map" tabindex="-1"><a class="header-anchor" href="#解法1-dfs-hash-map" aria-hidden="true">#</a> 解法1：DFS + hash map</h5>
<p>这个解法的核心思路就是，把这个 BST 当作普通的二叉树处理，然后使用 hash map 记录元素出现的个数，比较直观的解法，其实现代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>dic <span class="token operator">=</span> collections<span class="token punctuation">.</span>defaultdict<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">findTarget</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> Optional<span class="token punctuation">[</span>TreeNode<span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">False</span>

        <span class="token keyword">if</span> k <span class="token operator">-</span> root<span class="token punctuation">.</span>val <span class="token keyword">in</span> self<span class="token punctuation">.</span>dic<span class="token punctuation">.</span>keys<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token boolean">True</span>

        self<span class="token punctuation">.</span>dic<span class="token punctuation">[</span>root<span class="token punctuation">.</span>val<span class="token punctuation">]</span> <span class="token operator">+=</span> <span class="token number">1</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>findTarget<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">,</span> k<span class="token punctuation">)</span> <span class="token keyword">or</span> self<span class="token punctuation">.</span>findTarget<span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">,</span> k<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h5 id="解法2-中序遍历-双指针" tabindex="-1"><a class="header-anchor" href="#解法2-中序遍历-双指针" aria-hidden="true">#</a> 解法2：中序遍历 + 双指针</h5>
<p>由于我们知道 BST 的中序遍历出来的结果是升序的，所以说我们可以把中序遍历的结果保存起来，然后用双指针去找，看有没有结果。</p>
<p>在此复习一下二叉树的中序遍历，中序遍历的解法可以看上文总结。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">findTarget</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> Optional<span class="token punctuation">[</span>TreeNode<span class="token punctuation">]</span><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bool</span><span class="token punctuation">:</span>
        <span class="token comment"># 中序遍历 BST</span>
        res <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

        <span class="token keyword">def</span> <span class="token function">dfs</span><span class="token punctuation">(</span>root<span class="token punctuation">:</span> Optional<span class="token punctuation">[</span>TreeNode<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
                <span class="token keyword">return</span>
            dfs<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">)</span>
            res<span class="token punctuation">.</span>append<span class="token punctuation">(</span>root<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
            dfs<span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">)</span>

        dfs<span class="token punctuation">(</span>root<span class="token punctuation">,</span> res<span class="token punctuation">)</span>
        <span class="token comment"># 此时 res 已经是升序了，我们使用双指针</span>
        l<span class="token punctuation">,</span> r <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token comment"># 这边 while l &lt; r 也可以</span>
        <span class="token keyword">while</span> l <span class="token operator">!=</span> r<span class="token punctuation">:</span>
            <span class="token keyword">if</span> res<span class="token punctuation">[</span>l<span class="token punctuation">]</span> <span class="token operator">+</span> res<span class="token punctuation">[</span>r<span class="token punctuation">]</span> <span class="token operator">==</span> k<span class="token punctuation">:</span>
                <span class="token keyword">return</span> <span class="token boolean">True</span>
            <span class="token keyword">elif</span> res<span class="token punctuation">[</span>l<span class="token punctuation">]</span> <span class="token operator">+</span> res<span class="token punctuation">[</span>r<span class="token punctuation">]</span> <span class="token operator">></span> k<span class="token punctuation">:</span>
                r <span class="token operator">-=</span> <span class="token number">1</span>
            <span class="token keyword">else</span><span class="token punctuation">:</span>
                l <span class="token operator">+=</span> <span class="token number">1</span>

        <span class="token keyword">return</span> <span class="token boolean">False</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h5 id="解法3-迭代-双指针" tabindex="-1"><a class="header-anchor" href="#解法3-迭代-双指针" aria-hidden="true">#</a> 解法3：迭代 + 双指针</h5>
<p>这个解法不再需要额外的空间消耗，比较不错。</p>
<p>@todo</p>
<h2 id="二叉树例题" tabindex="-1"><a class="header-anchor" href="#二叉树例题" aria-hidden="true">#</a> 二叉树例题</h2>
<h3 id="lc606-根据二叉树创建字符串-前序遍历" tabindex="-1"><a class="header-anchor" href="#lc606-根据二叉树创建字符串-前序遍历" aria-hidden="true">#</a> LC606 根据二叉树创建字符串（前序遍历）</h3>
<p>https://leetcode-cn.com/problems/construct-string-from-binary-tree/</p>
<p>题目的大概意思是，前序遍历二叉树，但是给每个子节点都用括号包裹起来，如果子节点是空的话，就不用括号。是一道简单题。</p>
<p>这道题目的核心难点在于，如何包裹。解法给出了一个<strong>讨论情况然后分别处理</strong>的方法：</p>
<ol>
<li>左右节点都没有了，返回；</li>
<li>左节点有，右节点没有，左节点包裹后继续递归；</li>
<li>左节点没有，右节点有，左节点用空括号（题目要求），右节点递归</li>
<li>左右节点都有，都递归</li>
</ol>
<p>其实现方式如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">tree2str</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> root<span class="token punctuation">:</span> Optional<span class="token punctuation">[</span>TreeNode<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">str</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">:</span>
            <span class="token keyword">return</span> <span class="token string">''</span>
        
        res <span class="token operator">=</span> <span class="token builtin">str</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>val<span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token keyword">not</span> root<span class="token punctuation">.</span>left <span class="token keyword">and</span> <span class="token keyword">not</span> root<span class="token punctuation">.</span>right<span class="token punctuation">:</span>
            <span class="token keyword">return</span> res

        left <span class="token operator">=</span> self<span class="token punctuation">.</span>tree2str<span class="token punctuation">(</span>root<span class="token punctuation">.</span>left<span class="token punctuation">)</span>
        right <span class="token operator">=</span> self<span class="token punctuation">.</span>tree2str<span class="token punctuation">(</span>root<span class="token punctuation">.</span>right<span class="token punctuation">)</span>

        res <span class="token operator">+=</span> <span class="token string">'('</span> <span class="token operator">+</span> left <span class="token operator">+</span> <span class="token string">')'</span>
        <span class="token keyword">if</span> right<span class="token punctuation">:</span>
            res <span class="token operator">+=</span> <span class="token string">'('</span> <span class="token operator">+</span> right <span class="token operator">+</span> <span class="token string">')'</span>

        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h3 id="lc101-对称二叉树" tabindex="-1"><a class="header-anchor" href="#lc101-对称二叉树" aria-hidden="true">#</a> LC101 对称二叉树</h3>
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
<h3 id="lc101-对称二叉树-2刷" tabindex="-1"><a class="header-anchor" href="#lc101-对称二叉树-2刷" aria-hidden="true">#</a> LC101 对称二叉树（2刷）</h3>
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
<h3 id="lc111-二叉树的最小深度" tabindex="-1"><a class="header-anchor" href="#lc111-二叉树的最小深度" aria-hidden="true">#</a> LC111 二叉树的最小深度</h3>
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
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h3 id="lc104-二叉树的最大深度" tabindex="-1"><a class="header-anchor" href="#lc104-二叉树的最大深度" aria-hidden="true">#</a> LC104 二叉树的最大深度</h3>
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
<h3 id="lc104-二叉树的最大深度-2刷" tabindex="-1"><a class="header-anchor" href="#lc104-二叉树的最大深度-2刷" aria-hidden="true">#</a> LC104 二叉树的最大深度（2刷）</h3>
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
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div></template>
