import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o as a,c as i,a as e,b as t,d as n,f as d}from"./app-22cda79c.js";const c={},h=d('<h1 id="xv6-6-828" tabindex="-1"><a class="header-anchor" href="#xv6-6-828" aria-hidden="true">#</a> XV6(6.828)</h1><blockquote><p>xv6: a simple, Unix-like teaching operating system.</p></blockquote><h2 id="foreword-and-acknowledgements" tabindex="-1"><a class="header-anchor" href="#foreword-and-acknowledgements" aria-hidden="true">#</a> Foreword and acknowledgements</h2><h3 id="risc-v-risk-five" tabindex="-1"><a class="header-anchor" href="#risc-v-risk-five" aria-hidden="true">#</a> RISC-V(risk-five)</h3><ol><li>An open standard instruction set architecture (ISA)</li><li>Open source</li><li>A RISC architecture, a load–store architecture;</li></ol><h3 id="xv6" tabindex="-1"><a class="header-anchor" href="#xv6" aria-hidden="true">#</a> XV6</h3><p>XV6 is a Linux example kernel, re-implementation.</p><p>Understanding xv6 is a good start toward understanding any of these systems and many others.</p><h3 id="register" tabindex="-1"><a class="header-anchor" href="#register" aria-hidden="true">#</a> Register</h3><blockquote><p>In computer engineering, a load–store architecture is an instruction set architecture that divides instructions into two categories: <strong>memory access</strong> (load and store between memory and registers<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup>) and <strong>ALU operations</strong> (which only occur between registers).</p></blockquote><p>关于寄存器：寄存器可以分为 Processor register 和 Register, 前者是在 CPU 核内，后者是在 CPU 核外，核外寄存器通过地址访问。</p><p>一个处理器通常包含多种类型的寄存器，寄存器可以分为以下几种：</p><table><thead><tr><th>Name</th><th>Abbr</th><th>Means</th><th>Remark</th></tr></thead><tbody><tr><td>Program Counter</td><td>PC</td><td>A program counter keeps track of the next instruction to be executed.</td><td>主要记录下一条要执行的指令</td></tr><tr><td>Instruction Register</td><td>IR</td><td>Instruction Register is a register which holds the instruction to be decoded by the control unit.</td><td>记录控制单元解码的指定</td></tr><tr><td>Memory Address Register</td><td>MAR</td><td>Memory Address Register is a register which points to the memory location which the CPU plans to access, either for reading or writing.</td><td>指向 CPU 要访问的存储位置</td></tr><tr><td>Memory Buffer Register</td><td>MBR</td><td>which is also referred to as the memory data register (MDR) is used for storage data either for coming to the CPU or data being transferred by the CPU.</td><td>存储进入 CPU 的数据或者是被 CPU 传输的数据</td></tr><tr><td>Accumulator</td><td>ACC</td><td>a general purpose used for strong variables, temporary results and results produced by arithmetic logic until of the CPU.</td><td>累加器</td></tr></tbody></table><p>寄存器的 size：一般寄存器由的数量由其可以承载的 bits 数量来衡量，如 32-bit 寄存器、64-bit 寄存器等。</p><p>GPU 上的寄存器远远多于 CPU 上寄存器的数量。</p><h2 id="operation-system-interfaces" tabindex="-1"><a class="header-anchor" href="#operation-system-interfaces" aria-hidden="true">#</a> Operation System Interfaces</h2><p>操作系统的作用主要可以归类为以下几点：</p><ol><li>在多个程序之间共享一台计算机；</li><li>管理底层硬件；在多个程序之间共享硬件，使得我们感知程序是在同一时间运行；</li><li>提供程序之间的交互、共享数据或者协同工作。</li></ol><p>而接口的作用就是操作系统为用户提供服务的方式。</p><h2 id="references" tabindex="-1"><a class="header-anchor" href="#references" aria-hidden="true">#</a> References</h2><hr class="footnotes-sep">',21),l={class:"footnotes"},f={class:"footnotes-list"},p={id:"footnote1",class:"footnote-item"},u={href:"https://en.wikipedia.org/wiki/Processor_register",target:"_blank",rel:"noopener noreferrer"},g=e("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1);function m(b,_){const r=s("ExternalLinkIcon");return a(),i("div",null,[h,e("section",l,[e("ol",f,[e("li",p,[e("p",null,[e("a",u,[t("Processor register"),n(r)]),t(", 寄存器；Processor register 为处理器寄存器。 "),g])])])])])}const y=o(c,[["render",m],["__file","xv6.html.vue"]]);export{y as default};
