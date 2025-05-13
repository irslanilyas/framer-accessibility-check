import { License } from '../../../types/licenseTypes';

// In a real implementation, this would call the Lemon Squeezy API
export async function validateLicense(licenseKey: string): Promise<License> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // For development, accept any key that starts with "VALID"
      const isValid = licenseKey.startsWith('VALID') || import.meta.env.DEV && licenseKey === 'DEV_LICENSE';
      
      if (isValid) {
        resolve({
          key: licenseKey,
          valid: true,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          plan: 'premium'
        });
      } else {
        resolve({
          key: licenseKey,
          valid: false,
          expiryDate: null,
          plan: 'free'
        });
      }
    }, 1000); // Simulate network delay
  });
}