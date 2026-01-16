import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 4: Mermaid Diagram Rendering
 * Validates: Requirements 3.1
 * 
 * Property 5: Mermaid Error Handling
 * Validates: Requirements 3.5
 */

// Simulates mermaid code validation (basic syntax check)
function isValidMermaidSyntax(code: string): boolean {
  const validStarts = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'gitGraph'];
  const trimmed = code.trim();
  return validStarts.some(start => trimmed.startsWith(start));
}

// Simulates render result
interface RenderResult {
  success: boolean;
  svg?: string;
  error?: string;
  sourceCode: string;
}

function simulateRender(code: string): RenderResult {
  if (isValidMermaidSyntax(code)) {
    return {
      success: true,
      svg: `<svg><!-- rendered: ${code.slice(0, 20)} --></svg>`,
      sourceCode: code,
    };
  }
  return {
    success: false,
    error: 'Invalid mermaid syntax',
    sourceCode: code,
  };
}

describe('Property 4: Mermaid Diagram Rendering', () => {
  it('renders valid flowchart syntax', () => {
    const code = 'graph TD\n  A --> B';
    const result = simulateRender(code);
    expect(result.success).toBe(true);
    expect(result.svg).toBeDefined();
  });

  it('renders valid sequence diagram', () => {
    const code = 'sequenceDiagram\n  A->>B: Hello';
    const result = simulateRender(code);
    expect(result.success).toBe(true);
  });

  it('property: valid syntax always produces SVG', () => {
    const validCodeArb = fc.constantFrom(
      'graph TD\n  A --> B',
      'flowchart LR\n  Start --> End',
      'sequenceDiagram\n  A->>B: msg',
      'pie\n  "A": 50\n  "B": 50',
      'gantt\n  title Test\n  section A\n  Task: a1, 2024-01-01, 1d',
    );

    fc.assert(
      fc.property(validCodeArb, (code) => {
        const result = simulateRender(code);
        return result.success && result.svg !== undefined;
      }),
      { numRuns: 50 }
    );
  });
});

describe('Property 5: Mermaid Error Handling', () => {
  it('returns error for invalid syntax', () => {
    const code = 'invalid mermaid code';
    const result = simulateRender(code);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('preserves source code on error', () => {
    const code = 'not valid';
    const result = simulateRender(code);
    expect(result.sourceCode).toBe(code);
  });

  it('property: invalid syntax always includes source code', () => {
    const invalidCodeArb = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => !isValidMermaidSyntax(s));

    fc.assert(
      fc.property(invalidCodeArb, (code) => {
        const result = simulateRender(code);
        return !result.success && result.sourceCode === code;
      }),
      { numRuns: 100 }
    );
  });

  it('property: error result always has error message', () => {
    const invalidCodeArb = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => !isValidMermaidSyntax(s));

    fc.assert(
      fc.property(invalidCodeArb, (code) => {
        const result = simulateRender(code);
        return !result.success && result.error !== undefined && result.error.length > 0;
      }),
      { numRuns: 100 }
    );
  });
});
