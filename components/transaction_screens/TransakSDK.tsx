import { useEffect, useRef } from "react";
import { Transak } from "@transak/transak-sdk";
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

const TransakSDK = ({ onClose, moveToScreen }: ScreenProps) => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const isSDKInit = useRef(false);
  const userData = useAppSelector((state) => state.user);
  const transactionDetails = useAppSelector((state) => state.transaction);
  const status = useAppSelector((state) => state.transaction.status);
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

  const postTransaction = async () => {
    console.log("We are transacting with the access token: ", accessToken);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transaction`,
      {
        "amount": transactionDetails.amountSent,
        "currency": transactionDetails.currencySent === '€' ? 'EUR' : 'USD',
        "transactionType": transactionDetails.transfertType,
        "recipient": transactionDetails.transfertType === 'MobileMoney' ? {
          "name": transactionDetails.receiverName,
          "amountReceive": transactionDetails.amountReceived,
          "phone": transactionDetails.receiverPhoneNumber,
          "receiverCountry": transactionDetails.receiverCountry
        } : {
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
    const data = response;
    console.log('The amount is: ', transactionDetails.amountSent);
    console.log('The currency is: ', transactionDetails.currencySent === '€' ? 'EUR' : 'USD');
    console.log('The transaction type is: ', transactionDetails.transfertType);
    console.log('The receiver name is: ', transactionDetails.receiverName);
    console.log('The receiver phone number is: ', transactionDetails.receiverPhoneNumber);
    console.log('The receiver country is: ', transactionDetails.receiverCountry);
    console.log('---------### The Response due to the Transaction is: ', data);
  };

  const updateTransactionStatus = async (status: string) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transaction/6`,
      { "status": status },
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
  };

  console.log(`The Transak API key is : ${process.env.NEXT_PUBLIC_TRANSAK_API_KEY} and the amount is ${transactionDetails.transakAmount}`);
  const transak = new Transak({
    hideExchangeScreen: true,
    apiKey: `${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}`,
    environment: Transak.ENVIRONMENTS.PRODUCTION,
    widgetHeight: '550px',
    widgetWidth: '450px',
    hideMenu: true,
    defaultCryptoCurrency: 'USDC',
    network: 'solana',
    fiatCurrency: transactionDetails.currencySent === '€' ? 'EUR' : 'EUR',
    fiatAmount: transactionDetails.transakAmount!,
    productsAvailed: 'BUY',
    cryptoCurrencyCode: 'USDC',
    walletAddressesData: wallet,
    disableWalletAddressForm: true,
    themeColor: '8C3DCA',
    backgroundColors: '#D470FD',
    borderColors: '008800',
    isFeeCalculationHidden: true,
    userData: user,
    email: userData.email,
    paymentMethod: 'sepa_bank_transfer',
    redirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    disablePaymentMethods: ['credit_debit_card', 'apple_pay', 'google_pay'],
    containerId: 'TransakComponent',
  });

  // const openTransakWidget = () => {
  //   window.open('https://global.transak.com', '_blank');
  // };

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
    console.log('Damn! TRANSAK_WIDGET_CLOSE', orderData);
    transak.close();
    dispatch(provideStatus('Cancelled'));
    updateTransactionStatus('Cancelled');
    if (status?.toLowerCase() === 'pending') {
      dispatch(provideStatus('Cancelled'));
      updateTransactionStatus('Cancelled');
    }
    onClose();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData) => {
    console.log('TRANSAK ORDER FAILED', orderData);
    dispatch(provideStatus('Failed'));
    updateTransactionStatus('Failed');
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log('TRANSAK_ORDER_SUCCESSFUL', orderData);
    postTransaction();
    dispatch(provideStatus('pending'));
    updateTransactionStatus('Pending');
    transak.cleanup();
    transak.close();
    moveToScreen(1);
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
    console.log("Transak order created: ", orderData);
  });

  useEffect(() => {
    if (!isSDKInit.current) {
      isSDKInit.current = true;
      console.log('--- Initiating SDK ---');
      transak.init();
      // openTransakWidget(); // Ouvre le widget dans une nouvelle fenêtre
    }
  }, [transak]);

  return  <div className="opacity-20 min-w-screen">
            <div id="TransakComponent" ref={widgetContainerRef}></div>
          </div>
};

export default TransakSDK;
