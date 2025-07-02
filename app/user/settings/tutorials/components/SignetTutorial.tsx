import React from 'react';
import SignetSurvey from './SignetSurvey';
import TutorialStep from './TutorialStep';
import useTutorial from '../hooks/useTutorial'; // Create this hook

const SignetTutorialContainer = ({ goBack }: { goBack: () => void }) => {
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
                <p className="text-red-500 mb-4">Sorry, no tutorial found for your selection.</p>
                <button
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80"
                    onClick={resetTutorial}
                >
                    ← Back
                </button>
            </div>
        );
    }

    const step = steps[currentStep];

    return (
        <TutorialStep
            title={step.title}
            instruction={step.instruction}
            imageSrc={step.image}
            onNext={nextStep}
            onPrev={prevStep}
            onExit={goBack}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
        />
    );
};

export default SignetTutorialContainer;