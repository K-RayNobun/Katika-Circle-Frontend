import React, { createContext, useContext, useState, useRef } from 'react';

type ValidationFn = () => boolean;

interface TutorialStepConfig {
  fieldId: string;
  instruction: string;
  testFnName: string;
}

interface TutorialContextProps {
  steps: TutorialStepConfig[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isActive: boolean;
  startTutorial: () => void;
  stopTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  getCurrentFieldRect: () => DOMRect | null;
  registerValidation: (fn: ValidationFn) => void;
  runValidation: () => boolean;
}

const TutorialContext = createContext<TutorialContextProps | undefined>(undefined);

//  -------- Provides Context
export const useTutorial = () => {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error('useTutorial must be used within TutorialProvider');
  return ctx;
};

export const TutorialProvider: React.FC<{steps: TutorialStepConfig[], children: React.ReactNode}> = ({ steps, children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const validationRef = useRef<ValidationFn | null>(null);

  const startTutorial = () => { setIsActive(true); setCurrentStep(0); };
  const stopTutorial = () => setIsActive(false);
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const registerValidation = (fn: ValidationFn) => {
    validationRef.current = fn;
  };

  const runValidation = () => {
    if (validationRef.current) {
      return validationRef.current();
    }
    return true;
  };

  // Example: get rect of current field (to be improved in Step 3)
  const getCurrentFieldRect = () => {
    const fieldId = steps[currentStep]?.fieldId;
    if (!fieldId) return null;
    const el = document.getElementById(fieldId);
    return el?.getBoundingClientRect() || null;
  };

  return (
    <TutorialContext.Provider value={{
      steps, currentStep, setCurrentStep, isActive,
      startTutorial, 
      stopTutorial,
      nextStep,
      prevStep,
      getCurrentFieldRect,
      registerValidation,
      runValidation,
    }}>
      {children}
    </TutorialContext.Provider>
  );
};