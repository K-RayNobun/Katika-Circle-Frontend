import { useEffect, useRef } from "react";
import { Transak } from "@transak/transak-sdk";

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStatus } from "@/lib/redux/features/transaction/transactionSlice";
import axios from "axios";

type WalletAddress = {
  networks?: Record<string, { address: string; addressAdditionalData?: string }>;
  coins?: Record<string, { address: string; addressAdditionalData?: string }>;
};

interface ScreenProps {
  onClose: () => void,
  moveToScreen: (index: number) => void,
};

const TransakSDK = ({onClose, moveToScreen}: ScreenProps) => {
  const isSDKInit = useRef(false);
  const userData = useAppSelector((state) => state.user);
  const transactionDetails = useAppSelector((state) => state.transaction);
  const status = useAppSelector((state) => state.transaction.status)
  const accessToken = useAppSelector((state) => state.token.token); 
  const dispatch = useAppDispatch();

  const wallet: WalletAddress = {
    networks: {
      mainnet: { address: userData.walletAddress! || '' },
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
      // console.log("We are transacting with the access token: ", accessToken)
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transaction`,
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
      // console.log('The amount is: ', transactionDetails.amountSent);
      // console.log('The currency is: ', transactionDetails.currencySent === '€' ? 'EUR' : 'USD');
      // console.log('The transaction type is: ', transactionDetails.transfertType);
      // console.log('The receiver name is: ', transactionDetails.receiverName);
      // console.log('The receiver phone number is: ', transactionDetails.receiverPhoneNumber);
      // console.log('The receiver country is: ', transactionDetails.receiverCountry);
      // console.log('---------### The Response due to the Transaction is: ', data);
  }


  const updateTransactionStatus = async(status:string) => {

    await axios.put(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transaction/6`,
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
    // console.log('We set the status to:', status);
    // console.log('The response is:', response);
  }

  // console.log(`The Transak API key is : ${process.env.NEXT_PUBLIC_TRANSAK_API_KEY} and the amount is ${transactionDetails.transakAmount}`);
  const transak: Transak = new Transak({

    hideExchangeScreen: true,
    apiKey:  `${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}`, // Replace with your Transak API Key
    environment: Transak.ENVIRONMENTS.PRODUCTION, // STAGING // Use 'PRODUCTION' for live environment
    widgetHeight: '550px',
    widgetWidth: '450px',
    hideMenu: true,
    defaultCryptoCurrency: 'USDC', // Default cryptocurrency
    network: 'solana',
    fiatCurrency: transactionDetails.currencySent === '€' ? 'EUR' : 'EUR', // INR, USD, GBP, etc
    fiatAmount: transactionDetails.transakAmount!,
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

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
    // console.log('Damn! TRANSAK_WIDGET_CLOSE', orderData);
    transak
      .close();
    dispatch(provideStatus('Cancelled'));
    updateTransactionStatus('Cancelled');
    if(status?.toLowerCase() ===  'pending') {
      dispatch(provideStatus('Cancelled'));
      // Change status in the server also
      updateTransactionStatus('Cancelled');
    }
    onClose();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, () => {
    // console.log('TRANSAK ORDER FAILED', orderData);
    dispatch(provideStatus('Failed'));
    updateTransactionStatus('Failed');
  })

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, () => {
    // console.log('TRANSAK_ORDER_SUCCESSFUL', orderData);
    postTransaction();
    dispatch(provideStatus('pending'))
    updateTransactionStatus('Pending');
    transak.close();
    moveToScreen(1);
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, () => {
    // console.log("Transak order created: ", orderData);
    // dispatch(provideStatus('Pending'));
    // Create a transaction in the server
    // postTransaction();
  })

    useEffect(() => {
        if (!isSDKInit.current) {
          isSDKInit.current = true;
          // console.log('--- Initiating SDK ---');
          transak.init();
        }
      }, [transak]);
    
    return <div className="opacity-20 min-w-screen">
              <div id="transak-widget"></div>
            </div>;
          }

export default TransakSDK;
