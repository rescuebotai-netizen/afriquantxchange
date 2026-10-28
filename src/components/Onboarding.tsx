import React from 'react';
import { LandingPage } from './LandingPage';

interface OnboardingProps {
  onComplete: (tab?: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <LandingPage
      onNavigateToAuth={() => onComplete('auth')}
      onNavigateToDashboard={() => onComplete('auth')}
      onNavigateToAQEI={() => onComplete('aqei')}
    />
  );
}
