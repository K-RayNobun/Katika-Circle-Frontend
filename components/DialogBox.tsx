import React from "react";

// filepath: c:\Users\Admin\Documents\Kod\katika-circle\components\DialogBox.tsx

interface DialogBoxProps {
    text: string;
    onClose: () => void;
}
// Take values from en.json or fr.json

const DialogBox: React.FC<DialogBoxProps> = ({ text, onClose }) => {
    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
            <div className="bg-primary p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
                    {text}
                </h2>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white text-purple-950 font-semibold rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialogBox;