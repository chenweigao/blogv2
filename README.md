---
home: true
modules: # 指定首页展示模块
  - Banner
  - Blog
  # - BannerBrand
  - MdContent
  - Footer
banner: # banner 模块的配置
  heroText: Something Nothing
  tagline: Enjoy when you can, and endure when you must.
  # heroImage: /backgroud.jpg
  heroImageStyle:
    maxWidth: 200px
    margin: 0 auto 2rem
  bgImage: /bg.svg
  bgImageStyle:
    height: 800px
bannerBrand: # bannerBrand 模块的配置
  heroText: Something Nothing
  tagline: Enjoy when you can, and endure when you must.
  heroImage: /logo.png
  heroImageStyle:
    maxWidth: 200px
    margin: 0 auto 2rem
  bgImage: /bg.svg
  bgImageStyle:
    height: 450px
  buttons:
    - { text: Guide, link: '/docs/guide/introduce' }
    - { text: Default Style, link: '/docs/style-default-api/introduce', type: 'plain' }
blog: # blog 模块的配置
  socialLinks: # 社交 icon 请到 [Xions](https://www.xicons.org/#/zh-CN) 页面的 tabler 下获取，复制名称即可
    - { icon: 'BrandGithub', link: 'https://github.com/chenweigao' }
    - { icon: 'BrandTwitter', link: 'https://twitter.com/reco_luan' }
footer: # 底部模块的配置
  record: 域名备案文案
  recordLink: 域名备案地址
  cyberSecurityRecord: 公安备案文案
  cyberSecurityLink: 公安备案地址
  startYear: 2017
---
