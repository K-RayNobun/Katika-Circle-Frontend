import React, { useEffect }  from 'react';
import { TutorialProvider, useTutorial } from '../hooks/TutorialContext';
import TransactionTutorialBox from '../components/TransactionTutorialBox';

// import * as tutorialFunctions from '@/components/transaction_screens/utils/formTutorialFunctions';

interface TutoFormerProps {
  steps: Array<{ fieldId: string; instruction: string; testFnName: string }>;
  children: React.ReactNode;
}

const HighlightOverlay: React.FC = () => {
  const { isActive, getCurrentFieldRect } = useTutorial();
  if (!isActive) return null;
  const rect = getCurrentFieldRect();
  if (!rect) return null;
  // Simple overlay (improve with animation/styling as needed)
  return (
    <div
      style={{
        position: 'fixed',
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        border: '2px solid #7c3aed',
        borderRadius: 8,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};

export const TutoFormer: React.FC<TutoFormerProps> = ({ steps, children }) => {
    const {
        isActive,
        steps: tutorialSteps,
        currentStep,
        nextStep,
        prevStep,
        stopTutorial,
        runValidation,
    } = useTutorial();

  const step = tutorialSteps?.[currentStep];

  // Validation before advancing
  const handleNext = () => {
    if (!step) return;
    if(!runValidation()) return;
    // You may want to import or access your validation functions differently
    // For now, assume they are globally available for demo purposes
    nextStep();
  };

  useEffect(() => {
    if (!isActive || !step?.fieldId) return;
    const el = document.getElementById(step.fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if ('focus' in el) (el as HTMLElement).focus();
    }
  }, [isActive, step?.fieldId, currentStep]);

  return (
    <TutorialProvider steps={steps}>
        <HighlightOverlay />
        {children}
        {isActive && step && (
            <div
                style={{
                    position: 'fixed',
                    bottom: 40,
                    left: 0,
                    width: '100%',
                    zIndex: 1100,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                }}
            >
            <TransactionTutorialBox
                instruction={step.instruction}
                onNext={handleNext}
                onPrev={prevStep}
                onExit={stopTutorial}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === tutorialSteps.length - 1}
            />
            </div>
        )}
    </TutorialProvider>
  )
};