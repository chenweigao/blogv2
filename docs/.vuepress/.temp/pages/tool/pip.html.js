export const data = {
  "key": "v-7b4ca1e0",
  "path": "/tool/pip.html",
  "title": "",
  "lang": "en-US",
  "frontmatter": {
    "summary": "临时指定 永久指定 windows 在 c:/windows/user/your-name/pip/ 下，新建文件 pip.ini: 如果找不到这个文件夹，就新建一个。 在有些 winodws 电脑中，可能不是这个文件夹，那么快速找到这个文件夹的方法是：在 windows 的资源管理器中输入 %APPDATA%, 会跳转到一个文件夹下，然后在这个文件夹下面新",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/tool/pip.html"
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
      "title": "临时指定",
      "slug": "临时指定",
      "children": []
    },
    {
      "level": 2,
      "title": "永久指定",
      "slug": "永久指定",
      "children": [
        {
          "level": 3,
          "title": "windows",
          "slug": "windows",
          "children": []
        },
        {
          "level": 3,
          "title": "Linux",
          "slug": "linux",
          "children": []
        }
      ]
    }
  ],
  "readingTime": {
    "minutes": 0.56,
    "words": 169
  },
  "filePathRelative": "tool/pip.md"
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
