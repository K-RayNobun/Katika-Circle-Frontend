import React from 'react';
import { LiaTimesCircleSolid } from 'react-icons/lia';
import { useTranslation } from '@/lib/hooks/useTranslation';

export type Platform = 'ios' | 'android' | '';
export type Browser = 'chrome' | 'safari' | 'ms-explorer' | '';

interface SignetSurveyProps {
    platform: Platform;
    browser: Browser;
    error: string;
    onPlatformChange: (platform: Platform) => void;
    onBrowserChange: (browser: Browser) => void;
    onStart: () => void;
    handleBack: () => void;
}

const platforms = [
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: 'Android' },
];

const browsers = [
    { value: 'chrome', label: 'Chrome' },
    { value: 'safari', label: 'Safari' },
    { value: 'ms-explorer', label: 'MS Explorer' },
];

const SignetSurvey: React.FC<SignetSurveyProps> = ({
    platform,
    browser,
    error,
    onPlatformChange,
    onBrowserChange,
    onStart,
    handleBack
}) => {

    const { t } = useTranslation();
    return (
        <div className="relative w-full p-[15%] flex flex-col justify-center items-center">
            <button
                className="absolute top-6 right-6 "
                onClick={handleBack}
            >
                <LiaTimesCircleSolid size={36} className='text-primary_dark' />
            </button>
            <h2 className="text-[28px] font-bold text-primary mb-4 text-center">
                {t('settingsTutorials.signetSurvey.title')}
            </h2>
            <p className="text-gray-700 mb-6 px-14 text-center">
                {t('settingsTutorials.signetSurvey.description')}
            </p>
            <div>
                <div className="w-full mb-5 flex flex-col ">
                    <label className="block font-semibold mb-2">{t('settingsTutorials.signetSurvey.platformLabel')}</label>
                    <div className="flex gap-8">
                        {platforms.map((p) => (
                            <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="platform"
                                    value={p.value}
                                    checked={platform === p.value}
                                    onChange={() => onPlatformChange(p.value as Platform)}
                                    className="accent-primary"
                                />
                                {p.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="w-full mb-5">
                    <label className="block font-semibold mb-2">{t('settingsTutorials.signetSurvey.br')}</label>
                    <div className="flex gap-8 flex-wrap">
                        {browsers.map((b) => (
                            <label key={b.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="browser"
                                    value={b.value}
                                    checked={browser === b.value}
                                    onChange={() => onBrowserChange(b.value as Browser)}
                                    className="accent-primary"
                                />
                                {b.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {error && <div className="text-red-500 mb-4">{t('settingsTutorials.signetSurvey.error')}</div>}

            <button
                className="mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 active:bg-primary_dark transition"
                onClick={onStart}
                disabled={!platform || !browser}
            >
            { t('settingsTutorials.signetSurvey.startButton') }
            </button>
        </div>
    );
};

export default SignetSurvey;