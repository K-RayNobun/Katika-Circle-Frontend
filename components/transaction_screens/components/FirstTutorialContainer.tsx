import React from "react";
import TransactionsTutorialContainer from "@/app/user/settings/tutorials/transactionTutorial/components/TransactionTutorial";

interface FirstTutorialContainerProps {
    onClose: () => void;
    onFinish: () => void;
}

const FirstTutorialContainer: React.FC<FirstTutorialContainerProps> = ({ onClose, onFinish }) => {
    // Handler for when the tutorial is exited or finished
    const handleGoBack = () => {
        onClose();
        onFinish();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl h-[70vh] lg:h-[100%] shadow-lg rounded-xl bg-pink/35 p-2 overflow-hidden flex flex-col ">
                <TransactionsTutorialContainer goBack={handleGoBack} />
            </div>
        </div>
    );
};

export default FirstTutorialContainer;