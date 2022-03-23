<template><h2 id="临时指定" tabindex="-1"><a class="header-anchor" href="#临时指定" aria-hidden="true">#</a> 临时指定</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pip <span class="token function">install</span> pythonModuleName -i https://pypi.douban.com/simple
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="永久指定" tabindex="-1"><a class="header-anchor" href="#永久指定" aria-hidden="true">#</a> 永久指定</h2>
<h3 id="windows" tabindex="-1"><a class="header-anchor" href="#windows" aria-hidden="true">#</a> windows</h3>
<p>在 c:/windows/user/your-name/pip/ 下，新建文件 <code>pip.ini</code>:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>global<span class="token punctuation">]</span>
trusted-host<span class="token operator">=</span>mirrors.tools.huawei.com
index-url<span class="token operator">=</span>http://mirrors.tools.huawei.com/pypi/simple/
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>如果找不到这个文件夹，就新建一个。</p>
<p>在有些 winodws 电脑中，可能不是这个文件夹，那么快速找到这个文件夹的方法是：在 windows 的资源管理器中输入 <code>%APPDATA%</code>, 会跳转到一个文件夹下，然后在这个文件夹下面新建 pip 文件夹，然后新建 <code>pip.ini</code> 文件，输入一下内容：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>global<span class="token punctuation">]</span>
<span class="token function">timeout</span> <span class="token operator">=</span> <span class="token number">6000</span>
index-url <span class="token operator">=</span> https://pypi.douban.com/simple
trusted-host <span class="token operator">=</span> pypi.douban.com
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="linux" tabindex="-1"><a class="header-anchor" href="#linux" aria-hidden="true">#</a> Linux</h3>
<p>在 ~/.pip/ 下创建 <code>pip.conf</code>:</p>
<div class="language-nginx ext-nginx line-numbers-mode"><pre v-pre class="language-nginx"><code>[global] 
trusted-host=mirrors.tools.huawei.com
index-url=http://mirrors.tools.huawei.com/pypi/simple/ 
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></template>
