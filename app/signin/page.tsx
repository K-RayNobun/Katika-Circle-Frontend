'use client'

import React, { useActionState, useRef, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useRouter} from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { renewToken } from '@/lib/redux/features/token/tokenSlice';
import Link from 'next/link';
 
const Signin = () => {

    // const [state, loginAction] = useActionState(login, undefined)

    const inputStyle = 'appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none'
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [errorField, setErrorField] = useState('')

    //Redux related imports
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.token.token)

    const router = useRouter();

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

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!validateEmail(email)) {
            setErrorField('email');
            console.log('Email => ', email);
            setError('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            setErrorField('password');
            console.log('Password is => ', password)
            setError('Password is invalid.');
            return;
        }

        console.log('Processing submission');
        // sendEmail(formRef.current);

        setError(null);

        // Axios request
        try {
            const response = await axiosInstance.post('/auth/account/login', 
                {
                    email: email,
                    pwd: password
                }
            );

            console.log('The token is ', response.data);
            dispatch(renewToken({
                token: response.data.data.token,
                expiresIn: 5 * 60 * 1000
            }))
        } catch(error) {
            console.error('Error on precessing login:', error)
        }
    router.push('/pincheck')
    }

  return (
    <div className='bg-primary/15 min-h-screen  py-[100px] flex items-center'>
        <div className='sm:w-[80%] lg:w-[75%] h-[762px] flex h-[100%] rounded-lg sm:rounded-3xl mx-auto bg-white p-3'>
            <div className='hidden lg:block w-[35%] h-full bg-primary rounded-3xl p-6'>
                {/* <Image src="/logo_white.bmp" width={180} height={20} alt="Logo not loaded" /> */}
                <h3 className='text-white font-bold text-[30px]'>Katika Wallet</h3>
            </div>
            <div className='flex flex-1 flex-col justify-center flex-1 px-[4%] sm:px-[10%] lg:px-[40px] pt-[32px] '>
                <div>
                    <div className='flex flex-col items-center text-center'>
                        <h3 className='font-bold mt-2 text-[28px] text-purple-900 leading-12'>Content de vous revoir</h3>
                        <h5 className='text-[17px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h5>
                    </div>
                </div>
                <form ref={formRef} onSubmit={handleSubmit} className='w-full mt-6 space-y-[16px]'>
                    <input type="text" name='email' className={`${inputStyle} ${errorField === 'email' ? 'border-2 border-red': ''}`} placeholder='Email' />
                    <div className='relative'>
                        <input name='password' type={isPwdVisible ? 'text' : 'password'} className={`${inputStyle} ${errorField === 'password' ? 'border-2 border-red': ''}`} placeholder='Mot de passe' />
                        <FontAwesomeIcon onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' icon={ isPwdVisible ? faEye : faEyeSlash} />
                    </div>
                    <div>
                        {error && <h4 className='text-red font-bold text-center text-sm h-min'>{error}</h4>}
                    </div>
                    <button type='submit' className={`mt-6 bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                        <h6 className='text-center font-bold'>Connectez vous</h6>
                    </button>
                    <h4 className="font-bold text-center leading-[12px]">
                        Ou
                    </h4>
                    <div className={`bg-white border border-gray_dark/60 flex justify-center gap-[8px] py-[10px] rounded-[8px] w-full`}>
                        <Image src={'/signup/googlelogo.png'} alt='' width={25} height={25} className='size-[25px]'></Image>
                        <h6 className='text-center font-bold'>Continuer avec Google</h6>
                    </div>
                </form>
                <h4 className='text-center text-[14px] sm:text-[16px] leading-[24px] mt-4'> Vous n'avez pas de compte ? <Link href='/signup' className='text-primary font-bold'>Inscrivez vous</Link></h4>
            </div>
        </div>
    </div>
  )
}

export default Signin
