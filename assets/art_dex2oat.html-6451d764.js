const t=JSON.parse('{"key":"v-b86e3ea4","path":"/java/art/art_dex2oat.html","title":"ART dex2oat","lang":"zh-CN","frontmatter":{"title":"ART dex2oat","date":"2022-10-28T00:00:00.000Z","tag":["jvm","java"],"category":["JAVA"],"description":"Abstract 本文主要研究 art 中的 dex2oat 模块。 写作本文的目的在于，笔者在研究 getCharNoCheck 的 native 实现的时候，发现其调用的路径是与 dex2oat 有关的，所以对这个模块进行简单的研究； 第一阶段本文主要研究，Andriod 运行时 art 加载 oat 文件的过程分析，写作时间2022年10月28日； 第二阶段主要对本文进行补充，包括 oat 文件结构的研究； Art &amp; oat oat 文件的产生","head":[["meta",{"property":"og:url","content":"https://vueblog.weigao.cc/java/art/art_dex2oat.html"}],["meta",{"property":"og:site_name","content":"WW"}],["meta",{"property":"og:title","content":"ART dex2oat"}],["meta",{"property":"og:description","content":"Abstract 本文主要研究 art 中的 dex2oat 模块。 写作本文的目的在于，笔者在研究 getCharNoCheck 的 native 实现的时候，发现其调用的路径是与 dex2oat 有关的，所以对这个模块进行简单的研究； 第一阶段本文主要研究，Andriod 运行时 art 加载 oat 文件的过程分析，写作时间2022年10月28日； 第二阶段主要对本文进行补充，包括 oat 文件结构的研究； Art &amp; oat oat 文件的产生"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"Someone"}],["meta",{"property":"article:tag","content":"jvm"}],["meta",{"property":"article:tag","content":"java"}],["meta",{"property":"article:published_time","content":"2022-10-28T00:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ART dex2oat\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-10-28T00:00:00.000Z\\",\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Someone\\",\\"url\\":\\"https://www.weigao.cc\\"}]}"]]},"headers":[{"level":2,"title":"Abstract","slug":"abstract","link":"#abstract","children":[]},{"level":2,"title":"Art & oat","slug":"art-oat","link":"#art-oat","children":[{"level":3,"title":"oat 文件的产生","slug":"oat-文件的产生","link":"#oat-文件的产生","children":[]},{"level":3,"title":"dex2oat 什么时候被触发","slug":"dex2oat-什么时候被触发","link":"#dex2oat-什么时候被触发","children":[]}]},{"level":2,"title":"dex2oat code","slug":"dex2oat-code","link":"#dex2oat-code","children":[{"level":3,"title":"main()","slug":"main","link":"#main","children":[]}]}],"git":{},"readingTime":{"minutes":1.74,"words":522},"filePathRelative":"java/art/art_dex2oat.md","localizedDate":"2022年10月28日","excerpt":"<h2> Abstract</h2>\\n<p>本文主要研究 art 中的 dex2oat 模块。</p>\\n<p>写作本文的目的在于，笔者在研究 <code>getCharNoCheck</code> 的 native 实现的时候，发现其调用的路径是与 dex2oat 有关的，所以对这个模块进行简单的研究；</p>\\n<p>第一阶段本文主要研究，Andriod 运行时 art 加载 oat 文件的过程分析，写作时间2022年10月28日；</p>\\n<p>第二阶段主要对本文进行补充，包括 oat 文件结构的研究；</p>\\n<h2> Art &amp; oat</h2>\\n<h3> oat 文件的产生</h3>","autoDesc":true}');export{t as data};
