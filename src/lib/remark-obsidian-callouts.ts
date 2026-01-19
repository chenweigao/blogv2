import { visit } from 'unist-util-visit';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';
import { obsidianTypeMapping, getCalloutConfig, escapeHtml } from './callout-config';

/**
 * Remark plugin to support Obsidian-style callouts
 * Syntax: > [!type] Title or > [!type]- Title (collapsible) or > [!type]+ Title (default open)
 * 
 * Examples:
 * > [!note] This is a note
 * > [!warning]- Click to expand
 * > [!tip]+ Default expanded
 */

// Regex to match Obsidian callout syntax: [!type] or [!type]- or [!type]+
// Use multiline mode (m flag) so ^ and $ match line boundaries, not just string boundaries
const CALLOUT_REGEX = /^\[!(\w+)\]([-+])?\s*(.*)$/m;

export function remarkObsidianCallouts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
      if (!parent || index === undefined) return;
      
      // Check if first child is a paragraph
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== 'paragraph') return;
      
      const paragraph = firstChild as Paragraph;
      if (!paragraph.children.length) return;
      
      // Get the first text node
      const firstText = paragraph.children[0];
      if (firstText.type !== 'text') return;
      
      const text = (firstText as Text).value;
      const match = text.match(CALLOUT_REGEX);
      
      if (!match) return;
      
      const [fullMatch, rawType, collapseFlag, titleText] = match;
      const type = obsidianTypeMapping[rawType.toLowerCase()] || 'note';
      const isCollapsible = collapseFlag === '-' || collapseFlag === '+';
      const defaultOpen = collapseFlag === '+';
      const title = titleText?.trim() || '';
      
      // Remove the callout syntax from the first text node
      const matchEndIndex = text.indexOf(fullMatch) + fullMatch.length;
      let remainingText = text.slice(matchEndIndex);
      if (remainingText.startsWith('\n')) {
        remainingText = remainingText.slice(1);
      }
      remainingText = remainingText.trim();
      
      // Build new children without the callout syntax
      const newParagraphChildren = [...paragraph.children];
      if (remainingText) {
        (newParagraphChildren[0] as Text).value = remainingText;
      } else {
        newParagraphChildren.shift();
      }
      
      // Build content children
      const contentChildren: any[] = [];
      
      if (newParagraphChildren.length > 0) {
        contentChildren.push({
          type: 'paragraph',
          children: newParagraphChildren,
        });
      }
      
      contentChildren.push(...node.children.slice(1));
      
      // Get config and build HTML
      const config = getCalloutConfig(type);
      const escapedTitle = escapeHtml(title || config.label);
      const headerHtml = `<span class="callout-icon-wrapper">${config.icon}</span><span class="callout-title">${escapedTitle}</span>`;
      
      if (isCollapsible) {
        const detailsNode: any = {
          type: 'html',
          value: `<details class="callout callout-${type} callout-collapsible callout-obsidian"${defaultOpen ? ' open' : ''} role="${config.role}" aria-label="${config.ariaLabel}">
<summary class="callout-header">${headerHtml}</summary>
<div class="callout-content">`,
        };
        
        const closingNode: any = {
          type: 'html',
          value: '</div></details>',
        };
        
        (parent.children as any[]).splice(index, 1, detailsNode, ...contentChildren, closingNode);
      } else {
        const openingNode: any = {
          type: 'html',
          value: `<div class="callout callout-${type} callout-obsidian" role="${config.role}" aria-label="${config.ariaLabel}">
<div class="callout-header">${headerHtml}</div>
<div class="callout-content">`,
        };
        
        const closingNode: any = {
          type: 'html',
          value: '</div></div>',
        };
        
        (parent.children as any[]).splice(index, 1, openingNode, ...contentChildren, closingNode);
      }
    });
  };
}

export default remarkObsidianCallouts;
