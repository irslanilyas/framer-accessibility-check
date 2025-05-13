import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { License, PricingPlan } from '../../../types/licenseTypes';
import { validateLicense } from '../api/licenseApi';

// Set up the pricing plans
const pricingPlans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 10,
    billingPeriod: 'monthly',
    features: [
      'Unlimited Scans',
      'Unlimited Report Generation',
      'Unlimited Projects'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 7.9,
    billingPeriod: 'yearly',
    discount: 21,
    features: [
      'Unlimited Scans',
      'Unlimited Report Generation',
      'Unlimited Projects'
    ]
  }
];

interface LicenseState {
  license: License;
  freeScansRemaining: number;
  pricingPlans: PricingPlan[];
  showLicenseModal: boolean;
  showPricingModal: boolean;
  licenseKeyInput: string;
  isActivating: boolean;
  activationError: string | null;
  
  // Actions
  activateLicense: (key: string) => Promise<boolean>;
  decrementFreeScans: () => void;
  setLicenseKeyInput: (key: string) => void;
  toggleLicenseModal: () => void;
  togglePricingModal: () => void;
  redirectToPurchase: (planId: string) => void;
  reset: () => void;
  
  // Development-only actions
  devReset: () => void;
}

const FREE_SCANS_LIMIT = 3;

const initialState = {
  license: {
    key: '',
    valid: false,
    expiryDate: null,
    plan: 'free' as const
  },
  freeScansRemaining: FREE_SCANS_LIMIT,
  pricingPlans,
  showLicenseModal: false,
  showPricingModal: false,
  licenseKeyInput: '',
  isActivating: false,
  activationError: null,
};

export const useLicenseStore = create<LicenseState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      activateLicense: async (key) => {
        set({ isActivating: true, activationError: null });
        
        try {
          const validationResult = await validateLicense(key);
          
          if (validationResult.valid) {
            set({ 
              license: validationResult,
              showLicenseModal: false,
            });
            return true;
          } else {
            set({ activationError: 'Invalid license key' });
            return false;
          }
        } catch (error) {
          set({ activationError: 'Failed to validate license' });
          return false;
        } finally {
          set({ isActivating: false });
        }
      },
      
      decrementFreeScans: () => {
        const { license, freeScansRemaining } = get();
        
        // Only decrement if using free plan and have scans remaining
        if (license.plan === 'free' && freeScansRemaining > 0) {
          set({ freeScansRemaining: freeScansRemaining - 1 });
        }
      },
      
      setLicenseKeyInput: (key) => {
        set({ licenseKeyInput: key });
      },
      
      toggleLicenseModal: () => {
        set(state => ({ 
          showLicenseModal: !state.showLicenseModal,
          licenseKeyInput: '',
          activationError: null
        }));
      },
      
      togglePricingModal: () => {
        set(state => ({ showPricingModal: !state.showPricingModal }));
      },
      
      redirectToPurchase: (planId) => {
        // In a real implementation, this would redirect to Lemon Squeezy
        const baseUrl = 'https://your-lemon-squeezy-store.lemonsqueezy.com/checkout';
        const url = `${baseUrl}/buy/${planId}?checkout[email]=`;
        
        // Open in a new window
        window.open(url, '_blank');
      },
      
      reset: () => {
        // Reset while preserving the license information
        const { license } = get();
        set({
          ...initialState,
          license,
        });
      },
      
      devReset: () => {
        // Development-only: Reset everything including license
        set(initialState);
      },
    }),
    {
      name: 'accessibility-license-state',
      partialize: (state) => ({
        // Only persist license info and free scans
        license: state.license,
        freeScansRemaining: state.freeScansRemaining,
      }),
    }
  )
);