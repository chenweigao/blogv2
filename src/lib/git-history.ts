/**
 * Git History Utility
 * Fetches commit history for a specific file from git
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export interface GitCommit {
  hash: string;
  shortHash: string;
  date: Date;
  author: string;
  message: string;
}

/**
 * Get git commit history for a specific file
 */
export function getGitHistory(filePath: string, maxCommits: number = 50): GitCommit[] {
  try {
    const fullPath = join(process.cwd(), filePath);
    if (!existsSync(fullPath)) {
      return [];
    }

    // Single git command: get all commits with --follow to track renames
    const format = '%H|%h|%aI|%an|%s%x00';
    const result = execSync(
      `git log --follow --format="${format}" -n ${maxCommits} -- "${filePath}"`,
      { encoding: 'utf-8', cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 }
    );

    if (!result.trim()) return [];

    return result
      .split('\x00')
      .filter(r => r.trim())
      .map(record => {
        const clean = record.replace(/\n/g, '');
        const [hash, shortHash, dateStr, author, ...msg] = clean.split('|');
        return {
          hash: hash?.trim() || '',
          shortHash: shortHash?.trim() || '',
          date: new Date(dateStr?.trim() || ''),
          author: author?.trim() || '',
          message: msg.join('|').trim()
        };
      })
      .filter(c => c.hash);
  } catch (error) {
    console.error('Failed to get git history:', error);
    return [];
  }
}

/**
 * Format time: relative for recent (≤7 days), absolute date for older
 */
export function formatTime(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffMins <= 1 ? '刚刚' : `${diffMins} 分钟前`;
    }
    return `${diffHours} 小时前`;
  }
  if (diffDays <= 7) return `${diffDays} 天前`;
  
  // Show date for older commits: MM-DD for same year, YYYY-MM-DD for different year
  const isSameYear = date.getFullYear() === now.getFullYear();
  return isSameYear 
    ? `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : date.toISOString().slice(0, 10);
}
