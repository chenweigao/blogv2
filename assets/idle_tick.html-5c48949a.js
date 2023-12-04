import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as e,c,d as o,f as n}from"./app-22cda79c.js";const p={},i=n('<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><p>本文研究 tick, 在 kernel 的 idle 流程中，会出现对 tick 的调用，用于进行 idle 状态时钟的控制等。由于其机制复杂，代码量大，故将其单独进行研究。</p><p>本文主要针对于 idle 流程中涉及到的 tick 进行简单研究。</p><h2 id="tick-nohz-idle-stop-tick" tabindex="-1"><a class="header-anchor" href="#tick-nohz-idle-stop-tick" aria-hidden="true">#</a> tick_nohz_idle_stop_tick</h2><p>当出现需要处理的中断时，CPU 将从无操作系统状态恢复到正常运行状态，并执行 <code>tick_nohz_idle_stop_tick</code> 函数来重新启用时钟事件处理器。</p><p><code>tick_nohz_stop_tick</code> 的作用类似。</p><div class="hint-container note"><p class="hint-container-title">tick</p><p>tick 是周期性产生的 timer 中断事件，在系统中断的时候，不想产生周期性的中断，提出了动态时钟的概念，在系统空闲的阶段停掉周期性的时钟达到节省功耗的目的。</p><p>内核可以通过配置项 CONFIG_NO_HZ 及 CONFIG_NO_HZ_IDLE 来打开该功能，这样在系统空闲的时候就可以停掉 tick 一段时间，但并不是完全没有 tick 了，当有除了 idle 进程之外的其它进程运行的时候会恢复 tick[^2] 。</p><p>tick_device_mode 有两种模式：TICKDEV_MODE_PERIODIC 和 TICKDEV_MODE_ONESHOT，即周期模式和单触发模式。</p></div><h2 id="tick-broadcast-oneshot-control" tabindex="-1"><a class="header-anchor" href="#tick-broadcast-oneshot-control" aria-hidden="true">#</a> tick_broadcast_oneshot_control()</h2><p>在研究之前，我们先给出调用关系图：</p>',9),l=n(`<p>该函数代码的作用是打开或者关闭本地定时器。当 CPU 要进入需要关闭 local timer 的 idle 状态的时候，会调用<code>tick_broadcast_enter()</code>函数，从而告诉 tick 广播层属于本 CPU 的本地定时事件设备就要停止掉了，需要广播层提供服务。相反的，如果要退出某种 idle 状态之后，会调用 <code>tick_broadcast_exit()</code> 函数，恢复本 CPU 的本地定时事件设备，停止针对本 CPU 的 tick 广播服务。</p><p>这两个函数的代码如下：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token keyword">static</span> <span class="token keyword">inline</span> <span class="token keyword">int</span> <span class="token function">tick_broadcast_enter</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token function">tick_broadcast_oneshot_control</span><span class="token punctuation">(</span>TICK_BROADCAST_ENTER<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">static</span> <span class="token keyword">inline</span> <span class="token keyword">void</span> <span class="token function">tick_broadcast_exit</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token function">tick_broadcast_oneshot_control</span><span class="token punctuation">(</span>TICK_BROADCAST_EXIT<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>从中我们可以看出，这两个函数都是调用了 <code>tick_broadcast_oneshot_control</code>(我们本小节的主角函数)，只不过是传入了不同的 state 参数，该函数的实现如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">// in kernel/linux-5.10/kernel/time/tick-common.c</span>
<span class="token keyword">int</span> <span class="token function">tick_broadcast_oneshot_control</span><span class="token punctuation">(</span><span class="token keyword">enum</span> <span class="token class-name">tick_broadcast_state</span> state<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">struct</span> <span class="token class-name">tick_device</span> <span class="token operator">*</span>td <span class="token operator">=</span> <span class="token function">this_cpu_ptr</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>tick_cpu_device<span class="token punctuation">)</span><span class="token punctuation">;</span>

	<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>td<span class="token operator">-&gt;</span>evtdev<span class="token operator">-&gt;</span>features <span class="token operator">&amp;</span> CLOCK_EVT_FEAT_C3STOP<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>

	<span class="token keyword">return</span> <span class="token function">__tick_broadcast_oneshot_control</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">EXPORT_SYMBOL_GPL</span><span class="token punctuation">(</span>tick_broadcast_oneshot_control<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数首先那倒本地的 tick 设备，然后判断如果本 CPU 的 tick 设备不支持 <code>CLOCK_EVT_FEAT_C3STOP</code> 也就是 C3_STOP 状态的话直接退出。否则会调用 <code>__tick_broadcast_oneshot_control</code> 函数，我们继续看其实现：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">// kernel/linux-5.10/kernel/time/tick-broadcast.c</span>
<span class="token keyword">int</span> <span class="token function">__tick_broadcast_oneshot_control</span><span class="token punctuation">(</span><span class="token keyword">enum</span> <span class="token class-name">tick_broadcast_state</span> state<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">struct</span> <span class="token class-name">tick_device</span> <span class="token operator">*</span>td <span class="token operator">=</span> <span class="token function">this_cpu_ptr</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>tick_cpu_device<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">int</span> cpu <span class="token operator">=</span> <span class="token function">smp_processor_id</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

	<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">tick_oneshot_wakeup_control</span><span class="token punctuation">(</span>state<span class="token punctuation">,</span> td<span class="token punctuation">,</span> cpu<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>

	<span class="token keyword">if</span> <span class="token punctuation">(</span>tick_broadcast_device<span class="token punctuation">.</span>evtdev<span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token function">___tick_broadcast_oneshot_control</span><span class="token punctuation">(</span>state<span class="token punctuation">,</span> td<span class="token punctuation">,</span> cpu<span class="token punctuation">)</span><span class="token punctuation">;</span>

	<span class="token comment">/*
	 * If there is no broadcast or wakeup device, tell the caller not
	 * to go into deep idle.
	 */</span>
	<span class="token keyword">return</span> <span class="token operator">-</span>EBUSY<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数分为两个大的部分:</p><ul><li><code>tick_oneshot_wakeup_control</code></li><li><code>___tick_broadcast_oneshot_control</code></li></ul><p>我们在后文进行分析。</p><h3 id="tick-oneshot-wakeup-control" tabindex="-1"><a class="header-anchor" href="#tick-oneshot-wakeup-control" aria-hidden="true">#</a> tick_oneshot_wakeup_control</h3><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">tick_oneshot_wakeup_control</span><span class="token punctuation">(</span><span class="token keyword">enum</span> <span class="token class-name">tick_broadcast_state</span> state<span class="token punctuation">,</span>
				       <span class="token keyword">struct</span> <span class="token class-name">tick_device</span> <span class="token operator">*</span>td<span class="token punctuation">,</span>
				       <span class="token keyword">int</span> cpu<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">struct</span> <span class="token class-name">clock_event_device</span> <span class="token operator">*</span>dev<span class="token punctuation">,</span> <span class="token operator">*</span>wd<span class="token punctuation">;</span>

	dev <span class="token operator">=</span> td<span class="token operator">-&gt;</span>evtdev<span class="token punctuation">;</span>
	<span class="token keyword">if</span> <span class="token punctuation">(</span>td<span class="token operator">-&gt;</span>mode <span class="token operator">!=</span> TICKDEV_MODE_ONESHOT<span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token operator">-</span>EINVAL<span class="token punctuation">;</span>

	wd <span class="token operator">=</span> <span class="token function">tick_get_oneshot_wakeup_device</span><span class="token punctuation">(</span>cpu<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>wd<span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token operator">-</span>ENODEV<span class="token punctuation">;</span>

	<span class="token keyword">switch</span> <span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">case</span> TICK_BROADCAST_ENTER<span class="token operator">:</span>
		<span class="token function">clockevents_switch_state</span><span class="token punctuation">(</span>dev<span class="token punctuation">,</span> CLOCK_EVT_STATE_ONESHOT_STOPPED<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token function">clockevents_switch_state</span><span class="token punctuation">(</span>wd<span class="token punctuation">,</span> CLOCK_EVT_STATE_ONESHOT<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token function">clockevents_program_event</span><span class="token punctuation">(</span>wd<span class="token punctuation">,</span> dev<span class="token operator">-&gt;</span>next_event<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">break</span><span class="token punctuation">;</span>
	<span class="token keyword">case</span> TICK_BROADCAST_EXIT<span class="token operator">:</span>
		<span class="token comment">/* We may have transitioned to oneshot mode while idle */</span>
		<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">clockevent_get_state</span><span class="token punctuation">(</span>wd<span class="token punctuation">)</span> <span class="token operator">!=</span> CLOCK_EVT_STATE_ONESHOT<span class="token punctuation">)</span>
			<span class="token keyword">return</span> <span class="token operator">-</span>ENODEV<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tick-broadcast-oneshot-control-1" tabindex="-1"><a class="header-anchor" href="#tick-broadcast-oneshot-control-1" aria-hidden="true">#</a> ___tick_broadcast_oneshot_control</h3><p>这段代码很长，不在此进行全部列举。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">___tick_broadcast_oneshot_control</span><span class="token punctuation">(</span><span class="token keyword">enum</span> <span class="token class-name">tick_broadcast_state</span> state<span class="token punctuation">,</span>
					     <span class="token keyword">struct</span> <span class="token class-name">tick_device</span> <span class="token operator">*</span>td<span class="token punctuation">,</span>
					     <span class="token keyword">int</span> cpu<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token function">raw_spin_lock</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>tick_broadcast_lock<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>state <span class="token operator">==</span> TICK_BROADCAST_ENTER<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        
    <span class="token punctuation">}</span>
out<span class="token operator">:</span>
	<span class="token function">raw_spin_unlock</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>tick_broadcast_lock<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">return</span> ret<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数的整体框架如上所示，按照传入的 state 进行划分，我们在上文说过，state 可以分为 TICK_BROADCAST_ENTER 和 TICK_BROADCAST_EXIT。</p><p>后续会使用到的两个设备变量分别为：<code>struct clock_event_device *bc, *dev = td-&gt;evtdev;</code></p><ul><li>bc: <code>clock_event_device</code> 结构体，<code>bc = tick_broadcast_device.evtdev;</code> 表示 tick <em>广播</em> 设备；</li><li>dev: <code>clock_event_device</code> 结构体，<code>*dev = td-&gt;evtdev</code>, td 来自于函数传参，是一个 tick 设备，这里指代的是待休眠(本) CPU 上面的 tick 设备。</li></ul><p>下文我们先对传入的两个 state 进行研究。</p><h4 id="tick-broadcast-enter" tabindex="-1"><a class="header-anchor" href="#tick-broadcast-enter" aria-hidden="true">#</a> TICK_BROADCAST_ENTER</h4><p>该 state 表征的是当前 CPU 要进入 idle 状态。其步骤可以分解为以下的：</p><p>➡️➡️ 判断当前 CPU 能否进入（更深层次的）休眠状态。</p><div class="language-c" data-ext="c"><pre class="language-c"><code>ret <span class="token operator">=</span> <span class="token function">broadcast_needs_cpu</span><span class="token punctuation">(</span>bc<span class="token punctuation">,</span> cpu<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>ret<span class="token punctuation">)</span>
    <span class="token keyword">goto</span> out<span class="token punctuation">;</span>
</code></pre></div><blockquote><p>If the current CPU owns the hrtimer broadcast mechanism, it cannot go deep idle and we do not add the CPU to the broadcast mask. We don&#39;t have to go through the EXIT path as the local timer is not shutdown.</p></blockquote><p>如果当前的 CPU 不支持广播模式的话，就不能使能更深层次的 idle 状态，故直接退出。判断是否可以支持 broadcast 使用下面的逻辑：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">broadcast_needs_cpu</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">clock_event_device</span> <span class="token operator">*</span>bc<span class="token punctuation">,</span> <span class="token keyword">int</span> cpu<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
	<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>bc<span class="token operator">-&gt;</span>features <span class="token operator">&amp;</span> CLOCK_EVT_FEAT_HRTIMER<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
	<span class="token keyword">if</span> <span class="token punctuation">(</span>bc<span class="token operator">-&gt;</span>next_event <span class="token operator">==</span> KTIME_MAX<span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
	<span class="token keyword">return</span> bc<span class="token operator">-&gt;</span>bound_on <span class="token operator">==</span> cpu <span class="token operator">?</span> <span class="token operator">-</span>EBUSY <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>➡️➡️ TICKDEV_MODE_PERIODIC, 如果 tick 广播设备还在周期触发模式（与之对立的就是 one shot 模式）的话，执行以下逻辑：</p><div class="language-c" data-ext="c"><pre class="language-c"><code><span class="token keyword">if</span> <span class="token punctuation">(</span>tick_broadcast_device<span class="token punctuation">.</span>mode <span class="token operator">==</span> TICKDEV_MODE_PERIODIC<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">/* If it is a hrtimer based broadcast, return busy */</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>bc<span class="token operator">-&gt;</span>features <span class="token operator">&amp;</span> CLOCK_EVT_FEAT_HRTIMER<span class="token punctuation">)</span>
        ret <span class="token operator">=</span> <span class="token operator">-</span>EBUSY<span class="token punctuation">;</span>
    <span class="token keyword">goto</span> out<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>当 tick 广播设备是由高分辨率定时器模拟的则返回 -EBUSY.</p><p>➡️➡️ one shot 模式 下面的处理逻辑，是设置 tick_broadcast_oneshot_mask 中当前 CPU 对应的位。</p><div class="hint-container warning"><p class="hint-container-title">tick_broadcast_oneshot_mask</p><p>需要留意到 tick_broadcast_oneshot_mask 这个变量能否使用 <code>__cpumask_var_read_mostly</code> 进行修饰！后续遇到的变量也应当注意。</p></div><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">cpumask_test_and_set_cpu</span><span class="token punctuation">(</span>cpu<span class="token punctuation">,</span> tick_broadcast_oneshot_mask<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			<span class="token function">WARN_ON_ONCE</span><span class="token punctuation">(</span><span class="token function">cpumask_test_cpu</span><span class="token punctuation">(</span>cpu<span class="token punctuation">,</span> tick_broadcast_pending_mask<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

			<span class="token comment">/* Conditionally shut down the local timer. */</span>
    		<span class="token comment">// 尝试关闭本 CPU 上的定时事件设备</span>
			<span class="token function">broadcast_shutdown_local</span><span class="token punctuation">(</span>bc<span class="token punctuation">,</span> dev<span class="token punctuation">)</span><span class="token punctuation">;</span>

			<span class="token comment">/*
			 * We only reprogram the broadcast timer if we
			 * did not mark ourself in the force mask and
			 * if the cpu local event is earlier than the
			 * broadcast event. If the current CPU is in
			 * the force mask, then we are going to be
			 * woken by the IPI right away; we return
			 * busy, so the CPU does not try to go deep
			 * idle.
			 */</span>
    		<span class="token comment">// 如果 tick_broadcast_force_mask 中对应当前 CPU 的位被设置了</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">cpumask_test_cpu</span><span class="token punctuation">(</span>cpu<span class="token punctuation">,</span> tick_broadcast_force_mask<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				ret <span class="token operator">=</span> <span class="token operator">-</span>EBUSY<span class="token punctuation">;</span> <span class="token comment">// 在此返回 -EBUSY 说明其暂时不能进入 idle</span>
            <span class="token comment">/* 当前休眠 CPU 上的 tick 设备到期事件早于 tick 广播设备到期时间;
             * 如果该条件发生的话，则需要用当前 CPU 上 tick 设备的到期时间
             * 去更新 tick 广播
            */</span>
			<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>dev<span class="token operator">-&gt;</span>next_event <span class="token operator">&lt;</span> bc<span class="token operator">-&gt;</span>next_event<span class="token punctuation">)</span> <span class="token punctuation">{</span>
				<span class="token function">tick_broadcast_set_event</span><span class="token punctuation">(</span>bc<span class="token punctuation">,</span> cpu<span class="token punctuation">,</span> dev<span class="token operator">-&gt;</span>next_event<span class="token punctuation">)</span><span class="token punctuation">;</span>
				<span class="token comment">/*
				 * In case of hrtimer broadcasts the
				 * programming might have moved the
				 * timer to this cpu. If yes, remove
				 * us from the broadcast mask and
				 * return busy.
				 */</span>
                <span class="token comment">// 这边有个二次判断，很难理解</span>
				ret <span class="token operator">=</span> <span class="token function">broadcast_needs_cpu</span><span class="token punctuation">(</span>bc<span class="token punctuation">,</span> cpu<span class="token punctuation">)</span><span class="token punctuation">;</span>
				<span class="token keyword">if</span> <span class="token punctuation">(</span>ret<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token comment">// 如果不支持广播模式的话，就清除掉当前 CPU 对应的那一位</span>
					<span class="token function">cpumask_clear_cpu</span><span class="token punctuation">(</span>cpu<span class="token punctuation">,</span>
						tick_broadcast_oneshot_mask<span class="token punctuation">)</span><span class="token punctuation">;</span>
				<span class="token punctuation">}</span>
			<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面对每一行代码进行了解析，总结以下，总共做了以下的事情：</p><ol><li>关闭本地 CPU 的定时设备，主要的任务；</li><li>关闭后设置 tick_broadcast_force_mask 中本 CPU 对应的标志位；这边可能会存在一个竞态，所以会查询一次看是否设置成功；</li><li>在设置成功的前提下，调用 tick_broadcast_set_event, 设置 broadcast 事件；这个设置的前提是本 cpu 的 tick 事件早于广播的下一个事件（很好理解，否则我就用广播的事件时间就可以了）</li><li>在此判断是否支持 broadcase, 为何要再次判断呢？这就涉及到了 hrtimer broadcasts 机制的运行原理，需要进行更加详细的研究。</li></ol><h4 id="tick-broadcast-exit" tabindex="-1"><a class="header-anchor" href="#tick-broadcast-exit" aria-hidden="true">#</a> TICK_BROADCAST_EXIT</h4><p>@todo</p>`,36);function u(d,r){const s=t("Mermaid");return e(),c("div",null,[i,o(s,{id:"mermaid-35",code:"eJyNzDEPgjAQhuHdX9ERBxwYHUygZSAmmmAHE2OaWo7QSCgpJzr0x1upEybqTTc831u35q4aaZFwtiD+0pPqb7pqQUCHYMWAEuFM4nhDsgi1uoqLNbJScsAglmEWRPJBHhqDyCbhemnlmvCCbkVW7lNG0wMX+Y7npSN0vjYdDI1BoUyH1rTvUPKtdCy4D02QTo5FQvyTZS/tdE1muIJRK1jBiP5zJPe5n70n1K5w9w=="}),l])}const _=a(p,[["render",u],["__file","idle_tick.html.vue"]]);export{_ as default};
