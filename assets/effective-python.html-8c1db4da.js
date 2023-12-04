const n=JSON.parse('{"key":"v-fe00e646","path":"/python/effective-python.html","title":"Effective Python","lang":"zh-CN","frontmatter":{"description":"Effective Python Function Closure (EP 15)有的时候需要将重要的消息或者意外的事件优先显示在其他内容前面，可以使用以下代码： def sort_priority(values, group): found = False def helper(x): nonlocal found if x in group: found = True return (0, x) return (1, x) values.sort(key=helper) return found","head":[["meta",{"property":"og:url","content":"https://vueblog.weigao.cc/python/effective-python.html"}],["meta",{"property":"og:site_name","content":"WW"}],["meta",{"property":"og:title","content":"Effective Python"}],["meta",{"property":"og:description","content":"Effective Python Function Closure (EP 15)有的时候需要将重要的消息或者意外的事件优先显示在其他内容前面，可以使用以下代码： def sort_priority(values, group): found = False def helper(x): nonlocal found if x in group: found = True return (0, x) return (1, x) values.sort(key=helper) return found"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"Someone"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Effective Python\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Someone\\",\\"url\\":\\"https://www.weigao.cc\\"}]}"]]},"headers":[{"level":2,"title":"Function Closure","slug":"function-closure","link":"#function-closure","children":[]},{"level":2,"title":"Generator","slug":"generator","link":"#generator","children":[]}],"git":{},"readingTime":{"minutes":0.72,"words":217},"filePathRelative":"python/effective-python.md","excerpt":"<h1> Effective Python</h1>\\n<h2> Function Closure</h2>\\n<p>(<a href=\\"https://github.com/chenweigao/_code/blob/master/Effective_Python/EP15.py\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">EP 15</a>)有的时候需要将重要的消息或者意外的事件优先显示在其他内容前面，可以使用以下代码：</p>\\n<div class=\\"language-python line-numbers-mode\\" data-ext=\\"py\\"><pre class=\\"language-python\\"><code><span class=\\"token keyword\\">def</span> <span class=\\"token function\\">sort_priority</span><span class=\\"token punctuation\\">(</span>values<span class=\\"token punctuation\\">,</span> group<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">:</span>\\n    found <span class=\\"token operator\\">=</span> <span class=\\"token boolean\\">False</span>\\n\\n    <span class=\\"token keyword\\">def</span> <span class=\\"token function\\">helper</span><span class=\\"token punctuation\\">(</span>x<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">:</span>\\n        <span class=\\"token keyword\\">nonlocal</span> found\\n        <span class=\\"token keyword\\">if</span> x <span class=\\"token keyword\\">in</span> group<span class=\\"token punctuation\\">:</span>\\n            found <span class=\\"token operator\\">=</span> <span class=\\"token boolean\\">True</span>\\n            <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">(</span><span class=\\"token number\\">0</span><span class=\\"token punctuation\\">,</span> x<span class=\\"token punctuation\\">)</span>\\n        <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">(</span><span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span> x<span class=\\"token punctuation\\">)</span>\\n    values<span class=\\"token punctuation\\">.</span>sort<span class=\\"token punctuation\\">(</span>key<span class=\\"token operator\\">=</span>helper<span class=\\"token punctuation\\">)</span>\\n    <span class=\\"token keyword\\">return</span> found\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{n as data};
