<template><h1 id="vps-and-shadowsocks" tabindex="-1"><a class="header-anchor" href="#vps-and-shadowsocks" aria-hidden="true">#</a> VPS and Shadowsocks</h1>
<h2 id="_1-配置shadowsocks客户端" tabindex="-1"><a class="header-anchor" href="#_1-配置shadowsocks客户端" aria-hidden="true">#</a> 1. 配置shadowsocks客户端</h2>
<p><a href="https://github.com/shadowsocks/shadowsocks/tree/master" target="_blank" rel="noopener noreferrer">GitHub of shadowsocks<ExternalLinkIcon/></a></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>yum -y <span class="token function">install</span> epel-release
yum -y <span class="token function">install</span> python-pip
pip <span class="token function">install</span> shadowsocks

<span class="token comment">#查看系统 </span>
<span class="token function">cat</span> /etc/redhat-release
<span class="token comment">#查看内核</span>
<span class="token function">cat</span>  /proc/version
<span class="token function">uname</span> -r
<span class="token function">vi</span> /etc/shadowsocks.json
<span class="token punctuation">{</span>
    <span class="token string">"server"</span><span class="token builtin class-name">:</span><span class="token string">"0.0.0.0"</span>,
    <span class="token string">"server_port"</span>:8388,
    <span class="token string">"local_port"</span>:1080,
    <span class="token string">"password"</span><span class="token builtin class-name">:</span><span class="token string">"chen852gao"</span>,
    <span class="token string">"timeout"</span>:600,
    <span class="token string">"method"</span><span class="token builtin class-name">:</span><span class="token string">"aes-256-cfb"</span>
<span class="token punctuation">}</span>
<span class="token comment">#启动ss服务</span>
ssserver -c /etc/shadowsocks.json -d start
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h2 id="_2-配置91云一键加速工具" tabindex="-1"><a class="header-anchor" href="#_2-配置91云一键加速工具" aria-hidden="true">#</a> 2. 配置91云一键加速工具</h2>
<p>在<a href="https://www.91yun.co/serverspeeder91yun" title="91云" target="_blank" rel="noopener noreferrer">91云<ExternalLinkIcon/></a> 上面下载加速工具</p>
<p>chrome上的插件Proxy SwitchyOmega使用方法为：</p>
<ul>
<li>
<p>从GitHub下载该插件，进入到google chrome的插件中心</p>
</li>
<li>
<p>配置Proxy</p>
<ul>
<li>protocol : SOCKS5</li>
<li>server: 127.0.0.1</li>
<li>Port: 1080</li>
</ul>
</li>
<li>
<p>配置Auto Switch</p>
<ul>
<li>
<p>Rule List rule 的Profile 填 proxy</p>
</li>
<li>
<p>Default 的Profile 填[Direct]</p>
</li>
<li>
<p>Rule List Format选择Autoproxy</p>
</li>
<li>
<p>Rule List URL填写：</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code>https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div></li>
<li>
<p>保存apply changes即可</p>
</li>
</ul>
</li>
</ul>
<h2 id="_3-kcptun-加速工具" tabindex="-1"><a class="header-anchor" href="#_3-kcptun-加速工具" aria-hidden="true">#</a> 3. kcptun 加速工具</h2>
<ul>
<li>
<p>安装并配置服务端</p>
<p><a href="https://github.com/kuoruan/shell-scripts" target="_blank" rel="noopener noreferrer">kcptun GitHub<ExternalLinkIcon/></a></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment">#查找shadowsocks端口，将8388替换为ss端口</span>
<span class="token function">netstat</span> -nl <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">8388</span>
ss -nl <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">8388</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>参考<a href="https://blog.kuoruan.com/110.html" target="_blank" rel="noopener noreferrer">教程<ExternalLinkIcon/></a></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment">#使用脚本一键安装</span>
<span class="token function">wget</span> --no-check-certificate https://github.com/kuoruan/shell-scripts/raw/master/kcptun/kcptun.sh
<span class="token function">chmod</span> +x ./kcptun.sh
./kcptun.sh
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>进入配置界面，按照步骤进行，需要注意到 <em>需要加速的端口</em> 为shadowsocks的端口，本例中为8388</p>
</li>
<li>
<p>安装客户端</p>
<p>首先下载一个启动Kcptun的工具，注意到这只是用来启动 Kcptun 的工具，而不是 Kcptun 客户端。<a href="https://github.com/dfdragon/kcptun_gclient/releases" target="_blank" rel="noopener noreferrer">启动工具下载地址<ExternalLinkIcon/></a></p>
<p>注意要下载服务端对应的Keptun，<a href="https://github.com/dfdragon/kcptun_gclient/releases" target="_blank" rel="noopener noreferrer">客户端下载地址<ExternalLinkIcon/></a></p>
</li>
<li>
<p>配置客户端</p>
<ul>
<li>本地侦听端口：任意</li>
<li>KCP服务器地址：VPS的IP</li>
<li>端口：默认的29900</li>
<li>其他都和服务端的配置一致</li>
</ul>
</li>
<li>
<p>配置shadowsocks客户端</p>
<ul>
<li>服务器地址：127.0.0.1</li>
<li>服务器端口：本地侦听端口</li>
<li>密码和加密方式：VPS的密码和加密方式</li>
</ul>
<p>配置完以上步骤以后，启动ss客户端和KCPTun客户端配置管理工具，日志区产生记录，即成功</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment">#查看服务器日志</span>
./kcptun.sh
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></li>
</ul>
</template>
