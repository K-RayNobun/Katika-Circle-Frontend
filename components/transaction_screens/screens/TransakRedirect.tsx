'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'
import { LiaTimesSolid } from "react-icons/lia"
import Spinner from '@/components/Spinner'
import { RiRestartLine } from "react-icons/ri";

import { useTranslation } from '@/lib/hooks/useTranslation'
import { useApiGet } from '@/lib/hooks/useApiRequest'

interface ScreenProps {
    onClose: () => void,
    moveToScreen?: (index: number) => void,
  };

interface UserData {
  name: string;
  surname: string;
  email: string;
  walletAddress: string;
}

interface TransactionDetails {
  transakAmount: number;
  currencySent: string;
}

const createTransakUrl = (userData: UserData, transactionDetails: TransactionDetails) => {
  // Base URL and common params
  const baseUrl = 'https://global.transak.com'; // global-stg.com on staging
  const params = new URLSearchParams({
    apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
    backgroundColors: '#D470FD',
    borderColors: '008800',
    cryptoCurrencyCode: 'USDC',
    defaultCryptoCurrency: 'USDC',
    disablePaymentMethods: 'credit_debit_card,apple_pay,google_pay',
    disableWalletAddressForm: 'true',
    email: userData.email,
    fiatAmount: transactionDetails.transakAmount.toString(),
    fiatCurrency: transactionDetails.currencySent === '€' ? 'EUR' : 'USD',
    hideExchangeScreen: 'true',
    hideMenu: 'true',
    isFeeCalculationHidden: 'true',
    network: 'solana',
    paymentMethod: 'sepa_bank_transfer',
    productsAvailed: 'BUY',
    redirectURL: process.env.NEXT_PUBLIC_REDIRECT_URL || '',
    sdkName: '@transak/transak-sdk',
    sdkVersion: '3.2.0',
    themeColor: '8C3DCA',
  });

  // Add userData as JSON string
  const userDataObj = {
    firstName: userData.name,
    lastName: userData.surname,
    email: userData.email,
    mobileNumber: '',
    dob: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postCode: '',
      countryCode: '',
    },
  };
  params.append('userData', JSON.stringify(userDataObj));

  // Add wallet addresses data as JSON string
  const walletAddress = userData.walletAddress;

  params.append('walletAddress', walletAddress);

  return `${baseUrl}?${params.toString()}`;
};

// TRansak URL:
//  https://global.transak.com?apiKey=fcbaaf1a-e5ff-4883-b8e1-e9bf53768415&backgroundColors=%23D470FD&borderColors=008800&cryptoCurrencyCode=USDC&defaultCryptoCurrency=USDC&disablePaymentMethods=credit_debit_card%2Capple_pay%2Cgoogle_pay&disableWalletAddressForm=true&email=houohinkyoma%40gmail.com&fiatAmount=125&fiatCurrency=EUR&hideExchangeScreen=true&hideMenu=true&isFeeCalculationHidden=true&network=solana&paymentMethod=sepa_bank_transfer&productsAvailed=BUY&redirectURL=https%3A%2F%2Fsend.katika.io%2Fuser%2Fhome&sdkName=%40transak%2Ftransak-sdk&sdkVersion=3.2.0&themeColor=8C3DCA&userData=%7B%22firstName%22%3A%22Houohin%22%2C%22lastName%22%3A%22Kyoma%22%2C%22email%22%3A%22houohinkyoma%40gmail.com%22%2C%22mobileNumber%22%3A%22%22%2C%22dob%22%3A%22%22%2C%22address%22%3A%7B%22addressLine1%22%3A%22%22%2C%22addressLine2%22%3A%22%22%2C%22city%22%3A%22%22%2C%22state%22%3A%22%22%2C%22postCode%22%3A%22%22%2C%22countryCode%22%3A%22%22%7D%7D&walletAddress=GjT7QuA3xcBiM6Kn7pSbcHWATfggVZUXm4ziGKry3TK7
// Encoded URL:
//  https://global.transak.com?apiKey=fcbaaf1a-e5ff-4883-b8e1-e9bf53768415&backgroundColors=%2523D470FD&borderColors=008800&cryptoCurrencyCode=USDC&defaultCryptoCurrency=USDC&disablePaymentMethods=credit_debit_card%252Capple_pay%252Cgoogle_pay&disableWalletAddressForm=true&email=houohinkyoma%2540gmail.com&fiatAmount=125&fiatCurrency=EUR&hideExchangeScreen=true&hideMenu=true&isFeeCalculationHidden=true&network=solana&paymentMethod=sepa_bank_transfer&productsAvailed=BUY&redirectURL=https%253A%252F%252Fsend.katika.io%252Fuser%252Fhome&sdkName=%2540transak%252Ftransak-sdk&sdkVersion=3.2.0&themeColor=8C3DCA&userData=%257B%2522firstName%2522%253A%2522Houohin%2522%252C%2522lastName%2522%253A%2522Kyoma%2522%252C%2522email%2522%253A%2522houohinkyoma%2540gmail.com%2522%252C%2522mobileNumber%2522%253A%2522%2522%252C%2522dob%2522%253A%2522%2522%252C%2522address%2522%253A%257B%2522addressLine1%2522%253A%2522%2522%252C%2522addressLine2%2522%253A%2522%2522%252C%2522city%2522%253A%2522%2522%252C%2522state%2522%253A%2522%2522%252C%2522postCode%2522%253A%2522%2522%252C%2522countryCode%2522%253A%2522%2522%257D%257D&walletAddress=GjT7QuA3xcBiM6Kn7pSbcHWATfggVZUXm4ziGKry3TK7

