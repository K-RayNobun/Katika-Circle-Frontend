import { IoMdArrowBack,  } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStepBankData, provideStepMobileData, provideToken } from '@/lib/redux/features/transaction/transactionSlice';
import {useTranslation} from '@/lib/hooks/useTranslation';

interface screenProps {
    onClose: () => void,
    moveToScreen: (index: number) => void,
}

const ScreenTwo = ({onClose, moveToScreen}: screenProps) => {
    const { t } = useTranslation();
    const { translations } = useTranslation();
    const [isFieldWrong, setIsFieldWrong] =  useState(false);
    const [receiverName, setReceiverName] =  useState('');
    const [isTypeMobile, setIsTypeMobile] = useState(true);
    const [isNameChecked, setIsNameChecked] = useState(false);
    const ibanRef = useRef('');
    const formRef = useRef<HTMLFormElement>(null);

    const dispatch = useAppDispatch();
    const tranzakToken = useAppSelector((state) => state.transaction.tranzaktoken)
    const transactionDetails = useAppSelector((state) => state.transaction)
    
    const transfertTypes = [
        `${t('transactionScreens.screenTwo.transferType.options.mobileMoney')}`,  // Keep raw strings to match exactly in comparison
        `${String(translations?.transactionScreens?.screenTwo?.transferType.options.bankAccount)}`,  // Keep raw strings to match exactly in comparison
    ];

    const countriesData = [
        { name: 'Cameroon', code: '+237', imgUrl: '/countries/cameroon.png' },
    ];

    useEffect(() => {
        const createToken = async () => {
            const response = await axios.post('https://dsapi.tranzak.me/auth/token',
                {
                    "appId": `${process.env.NEXT_PUBLIC_TRANZAK_APP_ID}`,
                    "appKey": `${process.env.NEXT_PUBLIC_TRANZAK_APP_KEY}`
                }
            );
            console.log('Created this token:', response.data.data.token);
            dispatch(provideToken(
                response.data.data.token as string
            ))
        };

        createToken();
    }, [])

    const testFieldsRegex = () => {
        const alphabeticalRegex = /^[A-Za-z\s]+$/ ;
        const numericRegex = /^\d/;
        let isValid = true;
        let fields;
        if (!isTypeMobile) {
            fields = [
                {name: 'owner-name', regex: alphabeticalRegex},
                {name: 'iban', regex: numericRegex},
                {name: 'bank-name', regex: alphabeticalRegex},
                {name: 'code', regex: numericRegex}
            ]
        } else {
            fields = [{name: 'receiver-number', regex: /^\+\d+$/}]
        }
        const formData = new FormData(formRef.current!);

        fields.forEach(field => {
            const value = '+' + formData.get(field.name) as string;
            if (!field.regex.test(value.trim())) {
                document.getElementsByName(field.name)[0].classList.add('border-red');
                console.log(`!!! Field ${field.name} value: ${value.trim()} doesn't respect regex !!!`);
                isValid = false
            } else if (field.name === 'iban' && field.regex.test(value.replace(/\s/g, '').trim())) {
                document.getElementsByName(field.name)[0].classList.remove('border-red');
                isValid = true
            } else {
                document.getElementsByName(field.name)[0].classList.remove('border-red');
                isValid = true;
            }
        });
         
        setIsFieldWrong(!isValid);
        return isValid
    }

    const handleTransfertTypeChange = () => {
        const transfertType = document.getElementById('type-select') as HTMLSelectElement;
        setIsTypeMobile(transfertType.value === 'Mobile Money');
        console.log('Transfer type changed to:', transfertType.value, 'isTypeMobile:', transfertType.value === 'Mobile Money');
    }

    const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let pureInput =  e.target.value;
        
        pureInput = pureInput.replace(/\D/g,'');

        let formattedValue = '';
        const spacing = [4, 9, 14, 25];

        for (let i = 0; i <= pureInput.length - 1; i++ ){
            if (i > 0 && spacing.includes(i)) {
                // console.log('Adding a space then at indice \n', i);
                formattedValue += ' ';
            }
            formattedValue += pureInput[i];
        }
        ibanRef.current = formattedValue
        e.target.value = formattedValue;
        console.log('Iban value: ', ibanRef.current)
    }

    const handlePhoneNumberChange = () => {
        const phoneNumber = new FormData(formRef.current!).get('receiver-number') as string;
        setReceiverName('');
        console.log('Resetted the name');
        if(isTypeMobile) {
            if (!testFieldsRegex()) {
                console.log('Phone munbre incorrect please start with 237')
                return;
            }
            else if (phoneNumber?.slice(0, 3) === '237' && phoneNumber.slice(4).length === 8 ) {
                console.log('This is a Cameroonian number: ', phoneNumber?.slice(3));
                handleNameCheck();
            } else {
                console.log('Phone number: ', phoneNumber?.slice(3))
            }
        }
    }

    const handleNameCheck = async () => {
        const formData = new FormData(formRef.current!);
        
        try {
            const response = await axios.post(
            'https://dsapi.tranzak.me/xp021/v1/name-verification/create',
            { accountHolderId: formData.get('receiver-number')},
            {
                headers: {
                Authorization: `Bearer ${tranzakToken}`,
                "Content-Type": "application/json",
                },
            }
            );
            const verifiedName = response.data.data.verifiedName;
            console.log('Response is: ', response.data );
            setReceiverName(verifiedName);
            console.log('Verified Name is :' , verifiedName);
            setIsNameChecked(true);
        } catch (error) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 401) {
                console.log('Error of type 401');
                console.log('The token is no more valid, we need to generate another one');
                const response = await axios.post('https://dsapi.tranzak.me/auth/token',
                    {
                        "appId": `${process.env.NEXT_PUBLIC_TRANZAK_APP_ID}`,
                        "appKey": `${process.env.NEXT_PUBLIC_TRANZAK_APP_KEY}`
                    }
                );
                console.log('Then we get this token:', response.data.data.token);
                dispatch(provideToken(
                    response.data.data.token as string
                ))
                alert('Please try again in 5 seconds');
            }
            console.error("Error fetching recipient name:", error);
            setReceiverName("Utilisateur introuvable");
            setIsNameChecked(false);
        }
    };

    useEffect(() => {
        if (transactionDetails.receiverPhoneNumber) {
            console.log('Checking the name with predefined data');
            handleNameCheck();
        }
    }, []);

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = document.getElementById('form-one') as HTMLFormElement;
        const formData = new FormData(form);

        if (isTypeMobile) {
            if (testFieldsRegex() && isNameChecked) {
                dispatch(provideStepMobileData({
                    transfertType: 'MobileMoney',
                    receiverPhoneNumber: formData.get('receiver-number') as string,
                    receiverName: receiverName,
                    latestScreen: 2
                }));
            }
        } else {
            if (testFieldsRegex()) {
                dispatch(provideStepBankData({
                    transfertType: 'Bank',
                    bankAccountOwner: formData.get('owner-name') as string,
                    iban: formData.get('iban') as string,
                    bankCode: formData.get('code') as string,
                    bankName: formData.get('bank-name') as string,
                    latestScreen: 2
                }));
            }
        }

        if (testFieldsRegex() && (isTypeMobile ? isNameChecked : true)) {
            moveToScreen(1);
        }
    }

  return (
    <div className='flex flex-col w-full lg:w-[502px] h-[90%] rounded-t-[12px] lg:rounded-[12px] p-[44px] pb-[30%] bg-white'>
        <div className="flex items-center gap-[12px] ml-[-12px]">
            <button onClick={() => moveToScreen(-1)} className="p-1 rounded-[50%] active:bg-gray">
                <IoMdArrowBack size={24} className="text-primary_dark" />
            </button>
            <div className='flex w-full justify-between items-center'>
                <h4 className='text-[20px] font-semibold text-primary'>
                    {String(translations?.transactionScreens?.screenTwo?.title)}
                </h4>
                <button onClick={onClose}>
                    <LiaTimesSolid size={24} className='h-[24px]' />
                </button>
            </div>
        </div>
        <form id='form-one' ref={formRef} onSubmit={handleSubmit} className='grow flex flex-col gap-[12px] pt-[32px]'>
            <div className='flex flex-col'>
                <label className='mb-[4px] text-[14px] text-gray_dark/60'>
                    {String(translations?.transactionScreens?.screenTwo?.transferType?.label)}
                </label>
                <div className='rounded-[8px] px-[14px] py-[10px] border-2 border-gray-400 '>
                    <select 
                        id='type-select' 
                        defaultValue={transactionDetails.transfertType === 'MobileMoney' ? 'Mobile Money' : 'Bank Account'} 
                        name='country' 
                        className='bg-transparent w-full font-semibold' 
                        onChange={handleTransfertTypeChange}
                    >
                        { transactionDetails.amountReceived! > 1000000 ? 
                            transfertTypes.map((data, index) => (
                                <option key={index} value={data} className='w-full'>
                                    {data}
                                </option>
                            ))
                            :
                            <option key={0} value='Mobile Money' className='w-full'>
                                {String(translations?.transactionScreens?.screenTwo?.transferType?.options?.mobileMoney)}
                            </option>
                        }
                    </select>
                </div>
            </div>
            {    
                isTypeMobile ?
                <div className='flex flex-col'>
                    <label className='mb-[4px] text-[14px] text-gray_dark/60'>
                        {String(translations?.transactionScreens?.screenTwo?.recipient?.phoneLabel)}
                    </label>
                    <div className='flex items-center gap-[12px]'>
                        <div className="flex items-center gap-[8px] border-2 rounded-[8px] py-[8px] px-[12px]">
                            <img src={`${countriesData[0].imgUrl}`} alt="Img" className='w-[30px]' />
                            <span className='text-[16px] text-gray_dark font-semibold'>{countriesData[0].code}</span>
                        </div>
                       <div className=" font-semibold grow rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 text-end">
                            <input 
                                type="number" 
                                name='receiver-number' 
                                placeholder={String(translations?.transactionScreens?.screenTwo?.recipient?.phonePlaceholder)}
                                defaultValue={ transactionDetails.receiverPhoneNumber || 2376}
                                onChange={handlePhoneNumberChange}
                                className={`appearance-none w-full float-left block text-right ${isFieldWrong ? 'border-red-500':'border-gray-400'}`}
                            />
                       </div>
                    </div>
                    <h4 className='text-[14px]'>{receiverName}</h4>
                </div>
                : 
                <div className='flex flex-col gap-[12px]'>
                    <div>
                        <label className='mb-[4px] text-[14px] text-gray_dark/60'>
                            {String(translations?.transactionScreens?.screenTwo?.bank?.accountHolder?.label)}
                        </label>
                        <input 
                            type="text" 
                            placeholder={String(translations?.transactionScreens?.screenTwo?.bank?.accountHolder?.placeholder)}
                            name='owner-name'
                            className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 grow ${isFieldWrong ? 'border-red-500':'border-gray-400'}`}
                        />
                    </div>
                    <div>
                        <label className='mb-[4px] text-[14px] text-gray_dark/60'>
                            {String(translations?.transactionScreens?.screenTwo?.bank?.iban?.label)}
                        </label>
                        <input 
                            type="text" 
                            maxLength={31} 
                            placeholder={String(translations?.transactionScreens?.screenTwo?.bank?.iban?.placeholder)}
                            name='iban' 
                            onChange={handleIbanChange} 
                            className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 grow ${isFieldWrong ? 'border-red-500':'border-gray-400'}`}
                        />
                    </div>
                    <div>
                        <label className='mb-[4px] text-[14px] text-gray_dark/60'>
                            {String(translations?.transactionScreens?.screenTwo?.bank?.bankName?.label)}
                        </label>
                        <input 
                            type="text" 
                            placeholder={String(translations?.transactionScreens?.screenTwo?.bank?.bankName?.placeholder)}
                            name='bank-name' 
                            className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 grow ${isFieldWrong ? 'border-red-500':'border-gray-400'}`}
                        />
                    </div>
                </div>
            }
            {
                isFieldWrong && (
                    <h5 className='text-red-500 text-center font-semibold text-[14px]'>
                        {String(translations?.transactionScreens?.screenTwo?.errors?.invalidFields)}
                    </h5>
                )
            }
            
            <button type='submit' className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-semibold'>
                    {String(translations?.transactionScreens?.common?.continue)}
                </h6>
            </button>
            <div className='grow lg:hidden'></div>
            <button type='submit' className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-semibold'>
                    {String(translations?.transactionScreens?.common?.continue)}
                </h6>
            </button>
        </form>
    </div>
  )
}

export default ScreenTwo;
