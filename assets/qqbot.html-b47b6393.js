import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as e,o as p,c as o,a as n,b as s,d as c,f as i}from"./app-22cda79c.js";const l={},u=n("h2",{id:"overview",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#overview","aria-hidden":"true"},"#"),s(" Overview")],-1),r={href:"https://github.com/pandolia/qqbot/blob/master/README.MD",target:"_blank",rel:"noopener noreferrer"},d=i(`<p>Installation:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>pip <span class="token function">install</span> qqbot
</code></pre></div><p>Run:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>qqbot

<span class="token comment">#or in these way</span>
qqbot <span class="token parameter variable">-q</span> qqnumber
</code></pre></div><p>See help or others:</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>qq <span class="token builtin class-name">help</span><span class="token operator">|</span>stop<span class="token operator">|</span>restart<span class="token operator">|</span>fresh-restart
</code></pre></div><h2 id="plugin" tabindex="-1"><a class="header-anchor" href="#plugin" aria-hidden="true">#</a> Plugin</h2><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>qq plug/unplug myplugin
</code></pre></div><h2 id="create-a-bot" tabindex="-1"><a class="header-anchor" href="#create-a-bot" aria-hidden="true">#</a> Create a bot</h2><h2 id="urllib-url-request" tabindex="-1"><a class="header-anchor" href="#urllib-url-request" aria-hidden="true">#</a> urllib, url request</h2><p>Use the ‘图灵机器人’ API:</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># -*- coding: utf-8 -*-</span>
<span class="token keyword">import</span> json
<span class="token keyword">import</span> urllib
<span class="token keyword">import</span> random

<span class="token keyword">def</span> <span class="token function">onQQMessage</span><span class="token punctuation">(</span>bot<span class="token punctuation">,</span> contact<span class="token punctuation">,</span> member<span class="token punctuation">,</span> content<span class="token punctuation">)</span><span class="token punctuation">:</span>
    api_url <span class="token operator">=</span> <span class="token string">&quot;http://openapi.tuling123.com/openapi/api/v2&quot;</span>
    req <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token string">&quot;perception&quot;</span><span class="token punctuation">:</span>
        <span class="token punctuation">{</span>
            <span class="token string">&quot;inputText&quot;</span><span class="token punctuation">:</span>
            <span class="token punctuation">{</span>
                <span class="token string">&quot;text&quot;</span><span class="token punctuation">:</span> content
            <span class="token punctuation">}</span><span class="token punctuation">,</span>

            <span class="token string">&quot;selfInfo&quot;</span><span class="token punctuation">:</span>
            <span class="token punctuation">{</span>
                <span class="token string">&quot;location&quot;</span><span class="token punctuation">:</span>
                <span class="token punctuation">{</span>
                    <span class="token string">&quot;city&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;西安&quot;</span><span class="token punctuation">,</span>
                    <span class="token string">&quot;province&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;陕西&quot;</span><span class="token punctuation">,</span>
                    <span class="token string">&quot;street&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;高新二路&quot;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>

        <span class="token string">&quot;userInfo&quot;</span><span class="token punctuation">:</span>
        <span class="token punctuation">{</span>
            <span class="token string">&quot;apiKey&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;2da9ae73b65f4cce8cff91fc027fa---&quot;</span><span class="token punctuation">,</span>
            <span class="token string">&quot;userId&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;OnlyUseAlphabet&quot;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    req <span class="token operator">=</span> json<span class="token punctuation">.</span>dumps<span class="token punctuation">(</span>req<span class="token punctuation">)</span><span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token string">&#39;utf8&#39;</span><span class="token punctuation">)</span>
    http_post <span class="token operator">=</span> urllib<span class="token punctuation">.</span>request<span class="token punctuation">.</span>Request<span class="token punctuation">(</span>api_url<span class="token punctuation">,</span> data<span class="token operator">=</span>req<span class="token punctuation">,</span> headers<span class="token operator">=</span><span class="token punctuation">{</span>
                                       <span class="token string">&#39;content-type&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;application/json&#39;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
    response <span class="token operator">=</span> urllib<span class="token punctuation">.</span>request<span class="token punctuation">.</span>urlopen<span class="token punctuation">(</span>http_post<span class="token punctuation">)</span>
    response_str <span class="token operator">=</span> response<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token string">&#39;utf8&#39;</span><span class="token punctuation">)</span>
    response_dic <span class="token operator">=</span> json<span class="token punctuation">.</span>loads<span class="token punctuation">(</span>response_str<span class="token punctuation">)</span>
    intent_code <span class="token operator">=</span> response_dic<span class="token punctuation">[</span><span class="token string">&#39;intent&#39;</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;code&#39;</span><span class="token punctuation">]</span>
    results_text <span class="token operator">=</span> response_dic<span class="token punctuation">[</span><span class="token string">&#39;results&#39;</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;values&#39;</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;text&#39;</span><span class="token punctuation">]</span>

    <span class="token keyword">if</span> content <span class="token keyword">is</span> <span class="token keyword">not</span> <span class="token boolean">None</span> <span class="token keyword">and</span> contact<span class="token punctuation">.</span>ctype <span class="token operator">==</span> <span class="token string">&#39;buddy&#39;</span><span class="token punctuation">:</span>
        <span class="token comment"># bot.SendTo(contact, results_text, resendOn1202=True)</span>
        bot<span class="token punctuation">.</span>SendTo<span class="token punctuation">(</span>contact<span class="token punctuation">,</span> results_text<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="timed-transmission" tabindex="-1"><a class="header-anchor" href="#timed-transmission" aria-hidden="true">#</a> Timed transmission</h2><div class="language-python" data-ext="py"><pre class="language-python"><code><span class="token decorator annotation punctuation">@qqbotsched</span><span class="token punctuation">(</span>hour<span class="token operator">=</span><span class="token string">&#39;10, 11, 12, 13, 14&#39;</span><span class="token punctuation">,</span> minute<span class="token operator">=</span><span class="token string">&#39;01&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">sendMyMessage</span><span class="token punctuation">(</span>bot<span class="token punctuation">)</span><span class="token punctuation">:</span>
    gl <span class="token operator">=</span> bot<span class="token punctuation">.</span>List<span class="token punctuation">(</span><span class="token string">&#39;buddy&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Jack&#39;</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> gl <span class="token keyword">is</span> <span class="token keyword">not</span> <span class="token boolean">None</span><span class="token punctuation">:</span>
        <span class="token keyword">for</span> member <span class="token keyword">in</span> gl<span class="token punctuation">:</span>
            bot<span class="token punctuation">.</span>SendTo<span class="token punctuation">(</span>member<span class="token punctuation">,</span> <span class="token string">&#39;Hi, this is a TimingMessage!&#39;</span><span class="token punctuation">)</span>
</code></pre></div>`,14);function k(v,b){const a=e("ExternalLinkIcon");return p(),o("div",null,[u,n("p",null,[s("In the "),n("a",r,[s("github document"),c(a)])]),d])}const h=t(l,[["render",k],["__file","qqbot.html.vue"]]);export{h as default};
