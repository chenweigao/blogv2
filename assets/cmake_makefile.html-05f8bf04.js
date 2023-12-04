import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as c,o,c as i,a as n,b as a,d as e,f as l}from"./app-22cda79c.js";const p={},d=l(`<h1 id="makefile" tabindex="-1"><a class="header-anchor" href="#makefile" aria-hidden="true">#</a> Makefile</h1><h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><p>我们对 makefile 的目标是，能读懂大型项目中的 makefile, 能写简单的 makefile.</p><h2 id="基础概念" tabindex="-1"><a class="header-anchor" href="#基础概念" aria-hidden="true">#</a> 基础概念</h2><p>什么是 makefile?<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup> 什么是 make 命令，我们首先需要了解这些基础概念。make 命令在执行的时候，我们需要一个 makefile, 去告诉 make 程序如何编译和链接程序。</p><h3 id="makefile-的规则" tabindex="-1"><a class="header-anchor" href="#makefile-的规则" aria-hidden="true">#</a> makefile 的规则</h3><p>先看一段简单的例子：</p><div class="language-makefile" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">target ...</span> <span class="token punctuation">:</span> prerequisites ...
    command
    ...
    ...
</code></pre></div><ol><li><p>target …</p><p>这个可以是一个目标文件，也可以是一个执行文件，也可以是一个标签。<em>…</em> 表示 target 可以有多个</p></li><li><p>prerequisites ...</p><p>生成该 target 的依赖项</p></li><li><p>commad</p><p>命令。注意到可以是任意命令，正常而言，我们使用 <code>gcc</code> 或者 <code>g++</code> 这些命令，但是如果你要在这边写什么 <code>cd</code>, <code>ls</code> 命令也是可以的，即任意的 shell 命令，但是注意到我们的命令是要服务于 target 的</p></li></ol><h3 id="hello-world" tabindex="-1"><a class="header-anchor" href="#hello-world" aria-hidden="true">#</a> Hello world</h3><p>如此，我们可以写一个简单的例子（关于 Makefile 的例子，我们可以参考这个<sup class="footnote-ref"><a href="#footnote2">[2]</a><a class="footnote-anchor" id="footnote-ref2"></a></sup>）：</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">edit</span> <span class="token punctuation">:</span> main.o kbd.o command.o display.o \\
        insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \\
        insert.o search.o files.o utils.o

<span class="token target symbol">main.o</span> <span class="token punctuation">:</span> main.c defs.h
    cc -c main.c
<span class="token target symbol">kbd.o</span> <span class="token punctuation">:</span> kbd.c defs.h command.h
    cc -c kbd.c
<span class="token target symbol">command.o</span> <span class="token punctuation">:</span> command.c defs.h command.h
    cc -c command.c
<span class="token target symbol">display.o</span> <span class="token punctuation">:</span> display.c defs.h buffer.h
    cc -c display.c
<span class="token target symbol">insert.o</span> <span class="token punctuation">:</span> insert.c defs.h buffer.h
    cc -c insert.c
<span class="token target symbol">search.o</span> <span class="token punctuation">:</span> search.c defs.h buffer.h
    cc -c search.c
<span class="token target symbol">files.o</span> <span class="token punctuation">:</span> files.c defs.h buffer.h command.h
    cc -c files.c
<span class="token target symbol">utils.o</span> <span class="token punctuation">:</span> utils.c defs.h
    cc -c utils.c
<span class="token target symbol">clean</span> <span class="token punctuation">:</span>
    rm edit main.o kbd.o command.o display.o \\
        insert.o search.o files.o utils.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个比较简单的例子，我们暂且把其叫做 makefile 的 hello world 程序，暂且不用关心其中的文件细节。上述代码需要产生 <code>edit</code> 这个 target, 但是这个 target 依赖了若干个 <code>.o</code>, 其生成的命令就是第 3 行的命令，注意到行数太长的时候我们可以进行换行。</p><p>注意到因为 edit 依赖了很多 <code>.o</code>, 所以我们要对这些依赖的逐一生成，以 <code>main.o</code> 为例（代码第 6 行），我们可以看出生成 <code>main.o</code> 的生成依赖于 <code>main.c</code> 和 <code>defs.h</code>, 所以我们把这个写到后面来，这个例子中的文件结构可以看到的话，肯定是 <code>main.c</code> 和 <code>defs.h</code> 在一个文件夹中，我们实际生产中遇到的结构一般都不会这么简单，后面例子我们将分析复杂的形式。</p><p><code>clean</code> 命令就是说我们把生成的文件进行一个消除，不要 <code>xxx.o</code> 这个目标文件了，做一个清理的工作。额外一提，我们这个 clean 不是一个 target, 其冒号后什么也没有，可以将其理解为一个动作的名字。</p><h3 id="makefile-变量" tabindex="-1"><a class="header-anchor" href="#makefile-变量" aria-hidden="true">#</a> makefile 变量</h3><p>我们不难看出，上面的例子太麻烦了，比如说：</p><div class="language-makefile" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">edit</span> <span class="token punctuation">:</span> main.o kbd.o command.o display.o \\
        insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \\
        insert.o search.o files.o utils.o
</code></pre></div><p>在这几行代码里面，这几个 <code>xxx.o</code> 文件就被一直使用了，后面如果我们要新增依赖项，那么这两个地方都需要改，万一漏了没改，那岂不是悲剧了？所以说我们提出了<strong>变量</strong>这个概念，其和编程语言中的变量概念类似，可以简单理解为 C 语言中的宏。</p><p>我们定义一个变量：</p><div class="language-makefile" data-ext="makefile"><pre class="language-makefile"><code>objects <span class="token operator">=</span> main.o kbd.o command.o display.o \\
     insert.o search.o files.o utils.o
</code></pre></div><h2 id="实战-makefile" tabindex="-1"><a class="header-anchor" href="#实战-makefile" aria-hidden="true">#</a> 实战 Makefile</h2><h3 id="概览" tabindex="-1"><a class="header-anchor" href="#概览" aria-hidden="true">#</a> 概览</h3><p>通过本章节很多例子，我们在实际的环境中进行编译，然后做细微的修改。希望通过这个目的，我们可以掌握 makefile 的基本用法，也会修改项目中的 makefile, 并最终使编译通过。</p><h3 id="单文件夹例子" tabindex="-1"><a class="header-anchor" href="#单文件夹例子" aria-hidden="true">#</a> 单文件夹例子</h3><h4 id="hello-world-1" tabindex="-1"><a class="header-anchor" href="#hello-world-1" aria-hidden="true">#</a> hello world</h4><p>我们先准备一个很简单的 C 程序 <code>main.c</code>：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;hello makefile 01\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>然后执行最简单的 <code>g++</code>:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ g++ main.c
$ ./a.out
hello makefile 01
</code></pre></div><p>我们将其改造成 makfile 的形式，其文件树结构如下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ tree                                                                                                                                 
<span class="token builtin class-name">.</span>
<span class="token operator">|</span>-- main.c
<span class="token operator">|</span>-- makefile
</code></pre></div><p>其中 makefile 的内容为：</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>objects <span class="token operator">=</span> main.o

<span class="token target symbol">test</span><span class="token punctuation">:</span> <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
        cc -o test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>

<span class="token target symbol">main.o</span><span class="token punctuation">:</span> main.c
        cc -c main.c

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> clean
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
        rm test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里面有几点是需要注意的：</p><ol><li><p>第 6 行我们指定了 main.o 生成所需要的依赖，这个不指定的话会报失败的。</p></li><li><p>第 7 行我们使用了 <code>cc</code> 用于编译，我们也可以使用 <code>g++</code>:</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>objects <span class="token operator">=</span> main.o

<span class="token target symbol">test</span><span class="token punctuation">:</span> <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
        g++ -o test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>

<span class="token target symbol">main.o</span><span class="token punctuation">:</span> main.c
        g++ -c main.c

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> clean
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
        rm test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>🛑🛑拓展实验🛑🛑 特别需要注意的是，第 7 行我们也可以使用 <code>g++ -c main.c -o main.o</code>, 但是在这里我们没有指定，也编译出来了 <code>main.o</code>, 说明这个可能是自动生成的，为此我们尝试一下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ g++ <span class="token parameter variable">-c</span> main.c
$ <span class="token function">ls</span>
main.c  main.o  makefile
</code></pre></div><p>这是自动推导了，但是如果我们不指定 <code>-c</code> 的话，就不会自动推导， 而是会生成一个可执行的 <code>a.out</code>：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ g++ <span class="token parameter variable">-c</span> main.c
$ <span class="token function">ls</span>
a.out  main.c  makefile
</code></pre></div></li><li><p>clean 命令用于清除 make 生成的那些文件，直接执行 <code>make clean</code> 即可</p></li><li><p><code>.PHONY</code> 表示 <code>clean</code> 是个伪目标文件。</p></li></ol><p>我们执行 <code>make</code> 命令，其输出可以参考：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span>                                                                                                                                 
cc <span class="token parameter variable">-c</span> main.c
cc <span class="token parameter variable">-o</span> <span class="token builtin class-name">test</span> main.o
</code></pre></div><p>从这个里面，我们可以看出来，make 命令一共执行了 2 步，第一步是先生成 <code>main.o</code>, 然后再生成 target <code>test</code>.</p><h4 id="自定义的头文件" tabindex="-1"><a class="header-anchor" href="#自定义的头文件" aria-hidden="true">#</a> 自定义的头文件</h4><p>很多时候我们使用的都不是标准库的头文件，我们会自己写头文件，然后引用，对于这种情况，makefile 该怎么编写呢？</p><p>先给出一个简单的头文件 <code>zhanshen.h</code>:</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> x<span class="token punctuation">,</span> <span class="token keyword">int</span> y<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>这个头文件中定义了最简单的一个函数，我们在 <code>main.c</code> 中调用一下这个：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;zhanshen.h&quot;</span></span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;hello makefile 01\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> res <span class="token operator">=</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;zhanshen sum 1+2=%d\\n&quot;</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>然后使用最简单的方式验证一下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ g++ main.c

$ <span class="token function">ls</span>
a.out  main.c  makefile  zhanshen.h

$ ./a.out                                                                   
hello makefile 01
zhanshen <span class="token function">sum</span> <span class="token number">1</span>+2<span class="token operator">=</span><span class="token number">3</span>
</code></pre></div><p>然后其实我们的 makefile 不需要做任何的修改，可以直接使用，因为是在同一个路径下面的，所以自己就找到了：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span>
g++ <span class="token parameter variable">-c</span> main.c
g++ <span class="token parameter variable">-o</span> <span class="token builtin class-name">test</span> main.o

$ <span class="token function">ls</span>
main.c  main.o  makefile  <span class="token builtin class-name">test</span>  zhanshen.h

$ ./tes
hello makefile 01
zhanshen <span class="token function">sum</span> <span class="token number">1</span>+2<span class="token operator">=</span><span class="token number">3</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="多文件夹例子" tabindex="-1"><a class="header-anchor" href="#多文件夹例子" aria-hidden="true">#</a> 多文件夹例子</h3><h4 id="例子01" tabindex="-1"><a class="header-anchor" href="#例子01" aria-hidden="true">#</a> 例子01</h4><p>但是在日常的生产活动中，我们都是多文件夹的，所以这种情况我们需要研究。</p><p>我们的文件结构如下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">.</span>
<span class="token operator">|</span>-- include
<span class="token operator">|</span>   <span class="token variable"><span class="token variable">\`</span>-- zhanshen.h
<span class="token operator">|</span>-- main.c
<span class="token variable">\`</span></span>-- makefile

<span class="token number">1</span> directory, <span class="token number">3</span> files
</code></pre></div><p>我们把上章节的例子中的 <code>zhanshen.h</code> 移到了新建的 <code>include</code> 文件夹中去了，这时候我们执行 <code>make</code> 命令观察一下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span>

g++ <span class="token parameter variable">-c</span> main.c
main.c:2:10: fatal error: zhanshen.h: No such <span class="token function">file</span> or directory
 <span class="token comment">#include &quot;zhanshen.h&quot;</span>
          ^~~~~~~~~~~~
compilation terminated.
makefile:7: recipe <span class="token keyword">for</span> target <span class="token string">&#39;main.o&#39;</span> failed
make: *** <span class="token punctuation">[</span>main.o<span class="token punctuation">]</span> Error <span class="token number">1</span>
</code></pre></div><p>很明显，找不到了头文件了，此时该怎么办呢？我们需要修改 makefie:</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>objects <span class="token operator">=</span> main.o

<span class="token target symbol">test</span><span class="token punctuation">:</span> <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
        g++ -o test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>

<span class="token target symbol">main.o</span><span class="token punctuation">:</span> main.c
        g++ -c main.c -I <span class="token keyword">include</span>

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> clean
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
        rm test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重点在第 7 行，我们增加了 <code>-I</code> 选项，后面跟随了我们 <code>zhanshen.h</code> 所在的目录，这样 makefile 就能自己去 <code>include</code> 文件夹下面找到 <code>zhanshen.h</code> 了。</p><h4 id="例子02" tabindex="-1"><a class="header-anchor" href="#例子02" aria-hidden="true">#</a> 例子02</h4><p>在日常的生产中，我们通常不会在头文件中去定义函数（接口）的具体实现，头文件只是用作一个申明的作用，在这种情况下，我们的代码结构可能是这样的：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">.</span>
<span class="token operator">|</span>-- include
<span class="token operator">|</span>   <span class="token operator">|</span>-- zhanshen.c
<span class="token operator">|</span>   <span class="token variable"><span class="token variable">\`</span>-- zhanshen.h
<span class="token operator">|</span>-- main.c
<span class="token variable">\`</span></span>-- makefile
</code></pre></div><p>新增的 <code>zhanshen.c</code> 内容如下：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;zhanshen.h&quot;</span></span>
<span class="token keyword">int</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> x<span class="token punctuation">,</span> <span class="token keyword">int</span> y<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>修改后的 <code>zhanshen.h</code> 内容如下：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">__SUM_H__</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">__SUM_H__</span></span>
<span class="token keyword">int</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> x<span class="token punctuation">,</span> <span class="token keyword">int</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
</code></pre></div><p>此时我们执行 <code>make</code> 命令会报错：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span>

g++ <span class="token parameter variable">-o</span> <span class="token builtin class-name">test</span> main.o
main.o: In <span class="token keyword">function</span> <span class="token variable"><span class="token variable">\`</span>main&#39;:
main.c:<span class="token punctuation">(</span>.text+0x1f<span class="token punctuation">)</span>: undefined reference to <span class="token variable">\`</span></span>add<span class="token punctuation">(</span>int, int<span class="token punctuation">)</span><span class="token string">&#39;
collect2: error: ld returned 1 exit status
makefile:4: recipe for target &#39;</span>test&#39; failed
make: *** <span class="token punctuation">[</span>test<span class="token punctuation">]</span> Error <span class="token number">1</span>
</code></pre></div><p>（这个错误折磨了我好几天，郁闷，太菜了，郁闷）</p><p>解决方案是，对 makefile 进行改造：</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>objects <span class="token operator">=</span> main.o zhanshen.o

<span class="token target symbol">test</span><span class="token punctuation">:</span> <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
        g++ -o test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>

<span class="token target symbol">main.o</span><span class="token punctuation">:</span> main.c <span class="token keyword">include</span>/zhanshen.h
        g++ -c main.c -I <span class="token keyword">include</span>

<span class="token target symbol">zhanshen.o</span><span class="token punctuation">:</span>
        g++ -c <span class="token keyword">include</span>/zhanshen.c

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> clean
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
        rm test <span class="token variable">$</span><span class="token punctuation">(</span>objects<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="problems" tabindex="-1"><a class="header-anchor" href="#problems" aria-hidden="true">#</a> Problems</h2><p>还有几个问题需要解决的，在这列举出来：</p><ol><li>全局跨文件夹如何引用？</li><li>变量的应用</li><li>操作符</li></ol><h2 id="reference" tabindex="-1"><a class="header-anchor" href="#reference" aria-hidden="true">#</a> Reference</h2><hr class="footnotes-sep">`,76),r={class:"footnotes"},u={class:"footnotes-list"},k={id:"footnote1",class:"footnote-item"},m={href:"https://seisman.github.io/how-to-write-makefile/index.html",target:"_blank",rel:"noopener noreferrer"},h=n("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1),v={id:"footnote2",class:"footnote-item"},b={href:"https://github.com/TheNetAdmin/Makefile-Templates.git",target:"_blank",rel:"noopener noreferrer"},f=n("a",{href:"#footnote-ref2",class:"footnote-backref"},"↩︎",-1);function g(y,x){const s=c("ExternalLinkIcon");return o(),i("div",null,[d,n("section",r,[n("ol",u,[n("li",k,[n("p",null,[n("a",m,[a("跟我一起写Makefile"),e(s)]),a(),h])]),n("li",v,[n("p",null,[n("a",b,[a("Makefile-Templates GitHub"),e(s)]),a(),f])])])])])}const $=t(p,[["render",g],["__file","cmake_makefile.html.vue"]]);export{$ as default};
