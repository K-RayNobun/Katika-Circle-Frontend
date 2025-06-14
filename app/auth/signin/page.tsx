'use client'

import React, { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';

// Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createUser, setReferralCode, setWalletAdress, verifyUser } from '@/lib/redux/features/user/userSlice';
import { renewToken } from '@/lib/redux/features/token/tokenSlice';
import { useTranslation } from '@/lib/hooks/useTranslation';

import { withCookieProtection } from '@/app/CookieProvider';

import { useApiGet, useApiPost} from '@/lib/hooks/useApiRequest';
import AsyncSpinner from '@/components/AsyncSpinner';

import transakCountries from '@/public/countries/TransakCountriesList.json';

// UseApiRequest hook calls return data in a type thta shoudld be pased onto him. I

// interface UserData {
//     id: string;
//     name: string;
//     sname: string;
//     email: string;
//     countryCode: string;
//     verified: boolean;
//     referral: {
//     referralCode: string;
//     };
//     wallet: {
//     address: string;
//     };
// }

interface CountryData {
    name: string;
    image?: string;
    currencyCode: string;
    alpha2: string;
}

// type signinResponse = {
//     'access-token': string
// }
type signinPayload = {
    'email': string,
    'pwd': string
}

// type countryFlagPayload = {
//     "iso2": string,
// }
                                                                                                                                                                                                                                                    
const Signin = () => {

    // const [state, loginAction] = useActionState(login, undefined)

    const inputStyle = 'appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none';
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorField, setErrorField] = useState('');
    const { t } = useTranslation();

    //Redux related imports
    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);

    const accessTokenRef = useRef('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    // const [userCurrency, setUserCurrency] = useState<string>('')

    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
      });

    const formRef = useRef<HTMLFormElement>(null);

    const { executePost} = useApiPost();
    const { fetchData } = useApiGet();

    useEffect(() => {
        // console.log('Check if we can send him to homePage');
        if (userData.verified && userData.email && isSigningIn) {
            console.log('Pushing to /Home');
            setIsSubmitting(false);
            router.push('/user/home');
        }
    }, [userData.email, userData.verified, isSigningIn]);

    const tooglePwdVisibility = () => {
        setIsPwdVisible(prev => !prev);
    };

    const validateEmail = (email:string):boolean => {
        // Email may contain letters, numbers, and special characters
        // such as !#$%&'*+/=?^_`{|}~- and must have a domain
        const regex = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    const validatePassword = (password: string): boolean => {
        return password.length >= 6
    }

    const handleSubmit = async(e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setIsSigningIn(true);
        // console.log('Submitting ...');

        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!validateEmail(email)) {
            setErrorField((prev) => prev + ' email');
            // console.log('Email => ', email);
            setError('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            setErrorField((prev) => prev + ' password');
            // console.log('Password is => ', password)
            setError('Password is invalid.');
            return;
        }

        // // console.log('Processing sign in');
        // sendEmail(formRef.current);

        setError(null);
        setErrorField('');
        setIsSubmitting(true);

        // SIGNIN REQUEST
        const {response: result, error: errorMessage} = await executePost<signinPayload>(
            `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/login`,
            {
                email: formData.get('email') as string,
                pwd: formData.get('password') as string,
            },
            false
        );

        if (!result && errorMessage) {
            setErrorField('email & password');
            setError(errorMessage)
            setIsSubmitting(false);
            console.log('We caught an error message: ', errorMessage);
            return;
        }
        // Set token and dispatch to Redux
        const token = result['access-token'];
        accessTokenRef.current = token;
        
        await dispatch(
            renewToken({
                token: token,
                expiresIn: 5 * 60 * 1000,
            })
        );

        await new Promise(resolve => setTimeout(resolve, 500));

        // Now that we have the token, fetch user profile
        const {response: profileApiData, error: profileErrorMessage} = await fetchData(
            `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/profile`
        );
        if (!profileApiData && profileErrorMessage) {
            setError(errorMessage);
            setIsSubmitting(false);
            console.log('We caught an error message: ', profileErrorMessage);
            return;
        }
        console.log('User Country => ', profileApiData.countryCode);
        
        let response = [] as CountryData[];
        const {response: apiResponse} = await fetchData('https://api.transak.com/api/v2/countries', false);
        if (!apiResponse) {
            // Get countries from public/countries/transakCountriesList.json
            const res = transakCountries.response;
            console.log('Processing countries from JSON file');
            // const res = await fetch('/countries/TransakCountriesList.json');
            // const JsonRes = await res.json();
            // console.log('Response is ', JsonRes);
            // console.log('')
            response = res as CountryData[];
        } else {
            response = apiResponse
        }
        console.log('Countries => ', response);
        console.log('5 first Countries => ', response.slice(0, 5));
        const countriesArray: Array<CountryData> = response.filter((country) => country.currencyCode === 'EUR' || country.currencyCode === 'GBP');
        console.log('Countries Array => ', countriesArray);
        let currencyCode;
        for (let i=0; i <= countriesArray.length-1; i++) {
            if (countriesArray[i].name.toUpperCase() === profileApiData.countryCode.toUpperCase()) {
                console.log(`This user country is ${countriesArray[i].name} and its currency is ${countriesArray[i].currencyCode}`);
                if (countriesArray[i].currencyCode === 'GBP') {
                    currencyCode = '£'; 
                } else {
                    currencyCode = '€'
                }
                break
            } else {
                console.log('This user country is not in the list of countries');
                currencyCode = '€';
            }
        }

        if (profileApiData) {
            // Update user data in Redux
            dispatch(setReferralCode(profileApiData.referral.referralCode!));
            dispatch(setWalletAdress(profileApiData.wallet.address));
            dispatch(createUser({
                id: profileApiData.id,
                name: profileApiData.name,
                surname: profileApiData.sname,
                email: profileApiData.email,
                country: profileApiData.countryCode,
                currencySymbol: currencyCode,
                referralCode: profileApiData.referral.referralCode,
                language: 'fr'
            }));
            dispatch(verifyUser(profileApiData.verified));
        }

        // console.log('Moving to the next point');
    };

    useEffect(() => {
        const email = searchParams.get('email');
        const pwd = searchParams.get('password');

        if(email && pwd) {
            setFormData({
                email: email,
                password: pwd
            })
        }
    }, [searchParams]);

    const handleInputChange = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, value } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: value
        })
    }

  return (
    <div className='flex flex-col justify-center flex-1 px-[4%] sm:px-[10%] lg:px-[40px] pt-[32px] '>
        <div>
            <div className='flex flex-col items-center text-center'>
                <h3 className='font-bold mt-2 text-[28px] text-purple-900 leading-12'>{t('signin.title')}</h3>
                <h5 className='text-[17px]'>{t('signin.subtitle')}</h5>
            </div>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className='w-full mt-6 space-y-[16px]'>
            <input type="text" name='email' onChange={handleInputChange} className={`${inputStyle} ${errorField.includes('email') ? 'border-2 border-red': ''}`} placeholder={t('signin.emailPlaceholder')} />
            <div className='relative'>
                <input name='password' type={isPwdVisible ? 'text' : 'password'} onChange={handleInputChange} className={`${inputStyle} ${errorField.includes('password') ? 'border-2 border-red': ''}`} placeholder={t('signin.passwordPlaceholder')} />
                { isPwdVisible ?
                    <LuEye onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                    :
                    <LuEyeClosed onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                }
            </div>
            <div>
                {error && <h4 className='text-red font-bold text-center text-sm h-min'>{error}</h4>}
            </div>
            <div className='flex justify-center mt-2'>
                <Link href='/auth/password_reset' className='mx-auto text-primary text-center font-bold'>{t('signin.forgotPassword')}</Link>
            </div>
            <button type='submit' className={`mt-6 bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full ${isSubmitting ? 'opacity-50' : ''}`}>
                {isSubmitting ? (
                    <>
                        <AsyncSpinner />
                        {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                    </>
                ) : (
                    <h6 className='text-center font-bold'>{t('signin.submitButton')}</h6>
                )}
            </button>
            {/* <h4 className="font-bold text-center leading-[12px]">
                Ou
            </h4>
            <div className={`bg-white border border-gray_dark/60 flex justify-center gap-[8px] py-[10px] rounded-[8px] w-full`}>
                <Image src={'/auth/googlelogo.png'} alt='' width={25} height={25} className='size-[25px]'></Image>
                <h6 className='text-center font-bold'>Continuer avec Google</h6>
            </div> */}
        </form>
        <h4 className='text-center text-[14px] sm:text-[16px] leading-[24px] mt-4'> {t('signin.noAccount')}<Link href='/auth/signup' className='text-primary font-bold'> {t('signin.signupLink')}</Link></h4>
    </div>
  )
}

export default withCookieProtection(Signin);
