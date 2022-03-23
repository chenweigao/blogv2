<template><h2 id="on-my-zsh" tabindex="-1"><a class="header-anchor" href="#on-my-zsh" aria-hidden="true">#</a> on-my-zsh</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token function">zsh</span>
<span class="token function">sh</span> -c <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh<span class="token variable">)</span></span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>要是 curl 失败的话可以手动下载下来 install.sh 然后执行，其主题的配置文件在 <code> ~/.zshrc</code> 下面。</p>
<p>github 链接是 <a href="https://github.com/ohmyzsh/ohmyzsh" target="_blank" rel="noopener noreferrer">https://github.com/ohmyzsh/ohmyzsh<ExternalLinkIcon/></a></p>
</template>
