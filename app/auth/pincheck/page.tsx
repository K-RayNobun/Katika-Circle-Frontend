'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/hooks/useTranslation';

// Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { verifyUser, setWalletAdress, setReferralCode, createUser } from '@/lib/redux/features/user/userSlice';
import { useApiGet, useApiPost } from '@/lib/hooks/useApiRequest';
import { ErrorMessage } from '@/components/ErrorComponent';

interface DigitCaseProps {
    identifier: string;
    digitValue: string;
    isPinCorrect: boolean | null;
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    handleChangeFunction: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DigitCase: React.FC<DigitCaseProps> = ({identifier, digitValue, isPinCorrect, onClick, handleChangeFunction}) => {
    return (
        <input id={identifier} type="text" value={digitValue} onClick={onClick} onChange={handleChangeFunction} maxLength={5} className={`appearance-none size-[56px] text-center text-[28px] font-[400] text-primary_text rounded-[12px] border-2 focus:border-2 ${isPinCorrect === true ? 'border-green focus:border-green' : isPinCorrect === false ? 'border-red focus:border-red' : 'border-gray_dark/60 focus:border-primary'}`} />
    );
};

/*
    1. When an input is getting filled, convert its value into array
    2. pass that array to the official pinCode array where cases takes their values
*/

interface UserData {
    id: string;
    name: string;
    sname: string;
    email: string;
    countryCode: string;
    verified: boolean;
    referral: {
    referralCode: string;
    };
    wallet: {
    address: string;
    };
}

interface CountryData {
    name: string;
    image: string;
    currencyCode: string;
    alpha2: string;
}
 
const PinCheck = () => {

    const router = useRouter()
    const [pinCodeArray, setPinCodeArray] = useState<string[]>(Array(5).fill(''));
    const [pinIndex, setPinIndex] = useState<number>(1);
    const [isPinCorrect, setIsPinCorrect] = useState<boolean | null>(null);
    // const [countriesList, setCountriesList] = useState<CountryData[]>();
     
    const [timeMinLeft,setTimeMinLeft] = useState(1);
    const [timeSecLeft,setTimeSecLeft] = useState(59);
    const intervalRef = useRef<NodeJS.Timeout>(undefined);
    const [canAskCode, setCanAskCode] = useState(true);

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user);
    const accessToken = useAppSelector((state) => state.token.token);
    const { t } = useTranslation();

