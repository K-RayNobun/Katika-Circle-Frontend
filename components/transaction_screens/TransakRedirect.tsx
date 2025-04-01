'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'
import { LiaTimesSolid } from "react-icons/lia"
import Spinner from '@/components/Spinner'

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
  const walletData = {
    networks: {
      mainnet: {
        address: userData.walletAddress,
      },
    },
    coins: {
      USDC: {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      },
    },
  };
  params.append('walletAddressesData', JSON.stringify(walletData));

  return `${baseUrl}?${params.toString()}`;
};

const TransakRedirect = ({ onClose }: ScreenProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [windowOpened, setWindowOpened] = useState(false)

  const userData = useAppSelector((state) => state.user);
  const transactionDetails = useAppSelector((state) => state.transaction)
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
        const encodedUrl = encodeURI(transakUrl);
        console.log(`TRANSAK URL IS >>> \n ${encodedUrl}`);
        window.open(transakUrl, '_blank');
        setWindowOpened(true);
      } catch (error) {
        console.error('Failed to open Transak:', error)
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

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className='w-full h-[90%] pb-[86px] lg:h-max lg:w-[502px] rounded-t-[12px] lg:rounded-[12px] p-[44px] gap-[32px] bg-white flex flex-col'>
      <div className="flex items-center gap-[12px]">
        <div className='flex w-full justify-between items-center'>
          <h4 className='text-[20px] font-bold text-primary'>Transaction Status</h4>
          <button onClick={handleClose}><LiaTimesSolid size={24} className='h-[24px]' /></button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 py-8">
        {hasError ? (
          <>
            <p className="text-red text-lg font-semibold">Transaction not processed</p>
            <button 
              onClick={handleRetry}
              className="bg-primary hover:bg-primary_dark py-[10px] px-[20px] rounded-[8px] text-white"
            >
              Try Again
            </button>
          </>
        ) : (
          <p className="text-gray_dark text-lg">
            Transaction window has been opened in a new tab
          </p>
        )}
      </div>
    </div>
  )
}

export default TransakRedirect