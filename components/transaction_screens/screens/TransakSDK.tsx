import { useEffect, useRef } from "react";
import { Transak, TransakConfig } from "@transak/transak-sdk";

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStatus } from "@/lib/redux/features/transaction/transactionSlice";
import axios from "axios";

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
  const currency = transactionDetails.currencySent === '€' ? 'EUR' :  transactionDetails.currencySent === '£' ? 'GBP' : 'USD';

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
      // console.log(`We are transacting with the access token: + ${accessToken}`);
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transaction`,
      { 
          "amount": transactionDetails.amountSent,
          "currency": currency,
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

  // console.log(`The Transak API key is : ${process.env.NEXT_PUBLIC_TRANSAK_API_KEY} and the amount is ${transactionDetails.transakAmount} \n Finnaly the address is ${userData.walletAddress}`);

  const transakConfig: TransakConfig = {
    hideExchangeScreen: true,
    apiKey:  `${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}`, // Replace with your Transak API Key
    environment: Transak.ENVIRONMENTS.PRODUCTION, // STAGING // Use 'PRODUCTION' for live environment
    widgetHeight: '550px',
    widgetWidth: '450px',
    hideMenu: true,
    defaultCryptoCurrency: 'USDC', // Default cryptocurrency
    network: 'solana',
    fiatCurrency: currency, // INR, USD, GBP, etc
    fiatAmount: transactionDetails.transakAmount,
    productsAvailed: 'BUY',
    cryptoCurrencyCode: 'USDC',
    walletAddress: userData.walletAddress! || '', // User's wallet address (can be dynamically set)
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
    redirectURL: `${process.env.NEXT_PUBLIC_REDIRECT_URL}`,
  }

//  https://global.transak.com/?apiKey=fcbaaf1a-e5ff-4883-b8e1-e9bf53768415&backgroundColors=%23D470FD&borderColors=008800&cryptoCurrencyCode=USDC&defaultCryptoCurrency=USDC&disablePaymentMethods=credit_debit_card%2Capple_pay%2Cgoogle_pay&disableWalletAddressForm=true&email=houohinkyoma%40gmail.com&fiatAmount=125&fiatCurrency=EUR&hideExchangeScreen=true&hideMenu=true&isFeeCalculationHidden=true&network=solana&paymentMethod=sepa_bank_transfer&productsAvailed=BUY&redirectURL=https%3A%2F%2Fsend.katika.io%2Fuser%2Fhome&sdkName=%40transak%2Ftransak-sdk&sdkVersion=3.2.0&themeColor=8C3DCA&userData=%7B%22firstName%22%3A%22Houohin%22%2C%22lastName%22%3A%22Kyoma%22%2C%22email%22%3A%22houohinkyoma%40gmail.com%22%2C%22mobileNumber%22%3A%22%22%2C%22dob%22%3A%22%22%2C%22address%22%3A%7B%22addressLine1%22%3A%22%22%2C%22addressLine2%22%3A%22%22%2C%22city%22%3A%22%22%2C%22state%22%3A%22%22%2C%22postCode%22%3A%22%22%2C%22countryCode%22%3A%22%22%7D%7D&walletAddress=GjT7QuA3xcBiM6Kn7pSbcHWATfggVZUXm4ziGKry3TK7
//  https://global.transak.com/?apiKey=fcbaaf1a-e5ff-4883-b8e1-e9bf53768415&backgroundColors=%2523D470FD&borderColors=008800&cryptoCurrencyCode=USDC&defaultCryptoCurrency=USDC&disablePaymentMethods=credit_debit_card%252Capple_pay%252Cgoogle_pay&disableWalletAddressForm=true&email=houohinkyoma%2540gmail.com&fiatAmount=120&fiatCurrency=EUR&hideExchangeScreen=true&hideMenu=true&isFeeCalculationHidden=true&network=solana&paymentMethod=sepa_bank_transfer&productsAvailed=BUY&redirectURL=https%253A%252F%252Fsend.katika.io%252Fuser%252Fhome&sdkName=%2540transak%252Ftransak-sdk&sdkVersion=3.2.0&themeColor=8C3DCA&userData=%257B%2522firstName%2522%253A%2522Houohin%2522%252C%2522lastName%2522%253A%2522Kyoma%2522%252C%2522email%2522%253A%2522houohinkyoma%2540gmail.com%2522%252C%2522mobileNumber%2522%253A%2522%2522%252C%2522dob%2522%253A%2522%2522%252C%2522address%2522%253A%257B%2522addressLine1%2522%253A%2522%2522%252C%2522addressLine2%2522%253A%2522%2522%252C%2522city%2522%253A%2522%2522%252C%2522state%2522%253A%2522%2522%252C%2522postCode%2522%253A%2522%2522%252C%2522countryCode%2522%253A%2522%2522%257D%257D&walletAddress=GjT7QuA3xcBiM6Kn7pSbcHWATfggVZUXm4ziGKry3TK7
{/*
    / => Col31  %25
*/}
  const transak: Transak = new Transak(transakConfig);

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
    transak.close();
    moveToScreen(1);
  });

    useEffect(() => {
        if (!isSDKInit.current) {
          isSDKInit.current = true;
          // console.log('--------------------- Initiating Transak SDK -------------------');
          transak.init();
        }
      }, [transak]);
    
    return  <div className="opacity-20 min-w-screen">
              <div id="transak-widget"></div>
            </div>;
}

export default TransakSDK;
