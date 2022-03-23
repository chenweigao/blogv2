<template><h2 id="class" tabindex="-1"><a class="header-anchor" href="#class" aria-hidden="true">#</a> Class</h2>
<h3 id="作用域和命名空间" tabindex="-1"><a class="header-anchor" href="#作用域和命名空间" aria-hidden="true">#</a> 作用域和命名空间</h3>
<p>首先来看一个例子，参考文献 P1.1:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">scope_test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">do_local</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        spam <span class="token operator">=</span> <span class="token string">"local spam"</span>

    <span class="token keyword">def</span> <span class="token function">do_nonlocal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">nonlocal</span> spam
        spam <span class="token operator">=</span> <span class="token string">"nonlocal spam"</span>

    <span class="token keyword">def</span> <span class="token function">do_global</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">global</span> spam
        spam <span class="token operator">=</span> <span class="token string">"global spam"</span>

    spam <span class="token operator">=</span> <span class="token string">"test spam"</span>
    do_local<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"After local assignment:"</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span>
    <span class="token comment"># After local assignment: test spam</span>
    do_nonlocal<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"After nonlocal assignment:"</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span>
    <span class="token comment"># After nonlocal assignment: nonlocal spam</span>
    do_global<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"After global assignment:"</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span>
    <span class="token comment"># After global assignment: nonlocal spam</span>
    <span class="token comment"># 这时候还未修改是因为还在执行 scope_test 内部</span>

scope_test<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"In global scope:"</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span>
<span class="token comment"># In global scope: global spam</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p>附上官方的解释：</p>
<blockquote>
<p>请注意 局部 赋值（这是默认状态）不会改变 scope_test 对 spam 的绑定。 nonlocal 赋值会改变 scope_test 对 spam 的绑定，而 global 赋值会改变模块层级的绑定。</p>
<p>您还可以发现在 global 赋值之前没有 spam 的绑定。</p>
</blockquote>
<p>上述代码的理解应该包括一下几点：</p>
<ol>
<li>
<p>当内部作用域想修改外部作用域的变量时，就要用到 <strong>global</strong> 和 <strong>nonlocal</strong> 关键字了。如 <code>do_local()</code> 中的 <code>nolocal</code> 关键字可以成功修改 <em>spam(&quot;test spam&quot;)</em>  的值。</p>
<p>举例而言：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment">#!/usr/bin/python3</span>

<span class="token keyword">def</span> <span class="token function">outer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    num <span class="token operator">=</span> <span class="token number">10</span>
    <span class="token keyword">def</span> <span class="token function">inner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">nonlocal</span> num   <span class="token comment"># nonlocal关键字声明</span>
        num <span class="token operator">=</span> <span class="token number">100</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>     <span class="token comment"># 100, nonlocal 关键字修改了函数 outer 内部的 num 变量</span>
    inner<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>         <span class="token comment"># 100</span>
outer<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div></li>
<li>
<p><code>global</code> 关键字一般是用来修改函数外部的变量（全局变量）。</p>
<p>举例而言：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment">#!/usr/bin/python3</span>

num <span class="token operator">=</span> <span class="token number">1</span>
<span class="token keyword">def</span> <span class="token function">fun1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">global</span> num  <span class="token comment"># 需要使用 global 关键字声明</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>  <span class="token comment"># 取到全局变量 1</span>
    num <span class="token operator">=</span> <span class="token number">123</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>  <span class="token comment"># 123 成功给全局变量赋值</span>
