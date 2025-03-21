'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {signIn} from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import axios from 'axios';

// Redux imports;
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createUser, setFirstReferringCode } from '@/lib/redux/features/user/userSlice';
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

const Signup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputStyle = 'appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none'
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [errorField, setErrorField] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<CountryData>();

    const [countryFlagURL, setCountryFlagURL] = useState('');
    const [countriesList, setCountriesList] = useState<Array<CountryData>>([]);
    const accessToken = useRef('');
    const [isRefCodeProvided, setIsRefCodeProvided] = useState(false);

    const [formData, setFormData] = useState<{ ref_code: string }>({
        ref_code: '',
    });

    const formRef = useRef<HTMLFormElement>(null);

    // Redux setup

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);

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

    const validateName = (name:string) => {
        const alphabeticalRegex = /^[A-Za-z ]+$/ ;
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
        console.log('Sending OTP');
        console.log('Access Token is: ', accessToken.current)
        const response = await axios.post('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/otp',
            {},
        {
            headers: {
                'Authorization': 'Bearer ' + accessToken.current,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        console.log('Finished sending OTP with the token', accessToken);
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
                "countryCode": selectedCountry!.name,
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
        accessToken.current = (response.data.data['access-token'])
        console.log('Finished registering user');
        dispatch(renewToken({
            token: response.data.data['access-token'],
            expiresIn: null
        }));
        sendOTP();
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

        if(!validateCountry(selectedCountry!.name)) {
            setError('Please select a country.');
        }

        if (!isBoxChecked) {
            setError('Please accept the terms and conditions.');
            return;
        }

        setError(null);
        setErrorField('');
        console.log('Processing submission');
        registerUser(e);
        console.log('THE COUNTRY CODE OF THE USER IS ', selectedCountry!.name);

        dispatch(createUser({
            name: name,
            surname: surname,
            email: email,
            pwdhash: password,
            country: selectedCountry!.name,
            countryCodeISO2: selectedCountry!.alpha2,
            verified: false,
        }));

        router.push('/auth/pincheck');

        console.log('Finished signup');
    }

    const handleBoxToggle = () => {
        setIsBoxChecked(prev => !prev)
    }

    const handleCountryChange = async() => {
        const selected = document.getElementById('country-select') as HTMLSelectElement;
        const country_index = Number(selected.value)
        console.log('Selected country index is: ', country_index);
        setSelectedCountry(countriesList[country_index]);
        console.log('Selected country index is: ', country_index);
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images',
            {
                "iso2": countriesList[country_index].alpha2,
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

    const checkRefCode = async (e) => {
        const refCode = e.target.value;
        console.log('Checking ', refCode);
        if (refCode.slice(0, 3).includes('KTK')) {
            const response = await axios.get(
                `https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/referral/parent?code=${refCode}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            console.log('The referral code verdict is ', response.data.data)
        } else {
            setError('Invalid Referral Code');
        }
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
            setCountriesList(response.data.response);
            const responseSecond = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images',
                {
                    "iso2": response.data.response[53].alpha2,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
            setCountryFlagURL(responseSecond.data.data.flag);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const ref_code = searchParams.get('ref_code');
        const firstReferringCode = userData.firstReferringCode;
        console.log('Th params got changed !!!');
        if(ref_code) {
            setFormData({
                ref_code: ref_code
            });
            setIsRefCodeProvided(true);
            dispatch(setFirstReferringCode(ref_code))
            console.log('Now the Ref Code is Readonly');
        } else if (firstReferringCode) {
            console.log('The user has a predefined referring code known as ', firstReferringCode);
            setFormData({
                ref_code: firstReferringCode
            });
            setIsRefCodeProvided(false);
            console.log('Referring code set');
        }
        
    }, [searchParams, dispatch, userData.firstReferringCode]);

    useEffect(() => {
        const selectElement = document.getElementById('country-select') as HTMLSelectElement;
        if (selectElement) {
            selectElement.selectedIndex = 53;
        }
    }, [countriesList]);

  return (
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
                {isPwdVisible ? <LuEyeClosed onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                : <LuEye onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />}
            </div>
            <div className='relative'>
                <input type='password' name='confirm_password' className={`${inputStyle} ${errorField === 'password_match' ? 'border-2 border-red': ''}`} placeholder='Confirmer le mot de passe' />
                {isPwdVisible ? <LuEyeClosed onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                : <LuEye onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />}            </div>
            <div className={`w-full flex gap-[14px]`}>
                <div className={`flex items-center ${inputStyle} rounded-[8px] bg-primary/10 px-[14px] py-[8px] gap-[12px]`}>
                    <Image src={countryFlagURL} alt="" width={30} height={30} className='w-[30px]' />
                    <select id='country-select' name='country' defaultValue={53} onChange={handleCountryChange} className={`bg-transparent w-[90%] font-bold text-primary_dark`}>
                        { Object.entries(countriesList).map(([key, countryData], index) => (
                            <option key={index} value={key} className='w-full text-black bg-white appearance-none' style={{MozAppearance: 'none', WebkitAppearance: 'none'}}>
                                    {countryData.name}
                            </option>
                        )) }
                    </select>
                </div>
                <input type="text" id='ref_code' name='ref_code' onChange={checkRefCode} className={`${inputStyle} ${errorField === 'ref_code' ? 'border-2 border-red': ''}`} defaultValue={formData.ref_code} maxLength={7} readOnly={isRefCodeProvided} placeholder='Referral Code' />
            </div>
            <div className="flex items-start gap-[8px] h-[20px]">
                {
                    isBoxChecked ?
                    <div onClick={handleBoxToggle} className='relative size-5'>
                        <input type="checkbox" className='appearance-none rounded-sm size-4 md:size-5 mt-0 border-primary border-2 text-primary before:transform duration-500 ease-in-out' />
                        <FaCheck className='absolute text-[14px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-60%] text-primary'/>
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
                <Image src={'/auth/googlelogo.png'} alt='' width={25} height={25} className='size-[25px]'></Image>
                <h6 className='text-center font-bold'>Continuer avec Google</h6>
            </button>
            <h4 className='text-center text-[14px] sm:text-[16px] leading-[24px]'> Vous avez un compte ? <span className='text-primary font-bold'><Link href='/signin' target="_blank">Connectez vous</Link></span></h4>
        </form>
    </div>
  )
}

export default Signup
