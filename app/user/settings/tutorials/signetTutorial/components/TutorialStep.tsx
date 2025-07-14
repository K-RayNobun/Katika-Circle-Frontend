import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAppSelector } from '@/lib/redux/hooks';
import React from 'react';
import { LiaTimesCircleSolid } from 'react-icons/lia';

interface TutorialStepProps {
    title: string;
    instruction: string;
    images: string[];
    onNext: () => void;
    onPrev: () => void;
    onExit: () => void;
    isFirstStep?: boolean;
    isLastStep?: boolean;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
    title,
    instruction,
    images,
    onNext,
    onPrev,
    onExit,
    isFirstStep = false,
    isLastStep = false,
}) => {

    const { t } = useTranslation();

    const hasUserPassedTutorialOnce = useAppSelector((state) => state.user.passedTutorials);

    return (
        <div className={`relative w-full h-full flex flex-col justify-center items-center bg-white ${ hasUserPassedTutorialOnce ? 'p-[15%]': 'p-[32px] rounded-xl overflow-scroll' }`}>
           { hasUserPassedTutorialOnce &&
                <button
                    className="absolute top-6 right-6"
                    onClick={onExit}
                >
                    <LiaTimesCircleSolid size={36} className='text-primary_dark' />
                </button>
            }
            <h2 className="text-[28px] font-bold text-primary mt-2 mb-4 text-center">
                {title}
            </h2>
            <p className="text-gray-700 mb-6 text-center">
                {instruction}
            </p>
            <div className="mb-8 flex justify-center items-center w-full max-w-2xl gap-4">
                {images.map((imageLink, index) => (
                    <img
                        key={index}
                        src={imageLink}
                        alt={`Tutorial Step ${index + 1}`}
                        className=" max-h-[360px] rounded shadow border border-gray-200 object-contain"
                    />
                ))}
            </div>
            <div className="flex justify-center items-center gap-20">
                <button
                    className={`mt-4 px-6 py-2 ${ isFirstStep ? 'hidden' : 'block' } bg-primary text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition `}
                    onClick={onPrev}
                    disabled={isFirstStep}
                >
                    { t('settingsTutorials.tutorialStep.prevButton')}
                </button>
                <button
                    className="mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition"
                    onClick={isLastStep ? onExit : onNext}
                >
                    {isLastStep ? t('settingsTutorials.tutorialStep.finishButton') : t('settingsTutorials.tutorialStep.nextButton')}
                </button>
            </div>
        </div>
    );
};

export default TutorialStep;