fun1<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>      <span class="token comment"># 123 全局变量值被修改</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>上面的 <code>scope_test()</code> 执行后，才修改到了函数外部的全局变量。</p>
</li>
</ol>
<div class="custom-container tip"><p class="custom-container-title">LEGB</p>
<p>虽然作用域是静态地确定的，但它们会被动态地使用。 在执行期间的任何时刻，会有 3 或 4 个命名空间可被直接访问的嵌套作用域:</p>
<ul>
<li>Local: 最先搜索的最内部作用域包含局部名称</li>
<li>Encrosing: 从最近的封闭作用域开始搜索的任何封闭函数的作用域包含非局部名称，也包括非全局名称</li>
<li>Global: 倒数第二个作用域包含当前模块的全局名称</li>
<li>Built-in: 最外面的作用域（最后搜索）是包含内置名称的命名空间</li>
</ul>
</div>
<h3 id="self" tabindex="-1"><a class="header-anchor" href="#self" aria-hidden="true">#</a> self</h3>
<blockquote>
<p>方法的特殊之处就在于实例对象会作为函数的第一个参数被传入。 在我们的示例中，调用 x.f() 其实就相当于 MyClass.f(x)。 总之，调用一个具有 n 个参数的方法就相当于调用再多一个参数的对应函数，这个参数值为方法所属实例对象，位置在其他参数之前。</p>
<p>方法的第一个参数常常被命名为 self。 这也不过就是一个约定: self 这一名称在 Python 中绝对没有特殊含义。</p>
</blockquote>
<h3 id="给类添加迭代器" tabindex="-1"><a class="header-anchor" href="#给类添加迭代器" aria-hidden="true">#</a> 给类添加迭代器</h3>
<p>定义一个 <code>__iter__()</code> 方法来返回一个带有 <code>__next__()</code> 方法的对象。 如果类已定义了 <code>__next__()</code>，则 <code>__iter__()</code> 可以简单地返回 <code>self</code>:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Reverse</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">"""Iterator for looping over a sequence backwards."""</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>data <span class="token operator">=</span> data
        self<span class="token punctuation">.</span>index <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__iter__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> self

    <span class="token keyword">def</span> <span class="token function">__next__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> self<span class="token punctuation">.</span>index <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">:</span>
            <span class="token keyword">raise</span> StopIteration
        self<span class="token punctuation">.</span>index <span class="token operator">=</span> self<span class="token punctuation">.</span>index <span class="token operator">-</span> <span class="token number">1</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>data<span class="token punctuation">[</span>self<span class="token punctuation">.</span>index<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>更优雅的方式是定义一个生成器：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">def</span> <span class="token function">reverse</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">for</span> index <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token builtin">len</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">yield</span> data<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="类方法-classmethod" tabindex="-1"><a class="header-anchor" href="#类方法-classmethod" aria-hidden="true">#</a> 类方法 classmethod</h3>
<p>如果我们想通过类来调用方法，而不是通过实例，那应该怎么办呢？</p>
<p>Python 提供了 <code>classmethod</code> 装饰器让我们实现上述功能，看下面的例子：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    bar <span class="token operator">=</span> <span class="token number">1</span>
    <span class="token decorator annotation punctuation">@classmethod</span>
    <span class="token keyword">def</span> <span class="token function">class_foo</span><span class="token punctuation">(</span>cls<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span> <span class="token string">'Hello, '</span><span class="token punctuation">,</span> cls
        <span class="token keyword">print</span> cls<span class="token punctuation">.</span>bar

<span class="token operator">>></span><span class="token operator">></span> A<span class="token punctuation">.</span>class_foo<span class="token punctuation">(</span><span class="token punctuation">)</span>   <span class="token comment"># 直接通过类来调用方法</span>
Hello<span class="token punctuation">,</span>  <span class="token operator">&lt;</span><span class="token keyword">class</span> <span class="token string">'__main__.A'</span><span class="token operator">></span>
<span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><blockquote>
<p>被 <code>classmethod</code> 装饰的方法由于持有 <code>cls</code> 参数，因此我们可以在方法里面调用类的属性、方法，比如 <code>cls.bar</code>。</p>
</blockquote>
<p>如果在类中增加 <code>__init__</code> 方法，可以看到类直接是无法调用到 <code>__init__</code> 中的属性的：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    bar <span class="token operator">=</span> <span class="token number">1</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>lis <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>

    <span class="token decorator annotation punctuation">@classmethod</span>
    <span class="token keyword">def</span> <span class="token function">class_foo</span><span class="token punctuation">(</span>cls<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'Hello, '</span><span class="token punctuation">,</span> cls<span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>cls<span class="token punctuation">.</span>bar<span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>cla<span class="token punctuation">.</span>lis<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    A<span class="token punctuation">.</span>class_foo<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token operator">>></span><span class="token operator">></span> AttributeError<span class="token punctuation">:</span> <span class="token builtin">type</span> <span class="token builtin">object</span> <span class="token string">'A'</span> has no attribute <span class="token string">'lis'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h3 id="静态方法-staticmethod" tabindex="-1"><a class="header-anchor" href="#静态方法-staticmethod" aria-hidden="true">#</a> 静态方法 staticmethod</h3>
<p>在类中往往有一些方法跟类有关系，但是又不会改变类和实例状态的方法，这种方法是静态方法，我们使用 <code>staticmethod</code> 来装饰。</p>
<div class="custom-container tip"><p class="custom-container-title">Why @staticmethod?</p>
<p>静态方法没有 <code>self</code> 和 <code>cls</code> 参数，可以把它看成是一个普通的函数，我们当然可以把它写到类外面，但这是不推荐的，因为这不利于代码的组织和命名空间的整洁。</p>
</div>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    bar <span class="token operator">=</span> <span class="token number">1</span>

    <span class="token decorator annotation punctuation">@staticmethod</span>
    <span class="token keyword">def</span> <span class="token function">static_foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'Hello, '</span><span class="token punctuation">,</span> A<span class="token punctuation">.</span>bar<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    a <span class="token operator">=</span> A<span class="token punctuation">(</span><span class="token punctuation">)</span>
    a<span class="token punctuation">.</span>static_foo<span class="token punctuation">(</span><span class="token punctuation">)</span>
    A<span class="token punctuation">.</span>static_foo<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token operator">>></span><span class="token operator">></span> Hello<span class="token punctuation">,</span>  <span class="token number">1</span>
<span class="token operator">>></span><span class="token operator">></span> Hello<span class="token punctuation">,</span>  <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><hr>
<p>举一反三，我们对 A 中的 <code>bar</code> 属性能否进行修改呢？从下面例子中可以看出<strong>类属性被修改了</strong>。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    A<span class="token punctuation">.</span>bar <span class="token operator">=</span> <span class="token number">3</span>
    a <span class="token operator">=</span> A<span class="token punctuation">(</span><span class="token punctuation">)</span>
    a<span class="token punctuation">.</span>static_foo<span class="token punctuation">(</span><span class="token punctuation">)</span>

    A<span class="token punctuation">.</span>bar <span class="token operator">=</span> <span class="token number">2</span>
    A<span class="token punctuation">.</span>static_foo<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token operator">>></span><span class="token operator">></span> Hello<span class="token punctuation">,</span>  <span class="token number">3</span>
<span class="token operator">>></span><span class="token operator">></span> Hello<span class="token punctuation">,</span>  <span class="token number">2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="_3-继承与多态" tabindex="-1"><a class="header-anchor" href="#_3-继承与多态" aria-hidden="true">#</a> 3. 继承与多态</h2>
<h3 id="函数继承" tabindex="-1"><a class="header-anchor" href="#函数继承" aria-hidden="true">#</a> 函数继承</h3>
<ol>
<li>
<p>如果子类没有定义自己的初始化函数，那么父类的初始化函数会被默认调用；但是如果这种情况下实例化子类的对象，应该传入父类的初始化参数，否则会报错；</p>
</li>
<li>
<p>如果子类定义了自己的初始化函数，并且没有显式调用父类的初始化函数，则父类的属性不会被初始化；</p>
<p>如果子类定义了自己的初始化函数，并且显式调用了父类的初始化函数，则子类和父类的属性都会被初始化；</p>
</li>
<li>
<p>如果在子类中需要父类的构造方法就需要显式地调用父类的构造方法，或者不重写父类的构造方法。</p>
<p>子类不重写 <strong><strong>init</strong></strong>，实例化子类时，会自动调用父类定义的 <strong><strong>init</strong></strong>。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Father</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>name<span class="token operator">=</span>name
        <span class="token keyword">print</span> <span class="token punctuation">(</span> <span class="token string">"name: %s"</span> <span class="token operator">%</span><span class="token punctuation">(</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Father '</span> <span class="token operator">+</span> self<span class="token punctuation">.</span>name

<span class="token keyword">class</span> <span class="token class-name">Son</span><span class="token punctuation">(</span>Father<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Son '</span><span class="token operator">+</span>self<span class="token punctuation">.</span>name

<span class="token keyword">if</span> __name__<span class="token operator">==</span><span class="token string">'__main__'</span><span class="token punctuation">:</span>
    son<span class="token operator">=</span>Son<span class="token punctuation">(</span><span class="token string">'runoob'</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span> <span class="token punctuation">(</span> son<span class="token punctuation">.</span>getName<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">)</span>

<span class="token comment"># name: runoob</span>
<span class="token comment"># Son runoob</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div></li>
<li>
<p>如果重写了**<strong>init</strong>** 时，实例化子类，就不会调用父类已经定义的 <strong><strong>init</strong></strong>，语法格式如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Father</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>name<span class="token operator">=</span>name
        <span class="token keyword">print</span> <span class="token punctuation">(</span> <span class="token string">"name: %s"</span> <span class="token operator">%</span><span class="token punctuation">(</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Father '</span> <span class="token operator">+</span> self<span class="token punctuation">.</span>name
 
<span class="token keyword">class</span> <span class="token class-name">Son</span><span class="token punctuation">(</span>Father<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span> <span class="token punctuation">(</span> <span class="token string">"hi"</span> <span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span>  name
    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Son '</span><span class="token operator">+</span>self<span class="token punctuation">.</span>name
 
<span class="token keyword">if</span> __name__<span class="token operator">==</span><span class="token string">'__main__'</span><span class="token punctuation">:</span>
    son<span class="token operator">=</span>Son<span class="token punctuation">(</span><span class="token string">'runoob'</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span> <span class="token punctuation">(</span> son<span class="token punctuation">.</span>getName<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">)</span>
    
<span class="token comment"># hi</span>
<span class="token comment"># Son runoob</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div></li>
<li>
<p>如果重写了**<strong>init</strong>** 时，要继承父类的构造方法，可以使用 <strong>super</strong> 关键字：<code>super(子类，self).__init__(参数1，参数2，....)</code> 或者 <code>父类名称.__init__(self,参数1，参数2，...)</code></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Father</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>name<span class="token operator">=</span>name
        <span class="token keyword">print</span> <span class="token punctuation">(</span> <span class="token string">"name: %s"</span> <span class="token operator">%</span><span class="token punctuation">(</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Father '</span> <span class="token operator">+</span> self<span class="token punctuation">.</span>name

<span class="token keyword">class</span> <span class="token class-name">Son</span><span class="token punctuation">(</span>Father<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>Son<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>name<span class="token punctuation">)</span>
        <span class="token keyword">print</span> <span class="token punctuation">(</span><span class="token string">"hi"</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span>  name
    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Son '</span><span class="token operator">+</span>self<span class="token punctuation">.</span>name

<span class="token keyword">if</span> __name__<span class="token operator">==</span><span class="token string">'__main__'</span><span class="token punctuation">:</span>
    son<span class="token operator">=</span>Son<span class="token punctuation">(</span><span class="token string">'runoob'</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span> <span class="token punctuation">(</span> son<span class="token punctuation">.</span>getName<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">)</span>

<span class="token comment"># name: runoob</span>
<span class="token comment"># hi</span>
<span class="token comment"># Son runoob</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>拓展：如下代码可以看出来，子类也通过 <code>super</code> 继承了父类的属性：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Father</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> <span class="token number">10</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"name: %s"</span> <span class="token operator">%</span> <span class="token punctuation">(</span>self<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Father '</span> <span class="token operator">+</span> self<span class="token punctuation">.</span>name


<span class="token keyword">class</span> <span class="token class-name">Son</span><span class="token punctuation">(</span>Father<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>Son<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>name<span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"hi"</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name

    <span class="token keyword">def</span> <span class="token function">getName</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token string">'Son '</span> <span class="token operator">+</span> self<span class="token punctuation">.</span>name <span class="token operator">+</span> <span class="token builtin">str</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>age<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    son <span class="token operator">=</span> Son<span class="token punctuation">(</span><span class="token string">'runoob'</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>son<span class="token punctuation">.</span>getName<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>


<span class="token triple-quoted-string string">"""
name: runoob
hi
Son runoob10
"""</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><blockquote>
<p>在super机制里，可以保证公共父类仅被执行一次，至于执行的顺序，是按照**<a href="https://www.pynote.net/archives/3500" target="_blank" rel="noopener noreferrer">MRO（Method Resolution Order）<ExternalLinkIcon/></a>**方法解析顺序 进行的。</p>
<p>简单理解，MRO顺序就是<strong>代码中的书写顺序</strong></p>
</blockquote>
</li>
</ol>
<h3 id="qa" tabindex="-1"><a class="header-anchor" href="#qa" aria-hidden="true">#</a> QA</h3>
<p>❓❓❓ 子类继承父类时，实例化子类，会调用父类的 <strong>init</strong> 方法吗？</p>
<div class="custom-container warning"><p class="custom-container-title">子类与父类的init</p>
<p>这是我经常混淆的点，可以通过下述的例子来观察，最终的结论是：<strong>不会</strong>。</p>
<p>除非在子类中显式调用 <code>super().__init__</code>, 但是在这种情况下也需要注意 MRO 列表问题。</p>
<p>总结来说：如果子类和父类都有 <code>__init__</code> 初始化方法，子类其实是重写了父类的 <code>__init__</code> 方法，如果不显式调用父类的 <code>__init__</code> 方法，父类的 <code>__init__</code> 方法就不会被执行!</p>
</div>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Animal</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__Animal'</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name

    <span class="token keyword">def</span> <span class="token function">greet</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'Hello, I am %s.'</span> <span class="token operator">%</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">Dog</span><span class="token punctuation">(</span>Animal<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__Dog'</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name

    <span class="token keyword">def</span> <span class="token function">greet</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'WangWang.., I am %s. '</span> <span class="token operator">%</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    dog <span class="token operator">=</span> Dog<span class="token punctuation">(</span><span class="token string">'dog'</span><span class="token punctuation">)</span>
    dog<span class="token punctuation">.</span>greet<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token triple-quoted-string string">""""
