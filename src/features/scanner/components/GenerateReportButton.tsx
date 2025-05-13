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
    <Button
      variant="secondary"
      onClick={handleGenerateReport}
      isLoading={isGenerating}
      leftIcon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 7H7V9H13V7Z" fill="currentColor"/>
          <path d="M13 11H7V13H13V11Z" fill="currentColor"/>
          <path d="M13 15H7V17H13V15Z" fill="currentColor"/>
          <path d="M17 7H15V9H17V7Z" fill="currentColor"/>
          <path d="M17 11H15V13H17V11Z" fill="currentColor"/>
          <path d="M17 15H15V17H17V15Z" fill="currentColor"/>
        </svg>
      }
    >
      Generate Report
    </Button>
  );
};