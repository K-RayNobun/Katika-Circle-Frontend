import { IoMdInformationCircle } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';

//Redux imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStepOneData } from '@/lib/redux/features/transaction/transactionSlice';

// 30-50, 50-100, 100-250, 250-500, 500-2000, 2000-70000 
interface screenProps {
    onClose: () => void,
    moveToScreen: (index: number) => void,
}

const ScreenOne = ({onClose, moveToScreen}:screenProps) => {
    const [selectedCountry, setSelectedCountry] =  useState('cameroon');
    const selectedCurrency = 'EUR';
    const [officialRate, setOfficialRate] = useState(0);
    const katikaRateRef = useRef(0);
    const [katikaRates, setKatikaRates] = useState<Array<number>>([])
    const [cashbackPercentage, setCashbackPercentage] = useState(0);
    const [referralGainPercentage, setReferralGainPercentage] = useState(0);
    const [gain, setGain] = useState(0);
    const rateIndex = useRef<number>(0);
    const amountSentRef = useRef<number>(0);
    const amountReceivedRef = useRef<number>(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [modifyingSentAmount, setModifyingSentAmount] = useState(true);
    const formRef  = useRef<HTMLFormElement>(null);

    const minimalAmount = 30;
    const maximalAmount = 70000;
    
    const countriesData: Record<string, { image: string; name: string, currency:string }> = {
        'cameroon': {
            'image': '/countries/cameroon.png',
            'name': 'Cameroun',
            'currency': 'XAF',
        }
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

    const updateRate = async() => {
        if (amountSentRef.current >= 30 && amountSentRef.current < 50) {
            rateIndex.current = 0;
        } else if (amountSentRef.current >= 50 && amountSentRef.current < 100) {
            rateIndex.current = 1;
        } else if (amountSentRef.current >= 100 && amountSentRef.current < 250) {
            rateIndex.current = 2;
        } else if (amountSentRef.current >= 250 && amountSentRef.current < 500) {
            rateIndex.current = 3;
        } else if (amountSentRef.current >= 500 && amountSentRef.current < 2000) {
            rateIndex.current = 4;
        } else if (amountSentRef.current >= 2000 && amountSentRef.current <= 70000) {
            rateIndex.current = 5;
        }
        console.log('Rates index is', rateIndex.current);
        console.log('Updated the rate to ', katikaRates[rateIndex.current]);
        katikaRateRef.current = katikaRates[rateIndex.current];
    }
    const fetchRate = async () => {
        // console.log('Access Token is', accessToken);
        console.log('Calculating the rate');
        try {
            // Rate from €/XAF
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/rate/xaf`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
            const ratesData = response.data.data.toCurrency[0].rates;
            console.log('Rates Data is', ratesData);
            const ratesArray = [ratesData.firstRate, ratesData.secondRate, ratesData.thirdRate, ratesData.fourthRate, ratesData.fifthRate, ratesData.sixthRate]            
            setKatikaRates(ratesArray);
            console.log('Set the rates as ', ratesArray);
            setCashbackPercentage(response.data.data.toCurrency[0].cashbackRate);
            console.log('Cashback Rate is', response.data.data.toCurrency[0].cashbackRate);
            setReferralGainPercentage(response.data.data.toCurrency[0].referralGainRate);
            console.log('Referral Gain Rate Rate is', response.data.data.toCurrency[0].referralGainRate);
            katikaRateRef.current = ratesArray[0];
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log('Sorry, we couldn;t get the rate due to the error ', axiosError)
            if(axiosError.message === 'Network Error') {
                setErrorMsg('Network error');
            }
        }
    }

    const fetchActualPrice = async() => {
        try {
            const response = await axios.get("https://api.exchangerate-api.com/v4/latest/"+currenciesData[selectedCurrency].name.toUpperCase());
            console.log(response);
            const currency = countriesData[selectedCountry].currency
            setOfficialRate(response.data.rates[currency]);
          } catch (error) {
            console.error("Error fetching exchange rate:", error);
          }
    }

    const handleCountryChange = () => {
        const country = document.getElementById('country-select') as HTMLSelectElement;
        setSelectedCountry(country!.value)
    }

    const handleSentAmountChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Resetting the amount received');
        amountSentRef.current = parseInt(e.target.value);
        updateRate();

        // console.log('Amount sent:', amountSentRef.current)
        const numericRegex = /^[1-9]\d*$/
        const formData = new FormData(formRef.current!);
        const value = formData.get('amount-sent') as string;

        if (!numericRegex.test(value)) {
            amountSentRef.current = 0;
            console.log('Valeur Envoyee invalide', )
        }
        amountReceivedRef.current = amountSentRef.current * katikaRateRef.current;
        console.log('Amount received', amountReceivedRef.current.toLocaleString())
        // console.log(' Are we on EUR ?', modifyingSentAmount);
        setGain((katikaRateRef.current - officialRate) * amountSentRef.current)
    }
    
    const handleReceivedAmountChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        amountReceivedRef.current = parseInt(e.target.value);
        const numericRegex = /^[1-9]\d*$/
        const formData = new FormData(formRef.current!);
        const value = formData.get('amount-sent') as string;

        if (!numericRegex.test(value)) {
            amountSentRef.current = 0;
            console.log('Valeur Recue invalide', )
        }
        amountSentRef.current = amountReceivedRef.current / katikaRateRef.current;
        // console.log('Amount sent:', amountSentRef.current)
        // console.log(' Are we on EUR ?', modifyingSentAmount);
        setGain((katikaRateRef.current - officialRate) * amountSentRef.current)

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(errorMsg === 'Network error') {
            return;
        }
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
                const cashback =  cashbackPercentage * amountSentRef.current;
                const referralGain = referralGainPercentage * amountSentRef.current
                const data = {
                    amountSent: amountSentRef.current,
                    currencySent: currenciesData[selectedCurrency]?.symbol,
                    amountReceived: amountReceivedRef.current,
                    currencyReceived: countriesData[selectedCountry].currency,
                    receiverCountry: selectedCountry,
                    transactionRate: katikaRateRef.current,
                    cashback: cashback,
                    referralGain: referralGain,
                    latestScreen: 1,
                }
                dispatch(provideStepOneData(data));
                moveToScreen(1);
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
        } else if (amountSent < 30) {
            setErrorMsg(`Le montant minimal d'une transaction est de ${minimalAmount} Euros`);
        } else if (amountSent > 70000) {
            setErrorMsg(`Le montant maximal d'une transaction est de ${maximalAmount.toLocaleString('en-US')} Euros`);
        } else {
            isValid = true;
        }
        return isValid
    }

    useEffect(() => {
        fetchActualPrice();
        fetchRate()
    }, [])


    const dispatch = useAppDispatch()
    const accessToken = useAppSelector((state) => state.token.token);
    const transactionDetails = useAppSelector((state) => state.transaction)

  return (
    <div className='w-full h-[90%] pb-[86px] lg:h-max lg:w-[502px] rounded-t-[12px] lg:rounded-[12px] p-[44px] gap-[32px] bg-white flex flex-col'>
        <div className="flex items-center gap-[12px]">
            <div className='flex w-full justify-between items-center'>
                <h4 className='text-[20px] font-bold text-primary'>Envoyer de l&apos;argent</h4>
                <button onClick={onClose}><LiaTimesSolid size={24} className='h-[24px]' /></button>
            </div>
        </div>
        <form id='form-one' ref={formRef} onSubmit={handleSubmit} className='flex grow flex-col gap-[12px] pt-[20px]'>
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

                        <input type="number" defaultValue={transactionDetails.amountSent} onChange={handleSentAmountChange} name='amount-sent' className='grow w-[75%] sm:w-full text-right' style={{ WebkitAppearance: 'none', MozAppearance: 'textfield'}}/>
                    :
                        <input type="text" defaultValue={transactionDetails.amountReceived} onClick={() => {setModifyingSentAmount(true)}} readOnly={true} value={amountSentRef.current.toLocaleString('en-US')} name='amount-sent' className='grow w-[75%] sm:w-full text-right' style={{ WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                    }
                    <h5 className=''>{currenciesData[selectedCurrency]?.symbol}</h5>
                </div>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>Montant recu</label>
                <div className={`flex items-center font-bold w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray_dark gap-[12px]`}>
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
                    <span className='info-icon font-semibold'><IoMdInformationCircle /></span> 
                </div>
                <div className='space-x-[10px] flex items-center'>
                    <span className='size-[8px] rounded-full bg-[#07E36E]'></span>
                    <h5 className=''>{katikaRateRef.current}</h5>
                </div>
            </div>
            <div className='flex justify-between'>
                <h5>Gain</h5>
                <h5>{ gain.toLocaleString('en-US') + ' ' + countriesData[selectedCountry]?.currency }</h5>
            </div>
            <button type='submit' onClick={handleSubmit} className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-bold '>Continuer</h6>
            </button>
            <div className='grow lg:hidden'></div>
            <button type='submit' onClick={handleSubmit} className={`lg:hidden block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-bold '>Continuer</h6>
            </button>
        </form>
        
    </div>
  )
}

export default ScreenOne
