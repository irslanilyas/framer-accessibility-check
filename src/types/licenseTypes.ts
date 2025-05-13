export interface License {
    key: string;
    valid: boolean;
    expiryDate: string | null;
    plan: 'free' | 'premium';
  }
  
  export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'yearly';
    discount?: number;
    features: string[];
  }