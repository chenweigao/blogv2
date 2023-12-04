import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as c,c as p,a as e,b as n,d as a,f as r}from"./app-22cda79c.js";const l={},i=e("h1",{id:"effective-python",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#effective-python","aria-hidden":"true"},"#"),n(" Effective Python")],-1),d=e("h2",{id:"function-closure",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#function-closure","aria-hidden":"true"},"#"),n(" Function Closure")],-1),u={href:"https://github.com/chenweigao/_code/blob/master/Effective_Python/EP15.py",target:"_blank",rel:"noopener noreferrer"},k=r(`<div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">sort_priority</span><span class="token punctuation">(</span>values<span class="token punctuation">,</span> group<span class="token punctuation">)</span><span class="token punctuation">:</span>
    found <span class="token operator">=</span> <span class="token boolean">False</span>

    <span class="token keyword">def</span> <span class="token function">helper</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">nonlocal</span> found
        <span class="token keyword">if</span> x <span class="token keyword">in</span> group<span class="token punctuation">:</span>
            found <span class="token operator">=</span> <span class="token boolean">True</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> x<span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> x<span class="token punctuation">)</span>
    values<span class="token punctuation">.</span>sort<span class="token punctuation">(</span>key<span class="token operator">=</span>helper<span class="token punctuation">)</span>
    <span class="token keyword">return</span> found
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码把 <code>helper()</code> 这个闭包函数，传给 <code>sort</code> 方法的 <code>key</code> 参数。</p><p><strong>思考</strong>：第 7 行和第 8 行的 return 的含义？</p><h2 id="generator" tabindex="-1"><a class="header-anchor" href="#generator" aria-hidden="true">#</a> Generator</h2>`,4),h={href:"https://github.com/chenweigao/_code/blob/master/Effective_Python/EP16.py",target:"_blank",rel:"noopener noreferrer"},f=e("code",null,"yield",-1),v=e("strong",null,"生成器来改写直接返回列表的函数",-1),_=e("p",null,[n("在这个例子中的错误示例中，使用 "),e("code",null,"append"),n(" 把所有的结果都放在列表里面，如果输入量非常大的话，会导致程序消耗尽内存而奔溃。")],-1);function m(b,y){const s=t("ExternalLinkIcon");return c(),p("div",null,[i,d,e("p",null,[n("("),e("a",u,[n("EP 15"),a(s)]),n(")有的时候需要将重要的消息或者意外的事件优先显示在其他内容前面，可以使用以下代码：")]),k,e("p",null,[n("("),e("a",h,[n("EP 16"),a(s)]),n(")生成器是使用 "),f,n(" 表达式的函数，为了提高编程效率，考虑用"),v,n("。调用生成器时，会返回迭代器。")]),_])}const w=o(l,[["render",m],["__file","effective-python.html.vue"]]);export{w as default};
