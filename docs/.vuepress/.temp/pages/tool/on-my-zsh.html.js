export const data = {
  "key": "v-555eb08a",
  "path": "/tool/on-my-zsh.html",
  "title": "",
  "lang": "en-US",
  "frontmatter": {
    "summary": "on-my-zsh 要是 curl 失败的话可以手动下载下来 install.sh 然后执行，其主题的配置文件在 ~/.zshrc 下面。 github 链接是 https://github.com/ohmyzsh/ohmyzsh",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/tool/on-my-zsh.html"
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
      ]
    ]
  },
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "on-my-zsh",
      "slug": "on-my-zsh",
      "children": []
    }
  ],
  "readingTime": {
    "minutes": 0.21,
    "words": 63
  },
  "filePathRelative": "tool/on-my-zsh.md"
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
