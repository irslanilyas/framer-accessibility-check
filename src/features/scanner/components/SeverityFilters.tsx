import React from 'react';
import { clsx } from 'clsx';
import { useScannerStore } from '../../../store';
import { IssueSeverity } from '../../../types/issueTypes';

export const SeverityFilters: React.FC = () => {
  const { severityFilter, setSeverityFilter, issues } = useScannerStore();
  
  // Count issues by severity
  const criticalCount = issues.filter(issue => issue.severity === 'critical').length;
  const warningCount = issues.filter(issue => issue.severity === 'warning').length;
  const infoCount = issues.filter(issue => issue.severity === 'info').length;
  
  const filters: { id: IssueSeverity | 'all', label: string, count: number, iconColor: string, bgColor: string }[] = [
    { id: 'all', label: 'All', count: issues.length, iconColor: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' },
    { id: 'critical', label: 'Critical', count: criticalCount, iconColor: 'text-error', bgColor: 'bg-error-light' },
    { id: 'warning', label: 'Warnings', count: warningCount, iconColor: 'text-warning', bgColor: 'bg-warning-light' },
    { id: 'info', label: 'Info', count: infoCount, iconColor: 'text-info', bgColor: 'bg-info-light' },
  ];
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Summary grid */}
      <div className="grid grid-cols-3 gap-2">
        {filters.slice(1).map((filter) => (
          <div 
            key={filter.id}
            className={clsx(
              "rounded-lg p-4 flex flex-col items-center",
              filter.bgColor
            )}
          >
            <span className={clsx("text-3xl font-bold", filter.iconColor)}>
              {filter.count}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {filter.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Tab filters */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={clsx(
              "px-3 py-2 text-sm font-medium",
              severityFilter === filter.id
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
            onClick={() => setSeverityFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};