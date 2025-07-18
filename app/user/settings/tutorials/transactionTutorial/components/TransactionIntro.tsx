import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface TransactionIntroProps {
    onContinue?: () => void;
}

const TransactionIntro: React.FC<TransactionIntroProps> = ({ onContinue }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full p-[10%] flex flex-col justify-center items-center">
            <h2 className="text-[24px] lg:text-[28px] font-bold text-primary mb-4 text-center">
                {t('settingsTutorials.transactionTutorial.title')}
            </h2>
            <p className="text-gray-700 mb-6 text-[14px] lg:text-[16px] text-center whitespace-pre-line">
                {t('settingsTutorials.transactionTutorial.description')}
            </p>
            {onContinue && (
                <button
                    className="mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition"
                    onClick={onContinue}
                >
                    {t('transactionScreens.common.continue')}
                </button>
            )}
        </div>
    );
};

export default TransactionIntro;