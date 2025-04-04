import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/hooks/useTranslation';

const WelcomeContainer = ({ 
    userData, 
    setIsScreenVisible 
}: { 
    userData: { name: string, surname: string }, 
    setIsScreenVisible: (isScreenVisible: boolean) => void 
}) => {
    const { translations, locale } = useTranslation();

    return (
        <div className="relative animate-fading-1 bg-indigo flex justify-center lg:justify-between lg:h-[210px] rounded-[12px] overflow-hidden w-full">
            <div className="lg:block flex flex-col items-center justify-between px-[6px] text-center lg:text-start lg:px-[24px] py-[20px] xl:py-[32px] w-[70%]">
                <h2 className="text-white text-[20px] lg:text-[24px]">
                    {String(translations?.welcome) || 'Welcome'}, 
                    <span className="font-bold">
                        {userData.surname.split(" ")[0]}
                    </span>
                </h2>
                <h5 className="text-white text-[12px] lg:text-[12px]">
                    {String(translations?.getStarted) || "Let's get started. To make a transaction just push the button below."}
                </h5>
                <button 
                    onClick={() => setIsScreenVisible(true)} 
                    className="mt-[16px] pulse-glow lg:mt-[32px] flex justify-center text-indigo font-bold px-[18px] py-[8px] rounded-[8px] bg-white"
                >
                    {String(translations?.sendMoney) || "Envoyer de l'argent"}
                </button>
            </div>
            <div className="absolute bottom-0 right-0 hidden lg:flex items-center">
                <Image 
                    src="/home/person.svg" 
                    width={142} 
                    height={205} 
                    className="h-[205px] mb-[-2px] mr-[-8px]" 
                    alt="Welcome" 
                    priority
                />
            </div>
        </div>
    );
};

export default React.memo(WelcomeContainer);