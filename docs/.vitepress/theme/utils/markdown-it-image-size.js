/**
 * Markdown-it 插件：支持图片大小语法
 * 语法：![alt text|widthxheight](image.png) 或 ![alt text|width](image.png)
 * 
 * 示例：
 * ![图片描述|300x200](./image.png)  - 设置宽高
 * ![图片描述|400x0](./image.png)   - 设置宽度，高度自适应  
 * ![图片描述|0x300](./image.png)   - 设置高度，宽度自适应
 * ![图片描述|50%](./image.png)     - 设置宽度百分比
 * ![图片描述|300](./image.png)     - 仅设置宽度
 */

function imageSizePlugin(md) {
  // 保存原始的图片render规则
  const defaultImageRenderer = md.renderer.rules.image || function(tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options)
  }

  md.renderer.rules.image = function(tokens, idx, options, env, renderer) {
    const token = tokens[idx]
    const src = token.attrs[token.attrIndex('src')][1]
    const altText = token.content || ''

    // 新增：所有图片默认懒加载与异步解码
    const ensureAttr = (name, value) => {
      const i = token.attrIndex(name)
      if (i < 0) token.attrPush([name, value])
      else token.attrs[i][1] = value
    }
    ensureAttr('loading', 'lazy')
    ensureAttr('decoding', 'async')

    // 检查alt text中是否包含尺寸信息
    const sizeMatch = altText.match(/^(.*?)\|(.+)$/)
    
    if (sizeMatch) {
      const actualAlt = sizeMatch[1].trim()
      const sizeStr = sizeMatch[2].trim()
      
      // 更新token的content为实际的alt text
      token.content = actualAlt
      
      // 解析尺寸字符串
      const styles = []
      const classes = ['responsive-image']
      let widthAttr = null
      let heightAttr = null
      
      // 匹配不同的尺寸格式
      if (sizeStr.match(/^\d+x\d+$/)) {
        // 格式：300x200
        const [width, height] = sizeStr.split('x')
        if (width !== '0') {
          styles.push(`width: ${width}px`)
          widthAttr = width
        }
        if (height !== '0') {
          styles.push(`height: ${height}px`)
          heightAttr = height
        }
      } else if (sizeStr.match(/^\d+x0$/)) {
        // 格式：300x0 (宽度固定，高度自适应)
        const width = sizeStr.split('x')[0]
        styles.push(`width: ${width}px`)
        styles.push('height: auto')
        widthAttr = width
      } else if (sizeStr.match(/^0x\d+$/)) {
        // 格式：0x300 (高度固定，宽度自适应)
        const height = sizeStr.split('x')[1]
        styles.push(`height: ${height}px`)
        styles.push('width: auto')
        heightAttr = height
      } else if (sizeStr.match(/^\d+%$/)) {
        // 格式：50% (百分比宽度)
        styles.push(`width: ${sizeStr}`)
        styles.push('height: auto')
      } else if (sizeStr.match(/^\d+$/)) {
        // 格式：300 (仅宽度)
        styles.push(`width: ${sizeStr}px`)
        styles.push('height: auto')
        widthAttr = sizeStr
      } else {
        // 无效格式，保持原样
        token.content = altText
      }
      
      if (styles.length > 0) {
        // 添加或更新style属性
        const styleAttrIndex = token.attrIndex('style')
        const styleValue = styles.join('; ')
        
        if (styleAttrIndex < 0) {
          token.attrPush(['style', styleValue])
        } else {
          token.attrs[styleAttrIndex][1] += '; ' + styleValue
        }
        
        // 添加响应式类
        const classAttrIndex = token.attrIndex('class')
        if (classAttrIndex < 0) {
          token.attrPush(['class', classes.join(' ')])
        } else {
          token.attrs[classAttrIndex][1] += ' ' + classes.join(' ')
        }
        
        // 添加alt属性
        const altAttrIndex = token.attrIndex('alt')
        if (altAttrIndex < 0) {
          token.attrPush(['alt', actualAlt])
        } else {
          token.attrs[altAttrIndex][1] = actualAlt
        }

        // 新增：当为像素尺寸且非 0 时，补充 width/height 属性，降低 CLS
        if (widthAttr && /^\d+$/.test(String(widthAttr)) && widthAttr !== '0') {
          ensureAttr('width', String(widthAttr))
        }
        if (heightAttr && /^\d+$/.test(String(heightAttr)) && heightAttr !== '0') {
          ensureAttr('height', String(heightAttr))
        }
      }
    }
    
    return defaultImageRenderer(tokens, idx, options, env, renderer)
  }
}

export default imageSizePlugin