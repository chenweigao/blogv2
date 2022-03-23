<template><p>使用 crontab 做定时任务或循环任务。</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pip <span class="token function">install</span> python-crontab
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="时序语法" tabindex="-1"><a class="header-anchor" href="#时序语法" aria-hidden="true">#</a> 时序语法</h2>
<p>现在，要安排一个 cron 作业来执行上面的脚本来输出到另一个文件，你需要添加以下代码行：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token number">50</span> <span class="token number">19</span> * * * python hello.py <span class="token operator">>></span> a.txt
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>上述代码行将文件的标准输出重定向到名为 a.txt 的文件中。要执行命令前面的数字定义了作业的执行时间。时序语法有五个部分：</p>
<ol>
<li>minute（分钟）</li>
<li>hour（小时）</li>
<li>day of month（月的第几天）</li>
<li>month（月）</li>
<li>day of week（一周的第几天)</li>
</ol>
<p>时序语法中的星号「*」表示每次都会运行。</p>
</template>
