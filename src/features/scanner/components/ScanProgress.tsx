import React from 'react';
import { useScannerStore } from '../../../store';

export const ScanProgress: React.FC = () => {
  const { progress } = useScannerStore();
  
  // Convert progress to percentage
  const progressPercent = Math.round(progress * 100);
  
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary-500 transition-all duration-300 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};