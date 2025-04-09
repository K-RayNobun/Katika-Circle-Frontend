import React, { useState } from "react";
import { useTranslation } from '@/lib/hooks/useTranslation';

const ReferralDialogBox = ({text, onClose}) => {
    const { t } = useTranslation();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
        });
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
            <div className="bg-primary p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl font-semibold mb-4 text-center text-white uppercase">
                    {t('ReferralDialogBox.title')}
                </h2>
                <div className="mb-4">
                    <input
                        type="text"
                        readOnly
                        value={text}
                        className="w-full p-2 border rounded-md bg-gray-100 text-purple-900 font-semibold"
                    />
                </div>
                <div className="flex justify-around w-[60%] mx-auto">
                    <button
                        onClick={handleCopy}
                        className="px-6 py-2 bg-purple-950 text-white font-semibold rounded-md"
                    >
                        {isCopied ? t('ReferralDialogBox.copied') : t('ReferralDialogBox.copyButton')}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-400 text-purple-950 font-semibold rounded-md"
                    >
                        {t('ReferralDialogBox.cancelButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReferralDialogBox;