'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const TranzakPageOne = () => {

    const router = useRouter();

  const [formData, setFormData] = useState({
    amount: "",
    selectedPaymentMode: "",
  });
  const [validation, setValidation] = useState({
    isAmountValid: false,
  });
  const [exchangeRate, setExchangeRate] = useState<number>();
  const [gain, setGain] = useState(0);
  const [currency, setCurrency] = useState("XAF");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchExchangeRate();
  }, [currency]);
  // List of countries and their currencies
  const countries = [
    { name: "Cameroun", currency: "XAF" },
    { name: "Sénégal", currency: "XOF" },
    { name: "Côte d'Ivoire", currency: "XOF" },
    // Add more countries as needed
  ];

  // Fetch exchange rate (for example from a mock API)
  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
      const usdOff = response.data.rates[currency]; // Assume XOF is the target currency
      console.log('Taux Officiel:', usdOff);
      const usdKatika = usdOff - 15;
      setExchangeRate(usdKatika);
      console.log('Exchange Rate', exchangeRate);
      // Example gain calculation
      setGain((1 - (usdKatika / usdOff)) * 100); // Example: gain in percentage
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, amount: value }));
    setValidation((prev) => ({
      ...prev,
      isAmountValid: /^\d+$/.test(value), // Only accept numbers
    }));
    fetchExchangeRate();
  };

  // Handle country selection
  const handleCountrySelect = (country: { name: string, currency: string }) => {
    setFormData((prev) => ({ ...prev, selectedPaymentMode: country.name }));
    setCurrency(country.currency);
    setIsDropdownOpen(false);
  };

  // Check if the form is valid
  const isFormValid = validation.isAmountValid && formData.selectedPaymentMode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Envoyer de l'argent</h1>

        {/* Montant à Envoyer */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Montant à envoyer (USD)</label>
          <input
            id="amount"
            type="text"
            value={formData.amount}
            onChange={handleAmountChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300 ${validation.isAmountValid ? 'border-green-500' : 'border-gray-300'}`}
            placeholder="Entrez le montant"
            aria-describedby="amountHelp"
          />
          <small id="amountHelp" className={`block mt-1 ${validation.isAmountValid ? 'text-green-500' : 'text-red-500'}`}>
            {validation.isAmountValid ? '✓ Montant valide' : '❌ Veuillez entrer un nombre valide'}
          </small>
          {exchangeRate && validation.isAmountValid && (
            <div className="mt-3 text-sm text-gray-600">
              <div>Taux de Change: 1 USD = {exchangeRate.toFixed(2)} {currency}</div>
              <div>Gain par rapport au taux officiel: {gain.toFixed(2)}%</div>
            </div>
          )}
        </div>

        {/* Pays Destinataire */}
        <div className="mb-6">
          <label htmlFor="countrySelect" className="block text-gray-700 font-bold mb-2">Pays Destinataire</label>
          <div className="relative">
            <button
              id="countrySelect"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left focus:outline-none"
            >
              {formData.selectedPaymentMode || "Sélectionnez un pays"}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    onClick={() => handleCountrySelect(country)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {currency && (
            <div className="mt-2 text-sm text-gray-600">
              Monnaie: <span className="font-bold">{currency}</span>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          disabled={!isFormValid}
          onClick={() => { router.push('/tranzak/screen02') }}
          className={`w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md ${isFormValid ? 'hover:from-blue-700 hover:to-purple-700' : 'opacity-50 cursor-not-allowed'}`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default TranzakPageOne;
