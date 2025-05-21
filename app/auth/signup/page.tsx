'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";

import { AxiosError } from 'axios';
import { useApiGet, useApiPost } from '@/lib/hooks/useApiRequest';
// import { Suspense } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';


// Redux imports;
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createUser, setDefaultReferringCode, resetUser } from '@/lib/redux/features/user/userSlice';
import { renewToken } from '@/lib/redux/features/token/tokenSlice';
import AsyncSpinner from '@/components/AsyncSpinner';
import { withCookieProtection } from '@/app/CookieProvider';

import JsonRes from '../../../public/countries/transakCountriesList.json';

interface CountryData {
    name: string;
    image?: string;
    currencyCode: string;
    alpha2: string;
}

// interface ErrorType {
//     response: {
//         data: {
//             message: ''
//         }
//     }
// }

// interface CountriesList {
//     [key: string]: CountryData;
// }

type SignUpResponse = {
    "access-token": string
}

type signupPayload = {
    'fname': string,
    'lname': string,
    'phone': string,
    'email': string,
    'pwd': string,
    'countryCode': string,
    'pReferralCode'?: string,
}

const Signup = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [isConfirmPwdVisible, setIsConfirmPwdVisible] = useState(false);
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [errorField, setErrorField] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<CountryData>({name: 'France', image: '', currencyCode: 'EUR', alpha2: 'FR'});
    const [countryFlagURL, setCountryFlagURL] = useState('');
    const [countriesList, setCountriesList] = useState<Array<CountryData>>([]);
    const [isRefCodeProvided, setIsRefCodeProvided] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false)
    const isRegistratedRef = useRef(false);

    const [urlFormData, setUrlFormData] = useState<{ ref_code: string }>({
        ref_code: '',
    });

    const formRef = useRef<HTMLFormElement>(null);

    // Api request hooks
    const {executePost, error: postError} = useApiPost<SignUpResponse | null, signupPayload | object >();
    const {fetchData: fetchReferralError, errorPopup: getErrorPopup} = useApiGet<string>();

    // Redux setup

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);
    const accessToken = useAppSelector((state) => state.token.token);

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
        
        if (validatePassword(password) && validateConfirmPassword(password, confirmPassword)) {
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

    const validatePassword = (password: string): boolean => {
        return password.length >= 6
    }

    const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
        return  password === confirmPassword;
    }

    const validateCountry = (country: string): boolean => {
        return country.length > 0;
    }

    const sendOTP = async () => {
        console.log('Sending OTP');
        await executePost(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp`, {});
        // Token isn't yet updated in the Redux state
        console.log('Finished sending OTP with the token', accessToken );
        // console.log('Just sent the token successfully as ', response.data);
    };

    const registerUser = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            // console.log('Registering user');
            const formData = new FormData(formRef.current!);
            // console.log('Referral Code is:','---', formData.get('ref_code')?.toString().trim(),'---');
            const payload = {
                    "fname": formData.get('user_firstname') as string,
                    "lname": formData.get('user_name') as string,
                    "phone": formData.get('phone_number') as string,
                    "email": formData.get('user_email')! as string,
                    "pwd": formData.get('password') as string,
                    "countryCode": selectedCountry!.name,
                    ...(formData.get('ref_code')?.toString().length !== 0 && {"pReferralCode": formData.get('ref_code')?.toString().trim() as string}),
                };
           
            // 1. Get the registration response
            const response = await executePost(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/signin`,
                payload,
                false
            );
            console.log('The response is fine, this is it: ', response);

            if (response.message && response.data.toLowerCase().includes('user already exist')) {
                setError(t('signup.errors.userAlreadyExists'));
                isSubmittingRef.current = false;
                setIsSubmitting(false);
                return;
            }

            if (response) {
                const token = response['access-token'];

                // await dispatch(resetUser());

                 // 2. Update Redux state and wait for it
                await dispatch(renewToken({ token }));
                
                // 3. Small delay to ensure Redux state is updated
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 4. Send OTP with updated token
                await sendOTP();

                // 5. Update other state
                isRegistratedRef.current = true;
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            setIsSubmitting(false);
            console.log('The response was unexpected. We fall into Catch block.');
            // Handle error `Referral Does not exit Exist`
            if (axiosError.response?.status === 500 && postError!.includes('Referral Does not exit Exist')) {
                setError(t('signup.errors.invalidReferralCode'));
                isSubmittingRef.current = false;
            } else if (axiosError.response?.status === 500 && postError!.toLowerCase().includes('user already exist')) {
                console.log('Axios error: ', axiosError.response);
                setError(t('signup.errors.userAlreadyExists'));
                isSubmittingRef.current = false;
            } else if (axiosError.response?.status !== 200) {
                setError(t('signup.errors.serverError'));
                isSubmittingRef.current = false;
                console.error('Registration :', axiosError.response);
            }
        }
    } 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        isSubmittingRef.current = true;
        // console.log('Is submitting ? ', isSubmittingRef.current);

        const formData = new FormData(formRef.current!);
        const name =  formData.get('user_firstname') as string;
        const surname =  formData.get('user_name') as string;
        const email = (formData.get('user_email') as string).toLowerCase();
        const phone = formData.get('phone_number') as string;
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

        if (!validatePassword(password)) {
            setError(t('signup.errors.shortPassword'));
            setErrorField('password');
            setIsSubmitting(false)
            return;
        }

        if(!validateConfirmPassword(password, confirmPassword)) {
            setError(t('signup.errors.passwordMismatch'));
            setErrorField('password_match');
            setIsSubmitting(false);
            return;
        }

        if (!validateEmail(email)) {
            setError(t('signup.errors.invalidEmail'));
            setErrorField('user_email');
            setIsSubmitting(false)
            return;
        }

        if (phone.length < 4) {
            setError(t('signup.errors.invalidPhone'));
            setErrorField('phone_number');
            setIsSubmitting(false);
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
        await registerUser(e);
        console.log('Processing submission');

        if (isRegistratedRef.current) {
            // console.log('Processing Dispatchs now!');
            await dispatch(resetUser());
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
        } else {
            console.log('The user is not registered on the server yet.');
        }
        console.log('Finished signup of user', userData.email);
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
        console.log('The currency of this country is: ', countriesList[country_index].currencyCode);
        const response = await executePost('https://countriesnow.space/api/v0.1/countries/flag/images',
            {
                "iso2": countriesList[country_index].alpha2,
            }
        );
        console.log('Parameters is: ', countriesList[country_index].alpha2);
        console.log('Flag Response is: ', response);
        setCountryFlagURL(response.flag);
    }

    const checkRefCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const refCode = e.target.value;
        const regex = /^KTK\d{5}$/;

        setError('');

        if (refCode.length === 0) {
            return;
        }

        if (!regex.test(refCode)) {
        setError('Enter a valid Referral Code');
        return;
    }
            
        try {
            const response = await fetchReferralError(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/referral/parent?code=${refCode}`, false);
            console.log('Response', response);
            if (response?.toLowerCase().trim() === 'inexistant referral code') {
                console.log('No response, GET Error: ', response);
                setError(response);
            }
        } catch {
            // console.error('The error => ', error);
            // setError('Inexistant referral code');
        }
    }

    useEffect(() => {
        const fetchCountries = async () => {
            let response = [] as CountryData[] | null;
            response = JsonRes["response"] as CountryData[];
            console.log('Countries fetched from API: ', response);
            const countriesArray: Array<CountryData> = response.filter((country) => country.currencyCode === 'EUR' || country.currencyCode === 'GBP');
            setCountriesList(countriesArray);
            // console.log('An example country: ', response.data.response[0])
            const responseSecond = await executePost('https://countriesnow.space/api/v0.1/countries/flag/images',
                {
                    "iso2": response[53].alpha2,
                }
            );
            // // console.log('Response Second is: ', responseSecond)
            setCountryFlagURL(responseSecond.flag);
        };
        fetchCountries();
    }, []);


    useEffect(() => {
        const ref_code = searchParams.get('ref_code');
        const firstReferringCode = userData.firstReferringCode;
        // console.log('The params got changed !!!');
        if(ref_code && !firstReferringCode) {
            setUrlFormData({
                ref_code: ref_code
            });
            setIsRefCodeProvided(true);
            dispatch(setDefaultReferringCode(ref_code))
            // console.log('Now the Ref Code is Readonly');
        } else if (firstReferringCode) {
            // console.log('The user has a predefined referring code known as ', firstReferringCode);
            setUrlFormData({
                ref_code: firstReferringCode
            });
            setIsRefCodeProvided(false);
            // console.log('Referring code set');
        }
        
    }, [searchParams]);

    useEffect(() => {
        const selectElement = document.getElementById('country-select') as HTMLSelectElement;
        if (selectElement) {
            selectElement.selectedIndex = 10;
            console.log('Selected country index is: ', selectElement.selectedIndex);
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
            <div className='w-full flex flex-row gap-[14px] bg-gray'>
                <div className='necessary_input grow'>
                    <input type="text" id='user_email' name='user_email' onChange={handleEmailChange} className={`${inputStyle} ${errorField === 'user_email' ? 'border-2 border-red': ''}`} placeholder={t('signup.emailPlaceholder')} />
                </div>
                <div className='necessary_input w-[35%]'>
                    <input type="number" id='phone_number' name='phone_number' 
                    onKeyDown={(e) => {
                        // Prevent input of unwanted characters
                        if (!/[\d.]/.test(e.key) && 
                            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    className={`${inputStyle} ${errorField === 'phone_number' ? 'border-2 border-red': ''}`} placeholder={t('signup.phonePlaceholder')} />
                </div>
            </div>
            <div className='necessary_input'>
                <input type={isPwdVisible ? 'text' : 'password'} onChange={handlePasswordChange} name='password' className={`${inputStyle} ${errorField === 'password_match' || errorField === 'password' ? 'border-2 border-red': ''}`} placeholder={t('signup.passwordPlaceholder')} />
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
                    {<select id='country-select' name='country' defaultValue={10} onChange={handleCountryChange} className={`bg-transparent w-[90%] font-bold text-primary_dark`}>
                        { Object.entries(countriesList).map(([key, countryData], index) => (
                            <option key={index} value={key} className='w-full text-black bg-white appearance-none' >
                                    {countryData.name}
                            </option>
                        )) }
                    </select>}
                </div>
                {
                    userData.firstReferringCode ?
                    <input type="text" id='refcode' name='ref_code' onChange={checkRefCode} className={`${inputStyle} ${errorField === 'ref_code' ? 'border-2 border-red': ''}`} value={urlFormData.ref_code} maxLength={8} readOnly={isRefCodeProvided} placeholder='Referral Code' />
                    :
                    <input type="text" id='refcode' name='ref_code' onChange={checkRefCode} className={`${inputStyle} ${errorField === 'ref_code' ? 'border-2 border-red': ''}`} defaultValue={urlFormData.ref_code} maxLength={8} placeholder='Referral Code' />
                }
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
        {getErrorPopup}
    </div>
  )
}

export default withCookieProtection(Signup);
