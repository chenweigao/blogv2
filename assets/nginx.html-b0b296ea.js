import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o,c,a as s,b as n,d as t,e as l,f as a}from"./app-22cda79c.js";const r={},d={href:"http://nginx.org/en/docs/beginners_guide.html",target:"_blank",rel:"noopener noreferrer"},u=a(`<h2 id="command" tabindex="-1"><a class="header-anchor" href="#command" aria-hidden="true">#</a> Command</h2><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>nginx <span class="token parameter variable">-s</span> signal
</code></pre></div><p><code>-s</code>: signal:</p><ul><li>stop — fast shutdown</li><li>quit — graceful shutdown</li><li>reload — reloading the configuration file</li><li>reopen — reopening the log files</li></ul><p>查看运行 nginx 进程：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code><span class="token function">ps</span> <span class="token parameter variable">-ax</span> <span class="token operator">|</span> <span class="token function">grep</span> nginx
</code></pre></div><h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h2><p>By default, the configuration file is named <em>nginx.conf</em> and placed in the directory <code>/usr/local/nginx/conf</code>, <code>/etc/nginx</code>, or <code>/usr/local/etc/nginx</code>.</p><blockquote><p>The <code>events</code> and <code>http</code> directives reside in the <code>main</code> context, <code>server</code> in <code>http</code>, and <code>location</code> in <code>server</code>.</p></blockquote><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>http <span class="token punctuation">{</span>
    server <span class="token punctuation">{</span>
        listen <span class="token number">8080</span><span class="token punctuation">;</span>
        root <span class="token operator">/</span>data<span class="token operator">/</span>upl<span class="token punctuation">;</span>

        location <span class="token operator">/</span> <span class="token punctuation">{</span>
            root <span class="token operator">/</span>data<span class="token operator">/</span>www<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        localtion <span class="token operator">/</span>images<span class="token operator">/</span> <span class="token punctuation">{</span>
            root <span class="token operator">/</span>data<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        location <span class="token operator">~</span> \\<span class="token punctuation">.</span><span class="token punctuation">(</span>gif<span class="token operator">|</span>jpg<span class="token operator">|</span>png<span class="token punctuation">)</span>$ <span class="token punctuation">{</span>
            root <span class="token operator">/</span>data<span class="token operator">/</span>images<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> 
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>location</code> 未定位到的 URL 将被重定向到 <code>/</code> 下的 root 中。</p><p>Reload 配置：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>nginx <span class="token parameter variable">-s</span> reload
</code></pre></div><blockquote><p>In case something does not work as expected, you may try to find out the reason in <code>access.log</code> and <code>error.log</code> files in the directory <code>/usr/local/nginx/logs</code> or <code>/var/log/nginx</code>.</p></blockquote>`,14),k=a(`<h2 id="虚拟主机" tabindex="-1"><a class="header-anchor" href="#虚拟主机" aria-hidden="true">#</a> 虚拟主机</h2><p>nginx 可以配置多种类型的虚拟主机：</p><ol><li><p>基于 IP</p></li><li><p>基于域名</p></li><li><p>基于端口</p></li></ol><p>以基于端口的虚拟主机为例，对 <code>nginx.conf</code> 进行配置。</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">include</span>       mime.types</span><span class="token punctuation">;</span>
    <span class="token comment">#default_type  application/octet-stream;</span>
    
    <span class="token comment"># 为了使 echo 可用</span>
    <span class="token directive"><span class="token keyword">default_type</span> text/html</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">8088</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server_name</span>  localhost</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">root</span>   html</span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">index</span>  index.html index.htm</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">#error_page  404              /404.html;</span>

        <span class="token comment"># redirect server error pages to the static page /50x.html</span>
        <span class="token comment">#</span>
        <span class="token directive"><span class="token keyword">error_page</span>   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> = /50x.html</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">root</span>   html</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token comment"># custom config -- weigao</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>      <span class="token number">8089</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">echo</span> <span class="token string">&#39;hello server2!&#39;</span></span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>      <span class="token number">8090</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">echo</span> <span class="token string">&#39;hello server3!&#39;</span></span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，访问 8088, 8089, 8090 端口就可以发现不同的输出结果，这样就实现了多个虚拟主机的代理。</p><h2 id="反向代理" tabindex="-1"><a class="header-anchor" href="#反向代理" aria-hidden="true">#</a> 反向代理</h2><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span>
    <span class="token comment"># 指定 upstream</span>
    <span class="token directive"><span class="token keyword">upstream</span> to_google</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">server</span> localhost:8089</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server</span> localhost:8090</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>      <span class="token number">80</span></span><span class="token punctuation">;</span> <span class="token comment"># 对外暴露</span>
        <span class="token directive"><span class="token keyword">server_name</span> www.google.com</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">proxy_pass</span>  http://to_google</span><span class="token punctuation">;</span>
            <span class="token comment"># 使用 http:// + upstream 别名指定</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment"># 以下为内部服务器，对外不可见</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>      <span class="token number">8089</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">echo</span> <span class="token string">&#39;Welcome to google! This is 8089 machine!!!&#39;</span></span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">echo</span> <span class="token string">&#39;remote_addr=<span class="token variable">$remote_addr</span>&#39;</span></span><span class="token punctuation">;</span> <span class="token comment"># 防止逐层代理，获取到真实 ip.</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span>      <span class="token number">8090</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">echo</span> <span class="token string">&#39;Welcome to google! This is 8090 machine!!!&#39;</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),v={href:"http://www.google.com",target:"_blank",rel:"noopener noreferrer"},m=a(`<p>需要注意，<code>upstream</code> 为关键词，紧跟着的 to_google 为这个 upstream 的别名，在 <code>proxy_pass</code> 中 使用 http:// + 别名的方式指定。</p><p>当 upstream 发现其中有两个 server 可以用的时候，使用轮询策略（默认）依次访问 8089 和 8090, 个人猜测会不会也用 epoll?</p><h2 id="负载均衡" tabindex="-1"><a class="header-anchor" href="#负载均衡" aria-hidden="true">#</a> 负载均衡</h2><h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h3><p>Nginx 的负载均衡策略有三种：</p><ol><li><p>RR<br> 每个请求按照时间顺序逐一分配到不同的后端服务器；</p></li><li><p>权重<br> 指定轮询几率，weight 和访问比率成正比，用于后端服务器性能不均的情况。</p></li><li><p>ip_hash<br> 按访问 ip 的 hash 结果分配。</p></li></ol><p>upstream 用于负载均衡的时候，可以支持以下参数：</p><ul><li><p>weight：权重，常用于机器性能不均衡时，权重越大被访问的几率越大。</p></li><li><p>down：用于其他 server 设置当前不参与负载均衡，即访问不到</p></li><li><p>backup：用于其他 server 无法访问或者忙时备用 server</p></li><li><p>max_fails：server 允许请求失败的次数</p></li><li><p>fail_timeout：请求失败次数达到 max_fails 时，指定 server 停留多久，以便管理员检测故障原因</p></li></ul><p>例子：</p><div class="language-nginx" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">upstream</span> loadBalance</span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">server</span> localhost:8090 weight=1</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server</span> localhost:8091 weight=2 backup</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><h3 id="ip-hash" tabindex="-1"><a class="header-anchor" href="#ip-hash" aria-hidden="true">#</a> ip_hash</h3><p>每个请求按访问 IP 的 hash 结果分配，这样来自同一 IP 访客固定访问一个后端服务器，有效解决了动态网页存在的 sesion 共享问题。</p><div class="language-nginx" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">upstream</span> loadBalance</span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">ip_hash</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server</span> localhost:8090</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server</span> localhost:8091</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>除此之外，还有 url_hash 方法。此方法按访问 url 的 hash 结果来分配请求，使每个 url 定向到同一个后端服务器。此方法再 Nginx 的 hash 软件包中。</p><h3 id="least-conn" tabindex="-1"><a class="header-anchor" href="#least-conn" aria-hidden="true">#</a> least_conn</h3><p>即最少连接数策略，nginx 可以使请求分配到最少连接数的机器上。</p><div class="language-nginx" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">upstream</span> loadBalance</span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">least_conn</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server</span> localhost:8090</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server</span> localhost:8091</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="缓存" tabindex="-1"><a class="header-anchor" href="#缓存" aria-hidden="true">#</a> 缓存</h2>`,18),h=s("code",null,"ngx_http_proxy_module",-1),b={href:"http://nginx.org/en/docs/http/ngx_http_proxy_module.html",target:"_blank",rel:"noopener noreferrer"},g=a(`<div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">proxy_cache_path</span> cache/test levels=1:2 keys_zone=myCache:10m maxsize=1g inactive=30s</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>  <span class="token number">80</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">add_header</span>  X-Cache <span class="token variable">$upstream_cache_status</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">proxy_pass</span>  http://localhost:8080</span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">proxy_cache_vaild</span>   <span class="token number">10s</span></span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">proxy_cache</span> myCache</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function x(w,y){const e=i("ExternalLinkIcon");return o(),c("div",null,[s("p",null,[s("a",d,[n("Beginner's Guide"),t(e)])]),u,l(" 2019-6-26 "),k,s("p",null,[n("(记得将 "),s("a",v,[n("www.google.com"),t(e)]),n(" 在 host 文件中指向本地，或者注释掉 server_name)")]),m,s("p",null,[n("Nginx 缓存在 "),h,n(" 下的 几个模块中 "),s("a",b,[n("http://nginx.org/en/docs/http/ngx_http_proxy_module.html"),t(e)]),n(".")]),g])}const B=p(r,[["render",x],["__file","nginx.html.vue"]]);export{B as default};
