import React from 'react';

const AwardsInitiateTransaction = () => {
    return (
        <div className='flex flex-col bg-primary w-full rounded-[12px] gap-[0px] p-[16px]'>
            <div className='flex'>
                <div className='flex flex-col gap-[8px] text-white'>
                    <h4 className='text-[16px] font-bold'>Il est temps de faire un virement</h4>
                    <p className='text-[12px] font-light'>
                        Pret à transférer de l'argent ? Cliquez ici pour commencer et profitez d'une experience rapide, securisée et sans tracas
                    </p>
                </div>
                <img src='/awards/spacerocket.png' className='h-[100px] mb-[6px]' />
            </div>
            <button className='bg-white rounded-[4px] py-[10px] px-[18px] w-full text-primary font-bold'>
                Envoyer de l'argent
            </button>
        </div>
    );
};

export default AwardsInitiateTransaction;