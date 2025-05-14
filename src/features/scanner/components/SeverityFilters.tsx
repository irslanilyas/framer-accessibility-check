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
  
  // Stats display (non-clickable)
  const statsCards = [
    { 
      id: 'critical', 
      label: 'Critical', 
      count: criticalCount, 
      icon: (
        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.259033" y="0.73877" width="20.5086" height="20.57" rx="10.2543" fill="#FEE2E2"/>
<path d="M10.5134 13.6461C10.662 13.6461 10.7867 13.5958 10.8874 13.4951C10.9881 13.3943 11.0383 13.2699 11.0379 13.1216C11.0376 12.9734 10.9872 12.8489 10.8869 12.7482C10.7865 12.6475 10.662 12.5971 10.5134 12.5971C10.3648 12.5971 10.2403 12.6475 10.14 12.7482C10.0396 12.8489 9.98928 12.9734 9.98893 13.1216C9.98858 13.2699 10.0389 13.3945 10.14 13.4956C10.241 13.5966 10.3655 13.6468 10.5134 13.6461ZM9.98893 11.5482H11.0379V8.40124H9.98893V11.5482ZM10.5134 16.2685C9.78788 16.2685 9.10605 16.1308 8.46792 15.8552C7.8298 15.5797 7.27472 15.2061 6.80268 14.7344C6.33064 14.2627 5.95703 13.7076 5.68185 13.0692C5.40667 12.4307 5.26891 11.7489 5.26856 11.0237C5.26821 10.2985 5.40597 9.61665 5.68185 8.97818C5.95773 8.3397 6.33134 7.78462 6.80268 7.31293C7.27402 6.84124 7.8291 6.46763 8.46792 6.1921C9.10675 5.91657 9.78858 5.77881 10.5134 5.77881C11.2383 5.77881 11.9201 5.91657 12.5589 6.1921C13.1977 6.46763 13.7528 6.84124 14.2242 7.31293C14.6955 7.78462 15.0693 8.3397 15.3455 8.97818C15.6217 9.61665 15.7593 10.2985 15.7583 11.0237C15.7572 11.7489 15.6195 12.4307 15.345 13.0692C15.0705 13.7076 14.6969 14.2627 14.2242 14.7344C13.7514 15.2061 13.1963 15.5799 12.5589 15.8558C11.9215 16.1316 11.2397 16.2692 10.5134 16.2685Z" fill="#DC2626"/>
</svg>

      )
    },
    { 
      id: 'warning', 
      label: 'Warnings', 
      count: warningCount,
      icon: (
        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.259033" y="0.73877" width="20.5086" height="20.57" rx="10.2543" fill="#FFEDD5"/>
<path d="M9.59244 7.23941C9.99289 6.51525 11.0338 6.51525 11.4342 7.23941L15.0578 13.7892C15.4461 14.4909 14.9385 15.3516 14.1367 15.3516H6.89039C6.0881 15.3516 5.58053 14.4909 5.96881 13.7892L9.59244 7.23941ZM10.9804 13.4804C10.9824 13.4178 10.9718 13.3555 10.9492 13.2971C10.9266 13.2387 10.8925 13.1854 10.849 13.1404C10.8054 13.0955 10.7532 13.0597 10.6956 13.0353C10.6379 13.0109 10.5759 12.9983 10.5133 12.9983C10.4507 12.9983 10.3887 13.0109 10.3311 13.0353C10.2734 13.0597 10.2212 13.0955 10.1777 13.1404C10.1341 13.1854 10.1 13.2387 10.0774 13.2971C10.0549 13.3555 10.0442 13.4178 10.0462 13.4804C10.0501 13.6017 10.101 13.7168 10.1881 13.8013C10.2753 13.8857 10.3919 13.933 10.5133 13.933C10.6347 13.933 10.7513 13.8857 10.8385 13.8013C10.9257 13.7168 10.9766 13.6017 10.9804 13.4804ZM10.8593 9.80674C10.8471 9.71863 10.802 9.63842 10.733 9.58232C10.664 9.52622 10.5763 9.49841 10.4875 9.50454C10.3988 9.51066 10.3157 9.55024 10.2551 9.61529C10.1944 9.68033 10.1607 9.76599 10.1608 9.85492L10.1627 11.9605L10.166 12.0082C10.1781 12.0963 10.2232 12.1766 10.2922 12.2327C10.3612 12.2888 10.449 12.3166 10.5377 12.3104C10.6264 12.3043 10.7095 12.2647 10.7702 12.1997C10.8308 12.1346 10.8645 12.049 10.8644 11.9601L10.8625 9.85398L10.8593 9.80674Z" fill="#EA580C"/>
</svg>

      )
    },
    { 
      id: 'info', 
      label: 'Info', 
      count: infoCount,
      icon: (
        <svg width="24" height="24" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.259033" y="0.73877" width="20.5086" height="20.57" rx="10.2543" fill="#FEF9C3"/>
<path d="M9.98905 13.6463H11.0381V10.4993H9.98905V13.6463ZM10.5136 9.45031C10.6622 9.45031 10.7868 9.39995 10.8875 9.29925C10.9882 9.19855 11.0384 9.07406 11.0381 8.92581C11.0377 8.77755 10.9873 8.65307 10.887 8.55236C10.7866 8.45166 10.6622 8.40131 10.5136 8.40131C10.3649 8.40131 10.2405 8.45166 10.1401 8.55236C10.0398 8.65307 9.9894 8.77755 9.98905 8.92581C9.9887 9.07406 10.0391 9.19872 10.1401 9.29977C10.2412 9.40083 10.3656 9.45101 10.5136 9.45031ZM10.5136 16.2688C9.78799 16.2688 9.10614 16.131 8.468 15.8555C7.82986 15.58 7.27477 15.2063 6.80272 14.7346C6.33067 14.2629 5.95705 13.7078 5.68186 13.0694C5.40667 12.4309 5.26891 11.749 5.26856 11.0238C5.26821 10.2986 5.40597 9.61675 5.68186 8.97826C5.95775 8.33977 6.33137 7.78467 6.80272 7.31297C7.27407 6.84127 7.82916 6.46765 8.468 6.19211C9.10684 5.91658 9.78869 5.77881 10.5136 5.77881C11.2384 5.77881 11.9203 5.91658 12.5591 6.19211C13.1979 6.46765 13.753 6.84127 14.2244 7.31297C14.6957 7.78467 15.0695 8.33977 15.3458 8.97826C15.622 9.61675 15.7596 10.2986 15.7585 11.0238C15.7575 11.749 15.6197 12.4309 15.3452 13.0694C15.0708 13.7078 14.6971 14.2629 14.2244 14.7346C13.7516 15.2063 13.1965 15.5801 12.5591 15.856C11.9217 16.1319 11.2398 16.2695 10.5136 16.2688Z" fill="#EAB308"/>
</svg>

      )
    },
  ];
  
  // Tab filters (clickable)
  const tabFilters: { id: IssueSeverity | 'all', label: string, count: number }[] = [
    { id: 'all', label: 'All', count: issues.length },
    { id: 'critical', label: 'Critical', count: criticalCount },
    { id: 'warning', label: 'Warnings', count: warningCount },
    { id: 'info', label: 'Info', count: infoCount },
  ];
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Stats Cards (non-clickable) */}
      <div className="grid grid-cols-3 gap-2">
        {statsCards.map((card) => (
          <div 
            key={card.id}
            className="rounded-lg p-4 flex flex-col bg-[#F8F8F8] dark:bg-[#2B2B2B]"
          >
            <div className="flex items-center gap-2 mb-2">
              {card.icon}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {card.label}
              </span>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {card.count}
            </span>
          </div>
        ))}
      </div>
      
      {/* Tab Filters (clickable) */}
      <div className="flex gap-2 p-2 bg-[#F8F8F8] dark:bg-[#2B2B2B] rounded-xl">
        {tabFilters.map((filter) => (
          <button
            key={filter.id}
            className={clsx(
              "flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out rounded-lg",
              severityFilter === filter.id
                ? "bg-white dark:bg-[#4A4A4A] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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