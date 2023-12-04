import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as n,f as e}from"./app-22cda79c.js";const o={},t=e(`<h2 id="basic" tabindex="-1"><a class="header-anchor" href="#basic" aria-hidden="true">#</a> Basic</h2><h3 id="重命名-move-文件夹" tabindex="-1"><a class="header-anchor" href="#重命名-move-文件夹" aria-hidden="true">#</a> 重命名(Move)文件夹</h3><p>如果想按照日期来重命名文件夹的话，可以使用如下的方式：</p><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code><span class="token keyword">for</span> <span class="token operator">/</span>f <span class="token operator">%</span><span class="token operator">%</span>a in <span class="token punctuation">(</span><span class="token string">&#39;powershell -Command &quot;Get-Date -format yyyyMMdd_HHmm_ss&quot;&#39;</span><span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token function">set</span> datetime=<span class="token operator">%</span><span class="token operator">%</span>a
<span class="token function">move</span> anr\\anr anr\\anr_%datetime%
</code></pre></div><p>注意使用 <code>move</code>， 使用 <code>ren</code> 会失败。</p><h2 id="usage-android" tabindex="-1"><a class="header-anchor" href="#usage-android" aria-hidden="true">#</a> Usage: Android</h2><p>这个章节介绍使用 bat 脚本来进行安卓 adb 的一些操作，主要是一些实例，方便日后需要的时候进行查阅。</p><h3 id="滑动屏幕" tabindex="-1"><a class="header-anchor" href="#滑动屏幕" aria-hidden="true">#</a> 滑动屏幕</h3><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@echo off

rem Set the duration of the slide in milliseconds
set duration=1000

rem Get the width and height of the screen
for /f &quot;tokens=2 delims=:&quot; %%a in (&#39;adb shell wm size&#39;) do set screen_size=%%a
set /a width=%screen_size:~0,4%
set /a height=%screen_size:~5,4%

rem Calculate the x and y coordinates for the start and end points of the slide
set /a x1=%width% / 2
set /a x2=%x1%
set /a y1=%height% / 4
set /a y2=%height% / 4 * 3

rem Perform the slide 300 times
set count=0
:loop
adb shell input swipe %x1% %y1% %x2% %y2% %duration%
set /a count=%count% + 1
if %count% equ 300 goto end
goto loop

:end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="usage-with-python" tabindex="-1"><a class="header-anchor" href="#usage-with-python" aria-hidden="true">#</a> Usage: With Python</h2><h3 id="在-bat-中使用-python-脚本" tabindex="-1"><a class="header-anchor" href="#在-bat-中使用-python-脚本" aria-hidden="true">#</a> 在 bat 中使用 Python 脚本</h3><p>@todo</p><h2 id="for-loop" tabindex="-1"><a class="header-anchor" href="#for-loop" aria-hidden="true">#</a> for loop</h2><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code><span class="token keyword">for</span> <span class="token operator">/</span>f <span class="token string">&quot;tokens=3&quot;</span> <span class="token operator">%</span><span class="token operator">%</span>a in <span class="token punctuation">(</span><span class="token string">&#39;adb -s %serial_no% shell &quot;ps -T -p %pid% | grep HeapTaskDaemon&quot;&#39;</span><span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token function">set</span> tid=<span class="token operator">%</span><span class="token operator">%</span>a
</code></pre></div><p>在上面的命令中，我们使用了 <code>for</code> 循环来检验命令输出，并设置给变量。<code>token=3</code> 表示的含义是：以空格分隔的第 3 个变量。</p><p>如果我们需要使用多个变量，那么可以这么写：</p><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code><span class="token keyword">for</span> <span class="token operator">/</span>f <span class="token string">&quot;tokens=3,4 delims=,&quot;</span> <span class="token operator">%</span><span class="token operator">%</span>a in <span class="token punctuation">(</span><span class="token string">&#39;adb -s %serial_no% shell &quot;ps -T -p %pid% | grep HeapTaskDaemon&quot;&#39;</span><span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token punctuation">(</span>
    <span class="token function">set</span> tid=<span class="token operator">%</span><span class="token operator">%</span>a
    <span class="token function">set</span> tmp=<span class="token operator">%</span><span class="token operator">%</span>b
<span class="token punctuation">)</span>
</code></pre></div><p>在这个例子中，我们设置了两个变量，并且使用了分隔符，默认的分隔符是空格，可以加以注意。</p><p>如果想使用普通的 foor-loop, 则可以如下所示：</p><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code>@<span class="token function">echo</span> off
<span class="token keyword">for</span> <span class="token operator">/</span>l <span class="token operator">%</span><span class="token operator">%</span>i in <span class="token punctuation">(</span>1<span class="token punctuation">,</span>1<span class="token punctuation">,</span>5<span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token punctuation">(</span>
    <span class="token function">echo</span> <span class="token operator">%</span><span class="token operator">%</span>i
<span class="token punctuation">)</span>
</code></pre></div><h2 id="timeout" tabindex="-1"><a class="header-anchor" href="#timeout" aria-hidden="true">#</a> timeout</h2><p>如果我们想防止脚本被意外的按键终结，可以增加以下的 <code>timeout</code> 命令：</p><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code>timeout <span class="token operator">/</span>nobreak <span class="token operator">/</span>t 5 &gt; nul
</code></pre></div><p>如果说需要按任意按键跳过的，则可以如下实现：</p><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code>TIMEOUT <span class="token operator">/</span>T 90
</code></pre></div>`,25),p=[t];function l(i,r){return s(),n("div",null,p)}const u=a(o,[["render",l],["__file","bat_win.html.vue"]]);export{u as default};
