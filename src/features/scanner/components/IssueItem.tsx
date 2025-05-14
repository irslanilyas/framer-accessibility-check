import React from 'react';
import { useScannerStore } from '../../../store';
import { Issue } from '../../../types/issueTypes';
import { Button } from '../../../components/ui/Button';

interface IssueItemProps {
  issue: Issue;
}

export const IssueItem: React.FC<IssueItemProps> = ({ issue }) => {
  const { expandedIssues, toggleIssueDetails, locateIssue } = useScannerStore();
  const isExpanded = expandedIssues[issue.id] || false;
  
  // Render severity indicator
  const renderSeverityIndicator = () => {
    const color = {
      critical: 'text-error',
      warning: 'text-warning',
      info: 'text-info',
    }[issue.severity];
    
    return <span className={`${color} mr-2`}>•</span>;
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex items-start">
          {renderSeverityIndicator()}
          <div className="flex-1">
            <div className="font-medium">Element : {issue.location.nodeName}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {issue.description}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button  
            variant="primary"
            onClick={() => locateIssue(issue.id)}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21C12 21 19 16.197 19 10C19 5.582 15.863 2 12 2C8.137 2 5 5.582 5 10C5 16.197 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            Locate
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => toggleIssueDetails(issue.id)}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {issue.wcagGuideline && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">WCAG Guideline : {issue.wcagGuideline}</div>
                {issue.wcagLink && (
                  <a 
                    href={issue.wcagLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            )}
            
            {(issue.currentValue || issue.requiredValue) && (
              <div className="mb-4">
                {issue.currentValue && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Current Value:</span> {issue.currentValue}
                  </div>
                )}
                {issue.requiredValue && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Required Value:</span> {issue.requiredValue}
                  </div>
                )}
              </div>
            )}
            
            {issue.fixSuggestions.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Suggested Fixes</div>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {issue.fixSuggestions.map((fix, index) => (
                    <li key={index}>{fix.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};