'use client'
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { IoMdClose } from 'react-icons/io';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function QrCodeDialog({link, onClose}:{link:string, onClose: () => void}) {
    const { t } = useTranslation();
    const [isCopied, setIsCopied] = useState(false);
    
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative max-w-md w-[90%] bg-primary p-8 rounded-2xl shadow-xl">
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                    aria-label="Close dialog"
                >
                    <IoMdClose size={24} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    {t('qrCodeDialog.subtitle')}
                </h2>

                {/* QR Code Container */}
                <div className="bg-white p-6 rounded-xl mb-6">
                    <div className="flex justify-center">
                        {link && (
                            <QRCodeSVG 
                                value={link} 
                                size={200}
                                level="H"
                                color="#800FA7"
                                className="transition-transform hover:scale-105"
                            />
                        )}
                    </div>
                </div>

                {/* Link Input Group */}
                <div className="relative mb-6 group">
                    <input
                        type="text"
                        readOnly
                        value={link}
                        className="w-full px-4 py-3 pr-12 bg-white/90 border-2 border-transparent 
                                 rounded-lg text-purple-900 font-medium focus:outline-none 
                                 focus:border-purple-300 transition-colors"
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                                 text-purple-900/60 hover:text-purple-900 transition-colors"
                        aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
                    >
                        {isCopied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                    </button>
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-white text-primary font-semibold 
                             rounded-lg hover:bg-white/90 transition-colors"
                >
                    {t('qrCodeDialog.close')}
                </button>
            </div>
        </div>
    );
}