import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../docs/.vitepress/utils/frontmatter.js'

describe('frontmatter parsing', () => {
  it('parses valid yaml with title/date', () => {
    const content = `---\\ntitle: Hello\\ndate: 2025-01-01\\n---\\n# Heading\\nBody`
    const fm = parseFrontmatter(content)
    expect(fm.title).toBe('Hello')
    expect(fm.date).toBe('2025-01-01')
  })

  it('returns empty object for missing frontmatter', () => {
    const content = `# Heading\\nBody`
    const fm = parseFrontmatter(content)
    expect(fm).toEqual({})
  })

  it('handles array tags', () => {
    const content = `---\\ntitle: T\\ntags:\\n  - a\\n  - b\\n---\\nBody`
    const fm = parseFrontmatter(content)
    expect(fm.tags).toEqual(['a', 'b'])
  })

  it('handles invalid yaml gracefully', () => {
    const content = `---\\n::: not yaml :::\\n---\\nBody`
    const fm = parseFrontmatter(content)
    expect(fm).toEqual({})
  })
})