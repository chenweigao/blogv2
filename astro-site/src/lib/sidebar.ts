/**
 * Sidebar Generator Utility
 * Validates: Requirements 5.3
 * 
 * Generates hierarchical navigation structure from content collection
 */

export interface SidebarItem {
  title: string;
  href: string;
  children?: SidebarItem[];
  order?: number;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface ContentEntry {
  id: string;
  data: {
    title?: string;
    order?: number;
  };
}

/**
 * Extract title from content entry
 * Falls back to formatted slug if no title in frontmatter
 */
export function getTitle(entry: ContentEntry): string {
  if (entry.data.title) return entry.data.title;
  
  // Extract filename from path and format it
  const filename = entry.id.split('/').pop() || entry.id;
  return filename
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Build hierarchical sidebar from flat content entries
 */
export function buildSidebar(entries: ContentEntry[], basePath: string = '/blogv2/'): SidebarSection[] {
  // Group entries by top-level folder
  const groups = new Map<string, ContentEntry[]>();
  
  for (const entry of entries) {
    const parts = entry.id.split('/');
    const topLevel = parts[0] || 'root';
    
    if (!groups.has(topLevel)) {
      groups.set(topLevel, []);
    }
    groups.get(topLevel)!.push(entry);
  }

  // Convert groups to sidebar sections
  const sections: SidebarSection[] = [];
  
  for (const [folder, folderEntries] of groups) {
    const items = buildSidebarItems(folderEntries, basePath);
    
    sections.push({
      title: formatFolderName(folder),
      items: sortItems(items),
    });
  }

  return sections.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Build sidebar items from entries in a folder
 */
function buildSidebarItems(entries: ContentEntry[], basePath: string): SidebarItem[] {
  const itemMap = new Map<string, SidebarItem>();
  
  for (const entry of entries) {
    const parts = entry.id.split('/');
    const href = `${basePath}${entry.id.replace(/\.md$/, '')}/`;
    
    if (parts.length === 1) {
      // Root level item
      itemMap.set(entry.id, {
        title: getTitle(entry),
        href,
        order: entry.data.order,
      });
    } else {
      // Nested item - build hierarchy
      let currentMap = itemMap;
      
      for (let i = 1; i < parts.length; i++) {
        const isLast = i === parts.length - 1;
        const partPath = parts.slice(0, i + 1).join('/');
        
        if (isLast) {
          // This is the actual file
          const existing = currentMap.get(partPath);
          if (existing) {
            existing.title = getTitle(entry);
            existing.href = href;
            existing.order = entry.data.order;
          } else {
            currentMap.set(partPath, {
              title: getTitle(entry),
              href,
              order: entry.data.order,
            });
          }
        } else {
          // This is a folder
          if (!currentMap.has(partPath)) {
            currentMap.set(partPath, {
              title: formatFolderName(parts[i]),
              href: `${basePath}${partPath}/`,
              children: [],
            });
          }
        }
      }
    }
  }

  return Array.from(itemMap.values());
}

/**
 * Sort items by order field, then alphabetically
 */
function sortItems(items: SidebarItem[]): SidebarItem[] {
  return items.sort((a, b) => {
    // Items with order come first
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    
    // Then sort alphabetically
    return a.title.localeCompare(b.title);
  }).map(item => ({
    ...item,
    children: item.children ? sortItems(item.children) : undefined,
  }));
}

/**
 * Format folder name for display
 */
function formatFolderName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Check if a path is active (current page or parent of current page)
 */
export function isActive(itemHref: string, currentPath: string): boolean {
  const normalizedItem = itemHref.replace(/\/$/, '');
  const normalizedCurrent = currentPath.replace(/\/$/, '');
  return normalizedCurrent === normalizedItem || normalizedCurrent.startsWith(normalizedItem + '/');
}

/**
 * Check if a path is exactly the current page
 */
export function isExactActive(itemHref: string, currentPath: string): boolean {
  const normalizedItem = itemHref.replace(/\/$/, '');
  const normalizedCurrent = currentPath.replace(/\/$/, '');
  return normalizedCurrent === normalizedItem;
}
