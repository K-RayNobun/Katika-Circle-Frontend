import React, { useState } from "react";
import { useTranslation } from '@/lib/hooks/useTranslation';
import { IoMdClose } from "react-icons/io";
import { FiShare2 } from "react-icons/fi"; 

const ReferralDialogBox = ({text, onClose}) => {
    const { t } = useTranslation();
    const [isCopied, setIsCopied] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

     const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: t('ReferralDialogBox.shareTitle'),
                    text: t('ReferralDialogBox.shareText'),
                    url: text
                });
            } else {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(whatsappUrl, '_blank');
                await handleCopy();
            }
        } catch (err) {
            console.error('Error sharing:', err);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-primary p-8 max-w-md w-[90%] rounded-2xl shadow-xl">
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                    aria-label="Close dialog"
                >
                    <IoMdClose size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-white">
                    {t('ReferralDialogBox.shareTitle')}
                </h2>
                <div className="mb-4">
                    <input
                        type="text"
                        readOnly
                        value={text}
                        className="w-full py-3 pl-4 pr-12 border-2 border-transparent 
                                    rounded-lg bg-white/90 text-purple-900 font-medium
                                    focus:outline-none focus:border-purple-300 transition-colors"
                    />
                </div>
                <div className="flex justify-around mx-auto gap-[10px]">
                    <button
                        onClick={handleCopy}
                        className="w-full py-3 px-4 bg-white text-primary font-semibold 
                                    rounded-lg hover:bg-white/90 transition-colors"
                    >
                        {isCopied ? t('ReferralDialogBox.copied') : t('ReferralDialogBox.copyButton')}
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex-1 py-3 px-4 bg-white text-primary font-semibold
                               rounded-lg hover:bg-white/90 transition-colors"
                        disabled={isSharing}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <FiShare2 />
                            {t('ReferralDialogBox.shareButton')}
                        </span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-white text-primary font-semibold
                               rounded-lg hover:bg-white/90 transition-colors"
                    >
                        {t('ReferralDialogBox.cancelButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReferralDialogBox;