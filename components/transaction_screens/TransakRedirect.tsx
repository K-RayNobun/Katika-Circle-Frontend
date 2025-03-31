'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'
import { LiaTimesSolid } from "react-icons/lia"
import Spinner from '@/components/Spinner'

interface ScreenProps {
    onClose: () => void,
    moveToScreen?: (index: number) => void,
  };

const TransakRedirect = ({ onClose }: ScreenProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [windowOpened, setWindowOpened] = useState(false)

  const userData = useAppSelector((state) => state.user)
  const transactionDetails = useAppSelector((state) => state.transaction)

  const transakUrl = `https://global.transak.com/?apiKey=${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}&backgroundColors=%23D470FD&borderColors=008800&cryptoCurrencyCode=USDC&defaultCryptoCurrency=USDC&disablePaymentMethods=credit_debit_card,apple_pay,google_pay&disableWalletAddressForm=true&email=${encodeURI(userData.email)}&fiatAmount=${transactionDetails.transakAmount}&fiatCurrency=${transactionDetails.currencySent === '€' ? 'EUR' : 'USD'}&hideExchangeScreen=true&hideMenu=true&isFeeCalculationHidden=true&network=solana&paymentMethod=sepa_bank_transfer&productsAvailed=BUY&sdkName=%40transak%2Ftransak-sdk&sdkVersion=3.2.0&themeColor=8C3DCA&userData=%7B%22firstName%22%3A%22${encodeURI(userData.name)}%22%2C%22lastName%22%3A%22${encodeURI(userData.surname)}%22%2C%22email%22%3A%22${encodeURI(userData.email)}%22%2C%22mobileNumber%22%3A%22%22%2C%22dob%22%3A%22%22%2C%22address%22%3A%7B%22addressLine1%22%3A%22%22%2C%22addressLine2%22%3A%22%22%2C%22city%22%3A%22%22%2C%22state%22%3A%22%22%2C%22postCode%22%3A%22%22%2C%22countryCode%22%3A%22%22%7D%7D&walletAddressesData=%7B%22networks%22%3A%7B%22mainnet%22%3A%7B%22address%22%3A%22${encodeURI(userData.walletAddress!)}%22%7D%7D%2C%22coins%22%3A%7B%22USDC%22%3A%7B%22address%22%3A%22EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%22%7D%7D%7D}`

  const handleRedirect = () => {
    if (!windowOpened) {
      setIsLoading(true)
      try {
        window.open(transakUrl, '_blank')
        setWindowOpened(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to open Transak:', error)
        setHasError(true)
        setIsLoading(false)
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