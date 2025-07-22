import { useState } from 'react';

type TutorialJson = {
    order: number;
    title: string;
    instruction: string;
    images: string[];
}

const loadTutorials = async (): Promise<TutorialJson[]> => {
    const locale = navigator.language.split("-")[0]
    const res = await fetch('/tutorials/transactionTutorials.json');
    const jsonRes = await res.json();
    const data = jsonRes[`${locale}`];
    return data.tutorialSteps;
}

const useTutorial = () => {
    const [steps, setSteps] = useState<TutorialJson[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [loading, setLoading] = useState(false);

    const startTutorial = async () => {
        setLoading(true);
        try {
            const tutorialSteps = await loadTutorials();
            setSteps(tutorialSteps);
            setCurrentStep(0);
        } catch (error) {
            console.error('Failed to load tutorial steps:', error);
        } finally {
            setLoading(false);
        }
    };

    // Next step function
    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    // Previous step function
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const resetTutorial = () => {
        setSteps([]);
        setCurrentStep(0);
    }

    return {
        steps,
        currentStep,
        loading,
        startTutorial,
        nextStep,
        prevStep,
        resetTutorial,
    };
};

export default useTutorial;