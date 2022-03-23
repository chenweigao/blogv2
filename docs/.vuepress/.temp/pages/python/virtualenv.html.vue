<template><h2 id="虚环境" tabindex="-1"><a class="header-anchor" href="#虚环境" aria-hidden="true">#</a> 虚环境</h2>
<p>安装 Python3 虚环境</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>virtualenv <span class="token operator">-</span>p python3 envname
virtualenv <span class="token operator">-</span>p python3 envname
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>启动使用：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token builtin class-name">source</span> racv/bin/activate
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>http://201.117.21.195/</p>
<h3 id="标准启动方式" tabindex="-1"><a class="header-anchor" href="#标准启动方式" aria-hidden="true">#</a> 标准启动方式</h3>
<p>根据书籍《Black.Hat.Python.2nd.Edition.2021.4》介绍的，可以用如下的顺序正确使用虚环境。</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> python3-venv
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>安装完成以后：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">mkdir</span> bhp
<span class="token builtin class-name">cd</span> bhp
python3 -m venv venv3
<span class="token builtin class-name">source</span> venv3/bin/active
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>在 python 环境中，还可以用 pip 搜索包：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pip search hashcrack
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>如果是在 windows 中，尝试使用 pip 安装虚环境：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pip <span class="token function">install</span> virtualenv -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
pip <span class="token function">install</span> virtualenvwrapper-win
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>然后新建一个虚环境：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>mkvirtualenv my-first-env
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>使用这个 env:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>workon my-first-env
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>如果要退出当前的虚环境：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>deactivate
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>如果要删除这个 env:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>rmvirtualenv my-first-env
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="远程访问-visdom" tabindex="-1"><a class="header-anchor" href="#远程访问-visdom" aria-hidden="true">#</a> 远程访问 Visdom</h2>
<p>重定向 8097 端口到本地：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>ssh <span class="token operator">-</span>L <span class="token number">18097</span><span class="token punctuation">:</span><span class="token number">127.0</span><span class="token number">.0</span><span class="token number">.1</span><span class="token punctuation">:</span><span class="token number">8097</span> username@remote_server_ip
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>在服务器上启动 visdom server：</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code>python3 <span class="token operator">-</span>m visdom<span class="token punctuation">.</span>server
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>查看 GPU 的信息：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>nvidia-smi
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="查看-python-路径" tabindex="-1"><a class="header-anchor" href="#查看-python-路径" aria-hidden="true">#</a> 查看 Python 路径</h2>
<p>有的时候我们可能需要查看一下 python 的安装路径，可以使用如下的方法：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>python
<span class="token operator">>></span><span class="token operator">></span> <span class="token function">import</span> sys
<span class="token operator">>></span><span class="token operator">></span> sys.path
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="设置-pip-源" tabindex="-1"><a class="header-anchor" href="#设置-pip-源" aria-hidden="true">#</a> 设置 pip 源</h2>
<h3 id="windows" tabindex="-1"><a class="header-anchor" href="#windows" aria-hidden="true">#</a> windows</h3>
<p>直接在 user 目录中创建一个 pip 目录，而后创建一个 <code>pip.ini</code> 文件：</p>
<div class="language-ini ext-ini line-numbers-mode"><pre v-pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">global</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">index-url</span> <span class="token punctuation">=</span> <span class="token value attr-value">https://pypi.tuna.tsinghua.edu.cn/simple</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="linux" tabindex="-1"><a class="header-anchor" href="#linux" aria-hidden="true">#</a> linux</h3>
<p>修改 ~/.pip/pip.conf (没有就创建一个)。</p>
</template>
