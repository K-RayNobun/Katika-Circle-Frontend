'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";

import axios, { AxiosError } from 'axios';
// import { Suspense } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';


// Redux imports;
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createUser, setFirstReferringCode, resetUser } from '@/lib/redux/features/user/userSlice';
import { renewToken, resetToken } from '@/lib/redux/features/token/tokenSlice';
import AsyncSpinner from '@/components/AsyncSpinner';
import { withCookieProtection } from '@/app/CookieProvider';

interface CountryData {
    name: string;
    image: string;
    currency: string;
    alpha2: string;
}

interface ErrorType {
    response: {
        data: {
            message: ''
        }
    }
}

// interface CountriesList {
//     [key: string]: CountryData;
// }

const Signup = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [isConfirmPwdVisible, setIsConfirmPwdVisible] = useState(false);
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [errorField, setErrorField] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<CountryData>({name: 'Germany', image: '', currency: 'EUR', alpha2: 'DE'});
    const [countryFlagURL, setCountryFlagURL] = useState('');
    const [countriesList, setCountriesList] = useState<Array<CountryData>>([]);
    const accessToken = useRef('');
    const [isRefCodeProvided, setIsRefCodeProvided] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false)
    const isRegistratedRef = useRef(false);

    const [formData, setFormData] = useState<{ ref_code: string }>({
        ref_code: '',
    });

    const formRef = useRef<HTMLFormElement>(null);

    // Redux setup

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);

    const tooglePwdVisibility = () => {
        setIsPwdVisible(prev => !prev);
    };

    const toogleConfirmPwdVisibility = () => {
        setIsConfirmPwdVisible(prev => !prev);
    };

    /* -------- HANDLING ERRORS ---------*/

    
    const handleNamesVerification = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (validateName(value)) {
            setError('');
            setErrorField('');
        } else {
            setError(`Enter a valid ${name === 'user_firstname' ? 'name' : 'surname'}`);
            setErrorField(name);
        }
    };
    
    // Add similar handlers for other fields
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (validateEmail(e.target.value) && errorField === 'user_email') {
            setError('');
            setErrorField('');
        }
    };
    
    const handlePasswordChange = () => {
        const formData = new FormData(formRef.current!);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm_password') as string;
        
        if (validatePassword(password, confirmPassword)) {
            setError('');
            setErrorField('');
        }
    };

        /* -------- VALIDATING ERRORS ---------*/


    const validateName = (name:string) => {
        const alphabeticalRegex = /^[A-Za-z ]+$/ ;
        return alphabeticalRegex.test(name);
    }

    const validateEmail = (email:string):boolean => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    }

    const validatePassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword && password.length >= 6
    }

    const validateCountry = (country: string): boolean => {
        return country.length > 0;
    }

    const sendOTP = async () => {
        // console.log('Sending OTP');
        // console.log('Access Token is: ', accessToken.current)
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp`,
            {},
        {
            headers: {
                'Authorization': 'Bearer ' + accessToken.current,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        // console.log('Finished sending OTP with the token', accessToken);
        // console.log('Just sent the token successfully as ', response.data);
    };

    const registerUser = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            // console.log('Registering user');
            const formData = new FormData(formRef.current!);
            let payload;
            if (formData.get('ref_code')?.toString().length === 0) {
                // console.log('NO REFERRAL CODE PRECISED');
                payload = {
                    "fname": formData.get('user_firstname') as string,
                    "lname": formData.get('user_name') as string,
                    "email": formData.get('user_email')! as string,
                    "pwd": formData.get('password') as string,
                    "countryCode": selectedCountry!.name,
                }
            } else {
                payload = {
                    "fname": formData.get('user_firstname') as string,
                    "lname": formData.get('user_name') as string,
                    "email": formData.get('user_email')! as string,
                    "pwd": formData.get('password') as string,
                    "countryCode": selectedCountry!.name,
                    "pReferralCode": formData.get('ref_code') as string,
                }
            }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/signin`, 
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
            
            if (response.data.error) {
                setError(response.data.error.message || 'Registration failed');
                return;
            }

            // console.log('User data: ', response.data.data);
            accessToken.current = (response.data.data['access-token'])
            // console.log('Finished registering user ?', isRegistratedRef.current);
            dispatch(renewToken({
                token: response.data.data['access-token'],
                expiresIn: null
            }));
            dispatch(resetUser());
            sendOTP();
            isRegistratedRef.current = true;
        } catch (err) {
            const axiosError = err as AxiosError;
            const error = err as ErrorType;
            setIsSubmitting(false);
            // Handle error `Referral Does not exit Exist`
            if (axiosError.response?.status === 500 && error.response.data.message.includes('Referral Does not exit Exist')) {
                setError(t('signup.errors.invalidReferralCode'));
                isSubmittingRef.current = false;
            } else if (axiosError.response?.status === 500 && error.response.data.message.toLowerCase().includes('user already exist')) {
                setError(t('signup.errors.userAlreadyExists'));
                isSubmittingRef.current = false;
            } else if (axiosError.response?.status !== 200) {
                setError(t('signup.errors.serverError'));
                isSubmittingRef.current = false;
                // console.error('Registration error:', error);
            }
        }
    } 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        isSubmittingRef.current = true;
        // console.log('Is submitting ? ', isSubmittingRef.current);

        const formData = new FormData(formRef.current!);
        const name =  formData.get('user_firstname') as string;
        const surname =  formData.get('user_name') as string;
        const email = formData.get('user_email') as string;
        const password = formData.get('password') as string;
        // const refcode = formData.get('ref_code') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        if ( name.length < 2 || !validateName(name)){
            setError(t('signup.errors.invalidName'));
            setErrorField('user_firstname');
            setIsSubmitting(false);
            return;
        }
        if ( surname.length < 2 || !validateName(surname)){
            setError(t('signup.errors.invalidSurname'));
            setErrorField('user_name');
            setIsSubmitting(false)
            return;
        }

        if (!validatePassword(password, confirmPassword)) {
            setError(t('signup.errors.passwordMismatch'));
            setErrorField('password_match');
            setIsSubmitting(false)
            return;
        }

        if (!validateEmail(email)) {
            setError(t('signup.errors.invalidEmail'));
            setErrorField('user_email');
            setIsSubmitting(false)
            return;
        }

        if(!validateCountry(selectedCountry!.name)) {
            setError('Please select a country.');
            setIsSubmitting(false);
            return;
        }

        if (!isBoxChecked) {
            setError('Please accept the terms and conditions.');
            setIsSubmitting(false)
            return;
        }

        setError('');
        setErrorField('');
        setIsSubmitting(true);
        registerUser(e);
        console.log('Processing submission');

        if (isRegistratedRef.current ===  isRegistratedRef.current) {
            // console.log('Processing Dispatchs now!');
            dispatch(resetToken());
            dispatch(createUser({
                name: name,
                surname: surname,
                email: email,
                pwdhash: password,
                country: selectedCountry!.name,
                countryCodeISO2: selectedCountry!.alpha2,
                verified: false,
                language: 'fr',
            }));
            router.push('/auth/pincheck');
        }
        console.log('Finished signup');
    }

    // const login = useGoogleLogin({
    //     onSuccess: (codeResponse) => setUser(codeResponse),
    //     onError: (error) => // console.log('Login Failed: ', error)
    // })

    const handleBoxToggle = () => {
        setIsBoxChecked(prev => !prev)
    }

    const handleCountryChange = async() => {
        const selected = document.getElementById('country-select') as HTMLSelectElement;
        const country_index = Number(selected.value)
        // console.log('Selected country index is: ', country_index);
        // 
        setSelectedCountry(countriesList[country_index]);
        // console.log('Selected country index is: ', country_index);
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

    const checkRefCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const refCode = e.target.value;
        const regex = /^KTK\d{5}$/;
        if (regex.test(refCode)) {
            setError('');
            try {
                // console.log('Checking ', refCode);
                await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/referral/parent?code=${refCode}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                // console.log('The referral code verdict is ', response.data.data);
            } catch {
                // console.error('The error => ', error);
                setError('Inexistant referral code');
            }
        } else if( refCode.length === 0 ) {
            setError('');
        } else {
            // console.log(`Ref code is => ${refCode}`)
            setError('Enter a valid Referral Code');
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
            // // console.log('An example country: ', response.data.response[0])
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
            // // console.log('Response Second is: ', responseSecond)
            setCountryFlagURL(responseSecond.data.data.flag);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const ref_code = searchParams.get('ref_code');
        const firstReferringCode = userData.firstReferringCode;
        // console.log('The params got changed !!!');
        if(ref_code) {
            setFormData({
                ref_code: ref_code
            });
            setIsRefCodeProvided(true);
            dispatch(setFirstReferringCode(ref_code))
            // console.log('Now the Ref Code is Readonly');
        } else if (firstReferringCode) {
            // console.log('The user has a predefined referring code known as ', firstReferringCode);
            setFormData({
                ref_code: firstReferringCode
            });
            setIsRefCodeProvided(false);
            // console.log('Referring code set');
        }
        
    }, [searchParams]);

    useEffect(() => {
        const selectElement = document.getElementById('country-select') as HTMLSelectElement;
        if (selectElement) {
            selectElement.selectedIndex = 53;
        }
    }, [countriesList]);

    const inputStyle = 'appearance-none flex-1 w-full h-[44px] border-2 gap-[8px] border-gray_dark/60 py-[10px] px-[14px] rounded-[8px] text-primary_text focus:border-primary focus:border-2 focus:outline-none'

  return (
    <div className='flex flex-col justify-start flex-1 px-[4%] sm:px-[10%] lg:px-[30px] py-[32px] '>
        <div className='relative mb-0'>
            <div className=' absolute top-0 left-0 w-full h-2 bg-gray rounded-full'></div>
            <div className=' absolute top-0 left-0 w-[2%] h-2 bg-primary rounded-full'></div>
        </div>
        <div className='text-end mt-3 text-primary_text text-[14px] mb-4'>
            0%
        </div>
        <div>
            <div className='flex flex-col items-center text-center'>
                <h3 className='font-bold mt-2 text-[28px] text-purple-900 leading-12'>{t('signup.title')}</h3>
                <h5 className='text-[17px]'>{t('signup.subtitle')}</h5>
            </div>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className='w-full mt-4 space-y-[16px]'>
            <div className='w-full flex flex-row-reverse gap-[14px]'>
                <div className='necessary_input w-full'>
                    <input type="text"name='user_firstname' onChange={handleNamesVerification}  className={`${inputStyle} ${errorField === 'user_firstname' ? 'border-2 border-red': ''}`} placeholder={t('signup.firstNamePlaceholder')} />
                </div>
                <div className='necessary_input w-full'>
                    <input type="text" id='user_name' name='user_name' onChange={handleNamesVerification} className={`${inputStyle} ${errorField === 'user_name' ? 'border-2 border-red': ''}`} placeholder={t('signup.lastNamePlaceholder')} />
                </div>
            </div>
            <div className='necessary_input'>
                <input type="text" id='user_email' name='user_email' onChange={handleEmailChange} className={`${inputStyle} ${errorField === 'user_email' ? 'border-2 border-red': ''}`} placeholder={t('signup.emailPlaceholder')} />
            </div>
            <div className='necessary_input'>
                <input type={isPwdVisible ? 'text' : 'password'} onChange={handlePasswordChange} name='password' className={`${inputStyle} ${errorField === 'password_match' ? 'border-2 border-red': ''}`} placeholder={t('signup.passwordPlaceholder')} />
                {isPwdVisible ? <LuEyeClosed onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                : <LuEye onClick={tooglePwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />}
            </div>
            <div className='necessary_input'>
                <input type={isConfirmPwdVisible ? 'text' : 'password'} onChange={handlePasswordChange} name='confirm_password' className={`${inputStyle} ${errorField === 'password_match' ? 'border-2 border-red': ''}`} placeholder={t('signup.confirmPasswordPlaceholder')}/>
                {isConfirmPwdVisible ? <LuEyeClosed onClick={toogleConfirmPwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />
                : <LuEye onClick={toogleConfirmPwdVisibility} className='absolute top-[12px] right-[12px] size-[20px] text-gray_dark/60' />}            </div>
            <div className={`w-full flex gap-[14px]`}>
                <div className={`flex items-center ${inputStyle} rounded-[8px] bg-primary/10 px-[14px] py-[8px] gap-[12px]`}>
                    {countryFlagURL ? (
                        <img src={countryFlagURL} alt="Country flag" className='w-[30px]' />
                    ) : (
                        <div className="w-[30px] h-[20px] bg-gray-200 animate-pulse rounded" />
                    )}
                    <select id='country-select' name='country' defaultValue={53} onChange={handleCountryChange} className={`bg-transparent w-[90%] font-bold text-primary_dark`}>
                        { Object.entries(countriesList).map(([key, countryData], index) => (
                            <option key={index} value={key} className='w-full text-black bg-white appearance-none' >
                                    {countryData.name}
                            </option>
                        )) }
                    </select>
                </div>
                <input type="text" id='refcode' name='ref_code' onChange={checkRefCode} className={`${inputStyle} ${errorField === 'ref_code' ? 'border-2 border-red': ''}`} defaultValue={formData.ref_code} maxLength={8} readOnly={isRefCodeProvided} placeholder='Referral Code' />
            </div>
            <div className="flex necessary_input items-start gap-[8px] mb-[8px]">
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
                <h4 className='text-[12px] bg-gray leading-[16px] sm:leading-[24px] sm:text-[14px] text-gray_dark/60'>
                    By clicking this button, you agree to the{' '}
                    <Link 
                        href="https://katika.io/userlicenseagreement" 
                        className='text-primary font-bold hover:text-primary_dark transition-colors'
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        terms and conditions
                    </Link>
                    {' '}and{' '}
                    <Link 
                        href="https://katika.io/privacypolicy" 
                        className='text-primary font-bold hover:text-primary_dark transition-colors'
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        privacy policy
                    </Link>
                </h4>
            </div>
            <div className={`min-h-[20px]`}>
                {error && <h4 className='text-red font-bold text-center text-sm h-min'>{error}</h4>}
            </div>
            <input type="hidden" id='pin_code' name='pin_code' value={'84762'} />
            <button type='submit' disabled={isSubmitting} className={`bg-primary hover:bg-primary_dark rounded-[8px] py-[10px] text-white w-full ${isSubmitting ? 'opacity-50' : ''}`}>
            {isSubmitting ? (
                <>
                    <AsyncSpinner />
                    {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                </>
            ) : (
                <h6 className='text-center font-bold'>{t('signup.submitButton')}</h6>
            )}
            </button>
            <h4 className='text-center text-[14px] sm:text-[16px] leading-[24px]'>{t('signup.alreadyHaveAccount')}<span className='text-primary font-bold'><Link href='/auth/signin' target="_blank">{t('signup.signinLink')}</Link></span></h4>
        </form>
    </div>
  )
}

export default withCookieProtection(Signup);
