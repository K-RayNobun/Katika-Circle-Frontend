import React from 'react';
import Image from 'next/image';

const WelcomeContainer = ({ userData, setIsScreenVisible }: { userData: { name: string, surname: string }, setIsScreenVisible: (isScreenVisible: boolean) => void }) => {
    return (
        <div className={`relative animate-fading-1 bg-indigo flex justify-center lg:justify-between lg:h-[210px] rounded-[12px] overflow-hidden w-full`}>
            <div className={`lg:block flex flex-col items-center px-[6px] text-center lg:text-start lg:px-[24px] py-[32px] lg:max-w-[70%]`}>
                <h2 className={`text-white text-[20px] lg:text-[24px]`}>Welcome back, <span className={`font-bold`}>{`${userData.name}`}</span> {`${userData.surname}`}</h2>
                <h5 className={`text-white text-[12px] lg:text-[12px]`}>Let&apos;s get started. To make a transaction just push the button below.</h5>
                <button onClick={() => setIsScreenVisible(true)} className={`mt-[16px] pulse-glow lg:mt-[32px] flex justify-center text-indigo font-bold px-[18px] py-[8px] rounded-[8px] bg-white`}>Envoyer de l&apos;argent</button>
            </div>
            <div className={`absolute bottom-0 right-0 hidden lg:flex items-center`}>
                {/* <Image src="/home/bulle.png" width={86} height={48} className={`h-[48px]`} alt="Image not Loaded" /> */}
                <Image src="/home/person.svg" width={142} height={205} className={`h-[205px] mb-[-2px] mr-[-8px]`} alt="Image Not Loaded" />
            </div>
        </div>
    );
};

export default WelcomeContainer;