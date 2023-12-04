import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as c,c as i,e as o,a as n,b as s,d as e,f as l}from"./app-22cda79c.js";const d={},u=n("p",null,"本文主要涉及的内容有：",-1),r=n("ol",null,[n("li",null,"目标文件的研究；"),n("li",null,"Segment vs Section;"),n("li",null,"objdump 细节；"),n("li",null,"从 readelf 走进 ELF 文件")],-1),b=l(`<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><p>本文章主要是《程序员的自我修养》的读书笔记。</p><h2 id="目标文件" tabindex="-1"><a class="header-anchor" href="#目标文件" aria-hidden="true">#</a> 目标文件</h2><h3 id="目标文件的格式" tabindex="-1"><a class="header-anchor" href="#目标文件的格式" aria-hidden="true">#</a> 目标文件的格式</h3><ul><li><code>.o</code> 目标文件，就是编译后但是还未链接的那些中间文件。</li><li><code>.so</code> Linux 下的动态链接库。</li><li><code>.elf</code> Linux 下的可执行文件。</li><li><code>.a</code> Linux 下的静态链接库。</li></ul><p>这些都是按照可执行文件的格式存储的。</p><p>为了更加直观，我们把书中的表格也引用过来：</p><table><thead><tr><th>ELF 文件类型</th><th>说明</th><th>实例</th></tr></thead><tbody><tr><td>可重定位文件<br><em>Relocatable</em></td><td>包含了代码和数据，可以被用来链接成可执行文件或者共享目标文件；静态链接库也可以属于这一类</td><td>.o, .obj</td></tr><tr><td>可执行文件<br><em>Executable</em></td><td>包含了可以直接执行的文件，一般都没有扩展名</td><td>elf, /bin/bash, exe</td></tr><tr><td>共享目标文件<br><em>Shared Object</em></td><td>包含了代码和数据，可以在以下两种情况中应用：<br>1. 链接器使用这种文件跟其他的可重定位文件和共享目录链接，产生新的目标文件；<br>2. 动态连接器将几个这种文件与可执行文件结合，作为进程映像的一部分来执行。</td><td>.so, DLL</td></tr><tr><td>核心转储文件</td><td>core dump file, 当进程意外终止的时候，系统可以将该进程的地址空间的内容及终止时的一些其他信息转储到核心转储文件</td><td>core dump</td></tr></tbody></table><p>如果在遇到不确定的情况下，可以在命令行中使用 <code>file</code> 命令来查看相应的文件格式。</p><p>注意到以上表格中的文件格式都可统一称为<strong>目标文件</strong>。</p><div class="hint-container tip"><p class="hint-container-title">可重定位文件 .o</p><p>简单理解的话，编译后生成的文件就是可重定位文件。可以由 .s 文件得到，<code>gcc -c xxx.s -o xxx.o</code>;</p></div><h3 id="segement" tabindex="-1"><a class="header-anchor" href="#segement" aria-hidden="true">#</a> Segement</h3><p>那么目标文件中都有什么呢？除了必须有的编译后的机器指令代码和数据之外，还包括了链接时所需要的一些信息：符号表、调试信息、字符串等。这些链接所需要的信息都被存储在**段(Segment)**中，也可以称作节(Section).</p><p>程序代码编译后的机器指令经常被放在<strong>代码段</strong>中，代码段常见的名字有 .code 和 .text; 全局遍历和静态变量数据经常被放在<strong>数据段</strong>中，一般的名字都叫做 .data. 除此之外，还有一个 BSS 段，其中主要保存的就是未初始化的全局变量和局部静态变量。</p><table><thead><tr><th>段</th><th>含义</th></tr></thead><tbody><tr><td>File Header</td><td>描述了整个文件的属性。<br>除此之外，还会包括一个段表，用于描述文件中各个段的数组，其内容是各个段在该文件中的偏移位置以及段的属性。</td></tr><tr><td>.text section</td><td>编译后的机器代码。</td></tr><tr><td>.data section</td><td>已初始化的全局变量和局部静态变量。</td></tr><tr><td>.bss section</td><td>未初始化的全局变量和局部静态变量。</td></tr></tbody></table><p>分段的原因和优点如下列举：</p><ul><li><p>程序被装载后，数据段是可读写的，而代码段（指令区域）是只读的；</p></li><li><p>将代码段和数据段分开，有助于利用到现在计算机的 icache 和 dcache.</p></li><li><p>有利于代码段的共享；</p></li></ul><p>需要注意，有时候会遇到 .rodata 段，这个段中存放的是只读数据，即对这个段的所有操作都当作非法处理；其次还在语义上支持了 C++ 的 <code>const</code> 关键字。</p><h3 id="section" tabindex="-1"><a class="header-anchor" href="#section" aria-hidden="true">#</a> Section</h3><p>笔者把 section 的研究<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup>相关的内容放在一起，这样可以对比分析 section 和 segment 的区别，方便我们的理解。</p><h3 id="objdump" tabindex="-1"><a class="header-anchor" href="#objdump" aria-hidden="true">#</a> objdump</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>objdump <span class="token parameter variable">-h</span> xxx.o
</code></pre></div><p>上述的 -h 选项是可以打印出 elf 文件每个段的基本信息。其中需要注意的是，CONTENTS 属性用来表示该段在文件中存在，如果没有这个属性的字段或者是 0, 我们就可以认为这个属性段在文件中是不存在的。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>objdump <span class="token parameter variable">-s</span> <span class="token parameter variable">-d</span> xxx.o
</code></pre></div><p>-s 参数可以将所有段的内容以 16 进制的方式打印出来；</p><p>-d 参数可以将所有包含指令的段反汇编。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>objdump <span class="token parameter variable">-s</span> <span class="token parameter variable">-d</span> <span class="token parameter variable">-x</span> xxx.o
</code></pre></div><p>-x 参数可以打印出详细信息，比如说这个文件里面的段，每个段具体的内容等。</p><h4 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> example</h4><p>我们给出来一个示例的 C 文件，方便我们理解：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">/*
 * SimpleSection.c
 *
 * Linux:
 * gcc -c SimpleSection.c
 *
 * Windows:
 * cl SimpleSection.c /c /Za
 */</span>
<span class="token keyword">int</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>format<span class="token punctuation">,</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> global_init_var <span class="token operator">=</span> <span class="token number">84</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> global_uninit_var<span class="token punctuation">;</span>
<span class="token keyword">void</span> <span class="token function">func1</span><span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%d\\n&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token keyword">int</span> static_var <span class="token operator">=</span> <span class="token number">85</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token keyword">int</span> static_var2<span class="token punctuation">;</span>
    <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> b<span class="token punctuation">;</span>
    <span class="token function">func1</span><span class="token punctuation">(</span>static_var <span class="token operator">+</span> static_var2 <span class="token operator">+</span> a <span class="token operator">+</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> a<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在控制台执行：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>gcc <span class="token parameter variable">-c</span> SimpleSection.c
</code></pre></div><p>然后使用 objdump 查看其信息，-h 选项打印出每一个段的基本信息：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>objdump <span class="token parameter variable">-h</span> SimpleSection.o
</code></pre></div><p>出来的信息如下所示(看起来不整洁的话可以换为截图)：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>SimpleSection.o:     <span class="token function">file</span> <span class="token function">format</span> elf64-x86-64

Sections:
Idx Name          Size      VMA               LMA               File off  Algn
  <span class="token number">0</span> .text         00000057  0000000000000000  0000000000000000  00000040  <span class="token number">2</span>**0
                  CONTENTS, ALLOC, LOAD, RELOC, READONLY, CODE
  <span class="token number">1</span> .data         00000008  0000000000000000  0000000000000000  00000098  <span class="token number">2</span>**2
                  CONTENTS, ALLOC, LOAD, DATA
  <span class="token number">2</span> .bss          00000004  0000000000000000  0000000000000000  000000a0  <span class="token number">2</span>**2
                  ALLOC
  <span class="token number">3</span> .rodata       00000004  0000000000000000  0000000000000000  000000a0  <span class="token number">2</span>**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  <span class="token number">4</span> .comment      0000002a  0000000000000000  0000000000000000  000000a4  <span class="token number">2</span>**0
                  CONTENTS, READONLY
  <span class="token number">5</span> .note.GNU-stack 00000000  0000000000000000  0000000000000000  000000ce  <span class="token number">2</span>**0
                  CONTENTS, READONLY
  <span class="token number">6</span> .eh_frame     00000058  0000000000000000  0000000000000000  000000d0  <span class="token number">2</span>**3
                  CONTENTS, ALLOC, LOAD, RELOC, READONLY, DATA
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们使用 -s 参数将所有的内容以 16 进制的方式打印出来，-d 参数将所有包含指令的段反汇编，如下所示：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objdump <span class="token parameter variable">-s</span> <span class="token parameter variable">-d</span> SimpleSection.o

SimpleSection.o:     <span class="token function">file</span> <span class="token function">format</span> elf64-x86-64

Contents of section .text:
 0000 554889e5 4883ec10 897dfc8b 45fc89c6  UH<span class="token punctuation">..</span>H<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">}</span><span class="token punctuation">..</span>E<span class="token punctuation">..</span>.
 0010 488d3d00 000000b8 00000000 e8000000  H.<span class="token operator">=</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.
 0020 0090c9c3 554889e5 4883ec10 c745f801  <span class="token punctuation">..</span><span class="token punctuation">..</span>UH<span class="token punctuation">..</span>H<span class="token punctuation">..</span><span class="token punctuation">..</span>E<span class="token punctuation">..</span>
 0030 0000008b <span class="token number">15000000</span> 008b0500 00000001  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
 0040 c28b45f8 01c28b45 fc01d089 c7e80000  <span class="token punctuation">..</span>E<span class="token punctuation">..</span><span class="token punctuation">..</span>E<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
 0050 00008b45 f8c9c3                      <span class="token punctuation">..</span>.E<span class="token punctuation">..</span>.
Contents of section .data:
 0000 <span class="token number">54000000</span> <span class="token number">55000000</span>                    T<span class="token punctuation">..</span>.U<span class="token punctuation">..</span>.
Contents of section .rodata:
 0000 25640a00                             %d<span class="token punctuation">..</span>
Contents of section .comment:
 0000 00474343 3a202855 62756e74 7520372e  .GCC: <span class="token punctuation">(</span>Ubuntu <span class="token number">7</span>.
 0010 352e302d <span class="token number">33756275</span> 6e747531 7e31382e  <span class="token number">5.0</span>-3ubuntu1~18.
 0020 <span class="token number">30342920</span> 372e352e <span class="token number">3000</span>               04<span class="token punctuation">)</span> <span class="token number">7.5</span>.0.
Contents of section .eh_frame:
 0000 <span class="token number">14000000</span> 00000000 017a5200 01781001  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.zR<span class="token punctuation">..</span>x<span class="token punctuation">..</span>
 0010 1b0c0708 <span class="token number">90010000</span> 1c000000 1c000000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
 0020 00000000 <span class="token number">24000000</span> 00410e10 8602430d  <span class="token punctuation">..</span><span class="token punctuation">..</span>$<span class="token punctuation">..</span><span class="token punctuation">..</span>A<span class="token punctuation">..</span><span class="token punctuation">..</span>C.
 0030 065f0c07 08000000 1c000000 3c000000  ._<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token operator">&lt;</span><span class="token punctuation">..</span>.
 0040 00000000 <span class="token number">33000000</span> 00410e10 8602430d  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token number">3</span><span class="token punctuation">..</span><span class="token punctuation">..</span>A<span class="token punctuation">..</span><span class="token punctuation">..</span>C.
 0050 066e0c07 08000000                    .n<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>

Disassembly of section .text:

0000000000000000 <span class="token operator">&lt;</span>func<span class="token operator"><span class="token file-descriptor important">1</span>&gt;</span>:
   <span class="token number">0</span>:   <span class="token number">55</span>                      push   %rbp
   <span class="token number">1</span>:   <span class="token number">48</span> <span class="token number">89</span> e5                mov    %rsp,%rbp
   <span class="token number">4</span>:   <span class="token number">48</span> <span class="token number">83</span> ec <span class="token number">10</span>             sub    <span class="token variable">$0x10</span>,%rsp
   <span class="token number">8</span>:   <span class="token number">89</span> 7d fc                mov    %edi,-0x4<span class="token punctuation">(</span>%rbp<span class="token punctuation">)</span>
   b:   8b <span class="token number">45</span> fc                mov    -0x4<span class="token punctuation">(</span>%rbp<span class="token punctuation">)</span>,%eax
   e:   <span class="token number">89</span> c6                   mov    %eax,%esi
  <span class="token number">10</span>:   <span class="token number">48</span> 8d 3d 00 00 00 00    lea    0x0<span class="token punctuation">(</span>%rip<span class="token punctuation">)</span>,%rdi        <span class="token comment"># 17 &lt;func1+0x17&gt;</span>
  <span class="token number">17</span>:   b8 00 00 00 00          mov    <span class="token variable">$0x0</span>,%eax
  1c:   e8 00 00 00 00          callq  <span class="token number">21</span> <span class="token operator">&lt;</span>func1+0x2<span class="token operator"><span class="token file-descriptor important">1</span>&gt;</span>
  <span class="token number">21</span>:   <span class="token number">90</span>                      nop
  <span class="token number">22</span>:   c9                      leaveq
  <span class="token number">23</span>:   c3                      retq

0000000000000024 <span class="token operator">&lt;</span>main<span class="token operator">&gt;</span>:
  <span class="token number">24</span>:   <span class="token number">55</span>                      push   %rbp
  <span class="token number">25</span>:   <span class="token number">48</span> <span class="token number">89</span> e5                mov    %rsp,%rbp
  <span class="token number">28</span>:   <span class="token number">48</span> <span class="token number">83</span> ec <span class="token number">10</span>             sub    <span class="token variable">$0x10</span>,%rsp
  2c:   c7 <span class="token number">45</span> f8 01 00 00 00    movl   <span class="token variable">$0x1</span>,-0x8<span class="token punctuation">(</span>%rbp<span class="token punctuation">)</span>
  <span class="token number">33</span>:   8b <span class="token number">15</span> 00 00 00 00       mov    0x0<span class="token punctuation">(</span>%rip<span class="token punctuation">)</span>,%edx        <span class="token comment"># 39 &lt;main+0x15&gt;</span>
  <span class="token number">39</span>:   8b 05 00 00 00 00       mov    0x0<span class="token punctuation">(</span>%rip<span class="token punctuation">)</span>,%eax        <span class="token comment"># 3f &lt;main+0x1b&gt;</span>
  3f:   01 c2                   <span class="token function">add</span>    %eax,%edx
  <span class="token number">41</span>:   8b <span class="token number">45</span> f8                mov    -0x8<span class="token punctuation">(</span>%rbp<span class="token punctuation">)</span>,%eax
  <span class="token number">44</span>:   01 c2                   <span class="token function">add</span>    %eax,%edx
  <span class="token number">46</span>:   8b <span class="token number">45</span> fc                mov    -0x4<span class="token punctuation">(</span>%rbp<span class="token punctuation">)</span>,%eax
  <span class="token number">49</span>:   01 d0                   <span class="token function">add</span>    %edx,%eax
  4b:   <span class="token number">89</span> c7                   mov    %eax,%edi
  4d:   e8 00 00 00 00          callq  <span class="token number">52</span> <span class="token operator">&lt;</span>main+0x2e<span class="token operator">&gt;</span>
  <span class="token number">52</span>:   8b <span class="token number">45</span> f8                mov    -0x8<span class="token punctuation">(</span>%rbp<span class="token punctuation">)</span>,%eax
  <span class="token number">55</span>:   c9                      leaveq
  <span class="token number">56</span>:   c3                      retq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里面有一个细节需要注意，我们如何定位函数的地址，对于 main 函数，我们可以看到其地址是 <code>0000000000000024</code>, 而在第 8 行我们可以看到 <code>0020 0090c9c3 554889e5 4883ec10 c745f801</code>, 这行的意思就是起始地址是 <code>0020</code>, 所以我们 +4 就可以得到函数的起始汇编代码 <code>55</code>.</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>Contents of section .data:
 0000 <span class="token number">54000000</span> <span class="token number">55000000</span>                    T<span class="token punctuation">..</span>.U<span class="token punctuation">..</span>.
</code></pre></div><p>上述 <code>54000000</code> 涉及到了<strong>字节序</strong>的问题，这里的实际上存储的是 <code>0x54</code> 即十进制的 84.</p><h3 id="readelf" tabindex="-1"><a class="header-anchor" href="#readelf" aria-hidden="true">#</a> readelf</h3><p>同时还有一个 <strong>readelf</strong> 工具可以作为 objdump 的对照：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ readelf <span class="token parameter variable">-h</span> SimpleSection.o                                                     

ELF Header:
  Magic:   7f <span class="token number">45</span> 4c <span class="token number">46</span> 02 01 01 00 00 00 00 00 00 00 00 00
  Class:                             ELF64
  Data:                              <span class="token number">2</span>&#39;s complement, little endian
  Version:                           <span class="token number">1</span> <span class="token punctuation">(</span>current<span class="token punctuation">)</span>
  OS/ABI:                            UNIX - System V
  ABI Version:                       <span class="token number">0</span>
  Type:                              REL <span class="token punctuation">(</span>Relocatable <span class="token function">file</span><span class="token punctuation">)</span>
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  Entry point address:               0x0
  Start of program headers:          <span class="token number">0</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  Start of section headers:          <span class="token number">1104</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  Flags:                             0x0
  Size of this header:               <span class="token number">64</span> <span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>
  Size of program headers:           <span class="token number">0</span> <span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>
  Number of program headers:         <span class="token number">0</span>
  Size of section headers:           <span class="token number">64</span> <span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>
  Number of section headers:         <span class="token number">13</span>
  Section header string table index: <span class="token number">12</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>readelf</code> 可以来详细查看 elf 文件，使用 -h 选项可以查看 elf 的文件头。</p><p>上述的字段在 <code>/usr/include/elf.h</code> 都有定义，我们参考下表，对其做一个大概的认知。</p><p>Linux Elf32_Ehdr 的结构体如下(64 位对应的也可以找到，为 <code>Elf64_Ehdr</code>)：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">char</span> e_ident<span class="token punctuation">[</span><span class="token number">16</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    Elf32_Half e_type<span class="token punctuation">;</span>
    Elf32_Half e_machine<span class="token punctuation">;</span>
    Elf32_Word e_version<span class="token punctuation">;</span>
    Elf32_Addr e_entry<span class="token punctuation">;</span>
    Elf32_Off e_phoff<span class="token punctuation">;</span>
    Elf32_Off e_shoff<span class="token punctuation">;</span>
    Elf32_Word e_flags<span class="token punctuation">;</span>
    Elf32_Half e_ehsize<span class="token punctuation">;</span>
    Elf32_Half e_phentsize<span class="token punctuation">;</span>
    Elf32_Half e_phnum<span class="token punctuation">;</span>
    Elf32_Half e_shentsize<span class="token punctuation">;</span>
    Elf32_Half e_shnum<span class="token punctuation">;</span>
    Elf32_Half e_shstrndx<span class="token punctuation">;</span>
<span class="token punctuation">}</span> Elf32_Ehdr<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这些成员与 readelf 的打印的对应关系为：</p><table><thead><tr><th>成员</th><th>readelf output</th></tr></thead><tbody><tr><td>e_ident</td><td>Magic: 7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00<br> Class: ELF64<br> Data: 2&#39;s complement, little endian<br> Version: 1 (current)<br> OS/ABI: UNIX - System V<br> ABI Version: 0</td></tr><tr><td>e_type</td><td>Type: REL (Relocatable file)<br>elf 文件类型</td></tr><tr><td>e_machine</td><td>Machine: Advanced Micro Devices X86-64<br>elf 文件的 CPU 平台属性；<strong>相关常量以 EM 开头</strong></td></tr><tr><td>e_version</td><td>Version: 0x1<br>elf 版本号，一般为常量 1</td></tr><tr><td>e_entry</td><td>Entry point address: 0x0<br>入口地址，ELF 程序入口的虚拟地址，操作系统在加载完进程后从这个地址开始指向进程的指令；可重定位文件没有入口地址，该值为 0</td></tr><tr><td>e_phoff</td><td>Start of program headers: 0 (bytes into file)</td></tr><tr><td>e_shoff</td><td>Start of section headers: 1104 (bytes into file)<br>段表在文件中的偏移，1104 表示从段表的低 1104 个字节开始</td></tr></tbody></table><p>对于 ELF 魔数，我们可以进行分析。</p><table><thead><tr><th>7f 45 4c 46</th><th>02</th><th>01</th><th>01</th><th>00 00 00 00 00 00 00 00 00</th></tr></thead><tbody><tr><td>4字节的，ELF 文件通用的，ELF 文件的魔数</td><td>ELF 文件类<br>0 无效文件<br>1 32 位 ELF 文件<br>2 64 位 ELF 文件</td><td>字节序<br>0 无效格式<br>1 小端格式<br>2 大端格式</td><td>ELF 版本</td><td></td></tr></tbody></table><h4 id="use-readelf" tabindex="-1"><a class="header-anchor" href="#use-readelf" aria-hidden="true">#</a> Use readelf</h4><p>🔴🔴🔴 Q：能否从 ELF 文件中得到符号表？</p><hr class="footnotes-sep">`,56),m={class:"footnotes"},v={class:"footnotes-list"},k={id:"footnote1",class:"footnote-item"},h={href:"https://segmentfault.com/a/1190000016766079",target:"_blank",rel:"noopener noreferrer"},f={href:"https://segmentfault.com/a/1190000016766079",target:"_blank",rel:"noopener noreferrer"},x=n("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1);function g(_,E){const a=p("ExternalLinkIcon");return c(),i("div",null,[u,r,o(" more "),b,n("section",m,[n("ol",v,[n("li",k,[n("p",null,[n("a",h,[s("ELF文件解析（二）：ELF header详解"),e(a)]),s("]"),n("a",f,[s("https://segmentfault.com/a/1190000016766079"),e(a)]),s(),x])])])])])}const y=t(d,[["render",g],["__file","linkers_loaders.html.vue"]]);export{y as default};