const TransakRedirect = ({ onClose, moveToScreen }: ScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [windowOpened, setWindowOpened] = useState(false);
  const [checkingResult, setCheckingResult] = useState('');
  const { t } = useTranslation();

  const userData = useAppSelector((state) => state.user);
  const transactionDetails = useAppSelector((state) => state.transaction)
  const { fetchData } = useApiGet();
  const transakUrl = createTransakUrl({
    name: userData.name,
    surname: userData.surname,
    email: userData.email,
    walletAddress: userData.walletAddress!
  }, {
    transakAmount: transactionDetails.transakAmount!,
    currencySent: transactionDetails.currencySent!
  })

  const handleRedirect = () => {
    if (!windowOpened) {
      setIsLoading(true)
      try {
        console.log(`TRANSAK URL IS >>> \n ${transakUrl}`);
        const encodedUrl = encodeURI(transakUrl);
        console.log(`ENCODED URL IS >>> \n ${encodedUrl}`);
        window.open(transakUrl, '_blank');
        setWindowOpened(true);
      } catch {
        // console.error('Failed to open Transak:', error)
        setHasError(true)
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleRetry = () => {
    setHasError(false)
    setWindowOpened(false)
    handleRedirect()
  }

  const handleClose = () => {
    onClose();
  }

  useEffect(() => {
    handleRedirect()
  }, [])

  //Creates a function that return true if the last transaction status is 'success';
  const fetchTransactionList = async () => {            
      // console.log('We got this list of transactions: ', response.data.data);
    const {response: result} = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transactions/user`);
      if( result && result.length > 0) {
          const lastTransactionStatus = result!.slice().reverse()[0].transactionStatus.toLowerCase();
      
          console.log(' The latest status: ', lastTransactionStatus);
          if (lastTransactionStatus === 'success') {
              console.log('THE LAST TRANSACTION WAS SUCCESSFUL');
              setHasError(false);
              setCheckingResult(t('transactionScreens.screenRedirect.success'));
              if(moveToScreen) {
                moveToScreen(1); // Move to Screen Four
              }
          } else {
              console.log('User has not completed a transaction yet');
              setCheckingResult(t('transactionScreens.screenRedirect.notProcessed'));
          }
      }
  }

  fetchTransactionList();
    
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className='w-full h-[75%] pb-[86px] lg:h-max lg:w-[502px] rounded-t-[12px] lg:rounded-[12px] p-[44px] gap-[32px] bg-white flex flex-col items-center'>
      <div className="flex items-center gap-[12px]">
        <div className='flex w-full justify-between items-center'>
          <h4 className='text-[20px] font-bold text-primary'>{ t('transactionScreens.screenRedirect.title') }</h4>
          <button onClick={handleClose}><LiaTimesSolid size={24} className='h-[24px]' /></button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 py-8">
        {hasError ? (
          <>
            <p className="text-red text-lg font-semibold">{t('transactionScreens.screenRedirect.error')}</p>
            <button 
              onClick={handleRetry}
              className="bg-primary hover:bg-primary_dark py-[10px] px-[20px] rounded-[8px] text-white"
            >
              {t('transactionScreens.screenRedirect.tryAgain')}
            </button>
          </>
        ) : (
          <div>
            <p className="text-gray_dark text-center text-lg">
              {t('transactionScreens.screenRedirect.windowOpened')}
            </p>
            <div className='flex flex-col items-center justify-center mt-4'>
              <button 
                onClick={fetchTransactionList}
                className="bg-primary hover:bg-primary_dark py-[10px] px-[20px] rounded-[8px] text-white mt-4 flex items-center"
              >
                <RiRestartLine size={26} />
                <h3 className="text-[14px]">
                  {t('transactionScreens.screenRedirect.checkStatus')}
                </h3>
              </button>
              {/* Checkign Result */}
              {checkingResult && (
                <p className="text-gray_dark text-center text-lg mt-4">
                  {checkingResult}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransakRedirect