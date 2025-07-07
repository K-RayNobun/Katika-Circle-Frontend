import { IoMdInformationCircle } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';

//Redux imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStepOneData } from '@/lib/redux/features/transaction/transactionSlice';
import { useTranslation } from '@/lib/hooks/useTranslation';

// 30-50, 50-100, 100-250, 250-500, 500-2000, 2000-70000 
interface screenProps {
    onClose: () => void,
    moveToScreen: (index: number) => void,
}

const ScreenOne = ({onClose, moveToScreen}:screenProps) => {
    const { t } = useTranslation();
    // const [selectedCurrency, setSelectedCurrency] = useState('€')
    const [selectedCountry, setSelectedCountry] =  useState('cameroon');
    const [officialRate, setOfficialRate] = useState(0);
    const [katikaRate, setKatikaRate] = useState<number>(0);
    const [katikaRates, setKatikaRates] = useState<Array<number>>([])

    const [cashbackPercentage, setCashbackPercentage] = useState(0);
    const [referralGainPercentage, setReferralGainPercentage] = useState(0);
    const [gain, setGain] = useState<string>('');
    const [rateIndex, setRateIndex] = useState<number>(0);
    const [amountSent, setAmountSent] = useState<number>(0);
    const [amountSentFormatted, setAmountSentFormatted] = useState<string>('');
    const [amountReceived, setAmountReceived] = useState<number>(0);
    const [amountReceivedFormatted, setAmountReceivedFormatted] = useState<string>('');
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

    const userData = useAppSelector((state) => state.user);

    useEffect(() => {
        // Create the content string using translation
        const rawContent = t('translations.transactionScreens.screenOne.form.rate.tooltip');
        const content = rawContent
            .replace('{0}', String(katikaRates[0]))
            .replace('{1}',  String(katikaRates[1]))
            .replace('{2}',  String(katikaRates[2]))
            .replace('{3}',  String(katikaRates[3]))
            .replace('{4}',  String(katikaRates[4]))
            .replace('{5}',  String(katikaRates[5]));

        document.documentElement.style.setProperty('--info-content', `'${content}'`);
    }, [katikaRates, t]);

    useEffect(() => {
        console.log('The user country is ', userData.country);
    }, [])

    const currenciesData: Record<string, {image:string; name:string; symbol:string}> = {
        '€': {
            name: 'EUR',
            symbol: '€',
            image: '/currencies/euro.png'
        },
        '£': {
            name: 'GBP',
            symbol: '£',
            image: '/currencies/sterling.svg'
        }
    }
    const updateRate = (amount: number) => {
        // console.log('The amount considered is ', amountSent);
        let rateIndexVar = rateIndex;
        if (amount >= 30 && amount < 50) {
            rateIndexVar = 0;
        } else if (amount >= 50 && amount < 100) {
            rateIndexVar = 1;
        } else if (amount >= 100 && amount < 250) {
            rateIndexVar = 2;
        } else if (amount >= 250 && amount < 500) {
            rateIndexVar = 3;
        } else if (amount >= 500 && amount < 2000) {
            rateIndexVar = 4;
        } else if (amount >= 2000 && amount <= 70000) {
            rateIndexVar = 5;
        }
        // console.log('Rates index is', rateIndex.current);
        // console.log('Updated the rate to ', katikaRates[rateIndex.current]);
        setRateIndex(rateIndexVar);
        setKatikaRate(katikaRates[rateIndexVar]);
    }
    const fetchRate = async () => {
        // // console.log('Access Token is', accessToken);
        // console.log('Calculating the rate');
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
            let responseData;
            if (userData.currencySymbol === '£') {
                responseData = response.data.data.toCurrency[1];
                console.log(`The rate of ${userData.currencySymbol} is `, responseData);
            } else if (userData.currencySymbol === '€') {
                responseData = response.data.data.toCurrency[0]
            } else {
                responseData = response.data.data.toCurrency[0];
                console.log('The selected currency is ', userData.currencySymbol);
            }
            const ratesData = responseData.rates;
            const ratesArray = [ratesData.firstRate, ratesData.secondRate, ratesData.thirdRate, ratesData.fourthRate, ratesData.fifthRate, ratesData.sixthRate]            
            setKatikaRates(ratesArray);
            setCashbackPercentage(responseData.cashbackRate);
            setReferralGainPercentage(responseData.referralGainRate);
            setKatikaRate(ratesArray[0]);
        } catch(error) {
            const axiosError = error as AxiosError;
            // console.log('Sorry, we couldn;t get the rate due to the error ', axiosError)
            if(axiosError.message === 'Network Error') {
                setErrorMsg('Network error');
            }
        }
    }

    const fetchActualPrice = async() => {
        try {
            const response = await axios.get("https://api.exchangerate-api.com/v4/latest/"+currenciesData[userData.currencySymbol || '€'].name.toUpperCase());
            // console.log(response);
            const currency = countriesData[selectedCountry].currency
            setOfficialRate(response.data.rates[currency]);
          } catch {
            // console.error("Error fetching exchange rate:", error);
          }
    }

    const handleCountryChange = () => {
        const country = document.getElementById('country-select') as HTMLSelectElement;
        setSelectedCountry(country!.value)
    }

    const handleSentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log('Resetting the amount received');

        const value = e.target.value.replace(/,/g, '');
        const numericRegex = /^\d*\.?\d*$/;  // Allow decimals and numbers

        const newAmountSent = parseFloat(e.target.value.replace(/,/g, '')) || 0;

        if (numericRegex.test(value)) {
            setAmountSent(newAmountSent);
        } else {
            setAmountSent(0);
            // console.log('Invalid sent amount');
        }
        updateRate(newAmountSent);

        setAmountReceived(newAmountSent * katikaRate);
        setGain(formatAmount((katikaRate - officialRate) * newAmountSent));
        console.log('The amount sent is', newAmountSent.toLocaleString('en-US'), ' and the rate difference is ', (katikaRate - officialRate).toLocaleString('en-US'));
        console.log('The Gain is ', ((katikaRate - officialRate) * newAmountSent).toLocaleString('en-US'));

        try {
            setAmountSentFormatted(formatAmount(newAmountSent));
            if (newAmountSent === 0) {
                setAmountSentFormatted('');
            }
            setAmountReceivedFormatted(formatAmount(amountReceived));
            if (amountReceived === 0) {
                setAmountReceivedFormatted('');
            }
        }
        catch (error) {
            console.error('Error formatting amount sent:', error);
            setAmountSentFormatted('0');
        }
        console.log('The amount Received is', amountReceivedFormatted, ' and the amount sent is ', amountSentFormatted);
    }
    
    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmountReceived = parseFloat(e.target.value.replace(/,/g, '')) || 0;
        console.log('The new amount received is ', newAmountReceived);
        setAmountReceived(newAmountReceived);
        const numericRegex = /^[1-9]\d*$/
        const formData = new FormData(formRef.current!);
        const value = formData.get('amount-sent') as string;

        if (!numericRegex.test(value)) {
            setAmountSent(0);
            // console.log('Valeur Recue invalide', )
        }
        const newAmountSent = newAmountReceived / katikaRate;
        setAmountSent(newAmountSent);
        updateRate(newAmountSent);
        // // console.log('Amount sent:', amountSent)
        // // console.log(' Are we on EUR ?', modifyingSentAmount);
        setGain(formatAmount((katikaRate - officialRate) * newAmountSent));
        setAmountSentFormatted(formatAmount(newAmountSent));

        try {
            setAmountReceivedFormatted(formatAmount(newAmountReceived));
            if (newAmountReceived === 0) {
                setAmountReceivedFormatted('');
            }
        }
        catch (error) {
            console.error('Error formatting amount received:', error);
            setAmountReceivedFormatted('0');
        }
        console.log('The amount sent is', formatAmount(newAmountSent), ' and the amount received is ', formatAmount(newAmountReceived));

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
                // console.log(field.name + ' is fine');
                isValid = true;
            } else {
                // console.log(`Field ${field.name} is not correct`);
                isValid = false;
                break; // Now break works properly
            }
        }
        if (isValid) {
            if (verifyFields()) {
                const cashback =  cashbackPercentage * amountSent;
                const referralGain = referralGainPercentage * amountSent
                const data = {
                    amountSent: amountSent,
                    currencySent: currenciesData[userData.currencySymbol || '€']?.symbol,
                    amountReceived: amountReceived,
                    currencyReceived: countriesData[selectedCountry].currency,
                    receiverCountry: selectedCountry,
                    transactionRate: katikaRate,
                    cashback: cashback,
                    referralGain: referralGain,
                    transakAmount: amountSent,
                    latestScreen: 1,
                }
                dispatch(provideStepOneData(data));
                moveToScreen(1);
            } else {
                // console.log('The minimum amount is 20 Euros');
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
            // console.log('Value is wrong:', value.replace(/,/g, ''));
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
        let maximalAmountFormatted = '0';

        try {
            maximalAmountFormatted = formatAmount(maximalAmount);
        }
        catch (error) {
            console.error('Error formatting maximal amount:', error);
            maximalAmountFormatted = '0';
        }

        if (amountSent < 0 || amountReceived < 0) {
            setErrorMsg("Le montant ne peut etre negatif");
        } else if (amountSent < 30) {
            setErrorMsg(`Le montant minimal d'une transaction est de ${minimalAmount} Euros`);
        } else if (amountSent > 70000) {
            setErrorMsg(`Le montant maximal d'une transaction est de ${maximalAmountFormatted} Euros`);
        } else {
            isValid = true;
        }
        return isValid
    }

    useEffect(() => {
        fetchActualPrice();
        fetchRate()
    }, [])

    const formatAmount = (amount: number): string =>
        amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    


    const dispatch = useAppDispatch()
    const accessToken = useAppSelector((state) => state.token.token);
    const transactionDetails = useAppSelector((state) => state.transaction);
    // DEFAULT AMOUNT VALUES
    let amountSentDefault = '';
    const amountReceivedDefault = '';

    try {
         amountSentDefault = transactionDetails.amountSent === 0 ? '' : formatAmount(transactionDetails.amountSent!);
    }
    catch (error) {
        console.error('Error formatting sent amount:', error);
        amountSentDefault = '0';
    }

    // Set the default amount received based on the sent amount and rate
    useEffect(() => {
        if (katikaRate > 0 && amountSent > 0) {
            const calculatedAmountReceived = amountSent * katikaRate;
            setAmountReceived(calculatedAmountReceived);
            setAmountReceivedFormatted(calculatedAmountReceived.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));

            const gainValue = (katikaRate - officialRate) * amountSent;
            setGain(gainValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
        }
    }, [katikaRate, amountSent, officialRate]);

  return (
    <div className='w-full h-[90%] pb-[86px] lg:h-max lg:w-[502px] rounded-t-[12px] text-[14px] lg:text-[16px] lg:rounded-[12px] p-[32px] lg:p-[44px] gap-[18px] bg-white flex flex-col'>
        <div className="flex items-center gap-[12px]">
            <div className='flex w-full justify-between items-center'>
                <h4 className='text-[20px] font-bold text-primary'>
                    {t('transactionScreens.screenOne.title')}
                </h4>
                <button onClick={onClose}><LiaTimesSolid size={24} className='h-[24px]' /></button>
            </div>
        </div>
        <form id='form-one' ref={formRef} onSubmit={handleSubmit} className='flex grow flex-col gap-[12px] pt-[20px]'>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>
                    {t('transactionScreens.screenOne.form.destination.label')}
                </label>
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
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>
                    {t('transactionScreens.screenOne.form.send.label')}
                </label>
                <div className='flex items-center font-bold w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray-400 gap-[12px]'>
                    {/* <select name="currency" id="currency-select" defaultValue='€' onChange={handleCurrencyChange} className="bg-transparent max-w-[40px]">
                        {
                            Object.entries(currenciesData).map(([key, data], index) => (
                                <option key={index} value={key}>
                                    {data.symbol}
                                </option>
                            ))
                        }
                    </select> */}
                    <img 
                        src={`${currenciesData[userData.currencySymbol || '€'].image}`} alt={currenciesData[userData.currencySymbol || '€'].name} width={30} height={20} className='w-[30px]' />
                    {
                    modifyingSentAmount ?
                        <input type="text" onChange={handleSentAmountChange} defaultValue={amountSentDefault} name='amount-sent' className='grow w-[75%] sm:w-full text-right' style={{ margin: 0, padding: 0}}/>
                    :
                        <input type="text" onClick={() => {setModifyingSentAmount(true)}} readOnly={true} value={amountSentFormatted} name='amount-sent' className='grow w-[75%] sm:w-full text-right' />
                    }
                    <h5 className=''>{currenciesData[userData.currencySymbol || '€']?.symbol}</h5>
                </div>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="" className='mb-[4px] text-[14px] text-gray_dark/60'>
                    {t('transactionScreens.screenOne.form.receive.label')}
                </label>
                <div className={`flex items-center font-bold w-full rounded-[8px] px-[14px] py-[8px] border-2 border-gray_dark gap-[12px]`}>
                    <img src={`${countriesData[selectedCountry]?.image}`} alt="Img" className='w-[30px]' />
                    {
                        modifyingSentAmount ?
                        <input onClick={() => {setModifyingSentAmount(false)}} type="text" readOnly={true} defaultValue={amountReceivedDefault} value={amountReceivedFormatted} name='amount-received' className='grow w-[75%] sm:w-full text-right' />
                        :
                        <input type="text" name='amount-received' defaultValue={amountReceivedDefault} onChange={handleReceivedAmountChange} className='grow w-[75%] sm:w-full text-right' />

                    }
                    <h5 className=''>{countriesData[selectedCountry]?.currency}</h5>
                </div>
            </div>
            <h3 className='text-red text-center font-semibold'>{errorMsg}</h3>
            <div className='flex justify-between'>
                <div className='flex items-center gap-[8px]'>
                    <h5>{t('transactionScreens.screenOne.form.rate.label')}</h5>
                    <span className='info-icon'><IoMdInformationCircle /></span> 
                </div>
                <div className='space-x-[10px] flex items-center'>
                    <span className='size-[8px] rounded-full bg-[#07E36E]'></span>
                    <h5 className=''>{katikaRate}</h5>
                </div>
            </div>
            <div className='flex justify-between'>
                <h5>{t('transactionScreens.screenOne.form.gain.label')}</h5>
                <h5>{ gain + ' ' + countriesData[selectedCountry]?.currency }</h5>
            </div>
            <button type='submit' className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-bold '>
                    {t('transactionScreens.screenOne.buttons.continue')}
                </h6>
            </button>
            <div className='grow lg:hidden'></div>
            <button type='submit' className={`lg:hidden block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className='text-center font-bold '>
                    {t('transactionScreens.screenOne.buttons.continue')}
                </h6>
            </button>
        </form>
        
    </div>
  )
}

export default ScreenOne
