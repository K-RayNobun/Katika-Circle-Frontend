import React from "react";
import SignetTutorialContainer from "@/app/user/settings/tutorials/signetTutorial/components/SignetTutorial";

interface SignetPopupContainerProps {
    onClose: () => void;
}

const SignetPopupContainer: React.FC<SignetPopupContainerProps> = ({ onClose }) => {
    // Handler for when the tutorial is exited or finished
    const handleGoBack = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 h-[100vh] flex items-center justify-center bg-black/50 px-4">
            <div className="h-[70%] w-full max-w-3xl overflow-y-auto rounded-lg bg-white flex justify-center">
                <SignetTutorialContainer goBack={handleGoBack} isPopUpMode={true} />
            </div>
        </div>

    );
};

export default SignetPopupContainer;