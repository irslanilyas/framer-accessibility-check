import React from 'react';
import { useScannerStore } from '../../../store';
import { IssueTypeSection } from './IssueTypeSection';
import { groupBy } from '../../../lib/utils/array';
import { IssueType } from '../../../types/issueTypes';

export const IssuesList: React.FC = () => {
  const { filteredIssues } = useScannerStore();
  
  // Group issues by type
  const issuesByType = groupBy(filteredIssues, 'type');
  
  // Define issue type information for rendering with proper typing
  const issueTypes: Array<{ type: IssueType; label: string; icon: string }> = [
    { type: 'contrast', label: 'Contrast', icon: 'contrast-icon' },
    { type: 'touchTarget', label: 'Touch Target', icon: 'touch-target-icon' },
    { type: 'colorBlindness', label: 'Color Blindness', icon: 'color-blindness-icon' },
    { type: 'textSize', label: 'Text Size', icon: 'text-size-icon' },
    { type: 'altText', label: 'Alt text', icon: 'alt-text-icon' },
    { type: 'navigation', label: 'Navigation', icon: 'navigation-icon' },
  ];
  
  if (filteredIssues.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No issues found matching the current filter.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {issueTypes.map(({ type, label }) => {
        const typeIssues = issuesByType[type] || [];
        if (typeIssues.length === 0) return null;
        
        return (
          <IssueTypeSection 
            key={type} 
            type={type} 
            label={label} 
            issues={typeIssues} 
          />
        );
      })}
    </div>
  );
};