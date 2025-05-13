// src/features/scanner/components/ScanButton.tsx
import React from 'react';
import { Button } from '../../../components/ui/Button';
import { useLicenseStore, useScannerStore } from '../../../store';

type ScanButtonProps = {
  label?: string;
};

export const ScanButton: React.FC<ScanButtonProps> = ({ label }) => {
  const { isScanning, startScan } = useScannerStore();
  const { license, freeScansRemaining, togglePricingModal, decrementFreeScans } = useLicenseStore();

  // Debug logging
  console.log('ScanButton render:', {
    isScanning,
    freeScansRemaining,
    plan: license.plan,
    startScanType: typeof startScan,
  });

  const handleScan = async () => {
    console.log('=== SCAN BUTTON CLICKED ===');
    console.log('Before scan:', {
      freeScansRemaining,
      plan: license.plan,
      isScanning,
    });

    if (license.plan === 'premium' || freeScansRemaining > 0) {
      console.log('License check passed - starting scan');

      if (license.plan === 'free') {
        console.log('Decrementing free scans from', freeScansRemaining);
        decrementFreeScans();
      }

      console.log('Calling startScan()...');
      try {
        await startScan();
        console.log('startScan() completed successfully');
      } catch (error) {
        console.error('startScan() failed:', error);
      }
    } else {
      console.log('No scans remaining - showing pricing modal');
      togglePricingModal();
    }
  };

  return (
    <Button
      onClick={handleScan}
      isLoading={isScanning}
      leftIcon={
        <svg
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.95737 3.61421C5.64014 3.61421 5.33002 3.52013 5.06625 3.34389C4.80248 3.16764 4.59689 2.91713 4.47549 2.62404C4.35409 2.33096 4.32232 2.00845 4.38421 1.69731C4.4461 1.38617 4.59887 1.10037 4.82319 0.876045C5.04751 0.651725 5.33331 0.498961 5.64445 0.437071C5.95559 0.375181 6.2781 0.406945 6.57119 0.528346C6.86428 0.649748 7.11478 0.855333 7.29103 1.11911C7.46728 1.38288 7.56135 1.69299 7.56135 2.01023C7.5609 2.43549 7.39176 2.8432 7.09105 3.14391C6.79035 3.44462 6.38263 3.61375 5.95737 3.61421Z"
            fill="white"
          />
          <path
            d="M10.9984 3.63713L10.9855 3.64057L10.9735 3.64429C10.9449 3.65231 10.9162 3.6609 10.8876 3.66978C10.3545 3.82617 7.76755 4.55541 5.94503 4.55541C4.2514 4.55541 1.89842 3.92527 1.1457 3.71132C1.07078 3.68236 0.994277 3.65769 0.916559 3.63742C0.372352 3.49421 0 4.047 0 4.55226C0 5.05264 0.449687 5.29095 0.90367 5.46194V5.46996L3.63101 6.32179C3.9097 6.42863 3.98417 6.53775 4.02054 6.63227C4.13884 6.9356 4.04432 7.53623 4.0108 7.74589L3.84468 9.0348L2.92268 14.0813C2.91981 14.0951 2.91723 14.1091 2.91494 14.1234L2.90836 14.1598C2.84191 14.6224 3.18161 15.0712 3.82491 15.0712C4.38631 15.0712 4.63406 14.6837 4.74147 14.1564C4.84888 13.6291 5.54346 9.64317 5.94446 9.64317C6.34545 9.64317 7.1715 14.1564 7.1715 14.1564C7.27891 14.6837 7.52667 15.0712 8.08806 15.0712C8.73309 15.0712 9.07279 14.6204 9.00462 14.1564C8.99877 14.1173 8.99151 14.0786 8.98285 14.0401L8.04825 9.03538L7.88241 7.74646C7.76239 6.99575 7.85892 6.7477 7.89157 6.68956C7.89246 6.68819 7.89322 6.68676 7.89386 6.68526C7.9248 6.62798 8.06572 6.49966 8.39453 6.37621L10.9517 5.48228C10.9674 5.47809 10.9829 5.47312 10.9981 5.46738C11.4564 5.29553 11.9147 5.0578 11.9147 4.55283C11.9147 4.04786 11.5426 3.49421 10.9984 3.63713Z"
            fill="white"
          />
        </svg>
      }
    >
      {isScanning ? 'Scanning...' : label || 'Scan for accessibility issues'}
    </Button>
  );
};