>>> __init__Dog
>>> WangWang.., I am dog. 
"""</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><h3 id="继承易错知识点" tabindex="-1"><a class="header-anchor" href="#继承易错知识点" aria-hidden="true">#</a> 继承易错知识点</h3>
<p>看以下代码：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'A'</span><span class="token punctuation">)</span>
        <span class="token keyword">pass</span>


<span class="token keyword">class</span> <span class="token class-name">B</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'B'</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>__init__


<span class="token keyword">class</span> <span class="token class-name">C</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'C'</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>__init__


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    B<span class="token punctuation">(</span><span class="token punctuation">)</span>
    C<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment"># B</span>
<span class="token comment"># C</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><p>我们可以看到，<code>A.__init__</code> 并没有达到调用 A 的效果。正常的调用如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'A'</span><span class="token punctuation">)</span>
        <span class="token keyword">pass</span>


<span class="token keyword">class</span> <span class="token class-name">B</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'B'</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>self<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">C</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'C'</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>self<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    B<span class="token punctuation">(</span><span class="token punctuation">)</span>
    C<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment"># B</span>
<span class="token comment"># A</span>
<span class="token comment"># C</span>
<span class="token comment"># A</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><p>如果使用 super 类的方式调用父类初始化方法，这种写法不与父类类名绑定，且可以保证菱形继承场景下，创建一个子类对象仅调用顶层父类初始化函数一次。</p>
<p>举例如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'A'</span><span class="token punctuation">)</span>
        <span class="token keyword">pass</span>


<span class="token keyword">class</span> <span class="token class-name">B</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'B'</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>self<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">C</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'C'</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>self<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">D</span><span class="token punctuation">(</span>B<span class="token punctuation">,</span> C<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'D'</span><span class="token punctuation">)</span>
        B<span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>self<span class="token punctuation">)</span>
        C<span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>self<span class="token punctuation">)</span>


<span class="token triple-quoted-string string">"""
以下是正确示例
"""</span>


<span class="token keyword">class</span> <span class="token class-name">A1</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'A'</span><span class="token punctuation">)</span>
        <span class="token keyword">pass</span>


<span class="token keyword">class</span> <span class="token class-name">B1</span><span class="token punctuation">(</span>A1<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'B'</span><span class="token punctuation">)</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>B1<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">C1</span><span class="token punctuation">(</span>A1<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'C'</span><span class="token punctuation">)</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>C1<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">D1</span><span class="token punctuation">(</span>B1<span class="token punctuation">,</span> C1<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'D'</span><span class="token punctuation">)</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>D1<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'---D---'</span><span class="token punctuation">)</span>
    D<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'---D1---'</span><span class="token punctuation">)</span>
    D1<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token triple-quoted-string string">"""
