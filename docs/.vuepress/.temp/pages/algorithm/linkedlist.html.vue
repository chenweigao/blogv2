<template><h2 id="linked-list" tabindex="-1"><a class="header-anchor" href="#linked-list" aria-hidden="true">#</a> Linked List</h2>
<h3 id="reverse-linked-list" tabindex="-1"><a class="header-anchor" href="#reverse-linked-list" aria-hidden="true">#</a> Reverse Linked List</h3>
<ul>
<li>Iterative method</li>
</ul>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">reverseList</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> head<span class="token punctuation">)</span><span class="token punctuation">:</span>

    preNode <span class="token operator">=</span> <span class="token boolean">None</span>
    curNode <span class="token operator">=</span> head

    <span class="token keyword">while</span> curNode <span class="token keyword">is</span> <span class="token keyword">not</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token builtin">next</span> <span class="token operator">=</span> curNode<span class="token punctuation">.</span><span class="token builtin">next</span>
        curNode<span class="token punctuation">.</span><span class="token builtin">next</span> <span class="token operator">=</span> preNode
        preNode <span class="token operator">=</span> curNode
        curNode <span class="token operator">=</span> <span class="token builtin">next</span>

    <span class="token keyword">return</span> preNode
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><ul>
<li>Recursive method</li>
</ul>
<ol>
<li>Divide the list in two parts - first node and rest of the linked list.</li>
<li>Call reverse for the rest of the linked list.</li>
<li>Link rest to first.</li>
<li>Fix head pointer</li>
</ol>
<p>由于迭代较快，故建议经常使用迭代法。</p>
<h3 id="intersection-of-linked-list" tabindex="-1"><a class="header-anchor" href="#intersection-of-linked-list" aria-hidden="true">#</a> Intersection of Linked List</h3>
<p>判断两个链表是否有交叉(Intersection), LC160.</p>
<p>实现思路有：</p>
<ul>
<li>根据链表是否有环判断</li>
</ul>
<p>先遍历一个链表找到其尾部，然后将尾部的 next 指针指向另一个链表，这样子两个链表就合成了一个链表，判断原来的两个链表是否有交叉也就变成了判断一个<strong>单链表是否有环</strong>。</p>
<p>找出交点的方法是，遍历两个链表，长度较长的链表指针向后移动 |len1 - len2| 个单位，然后开始遍历两个链表，判断节点是否相等（节点的地址）。</p>
<ul>
<li>根据总结的规律判断</li>
</ul>
<p>该方法比较巧妙，代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">getIntersectionNode</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> headA<span class="token punctuation">,</span> headB<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> headA <span class="token keyword">is</span> <span class="token boolean">None</span> <span class="token keyword">or</span> headB <span class="token keyword">is</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token boolean">None</span>

    pa <span class="token operator">=</span> headA
    pb <span class="token operator">=</span> headB

    <span class="token keyword">while</span> pa <span class="token keyword">is</span> <span class="token keyword">not</span> pb<span class="token punctuation">:</span>
        pa <span class="token operator">=</span> headB <span class="token keyword">if</span> pa <span class="token keyword">is</span> <span class="token boolean">None</span> <span class="token keyword">else</span> pa<span class="token punctuation">.</span><span class="token builtin">next</span>
        pb <span class="token operator">=</span> headA <span class="token keyword">if</span> pb <span class="token keyword">is</span> <span class="token boolean">None</span> <span class="token keyword">else</span> pb<span class="token punctuation">.</span><span class="token builtin">next</span>

    <span class="token keyword">return</span> pa
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>核心思路在于，同时遍历两个链表，如果到链表结束，则将指针指向另一个链表，遍历直到两个移动的指针相等。</p>
<div class="custom-container tip"><p class="custom-container-title">判断单链表是否有环</p>
<p>一般判断单链表是否有环的方法是设置一块一慢两个指针，看其是否会相等。</p>
</div>
<h2 id="implement-lru" tabindex="-1"><a class="header-anchor" href="#implement-lru" aria-hidden="true">#</a> Implement LRU</h2>
<p>LRU 为最近最少使用算法，常常用于缓存技术中，其实现方式为<strong>循环双向链表</strong>，实现思想为：</p>
<p>将 chche 的所有位置都用双向链表链接起来，当一个位置被命中以后，将该位置指向链表头的位置，新加入的 chche 直接加到链表头中。</p>
<p>这样，在多次进行 cache 操作后，最近被命中的，就会被向链表头方向移动，而没被命中的向链表后面移动。</p>
<p>缓存已满的时候新加入的数据节点插入链表头部，而删除链表的尾节点。</p>
<p>具体的实现代码可以<a href="https://github.com/chenweigao/_code/blob/30551f4e92dab06e127be316cd2f3950eda099ef/LeetCode/LC146_LRU_cache_double_linked_list.py" target="_blank" rel="noopener noreferrer">参考 GitHub<ExternalLinkIcon/></a></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">LRUCache</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> capacity<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>capacity <span class="token operator">=</span> capacity
        seld<span class="token punctuation">.</span>dic <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        self<span class="token punctuation">.</span>head <span class="token operator">=</span> Node<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>tail <span class="token operator">=</span> Node<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token builtin">next</span> <span class="token operator">=</span> self<span class="token punctuation">.</span>tail
        self<span class="token punctuation">.</span>tail<span class="token punctuation">.</span>prev <span class="token operator">=</span> self<span class="token punctuation">.</span>head
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>思路是初始化一个 <code>dict</code> 用于存储，对双向链表进行操作的同时对这个 <code>dict</code> 进行赋值操作，<code>dict</code> 的结构为：</p>
<ul>
<li>
<p>key: LRUCache 中的 key</p>
</li>
<li>
<p>value: 一个 <code>Node</code> 类型的节点，存储其 <code>prev</code> 和 <code>next</code> 信息以及最关键的 <code>value</code></p>
</li>
</ul>
<p>其 <code>put()</code> 方法为：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">put</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> key<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> key <span class="token keyword">in</span> self<span class="token punctuation">.</span>dic<span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>_remove<span class="token punctuation">(</span>dic<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span>
    n <span class="token operator">=</span> Node<span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span>
    self<span class="token punctuation">.</span>_add<span class="token punctuation">(</span>n<span class="token punctuation">)</span>
    self<span class="token punctuation">.</span>dic<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> n
    <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>dic<span class="token punctuation">)</span> <span class="token operator">></span> self<span class="token punctuation">.</span>capacity<span class="token punctuation">:</span>
        first_node <span class="token operator">=</span> self<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token builtin">next</span>
        self<span class="token punctuation">.</span>_remove<span class="token punctuation">(</span>first_node<span class="token punctuation">)</span>
        <span class="token keyword">del</span> self<span class="token punctuation">.</span>dic<span class="token punctuation">[</span>first_node<span class="token punctuation">.</span>key<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>然后使用双向链表的操作进行插入（尾插）和删除（第一个节点）</p>
<p>也可以使用 Python 中的 <code>collection.OrderedDict</code> 来进行存储，使用其 <code>move_to_end()</code> 和 <code>popitem()</code> 方法，具体代码可以<a href="https://github.com/chenweigao/_code/blob/30551f4e92dab06e127be316cd2f3950eda099ef/LeetCode/LC146_LRU_ordereddic.py" target="_blank" rel="noopener noreferrer">参考这里<ExternalLinkIcon/></a></p>
</template>
