// src/App.tsx

import React, { useEffect } from 'react';
import { useScannerStore, useLicenseStore } from './store';
import { ScanButton } from './features/scanner/components/ScanButton';
import { ScanProgress } from './features/scanner/components/ScanProgress';
import { ScanStats } from './features/scanner/components/ScanStats';
import { SeverityFilters } from './features/scanner/components/SeverityFilters';
import { IssuesList } from './features/scanner/components/IssuesList';
import { LoadingSpinner } from './features/scanner/components/LoadingSpinner';
import { GenerateReportButton } from './features/scanner/components/GenerateReportButton';
import { PremiumPrompt } from './features/licensing/components/PremiumPrompt';
import { LicenseKeyModal } from './features/licensing/components/LicenseKeyModal';
import { DevTools } from './components/dev/DevTools';
import { PromoBanner } from './components/ui/PromoBanner';

import './styles/tailwind.css';

const App: React.FC = () => {
  const { 
    isScanning, 
    progress, 
    issues, 
    stats,
    cancelScan,
    reset 
  } = useScannerStore();
  
  const { 
    license, 
    freeScansRemaining, 
    showPricingModal 
  } = useLicenseStore();

  // Detect if app is running in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isScanning) {
        cancelScan();
      }
    };
  }, [isScanning, cancelScan]);
  
  return (
    <div className="p-2">
      {/* Premium top banner */}
      <PromoBanner />
      
      {/* Header */}
      <div className="mb-6 bg-[#F8F8F8] p-4 rounded-lg">
        {isScanning ? (
          // Scanning state header
          <>
            <h1 className="text-[20px] font-bold mb-1">Welcome to Accessibility Checker</h1>
            <p className="text-[16px] font-normal dark:text-gray-300 mb-4">
              Analyse your framer project for accessibility issues
            </p>
            <div className="space-y-4">
              <ScanProgress />
              <ScanStats />
            </div>
          </>
        ) : issues.length > 0 ? (
          // Scan completed header
          <>
            <h1 className="text-[20px] font-bold mb-1">Scan Completed</h1>
            <p className="text-[16px] font-normal dark:text-gray-300 mb-4">
              Generate a report or click the scan button to scan again
            </p>
            <div className="flex space-x-2 items-center">
            <ScanButton label="Scan again" />
              <GenerateReportButton />
              {license.plan === 'free' && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {freeScansRemaining}/{3} Free Scans Left
                </div>
              )}
            </div>
          </>
        ) : (
          // Initial welcome state header
          <>
            <h1 className="text-[20px] font-bold mb-1">Welcome to Accessibility Checker</h1>
            <p className="text-[16px] font-normal dark:text-gray-300 mb-4">
              Analyse your framer project for accessibility issues
            </p>
            <div className="flex space-x-2 items-center">
              <ScanButton />
              {license.plan === 'free' && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {freeScansRemaining}/{3} Free Scans Left
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Main content */}
      <div>
        {isScanning ? (
          // Show scanning state
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
              Scanning your design for accessibility issues...
            </p>
            <div className="mt-2 text-sm text-gray-500 text-center">
              {stats.nodesScanned > 0 && `Processed ${stats.nodesScanned} nodes`}
            </div>
          </div>
        ) : issues.length > 0 ? (
          // Show scan results
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <SeverityFilters />
            </div>
            
            <IssuesList />
          </div>
        ) : (
          // Show empty state
          <div className="flex flex-col items-center justify-center text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg width="74" height="73" viewBox="0 0 74 73" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dii_93_1079)">
<rect x="10.6262" y="2.74561" width="52.7474" height="52.7474" rx="3.30995" fill="url(#paint0_linear_93_1079)"/>
<g filter="url(#filter1_d_93_1079)">
<path d="M26.9839 24.1111V21.607C26.9839 20.9429 27.2477 20.306 27.7173 19.8364C28.1869 19.3668 28.8238 19.103 29.4879 19.103H31.9919M26.9839 34.1271V36.6312C26.9839 37.2953 27.2477 37.9322 27.7173 38.4018C28.1869 38.8714 28.8238 39.1352 29.4879 39.1352H31.9919M42.008 19.103H44.512C45.1761 19.103 45.813 19.3668 46.2826 19.8364C46.7522 20.306 47.016 20.9429 47.016 21.607V24.1111M42.008 39.1352H44.512C45.1761 39.1352 45.813 38.8714 46.2826 38.4018C46.7522 37.9322 47.016 37.2953 47.016 36.6312V34.1271M30.7399 29.1191H43.26" stroke="white" stroke-width="2.50402" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
<defs>
<filter id="filter0_dii_93_1079" x="0.812759" y="0.292241" width="72.3742" height="72.3745" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="7.3601"/>
<feGaussianBlur stdDeviation="4.90673"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.516578 0 0 0 0 0.490089 0 0 0 0 0.490089 0 0 0 0.06 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_93_1079"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_93_1079" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.45337"/>
<feGaussianBlur stdDeviation="1.22668"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.506845 0 0 0 0 0.697834 0 0 0 0 0.986489 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_93_1079"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2.45337"/>
<feGaussianBlur stdDeviation="1.22668"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.506845 0 0 0 0 0.697834 0 0 0 0 0.986489 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect2_innerShadow_93_1079" result="effect3_innerShadow_93_1079"/>
</filter>
<filter id="filter1_d_93_1079" x="16.1768" y="11.7756" width="41.6461" height="41.6464" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3.47941"/>
<feGaussianBlur stdDeviation="2.8995"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0459471 0 0 0 0 0.381978 0 0 0 0 0.88072 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_93_1079"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_93_1079" result="shape"/>
</filter>
<linearGradient id="paint0_linear_93_1079" x1="10.6262" y1="2.74561" x2="63.3736" y2="55.493" gradientUnits="userSpaceOnUse">
<stop offset="0.303331" stop-color="#33A7FF"/>
<stop offset="1" stop-color="#0066FF"/>
</linearGradient>
</defs>
</svg>

            <p className="text-[#626262] dark:text-gray-300 mb-4 pl-16 pr-16 font-[400]">
              Click the 'Scan' button to start analysing your design
            </p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <PremiumPrompt />
      <LicenseKeyModal />
      
      {/* Development tools */}
      {isDevelopment && <DevTools />}
    </div>
  );
};

export default App;