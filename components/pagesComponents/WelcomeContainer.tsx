import React from 'react';

const WelcomeContainer = ({ userData, setIsScreenVisible }: { userData:any, setIsScreenVisible:(isScreenVisible:boolean) => void}) => {
    return (
        <div className={`relative animate-fading-1 bg-indigo flex justify-center lg:justify-between lg:h-[210px] rounded-[12px] overflow-hidden w-full`}>
            <div className={`lg:block flex flex-col items-center px-[24px] py-[32px]`}>
                <h2 className={`text-white text-[20px] lg:text-[24px]`}>Welcome back, <span className={`font-bold`}>{`${userData.name}`}</span> {`${userData.surname}`}</h2>
                <h5 className={`text-white text-[12px] lg:text-[12px]`}>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</h5>
                <button onClick={() => setIsScreenVisible(true)} className={`mt-[16px] pulse-glow lg:mt-[32px] flex justify-center text-indigo font-bold px-[18px] py-[8px] rounded-[8px] bg-white`}>Envoyer de l'argent</button>
            </div>
            <div className={`absolute bottom-0 right-0 hidden lg:flex items-center`}>
                <img src="/home/bulle.png" className={`h-[48px]`} alt="Image not Loaded" />
                <img src="/home/person_home.png" className={`h-[205px]`} alt="Image Not Loaded" />
            </div>
        </div>
    );
};

export default WelcomeContainer;