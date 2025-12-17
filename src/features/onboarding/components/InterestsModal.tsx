'use client';

import React, { useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import { AuthButton } from '@/components/ui/AuthButton';
import { useUpdateInterests, useGetInterests } from '../hooks/useOnboarding';

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function InterestsModal({
  isOpen,
  onClose,
  onComplete,
}: InterestsModalProps) {
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
  const updateInterests = useUpdateInterests();
  // Only fetch interests when the modal is open
  const { data: interestsData, isLoading, error } = useGetInterests(isOpen);

  const toggleInterest = (interestId: number) => {
    setSelectedInterestIds((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterestIds.length === 0) return;

    try {
      await updateInterests.mutateAsync({
        interestIds: selectedInterestIds,
      });
      onComplete();
    } catch (error) {
      console.error('Failed to update interests:', error);
    }
  };

  const isValid = selectedInterestIds.length > 0;

  return (
    <XModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={false}
      closeOnEscape={false}
      showLogo
      customLayout
      title=""
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-8 pt-5 pb-4">
          <h2 className="text-[31px] font-bold text-foreground mb-2 leading-9">
            What do you want to see on Hankers?
          </h2>
          <p className="text-text-inactive text-[15px] leading-5">
            Choose what you like, and we&apos;ll customise your Hankers
            experience with more of what you&apos;re interested in.
          </p>
        </div>

        {/* Interests Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-text-inactive">Loading interests...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-error">Failed to load interests</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interestsData?.data.map((interest) => {
                const isSelected = selectedInterestIds.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                    relative h-[112px] rounded-lg border transition-all duration-200
                    text-[15px] font-bold text-left p-4
                    flex items-end
                    overflow-hidden
                    ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'bg-transparent border-border hover:bg-muted text-foreground'
                    }
                  `}
                  >
                    <div className="relative z-10 w-full">
                      <div className="line-clamp-2 break-words">
                        {interest.name}
                      </div>
                      <div className="text-xs text-text-inactive font-normal mt-1 line-clamp-1 break-words">
                        {interest.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with counter and button */}
        <div className="px-8 py-4 border-t border-border">
          <div className="mb-4">
            <p className="text-text-inactive text-[13px]">
              {selectedInterestIds.length} of {interestsData?.total || 0}{' '}
              selected
            </p>
          </div>

          <AuthButton
            type="button"
            variant="primary"
            size="lg"
            loading={updateInterests.isPending}
            disabled={!isValid || updateInterests.isPending}
            className="w-full"
            onClick={handleSubmit}
          >
            Next
          </AuthButton>

          {updateInterests.isError && (
            <p className="text-error text-sm mt-4 text-center">
              {updateInterests.error?.message || 'Failed to update interests'}
            </p>
          )}
        </div>
      </div>
    </XModal>
  );
}
