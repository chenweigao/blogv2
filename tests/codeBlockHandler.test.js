import { describe, it, expect } from 'vitest'
import { CodeBlockHandler } from '../docs/.vitepress/theme/utils/codeBlockHandler.js'
import { ref } from 'vue'

function setupDomWithCode() {
  const pre = document.createElement('pre')
  const code = document.createElement('code')
  code.textContent = 'console.log(123)'
  pre.appendChild(code)
  document.body.appendChild(pre)
  return { pre, code }
}

describe('CodeBlockHandler', () => {
  it('opens modal with code content on click', () => {
    const state = { visible: ref(false), data: ref({ code: '', language: 'text' }) }
    const handler = new CodeBlockHandler(state)
    handler.initCodeBlockClick()
    const { code } = setupDomWithCode()
    const evt = new MouseEvent('click', { bubbles: true })
    code.dispatchEvent(evt)
    expect(state.visible.value).toBe(true)
    expect(state.data.value.code).toContain('console.log(123)')
  })
})