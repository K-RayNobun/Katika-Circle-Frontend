'use client'

import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function QrCodeDialog({link, onClose}:{link:string, onClose: () => void}) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
            <div className="bg-primary p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl font-semibold mb-4 text-center text-white">
                    {t('qrCodeDialog.subtitle')}
                </h2>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
                    {link && (
                        <QRCodeSVG value={link} size={256} color='#800FA7' />
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2 bg-white text-primary font-semibold rounded-md"
                >
                    {t('qrCodeDialog.close')}
                </button>
            </div>
        </div>
    );
}
