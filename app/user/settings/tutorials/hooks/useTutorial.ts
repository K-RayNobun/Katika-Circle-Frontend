import { useState } from 'react';
import type { Platform, Browser } from '../components/SignetSurvey';

interface TutorialStepData {
    title: string;
    instruction: string;
    image: string;
}

const tutorialSteps: Record<string, TutorialStepData[]> = {
    // Example: key is `${platform}_${browser}`
    'ios_chrome': [
        { title: 'Step 1', instruction: 'Open Chrome on iOS.', image: '/images/ios_chrome_1.png' },
        { title: 'Step 2', instruction: 'Go to the tutorial page.', image: '/images/ios_chrome_2.png' },
    ],
    'android_chrome': [
        { title: 'Step 1', instruction: 'Open Chrome on Android.', image: '/images/android_chrome_1.png' },
        { title: 'Step 2', instruction: 'Go to the tutorial page.', image: '/images/android_chrome_2.png' },
    ],
    // Add more combinations as needed
};

const useTutorial = () => {
    const [platform, setPlatform] = useState<Platform>('');
    const [browser, setBrowser] = useState<Browser>('');
    const [error, setError] = useState('');
    const [surveyDone, setSurveyDone] = useState(false);
    const [steps, setSteps] = useState<TutorialStepData[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const startTutorial = () => {
        if (!platform || !browser) {
            setError('Please select both your platform and browser.');
            return;
        }
        setError('');
        const key = `${platform}_${browser}`;
        const foundSteps = tutorialSteps[key] || [];
        setSteps(foundSteps);
        setCurrentStep(0);
        setSurveyDone(true);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetTutorial = () => {
        setSurveyDone(false);
        setPlatform('');
        setBrowser('');
        setError('');
        setSteps([]);
        setCurrentStep(0);
    };

    return {
        surveyDone,
        steps,
        currentStep,
        platform,
        browser,
        error,
        setPlatform,
        setBrowser,
        startTutorial,
        nextStep,
        prevStep,
        resetTutorial,
    };
};

export default useTutorial;