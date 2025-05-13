import React from 'react';
import { Dialog, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react';
import { useLicenseStore } from '../../../store';
import { Button } from '../../../components/ui/Button';

export const PremiumPrompt: React.FC = () => {
  const { 
    showPricingModal, 
    togglePricingModal, 
    toggleLicenseModal, 
    pricingPlans, 
    redirectToPurchase 
  } = useLicenseStore();
  
  const handleLicenseClick = () => {
    togglePricingModal();
    toggleLicenseModal();
  };
  
  return (
    <Transition show={showPricingModal} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={togglePricingModal}
      >
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <div className="mb-6">
                <div className="text-center p-3 mb-4 bg-error-light text-error rounded-lg">
                  You've run out of your free scans! Choose A Plan to Continue Using Accessibility Checker
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-primary-500 flex items-center justify-center rounded-lg text-white mr-2">
                    A
                  </div>
                  <div className="font-medium">AccessibilityChecker</div>
                  <div className="ml-auto px-2 py-1 bg-primary-500 text-white text-xs rounded">Premium</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {pricingPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{plan.name}</div>
                      {plan.discount && (
                        <div className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
                          {plan.discount}% off
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/mo</span>
                      {plan.billingPeriod === 'yearly' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                          *Billed Yearly
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => redirectToPurchase(plan.id)}
                    >
                      Buy Now
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  onClick={handleLicenseClick}
                >
                  I Already have a license key
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};