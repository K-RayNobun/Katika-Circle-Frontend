import { IoMdArrowBack,  } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStepBankData, provideStepMobileData, provideToken } from '@/lib/redux/features/transaction/transactionSlice';

interface screenProps {
    onClose: () => void,
    moveToScreen: (index: number) => void,
}

const ScreenTwo = ({onClose, moveToScreen}: screenProps) => {
    const selectedCountry = 'cameroon';
    const [isFieldWrong, setIsFieldWrong] =  useState(false);
    const [receiverName, setReceiverName] =  useState('');
    const [isTypeMobile, setIsTypeMobile] = useState(true);
    const [isNameChecked, setIsNameChecked] = useState(false);
    const ibanRef = useRef('');
    const formRef = useRef<HTMLFormElement>(null);

    const dispatch = useAppDispatch();
    const tranzakToken = useAppSelector((state) => state.transaction.tranzaktoken)
    const transactionDetails = useAppSelector((state) => state.transaction)
    
    const transfertTypes = ['Mobile Money', 'Compte bancaire']

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
            // console.log('Field value is: ', value);
            if (!field.regex.test(value.trim())) {
                document.getElementsByName(field.name)[0].classList.add('border-red');
                console.log(`!!! Field ${field.name} value: ${value.trim()} doesn't respect regex !!!`);
                isValid = false
            } else if (field.name === 'iban' && field.regex.test(value.replace(/\s/g, '').trim())) {
                // console.log('\t ### Field now is valid: ', field.name);
                document.getElementsByName(field.name)[0].classList.remove('border-red');
                isValid = true
            } else {
                // console.log('\t ### Field is valid: ', field.name);
                document.getElementsByName(field.name)[0].classList.remove('border-red');
                isValid = true;
            }
        });
         
        setIsFieldWrong(!isValid);
        return isValid
    }

    const handleTransfertTypeChange = () => {
        const transfertType = document.getElementById('type-select') as HTMLSelectElement;
        if (transfertType.value === 'Mobile money') {
            setIsTypeMobile(true);
        } else {
            setIsTypeMobile(false);
        }
        console.log('Type is mobile :', isTypeMobile)
    }

    const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let pureInput =  e.target.value;
        console.log('Input field changed')
        
        //Remove any non numeric character
        pureInput = pureInput.replace(/\D/g,'');

        let formattedValue = '';
        const spacing = [4, 9, 14, 25];

        for (let i = 0; i <= pureInput.length - 1; i++ ){
            if (i > 0 && spacing.includes(i)) {
                console.log('Adding a space then at indice \n', i);
                formattedValue += ' ';
            }
            formattedValue += pureInput[i];
        }
        ibanRef.current = formattedValue
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
        // console.log('Redux registered token is:', tranzakToken);
        
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

    // Calll the name check if the phone is pre-filled
    useEffect(() => {
        if (transactionDetails.receiverPhoneNumber) {
            console.log('Checking the name with predefined data');
            handleNameCheck();
        }
    }, []);

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('---------------- 000 -------------------');
        const form = document.getElementById('form-one') as HTMLFormElement
        const formData = new FormData(form);
        if (isTypeMobile && testFieldsRegex() && isNameChecked) {
            dispatch(provideStepMobileData({
                transfertType: isTypeMobile ? 'MobileMoney': 'Bank',
                receiverPhoneNumber: formData.get('receiver-number') as string,
                receiverName: receiverName,
                latestScreen: 2
            }));
            console.log('001');
        } else if ( !isTypeMobile ) {
            console.log('------------------ REGISTERING BANK DATA ------------------');
            dispatch(provideStepBankData({
                transfertType: isTypeMobile ? 'MobileMoney': 'Bank',
                bankAccountOwner: formData.get('owner-name') as string,
                iban: formData.get('iban') as string,
                bankCode: formData.get('code') as string,
                bankName: formData.get('bank-name') as string,
                latestScreen: 2
            }));
            console.log('002');
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
                <h4 className='text-[20px] font-semibold text-primary'>Envoyer de l&apos;argent</h4>
                <button onClick={onClose}><LiaTimesSolid size={24} className='h-[24px]' /></button>
            </div>
        </div>
        <form id='form-one' ref={formRef} onSubmit={handleSubmit} className='grow flex flex-col gap-[12px] pt-[32px]'>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Type de transfert</label>
                <div className='rounded-[8px] px-[14px] py-[10px] border-2 border-gray-400 '>
                    <select id='type-select' defaultValue={transactionDetails.transfertType === 'MobileMoney' ? transfertTypes[0] : transfertTypes[1]} name='country' className='bg-transparent w-full font-semibold' onChange={handleTransfertTypeChange}>
                        { transactionDetails.amountReceived! > 1000000 ? 
                        transfertTypes.map((data, index) => (
                            <option key={index} value={data} className='w-full'>
                                    {data}
                            </option>
                        ))
                        :
                            <option key={1} value={transfertTypes[0]} className='w-full'>
                                    {transfertTypes[0]}
                            </option>
                        }
                    </select>
                </div>
            </div>
            {    
                isTypeMobile ?
                <div className='flex flex-col'>
                    <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Numero du beneficiaire</label>
                    <div className='flex items-center font-semibold w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 gap-[12px]'>
                        <img src={`/countries/${selectedCountry}.png`} alt="Img" className='w-[30px]' />
                        <input type="number" name='receiver-number' placeholder='2376XXXXXXXX' defaultValue={ transactionDetails.receiverPhoneNumber || 2376} onChange={handlePhoneNumberChange} className={`appearance-none grow text-right ${ isFieldWrong ? 'border-red-500':'border-gray-400'}`} style={{WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                    </div>
                    <h4 className='text-[14px]'>{receiverName}</h4>
                </div>
                : 
                <div className='flex flex-col gap-[12px]'>
                    <div>
                        <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Nom du titulaire du compte</label>
                        <input type="text" placeholder='Entrer le nom du beneficiaire' name='owner-name' className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 grow ${ isFieldWrong ? 'border-red-500':'border-gray-400'}`} />
                    </div>
                    <div>
                        <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>IBAN</label>
                        <input type="text" maxLength={31} placeholder='XXXX XXXXX XXXXX XXXXXXXXXXX XX' name='iban' value={ibanRef.current} onChange={handleIbanChange} className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 grow ${ isFieldWrong ? 'border-red-500':'border-gray-400'}`} style={{WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                    </div>
                    <div>
                        <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Code</label>
                        <input type="text" placeholder='XXXXX' name='code' className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 grow ${ isFieldWrong ? 'border-red-500':'border-gray-400'}`} style={{WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                    </div>
                    <div>
                        <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Nom de la banque</label>
                        <input type="text" placeholder='Entrer le nom de la banque' name='bank-name' className={`w-full rounded-[8px] px-[14px] py-[8px] border-2 grow ${ isFieldWrong ? 'border-red-500':'border-gray-400'}`} />
                    </div>
                </div>
            }
            {
                isFieldWrong && <h5 className='text-red-500 text-center font-semibold text-[14px]'>Veuillez remplir correctement les champs</h5>
            }
            
            <button type='submit' className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-semibold '>Continuer</h6>
            </button>
            <div className='grow lg:hidden'></div>
            <button type='submit' className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-semibold '>Continuer</h6>
            </button>
        </form>
        {/* <h5>We&apos;ve sent a verification code to your email. Enter it below to complete your login</h5> */}
    </div>
  )
}

export default ScreenTwo
