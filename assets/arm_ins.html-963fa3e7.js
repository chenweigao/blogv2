import{_ as d}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as c,c as r,a as e,b as a,d as s,f as n}from"./app-22cda79c.js";const l={},p=n(`<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><p>本文章作为一个 ARM 指令的速查表使用。</p><div class="language-assembly" data-ext="assembly"><pre class="language-assembly"><code>MNEMONIC{S}{condition} {Rd}, Operand1, Operand2
</code></pre></div><p>上面就是 ARM 汇编指令的一个通用的格式说明，下面对每一个字段进行具体的说明：</p><ul><li>MNEMONIC: 指令的助记符，如 ADD</li><li>S: 可选的扩展位，如果指令后带了这个，将根据计算结果更新 CPSR 寄存器中相应的 FLAG</li><li>condition: 执行条件，如果没有指定，则默认位 AL（无条件执行）</li><li>Operand1: 第一个操作数，可以是寄存器或者立即数</li><li>Operand2: 第二个操作数，可变的，可以是一个寄存器或者立即数，甚至带移位操作的寄存器</li></ul><p>对于 Operand2 的解释和研究举例：</p><div class="language-assembly" data-ext="assembly"><pre class="language-assembly"><code>#123		@ - 立即数
Rx			@ - 寄存器，如 R1
Rx, ASR n	 @ - 对寄存器中的值进行算术右移 n 位后的值
Rx RRX		@ - 对寄存器中的值进行带扩展的循环右移 1 位后的值
</code></pre></div><h2 id="instruction" tabindex="-1"><a class="header-anchor" href="#instruction" aria-hidden="true">#</a> Instruction</h2><table><thead><tr><th>Instruction</th><th>Example</th><th>Remark</th></tr></thead><tbody><tr><td>SUB</td><td></td><td>不进位的减法</td></tr><tr><td></td><td></td><td></td></tr></tbody></table><h3 id="sub" tabindex="-1"><a class="header-anchor" href="#sub" aria-hidden="true">#</a> sub</h3><p>减法指令，并且是不进位的减法。</p><h3 id="b" tabindex="-1"><a class="header-anchor" href="#b" aria-hidden="true">#</a> b</h3><p>（branch）跳转到某地址（无返回）, 不会改变 <em>lr (x30)</em> 寄存器的值；一般是本方法内的跳转，如 <code>while</code> 循环，<code>if else</code> 等 ，如：</p><div class="language-assembly" data-ext="assembly"><pre class="language-assembly"><code>b LBB0_1      ; 直接跳转到标签 ‘LLB0_1’ 处开始执行
</code></pre></div><p>b 指令的一些变体<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup></p><p><code>bl</code>: 跳转到标号出执行</p><p><code>b.le</code> ：判断上面cmp的值是小于等于 执行标号，否则直接往下走</p><p><code>b.ge</code> 大于等于 执行地址 否则往下</p><p><code>b.lt</code> 判断上面camp的值是 小于 执行后面的地址中的方法 否则直接往下走</p><p><code>b.gt</code> 大于 执行地址 否则往下</p><p><code>b.eq</code> 等于 执行地址 否则往下</p><p><code>b.hi</code> 比较结果是无符号大于，执行地址中的方法，否则不跳转</p><p><code>b.hs</code> 指令是判断是否无符号小于</p><p><code>b.ls</code> 指令是判断是否无符号大于</p><p><code>b.lo</code> 指令是判断是否无符号大于等于</p><p>我们总结了一些常见的跳转指令的集合，如下所示：</p><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token punctuation">[</span>
 <span class="token string">&#39;b.pl&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.ge&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.ls&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.vs&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;tbnz&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.gt&#39;</span><span class="token punctuation">,</span> 
 <span class="token string">&#39;b&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;cbnz&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;svc&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.mi&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.lo&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;tbz&#39;</span><span class="token punctuation">,</span> 
 <span class="token string">&#39;b.ne&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.hi&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;br&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.le&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.eq&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;ret&#39;</span><span class="token punctuation">,</span> 
 <span class="token string">&#39;bl&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.lt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;blr&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b.hs&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;cbz&#39;</span>
<span class="token punctuation">]</span>
</code></pre></div><h3 id="tst" tabindex="-1"><a class="header-anchor" href="#tst" aria-hidden="true">#</a> tst</h3><p>把一个寄存器的内容和另一个寄存器的内容进行按位与操作，并根据结果更新 CPSR 中条件标志位的值，当前运算结果为 1, 则 Z=0, 反之 Z=1.</p><h3 id="fcvtz" tabindex="-1"><a class="header-anchor" href="#fcvtz" aria-hidden="true">#</a> fcvtz</h3><p>浮点数转换为定点数。</p><h3 id="cbz" tabindex="-1"><a class="header-anchor" href="#cbz" aria-hidden="true">#</a> cbz</h3><p>和 0 比较（Compare），如果结果为零（Zero）就转移（只能跳到后面的指令）;</p><div class="language-text" data-ext="text"><pre class="language-text"><code>CBZ Rn, label
</code></pre></div><p><code>Rn</code>: is the register holding the operand.</p><p><code>label</code>: is the branch destination.</p><p>同样的，还有不为 0 的时候跳转：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>CBNZ Rn, label
</code></pre></div><h3 id="tbnz" tabindex="-1"><a class="header-anchor" href="#tbnz" aria-hidden="true">#</a> tbnz</h3><div class="language-text" data-ext="text"><pre class="language-text"><code>TBNZ X1, #3, label
</code></pre></div><p>上述汇编的含义为，如果 <code>x1</code> 寄存器的第 3 位不为 0, 则跳转到 label.</p><p>还有用法如下：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>tbnz w16, #0, #+0xc (addr 0x1baecc)
</code></pre></div><p>按照上述的例子可以推断，判断 <code>w16</code> 的第 0 位是否为 0, 如果不为 0, 则跳转到上述地址。</p><h3 id="sxtw" tabindex="-1"><a class="header-anchor" href="#sxtw" aria-hidden="true">#</a> sxtw</h3><p><code>sxtw</code> 指令的使用方法如下：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>sxtw x7, w6
</code></pre></div><p>其含义为将 <code>w6</code> 进行符号位扩展，并传给 <code>x7</code>; <code>w6</code> 为 <code>x7</code> 的低 32 位.</p>`,48),i=e("code",null,"sxtw",-1),h={href:"https://egguncle.github.io/2019/03/26/%E4%B8%80%E4%B8%AAinclude%E5%BC%95%E8%B5%B7%E7%9A%84%E6%83%A8%E6%A1%88/",target:"_blank",rel:"noopener noreferrer"},x=n(`<h2 id="内存读写" tabindex="-1"><a class="header-anchor" href="#内存读写" aria-hidden="true">#</a> 内存读写</h2><p>ARM 使用加载存储模型进行内存访问，这意味着只有加载/存储（<strong>LDR 和 STR</strong>）指令才能访问内存。在 x86 上，大多数指令都可以直接对内存中的数据进行操作，而在ARM上，<strong>必须先将内存中的数据从内存移到寄存器中，然后再进行操作</strong>。这意味着递增ARM上特定内存地址上的 32 位值将需要三种类型的指令（加载，递增和存储），以便首先将特定地址上的值加载到寄存器中，在寄存器中递增值，以及将其从寄存器存储回存储器<sup class="footnote-ref"><a href="#footnote2">[2]</a><a class="footnote-anchor" id="footnote-ref2"></a></sup>。</p><h3 id="ldr" tabindex="-1"><a class="header-anchor" href="#ldr" aria-hidden="true">#</a> ldr</h3><p>加载一个寄存器：</p><ul><li>32 位常量</li><li>地址</li></ul><p>用于从存储器中将一个 32 位的字数据传送到目的寄存器中。</p><ul><li><p>将寄存器 x1 的值作为地址，取该内存地址的值放入寄存器 x0 中：<code>x0 &lt;- [x1]</code></p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldr x0, [x1]
</code></pre></div></li><li><p>将栈内存 [sp + 0x8] 处的值读取到 w8 寄存器中</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldr w8, [sp, #0x8]
</code></pre></div></li><li><p>将寄存器 x1 的值加上 4 作为内存地址, 取该内存地址的值放入寄存器 x0 中, 然后将寄存器 x1 的值加上 4 放入寄存器 x1 中: <code>x0 &lt;- [x1 + 4]; x1 &lt;- x1 + 4</code></p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldr x0, [x1, #4]!
</code></pre></div></li><li><p>将寄存器 x1 的值作为内存地址，取内该存地址的值放入寄存器 x0 中, 再将寄存器 x1 的值加上 4 放入寄存器 x1 中</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldr x0, [x1], #4
</code></pre></div></li><li><p>将寄存器 x1 和寄存器 x2 的值相加作为地址，取该内存地址的值放入寄存器 x0 中</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldr x0, [x1, x2]
</code></pre></div></li></ul><h3 id="ldur" tabindex="-1"><a class="header-anchor" href="#ldur" aria-hidden="true">#</a> ldur</h3><p>和 <code>ldr</code> 一样，只不过，<code>ldur</code> 后面的立即数是负数。</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldur w16, [x5, #-8]
</code></pre></div><h3 id="ldp" tabindex="-1"><a class="header-anchor" href="#ldp" aria-hidden="true">#</a> ldp</h3><p>举例来说：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldp	x20, x19, [sp, #0x150] 
</code></pre></div><p>简单可以理解为将栈弹出到 x20, x19 中。</p><h3 id="ldrb" tabindex="-1"><a class="header-anchor" href="#ldrb" aria-hidden="true">#</a> ldrb</h3><p>和下文中的 <code>strb</code> 的含义一样，将内存中的值读入寄存器中，并且只读取一个字节，也就是说把取到的数据放在目的寄存器的低 8 位，然后将高 24 位填充位 0。</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldrb w2, [x5, x2]
</code></pre></div><p>读取 <code>x5 + x2</code> 内存的值并且存储其低 8 位到 <code>w2</code> 中。</p>`,18),u=e("sup",{class:"footnote-ref"},[e("a",{href:"#footnote3"},"[3]"),e("a",{class:"footnote-anchor",id:"footnote-ref3"})],-1),g={href:"http://t.zoukankan.com/amanlikethis-p-3444411.html",target:"_blank",rel:"noopener noreferrer"},b=n(`<h3 id="ldrh" tabindex="-1"><a class="header-anchor" href="#ldrh" aria-hidden="true">#</a> ldrh</h3><p><code>ldrh</code> 和 <code>ldrb</code> 一样，不同之处在于 <code>ldrh</code> 会读入半个字长，就是 4 位。</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ldrh w2, [x5, x2, lsl #1]
</code></pre></div><p>将 <code>x5 + (x2 &lt;&lt; 1)</code> 的地址对应的值放入寄存器 <code>w2</code> 中，注意只放入读取到的值的最低 4 位，剩余的高 28 位填 0.</p><h3 id="ldrsw" tabindex="-1"><a class="header-anchor" href="#ldrsw" aria-hidden="true">#</a> ldrsw</h3><p>在 ARM 架构中，<code>LDRSW</code> 指令是用于从内存中读取一个 32 位带符号整数到寄存器的指令。<code>LDRSW</code> 的全称是“Load Register Signed Word”，其中的 <code>S</code> 表示的是 Signed，即有符号类型。</p><p>具体来说，<code>LDRSW</code> 指令的语法如下所示：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>LDRSW Xt, [Xn{,#0|,#Imm}] 
</code></pre></div><p>其中：</p><ul><li><code>Xt</code>：目标寄存器，用于存储从内存中读取的带符号整数。</li><li><code>Xn</code>：基地址寄存器，用于存储待读取数据的内存地址。</li><li><code>#Imm</code>：偏移量，用于计算实际要读取的内存地址，可以是 1~4 字节的立即数，根据指令变体的不同，也可能存在其他可选的偏移量格式。</li></ul><p>执行 <code>LDRSW</code> 指令时，它会从指定的内存地址中取得一个 32 位带符号整数，将其符号位扩展（sign extension）至 64 位，并将结果存储到目标寄存器中。需要注意的是，<code>LDRSW</code> 指令只能读取 32 位的有符号整数，如果需要读取其它类型的数据，则需要使用其他类型的 Load 指令。</p><p>总之，<code>LDRSW</code> 指令是 ARM 架构中的一种用于从内存中读取带符号整数的指令，可以广泛应用于各种需要使用 32 位有符号整数的场景中。</p><h3 id="adrp" tabindex="-1"><a class="header-anchor" href="#adrp" aria-hidden="true">#</a> adrp</h3><div class="language-text" data-ext="text"><pre class="language-text"><code>adrp x23, #-0x3ed000 (addr -0x234000)
</code></pre></div><p>adrp 一般用于获得地址，就我个人的理解而言，adrp 将当前 PC 所在的页的基地址计算得到并存储到寄存器中，后续根据这个寄存器中的基地址进行偏移运算。</p><p>引用一个博客中的一段描述<sup class="footnote-ref"><a href="#footnote4">[4]</a><a class="footnote-anchor" id="footnote-ref4"></a></sup>：</p><blockquote><p>adrp指令根据 PC 的偏移地址计算目标页地址。首先 adrp 将一个 21 位有符号立即数<strong>左移</strong> 12 位，得到一个 33 位的有符号数（最高位为符号位），接着将 PC地址的低 12 位清零，这样就得到了当前 PC 地址所在页的地址，然后将当前 PC 地址所在页的地址加上 33 位的有符号数，就得到了目标页地址，最后将目标页地址写入通用寄存器。此处页大小为 4KB，只是为了得到更大的地址范围，和虚拟内存的页大小没有关系。通过 adrp 指令，可以<strong>获取当前 PC 地址 ±4GB范围内的地址</strong>。通常的使用场景是先通过 adrp 获取一个基地址，然后再通过基地址的偏移地址获取具体变量的地址。</p></blockquote><p>从上面的描述中我们可以看出，adrp 的结果是与当前的 PC 有关的，通过当前 PC 地址的偏移地址计算目标地址，因此属于位置无关码；在示例中括号也给出了最终的偏移地址。</p><h3 id="stp" tabindex="-1"><a class="header-anchor" href="#stp" aria-hidden="true">#</a> stp</h3><p>入栈指令，store pair</p><h3 id="str" tabindex="-1"><a class="header-anchor" href="#str" aria-hidden="true">#</a> str</h3><p>(store register) 将寄存器中的值写入到内存中，如：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>str w9, [sp, #0x8] 
</code></pre></div><p>将寄存器 w9 中的值保存到栈内存 <code>[sp + 0x8]</code> 处。</p><h3 id="strb" tabindex="-1"><a class="header-anchor" href="#strb" aria-hidden="true">#</a> strb</h3><p>(store register byte) 将寄存器中的值写入到内存中（只存储一个字节），如：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>strb w8, [sp, #7] 
</code></pre></div><p>将寄存器 w8 中的低 1 字节的值保存到栈内存 <code>[sp + 7]</code> 处</p><h3 id="stlxr" tabindex="-1"><a class="header-anchor" href="#stlxr" aria-hidden="true">#</a> stlxr</h3><p>在 ARM 架构中，<code>STLXR</code> 指令是原子性的存储、条件执行和即时跳转指令。该指令用于在多核创建共享内存并发访问的场景中，对数据进行原子性操作，以保证数据的一致性和正确性。</p><p>具体来说，<code>STLXR</code> 指令的含义如下：</p><ul><li><code>STLXR</code>: Store Exclusive Register</li><li><code>Rd</code>: 目标寄存器，用于存储“存储操作”是否成功，取值为 0 或者 1。</li><li><code>Rt</code>: 源寄存器，其中存储“写入数据”。</li><li><code>Rn</code>: 目标地址寄存器，其中存储需要写入数据的内存地址。</li></ul><p>当执行 <code>STLXR</code> 指令时，它会将目标存储地址（<code>Rn</code>）处的数据与当前处理器正在执行的 CPU 的标识进行比较。如果这个位置的值与标识符相同，则将源寄存器（<code>Rt</code>）中的数据写入该位置，并将目标寄存器（<code>Rd</code>）设置为 1，表示存储成功；否则，将目标寄存器设置为 0，表示存储失败。</p><p>可以看出，<code>STLXR</code> 指令实现了一种快速锁定和释放内存地址的机制，使得在多核场景中，多个 CPU 可以同时读取和修改共享内存的数据，而不会出现资源竞争的情况。</p><h2 id="位操作" tabindex="-1"><a class="header-anchor" href="#位操作" aria-hidden="true">#</a> 位操作</h2><h3 id="ubfx" tabindex="-1"><a class="header-anchor" href="#ubfx" aria-hidden="true">#</a> ubfx</h3><p>举例说明：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>ubfx	x10, x3, #3, #29
</code></pre></div><p>含义为从 <code>x3</code> 寄存器的第 3 位开始，提取 29 位到 <code>x10</code> 寄存器中。剩余高位用 0 填充，即 无符号位域提取指令。</p><p>UBFX 指令一般有两种用法：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>UBFX Wd, Wn, #lsb, #width ; 32-bit
UBFX Xd, Xn, #lsb, #width ; 64-bit
</code></pre></div><h3 id="and" tabindex="-1"><a class="header-anchor" href="#and" aria-hidden="true">#</a> and</h3><p><code>AND</code> 为按位与操作。</p><p>我们结合一个 AND 指令的指令编码来分析一下 AND 指令中的细节。</p><p>指令如下：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>d2ffffe9 	mov	x9, #-281474976710656
</code></pre></div><p>二进制编码如下：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>1011 0010 0100 1111 1111 1011 1110 1001
</code></pre></div><p>结合 arm v8 手册，我们 <strong>@todo</strong>，以后研究该命令。</p><h3 id="lsl" tabindex="-1"><a class="header-anchor" href="#lsl" aria-hidden="true">#</a> lsl</h3><p><code>lsl</code> 为逻辑左移指令。</p><div class="language-text" data-ext="text"><pre class="language-text"><code>lsl	w9, w11, w9
</code></pre></div><p>左移指令分两种，可以给定寄存器或者立即数进行移位：</p><div class="language-text" data-ext="text"><pre class="language-text"><code>LSL &lt;Wd&gt;, &lt;Wn&gt;, #&lt;shift&gt; ; 32-bit
LSL &lt;Xd&gt;, &lt;Xn&gt;, #&lt;shift&gt; ; 64-bit
</code></pre></div><p>or</p><div class="language-text" data-ext="text"><pre class="language-text"><code>LSL &lt;Wd&gt;, &lt;Wn&gt;, &lt;Wm&gt; ; 32-bit
LSL &lt;Xd&gt;, &lt;Xn&gt;, &lt;Xm&gt; ; 64-bit
</code></pre></div><h3 id="lsr" tabindex="-1"><a class="header-anchor" href="#lsr" aria-hidden="true">#</a> lsr</h3><p><code>lsr</code> 为右移指令，用法和 <code>lsl</code> 相似。</p><hr class="footnotes-sep">`,59),f={class:"footnotes"},k={class:"footnotes-list"},v={id:"footnote1",class:"footnote-item"},_={href:"https://juejin.cn/post/6978137866152968222",target:"_blank",rel:"noopener noreferrer"},m=e("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1),R={id:"footnote2",class:"footnote-item"},L={href:"https://azeria-labs.com/memory-instructions-load-and-store-part-4/",target:"_blank",rel:"noopener noreferrer"},w=e("a",{href:"#footnote-ref2",class:"footnote-backref"},"↩︎",-1),S={id:"footnote3",class:"footnote-item"},B={href:"http://t.zoukankan.com/amanlikethis-p-3444411.html",target:"_blank",rel:"noopener noreferrer"},A=e("a",{href:"#footnote-ref3",class:"footnote-backref"},"↩︎",-1),X={id:"footnote4",class:"footnote-item"},C={href:"https://blog.csdn.net/u011037593/article/details/121877496",target:"_blank",rel:"noopener noreferrer"},z=e("a",{href:"#footnote-ref4",class:"footnote-backref"},"↩︎",-1);function y(D,W){const t=o("ExternalLinkIcon");return c(),r("div",null,[p,e("p",null,[a("这个博客上面展示了一个 "),i,a(" 导致的惨案："),e("a",h,[a("一个include引起的惨案"),s(t)])]),x,e("p",null,[a("关于其硬件原理的介绍，也可以参考这篇博客"),u,a("："),e("a",g,[a("ARM的STRB和LDRB指令分析"),s(t)])]),b,e("section",f,[e("ol",k,[e("li",v,[e("p",null,[e("a",_,[a("https://juejin.cn/post/6978137866152968222"),s(t)]),a(),m])]),e("li",R,[e("p",null,[e("a",L,[a("https://azeria-labs.com/memory-instructions-load-and-store-part-4/"),s(t)]),a(),w])]),e("li",S,[e("p",null,[e("a",B,[a("ARM的STRB和LDRB指令分析"),s(t)]),a(),A])]),e("li",X,[e("p",null,[e("a",C,[a("https://blog.csdn.net/u011037593/article/details/121877496"),s(t)]),a(),z])])])])])}const N=d(l,[["render",y],["__file","arm_ins.html.vue"]]);export{N as default};
