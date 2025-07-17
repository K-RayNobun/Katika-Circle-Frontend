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
        <div className="fixed inset-0 z-50 h-[100vh] flex items-center justify-center bg-black/50 px-4">
            <div className="h-[70%] w-full max-w-3xl overflow-y-auto rounded-lg bg-white  ">
                <TransactionsTutorialContainer goBack={handleGoBack} onFinish={onFinish}/>
            </div>
        </div>

    );
};

export default FirstTutorialContainer;