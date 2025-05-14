import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useScannerStore } from '../../../store';
import { generateReport } from '../../reports/utils/reportGenerator';


export const GenerateReportButton: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { issues } = useScannerStore();
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      await generateReport(issues);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button className='bg-black hover:bg-gray-700 dark:bg-white dark:text-black'
      onClick={handleGenerateReport}
      isLoading={isGenerating}
      leftIcon={
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_122_72" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="14">
<path d="M1.53125 1.79467C1.53125 1.56273 1.62338 1.3403 1.78739 1.1763C1.95139 1.0123 2.17382 0.920166 2.40575 0.920166H9.40175C9.63368 0.920166 9.85611 1.0123 10.0201 1.1763C10.1841 1.3403 10.2762 1.56273 10.2762 1.79467V12.5802H2.40575C2.17382 12.5802 1.95139 12.488 1.78739 12.324C1.62338 12.16 1.53125 11.9376 1.53125 11.7057V1.79467Z" fill="white" stroke="white" stroke-width="1.466" stroke-linejoin="round"/>
<path d="M10.2764 6.75024C10.2764 6.59562 10.3378 6.44733 10.4471 6.33799C10.5565 6.22866 10.7047 6.16724 10.8594 6.16724H12.0254C12.18 6.16724 12.3283 6.22866 12.4376 6.33799C12.5469 6.44733 12.6084 6.59562 12.6084 6.75024V11.7057C12.6084 11.9377 12.5162 12.1601 12.3522 12.3241C12.1882 12.4881 11.9658 12.5802 11.7339 12.5802H10.2764V6.75024Z" stroke="white" stroke-width="1.466" stroke-linejoin="round"/>
<path d="M3.28027 3.2522H5.61227M3.28027 5.2927H6.77827" stroke="black" stroke-width="1.466" stroke-linecap="round" stroke-linejoin="round"/>
</mask>
<g mask="url(#mask0_122_72)">
<path d="M0.0737305 -0.24585H14.0657V13.7461H0.0737305V-0.24585Z" fill="currentColor"/>
</g>
</svg>

      }
    >
      Generate Report
    </Button>
  );
};