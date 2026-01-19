/**
 * Shared callout configuration for both directive and Obsidian syntax plugins
 */

export interface CalloutConfig {
  label: string;
  icon: string;
  role: 'note' | 'alert' | 'status';
  ariaLabel: string;
}

// Callout type configuration with accessibility attributes
export const calloutTypes: Record<string, CalloutConfig> = {
  tip: {
    label: '提示',
    ariaLabel: '提示信息',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  },
  note: {
    label: '注意',
    ariaLabel: '注意事项',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  },
  info: {
    label: '信息',
    ariaLabel: '相关信息',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  },
  important: {
    label: '重要',
    ariaLabel: '重要信息',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  },
  success: {
    label: '成功',
    ariaLabel: '操作成功',
    role: 'status',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  },
  caution: {
    label: '注意',
    ariaLabel: '请注意',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  warning: {
    label: '警告',
    ariaLabel: '警告信息',
    role: 'alert',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  danger: {
    label: '危险',
    ariaLabel: '危险警告',
    role: 'alert',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  },
  quote: {
    label: '引用',
    ariaLabel: '引用内容',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>`,
  },
  details: {
    label: '详情',
    ariaLabel: '展开查看详情',
    role: 'note',
    icon: `<svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  },
};

// Map Obsidian callout types to our standard types
export const obsidianTypeMapping: Record<string, string> = {
  tip: 'tip',
  hint: 'tip',
  note: 'note',
  info: 'info',
  warning: 'warning',
  warn: 'warning',
  danger: 'danger',
  error: 'danger',
  caution: 'caution',
  attention: 'caution',
  important: 'important',
  success: 'success',
  check: 'success',
  done: 'success',
  quote: 'quote',
  cite: 'quote',
  abstract: 'note',
  summary: 'note',
  tldr: 'note',
  bug: 'danger',
  example: 'info',
  question: 'info',
  help: 'info',
  faq: 'info',
  failure: 'danger',
  fail: 'danger',
  missing: 'danger',
};

// Get callout config with fallback
export function getCalloutConfig(type: string): CalloutConfig {
  return calloutTypes[type] || calloutTypes.note;
}

// HTML escape for XSS prevention
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
