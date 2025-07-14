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
        <div className="w-full h-full flex items-center justify-center bg-black/30 p-4">
            <div className="max-w-2xl h-[100%] shadow-lg bg-yellow-500/70">
                <TransactionsTutorialContainer goBack={handleGoBack} />
            </div>
        </div>
    );
};

export default FirstTutorialContainer;