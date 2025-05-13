import React from 'react';
import { useScannerStore } from '../../../store';
import { Issue, IssueType } from '../../../types/issueTypes';
import { IssueItem } from './IssueItem';
import { getIssueTypeIcon } from '../utils/issueIcons';

interface IssueTypeSectionProps {
  type: IssueType;
  label: string;
  issues: Issue[];
}

export const IssueTypeSection: React.FC<IssueTypeSectionProps> = ({
  type,
  label,
  issues,
}) => {
  const { expandedSections, toggleSection } = useScannerStore();
  const isExpanded = expandedSections[type];
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        className="w-full p-4 flex items-center justify-between bg-white dark:bg-gray-800 text-left"
        onClick={() => toggleSection(type)}
      >
        <div className="flex items-center">
          <span className="mr-2">{getIssueTypeIcon(type)}</span>
          <span className="font-medium">{label}</span>
          <span className="ml-2 text-error flex items-center">• {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</span>
        </div>
        
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {type === 'contrast' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
              In this section you can see sections that potentially have contrast issues,
              meaning there is difficulty reading the content due to mismatched contrast.
            </div>
          )}
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {issues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};