import React from 'react';
import SignetSurvey from './SignetSurvey';
import TutorialStep from '../../TutorialStep';
import useTutorial from '../hooks/useTutorial';
import { useTranslation } from '@/lib/hooks/useTranslation';

type SignetTutorialContainerProps = {
    goBack: () => void;
    isPopUpMode?: boolean; // Optional prop to indicate if this is in a popup context
};

const SignetTutorialContainer = ({ goBack, isPopUpMode=false }: SignetTutorialContainerProps) => {
    const {
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
    } = useTutorial();

    const { t } = useTranslation();

    if (!surveyDone) {
        return (
            <SignetSurvey
                platform={platform}
                browser={browser}
                error={error}
                onPlatformChange={setPlatform}
                onBrowserChange={setBrowser}
                onStart={startTutorial}
                handleBack={goBack}
            />
        );
    }

    if (!steps.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-red-500 mb-4">
                    { t('settingsTutorials.signetTutorial.noTutorialFound') }
                </p>
                <button
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80"
                    onClick={() => {
                        resetTutorial();
                        goBack();
                    }}
                >
                    { t('settingsTutorials.signetTutorial.backButton') }
                </button>
            </div>
        );
    }

    const step = steps[currentStep];
    console.log('Step Details', step);
    console.log('This Step Images', step.images);

    return (
        <TutorialStep
            title={step.title}
            instruction={step.instruction}
            images={step.images}
            onNext={nextStep}
            onPrev={prevStep}
            onExit={goBack}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
            isPopUpMode={isPopUpMode} // Assuming this is for a popup context
        />
    );
};

export default SignetTutorialContainer;