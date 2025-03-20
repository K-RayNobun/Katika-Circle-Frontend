import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

//Redux imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStepOneData } from '@/lib/redux/features/transaction/transactionSlice';

interface screenProps {
    onClose: () => void,
    nextScreen: () => void,
}

const ScreenOne = ({onClose, nextScreen}:screenProps) => {
    const [selectedCountry, setSelectedCountry] =  useState('cameroon');
    const selectedCurrency = 'EUR';
    const [officialRate, setOfficialRate] = useState(0);
    const [katikaRate, setKatikaRate] = useState(0);
    const [cashbackPercentage, setCashbackPercentage] = useState(0);
    const [referralGainPercentage, setReferralGainPercentage] = useState(0);
    const [gain, setGain] = useState(0);
    const amountSentRef = useRef<number>(0);
    const amountReceivedRef = useRef<number>(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [modifyingSentAmount, setModifyingSentAmount] = useState(true);
    const formRef  = useRef<HTMLFormElement>(null);
    
    const countriesData: Record<string, { image: string; name: string, currency:string }> = {

        'cameroon': {
            'image': '/countries/cameroon.png',
            'name': 'Cameroun',
            'currency': 'XAF',
        },
        'senegal': {
            'image': '/countries/senegal.png',
            'name': 'Senegal',
            'currency': 'XAF',
        },
        'congo': {
            'image': '/countries/congo.png',
            'name': 'Congo',
            'currency': 'XAF',
        },
    }

    const currenciesData: Record<string, {image:string; name:string; symbol:string}> = {
        EUR: {
            name: 'EUR',
            symbol: '€',
            image: '/currencies/euro.png'
        },
        USD: {
            name: 'USD',
            symbol: '$',
            image: '/currencies/dollar.png'
        }
    }

    const handleCountryChange = () => {
        const country = document.getElementById('country-select') as HTMLSelectElement;
        setSelectedCountry(country!.value)
    }

    const handleSentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        amountSentRef.current = parseInt(e.target.value);
        // console.log('Amount sent:', amountSentRef.current)
        const numericRegex = /^[1-9]\d*$/
        const formData = new FormData(formRef.current!);
        const value = formData.get('amount-sent') as string;

        if (!numericRegex.test(value)) {
            amountSentRef.current = 0;
            console.log('Valeur Envoyee invalide', )
        }
        amountReceivedRef.current = amountSentRef.current * katikaRate;
        console.log('Amount received', amountReceivedRef.current.toLocaleString())
        // console.log(' Are we on EUR ?', modifyingSentAmount);
        setGain((katikaRate - officialRate) * amountSentRef.current)
    }
    
    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        amountReceivedRef.current = parseInt(e.target.value);
        const numericRegex = /^[1-9]\d*$/
        const formData = new FormData(formRef.current!);
        const value = formData.get('amount-sent') as string;

        if (!numericRegex.test(value)) {
            amountSentRef.current = 0;
            console.log('Valeur Recue invalide', )
        }
        amountSentRef.current = amountReceivedRef.current / katikaRate;
        // console.log('Amount sent:', amountSentRef.current)
        // console.log(' Are we on EUR ?', modifyingSentAmount);
        setGain((katikaRate - officialRate) * amountSentRef.current)

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        // const form = document.getElementById('form-one') as HTMLFormElement
        // const formData = new FormData(form);
        const fields = [
            {name: 'amount-sent'},
            {name: 'amount-received'}
           ];
        let isValid = false;
       
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (testFieldsRegex(field.name)) {
                console.log(field.name + ' is fine');
                isValid = true;
            } else {
                console.log(`Field ${field.name} is not correct`);
                isValid = false;
                break; // Now break works properly
            }
        }
        if (isValid) {
            if (verifyFields()) {
                console.log(`'Referral % ${referralGainPercentage} \n Amount Sent is ${amountSentRef.current} \n So Gain is ${referralGainPercentage*amountSentRef.current}`)
                const data = {
                    amountSent: amountSentRef.current,
                    currencySent: currenciesData[selectedCurrency]?.symbol,
                    amountReceived: amountReceivedRef.current,
                    currencyReceived: countriesData[selectedCountry].currency,
                    receiverCountry: selectedCountry,
                    rate: katikaRate,
                    cashback: cashbackPercentage * amountSentRef.current,
                    referralGain: referralGainPercentage * amountSentRef.current,
                    latestScreen: 1,
                }
                dispatch(provideStepOneData(data));
                nextScreen();
            } else {
                console.log('The minimum amount is 20 Euros');
            }
        }

    }

    const testFieldsRegex = (fieldName: string) => {
        const numericDecimalRegex = /^-?\d+(\.\d+)?$/
        let isValid = true;
       
       const formData = new FormData(formRef.current!);

        const value = formData.get(fieldName) as string;
        if (!numericDecimalRegex.test(value.replace(/,/g, ''))) {
            isValid = false;
            console.log('Value is wrong:', value.replace(/,/g, ''));
            document.getElementsByName(fieldName)[0].classList.add('border-red');
        } else {
            document.getElementsByName(fieldName)[0].classList.remove('border-red');
       };

       return isValid;
    }

    const verifyFields = () => {
        const formData = new FormData(formRef.current!);
        let isValid = false;

        const amountSent = parseInt(formData.get('amount-sent') as string);
        const amountReceived = parseInt(formData.get('amount-received') as string);
        if (amountSent < 0 || amountReceived < 0) {
            setErrorMsg("Le montant ne peut etre negatif");
        } else if (amountSent < 19) {
            setErrorMsg("Le montant minimal d'une transaction est de 20 Euros");
        } else {
            isValid = true;
        }
        return isValid
    }

    useEffect(() => {
        let officialRate = 0;
        const fetchActualPrice = async() => {
            try {
                const response = await axios.get("https://api.exchangerate-api.com/v4/latest/"+currenciesData[selectedCurrency].name.toUpperCase());
                console.log(response);
                const currency = countriesData[selectedCountry].currency
                officialRate = response.data.rates[currency]; // Assume XOF is the target currency
                setOfficialRate(officialRate);
                // Example gain calculation
              } catch (error) {
                console.error("Error fetching exchange rate:", error);
              }
        }
        const fetchRate = async () => {
            console.log('Access Token is', accessToken)
            try {
                const response = await axios.get('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/rate/euro',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                );
                setKatikaRate(response.data.data.rate);
                setCashbackPercentage(response.data.data.cashbackRate);
                setReferralGainPercentage(response.data.data.referralGainRate);
            } catch(error) {
                console.log('Sorry, we couldn;t get the rate due to the error ', error)
            }
        }
    
        fetchRate();
        fetchActualPrice();
    }, [selectedCountry])

    const dispatch = useAppDispatch()
    const accessToken = useAppSelector((state) => state.token.token)

  return (
    <div className='w-full h-[90%] lg:h-max lg:w-[502px] rounded-t-[12px] lg:rounded-[12px] p-[44px] gap-[32px] bg-white flex flex-col'>
        <div className='flex w-full justify-between items-center'>
            <h4 className='text-[20px] font-bold text-primary'>Envoyer de l&apos;argent</h4>
            <button onClick={onClose}><FontAwesomeIcon icon={faXmark} className='h-[24px]' /></button>
        </div>
        <form id='form-one' ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-[12px] pt-[20px]'>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Pays de destination</label>
                <div className='flex items-center w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 gap-[12px]'>
                    <img src={`${countriesData[selectedCountry]?.image}`} alt="Img" className='w-[30px]' />
                    <select id='country-select' name='country' onChange={handleCountryChange} className='bg-transparent grow font-bold'>
                        { Object.entries(countriesData).map(([key, data], index) => (
                            <option key={index} value={key} className='w-full'>
                                    {data.name}
                            </option>
                        )) }
                    </select>
                </div>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Vous envoyez</label>
                <div className='flex items-center font-bold w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 gap-[12px]'>
                    <img src={`${currenciesData[selectedCurrency]?.image}`} alt="Img" className='w-[30px]' />
                    {
                    modifyingSentAmount ?

                        <input type="number" onChange={handleSentAmountChange} name='amount-sent' className='grow w-[75%] sm:w-full text-right' style={{ WebkitAppearance: 'none', MozAppearance: 'textfield'}}/>
                    :
                        <input type="text" onClick={() => {setModifyingSentAmount(true)}} readOnly={true} value={amountSentRef.current.toLocaleString('en-US')} name='amount-sent' className='grow w-[75%] sm:w-full text-right' style={{ WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                    }
                    <h5 className=''>{currenciesData[selectedCurrency]?.symbol}</h5>
                </div>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Montant recu</label>
                <div className='flex items-center font-bold w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray_dark gap-[12px]'>
                    <img src={`${countriesData[selectedCountry]?.image}`} alt="Img" className='w-[30px]' />
                    {
                        modifyingSentAmount ?
                        <input onClick={() => {setModifyingSentAmount(false)}} type="text" readOnly={true} value={amountReceivedRef.current.toLocaleString('en-US')} name='amount-received' className='grow w-[75%] sm:w-full text-right' style={{WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                        :
                        <input type="number" name='amount-received' onChange={handleReceivedAmountChange} className='grow w-[75%] sm:w-full text-right' style={{ WebkitAppearance: 'none', MozAppearance: 'textfield'}} />

                    }
                    <h5 className=''>{countriesData[selectedCountry]?.currency}</h5>
                </div>
            </div>
            <h3 className='text-red text-center font-semibold'>{errorMsg}</h3>
            <div className='flex justify-between'>
                <div className='flex items-center gap-[8px]'>
                    <h5>Taux d&apos;envoi</h5>
                    <span className='info-icon'><FontAwesomeIcon icon={faCircleInfo} /></span> 
                </div>
                <div className='space-x-[10px] flex items-center'>
                    <span className='size-[8px] rounded-full bg-[#07E36E]'></span>
                    <h5 className=''>{katikaRate}</h5>
                </div>
            </div>
            <div className='flex justify-between'>
                <h5>Gain</h5>
                <h5>{ gain.toLocaleString('en-US') + ' ' + countriesData[selectedCountry]?.currency }</h5>
            </div>
            <button type='submit' onClick={handleSubmit} className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-bold '>Continuer</h6>
            </button>
        </form>
        <div className='grow lg:hidden'></div>
        <button type='submit' onClick={handleSubmit} className={`lg:hidden block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
            <h6 className='text-center font-bold '>Continuer</h6>
        </button>
    </div>
  )
}

export default ScreenOne
