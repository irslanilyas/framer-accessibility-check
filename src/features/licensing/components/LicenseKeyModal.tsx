import React from 'react';
import { Dialog, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react';
import { useLicenseStore } from '../../../store';
import { Button } from '../../../components/ui/Button';

export const LicenseKeyModal: React.FC = () => {
  const { 
    showLicenseModal, 
    toggleLicenseModal, 
    licenseKeyInput, 
    setLicenseKeyInput, 
    activateLicense,
    isActivating,
    activationError
  } = useLicenseStore();
  
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (licenseKeyInput.trim()) {
      const success = await activateLicense(licenseKeyInput.trim());
      if (success) {
        toggleLicenseModal();
      }
    }
  };
  
  return (
    <Transition show={showLicenseModal} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={toggleLicenseModal}
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
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-primary-500 flex items-center justify-center rounded-lg text-white mr-2">
                  A
                </div>
                <div className="font-medium">AccessibilityChecker</div>
                <div className="ml-auto px-2 py-1 bg-primary-500 text-white text-xs rounded">Premium</div>
              </div>
              
              <form onSubmit={handleActivate}>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter License Key"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    required
                  />
                  {activationError && (
                    <p className="mt-1 text-sm text-error">{activationError}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isActivating}
                  disabled={!licenseKeyInput.trim()}
                >
                  Activate
                </Button>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};