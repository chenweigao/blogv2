import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as t}from"./app-22cda79c.js";const e={},p=t(`<h2 id="abstract" tabindex="-1"><a class="header-anchor" href="#abstract" aria-hidden="true">#</a> Abstract</h2><p>Art 的创建过程是一个很复杂的命题，所以我们单独开设一章来对这个过程进行学习。</p><p>@todo 增加全局的流程图。</p><h2 id="art-create" tabindex="-1"><a class="header-anchor" href="#art-create" aria-hidden="true">#</a> Art Create</h2><h3 id="jni-createjavavm" tabindex="-1"><a class="header-anchor" href="#jni-createjavavm" aria-hidden="true">#</a> JNI_CreateJavaVM</h3><p>当我们选择了 ART 运行时，Zygote 进程在启动过程中，会调用 <code>libart.so</code> 里面的函数 <code>JNI_CreateVM</code> 来<strong>创建一个 art 虚拟机</strong>，这个函数的实现如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// art/runtime/jni/java_vm_ext.cc</span>
<span class="token comment">// JNI Invocation interface.</span>

extern <span class="token string">&quot;C&quot;</span> jint <span class="token class-name">JNI_CreateJavaVM</span><span class="token punctuation">(</span><span class="token class-name">JavaVM</span><span class="token operator">*</span><span class="token operator">*</span> p_vm<span class="token punctuation">,</span> <span class="token class-name">JNIEnv</span><span class="token operator">*</span><span class="token operator">*</span> p_env<span class="token punctuation">,</span> <span class="token keyword">void</span><span class="token operator">*</span> vm_args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">ScopedTrace</span> <span class="token function">trace</span><span class="token punctuation">(</span>__FUNCTION__<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token class-name">JavaVMInitArgs</span><span class="token operator">*</span> args <span class="token operator">=</span> static_cast<span class="token operator">&lt;</span><span class="token class-name">JavaVMInitArgs</span><span class="token operator">*</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>vm_args<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">JavaVMExt</span><span class="token operator">::</span><span class="token class-name">IsBadJniVersion</span><span class="token punctuation">(</span>args<span class="token operator">-&gt;</span>version<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">LOG</span><span class="token punctuation">(</span><span class="token constant">ERROR</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">&quot;Bad JNI version passed to CreateJavaVM: &quot;</span> <span class="token operator">&lt;&lt;</span> args<span class="token operator">-&gt;</span>version<span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token constant">JNI_EVERSION</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token class-name">RuntimeOptions</span> options<span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> args<span class="token operator">-&gt;</span>nOptions<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">JavaVMOption</span><span class="token operator">*</span> option <span class="token operator">=</span> <span class="token operator">&amp;</span>args<span class="token operator">-&gt;</span>options<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    options<span class="token punctuation">.</span><span class="token function">push_back</span><span class="token punctuation">(</span>std<span class="token operator">::</span><span class="token function">make_pair</span><span class="token punctuation">(</span>std<span class="token operator">::</span><span class="token function">string</span><span class="token punctuation">(</span>option<span class="token operator">-&gt;</span>optionString<span class="token punctuation">)</span><span class="token punctuation">,</span> option<span class="token operator">-&gt;</span>extraInfo<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  bool ignore_unrecognized <span class="token operator">=</span> args<span class="token operator">-&gt;</span>ignoreUnrecognized<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">Runtime</span><span class="token operator">::</span><span class="token class-name">Create</span><span class="token punctuation">(</span>options<span class="token punctuation">,</span> ignore_unrecognized<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token constant">JNI_ERR</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// Initialize native loader. This step makes sure we have</span>
  <span class="token comment">// everything set up before we start using JNI.</span>
  android<span class="token operator">::</span><span class="token class-name">InitializeNativeLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token class-name">Runtime</span><span class="token operator">*</span> runtime <span class="token operator">=</span> <span class="token class-name">Runtime</span><span class="token operator">::</span><span class="token class-name">Current</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  bool started <span class="token operator">=</span> runtime<span class="token operator">-&gt;</span><span class="token class-name">Start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>started<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    delete <span class="token class-name">Thread</span><span class="token operator">::</span><span class="token class-name">Current</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token class-name">GetJniEnv</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    delete runtime<span class="token operator">-&gt;</span><span class="token class-name">GetJavaVM</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">LOG</span><span class="token punctuation">(</span><span class="token constant">WARNING</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">&quot;CreateJavaVM failed&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token constant">JNI_ERR</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token operator">*</span>p_env <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token operator">::</span><span class="token class-name">Current</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token class-name">GetJniEnv</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">*</span>p_vm <span class="token operator">=</span> runtime<span class="token operator">-&gt;</span><span class="token class-name">GetJavaVM</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token constant">JNI_OK</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个函数不长，其核心的代码是调用 <code>Runtime::Create</code> 来进行虚拟机创建；在创建之前，将参数 <code>vm_args</code> 转换为 <code>JavaVMInitArgs</code> 对象，按照 key-value 的形式保存在 <code>JavaVMOption</code> 中，并以该向量作为传入传递给 <code>Runtime::Create</code> 来创建虚拟机。</p><h3 id="runtime-create" tabindex="-1"><a class="header-anchor" href="#runtime-create" aria-hidden="true">#</a> Runtime::Create</h3><p><code>Runtime::Create</code> 的实现如下所示：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// art/runtime/runtime.cc</span>

bool <span class="token class-name">Runtime</span><span class="token operator">::</span><span class="token class-name">Create</span><span class="token punctuation">(</span><span class="token class-name">RuntimeArgumentMap</span><span class="token operator">&amp;&amp;</span> runtime_options<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// TODO: acquire a static mutex on Runtime to avoid racing.</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Runtime</span><span class="token operator">::</span><span class="token function">instance_</span> <span class="token operator">!=</span> nullptr<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  instance_ <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Runtime</span><span class="token punctuation">;</span>
  <span class="token class-name">Locks</span><span class="token operator">::</span><span class="token class-name">SetClientCallback</span><span class="token punctuation">(</span><span class="token class-name">IsSafeToCallAbort</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>instance_<span class="token operator">-&gt;</span><span class="token class-name">Init</span><span class="token punctuation">(</span>std<span class="token operator">::</span><span class="token function">move</span><span class="token punctuation">(</span>runtime_options<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// TODO: Currently deleting the instance will abort the runtime on destruction. Now This will</span>
    <span class="token comment">// leak memory, instead. Fix the destructor. b/19100793.</span>
    <span class="token comment">// delete instance_;</span>
    instance_ <span class="token operator">=</span> nullptr<span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

bool <span class="token class-name">Runtime</span><span class="token operator">::</span><span class="token class-name">Create</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token class-name">RuntimeOptions</span><span class="token operator">&amp;</span> raw_options<span class="token punctuation">,</span> bool ignore_unrecognized<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">RuntimeArgumentMap</span> runtime_options<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token class-name">ParseOptions</span><span class="token punctuation">(</span>raw_options<span class="token punctuation">,</span> ignore_unrecognized<span class="token punctuation">,</span> <span class="token operator">&amp;</span>runtime_options<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
      <span class="token class-name">Create</span><span class="token punctuation">(</span>std<span class="token operator">::</span><span class="token function">move</span><span class="token punctuation">(</span>runtime_options<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面列举了两个函数，做了参数重载，其实还是调用到了第一个函数。<code>instance_</code> 是 Runtime 类的静态成员变量，指向进程中的一个 Runtime 单例，这个单例就是描述当前进程的 art 虚拟机实例；第 5 行判断了这个实例是否已经存在了（即当前进程是否已经创建有一个 ART 虚拟机实例），如果已有的话，函数返回，否则的话，创建一个 art 虚拟机实例（第 8 行），创建的实例保存在静态成员变量 <code>instance_</code> 中，然后调用 Runtime 类的成员函数 <code>Init()</code> 对新创建的 art 虚拟机进行初始化。</p><h3 id="runtime-init" tabindex="-1"><a class="header-anchor" href="#runtime-init" aria-hidden="true">#</a> Runtime::Init()</h3><p><code>Runtime::Init()</code> 的实现如下所示：</p><div class="language-java" data-ext="java"><pre class="language-java"><code><span class="token comment">// art/runtime/runtime.cc</span>
bool <span class="token class-name">Runtime</span><span class="token operator">::</span><span class="token class-name">Init</span><span class="token punctuation">(</span><span class="token class-name">RuntimeArgumentMap</span><span class="token operator">&amp;&amp;</span> runtime_options_in<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
<span class="token punctuation">}</span>
</code></pre></div><p>由于这个函数 700 多行，所以就不在这边列举源码了。</p>`,16),o=[p];function c(l,i){return s(),a("div",null,o)}const k=n(e,[["render",c],["__file","art_create.html.vue"]]);export{k as default};
