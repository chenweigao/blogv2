import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as e,e as n,a as p,f as t}from"./app-22cda79c.js";const o={},l=p("p",null,"本文主要记录常见的 Linux 命令，特别是那些经常遇到但是容易忘记的命令用法。",-1),c=t(`<h2 id="scp" tabindex="-1"><a class="header-anchor" href="#scp" aria-hidden="true">#</a> scp</h2><p>SCP（Secure Copy）是一个在计算机之间安全传输文件的命令行工具，它使用 SSH 协议进行加密传输。以下是 SCP 的用法：</p><ol><li><p>从本地到远程：将本地文件复制到远程服务器。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> <span class="token punctuation">[</span>选项<span class="token punctuation">]</span> <span class="token operator">&lt;</span>本地文件路径<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>远程用户名@远程主机地址:目标路径<span class="token operator">&gt;</span>
</code></pre></div><p>示例：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> /path/to/local/file.txt username@remote:/path/on/remote/
</code></pre></div></li><li><p>从远程到本地：将远程服务器上的文件复制到本地。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> <span class="token punctuation">[</span>选项<span class="token punctuation">]</span> <span class="token operator">&lt;</span>远程用户名@远程主机地址:源文件路径<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>本地目标路径<span class="token operator">&gt;</span>
</code></pre></div><p>示例：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> username@remote:/path/to/remote/file.txt /path/on/local/
</code></pre></div></li><li><p>复制整个目录：使用 <code>-r</code> 选项来递归复制整个目录。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> <span class="token parameter variable">-r</span> <span class="token punctuation">[</span>选项<span class="token punctuation">]</span> <span class="token operator">&lt;</span>源目录路径<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>目标目录路径<span class="token operator">&gt;</span>
</code></pre></div><p>示例：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> <span class="token parameter variable">-r</span> username@remote:/path/to/remote/directory /path/on/local/
</code></pre></div></li><li><p>指定端口号：如果 SSH 服务器监听的端口不是默认的 22 号端口，可以使用 <code>-P</code> 选项指定端口号。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> <span class="token parameter variable">-P</span> <span class="token operator">&lt;</span>端口号<span class="token operator">&gt;</span> <span class="token punctuation">[</span>选项<span class="token punctuation">]</span> <span class="token operator">&lt;</span>源文件路径<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>目标路径<span class="token operator">&gt;</span>
</code></pre></div><p>示例：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> <span class="token parameter variable">-P</span> <span class="token number">2222</span> /path/to/local/file.txt username@remote:/path/on/remote/
</code></pre></div></li></ol><p>以上就是 SCP 的基本用法，通过 SCP 可以实现在本地和远程服务器之间安全地传输文件。</p><h2 id="压缩-解压缩" tabindex="-1"><a class="header-anchor" href="#压缩-解压缩" aria-hidden="true">#</a> 压缩/解压缩</h2><p>在 Linux 中，你可以使用不同的命令和工具来进行文件和目录的压缩和解压缩。下面是一些常用的命令和工具：</p><ol><li><p>压缩文件/目录：</p><ul><li><p>Gzip：使用 gzip 命令压缩文件，生成以 <code>.gz</code> 结尾的压缩文件。</p><div class="language-text" data-ext="text"><pre class="language-text"><code>shell复制代码gzip &lt;文件名&gt;
</code></pre></div></li><li><p>Tar：使用 tar 命令创建归档文件，并结合其他压缩工具（如 gzip 或 bzip2）进行压缩。</p><div class="language-text" data-ext="text"><pre class="language-text"><code>shell复制代码tar czf &lt;压缩文件名.tar.gz&gt; &lt;要压缩的文件/目录&gt;
</code></pre></div><p>可选的压缩工具有：</p><ul><li><code>z</code>：使用 gzip 压缩文件，生成 <code>.tar.gz</code> 文件。</li><li><code>j</code>：使用 bzip2 压缩文件，生成 <code>.tar.bz2</code> 文件。</li><li><code>J</code>：使用 xz 压缩文件，生成 <code>.tar.xz</code> 文件。</li></ul></li></ul></li><li><p>解压缩文件/目录：</p><ul><li><p>Gzip：使用 gzip 命令解压缩 <code>.gz</code> 文件。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">gzip</span> <span class="token parameter variable">-d</span> <span class="token operator">&lt;</span>文件名.gz<span class="token operator">&gt;</span>
</code></pre></div></li><li><p>Tar：使用 tar 命令解压缩 <code>.tar</code> 文件。</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> xf <span class="token operator">&lt;</span>压缩文件名.tar<span class="token operator">&gt;</span>
</code></pre></div><p>如果压缩文件是经过 gzip、bzip2 或 xz 压缩的，你可以使用相应的解压缩工具结合 tar 使用。例如，解压缩 <code>.tar.gz</code> 文件：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> xzf <span class="token operator">&lt;</span>压缩文件名.tar.gz<span class="token operator">&gt;</span>
</code></pre></div></li></ul></li><li><p>压缩和解压缩组合操作：</p><p>如果你想在一个命令中同时进行压缩和解压缩操作，可以使用管道（pipe）来将多个命令连接起来。</p><ul><li><p>压缩一个目录并将其打包为 tar 文件，并通过 gzip 进行压缩：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> cf - <span class="token operator">&lt;</span>目录<span class="token operator">&gt;</span> <span class="token operator">|</span> <span class="token function">gzip</span> <span class="token operator">&gt;</span> <span class="token operator">&lt;</span>压缩文件名.tar.gz<span class="token operator">&gt;</span>
</code></pre></div></li><li><p>解压缩一个经过 gzip 压缩的 tar 文件：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>gunzip <span class="token parameter variable">-c</span> <span class="token operator">&lt;</span>压缩文件名.tar.gz<span class="token operator">&gt;</span> <span class="token operator">|</span> <span class="token function">tar</span> xf -
</code></pre></div></li></ul></li></ol><p>这些是一些常用的 Linux 压缩和解压缩命令和工具。根据你的需求和压缩文件的类型，选择合适的命令和选项来进行操作。</p>`,8);function r(i,d){return s(),e("div",null,[l,n(" more "),c])}const h=a(o,[["render",r],["__file","command.html.vue"]]);export{h as default};
