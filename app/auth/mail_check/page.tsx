'use client';

import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { RiMailSendFill } from "react-icons/ri";

const MailCheck = () => {
    const { t } = useTranslation();

    return (
        <div className="grow flex flex-col items-center justify-center h-full bg-white rounded-lg p-8">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-primary/20 p-4 rounded-full">
                    <RiMailSendFill size={30} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary_dark mt-4">
                    {t('mailCheck.title')}
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    {t('translations.mailCheck.subtitle')}
                </p>
            </div>

            {/* <button
                onClick={handleOpenMailApp}
                className="w-full py-2 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary_dark transition"
            >
                {String(mailCheck?.openMailApp)}
            </button> */}

            <p className="text-gray_dark text-center text-sm">
                {t('mailCheck.notReceived')}
            </p>
        </div>
    );
};

export default MailCheck;