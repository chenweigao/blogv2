<template><p>总结一下 Pytest 和 Python Unitest 相关的基础用法和学习心得。</p>
<!-- more -->
<p>Pytest 的<a href="https://learning-pytest.readthedocs.io/zh/latest/" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a></p>
<h2 id="pytest-入门" tabindex="-1"><a class="header-anchor" href="#pytest-入门" aria-hidden="true">#</a> Pytest 入门</h2>
<h3 id="捕获异常" tabindex="-1"><a class="header-anchor" href="#捕获异常" aria-hidden="true">#</a> 捕获异常</h3>
<p>使用 <code>pytest.raise()</code> 来捕获异常。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># 官方示例</span>
<span class="token comment"># test_raises.py</span>

<span class="token keyword">def</span> <span class="token function">test_raises</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> pytest<span class="token punctuation">.</span>raises<span class="token punctuation">(</span>TypeError<span class="token punctuation">)</span> <span class="token keyword">as</span> e<span class="token punctuation">:</span>
        connect<span class="token punctuation">(</span><span class="token string">'localhost'</span><span class="token punctuation">,</span> <span class="token string">'6379'</span><span class="token punctuation">)</span>
    exec_msg <span class="token operator">=</span> e<span class="token punctuation">.</span>value<span class="token punctuation">.</span>args<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
    <span class="token keyword">assert</span> exec_msg <span class="token operator">==</span> <span class="token string">'port type must be int'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="标记函数-pytest-mark" tabindex="-1"><a class="header-anchor" href="#标记函数-pytest-mark" aria-hidden="true">#</a> 标记函数 pytest.mark</h3>
<blockquote>
<p>默认情况下，pytest 会递归查找当前目录下所有以 <code>test</code> 开始或结尾的 Python 脚本，并执行文件内的所有以 <code>test</code> 开始或结束的函数和方法。</p>
</blockquote>
<p>标记函数的作用是在某些情况下，我们只想执行指定的测试函数，所以可以使用 <code>ptest.mark</code> 进行标记。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># 官方示例</span>
<span class="token comment"># test_with_mark.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>finished</span>
<span class="token keyword">def</span> <span class="token function">test_func1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">assert</span> <span class="token number">1</span> <span class="token operator">==</span> <span class="token number">1</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>unfinished</span>
<span class="token keyword">def</span> <span class="token function">test_func2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">assert</span> <span class="token number">1</span> <span class="token operator">!=</span> <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>然后在命令行中使用 <code>-m</code> 选择标记的函数：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pytest -m finished test_with_mark.py

