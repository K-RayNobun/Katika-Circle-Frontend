import { useState, useEffect, useRef } from "react";
import { Transak, TransakConfig } from "@transak/transak-sdk";

//Redux related imports
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { provideStatus } from "@/lib/redux/features/transaction/transactionSlice";

type WalletAddress = {
  networks?: Record<string, { address: string; addressAdditionalData?: string }>;
  coins?: Record<string, { address: string; addressAdditionalData?: string }>;
};

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
  const dispatch = useAppDispatch();

  const wallet: WalletAddress = {
    networks: {
      mainnet: { address: "0x1234567890abcdef" },
    },
    coins: {
      USDC: { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" }
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

  const transak: Transak = new Transak({
    // hideExchangeScreen: true,
    apiKey: '8e3c611a-0e35-41ef-b960-a654cfc65be7', // Replace with your Transak API Key
    environment: Transak.ENVIRONMENTS.STAGING, // Use 'PRODUCTION' for live environment
    widgetHeight: '550px',
    widgetWidth: '450px',
    hideMenu: true,
    defaultCryptoCurrency: 'USDC', // Default cryptocurrency
    network: 'solana',
    fiatCurrency: transactionDetails.currencySent,
    fiatAmount: transactionDetails.amountSent,
    productsAvailed: 'BUY',
    cryptoCurrencyCode: 'USDC',
    walletAddressesData: wallet,
    disableWalletAddressForm: true,
    walletAddress: '', // User's wallet address (can be dynamically set)
    themeColor: '8C3DCA', // Widget theme color
    backgroundColors: '#D470FD',
    borderColors: '008800',
    isFeeCalculationHidden: true,
    userData: user,
    email: 'houohinkyoma@gmail.com', // User's email (optional)
    paymentMethod: 'sepa_bank_transfer',
    disablePaymentMethods: ['credit_debit_card', 'apple_pay', 'google_pay'],
    // redirectURL: 'localhost:3000/home', // Redirect URL after completion
  });

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
    console.log('Damn! TRANSAK_WIDGET_CLOSE', orderData);
    transak
      .close();
    setIsPaymentAuthorized(false);
    if(status?.toLowerCase() ===  'pending') {
      dispatch(provideStatus('Canceled'))
    }
    onClose();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData) => {
    console.log('TRANSAK ORDER FAILED', orderData);
    dispatch(provideStatus('Failed'));
  })

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log('TRANSAK_ORDER_SUCCESSFUL', orderData);
    setIsPaymentAuthorized(true);
    dispatch(provideStatus('Completed'))
    transak.close();
    nextScreen();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
    console.log("Transak order created: ", orderData);
    dispatch(provideStatus('Pending'))
  })

    useEffect(() => {
        if (!isSDKInit.current) {
          isSDKInit.current = true;
          console.log('--- Initiating SDK ---');
          transak.init();
        }
      }, [isPaymentAuthorized]);
    
    return  <div className=" opacity-40 min-w-screen">
              <div id="transak-widget"></div>
            </div>;
}

export default TransakSDK;
