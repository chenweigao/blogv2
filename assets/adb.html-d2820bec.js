import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o,c as p,a,b as s,d as i,f as l}from"./app-22cda79c.js";const c={},r=l(`<h2 id="base" tabindex="-1"><a class="header-anchor" href="#base" aria-hidden="true">#</a> Base</h2><h3 id="devices" tabindex="-1"><a class="header-anchor" href="#devices" aria-hidden="true">#</a> devices</h3><p>查看是否连接成功<sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup></p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb devices
</code></pre></div><h3 id="锁定、解锁" tabindex="-1"><a class="header-anchor" href="#锁定、解锁" aria-hidden="true">#</a> 锁定、解锁</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell input keyevent <span class="token number">26</span>

adb shell input keyevent <span class="token number">82</span>
</code></pre></div><div class="hint-container tip"><p class="hint-container-title">keyevent 26</p><p>keyevent 26 表示的是<strong>按下电源按钮</strong>，所以说如果我们手机屏幕状态是打开的话，会导致屏幕状态切换为开启状态，针对这个情况，我们可以在脚本中使用判断：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code><span class="token keyword">for</span> <span class="token operator">/</span>f <span class="token string">&quot;tokens=*&quot;</span> <span class="token operator">%</span><span class="token operator">%</span>a in <span class="token punctuation">(</span><span class="token string">&#39;adb -s %serial_no% shell &quot;dumpsys deviceidle | grep mScreenOn&quot;&#39;</span><span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token function">set</span> screen_state=<span class="token operator">%</span><span class="token operator">%</span>a

<span class="token keyword">if</span> <span class="token string">&quot;%screen_state%&quot;</span> == <span class="token string">&quot;mScreenOn=true&quot;</span> <span class="token punctuation">(</span>
    <span class="token function">echo</span> <span class="token operator">%</span>screen_state% is on
	adb <span class="token operator">-</span>s <span class="token operator">%</span>serial_no% shell input keyevent 82
<span class="token punctuation">)</span> <span class="token keyword">else</span> <span class="token punctuation">(</span>
    <span class="token function">echo</span> <span class="token operator">%</span>screen_state% is off
	adb <span class="token operator">-</span>s <span class="token operator">%</span>serial_no% shell input keyevent 26
	adb <span class="token operator">-</span>s <span class="token operator">%</span>serial_no% shell input keyevent 82
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果屏幕状态是开启的话，我们就直接点解锁；否则的话，我们开启屏幕再解锁。</p></div><h3 id="重启、关机" tabindex="-1"><a class="header-anchor" href="#重启、关机" aria-hidden="true">#</a> 重启、关机</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell <span class="token function">reboot</span> <span class="token comment"># 重启</span>

adb shell <span class="token function">reboot</span> <span class="token parameter variable">-p</span> <span class="token comment"># 关机</span>
</code></pre></div><h3 id="蓝牙" tabindex="-1"><a class="header-anchor" href="#蓝牙" aria-hidden="true">#</a> 蓝牙</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell <span class="token function">service</span> call bluetooth_manager <span class="token number">6</span> <span class="token comment"># 打开蓝牙</span>

adb shell <span class="token function">service</span> call bluetooth_manager <span class="token number">9</span> <span class="token comment"># 关闭蓝牙</span>
</code></pre></div><h3 id="wi-fi" tabindex="-1"><a class="header-anchor" href="#wi-fi" aria-hidden="true">#</a> Wi-Fi</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell svc wifi <span class="token builtin class-name">enable</span> <span class="token comment"># 打开wifi</span>

adb shell svc wifi disable <span class="token comment"># 关闭wifi</span>

<span class="token comment"># 打开wifi设置界面</span>

adb shell am start <span class="token parameter variable">-a</span> android.intent.action.MAIN <span class="token parameter variable">-n</span> com.android.settings/.wifi.WifiSettings
</code></pre></div><h2 id="app" tabindex="-1"><a class="header-anchor" href="#app" aria-hidden="true">#</a> APP</h2><h3 id="安装、删除" tabindex="-1"><a class="header-anchor" href="#安装、删除" aria-hidden="true">#</a> 安装、删除</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb <span class="token function">install</span> abc.apk <span class="token comment"># 第一次安装。如果手机上已经有此app,则会报错。</span>

adb uninstall com.example.appname
</code></pre></div><h3 id="获取-app-activity" tabindex="-1"><a class="header-anchor" href="#获取-app-activity" aria-hidden="true">#</a> 获取 APP Activity</h3><ol><li><p>手动打开 APP</p></li><li><p>使用 adb 命令：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell dumpsys window <span class="token operator">|</span> <span class="token function">grep</span> mCurrentFocus

<span class="token comment"># or</span>
dumpsys window <span class="token operator">|</span> <span class="token function">grep</span> mCurrentFocus
</code></pre></div></li><li><p>此时可以看到输入类似于下面：</p><p><em>mCurrentFocus=Window{a4d3e62 u0 <strong>com.example.myapplication/com.example.myapplication.MainActivity</strong>}</em></p><p>其中以 <code>com.xxx</code> 那一段就是 APP 的 Activity.</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>该方法如果想知道 APP 的包名，使用方法是：<code>pm list package -3</code> 列出所有应用，其中 <code>-3</code> 表示列举出第三方应用。</p><p>但是通常而言，我们打开该 APP 并执行命令，是能够从 Activity 的前半部分得到包名的。</p></div></li></ol><h3 id="启动-app" tabindex="-1"><a class="header-anchor" href="#启动-app" aria-hidden="true">#</a> 启动 APP</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell am start <span class="token parameter variable">-n</span> com.package.name/com.package.name.MainActivity

adb shell am start <span class="token parameter variable">-n</span> com.package.name/.MainActivity
</code></pre></div><p>举例：启动抖音</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell am start <span class="token parameter variable">-n</span> com.ss.android.ugc.aweme/com.ss.android.ugc.aweme.splash.SplashActivity
</code></pre></div><h3 id="关闭-app" tabindex="-1"><a class="header-anchor" href="#关闭-app" aria-hidden="true">#</a> 关闭 APP</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell am force-stop com.some.package
</code></pre></div><div class="hint-container warning"><p class="hint-container-title">注意</p><p><code>force-stop</code> 后面跟着的是 APP 的包名，而 <code>start</code> 后面是 APP 的 activity.</p></div><h3 id="获取-pid" tabindex="-1"><a class="header-anchor" href="#获取-pid" aria-hidden="true">#</a> 获取 Pid</h3><p>很多时候，我们需要获取到 APP 进程对应的 PID，当我们知道 APP 的包名的时候，一切都变得非常简单：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell pidof package_name
</code></pre></div><details class="hint-container details"><summary>bat script example</summary><p>这是一个关于如何获取 PID 的 bat script 例子：</p><div class="language-powershell line-numbers-mode" data-ext="powershell"><pre class="language-powershell"><code>@<span class="token function">echo</span> off
<span class="token function">set</span> <span class="token operator">/</span>p serial_no=&lt;<span class="token punctuation">.</span><span class="token operator">/</span>serial_no<span class="token punctuation">.</span>txt
<span class="token function">echo</span> serial_no is <span class="token operator">%</span>serial_no%

<span class="token function">set</span> PACKAGE_NAME=com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>myapplication

<span class="token keyword">for</span> <span class="token operator">/</span>f <span class="token string">&quot;tokens=*&quot;</span> <span class="token operator">%</span><span class="token operator">%</span>a in <span class="token punctuation">(</span><span class="token string">&#39;adb -s %serial_no% shell  pidof %PACKAGE_NAME%&#39;</span><span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token function">set</span> PID=<span class="token operator">%</span><span class="token operator">%</span>a

<span class="token keyword">if</span> <span class="token string">&quot;%PID%&quot;</span>==<span class="token string">&quot;&quot;</span> <span class="token punctuation">(</span>
  <span class="token function">echo</span> Error: <span class="token operator">%</span>PACKAGE_NAME% is not running
  <span class="token keyword">exit</span> <span class="token operator">/</span>b 1
<span class="token punctuation">)</span>

<span class="token function">echo</span> PID of <span class="token operator">%</span>PACKAGE_NAME% is <span class="token operator">%</span>PID%
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details><h3 id="获取-tid" tabindex="-1"><a class="header-anchor" href="#获取-tid" aria-hidden="true">#</a> 获取 Tid</h3><p>我们在知道 Pid 和我们的线程名称的时候，可以很轻松地获取到线程的 Tid:</p><div class="language-powershell" data-ext="powershell"><pre class="language-powershell"><code><span class="token function">set</span> thread_name=HeapTaskDaemon
<span class="token keyword">for</span> <span class="token operator">/</span>f <span class="token string">&quot;tokens=3&quot;</span> <span class="token operator">%</span><span class="token operator">%</span>a in <span class="token punctuation">(</span><span class="token string">&#39;adb -s %serial_no% shell &quot;ps -T -p %PID% | grep %thread_name%&quot;&#39;</span><span class="token punctuation">)</span> <span class="token keyword">do</span> <span class="token function">set</span> tid=<span class="token operator">%</span><span class="token operator">%</span>a
</code></pre></div><h2 id="tap-and-slide" tabindex="-1"><a class="header-anchor" href="#tap-and-slide" aria-hidden="true">#</a> Tap and Slide</h2><h3 id="slide" tabindex="-1"><a class="header-anchor" href="#slide" aria-hidden="true">#</a> slide</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell input touchscreen swipe <span class="token number">930</span> <span class="token number">880</span> <span class="token number">930</span> <span class="token number">380</span> <span class="token comment"># 向上滑</span>

adb shell input touchscreen swipe <span class="token number">930</span> <span class="token number">880</span> <span class="token number">330</span> <span class="token number">880</span> <span class="token comment"># 向左滑</span>

adb shell input touchscreen swipe <span class="token number">330</span> <span class="token number">880</span> <span class="token number">930</span> <span class="token number">880</span> <span class="token comment"># 向右滑</span>

adb shell input touchscreen swipe <span class="token number">930</span> <span class="token number">380</span> <span class="token number">930</span> <span class="token number">880</span> <span class="token comment"># 向下滑</span>
</code></pre></div><h3 id="tap" tabindex="-1"><a class="header-anchor" href="#tap" aria-hidden="true">#</a> tap</h3><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell input mouse tap <span class="token number">100</span> <span class="token number">500</span>
</code></pre></div><h2 id="other-skill" tabindex="-1"><a class="header-anchor" href="#other-skill" aria-hidden="true">#</a> Other Skill</h2><h3 id="等待设备重启" tabindex="-1"><a class="header-anchor" href="#等待设备重启" aria-hidden="true">#</a> 等待设备重启</h3><p>如果想等到设备重启完成以后再进行下一步操作，可以在 adb 命令之间增加：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb wait-for-device
</code></pre></div><p>经过实测，后面的命令会等到设备重启完成之后再执行。</p><h3 id="写-sn" tabindex="-1"><a class="header-anchor" href="#写-sn" aria-hidden="true">#</a> 写 SN</h3><p>1、执行命令进入fastboot：adb reboot bootloader<br> 2、fastboot getvar nve:SN@12345678 @后面为想要修改成为的SN编号</p><p>3、fastboot reboot 重启</p><p>4、查看单板SN号是否修改成功：adb devices</p><p>写完之后进行验证：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb devices
fastboot devices
adb shell <span class="token string">&quot;getprop ro.serialno&quot;</span>
</code></pre></div><h2 id="push-path" tabindex="-1"><a class="header-anchor" href="#push-path" aria-hidden="true">#</a> Push Path</h2><p>对于一些情况，我们可能需要 push 进去文件完成更新，所以这一节对此做出列举。</p><h3 id="art" tabindex="-1"><a class="header-anchor" href="#art" aria-hidden="true">#</a> art</h3><p>如果要推送 art, 其实现如下：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb remount
adb push .<span class="token punctuation">\\</span>lib64<span class="token punctuation">\\</span>libart.so /system/apex/com.android.art.debug/lib64/libart.so
adb push .<span class="token punctuation">\\</span>lib<span class="token punctuation">\\</span>libart.so /system/apex/com.android.art.debug/lib/libart.so
adb <span class="token function">reboot</span>
pause
</code></pre></div><p>如果要推送 apex 包，其实现如下（编译产物 <code>com.android.art.apex</code>）：</p><div class="language-bash" data-ext="sh"><pre class="language-bash"><code>adb shell <span class="token function">rm</span> /cache/overlay/system/upper/apex/com.android.art.apex
adb <span class="token function">reboot</span>

adb wait-for-device

adb remount
adb push com.android.art.apex /system/apex/
adb <span class="token function">reboot</span>
</code></pre></div><details class="hint-container details"><summary>增加上设备序列号的推送程序</summary><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">set</span> /p <span class="token assign-left variable">serial_no</span><span class="token operator">=</span><span class="token operator">&lt;</span>./serial_no.txt
<span class="token builtin class-name">echo</span> serial_no is %serial_no%

adb <span class="token parameter variable">-s</span> %serial_no% remount
adb <span class="token parameter variable">-s</span> %serial_no%  push .<span class="token punctuation">\\</span>lib64<span class="token punctuation">\\</span>libart.so /system/apex/com.android.art.debug/lib64/libart.so
adb <span class="token parameter variable">-s</span> %serial_no%  push .<span class="token punctuation">\\</span>lib<span class="token punctuation">\\</span>libart.so /system/apex/com.android.art.debug/lib/libart.so
adb <span class="token parameter variable">-s</span> %serial_no%  <span class="token function">reboot</span>

adb <span class="token parameter variable">-s</span> %serial_no% wait-for-device

adb <span class="token parameter variable">-s</span> %serial_no% shell <span class="token string">&quot;getprop ro.serialno&quot;</span>

pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details><hr class="footnotes-sep">`,57),d={class:"footnotes"},u={class:"footnotes-list"},h={id:"footnote1",class:"footnote-item"},b={href:"http://static.kancloud.cn/mhsm/dyzsfx/2381667",target:"_blank",rel:"noopener noreferrer"},m=a("a",{href:"#footnote-ref1",class:"footnote-backref"},"↩︎",-1);function k(v,g){const n=t("ExternalLinkIcon");return o(),p("div",null,[r,a("section",d,[a("ol",u,[a("li",h,[a("p",null,[a("a",b,[s("安卓自动化工具(附自动刷抖音脚本实例)"),i(n)]),s(),m])])])])])}const _=e(c,[["render",k],["__file","adb.html.vue"]]);export{_ as default};
