import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { format } from 'path';


type TutorialJson = {
    order: number;
    title: string;
    instruction: string;
    images: string[];
}

const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => (
        <React.Fragment key={i}>
            {
              paragraph.split('\n').map((line, j) => (
                <React.Fragment key={j}>
                  {
                    // Check Display the content between \b in bold
                    // For example in the sentence "The lion is a little \bchildish\b", the word childish will be in bold
                        <span key={j} className="">
                          {line}
                        </span>
                  }
                  <br />
                </React.Fragment>
              ))
            }
            <br />
        </React.Fragment>
    ))
  }

const loadTutorials = async (): Promise<TutorialJson[]> => {
    const locale = navigator.language.split("-")[0]
    const res = await fetch('/tutorials/transactionTutorials.json');
    const jsonRes = await res.json();
    const data = jsonRes[`${locale}`];
    return data.tutorialSteps;
}

const useTutorial = () => {
    const { locale } =  useTranslation();
    console.log('Using locale:', locale);
    const [steps, setSteps] = useState<TutorialJson[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const startTutorial = async () => {
        console.log('Starting tutorial...');
        setLoading(true);
        try {
            const tutorialSteps = await loadTutorials();
            const formattedSteps = tutorialSteps.map((step: any) => ({
                ...step,
                instruction: formatContent(step.instruction),
            }));
            setSteps(formattedSteps);
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