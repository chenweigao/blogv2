<template><h2 id="apt-source" tabindex="-1"><a class="header-anchor" href="#apt-source" aria-hidden="true">#</a> apt source</h2>
<p>Source:<a href="http://mirrors.ustc.edu.cn/" target="_blank" rel="noopener noreferrer">USTC<ExternalLinkIcon/></a></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">vim</span> /etc/apt/source.list
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>or use the command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">sed</span> -i <span class="token string">'s/archive.ubuntu.com/mirrors.ustc.edu.cn/g'</span> /etc/apt/sources.list
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>For Kali Linux:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>deb https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>For more information <a href="http://mirrors.ustc.edu.cn/" target="_blank" rel="noopener noreferrer">USTC Open Source<ExternalLinkIcon/></a></p>
<p>Finally:</p>
<p><code>sudo apt-get update</code></p>
</template>
