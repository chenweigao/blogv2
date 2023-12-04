import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as c,c as t,e as p,a as n,b as a,d as l,f as r}from"./app-22cda79c.js";const d={},i=n("h2",{id:"_1-预备工作",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#_1-预备工作","aria-hidden":"true"},"#"),a(" 1. 预备工作")],-1),u={href:"http://mirrors.aliyun.com/",target:"_blank",rel:"noopener noreferrer"},h=r(`<p>安装必要的软件</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#安装必要的软件</span>
<span class="token function">apt-get</span> <span class="token function">install</span> kernel-package build-essential libncurses5-dev fakeroot
<span class="token comment">#解压缩内核</span>
<span class="token function">tar</span> <span class="token parameter variable">-xzf</span> linux-4.x.x.tar.gz
</code></pre></div><p>把内核目录linux-4.x.x和补丁patch都复制到/usr/src，然后进入/usr/src</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">cp</span> linux-x.x /usr/src <span class="token parameter variable">-rf</span>
<span class="token function">cp</span> patch-x.x /user/src
<span class="token builtin class-name">cd</span> /usr/src
</code></pre></div><h2 id="_2-准备编译" tabindex="-1"><a class="header-anchor" href="#_2-准备编译" aria-hidden="true">#</a> 2. 准备编译</h2><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#复制当前内核的config文件到linux-x.x/下</span>
<span class="token function">cp</span> linux-headers-<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-r</span><span class="token variable">)</span></span>/.config linux-x.x/
<span class="token builtin class-name">cd</span> linux-x.x/
<span class="token function">make</span> menuconfig
</code></pre></div><p>选择load→OK→Save→OK→EXIT→EXIT的执行顺序。</p><h2 id="_3-开始编译" tabindex="-1"><a class="header-anchor" href="#_3-开始编译" aria-hidden="true">#</a> 3. 开始编译</h2><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 编译启动映像，N表示CPU核数，单核为2.双核为4，以此类推</span>
<span class="token function">make</span> bzImage <span class="token parameter variable">-jN</span>
<span class="token comment">#编译模块</span>
<span class="token function">make</span> modules <span class="token parameter variable">-jN</span>
<span class="token comment">#安装模块</span>
<span class="token function">make</span> modules-install
<span class="token comment">#安装内核</span>
<span class="token function">make</span> <span class="token function">install</span>
</code></pre></div><h2 id="_4-更新grub" tabindex="-1"><a class="header-anchor" href="#_4-更新grub" aria-hidden="true">#</a> 4. 更新grub</h2><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 4.5.0为版本号</span>
mkinitramfs <span class="token number">4.5</span>.0 <span class="token parameter variable">-o</span> /boot/initrd.img-4.5.0
update-grub2
</code></pre></div><hr><h2 id="内核与内核模块" tabindex="-1"><a class="header-anchor" href="#内核与内核模块" aria-hidden="true">#</a> 内核与内核模块</h2><h3 id="内核模块" tabindex="-1"><a class="header-anchor" href="#内核模块" aria-hidden="true">#</a> 内核模块</h3><p>一般内核模块放置在<code>lib/modules/$(uname -r)/kernel</code>当中，包括arch, drivers和net等子文件。</p><p>在新建模块的时候，会遇到模块的依赖性问题，在 <code>lib/modules/$(uname -r/modules.dep)</code> 文件中存储，这个文件的创建使用 <code>depmod [-Ane]</code> 命令：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>depmod <span class="token punctuation">[</span>-Ane<span class="token punctuation">]</span>
-A: 查找到新模块再更新该文件
-n: 不写入modules, 但在屏幕上输出
-e: 显示出当前已加载但不可执行的模块名称
</code></pre></div><p>举例：如果我做好了一个网卡驱动程序，文件名为a.ko，则更新内核模块：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">cp</span> a.ko /lib/modules/<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-r</span> <span class="token variable">)</span></span>/kernel/drivers/net
depmod
</code></pre></div><h3 id="内核模块的查看" tabindex="-1"><a class="header-anchor" href="#内核模块的查看" aria-hidden="true">#</a> 内核模块的查看</h3><p><code>lsmod</code>命令可查看已加载的模块，查看内核模块的信息，使用<code>modinfo</code></p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>modinfo <span class="token punctuation">[</span>-adln<span class="token punctuation">]</span> <span class="token punctuation">[</span>module_name<span class="token operator">|</span>filename<span class="token punctuation">]</span>
-a: 仅列出作者名称
-d: 仅description
-l: 仅列出授权
-n: 列出该模块的详细路径
</code></pre></div><p>e.g. 列出ath模块的路径：<code>modinfo -n ath</code></p><h3 id="内核模块的加载与删除" tabindex="-1"><a class="header-anchor" href="#内核模块的加载与删除" aria-hidden="true">#</a> 内核模块的加载与删除</h3><p><code>modprobe</code>命令可解决依赖性并决定需要加载的模块，优于<code>insmod</code></p><p>对于删除模块：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>rmmmod <span class="token punctuation">[</span>-fw<span class="token punctuation">]</span> module_name
-f: 强势删除，无论是否被使用
-w: 若该模块在使用，则等待该模块使用完后再删除
</code></pre></div><p>但是通常情况下，不推荐使用<code>insmod</code>和<code>rmmod</code>命令，万一模块存在依赖属性的问题时，将无法直接加载或删除该模块，所以使用<code>modprobe</code>来处理加载模块的问题：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>modprobe <span class="token punctuation">[</span>-lcfr<span class="token punctuation">]</span> module_name
-r: 删除某个模块
</code></pre></div>`,29);function m(k,b){const s=o("ExternalLinkIcon");return c(),t("div",null,[p("more"),i,n("p",null,[a("阿里云开源镜像站下载内核："),n("a",u,[a("阿里云"),l(s)]),a("。下载内核和patch包。")]),h])}const x=e(d,[["render",m],["__file","kernel.html.vue"]]);export{x as default};
