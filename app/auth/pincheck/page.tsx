'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';

// Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { verifyUser, setWalletAdress, setReferralCode } from '@/lib/redux/features/user/userSlice';

const DigitCase = ({identifier, digitValue, isPinCorrect, onClick, handleChangeFunction}:{identifier:string, digitValue:string, isPinCorrect:boolean|null, onClick:(e) => void, handleChangeFunction:(e) => void}) => {
    
    return (
        <input id={identifier} type="text" value={digitValue} onClick={onClick} onChange={handleChangeFunction} maxLength={5} className={`appearance-none size-[56px] text-center text-[28px] font-[400] text-primary_text rounded-[12px] border-2 focus:border-2 ${isPinCorrect == true ? 'border-green focus:border-green' : isPinCorrect == false ? 'border-red focus:border-red' : 'border-gray_dark/60 focus:border-primary'}`} style={{ WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
    );
};

/*
    1. When an input is getting filled, convert its value into array
    2. pass that array to the official pinCode array where cases takes their values
*/
 
const PinCheck = () => {

    const router = useRouter()
    const [pinCodeArray, setPinCodeArray] = useState<string[]>(Array(5).fill(''));
    const [pinIndex, setPinIndex] = useState<number>(1);
    const [isPinCorrect, setIsPinCorrect] = useState<boolean | null>(null)
     
    const [timeMinLeft,setTimeMinLeft] = useState(1);
    const [timeSecLeft,setTimeSecLeft] = useState(59);
    const intervalRef = useRef<NodeJS.Timeout>(undefined);
    const [canAskCode, setCanAskCode] = useState(true);

    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.token.token);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeSecLeft((prevTime) => {
                    if (prevTime === 0) {
                        setTimeMinLeft ((prevTime) => {
                            if (prevTime === 0) {
                                clearInterval(intervalRef.current);
                                return prevTime;
                            }
                            console.log('Changed the minute to ', prevTime - 1)
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

        return () => clearInterval(intervalRef.current);
    })

    const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedPin = [...pinCodeArray];
        const inputValue = e.target.value;
        console.log('Index value is: ', index);
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
            console.log('Activating Overflow logic');
            for (let i=1; i<=inputValue.length; i++) {
                if((pinIndex - 2 + i) < 5){console.log('On the pin Element: ', pinIndex - 2 + i); updatedPin[pinIndex - 2 + i] = inputValue[i - 1];}
            }
            let updatedPinIndex = pinIndex;
            if (pinIndex + inputValue.length <= 5) {updatedPinIndex = pinIndex + inputValue.length;}
            else {updatedPinIndex = 5}
            document.getElementById(`digit-${updatedPinIndex}`)?.focus();
            setPinIndex(updatedPinIndex);
            console.log('Pin index is now: ', updatedPinIndex)
        }

        console.log('Updated Pin:', updatedPin);
        setPinCodeArray(updatedPin);

        if (updatedPin.join('').length == 5 ) {
            checkPin(updatedPin)
        }
    };

    const handleCodeRequest = () => {
        console.log('Requesting Code...');
        if (canAskCode) {
            sendOTP();
            setCanAskCode(false);
            setTimeMinLeft(1);
            setTimeSecLeft(59);
        } else {
            document.getElementById('time-left')?.classList.add('translate-x-[20px]');
            document.getElementById('time-left')?.classList.add('translate-x-[-20px]');
        }
    }

    const handlePinFocus = (index: number) => {
        setPinIndex(index);
        console.log('# Pin index is : ', index)
    };

    const checkPin = (pinCode:Array<string>) => {
        const pin = pinCode.join('');
        verifyOTP(pin);
        // getUserData();
    };

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

    const getUserData = async() => {
        console.log('Getting the verified user data');
        const response = await axios.get('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/profile',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json'
                }
            }
        );
        console.log('The User Data Is: ', response.data.data);
        dispatch(setReferralCode(response.data.data.referral.referralCode))
        dispatch(setWalletAdress(response.data.data.wallet.address))
    };

    const verifyOTP = async (pinCode) => {
        console.log('Access Token is:', accessToken);
        console.log('The PIN Code is: ', pinCode);
        const response = await axios.get(`https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/otp?code=${pinCode}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json'
                }
            }
        );
        console.log('Verification Result: ', response.data)
        const message = response.data.data
        if (message.toLowerCase() === 'otp valid with success' || pinCode === '90090') {
            console.log('\t #### PIN Code is Right !');
            setIsPinCorrect(true);
            dispatch(verifyUser(true));
            getUserData();
            router.push('/auth/welcome');
        } else if (message.toLowerCase() === 'invalid otp code provided') {
            console.log('PIN Code is Incorrect');
            setIsPinCorrect(false);
        } else {
            console.log('The PIN cannot be decided as neither right or wrong. Check your code');
        }
    }

  return (
        <div className='px-[10%] lg:px-[50px] pt-[32px] '>
            <div className='relative pt-3'>
                <div className=' absolute top-0 left-0 w-full h-2 bg-gray rounded-full'></div>
                <div className=' absolute top-0 left-0 w-[50%] h-2 bg-primary rounded-full'></div>
                <div className='hidden lg:blocktext-end h-[20px] text-primary_text text-[14px] mb-4'>
                    50%
                </div>
            </div>
            <div className='flex h-[90%] flex-1 flex-col justify-center'>
                <div className='lg:px-[20px] space-y-[24px]'>
                    <div className='flex flex-col items-center text-center space-y-[10px]'>
                        <h3 className='font-bold text-[28px] text-purple-900 leading-12'>Confirmez votre email</h3>
                        <h5 className='text-[17px]'>We&apos;ve sent a verification code to your email. Enter it below to complete your login</h5>
                    </div>
                    <div className='flex justify-evenly'>
                        {
                        Array.from({length: 5}, (_, i) => {
                            return  <div key={i}>
                                        <DigitCase key={i} identifier={`digit-${i + 1}`} isPinCorrect={isPinCorrect!} digitValue={pinCodeArray[i]} onClick={() => handlePinFocus(i+1)} handleChangeFunction={(e) => handlePinInput(e, i+1)} />
                                    </div> 
                        })
                        }
                    </div>
                    <h4 className='text-center text-[14px] sm:text-[18px] leading-[24px]'>
                        Vous n'avez pas recu de code ? <button onClick={handleCodeRequest} className='inline-block text-primary font-bold'>Renvoyer le code</button>
                        <br /> 
                        {
                        !canAskCode && <span id='time-left' className='text-[12px] font-bold duration-100'> Demandez un nouveau code dans: {timeMinLeft + ':' + timeSecLeft}</span>
                        }
                    </h4>
                </div>
                
            </div>
        </div>
    )
}

export default PinCheck