pytest -m <span class="token string">"finished and commit"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>一个函数可以打多个标记，多个函数也可以打相同的标记；具体多个标记的执行如上代码所示。</p>
<div class="custom-container tip"><p class="custom-container-title">Tips</p>
<p>除此之外，pytest 还有一些其他的方法可以指定要测试的具体函数，如 <code>:::</code> 标记和 <code>-k</code> 模糊匹配等，不太常用，具体用法可以参考官方文档。</p>
</div>
<h3 id="跳过测试-pytest-mark-skip" tabindex="-1"><a class="header-anchor" href="#跳过测试-pytest-mark-skip" aria-hidden="true">#</a> 跳过测试 pytest.mark.skip</h3>
<p>可以使用标记 <code>pytest.mark.skip</code> 来指定要跳过的测试，具体用法如下：</p>
<ol>
<li>标记要跳过的函数</li>
</ol>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_skip.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>skip</span><span class="token punctuation">(</span>reason<span class="token operator">=</span><span class="token string">'out-of-date api'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">test_connect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">pass</span>

<span class="token comment"># test_skip.py s                                       [100%]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>执行后命令行显示 <code>s</code> 就表示测试被跳过(SKIPPED)。</p>
<ol start="2">
<li>指定被忽略的条件</li>
</ol>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>skipif</span><span class="token punctuation">(</span>conn<span class="token punctuation">.</span>__version__ <span class="token operator">&lt;</span> <span class="token string">'0.2.0'</span><span class="token punctuation">,</span>
                    reason<span class="token operator">=</span><span class="token string">'not supported until v0.2.0'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">test_api</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">pass</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="预见的错误-pytest-mark-xfail" tabindex="-1"><a class="header-anchor" href="#预见的错误-pytest-mark-xfail" aria-hidden="true">#</a> 预见的错误 pytest.mark.xfail</h3>
<blockquote>
<p>如果我们事先知道测试函数会执行失败，但又不想直接跳过，而是希望显式地提示。</p>
</blockquote>
<p>此时可以使用 <code>pytest.mark.xfail</code> 实现预见错误功能：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_xfail.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>xfail</span><span class="token punctuation">(</span>gen<span class="token punctuation">.</span>__version__ <span class="token operator">&lt;</span> <span class="token string">'0.2.0'</span><span class="token punctuation">,</span>
                   reason<span class="token operator">=</span><span class="token string">'not supported until v0.2.0'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">test_api</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    id_1 <span class="token operator">=</span> gen<span class="token punctuation">.</span>unique_id<span class="token punctuation">(</span><span class="token punctuation">)</span>
    id_2 <span class="token operator">=</span> gen<span class="token punctuation">.</span>unique_id<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">assert</span> id_1 <span class="token operator">!=</span> id_2

<span class="token comment"># pytest test_xfail.py</span>
<span class="token comment"># test_xfail.py x                                      [100%]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>执行后命令行显示 <code>x</code> 就表示预见的失败(XFAIL)。</p>
<p>需要注意，如果提示大写的 <code>X</code>, 则说明预见的是失败，但实际运行测试却成功通过(XPASS)。</p>
<h3 id="参数化-pytest-mark-parametrize" tabindex="-1"><a class="header-anchor" href="#参数化-pytest-mark-parametrize" aria-hidden="true">#</a> 参数化 pytest.mark.parametrize</h3>
<p>参数化测试可以保证每组参数都独立进行一次测试，比如关于不同密码返回不同结果要如何测试，示例代码如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_parametrize.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>parametrize</span><span class="token punctuation">(</span><span class="token string">'passwd'</span><span class="token punctuation">,</span>
                      <span class="token punctuation">[</span><span class="token string">'123456'</span><span class="token punctuation">,</span>
                       <span class="token string">'abcdefdfs'</span><span class="token punctuation">,</span>
                       <span class="token string">'as52345fasdf4'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">test_passwd_length</span><span class="token punctuation">(</span>passwd<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">assert</span> <span class="token builtin">len</span><span class="token punctuation">(</span>passwd<span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>这段代码总共可以进三次测试，如返回 <code>F..</code>。</p>
<p>除此之外，还可以传入多组参数进行参数化校验，并且使用 <code>pytest.param</code> 的 <code>id</code> 参数进行自定义，这样就能很方便地查看是哪个参数通过，哪个没通过。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_parametrize.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>parametrize</span><span class="token punctuation">(</span><span class="token string">'user, passwd'</span><span class="token punctuation">,</span>
                         <span class="token punctuation">[</span>pytest<span class="token punctuation">.</span>param<span class="token punctuation">(</span><span class="token string">'jack'</span><span class="token punctuation">,</span> <span class="token string">'abcdefgh'</span><span class="token punctuation">,</span> <span class="token builtin">id</span><span class="token operator">=</span><span class="token string">'User&lt;Jack>'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                          pytest<span class="token punctuation">.</span>param<span class="token punctuation">(</span><span class="token string">'tom'</span><span class="token punctuation">,</span> <span class="token string">'a123456a'</span><span class="token punctuation">,</span> <span class="token builtin">id</span><span class="token operator">=</span><span class="token string">'User&lt;Tom>'</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">test_passwd_md5_id</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> passwd<span class="token punctuation">)</span><span class="token punctuation">:</span>
    db <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token string">'jack'</span><span class="token punctuation">:</span> <span class="token string">'e8dc4081b13434b45189a720b77b6818'</span><span class="token punctuation">,</span>
        <span class="token string">'tom'</span><span class="token punctuation">:</span> <span class="token string">'1702a132e769a623c1adb78353fc9503'</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">import</span> hashlib

    <span class="token comment"># abcdefgh = e8dc4081b13434b45189a720b77b6818</span>
    <span class="token keyword">assert</span> hashlib<span class="token punctuation">.</span>md5<span class="token punctuation">(</span>passwd<span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>hexdigest<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> db<span class="token punctuation">[</span>user<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="fixture-固件" tabindex="-1"><a class="header-anchor" href="#fixture-固件" aria-hidden="true">#</a> fixture 固件</h2>
<p>主要为 <code>fixture</code> 固件相关的操作。</p>
<h3 id="fixture-定义" tabindex="-1"><a class="header-anchor" href="#fixture-定义" aria-hidden="true">#</a> fixture 定义</h3>
<p>fixture 在 pytest 中表现为一个装饰器，在 JAVA 中，fixture 是这么定义的：</p>
<blockquote>
<p>JUnit 提供了编写测试前准备、测试后清理的固定代码，我们称之为 Fixture。</p>
</blockquote>
<p>在 pytest 中，固件的作用是在执行测试函数之前（或之后）加载运行的函数；我们可以使用固件做任何事情。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_postcode.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">postcode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token string">'010'</span>

<span class="token keyword">def</span> <span class="token function">test_postcode</span><span class="token punctuation">(</span>postcode<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">assert</span> postcode <span class="token operator">==</span> '<span class="token number">010</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>这种是在测试脚本中直接使用固件的例子，一般而言，如果我们希望固件可以在更大程度上服用，可以对固件进行集中管理。</p>
<p>pytest 使用 <code>conftest.py</code> 集中管理固件。</p>
<div class="custom-container tip"><p class="custom-container-title">pytest 官方提示</p>
<p>在复杂的项目中，可以在不同的目录层级定义 <code>conftest.py</code>，其作用域为其所在的目录和子目录。</p>
</div>
<h3 id="预处理和后处理" tabindex="-1"><a class="header-anchor" href="#预处理和后处理" aria-hidden="true">#</a> 预处理和后处理</h3>
<p>pytest 使用 <code>yield</code> 关键词将固件分为两个部分，其之前的代码属于预处理，之后的代码属于后处理。</p>
<p>可以使用 <code>-s</code> 参数阻止消息被吞，使用 <code>--setup-show</code> 选项跟踪更细额固件执行。</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>$ pytest -s test_demo.py
$ pytest --setup-show test_demo.py
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3>
<p>作用域可以用来指定固件的作用范围，默认的作用域为 <code>function</code>。</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>scope<span class="token operator">=</span><span class="token string">'function'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">func_scope</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">pass</span>


<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>scope<span class="token operator">=</span><span class="token string">'module'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">mod_scope</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">pass</span>


<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>scope<span class="token operator">=</span><span class="token string">'session'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">sess_scope</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">pass</span>


<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>scope<span class="token operator">=</span><span class="token string">'class'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">class_scope</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">pass</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>可以看出，上面的作用域作用于函数，要是想对类使用作用域，如下：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_scope.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>mark<span class="token punctuation">.</span>usefixtures</span><span class="token punctuation">(</span><span class="token string">'class_scope'</span><span class="token punctuation">)</span>
<span class="token keyword">class</span> <span class="token class-name">TestClassScope</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">test_1</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">pass</span>

    <span class="token keyword">def</span> <span class="token function">test_2</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">pass</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">pytest 作用域，官方文档</p>
<p>在定义固件时，通过 <code>scope</code> 参数声明作用域，可选项有：</p>
<ul>
<li><code>function</code>: 函数级，每个测试函数都会执行一次固件；</li>
<li><code>class</code>: 类级别，每个测试类执行一次，所有方法都可以使用；</li>
<li><code>module</code>: 模块级，每个模块执行一次，模块内函数和方法都可使用；</li>
<li><code>session</code>: 会话级，一次测试只执行一次，所有被找到的函数和方法都可用。</li>
</ul>
</div>
<h3 id="自动执行" tabindex="-1"><a class="header-anchor" href="#自动执行" aria-hidden="true">#</a> 自动执行</h3>
<p>在定义固件时指定 <code>autouse</code> 参数，即可让固件自动执行。</p>
<p>如可以在测试时统计测试的耗时，下面是两个自动计时固件，一个用于统计每个函数运行时间（<code>function</code> 作用域），一个用于计算测试总耗时（<code>session</code> 作用域）：</p>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/demo/pytest_autouse_demo.py</p>
<h3 id="重命名" tabindex="-1"><a class="header-anchor" href="#重命名" aria-hidden="true">#</a> 重命名</h3>
<p>固件的默认名称为定义时的函数名，可以通过 <code>name</code> 选项指定名称：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># test_rename.py</span>

<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>name<span class="token operator">=</span><span class="token string">'age'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">calculate_average_age</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token number">28</span>

<span class="token keyword">def</span> <span class="token function">test_age</span><span class="token punctuation">(</span>age<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">assert</span> age <span class="token operator">==</span> <span class="token number">28</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="参数化" tabindex="-1"><a class="header-anchor" href="#参数化" aria-hidden="true">#</a> 参数化</h3>
<p>固件参数化结合了前面 pytest 参数化的用法。</p>
<blockquote>
<p>与函数参数化使用 <code>@pytest.mark.parametrize</code> 不同，固件在定义时使用 <code>params</code> 参数进行参数化。</p>
</blockquote>
<p>固件参数化需要使用 pytest 内置的固件 <code>request</code>，并通过 <code>request.param</code> 获取参数。</p>
<p>使用 pytest 的固件参数化连接两个不同数据库的示例如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>params<span class="token operator">=</span><span class="token punctuation">[</span>
    <span class="token punctuation">(</span><span class="token string">'redis'</span><span class="token punctuation">,</span> <span class="token string">'6379'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">(</span><span class="token string">'elasticsearch'</span><span class="token punctuation">,</span> <span class="token string">'9200'</span><span class="token punctuation">)</span>
<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">param</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> request<span class="token punctuation">.</span>param


<span class="token decorator annotation punctuation">@pytest<span class="token punctuation">.</span>fixture</span><span class="token punctuation">(</span>autouse<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">db</span><span class="token punctuation">(</span>param<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'\nSucceed to connect %s:%s'</span> <span class="token operator">%</span> param<span class="token punctuation">)</span>

    <span class="token keyword">yield</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'\nSucceed to close %s:%s'</span> <span class="token operator">%</span> param<span class="token punctuation">)</span>


<span class="token keyword">def</span> <span class="token function">test_api</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">assert</span> <span class="token number">1</span> <span class="token operator">==</span> <span class="token number">1</span>

<span class="token triple-quoted-string string">"""
tests\fixture\test_parametrize.py
Succeed to connect redis:6379
.
Succeed to close redis:6379

Succeed to connect elasticsearch:9200
.
Succeed to close elasticsearch:9200
"""</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><p>这边的操作使用固件抽离出数据库的通用操作，使得每个 API 都能复用这些数据库固件，同时也提高了可维护性。</p>
<div class="custom-container warning"><p class="custom-container-title">TODO</p>
<p>这边可以考虑使用固件的参数化进行代码重构，精简代码</p>
</div>
<h3 id="内置固件" tabindex="-1"><a class="header-anchor" href="#内置固件" aria-hidden="true">#</a> 内置固件</h3>
<p>pytest 中有很多实用的内置固件，在这记录一下，具体可以查阅官方文档。</p>
<ul>
<li>
<p>tmpdir &amp; tmpdir_factory：</p>
<p>使用 <code>tmpdir.mkdir()</code> 创建目临时录，<code>tmpdir.join()</code> 创建临时文件（或者使用创建的目录）。</p>
</li>
<li>
<p>pytestconfig</p>
<p>使用 <code>pytestconfig</code>，可以很方便的读取命令行参数和配置文件。(<code>conftest.py</code> 中使用函数 <code>pytest_addoption</code>, 通过 <code>pytestconfig</code> 获取命令行参数)</p>
</li>
<li>
<p>capsys</p>
<p><code>capsys</code> 用于捕获 <code>stdout</code> 和 <code>stderr</code> 的内容，并临时关闭系统输出。</p>
</li>
<li>
<p>monkeypatch</p>
<p><code> monkeypath</code> 用于运行时动态修改类或模块。</p>
<div class="custom-container warning"><p class="custom-container-title">TODO</p>
<p>这个很重要，需要好好理解，看以后是否有用：<a href="https://learning-pytest.readthedocs.io/zh/latest/doc/fixture/builtin-fixture.html" target="_blank" rel="noopener noreferrer">https://learning-pytest.readthedocs.io/zh/latest/doc/fixture/builtin-fixture.html<ExternalLinkIcon/></a></p>
</div>
</li>
<li>
<p>recwarn</p>
<p><code>recwarn</code> 用于捕获程序中 warnings 产生的警告。</p>
</li>
</ul>
<h2 id="单元测试" tabindex="-1"><a class="header-anchor" href="#单元测试" aria-hidden="true">#</a> 单元测试</h2>
<h3 id="基本例子" tabindex="-1"><a class="header-anchor" href="#基本例子" aria-hidden="true">#</a> 基本例子</h3>
<p>举个基本的用例：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> unittest

<span class="token keyword">class</span> <span class="token class-name">WidgetTestCase</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>widget <span class="token operator">=</span> Widget<span class="token punctuation">(</span><span class="token string">'The widget'</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">test_default_widget_size</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>assertEqual<span class="token punctuation">(</span>self<span class="token punctuation">.</span>widget<span class="token punctuation">.</span>size<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">,</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                         <span class="token string">'incorrect default size'</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">test_widget_resize</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>widget<span class="token punctuation">.</span>resize<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">,</span><span class="token number">150</span><span class="token punctuation">)</span>
        self<span class="token punctuation">.</span>assertEqual<span class="token punctuation">(</span>self<span class="token punctuation">.</span>widget<span class="token punctuation">.</span>size<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">,</span><span class="token number">150</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                         <span class="token string">'wrong size after resize'</span><span class="token punctuation">)</span>
    
    <span class="token keyword">def</span> <span class="token function">tearDown</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>widget<span class="token punctuation">.</span>dispose<span class="token punctuation">(</span><span class="token punctuation">)</span>
        
<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    unittest<span class="token punctuation">.</span>main<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h3 id="skip-测试用例" tabindex="-1"><a class="header-anchor" href="#skip-测试用例" aria-hidden="true">#</a> skip 测试用例</h3>
<p>以下内容均可以跳过：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>

    <span class="token decorator annotation punctuation">@unittest<span class="token punctuation">.</span>skip</span><span class="token punctuation">(</span><span class="token string">"skip it"</span><span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">test_1</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'1'</span><span class="token punctuation">)</span>

    <span class="token decorator annotation punctuation">@unittest<span class="token punctuation">.</span>skipIf</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">'前面条件成立，跳过'</span><span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">test_2</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'2'</span><span class="token punctuation">)</span>

    <span class="token decorator annotation punctuation">@unittest<span class="token punctuation">.</span>skipUnless</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">></span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">'前面条件为 False 跳过'</span><span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">test_3</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'3'</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="ddt-数据驱动" tabindex="-1"><a class="header-anchor" href="#ddt-数据驱动" aria-hidden="true">#</a> DDT 数据驱动</h3>
<blockquote>
<p>DDT: Data Drive Test</p>
</blockquote>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> unittest
<span class="token keyword">from</span> ddt <span class="token keyword">import</span> ddt
<span class="token keyword">from</span> ddt <span class="token keyword">import</span> data


<span class="token decorator annotation punctuation">@ddt</span>
<span class="token keyword">class</span> <span class="token class-name">DdtTest</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'start...'</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">tearDown</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'end!'</span><span class="token punctuation">)</span>

    <span class="token decorator annotation punctuation">@data</span><span class="token punctuation">(</span><span class="token string">'a'</span><span class="token punctuation">,</span> <span class="token string">'b'</span><span class="token punctuation">,</span> <span class="token string">'c'</span><span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">test_1</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> txt<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>txt<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    unittest<span class="token punctuation">.</span>main<span class="token punctuation">(</span>verbosity<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span>
    <span class="token triple-quoted-string string">"""
    start...
    a
    end!
    start...
    b
    end!
    start...
    c
    end!
    """</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div><p>从上面的例子中，有几点需要注意的：</p>
<ol>
<li>
<p><code>setUp</code> 和 <code>tesrDown</code> 这两个在每一次测试用例执行的时候都会执行一遍。所以可以看到，我们使用数据驱动了 3 个测试用例，这两个也被执行了三次。</p>
</li>
<li>
<p>也可以将测试的数据用在文件中，然后使用文件读取的方式进行读取，而后 unpack，其使用的方式类似于：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token decorator annotation punctuation">@file_data</span><span class="token punctuation">(</span><span class="token string">'ddt.xml'</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">test_xx</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> txt<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>txt<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></li>
<li>
<p>如果需要 unpack 的话，就如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># coding=UTF-8</span>
<span class="token keyword">import</span> unittest

<span class="token keyword">import</span> ddt


<span class="token keyword">def</span> <span class="token function">read_file</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    params <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token builtin">file</span> <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">'test.txt'</span><span class="token punctuation">,</span> <span class="token string">'r'</span><span class="token punctuation">,</span> encoding<span class="token operator">=</span><span class="token string">'gbk'</span><span class="token punctuation">)</span>
    <span class="token keyword">for</span> line <span class="token keyword">in</span> <span class="token builtin">file</span><span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
        params<span class="token punctuation">.</span>append<span class="token punctuation">(</span>line<span class="token punctuation">.</span>strip<span class="token punctuation">(</span><span class="token string">'\n'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">','</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> params


<span class="token decorator annotation punctuation">@ddt<span class="token punctuation">.</span>ddt</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'start...'</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">tearDown</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'end!'</span><span class="token punctuation">)</span>

    <span class="token decorator annotation punctuation">@ddt<span class="token punctuation">.</span>data</span><span class="token punctuation">(</span><span class="token operator">*</span>read_file<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token decorator annotation punctuation">@ddt<span class="token punctuation">.</span>unpack</span>
    <span class="token keyword">def</span> <span class="token function">test_1</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> <span class="token builtin">id</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token builtin">id</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    unittest<span class="token punctuation">.</span>main<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><p>给出要读取文件的内容：</p>
<p><code>test.txt</code></p>
<div class="language-txt ext-txt line-numbers-mode"><pre v-pre class="language-txt"><code>1,name1
2,zhanshen
3,wait
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></li>
</ol>
<h3 id="ddt-yml" tabindex="-1"><a class="header-anchor" href="#ddt-yml" aria-hidden="true">#</a> DDT + YML</h3>
<div class="custom-container tip"><p class="custom-container-title">Python 安装 yml 扩展</p>
<p><code>pip install PyYaml</code></p>
</div>
<p>可以配合 DDT 和 YML 文件来实现数据驱动：</p>
<p>YML 的文件定义不同，在 Python 中解析出来的结果也不同：</p>
<ul>
<li>嵌套的字典</li>
<li>列表</li>
</ul>
<p>分别进行说明：</p>
<ol>
<li>字典</li>
</ol>
<p><code>dicts.yml</code> 的格式如下所示：</p>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/python/dicts.yml</p>
<p>如果使用 Python 进行解析的话，代码可以如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># coding=UTF-8</span>
<span class="token keyword">import</span> yaml


<span class="token keyword">def</span> <span class="token function">read_file</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token builtin">file</span> <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">'dicts.yml'</span><span class="token punctuation">,</span> <span class="token string">'r'</span><span class="token punctuation">,</span> encoding<span class="token operator">=</span><span class="token string">'utf-8'</span><span class="token punctuation">)</span>
    dic <span class="token operator">=</span> yaml<span class="token punctuation">.</span>load<span class="token punctuation">(</span><span class="token builtin">file</span><span class="token punctuation">,</span> Loader<span class="token operator">=</span>yaml<span class="token punctuation">.</span>FullLoader<span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>dic<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>会输出一个字典：<code>{'name': 'weigao', 'age': 24, 'data': {'a': 1, 'b': 2, 'c': 3, 'd': 4}, 'list': ['a', 'b', 'c', 'd']}</code></p>
<p>方便观看，转换成 JSON：</p>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/python/dicts.json</p>
<ol start="2">
<li>列表</li>
</ol>
<p>其解析如下所示：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> unittest

<span class="token keyword">import</span> ddt


<span class="token decorator annotation punctuation">@ddt<span class="token punctuation">.</span>ddt</span>
<span class="token keyword">class</span> <span class="token class-name">Test</span><span class="token punctuation">(</span>unittest<span class="token punctuation">.</span>TestCase<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">setUp</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'start...'</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">tearDown</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'end!'</span><span class="token punctuation">)</span>

    <span class="token decorator annotation punctuation">@ddt<span class="token punctuation">.</span>file_data</span><span class="token punctuation">(</span><span class="token string">'list.yml'</span><span class="token punctuation">)</span>
    <span class="token keyword">def</span> <span class="token function">test_yml</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>kwargs<span class="token punctuation">[</span><span class="token string">'name'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>  kwargs<span class="token punctuation">[</span><span class="token string">'age'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
    unittest<span class="token punctuation">.</span>main<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p><code>list.yml</code> 的文件内容为：</p>
<p>&lt;&lt;&lt; @/docs/.vuepress/code/python/list.yml</p>
<p>可以解析出来，输出如下：</p>
<div class="language-txt ext-txt line-numbers-mode"><pre v-pre class="language-txt"><code>start...
weigao 24
end!
start...
zhanshen 10089
end!
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div></template>
