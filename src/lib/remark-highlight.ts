/**
 * Remark plugin for ==highlight== syntax
 * Validates: Requirements 15.2
 */

import { visit } from 'unist-util-visit';
import type { Root, Text, Parent } from 'mdast';

export function remarkHighlight() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return;

      const regex = /==([^=]+)==/g;
      const value = node.value;
      
      if (!regex.test(value)) return;
      
      // Reset regex
      regex.lastIndex = 0;
      
      const children: (Text | { type: 'html'; value: string })[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          children.push({
            type: 'text',
            value: value.slice(lastIndex, match.index),
          });
        }

        // Add highlighted text as HTML
        children.push({
          type: 'html',
          value: `<mark>${match[1]}</mark>`,
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < value.length) {
        children.push({
          type: 'text',
          value: value.slice(lastIndex),
        });
      }

      // Replace node with children
      if (children.length > 0) {
        parent.children.splice(index, 1, ...children as any);
      }
    });
  };
}
