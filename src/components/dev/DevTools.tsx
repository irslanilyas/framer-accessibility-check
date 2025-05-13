// src/components/dev/DevTools.tsx
import React from 'react';
import { Button } from '../../components/ui'; // Now imports from index
import { useLicenseStore } from '../../store';

/**
 * Development-only tools component
 * This component will not be rendered in production
 */
export const DevTools: React.FC = () => {
  const { devReset } = useLicenseStore();
  
  // Only render in development mode
  if (import.meta.env.PROD) {
    return null;
  }
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium mb-4">Development Tools</h3>
      
      <div className="space-y-2">
        <Button
          variant="danger"
          onClick={devReset}
        >
          Dev Reset (Clear License & Free Scans)
        </Button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Note: Use "DEV_LICENSE" as a license key for testing in development mode.
        </div>
      </div>
    </div>
  );
};