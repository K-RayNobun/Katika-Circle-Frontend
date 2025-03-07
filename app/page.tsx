'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CookieConsent, { Cookies} from "react-cookie-consent";
import axios from "axios";
import { GoogleOAuthProvider } from '@react-oauth/google'

//Redux import ;
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { increment, decrement, incrementByAmount } from "@/lib/redux/features/counterSlice";

const HomePage = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [userIp, setUserIp] = useState<string>('');
  const [isCookie, setIsCookie] = useState(false);
  const [amount, setAmount] = useState(0)

  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value)

  const AcceptCookie = async () => {
    await Cookies.set("userIp", userIp, { path: "/" });
    setIsCookie(true);
  }; 

  const getUserIp = async () => {
    let res;
    res = await axios.get("https://api.ipify.org/?format=json");
    await setUserIp(res.data.ip);
  }

  useEffect(() => {
    const storedIp = Cookies.get("userIp");

    if (storedIp) {
      setUserIp(storedIp);
      setIsCookie(true);
      console.log('Cookie is: ', storedIp);
    } else {
      getUserIp()
    };
  },);

  const router = useRouter();

  // Simulate banner animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBannerVisible(true);
    }, 500); // Delay for banner animation
    return () => clearTimeout(timer);
  }, []);

  // Handle button click animation
  const handleSendMoneyClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => {
      // Navigate to the next screen (e.g., using a router)
      console.log("Navigating to the next screen...");
    }, 300); // Simulate a delay for the micro-animation
    setIsButtonClicked(false);
    router.push('/tranzak');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <h5 className="text-4xl font-bold tet-center my-6">Counter: {count}</h5>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Decrement
        </button>
        {/* Input field for custom increment */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20 text-center"
        />
        <button
          onClick={() => dispatch(incrementByAmount(amount))}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Increment by {amount}
        </button>
      </div>
      </div>
      { isCookie ?
      <div>
        {/* Banner with slide-down animation */}
        <div
          className={`w-full max-w-2xl bg-blue-500 text-white p-4 rounded-lg mb-8 transition-all duration-700 ease-in-out transform ${
            isBannerVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}>
          <p className="text-center">💱 Taux de change actuel : 1 EUR = 1.10 USD</p>
        </div>

        {/* Cards with slide-up and fade-in animations */}
        <div className="w-full max-w-2xl space-y-6">
          <div
            className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
            style={{ animation: "slideUpFadeIn 0.8s ease-in-out" }}
          >
            <h2 className="text-xl font-bold text-blue-800">Cashback</h2>
            <p className="text-gray-600">Gagnez jusqu'à 5% de cashback sur vos transactions.</p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
            style={{ animation: "slideUpFadeIn 1s ease-in-out" }}
          >
            <h2 className="text-xl font-bold text-purple-800">Bonus de Parrainage</h2>
            <p className="text-gray-600">Parrainez un ami et obtenez un bonus de 10€.</p>
          </div>
        </div>

        {/* Send Money Button */}
        <button
          onClick={handleSendMoneyClick}
          className={`mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out ${
            isButtonClicked ? "animate-dance" : "active:animate-dance hover:shadow-lg hover:from-blue-700 hover:to-purple-700"
          }`}
        >
          Envoyer de l'argent
        </button>
      </div>
      :
      userIp.length >= 1 && <CookieConsent
      debug={true}
      // extraCookieOptions={{domain: "katika.io"}}
      onAccept={() => AcceptCookie()}
      style={{ backgroundColor:'#4e0a8e', color:"white", fontSize:"13px" }}
      buttonText="Accept Cookies"
      buttonStyle={{ color: '#4e0a8e', backgroundColor: '#fff', borderRadius: '30px', padding: '12px 20px', fontWeight: 'bolder' }}
      contentStyle={{ fontWeight: "medium", fontSize: 16, padding: '15px 50px', }}
      expires={150}
      >
        We use cookies to ensure you have the best browsing experience on our website.
      </CookieConsent>
      }
    </div>
  );
};

export default HomePage;