import React from "react";
import SignetTutorialContainer from "@/app/user/settings/tutorials/signetTutorial/components/SignetTutorial";

interface SignetPopupContainerProps {
    onClose: () => void;
    onFinish: () => void;
}

const SignetPopupContainer: React.FC<SignetPopupContainerProps> = ({ onClose, onFinish }) => {
   
    return (
        <div className="fixed inset-0 z-50 h-[100vh] flex items-center justify-center bg-black/50 px-4">
            <div className="h-[70%] w-full max-w-3xl overflow-y-auto rounded-lg bg-white flex justify-center">
                <SignetTutorialContainer goBack={onClose} onFinish={onFinish} isPopUpMode={true} />
            </div>
        </div>

    );
};

export default SignetPopupContainer;