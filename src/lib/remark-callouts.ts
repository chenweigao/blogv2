import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';

// Callout type configuration
const calloutTypes: Record<string, { label: string; icon: string }> = {
  tip: {
    label: '提示',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  },
  note: {
    label: '注意',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
  warning: {
    label: '警告',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  },
  danger: {
    label: '危险',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
  },
  details: {
    label: '详情',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>`,
  },
};

export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const directive = node as ContainerDirective;
        const type = directive.name;

        if (!calloutTypes[type]) return;

        const config = calloutTypes[type];
        const customTitle = directive.children?.[0]?.type === 'paragraph' 
          ? getTextContent(directive.children[0])
          : null;
        
        // Check if first child is just the title (single line with no other content indicator)
        const hasCustomTitle = customTitle && !customTitle.includes('\n');
        const title = hasCustomTitle ? customTitle : config.label;
        
        // For details type, use HTML details/summary
        if (type === 'details') {
          const data = directive.data || (directive.data = {});
          data.hName = 'details';
          data.hProperties = {
            className: ['callout', `callout-${type}`],
          };
          
          // Wrap content
          directive.children = [
            {
              type: 'html',
              value: `<summary class="callout-header"><span class="callout-icon-wrapper">${config.icon}</span><span class="callout-title">${title}</span></summary><div class="callout-content">`,
            } as any,
            ...(hasCustomTitle ? directive.children.slice(1) : directive.children),
            {
              type: 'html',
              value: '</div>',
            } as any,
          ];
        } else {
          // Regular callout
          const data = directive.data || (directive.data = {});
          data.hName = 'div';
          data.hProperties = {
            className: ['callout', `callout-${type}`],
            role: 'note',
          };

          // Wrap content with header
          directive.children = [
            {
              type: 'html',
              value: `<div class="callout-header"><span class="callout-icon-wrapper">${config.icon}</span><span class="callout-title">${title}</span></div><div class="callout-content">`,
            } as any,
            ...(hasCustomTitle ? directive.children.slice(1) : directive.children),
            {
              type: 'html',
              value: '</div>',
            } as any,
          ];
        }
      }
    });
  };
}

function getTextContent(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.children) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

export default remarkCallouts;
