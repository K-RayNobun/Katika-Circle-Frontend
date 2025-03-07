'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {signIn, useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import  { faCheck } from '@fortawesome/free-solid-svg-icons';
import { sendEmail } from '../../utils/emailjs'
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Suspense } from 'react';

// Redux imports;
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createUser } from '@/lib/redux/features/user/userSlice';
import { renewToken } from '@/lib/redux/features/token/tokenSlice';

interface GoogleUser {
    access_token: string;
}

interface Profile {
    id: string;
    email: string;
    name: string;
}

interface CountryData {
    name: string;
    image: string;
    currency: string;
    alpha2: string;
}

interface CountriesList {
    [key: string]: CountryData;
}

const Signup = () => {
    // const {data: session, status} = useSession();
    const router = useRouter();
    const inputStyle = 'appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none'
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [isConfirmPwdVisible, setIsConfirmPwdVisible] = useState(false);
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [errorField, setErrorField] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('cameroon');
    const [countryFlagURL, setCountryFlagURL] = useState('');
    const [countriesList, setCountriesList] = useState<CountriesList>([]);

    const [user, setUser] = useState<GoogleUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    // Redux setup

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);
    const accessToken = useAppSelector((state) => state.token.token);

    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/"})
        } catch (error) {
            console.error('Signin failed:', error);
            alert ("Signin failed, Please try again.")
        }
    };

    const tooglePwdVisibility = () => {
        setIsPwdVisible(prev => !prev);
    };

    const toogleConfirmPwdVisibility = () => {
        setIsConfirmPwdVisible(prev => !prev);
    };
    const validateName = (name:string) => {
        const alphabeticalRegex = /^[A-Za-z]+$/ ;
        return alphabeticalRegex.test(name);
    }

    const validateEmail = (email:string):boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const validatePassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword && password.length >= 6
    }

    const validateCountry = (country: string): boolean => {
        return country.length > 0;
    }

    const sendOTP = async () => {
        console.log('Access Token is: ', accessToken)
        const response = await axios.post('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/otp',
            {},
        {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        console.log('Just sent the token successfully as ', response.data);
    };

    const registerUser = async (e) => {
        e.preventDefault();
        console.log('Registering user');
        const formData = new FormData(formRef.current!);
        const response = await axios.post('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/signin', 
            {
                "fname": formData.get('user_firstname') as string,
                "lname": formData.get('user_name') as string,
                "email": formData.get('user_email')! as string,
                "pwd": formData.get('password') as string,
                "countryCode": formData.get('country') as string,
                "pReferralCode": formData.get('ref_code') as string,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        console.log('User data: ', response.data.data);
        dispatch(renewToken({
            token: response.data.data['access-token'],
            expiresIn: null
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(formRef.current!);
        const name =  formData.get('user_firstname') as string;
        const surname =  formData.get('user_name') as string;
        const email = formData.get('user_email') as string;
        const password = formData.get('password') as string;
        const refcode = formData.get('ref_code') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        if ( name.length < 2 || !validateName(name)){
            setError('Enter a valid name ');
            setErrorField('user_firstname');
            return;
        }
        if ( surname.length < 2 || !validateName(surname)){
            setError('Enter a valid surname');
            setErrorField('user_name');
            return;
        }

        if (!validatePassword(password, confirmPassword)) {
            setError('Password do not match.');
            setErrorField('password_match');
            return;
        }


        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            setErrorField('user_email');
            return;
        }

        if(!validateCountry(selectedCountry)) {
            setError('Please select a country.');
        }

        if (!isBoxChecked) {
            setError('Please accept the terms and conditions.');
            return;
        }

        setError(null);
        console.log('Processing submission');
        // sendEmail(formRef.current);
        registerUser(e);
        sendOTP();

        dispatch(createUser({
            name: name,
            surname: surname,
            email: email,
            pwdhash: password,
            walletId: 1,
            country: selectedCountry,
            countryCodeISO2: countriesList[selectedCountry].alpha2,
            verified: false,
        }));
        setProfile(null);// Temporary disabling error
        // sendEmail(formRef.current!)

        router.push('/pincheck');

        console.log('Finished signup');
    }

    // const login = useGoogleLogin({
    //     onSuccess: (codeResponse) => setUser(codeResponse),
    //     onError: (error) => console.log('Login Failed: ', error)
    // })

    const handleBoxToggle = () => {
        setIsBoxChecked(prev => !prev)
    }

    const handleCountryChange = async() => {
        const country = document.getElementById('country-select') as HTMLSelectElement;
        setSelectedCountry(country!.value);
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images',
            {
                "iso2": countriesList[country!.value].alpha2,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        setCountryFlagURL(response.data.data.flag);
    
    }

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await axios.get('https://api-stg.transak.com/api/v2/countries',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
            console.log('Countries data:', response.data.response[18]);
            setCountriesList(response.data.response);
            setSelectedCountry(response.data.response[0]);
            setCountryFlagURL(response.data.response[0]);
        };
        fetchCountries();
    }, []);

    const logout = () => {
        googleLogout();
        setProfile(null);
    }

  return (
    <Suspense>
        <div className='bg-primary/15 font-bold min-h-screen  py-[100px] flex items-center'>
            <div className='h-full sm:w-[80%] lg:w-[75%] h-[692px] flex rounded-lg sm:rounded-3xl mx-auto bg-white p-3'>
                <div className='w-[35%] hidden lg:block bg-primary rounded-3xl p-6'>
                    {/* <Image src="/logo_white.bmp" width={180} height={20} alt="Logo not loaded" /> */}
                    <Image src={'/logo_white.png'} height={60} width={200} alt='' ></Image>
                    {/* <h6 className='text-[12px] font-semibold text-white'>{'User is: ' + userData.countryCodeISO2}</h6> */}
                </div>
                <div className='flex flex-1 flex-col justify-start flex-1 px-[4%] sm:px-[10%] lg:px-[30px] py-[32px] '>
                    <div className='relative mb-0'>
                        <div className=' absolute top-0 left-0 w-full h-2 bg-gray rounded-full'></div>
                        <div className=' absolute top-0 left-0 w-[2%] h-2 bg-primary rounded-full'></div>
                    </div>
                    <div className='text-end mt-3 text-primary_text text-[14px] mb-4'>
                        0%
                    </div>
                    <div>
                        <div className='flex flex-col items-center text-center'>
                            <h3 className='font-bold mt-2 text-[28px] text-purple-900 leading-12'>Créer un compte</h3>
                            <h5 className='text-[17px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h5>
                        </div>
                    </div>
                    <form ref={formRef} onSubmit={handleSubmit} className='w-full mt-4 space-y-[16px]'>
                        <div className='w-full flex gap-[14px]'>
                            <input type="text"name='user_firstname'  className={`${inputStyle} ${errorField === 'user_firstname' ? 'border-2 border-red': ''}`} placeholder='Nom' />
                            <input type="text" id='user_name' name='user_name' className={`${inputStyle} ${errorField === 'user_name' ? 'border-2 border-red': ''}`} placeholder='Prenom' />
                        </div>
                        <input type="text" id='user_email' name='user_email' className={`${inputStyle} ${errorField === 'user_email' ? 'border-2 border-red': ''}`} style={{ WebkitAppearance:'none', MozAppearance:'textfield'}} placeholder='Email' />
                        <div className='relative'>
                            <input type={isPwdVisible ? 'text' : 'password'} name='password' className={`${inputStyle} ${errorField === 'password_match' ? 'border-2 border-red': ''}`} placeholder='Mot de passe' />
                            <FontAwesomeIcon onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' icon={ isPwdVisible ? faEyeSlash : faEye} />
                        </div>
                        <div className='relative'>
                            <input type={isConfirmPwdVisible ? 'text' : 'password'} name='confirm_password' className={`${inputStyle} ${errorField === 'password_match' ? 'border-2 border-red': ''}`} placeholder='Confirmer le mot de passe' />
                            <FontAwesomeIcon onClick={toogleConfirmPwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' icon={ isConfirmPwdVisible ? faEyeSlash : faEye} />
                        </div>
                        <div className={`w-full flex gap-[14px]`}>
                            <div className={`flex items-center ${inputStyle} rounded-[8px] bg-primary/10 px-[14px] py-[8px] gap-[12px]`}>
                                <img src={countryFlagURL} alt="" className='w-[30px]' />
                                <select id='country-select' name='country' onChange={handleCountryChange} className={`bg-transparent w-[90%] font-bold text-primary_dark`}>
                                    { Object.entries(countriesList).map(([key, countryData], index) => (
                                        <option key={index} value={key} className='w-full text-black bg-white appearance-none' style={{MozAppearance: 'none', WebkitAppearance: 'none'}}>
                                                {countryData.name}
                                        </option>
                                    )) }
                                </select>
                            </div>
                            <input type="text" id='refcode' name='ref_code' className={`${inputStyle} ${errorField === 'ref_code' ? 'border-2 border-red': ''}`} placeholder='Referral Code' />
                        </div>
                        <div className="flex items-start gap-[8px] h-[20px]">
                            {
                                isBoxChecked ?
                                <div onClick={handleBoxToggle} className='relative size-5'>
                                    <input type="checkbox" className='appearance-none rounded-sm size-4 md:size-5 mt-0 border-primary border-2 text-primary before:transform duration-500 ease-in-out' />
                                    <FontAwesomeIcon icon={faCheck} className='absolute text-[14px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-60%] text-primary'/>
                                </div>
                                :
                                <div className=''>
                                    <input onClick={handleBoxToggle} type="checkbox" className='appearance-none rounded-sm size-4 md:size-5 mt-0 border-primary border-2 text-primary before:transform duration-500 ease-in-out' />
                                </div>
                            }
                            <h4 className='text-[12px] leading-4 sm:leading-4 sm:text-[14px] text-gray_dark/60 leading-[24px]'> By clicking this button, you agree to the <a href='https://katika.io/userlicenseagreement' className='text-primary font-bold'>terms and conditions</a> and <a href='https://katika.io/privacypolicy' className='text-primary font-bold'>privacy policy</a></h4>
                        </div>
                        <div>
                            {error && <h4 className='text-red font-bold text-center text-sm h-min'>{error}</h4>}
                        </div>
                        <input type="hidden" id='pin_code' name='pin_code' value={'84762'} />
                        <button type='submit' className={`bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                            <h6 className='text-center font-bold'>Créer un compte</h6>
                        </button>
                        <h4 className="font-bold text-center my-[0px]">
                            Ou
                        </h4>
                        <button onClick={handleGoogleSignIn} className={`bg-white border border-gray_dark/60 flex justify-center gap-[8px] py-[10px] rounded-[8px] w-full`}>
                            {/* <GoogleLogin onSuccess={handleGoogleAuthResponse} onError={handleGoogleAuthError}/> */}
                            <Image src={'/signup/googlelogo.png'} alt='' width={25} height={25} className='size-[25px]'></Image>
                            <h6 className='text-center font-bold'>Continuer avec Google</h6>
                        </button>
                        <h4 className='text-center text-[14px] sm:text-[16px] leading-[24px]'> Vous avez un compte ? <span className='text-primary font-bold'><Link href='/signin' target="_blank">Connectez vous</Link></span></h4>
                    </form>
                </div>
            </div>
        </div>
    </Suspense>
        
  )
}

export default Signup
