import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as c,c as l,a as n,b as s,d as e,f as p}from"./app-22cda79c.js";const i={},r=n("h2",{id:"abstract",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#abstract","aria-hidden":"true"},"#"),s(" Abstract")],-1),d=n("p",null,"Celery 是一个基于分布式消息传输的异步任务队列，它专注于实时处理，同时也支持任务调度。",-1),u={href:"http://docs.celeryproject.org/en/latest/index.html",target:"_blank",rel:"noopener noreferrer"},k=p(`<p>安装 python 版本：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>pip <span class="token function">install</span> <span class="token parameter variable">-U</span> Celery
</code></pre></div><p>或者可以安装 Celery 的一个或多个扩展：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>pip <span class="token function">install</span> celery<span class="token punctuation">[</span>librabbitmq, redis, auth, msgpack<span class="token punctuation">]</span>
</code></pre></div><h2 id="config" tabindex="-1"><a class="header-anchor" href="#config" aria-hidden="true">#</a> Config</h2><ul><li><p>使用 Redis 作为消息代理和后端存储，序列化和反序列化使用 msgpack, 也可以使用 json, msgpack 相比 json 是一个二进制的类 json 的序列化方式，比 json 的数据结构更小、更快</p></li><li><p>安装 Redis 可视化软件 RDM(redis desktop manager)</p></li></ul><h2 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h2><p>初始化时指定消息代理和存储：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># app.py</span>
<span class="token keyword">from</span> __future__ <span class="token keyword">import</span> absolute_import<span class="token punctuation">,</span> unicode_literals

<span class="token keyword">from</span> celery <span class="token keyword">import</span> Celery

app <span class="token operator">=</span> Celery<span class="token punctuation">(</span>
    <span class="token string">&#39;myapp&#39;</span><span class="token punctuation">,</span>
    broker<span class="token operator">=</span><span class="token string">&#39;redis://localhost:6379/0&#39;</span><span class="token punctuation">,</span>
    <span class="token comment"># ## add result backend here if needed.</span>
    <span class="token comment"># backend=&#39;rpc&#39;</span>
<span class="token punctuation">)</span>


<span class="token decorator annotation punctuation">@app<span class="token punctuation">.</span>task</span>
<span class="token keyword">def</span> <span class="token function">add</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> x <span class="token operator">+</span> y


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&#39;__main__&#39;</span><span class="token punctuation">:</span>
    app<span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后再命令行中启动：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>celery <span class="token parameter variable">-A</span> app worker <span class="token parameter variable">-l</span> info
</code></pre></div><h2 id="调用-task" tabindex="-1"><a class="header-anchor" href="#调用-task" aria-hidden="true">#</a> 调用 Task</h2>`,12),m={href:"https://mp.weixin.qq.com/s/kxwlLQ5H479PXCKuS4ZueA",target:"_blank",rel:"noopener noreferrer"},v=p(`<p>celery 调用 task 有三种方式：</p><ol><li><p><code>apply_async(args[, kwargs[, …]])</code>, 这种方式会往消息队列发送消息, 并支持各种参数使用</p></li><li><p><code>delay(*args, **kwargs)</code>, 是apply_async 一种简明调用方式，但是不支持很多额外的参数</p></li><li><p><code>calling ( __call__)</code>, 应用支持调用API的对象，例如add(2,2), 意味着任务将在当前进程中执行，而不是由worker执行（不会发送消息）</p></li></ol><p>示例：</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>说明：本例中的 T 即为 task 名称

<span class="token comment"># 相当于apply_async 的简单调用方式</span>
T<span class="token punctuation">.</span>delay<span class="token punctuation">(</span>arg<span class="token punctuation">,</span> kwarg<span class="token operator">=</span>value<span class="token punctuation">)</span>

T<span class="token punctuation">.</span>apply_async<span class="token punctuation">(</span><span class="token punctuation">(</span>arg<span class="token punctuation">,</span> <span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token string">&#39;kwarg&#39;</span><span class="token punctuation">:</span> value<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment"># 任务会在10s 后开始执行</span>
T<span class="token punctuation">.</span>apply_async<span class="token punctuation">(</span>countdown<span class="token operator">=</span><span class="token number">10</span><span class="token punctuation">)</span>

<span class="token comment"># 任务会在 now 之后的10秒开始执行</span>
T<span class="token punctuation">.</span>apply_async<span class="token punctuation">(</span>eta<span class="token operator">=</span>now <span class="token operator">+</span> timedelta<span class="token punctuation">(</span>seconds<span class="token operator">=</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment"># 任务会在一分钟之后执行，在两分钟后过期</span>
T<span class="token punctuation">.</span>apply_async<span class="token punctuation">(</span>countdown<span class="token operator">=</span><span class="token number">60</span><span class="token punctuation">,</span> expires<span class="token operator">=</span><span class="token number">120</span><span class="token punctuation">)</span>

<span class="token comment"># 任务会在now之后的两天过期</span>
T<span class="token punctuation">.</span>apply_async<span class="token punctuation">(</span>expires<span class="token operator">=</span>now <span class="token operator">+</span> timedelta<span class="token punctuation">(</span>days<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4);function b(h,_){const a=o("ExternalLinkIcon");return c(),l("div",null,[r,d,n("p",null,[n("a",u,[s("官方文档"),e(a)])]),k,n("p",null,[s("参考这篇文章："),n("a",m,[s("https://mp.weixin.qq.com/s/kxwlLQ5H479PXCKuS4ZueA"),e(a)])]),v])}const f=t(i,[["render",b],["__file","celery.html.vue"]]);export{f as default};
