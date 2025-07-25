import { useTranslation } from '@/lib/hooks/useTranslation';
import React, { useState, useEffect } from 'react';
import { LiaTimesCircleSolid } from 'react-icons/lia';

interface TutorialStepProps {
    title: string;
    instruction: string;
    images: string[];
    onNext: () => void;
    onPrev: () => void;
    onFinish: () => void;
    onExit: () => void;
    isFirstStep?: boolean;
    isLastStep?: boolean;
    isPopUpMode?: boolean;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
    title,
    instruction,
    images,
    onNext,
    onPrev,
    onFinish,
    onExit,
    isFirstStep = false,
    isLastStep = false,
    isPopUpMode,
}) => {

    const { t } = useTranslation();

    const [expanded, setExpanded] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<number>(0);

    const maxLength = 70;
    const displayText = instruction.length > maxLength ? instruction.slice(0, maxLength) : instruction;

    // Display Step Images
    useEffect(() => {
        setCurrentImage(0);
    }, [title]);

    return (
        <div className={`relative w-full flex flex-col flex-shrink-0 justify-center items-center rounded-xl ${ isPopUpMode ? 'p-[32px] lg:p-[15%]': 'p-[20px] lg:p-[32px]' }`}>
           { isPopUpMode &&
                <button
                    className="absolute top-4 lg:top-6 right-4 lg:right-6 "
                    onClick={onExit}
                >
                    <LiaTimesCircleSolid className='text-primary_dark text-[24px] lg:text-[40px]' />
                </button>
            }
            <h2 className="text-[19px] lg:text-[28px] font-bold text-primary mt-2 mb-4 text-center">
                {title}
            </h2>
            <p className="text-[13px] lg:text-[15px] text-gray-700 mb-6 text-center">
                { instruction.length > maxLength ? ( expanded ? instruction : displayText ) : instruction }
                <button className='text-violet-700 inline' onClick={ e => {e.stopPropagation(); setExpanded(prev => !prev); }}>
                { instruction.length > maxLength ? ( expanded ? t('settingsTutorials.viewLess') : t('settingsTutorials.viewMore')) : '' }
                </button>
            </p>
            <div className="mb-2 lg:mb-8 flex flex-col items-center w-full max-w-[300px] gap-4">
                {images.length > 0 && (
                    <img
                        src={images[currentImage]}
                        alt={`Tutorial Step Image ${currentImage + 1}`}
                        className={`max-h-[360px] ${isPopUpMode ? 'h-[264px]' : 'h-[360px]'} rounded shadow border border-gray-200 object-contain`}
                    />
                )}
                {images.length > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-2">
                        <button
                            onClick={() => {
                                setCurrentImage((prev) => Math.max(prev - 1, 0));
                                }
                            }
                            disabled={currentImage === 0}
                            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            &lt;
                        </button>
                        <span className="text-sm">{currentImage + 1} / {images.length}</span>
                        <button
                            onClick={() => {
                                setCurrentImage((prev) => Math.min(prev + 1, images.length - 1));
                            }
                            }
                            disabled={currentImage === images.length - 1}
                            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
            <div className="flex justify-center items-center gap-8 lg:gap-20">
                <button
                    className={`mt-4 px-6 py-2 ${ isFirstStep ? 'hidden' : 'block' } bg-primary text-[14px] lg:text-[16px] text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition `}
                    onClick={onPrev}
                    disabled={isFirstStep}
                >
                    { t('settingsTutorials.tutorialStep.prevButton')}
                </button>
                <button
                    className="mt-4 px-6 py-2 bg-primary text-[14px] lg:text-[16px] text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition"
                    onClick={isLastStep ? () => {onFinish(); onExit()} : onNext}
                >
                    {isLastStep ? t('settingsTutorials.tutorialStep.finishButton') : t('settingsTutorials.tutorialStep.nextButton')}
                </button>
            </div>
        </div>
    );
};

export default TutorialStep;