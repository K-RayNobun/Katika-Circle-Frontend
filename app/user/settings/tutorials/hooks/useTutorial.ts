import { useState } from 'react';
import type { Platform, Browser } from '../components/SignetSurvey';

interface TutorialStepData {
    title: string;
    instruction: string;
    image: string;
}

type TutorialJson = {
    os: string;
    browser: string;
    steps: TutorialStepData[];
};

let tutorialsCache: TutorialJson[] | null = null;

const loadTutorials = async (): Promise<TutorialJson[]> => {
    if (tutorialsCache) return tutorialsCache;
    const res = await fetch('/tutorials/tutorials.json');
    const data = await res.json();
    tutorialsCache = data.tutorials;
    return tutorialsCache!;
};

const normalize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, '');


const useTutorial = () => {
    const [platform, setPlatform] = useState<Platform>('');
    const [browser, setBrowser] = useState<Browser>('');
    const [error, setError] = useState('');
    const [surveyDone, setSurveyDone] = useState(false);
    const [steps, setSteps] = useState<TutorialStepData[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const startTutorial = async () => {
        console.log(`Platform: ${platform} Browser: ${browser}`);
        if (!platform || !browser) {
            setError('Please select both your platform and browser.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const tutorials = await loadTutorials();
            // Find tutorial by normalized os and browser
            tutorials.forEach(tutorial => {
                console.log(`Tutorial OS: ${tutorial.os} Tutorial Browser: ${tutorial.browser}`);
            })
            const found = tutorials.find(
                t =>
                    normalize(t.os) === normalize(platform) &&
                    normalize(t.browser) === normalize(browser === 'ms-explorer' ? 'Microsoft Edge' : browser)
            );
            setSteps(found?.steps || []);
        } catch {
            setError('Failed to load tutorials.');
            setSteps([]);
        } finally {
            setCurrentStep(0);
            setSurveyDone(true);
            setLoading(false);
        }
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
        loading,
    };
};

export default useTutorial;