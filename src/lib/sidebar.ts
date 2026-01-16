/**
 * Sidebar Generator Utility
 * Supports nested folder structure with collapsible sections
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
 */
export function getTitle(entry: ContentEntry): string {
  if (entry.data.title) return entry.data.title;
  
  const filename = entry.id.split('/').pop() || entry.id;
  return formatName(filename.replace(/\.md$/, ''));
}

/**
 * Format folder/file name for display
 */
function formatName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface TreeNode {
  type: 'file' | 'folder';
  name: string;
  entry?: ContentEntry;
  href?: string;
  children: Map<string, TreeNode>;
}

/**
 * Build hierarchical sidebar from content entries
 */
export function buildSidebar(entries: ContentEntry[], basePath: string = '/blogv2/'): SidebarSection[] {
  // Group entries by top-level category
  const categories = new Map<string, ContentEntry[]>();
  
  for (const entry of entries) {
    const parts = entry.id.split('/');
    const category = parts[0];
    
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(entry);
  }

  // Build sections
  const sections: SidebarSection[] = [];
  
  for (const [category, categoryEntries] of categories) {
    const items = buildNestedItems(categoryEntries, category, basePath);
    
    sections.push({
      title: formatName(category),
      items: sortItems(items),
    });
  }

  return sections.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}

/**
 * Build nested sidebar items for a category
 */
function buildNestedItems(
  entries: ContentEntry[], 
  category: string, 
  basePath: string
): SidebarItem[] {
  // Build a tree structure
  const root: Map<string, TreeNode> = new Map();
  
  for (const entry of entries) {
    const parts = entry.id.split('/');
    
    // Handle single-level entries (e.g., "readme" without category)
    if (parts.length === 1) {
      const slug = entry.id;
      root.set(entry.id, {
        type: 'file',
        name: entry.id,
        entry,
        href: `${basePath}${slug}/`,
        children: new Map(),
      });
      continue;
    }
    
    // Skip the category part (first element)
    const relativeParts = parts.slice(1);
    
    if (relativeParts.length === 0) continue;
    
    let current = root;
    
    for (let i = 0; i < relativeParts.length; i++) {
      const part = relativeParts[i];
      const isLast = i === relativeParts.length - 1;
      
      if (isLast) {
        // This is a file
        const slug = entry.id.endsWith('/index') 
          ? entry.id.slice(0, -6) 
          : entry.id;
        
        current.set(part, {
          type: 'file',
          name: part,
          entry,
          href: `${basePath}${slug}/`,
          children: new Map(),
        });
      } else {
        // This is a folder
        if (!current.has(part)) {
          current.set(part, {
            type: 'folder',
            name: part,
            children: new Map(),
          });
        }
        const node = current.get(part)!;
        current = node.children;
      }
    }
  }
  
  // Convert tree to SidebarItem array
  return treeToItems(root, category, basePath);
}

/**
 * Convert tree structure to SidebarItem array
 */
function treeToItems(
  tree: Map<string, TreeNode>, 
  parentPath: string, 
  basePath: string
): SidebarItem[] {
  const items: SidebarItem[] = [];
  
  for (const [key, node] of tree) {
    if (node.type === 'file') {
      // Skip index files - they're handled by folder items
      if (key === 'index') continue;
      
      items.push({
        title: node.entry ? getTitle(node.entry) : formatName(key),
        href: node.href || `${basePath}${parentPath}/${key}/`,
        order: node.entry?.data.order,
      });
    } else if (node.type === 'folder') {
      const folderPath = `${parentPath}/${node.name}`;
      const children = treeToItems(node.children, folderPath, basePath);
      
      // Check if folder has an index file
      const indexNode = node.children.get('index');
      const href = indexNode?.href || `${basePath}${folderPath}/`;
      
      items.push({
        title: formatName(node.name),
        href,
        children: children.length > 0 ? sortItems(children) : undefined,
        order: indexNode?.entry?.data?.order,
      });
    }
  }
  
  return items;
}

/**
 * Sort items by order field, then alphabetically
 */
function sortItems(items: SidebarItem[]): SidebarItem[] {
  return items.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.title.localeCompare(b.title, 'zh-CN');
  });
}

/**
 * Check if a path is active (current page or parent)
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
