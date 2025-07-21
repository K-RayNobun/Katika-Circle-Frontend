import React, { useEffect, useState } from "react";
import { getDeviceType, detectAppNature } from "../functions/WPAChecker";
import { LiaTimesSolid } from "react-icons/lia";
import { useTranslation } from "@/lib/hooks/useTranslation";


const SignetBanner = ( { showSignetPopup } : { showSignetPopup: (arg: boolean) => void }) => {
    const { t } = useTranslation();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const { isMobile } = getDeviceType();
        const { isStandAlone } = detectAppNature();

        // Show banner only if NOT PWA and on mobile
        if (!isStandAlone && isMobile) {
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-white dark:bg-gray-800 text-sm shadow-lg shadow-black/60 rounded-xl px-6 pt-8 pb-4 flex flex-col items-center gap-4 max-w-md w-[95%]">
            <span className="flex-1 text-gray-900 dark:text-gray-100">{t('settingsTutorials.signetBanner.message')}</span>
            <div className="flex w-4/5 justify-between">
                <button
                    className="bg-primary hover:bg-primary_dark text-white font-semibold px-4 py-2 rounded-lg shadow transition"
                    onClick={() => {
                        showSignetPopup(true);
                    }}
                >
                    {t('settingsTutorials.signetBanner.downloadButton')}
                </button>
                <button
                    className="bg-white border-2 border-primary hover:bg-primary_dark text-primary font-semibold px-4 py-2 rounded-lg shadow transition"
                    onClick={() => {
                        setVisible(false);
                    }}
                >
                    {t('settingsTutorials.signetBanner.understoodButton')}
                </button>
            </div>
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition"
                aria-label="Close"
                onClick={() => setVisible(false)}
            >
                <LiaTimesSolid size={20} className="font-bold" />
            </button>
        </div>
    );
};

export default SignetBanner;