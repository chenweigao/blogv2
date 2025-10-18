import { describe, it, expect } from 'vitest'
import MarkdownIt from 'markdown-it'
import imageSizePlugin from '../docs/.vitepress/theme/utils/markdown-it-image-size.js'

describe('markdown-it image size plugin', () => {
  it('adds width/height and escapes alt attribute', () => {
    const md = new MarkdownIt()
    md.use(imageSizePlugin)
    const html = md.render('![xss\\"attack|300x200](/images/sample.png)')
    expect(html).toContain('width="300"')
    expect(html).toContain('height="200"')
    expect(html).toContain('alt="xss&amp;quot;attack"')
  })

  it('keeps default rendering when manifest missing', () => {
    const md = new MarkdownIt()
    md.use(imageSizePlugin)
    const html = md.render('![alt](https://example.com/image.png)')
    expect(html).toContain('<img')
  })
})