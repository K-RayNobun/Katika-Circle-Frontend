import { useEffect } from "react";
import useTutorial from "../hooks/useTutorial";
import { useTranslation } from "@/lib/hooks/useTranslation";
import TutorialStep from "../../signetTutorial/components/TutorialStep";

const TransactionsTutorialContainer = ({ goBack }: { goBack: () => void }) => {

    const { t } = useTranslation();

    useEffect(() => {
        startTutorial();
    }, []);

    const {
        steps,
        currentStep,
        startTutorial,
        nextStep,
        prevStep,
        resetTutorial
    } = useTutorial();

    if (!steps.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-red-500 mb-4">
                    {t("settingsTutorials.transactionTutorial.noTutorialFound")}
                </p>
                <button
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80"
                    onClick={() => {
                        resetTutorial();
                        goBack();
                    }}
                >
                    {t("settingsTutorials.transactionTutorial.backButton")}
                </button>
            </div>
        )
    }

    const step = steps[currentStep];
    console.log('Step Details', step);
    console.log('This Step Images', step.images);

    return (
        <section className="h-full w-full flex flex-col items-center justify-center bg-lime-400/25 overflow-y-auto">
            <TutorialStep
                title={step.title}
                instruction={step.instruction}
                images={step.images}
                onNext={nextStep}
                onPrev={prevStep}
                onExit={goBack}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === steps.length - 1}
            />
        </section>
    );
};

export default TransactionsTutorialContainer;