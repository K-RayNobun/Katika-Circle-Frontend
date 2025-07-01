import React from 'react';
import { LiaTimesCircleSolid } from 'react-icons/lia';

interface TutorialStepProps {
    title: string;
    instruction: string;
    imageSrc: string;
    onNext: () => void;
    onPrev: () => void;
    onExit: () => void;
    isFirstStep?: boolean;
    isLastStep?: boolean;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
    title,
    instruction,
    imageSrc,
    onNext,
    onPrev,
    onExit,
    isFirstStep = false,
    isLastStep = false,
}) => {
    return (
        <div className="relative w-full p-[15%] flex flex-col justify-center items-center">
            <button
                className="absolute top-6 right-6 "
                onClick={onExit}
            >
                <LiaTimesCircleSolid size={36} className='text-primary_dark' />
            </button>
            <h2 className="text-[28px] font-bold text-primary mb-4 text-center">
                {title}
            </h2>
            <p className="text-gray-700 mb-6 px-14 text-center">
                {instruction}
            </p>
            <div className="mb-8 flex justify-center items-center w-full">
                <img
                    src={imageSrc}
                    alt={title}
                    className="max-w-xs max-h-72 rounded shadow border border-gray-200 object-contain"
                />
            </div>
            <div className="flex justify-center items-center gap-20">
                <button
                    className={`mt-4 px-6 py-2 ${ isFirstStep ? 'hidden' : 'block' } bg-primary text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition `}
                    onClick={onPrev}
                    disabled={isFirstStep}
                    
                >
                    { 'Prev' }
                </button>
                <button
                    className="mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition"
                    onClick={isLastStep ? onExit : onNext}
                    
                >
                    {isLastStep ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default TutorialStep;