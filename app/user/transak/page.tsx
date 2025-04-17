

'use client'

import React from 'react';
// import Axios from 'axios';
// import { headers } from '@/next.config';

const TransakOrderCreation = () => {
  // const API_KEY = process.env.NEXT_PUBLIC_TRANSAK_API_KEY;
  // const BASE_URL = 'https://api.transak.com'; // Hypothetical, check docs

  const steps = {
    step1: { status: 'pending', data: null },
    step2: { status: 'pending', data: null },
    step3: { status: 'pending', data: null },
  };

  // const [steps, setSteps] = useState({
  //   step1: { status: 'pending', data: null },
  //   step2: { status: 'pending', data: null },
  //   step3: { status: 'pending', data: null },
  // });

  // const [accessToken, setAccessToken] = useState('');

  const accessToken = '';
/*
  const getQuote = async () => {
    // console.log('Aboarding step I');
    try {
      const response = await Axios.get(BASE_URL + '/api/v1/pricing/public/quotes', {
        params: {
            partnerApiKey: API_KEY,
          cryptoCurrency: 'USDC',
          network: 'solana',
          paymentMethod: 'sepa_bank_transfer',
          fiatAmount: 35,
          fiatCurrency: 'EUR',
          isBuyOrSell: 'BUY'
        },
      });
    //   // console.log('Data registred is', response.data.response.quoteId)
      setSteps({
        ...steps,
        step1: { status: 'success', data: response.data.response },
      });
    } catch (error) {
      setSteps({
        ...steps,
        step1: { status: 'error', data: error.message },
      });
    }
  };

  const createOrder = async () => {
    // console.log('Aborting step II');
    if (steps.step1.status !== 'success') {
      alert('Please complete Step 1 first.');
      return;
    }
    const quoteId = steps.step1.data.quoteId; // Adjust based on actual response
    // console.log('Quote id saved as ',  steps.step1.data.quoteId);
    try {
      const response = await Axios.post(BASE_URL + '/api/v2/orders/wallet-reserve', {
        quoteId,
        walletAddress: 'HAPCejT7ZBbG9jbVH9vRbSH4u4dWtgBdLJouYWMoy57R',
      }, {
        params: { apiKey: API_KEY },
      });
      // console.log('Data saved is', response.data.response)
      setSteps({
        ...steps,
        step2: { status: 'success', data: response.data.response },
      });
    } catch (error) {
      setSteps({
        ...steps,
        step2: { status: 'error', data: error.message },
      });
    }
  };

  const refreshAccessToken = async() => {
        const response = await Axios.post('https://api.transak.com/partners/api/v2/refresh-token',
            {
                "apiKey": API_KEY
            },
            {
                headers: {
                    'accept': 'application/json',
                    'api-secret': 'jK8bYAPdcOBKgFixpIiVoQ==',
                    'content-type': 'application/json'
                  }
            }
        ).then(response => {
            // console.log('Response:', response.data.data["accessToken"]);
            setAccessToken(response.data.data["accessToken"])
          })
          .catch(error => {
            // console.error('Error:', error.response ? error.response.data : error.message);
          });
  }

  const getOrderStatus = async () => {
    if (steps.step2.status !== 'success') {
      alert('Please complete Step 2 first.');
      return;
    }
    const orderId = steps.step2.data.id; // Adjust based on actual response
    // console.log(`Order Id used for creation is ${orderId}`);
    try {
      const response = await Axios.post(BASE_URL + `/partners/api/v2/order`,
         {
            "quoteId": orderId,
            "hostAddress": '10.10.10.10'
          }, {
        headers: {
            "access-token": accessToken,
            "Content-Type": "application/json",
            "user-id": "kamtchuengrayan@gmail.com",
         }
      });
      setSteps({
        ...steps,
        step3: { status: 'success', data: response.data },
      });
    } catch (error) {
      setSteps({
        ...steps,
        step3: { status: 'error', data: error.message },
      });
    }
  };
*/
  return (
    <div>
      <div className="step">
        <h3>Step 1: Get Quote</h3>
        <button disabled={steps.step1.status !== 'pending'} >Get Quote</button>
        <div className="framed-box">
          {steps.step1.data ? JSON.stringify(steps.step1.data, null, 2) : 'No data yet'}
        </div>
        <div className="light-bulb">
          {steps.step1.status === 'success' ? '✅' : '⚪'}
        </div>
      </div>

      <div className="step">
        <h3>Step 2: Create Order</h3>
        <button disabled={steps.step2.status !== 'pending' || steps.step1.status !== 'success'} >Create Order</button>
        <div className="framed-box">
          {steps.step2.data ? JSON.stringify(steps.step2.data, null, 2) : 'No data yet'}
        </div>
        <div className="light-bulb">
          {steps.step2.status === 'success' ? '✅' : '⚪'}
        </div>
      </div>
      <div className="step">
        <h3>Step 2.5: Access Token</h3>
        <button >Refresh Access Token</button>
        <div className="framed-box">
          {accessToken ? JSON.stringify(accessToken, null, 2) : 'No data yet'}
        </div>
        <div className="light-bulb">
          {steps.step3.status === 'success' ? '✅' : '⚪'}
        </div>
      </div>

      <div className="step">
        <h3>Step 3: Get Order Status</h3>
        <button >Get Order Status</button>
        <div className="framed-box">
          {steps.step3.data ? JSON.stringify(steps.step3.data, null, 2) : 'No data yet'}
        </div>
        <div className="light-bulb">
          {steps.step3.status === 'success' ? '✅' : '⚪'}
        </div>
      </div>
    </div>
  );
};

export default TransakOrderCreation;
