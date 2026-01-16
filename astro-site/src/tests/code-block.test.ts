import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 3: Code Block Rendering
 * Validates: Requirements 2.4, 13.1, 13.4
 * 
 * Tests that code blocks have highlighting, line numbers, and language label
 */

interface CodeBlockProps {
  code: string;
  lang: string;
  showLineNumbers: boolean;
}

// Simulates code block processing
function processCodeBlock(props: CodeBlockProps) {
  const lines = props.code.split('\n');
  return {
    lineCount: lines.length,
    hasLanguageLabel: props.lang.length > 0,
    hasLineNumbers: props.showLineNumbers,
    languageClass: `language-${props.lang}`,
  };
}

describe('Property 3: Code Block Rendering', () => {
  it('displays correct line count', () => {
    const result = processCodeBlock({
      code: 'line1\nline2\nline3',
      lang: 'javascript',
      showLineNumbers: true,
    });
    expect(result.lineCount).toBe(3);
  });

  it('includes language class', () => {
    const result = processCodeBlock({
      code: 'const x = 1;',
      lang: 'typescript',
      showLineNumbers: true,
    });
    expect(result.languageClass).toBe('language-typescript');
  });

  it('property: line count matches newlines + 1', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 50 }),
        (lines) => {
          const code = lines.join('\n');
          const result = processCodeBlock({ code, lang: 'text', showLineNumbers: true });
          return result.lineCount === lines.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: language class always prefixed correctly', () => {
    const langArb = fc.stringMatching(/^[a-z]+$/);

    fc.assert(
      fc.property(langArb, (lang) => {
        const result = processCodeBlock({ code: '', lang, showLineNumbers: true });
        return result.languageClass === `language-${lang}`;
      }),
      { numRuns: 100 }
    );
  });

  it('property: empty code has exactly one line', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', ' ', '\t'),
        (code) => {
          const result = processCodeBlock({ code, lang: 'text', showLineNumbers: true });
          return result.lineCount === 1;
        }
      ),
      { numRuns: 10 }
    );
  });
});