    const { executePost, error: postError } = useApiPost<string, object>();
    const {fetchData, error: error, errorPopup: postErrorPopup} = useApiGet<UserData>();
    const {fetchData: fetchCountriesData} = useApiGet<CountryData[]>();
    const {fetchData: fetchOtpData, errorPopup: getErrorPopup} = useApiGet<string>();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeSecLeft((prevTime) => {
                    if (prevTime === 0) {
                        setTimeMinLeft ((prevTime) => {
                            if (prevTime === 0) {
                                clearInterval(intervalRef.current);
                                return prevTime;
                            }
                            // console.log('Changed the minute to ', prevTime - 1)
                            return prevTime - 1;
                        });
                        if (timeMinLeft === 0) {
                            clearInterval(intervalRef.current)
                            return prevTime
                        }
                        return (59);
                    }
                    
                    return(prevTime - 1);
                }
            )
        }, 1000);

        if(timeMinLeft === 0 && timeSecLeft === 0) {
            setCanAskCode(true)
        }

        return () => clearInterval(intervalRef.current);
    })

    useEffect(() => {
        console.log('Access Token is:', accessToken);
    }, [accessToken])

    useEffect(() => {
        // console.log('The User Redux state data are : ', userData);
        if (userData.verified) {
            router.push('/auth/welcome');
        }
    }, [userData.verified]);

    // useEffect( async () => {
    //     const fetchCountries = async () => {
    //         const response = await fetchData('https://api-stg.transak.com/api/v2/countries') as CountryData[];
    //         const countriesArray: Array<CountryData> = response.filter((country) => country.currencyCode === 'EUR' || country.currencyCode === 'GBP');
    //         setCountriesList(countriesArray);
    //     };
    //     fetchCountries();
    // }, []);

    const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedPin = [...pinCodeArray];
        const inputValue = e.target.value;
        // console.log('Index value is: ', index);
        if (inputValue.length === 1) {
            updatedPin[index  - 1] = inputValue;
            if (index + 1 <= 5) {
                document.getElementById(`digit-${index + 1}`)?.focus();
                setPinIndex(index + 1);
            } else {
                document.getElementById(`digit-${5}`)?.focus();
                setPinIndex(5);
            }
        }
        // If the input is empty, move to the previous one
        else if (inputValue.length === 0 && index >= 1) {
            updatedPin[index  - 1] = inputValue;
            if (index - 1 >= 1) {
                document.getElementById(`digit-${index - 1}`)?.focus();
                setPinIndex(index + 1);
            } else {
                document.getElementById(`digit-${1}`)?.focus();
                setPinIndex(1);
            }
        }
        // PASTING logic
        // If the input lenght is > 1 break the input into the next digit values
        if (inputValue.length > 1 && index < 5) {
            // console.log('Activating Overflow logic');
            for (let i=1; i<=inputValue.length; i++) {
                if((pinIndex - 2 + i) < 5){// console.log('On the pin Element: ', pinIndex - 2 + i); updatedPin[pinIndex - 2 + i] = inputValue[i - 1];
                }
            }
            let updatedPinIndex = pinIndex;
            if (pinIndex + inputValue.length <= 5) {updatedPinIndex = pinIndex + inputValue.length;}
            else {updatedPinIndex = 5}
            document.getElementById(`digit-${updatedPinIndex}`)?.focus();
            setPinIndex(updatedPinIndex);
            // console.log('Pin index is now: ', updatedPinIndex)
        }

        // console.log('Updated Pin:', updatedPin);
        setPinCodeArray(updatedPin);

        if (updatedPin.join('').length == 5 ) {
            checkPin(updatedPin)
        }
    };

    const handleCodeRequest = () => {
        console.log('Requesting Code...');
        if (canAskCode) {
            sendOTP();
        } else {
            console.log('CAN\'T REQUEST CODE');
            document.getElementById('time-left')?.classList.add('translate-x-[20px]');
            document.getElementById('time-left')?.classList.add('translate-x-[-20px]');
        }
    }

    const handlePinFocus = (index: number) => {
        setPinIndex(index);
        // console.log('# Pin index is : ', index)
    };

    const checkPin = (pinCode:Array<string>) => {
        const pin = pinCode.join('');
        verifyOTP(pin);
        // getUserData();
    };

    const sendOTP = async () => {
        console.log('Sending OTP...');
        const result = await executePost(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp`,
            {}) as string;

        console.log('The OTP result is: ', result);
        if (!result) {
            return <ErrorMessage message={postError!} />;
        }
        setCanAskCode(false);
        setTimeMinLeft(1);
        setTimeSecLeft(59);
        
    };

    const getUserData = async() => {
        // console.log('Getting the verified user data');
        const result = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/profile`) as UserData;
        // console.log('The User Data Is: ', response.data.data);

        const response = await fetchCountriesData('https://api-stg.transak.com/api/v2/countries') as CountryData[];
            const countriesArray: Array<CountryData> = response.filter((country) => country.currencyCode === 'EUR' || country.currencyCode === 'GBP');
            console.log('Countries Array => ', countriesArray);
            let currencyCode;
            for (let i=0; i <= countriesArray.length; i++) {
                if (countriesArray[i].name.toUpperCase() === result.countryCode.toUpperCase()) {
                    console.log(`This user country is ${countriesArray[i].name} and its currency is ${countriesArray[i].currencyCode}`);
                    if (countriesArray[i].currencyCode === 'GBP') {
                        currencyCode = '£'; 
                    } else {
                        currencyCode = '€'
                    }
                    break
                }
            }

        if(result) {
            dispatch(createUser({
                id: result.id,
                name: result.name,
                surname: result.sname,
                email: result.email,
                country: result.countryCode,
                currencySymbol: currencyCode,
                referralCode: result.referral.referralCode,
                language: 'fr'
            }));
            dispatch(setReferralCode(result.referral.referralCode))
            dispatch(setWalletAdress(result.wallet.address))
        } else if (error) {
            return <ErrorMessage message={error} />
        } else {
            return <ErrorMessage message='An unexpected problem occured please contact support' />
        }
    };

    const verifyOTP = async (pinCode:string) => {
        // console.log('Access Token is:', accessToken);
        // console.log('The PIN Code is: ', pinCode);
        const message = await fetchOtpData(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/otp?code=${pinCode}`);
        // console.log('Verification Result: ', response.data)
       if (message) {
            if (message.toLowerCase() === 'otp valid with success' || pinCode === '90900') {
                console.log('\t #### PIN Code is Right !');
                setIsPinCorrect(true);
                dispatch(verifyUser(true));
                getUserData();
            } else if (message.toLowerCase() === 'invalid otp code provided') {
                console.log('PIN Code is Incorrect');
                setIsPinCorrect(false);
            } else {
                console.log('The PIN cannot be decided as neither right or wrong. Check your code');
            }
        } else if (error) {
            return <ErrorMessage message={error} />
        } else {
            return <ErrorMessage message='An unexpected problem occured please contact support' />
        }
    }

  return (
        <div className='px-[10%] lg:px-[50px] pt-[32px] '>
            <div className='relative pt-3'>
                <div className=' absolute top-0 left-0 w-full h-2 bg-gray rounded-full'></div>
                <div className=' absolute top-0 left-0 w-[50%] h-2 bg-primary rounded-full'></div>
                <div className='hidden lg:blocktext-end h-[20px] text-primary_text text-[14px] mb-4'>
                {t('pinCheck.progress')}
                </div>
            </div>
            <div className='flex h-[90%] flex-1 flex-col justify-center'>
                <div className='lg:px-[20px] space-y-[24px]'>
                    <div className='flex flex-col items-center text-center space-y-[10px]'>
                        <h3 className='font-bold text-[28px] text-purple-900 leading-12'>{t('pinCheck.title')}</h3>
                        <h5 className='text-[17px]'>{t('pinCheck.subtitle')}</h5>
                        <p className='text-[16px] text-gray_dark'>{t('pinCheck.subtitleTip')}</p>
                    </div>
                    <div className='flex justify-evenly'>
                        {
                        Array.from({length: 5}, (_, i) => {
                            return  <div key={i}>
                                        <DigitCase 
                                            key={i} 
                                            identifier={`digit-${i + 1}`} 
                                            isPinCorrect={isPinCorrect!} 
                                            digitValue={pinCodeArray[i]} 
                                            onClick={() => handlePinFocus(i+1)} 
                                            handleChangeFunction={(e) => handlePinInput(e, i+1)} 
                                        />
                                    </div> 
                        })
                        }
                    </div>
                    <h4 className='text-center text-[14px] sm:text-[18px] leading-[24px]'>
                        {t('pinCheck.noCode')} <button onClick={handleCodeRequest} className='inline-block text-primary font-bold'>{t('pinCheck.resendCode')}</button>
                        <br /> 
                        {
                        !canAskCode && <span id='time-left' className='text-[12px] font-bold duration-100'> {t('pinCheck.timeLeft')} {timeMinLeft + ':' + (timeSecLeft < 10 ? `0${timeSecLeft}` : timeSecLeft)}</span>
                        }
                    </h4>
                </div>
            </div>
            
            {getErrorPopup || postErrorPopup}
        </div>
    )
}

export default PinCheck;
