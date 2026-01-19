import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import { calloutTypes, escapeHtml } from './callout-config';

/**
 * Remark plugin to support directive-style callouts (:::type)
 * 
 * Examples:
 * :::tip
 * Content here
 * :::
 * 
 * :::warning[Custom Title]
 * Content here
 * :::
 * 
 * :::tip{collapsible}
 * Collapsible content
 * :::
 */

// Extract text content from AST node
function getTextContent(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.children) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

// Parse attributes from directive
function parseAttributes(directive: any): { 
  collapsible: boolean; 
  open: boolean;
  noTitle: boolean;
} {
  const attrs = directive.attributes || {};
  return {
    collapsible: attrs.collapsible === '' || attrs.collapsible === 'true',
    open: attrs.open === '' || attrs.open === 'true',
    noTitle: attrs['no-title'] === '' || attrs['no-title'] === 'true',
  };
}

export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const directive = node as ContainerDirective & { 
          attributes?: Record<string, string>;
          label?: string;
        };
        const type = directive.name;

        if (!calloutTypes[type]) return;

        const config = calloutTypes[type];
        const attrs = parseAttributes(directive);
        
        // Get custom title from directive label (:::tip[Title])
        let customTitle: string | null = null;
        const firstChild = directive.children?.[0] as any;
        if (firstChild?.data?.directiveLabel) {
          customTitle = escapeHtml(getTextContent(firstChild));
        }
        
        const title = customTitle || config.label;
        const contentChildren = customTitle ? directive.children.slice(1) : directive.children;
        const showTitle = !attrs.noTitle;
        
        // Determine if this should be collapsible
        const isCollapsible = type === 'details' || attrs.collapsible;
        
        // Build header HTML
        const headerHtml = showTitle 
          ? `<span class="callout-icon-wrapper">${config.icon}</span><span class="callout-title">${title}</span>`
          : `<span class="callout-icon-wrapper callout-icon-only">${config.icon}</span>`;
        
        if (isCollapsible) {
          const data = directive.data || (directive.data = {});
          data.hName = 'details';
          data.hProperties = {
            className: ['callout', `callout-${type}`, 'callout-collapsible'],
            role: config.role,
            'aria-label': config.ariaLabel,
            ...(attrs.open ? { open: true } : {}),
          };
          
          directive.children = [
            {
              type: 'html',
              value: `<summary class="callout-header">${headerHtml}</summary><div class="callout-content">`,
            } as any,
            ...contentChildren,
            {
              type: 'html',
              value: '</div>',
            } as any,
          ];
        } else {
          const data = directive.data || (directive.data = {});
          data.hName = 'div';
          data.hProperties = {
            className: ['callout', `callout-${type}`, ...(showTitle ? [] : ['callout-no-title'])],
            role: config.role,
            'aria-label': config.ariaLabel,
          };

          directive.children = [
            {
              type: 'html',
              value: showTitle 
                ? `<div class="callout-header">${headerHtml}</div><div class="callout-content">`
                : `<div class="callout-header callout-header-minimal">${headerHtml}</div><div class="callout-content">`,
            } as any,
            ...contentChildren,
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

export default remarkCallouts;
