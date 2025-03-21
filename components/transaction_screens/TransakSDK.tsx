import { useState, useEffect, useRef } from "react";
import { Transak } from "@transak/transak-sdk";

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStatus } from "@/lib/redux/features/transaction/transactionSlice";
import axios from "axios";

type WalletAddress = {
  networks?: Record<string, { address: string; addressAdditionalData?: string }>;
  coins?: Record<string, { address: string; addressAdditionalData?: string }>;
};
 /*
type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postCode: string;
    countryCode: string;
  };
};
*/
interface ScreenProps {
  onClose: () => void,
  nextScreen: () => void,
};

const TransakSDK = ({onClose, nextScreen}: ScreenProps) => {

  const [isPaymentAuthorized, setIsPaymentAuthorized] = useState(false);
  const isSDKInit = useRef(false);
  const userData = useAppSelector((state) => state.user);
  const transactionDetails = useAppSelector((state) => state.transaction);
  const status = useAppSelector((state) => state.transaction.status)
  const accessToken = useAppSelector((state) => state.token.token); 
  const dispatch = useAppDispatch();

  const wallet: WalletAddress = {
    networks: {
      mainnet: { address: userData.walletAdress! || '' },
    },
    coins: {
      USDC: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" }
    }
  };

  const user = {
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
      countryCode: ''
    },
  };

  const postTransaction = async() => {
      console.log("We are transacting with the access token: ", accessToken)
      const response  = await axios.post('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transaction',
      { 
          "amount": transactionDetails.amountSent,
          "currency": transactionDetails.currencySent === '€' ? 'EUR' : 'USD',
          "transactionType": transactionDetails.transfertType,
          "recipient": transactionDetails.transfertType === 'MobileMoney' ? {
              "name": transactionDetails.receiverName,
              "amountReceive": transactionDetails.amountReceived,
              "phone": transactionDetails.receiverPhoneNumber,
              "receiverCountry": transactionDetails.receiverCountry
          } :  {
              "name": transactionDetails.receiverName,
              "amountReceive": transactionDetails.amountReceived,
              "iban": transactionDetails.iban,
              "bankCode": transactionDetails.bankCode,
              "bankName": transactionDetails.bankName,
              "receiverCountry": transactionDetails.receiverCountry
          },
      },
      {
          headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
      }
      );
      console.log('The amount is: ', transactionDetails.amountSent);
      console.log('The currency is: ', (transactionDetails.currencySent === '€' ? 'EUR' : 'USD')),
      console.log('The transaction type is: ', transactionDetails.transfertType),
      console.log('The receiver name is: ', transactionDetails.receiverName),
      console.log('The receiver phone number is: ', transactionDetails.receiverPhoneNumber),
      console.log('The receiver country is: ', transactionDetails.receiverCountry);
      const data = response;
      console.log('---------### The Response due to the Transaction is: ', data);
  }


  const updateTransactionStatus = async(status) => {

    const response = await axios.put('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transaction/6',
      {
          "status": status
      },
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
    console.log('We set the status to:', status);
    console.log('The response is:', response);
  }

  const transak: Transak = new Transak({
    hideExchangeScreen: true,
    apiKey:  `${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}`, // Replace with your Transak API Key
    environment: Transak.ENVIRONMENTS.STAGING, // Use 'PRODUCTION' for live environment
    widgetHeight: '550px',
    widgetWidth: '450px',
    hideMenu: true,
    defaultCryptoCurrency: 'USDC', // Default cryptocurrency
    network: 'solana',
    fiatCurrency: transactionDetails.currencySent === '€' ? 'EUR' : 'EUR', // INR, USD, GBP, etc
    fiatAmount: transactionDetails.amountSent!,
    productsAvailed: 'BUY',
    cryptoCurrencyCode: 'USDC',
    walletAddressesData: wallet,
    disableWalletAddressForm: true,
    // walletAddress: '', // User's wallet address (can be dynamically set)
    themeColor: '8C3DCA', // Widget theme color
    backgroundColors: '#D470FD',
    borderColors: '008800',
    isFeeCalculationHidden: true,
    userData: user,
    email: userData.email, // User's email (optional)
    paymentMethod: 'sepa_bank_transfer',
    disablePaymentMethods: ['credit_debit_card', 'apple_pay', 'google_pay'],
  });

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
    console.log('Damn! TRANSAK_WIDGET_CLOSE', orderData);
    transak
      .close();
    setIsPaymentAuthorized(false);
    dispatch(provideStatus('Cancelled'));
    updateTransactionStatus('Cancelled');
    if(status?.toLowerCase() ===  'pending') {
      dispatch(provideStatus('Cancelled'));
      // Change status in the server also
      updateTransactionStatus('Cancelled');
    }
    onClose();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData) => {
    console.log('TRANSAK ORDER FAILED', orderData);
    dispatch(provideStatus('Failed'));
    updateTransactionStatus('Failed');
  })

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log('TRANSAK_ORDER_SUCCESSFUL', orderData);
    setIsPaymentAuthorized(true);
    postTransaction();
    dispatch(provideStatus('Completed'))
    updateTransactionStatus('Completed');
    transak.close();
    nextScreen();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
    console.log("Transak order created: ", orderData);
    dispatch(provideStatus('Pending'));
    // Create a transaction in the server
    postTransaction();
  })

    useEffect(() => {
        if (!isSDKInit.current) {
          isSDKInit.current = true;
          console.log('--- Initiating SDK ---');
          transak.init();
          postTransaction();
        }
      }, [isPaymentAuthorized]);
    
    return  <div className=" opacity-20 min-w-screen">
              <div id="transak-widget"></div>
            </div>;
}

export default TransakSDK;
