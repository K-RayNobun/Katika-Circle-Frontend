import React from 'react';
import Image from 'next/image';

const AwardsInitiateTransaction = () => {
    return (
        <div className='flex flex-col bg-primary w-full rounded-[12px] gap-[0px] p-[16px]'>
            <div className='flex'>
                <div className='flex flex-col gap-[8px] text-white'>
                    <h4 className='text-[16px] font-bold'>Il est temps de faire un virement</h4>
                    <p className='text-[12px] font-light'>
                        Pret à transférer de l&apos;argent ? Cliquez ici pour commencer et profitez d&apos;une experience rapide, securisée et sans tracas
                    </p>
                </div>
                <Image src='/awards/spacerocket.png' alt='spacerocket' className='h-[100px] mb-[6px]' />
            </div>
            <button className='bg-white rounded-[4px] py-[10px] px-[18px] w-full text-primary font-bold'>
                Envoyer de l&apos;argent
            </button>
            <h5>We&apos;ve sent a verification code to your email. Enter it below to complete your login</h5>
            <Image src="/path/to/image" alt="Description of image" />
            <Image src="/path/to/another-image" alt="Description of another image" />
            <h5>Don&apos;t have an account? Sign up</h5>
        </div>
    );
};

export default AwardsInitiateTransaction;