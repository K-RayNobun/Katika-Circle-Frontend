'use client'

import React, { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
import AsyncSpinner from '@/components/AsyncSpinner';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';

// Redux related imports
import { useAppDispatch } from '@/lib/redux/hooks';
import { createUser, setReferralCode, setWalletAdress, verifyUser } from '@/lib/redux/features/user/userSlice';
import { renewToken } from '@/lib/redux/features/token/tokenSlice';


 
const Signin = () => {

    // const [state, loginAction] = useActionState(login, undefined)

    const inputStyle = 'appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none'
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [errorField, setErrorField] = useState('')

    //Redux related imports
    const dispatch = useAppDispatch();
    const accessTokenRef = useRef('');
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
      });

    const formRef = useRef<HTMLFormElement>(null);

    const tooglePwdVisibility = () => {
        setIsPwdVisible(prev => !prev);
    };

    const validateEmail = (email:string):boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const validatePassword = (password: string): boolean => {
        return password.length >= 6
    }

    const getUserData = async() => {
        console.log('Getting the verified user data');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/profile`,
            {
                headers: {
                    Authorization: `Bearer ${accessTokenRef.current}`,
                    "Content-Type": 'application/json'
                }
            }
        );
        console.log('The User Data Is: ', response.data.data);
        dispatch(setReferralCode(response.data.data.referral.referralCode))
        dispatch(setWalletAdress(response.data.data.wallet.address))
        dispatch(createUser({
            id: response.data.data.id,
            name: response.data.data.name,
            surname: response.data.data.sname,
            email: response.data.data.email,
            country: response.data.data.countryCode,
            referralCode: response.data.data.referral.referralCode,
        }));
        isSubmittingRef.current = false;
        dispatch(verifyUser(true));
    };

    const handleSubmit = async(e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        console.log('Submitting ...');

        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!validateEmail(email)) {
            setErrorField((prev) => prev + ' email');
            console.log('Email => ', email);
            setError('Please enter a valid email address.');
            isSubmittingRef.current = false;
            return;
        }

        if (!validatePassword(password)) {
            setErrorField((prev) => prev + ' password');
            console.log('Password is => ', password)
            setError('Password is invalid.');
            isSubmittingRef.current = false;
            return;
        }

        console.log('Processing sign in');
        // sendEmail(formRef.current);

        setError(null);
        setErrorField('');

        // Axios request
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/login`, 
                {
                    email: email,
                    pwd: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('The token is ', response.data.data['access-token']);
            accessTokenRef.current = response.data.data['access-token'];
            dispatch(renewToken({
                token: response.data.data['access-token'],
                expiresIn: 5 * 60 * 1000
            }));
            getUserData();
        } catch(error) {
            setIsSubmitting(false);
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 500) {
            console.error('Error on precessing login:', error);
            setError('Invalid email or password');
            setErrorField('email & password');
            isSubmittingRef.current = false;
            return
            }
        }
        router.push('/user/home');
    }

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
    <div className='flex flex-1 flex-col justify-center flex-1 px-[4%] sm:px-[10%] lg:px-[40px] pt-[32px] '>
        <div>
            <div className='flex flex-col items-center text-center'>
                <h3 className='font-bold mt-2 text-[28px] text-purple-900 leading-12'>Content de vous revoir</h3>
                <h5 className='text-[17px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h5>
            </div>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className='w-full mt-6 space-y-[16px]'>
            <input type="text" name='email' onChange={handleInputChange} className={`${inputStyle} ${errorField.includes('email') ? 'border-2 border-red': ''}`} placeholder='Email' />
            <div className='relative'>
                <input name='password' type={isPwdVisible ? 'text' : 'password'} onChange={handleInputChange} className={`${inputStyle} ${errorField.includes('password') ? 'border-2 border-red': ''}`} placeholder='Mot de passe' />
                { isPwdVisible ?
                    <LuEye onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                    :
                    <LuEyeClosed onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                }
            </div>
            <div>
                {error && <h4 className='text-red font-bold text-center text-sm h-min'>{error}</h4>}
            </div>
            <button type='submit' className={`mt-6 bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full ${isSubmitting ? 'opacity-50' : ''}`}>
                {isSubmitting ? (
                    <>
                        <AsyncSpinner />
                        {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                    </>
                ) : (
                    <h6 className='text-center font-bold'>Connectez vous</h6>
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
        <h4 className='text-center text-[14px] sm:text-[16px] leading-[24px] mt-4'> Vous n&apos;avez pas de compte ? <Link href='/auth/signup' className='text-primary font-bold'>Inscrivez vous</Link></h4>
    </div>
  )
}

export default Signin