---D---
D
B
A
C
A
---D1---
D
B
C
A
"""</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br></div></div><h3 id="super" tabindex="-1"><a class="header-anchor" href="#super" aria-hidden="true">#</a> super()</h3>
<p>在类的继承中，如果重定义某个方法，该方法会覆盖父类的同名方法，但有时，我们希望能同时实现父类的功能，这时，我们就需要调用父类的方法了，可通过使用 <code>super</code> 来实现，比如：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Animal</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name

    <span class="token keyword">def</span> <span class="token function">greet</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'name is'</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">Dog</span><span class="token punctuation">(</span>Animal<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">greet</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>greet<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'WangWang...'</span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    d <span class="token operator">=</span> Dog<span class="token punctuation">(</span><span class="token string">"wang_cai"</span><span class="token punctuation">)</span>
    d<span class="token punctuation">.</span>greet<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">#>>> name is wang_cai</span>
<span class="token comment">#>>> WangWang...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p><code>super</code> 的一个最常见用法可以说是<strong>在子类中调用父类的初始化方法</strong>了，比如：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Base</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>a <span class="token operator">=</span> a
        self<span class="token punctuation">.</span>b <span class="token operator">=</span> b


<span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">(</span>Base<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span>  <span class="token comment"># Python3 可使用 super().__init__(a, b)</span>
        self<span class="token punctuation">.</span>c <span class="token operator">=</span> c


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    test <span class="token operator">=</span> A<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>test<span class="token punctuation">.</span>a<span class="token punctuation">,</span> test<span class="token punctuation">.</span>b<span class="token punctuation">,</span> test<span class="token punctuation">.</span>c<span class="token punctuation">)</span>

<span class="token comment">#>>> 1 2 3</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>❗❗❗</p>
<div class="custom-container warning"><p class="custom-container-title">super 其实和父类没有实质性的关联，MRO 列表</p>
<p>在多重继承的场景下会这样。对于你定义的每一个类，Python 会计算出一个方法解析顺序（Method Resolution Order, <strong>MRO</strong>）列表，它代表了类继承的顺序。
可以使用 <code>C.mro()</code> 查看。</p>
</div>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Base</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span> <span class="token string">"enter Base"</span>
        <span class="token keyword">print</span> <span class="token string">"leave Base"</span>

<span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">(</span>Base<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span> <span class="token string">"enter A"</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">print</span> <span class="token string">"leave A"</span>

<span class="token keyword">class</span> <span class="token class-name">B</span><span class="token punctuation">(</span>Base<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span> <span class="token string">"enter B"</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>B<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">print</span> <span class="token string">"leave B"</span>

<span class="token keyword">class</span> <span class="token class-name">C</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> B<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span> <span class="token string">"enter C"</span>
        <span class="token builtin">super</span><span class="token punctuation">(</span>C<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>__init__<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">print</span> <span class="token string">"leave C"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>其对应的输出是：</p>
<div class="language-txt ext-txt line-numbers-mode"><pre v-pre class="language-txt"><code>>>> c = C()
enter C
enter A
enter B
enter Base
leave Base
leave B
leave A
leave C
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="_4-魔法方法-magic-method" tabindex="-1"><a class="header-anchor" href="#_4-魔法方法-magic-method" aria-hidden="true">#</a> 4. 魔法方法 magic method</h2>
<blockquote>
<p>在 Python 中，我们可以经常看到以双下划线 <code>__</code> 包裹起来的方法，比如最常见的 <code>__init__</code>，这些方法被称为<strong>魔法方法（magic method）<strong>或</strong>特殊方法（special method）</strong>。
简单地说，这些方法可以给 Python 的类提供特殊功能，方便我们定制一个类，比如 <code>__init__</code> 方法可以对实例属性进行初始化。</p>
</blockquote>
<p>完整的特殊方法列表可在<a href="https://docs.python.org/2/reference/datamodel.html#special-method-names" target="_blank" rel="noopener noreferrer">这里<ExternalLinkIcon/></a>查看。</p>
<h2 id="_5-new" tabindex="-1"><a class="header-anchor" href="#_5-new" aria-hidden="true">#</a> 5 <code>__new__</code></h2>
<h3 id="qa-1" tabindex="-1"><a class="header-anchor" href="#qa-1" aria-hidden="true">#</a> QA</h3>
<p>❓❓❓ 为什么 <strong>new</strong> 的第一个参数是 cls 而不是 self?</p>
<div class="custom-container warning"><p class="custom-container-title">Note</p>
<p>因为调用 <code>__new__</code> 的时候，实例对象还没有被创建，<code>__new__</code> 是一个静态方法。第一个参数 <code>cls</code> 表示当前的 <code>class</code></p>
</div>
<p>❓❓❓ 如何理解 object.__new__的 object?</p>
<div class="custom-container warning"><p class="custom-container-title">Note</p>
<p><code>__new__</code> 方法如果返回 <code>cls</code> 的对象(<code>return super().__new__(cls)</code>)，则对象的 <code>__init__</code> 方法将自动被调用。</p>
<p>只要调用父类的 <code>__new__</code> 方法，<code>__init__</code> 方法就默认被调用，<code>object</code> 类是最大的父类。</p>
</div>
<p>❓❓❓ 我们可以只使用 <code>__new___</code> 来实例化对象实例吗？</p>
<div class="custom-container warning"><p class="custom-container-title">Note</p>
<p>可以，但是不建议！还是建议使用 <code>__init__</code>。</p>
</div>
<h3 id="_5-1-new" tabindex="-1"><a class="header-anchor" href="#_5-1-new" aria-hidden="true">#</a> 5.1 <code>__new__</code></h3>
<p>在 Python 中，当我们创建一个类的实例时，类会先调用 <code>__new__(cls[, ...])</code> 来创建实例，然后 <code>__init__</code> 方法再对该实例（self）进行初始化。</p>
<p>关于 <code>__new__</code> 和 <code>__init__</code> 有几点需要注意：</p>
<ul>
<li><code>__new__</code> 是在 <code>__init__</code> 之前被调用的；</li>
<li><code>__new__</code> 是类方法，<code>__init__</code> 是实例方法；</li>
<li>重载 <code>__new__</code> 方法，需要返回类的实例；</li>
</ul>
<div class="custom-container warning"><p class="custom-container-title">为什么我们一般在创建类的时候没有重载 __new__ 呢？</p>
<p>一般情况下，我们不需要重载 <code>__new__</code> 方法。但在某些情况下，我们想<strong>控制实例的创建过程</strong>，这时可以通过重载 <code>__new__</code> 方法来实现。</p>
</div>
<p>举例而言：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">A</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    _dict <span class="token operator">=</span> <span class="token builtin">dict</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token string">'key'</span> <span class="token keyword">in</span> A<span class="token punctuation">.</span>_dict<span class="token punctuation">:</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"EXISTS"</span><span class="token punctuation">)</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"A._dict['key']"</span><span class="token punctuation">,</span> A<span class="token punctuation">.</span>_dict<span class="token punctuation">[</span><span class="token string">'key'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
            <span class="token keyword">return</span> A<span class="token punctuation">.</span>_dict<span class="token punctuation">[</span><span class="token string">'key'</span><span class="token punctuation">]</span>
        <span class="token keyword">else</span><span class="token punctuation">:</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"__NEW__"</span><span class="token punctuation">)</span>
            <span class="token keyword">return</span> <span class="token builtin">object</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"__INIT__"</span><span class="token punctuation">)</span>
        A<span class="token punctuation">.</span>_dict<span class="token punctuation">[</span><span class="token string">'key'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">'aaa'</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    a1 <span class="token operator">=</span> A<span class="token punctuation">(</span><span class="token punctuation">)</span>
    a2 <span class="token operator">=</span> A<span class="token punctuation">(</span><span class="token punctuation">)</span>
    a3 <span class="token operator">=</span> A<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><p>其对应的输出如下所示：</p>
<div class="language-txt ext-txt line-numbers-mode"><pre v-pre class="language-txt"><code>__NEW__
__INIT__
EXISTS
A._dict['key'] aaa
EXISTS
A._dict['key'] aaa
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>我们可以观察到：</p>
<ol>
<li><code>__init__</code> 方法始终被调用了；</li>
<li><code>object.__new__(cls)</code> 可以实例化对象。</li>
</ol>
<div class="custom-container tip"><p class="custom-container-title">🍉🍉🍉 关于 `object.__new__(cls)`</p>
<p>可以使用 <code>object.__new__(cls)</code> 实现单例（即一个类只有一个实例，例子如上面例子）</p>
</div>
<h3 id="_5-2-实例化的本质-new-与-init" tabindex="-1"><a class="header-anchor" href="#_5-2-实例化的本质-new-与-init" aria-hidden="true">#</a> 5.2 实例化的本质 <strong>new</strong> 与 <strong>init</strong></h3>
<p>本小节通过分析 <code>__new__</code> 与 <code>__init__</code> 的关系总结实例化本质。</p>
<p>💘 💘 💘 先看例子：<strong>这是一个正确的示例</strong></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__new__, age:'</span><span class="token punctuation">,</span> age<span class="token punctuation">)</span>
        <span class="token comment"># return super(Person, cls).__new__(cls) # ok</span>
        <span class="token comment"># return object.__new__(cls) # ok</span>
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__, age:'</span><span class="token punctuation">,</span> age<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    Person<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>

<span class="token comment"># >>> __new__, age: 100</span>
<span class="token comment"># >>> __init__, age: 100</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><ol>
<li>我们可以使用多种方式来实现 <code>__new__</code></li>
<li><code>__new__</code> 和 <code>__init__</code> 方法共享同名的参数，除了第一个从 <code>cls</code> 变成了 <code>self</code></li>
<li>如果 <code>__new__</code> 没有返回实例对象，则 <code>__init__</code> 方法不会被调用</li>
</ol>
<p>❌❌❌ 如果 <code>__init__</code> 传入的参数比 <code>__new__</code> 多的话会发生什么呢？</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> age<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__new__, age:'</span><span class="token punctuation">,</span> age<span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__, age:'</span><span class="token punctuation">,</span> age<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    Person<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>

<span class="token comment">#>>> TypeError: __new__() missing 1 required positional argument: 'name'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>❌❌❌ 如果 <code>__init__</code> 传入的参数比 <code>__new__</code> 少的话会发生什么呢？</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__new__, age:'</span><span class="token punctuation">,</span> age<span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__, age:'</span><span class="token punctuation">,</span> age<span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    Person<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>

<span class="token comment">#>>> TypeError: __init__() missing 1 required positional argument: 'name'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>❗❗❗ 实例化的本质</p>
<div class="custom-container tip"><p class="custom-container-title">&#x2728;&#x2728;&#x2728; 实例化的本质</p>
<p>实例初始化本质是向 <code>__new__</code> 中传参!</p>
</div>
<p>💘 💘 💘 我们常用的定义类的写法，最标准的写法参考如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> <span class="token operator">*</span>args<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    p <span class="token operator">=</span> Person<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">,</span> <span class="token string">"zhanshen"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>我们如果在创建实例的时候加入判断，可以分别如下：</p>
<ul>
<li>在 <code>__new__</code> 中判断参数。此时对象不会创建，即 <code>__init__</code> 不会被调用；</li>
<li>在 <code>___init__</code> 中判断参数。此时对象会创建。</li>
</ul>
<p>举例如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__new__'</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> age <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">:</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'not created!'</span><span class="token punctuation">)</span>
            <span class="token keyword">return</span> cls
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__'</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    p <span class="token operator">=</span> Person<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>

<span class="token comment">#>>> __new__</span>
<span class="token comment">#>>> not created!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>可以看出，<code>__init__</code> 未被调用，对象也未创建。如果使用 <code>__init__</code> 判断的话，可以看到，对象被创建了。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__new__'</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token builtin">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">if</span> age <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">:</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__init__'</span><span class="token punctuation">)</span>
            <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'wrong!'</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    p <span class="token operator">=</span> Person<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>

<span class="token comment">#>>> __new__</span>
<span class="token comment">#>>> __init__</span>
<span class="token comment">#>>> wrong!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h3 id="_5-3-new-返回其他实例" tabindex="-1"><a class="header-anchor" href="#_5-3-new-返回其他实例" aria-hidden="true">#</a> 5.3 <code>__new__</code> 返回其他实例</h3>
<p>我们还可以通过 <code>__new__</code> 返回其他类的实例：如 <code>return object.__new__(Person)</code></p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> <span class="token operator">*</span>args<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">object</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>cls<span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>age <span class="token operator">=</span> age


<span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__new__</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> <span class="token operator">*</span>args<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">object</span><span class="token punctuation">.</span>__new__<span class="token punctuation">(</span>Person<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    p <span class="token operator">=</span> Test<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>
    p<span class="token punctuation">.</span>age <span class="token operator">=</span> <span class="token number">10</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token builtin">type</span><span class="token punctuation">(</span>p<span class="token punctuation">)</span><span class="token punctuation">,</span> p<span class="token punctuation">.</span>age<span class="token punctuation">)</span>

<span class="token comment">#>>> &lt;class '__main__.Person'> 10</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h2 id="_6-str" tabindex="-1"><a class="header-anchor" href="#_6-str" aria-hidden="true">#</a> 6. <code>__str__</code></h2>
<p>重写 <code>__str__</code> 以达到打印的目的：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Foo</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>name <span class="token operator">=</span> name

    <span class="token keyword">def</span> <span class="token function">__str__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'__str__'</span><span class="token punctuation">,</span> self<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token string">'name is '</span> <span class="token operator">+</span> self<span class="token punctuation">.</span>name

    <span class="token comment"># def __repr__(self):</span>
    <span class="token comment">#     print('__repr__', self.name)</span>
    <span class="token comment">#     return 'name is ' + self.name</span>
    __repr__ <span class="token operator">=</span> __str__


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>Foo<span class="token punctuation">(</span><span class="token string">'zhanshen'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">#>>> __str__ zhanshen</span>
<span class="token comment">#>>> name is zhanshen</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h2 id="_7-call" tabindex="-1"><a class="header-anchor" href="#_7-call" aria-hidden="true">#</a> 7. <code>__call__</code></h2>
<p>我们一般使用 <code>obj.method()</code> 来调用对象的方法，那能不能直接在实例本身上调用呢？在 Python 中，只要我们在类中定义 <code>__call__</code> 方法，就可以对实例进行调用，比如下面的例子：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Point</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>x<span class="token punctuation">,</span> self<span class="token punctuation">.</span>y <span class="token operator">=</span> x<span class="token punctuation">,</span> y
    <span class="token keyword">def</span> <span class="token function">__call__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> z<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>x <span class="token operator">+</span> self<span class="token punctuation">.</span>y <span class="token operator">+</span> z
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>使用方法如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token operator">>></span><span class="token operator">></span> p <span class="token operator">=</span> Point<span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> <span class="token builtin">callable</span><span class="token punctuation">(</span>p<span class="token punctuation">)</span>     <span class="token comment"># 使用 callable 判断对象是否能被调用</span>
<span class="token boolean">True</span>
<span class="token operator">>></span><span class="token operator">></span> p<span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span>            <span class="token comment"># 传入参数，对实例进行调用，对应 p.__call__(6)</span>
<span class="token number">13</span>                  <span class="token comment"># 3+4+6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="_8-slot" tabindex="-1"><a class="header-anchor" href="#_8-slot" aria-hidden="true">#</a> 8. <code>__slot__</code></h2>
<p>在 Python 中，我们在定义类的时候可以定义属性和方法。当我们创建了一个类的实例后，我们还可以给该实例绑定任意新的属性和方法。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Point</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>    
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> x<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span> y<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>x <span class="token operator">=</span> x
        self<span class="token punctuation">.</span>y <span class="token operator">=</span> y

<span class="token operator">>></span><span class="token operator">></span> p <span class="token operator">=</span> Point<span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> p<span class="token punctuation">.</span>z <span class="token operator">=</span> <span class="token number">5</span>    <span class="token comment"># 绑定了一个新的属性</span>
<span class="token operator">>></span><span class="token operator">></span> p<span class="token punctuation">.</span>z
<span class="token number">5</span>
<span class="token operator">>></span><span class="token operator">></span> p<span class="token punctuation">.</span>__dict__
<span class="token punctuation">{</span><span class="token string">'x'</span><span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token string">'y'</span><span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token string">'z'</span><span class="token punctuation">:</span> <span class="token number">5</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>因此，为了不浪费内存，可以使用 <code>__slots__</code> 来告诉 Python 只给一个固定集合的属性分配空间，对上面的代码做一点改进，如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Point</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    __slots__ <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token string">'x'</span><span class="token punctuation">,</span> <span class="token string">'y'</span><span class="token punctuation">)</span>       <span class="token comment"># 只允许使用 x 和 y</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> x<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span> y<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>x <span class="token operator">=</span> x
        self<span class="token punctuation">.</span>y <span class="token operator">=</span> y

<span class="token operator">>></span><span class="token operator">></span> p <span class="token operator">=</span> Point<span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span>
<span class="token operator">>></span><span class="token operator">></span> p<span class="token punctuation">.</span>z <span class="token operator">=</span> <span class="token number">5</span>
Traceback <span class="token punctuation">(</span>most recent call last<span class="token punctuation">)</span><span class="token punctuation">:</span>
  File <span class="token string">"&lt;input>"</span><span class="token punctuation">,</span> line <span class="token number">1</span><span class="token punctuation">,</span> <span class="token keyword">in</span> <span class="token operator">&lt;</span>module<span class="token operator">></span>
AttributeError<span class="token punctuation">:</span> <span class="token string">'Point'</span> <span class="token builtin">object</span> has no attribute <span class="token string">'z'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><blockquote>
<p>使用 <code>__slots__</code> 有一点需要注意的是，<code>__slots__</code> 设置的属性仅对当前类有效，对继承的子类不起效，除非子类也定义了 <code>__slots__</code>，这样，子类允许定义的属性就是自身的 <code>slots</code> 加上父类的 <code>slots。</code></p>
</blockquote>
<h2 id="_9-元类-metaclass" tabindex="-1"><a class="header-anchor" href="#_9-元类-metaclass" aria-hidden="true">#</a> 9. 元类 metaclass</h2>
<h3 id="_9-1-什么是元类" tabindex="-1"><a class="header-anchor" href="#_9-1-什么是元类" aria-hidden="true">#</a> 9.1 什么是元类</h3>
<div class="language-markdown ext-md line-numbers-mode"><pre v-pre class="language-markdown"><code>类是实例对象的模板，元类是类的模板

+----------+             +----------+             +----------+
|          |             |          |             |          |
|          | instance of |          | instance of |          |
| instance +------------>+  class   +------------>+ metaclass|
|          |             |          |             |          |
|          |             |          |             |          |
+----------+             +----------+             +----------+
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="p-参考文献" tabindex="-1"><a class="header-anchor" href="#p-参考文献" aria-hidden="true">#</a> P. 参考文献</h2>
<ol>
<li>
<p><a href="https://wiki.jikexueyuan.com/project/explore-python/" target="_blank" rel="noopener noreferrer">Python 之旅<ExternalLinkIcon/></a></p>
</li>
<li>
<p><a href="https://docs.python.org/zh-cn/3/tutorial/classes.html" target="_blank" rel="noopener noreferrer">Pyton 作用域与命名空间，官方文档<ExternalLinkIcon/></a></p>
</li>
</ol>
</template>
