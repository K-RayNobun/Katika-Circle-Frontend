'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { RiMailSendFill } from "react-icons/ri";
import { useApiPost } from '@/lib/hooks/useApiRequest';

import { useSearchParams } from 'next/navigation';

// How can I pass the email from auth/password_reset/page.tsx to this page?
// Option 1: Use a global state management library like Redux or Context API.
// Option 2: Use URL parameters to pass the email address.
//  We wil go for the URL parameters option

const MailCheck:React.FC= () => {
    const { t } = useTranslation();
    const { executePost } = useApiPost();

    const searchParams = useSearchParams();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [canAskCode, setCanAskCode] = useState(false);
    const [timeMinLeft, setTimeMinLeft] = useState(1);
    const [timeSecLeft, setTimeSecLeft] = useState(59);
    const timeSecLeftRef = useRef(timeSecLeft);
    const timeMinLeftRef = useRef(timeMinLeft);
    const requestSentRef = useRef(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
         // Get the email from URL
        const email = searchParams.get('email');
        setEmail(email);
        console.log('Email from URL:', email);

    }, [searchParams]);

    useEffect(() => {
        if (email) {
            console.log('Email to reset:', email);
            postResetEmail();
        }
    }, [email]);

    useEffect(() => {
       
        // Set the timer for 1 minutes
        if(!canAskCode && requestSentRef.current) {
            console.log('Can ask code is false');
            const timer = setInterval(() => {
                if (timeSecLeftRef.current > 0)  {
                    setTimeSecLeft(prev => prev - 1);
                    timeSecLeftRef.current -= 1;
                    console.log(' Seconds left: ', timeSecLeftRef.current);
                } else if(timeMinLeftRef.current > 0) {
                    console.log('A minute went down')
                    setTimeMinLeft(prev => prev - 1);
                    timeMinLeftRef.current -= 1;
                    setTimeSecLeft(59);
                    timeSecLeftRef.current = 59;
                } else {
                    console.log('Counter down to 0.')
                    setCanAskCode(true);
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);

        } else {
            console.log(` Can ask code already ? ${canAskCode} \n `);
        }

    }, [canAskCode, requestSentRef.current]);

    const postResetEmail = async () => {

        console.log('Email used in Post request: ', email);
        const {response: response, error: errorMessage} = await executePost(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/reset-mailer`, 
            {"email": email},
            false
        );
        
        if (!response && errorMessage) {
            setCanAskCode(true);
            console.log()
            setErrorMsg(errorMessage);
            return;
        }

        setErrorMsg('');
        requestSentRef.current = true;

        console.log('------------- POST REQUEST SENT -------------');
    }

    const handleCodeRequest = async () => {
        if (!canAskCode) {
            return;
        }
        postResetEmail();
        if(!requestSentRef.current) {
            console.log('The request failed We cant start timer');
            return
        }
        setCanAskCode(false);
        setTimeMinLeft(1);
        timeMinLeftRef.current = 1;
    }

    return (
        <div className="grow flex flex-col items-center justify-center h-full bg-white rounded-lg p-8">
            <div className="flex flex-col items-center mb-3">
                <div className="bg-primary/20 p-4 rounded-full">
                    <RiMailSendFill size={30} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary_dark mt-4">
                    {t('mailCheck.title')}
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    {t('mailCheck.subtitle')}
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

            {
                errorMsg && <h1 className='mt-6 text-red font-bold text-center text-[16px]'>{errorMsg}</h1>
            }

            <h4 className='mt-4 text-center text-[14px] sm:text-[16px] leading-[24px]'>
                {t('pinCheck.noCode')} <button onClick={handleCodeRequest} className='inline-block text-primary font-bold'>{t('pinCheck.resendCode')}</button>
                <br /> 
                {
                    !canAskCode 
                    && 
                    <span id='time-left' className='text-[16px] font-bold duration-100'> {t('pinCheck.timeLeft')} {timeMinLeft + ':' + (timeSecLeft < 10 ? `0${timeSecLeft}` : timeSecLeft)}</span>
                }
            </h4>
        </div>
    );
};

export default MailCheck;