export const data = {
  "key": "v-480fefb8",
  "path": "/python/coroutines.html",
  "title": "Coroutines",
  "lang": "en-US",
  "frontmatter": {
    "title": "Coroutines",
    "summary": "因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。\n相当于每个 CPU 在同一时间只能执行一个线程。\n",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/python/coroutines.html"
        }
      ],
      [
        "meta",
        {
          "property": "og:site_name",
          "content": "Theme Demo"
        }
      ],
      [
        "meta",
        {
          "property": "og:title",
          "content": "Coroutines"
        }
      ],
      [
        "meta",
        {
          "property": "og:type",
          "content": "article"
        }
      ],
      [
        "meta",
        {
          "property": "og:locale",
          "content": "en-US"
        }
      ],
      [
        "meta",
        {
          "property": "og:locale:alternate",
          "content": "zh-CN"
        }
      ],
      [
        "meta",
        {
          "property": "article:published_time",
          "content": "2019-08-09T16:00:00.000Z"
        }
      ]
    ]
  },
  "excerpt": "<p>因为 GIL（全局解释器锁）, python 只有一个 GIL, 运行时只有拿到这个锁才能执行，同一时间只有一个获得 GIL 的线程在跑，其他线程都在等待状态。</p>\n<p>相当于每个 CPU 在同一时间只能执行一个线程。</p>\n",
  "headers": [
    {
      "level": 2,
      "title": "Q&A",
      "slug": "q-a",
      "children": []
    },
    {
      "level": 2,
      "title": "Why Coroutiones",
      "slug": "why-coroutiones",
      "children": []
    },
    {
      "level": 2,
      "title": "计算密集和I/O 密集",
      "slug": "计算密集和i-o-密集",
      "children": [
        {
          "level": 3,
          "title": "计算密集型",
          "slug": "计算密集型",
          "children": []
        },
        {
          "level": 3,
          "title": "I/O 密集型",
          "slug": "i-o-密集型",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "协程上下文切换",
      "slug": "协程上下文切换",
      "children": []
    },
    {
      "level": 2,
      "title": "Python 多线程结论",
      "slug": "python-多线程结论",
      "children": []
    },
    {
      "level": 2,
      "title": "并发和并行",
      "slug": "并发和并行",
      "children": [
        {
          "level": 3,
          "title": "并发",
          "slug": "并发",
          "children": []
        }
      ]
    }
  ],
  "readingTime": {
    "minutes": 2.98,
    "words": 893
  },
  "filePathRelative": "python/coroutines.md"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
