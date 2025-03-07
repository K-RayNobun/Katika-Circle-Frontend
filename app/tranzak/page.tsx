'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";

const TranzakPageOne = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipientPhone: "",
    selectedPaymentMode: "",
  });
  const [validation, setValidation] = useState({
    isAmountValid: false,
    isPhoneValid: false,
  });
  const [nameCheck, setNameCheck] = useState('Souley');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState("");

  const token = process.env.REACT_APP_AUTH_TOKEN;

  // List of countries and their currencies
  const countries = [
    { name: "Orange Money", currency: "OM" },
    { name: "Mobile Money", currency: "MOMO" },
  ];

  // Check if the form is valid
  const isFormValid = validation.isAmountValid && formData.selectedPaymentMode && validation.isPhoneValid;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, amount: value }));
    setValidation((prev) => ({
      ...prev,
      isAmountValid: /^\d+$/.test(value),
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, recipientPhone: value }));
  };

  const validatePhoneNumber = () => {
    const isValid = formData.recipientPhone.startsWith('+2376') && formData.recipientPhone.length === 13;
    setValidation((prev) => ({ ...prev, isPhoneValid: isValid }));
  };

  const handleCountrySelect = (country: { name: string, currency: string }) => {
    setFormData((prev) => ({ ...prev, selectedPaymentMode: country.name }));
    setCurrency(country.currency);
    setIsDropdownOpen(false);
  };

  const handleNameCheck = async () => {
    console.log('Token is:', token)
    try {
      const response = await axios.post('https://dsapi.tranzak.me/xp021/v1/name-verification/create', 
        {
          accountHolderId: formData.recipientPhone
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setNameCheck(response.data.data.verifiedName);
    } catch (error) {
      console.error('Error during name check:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Envoyer de l'argent</h1>

        {/* Montant */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Montant</label>
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
        </div>

        {/* Numéro du destinataire */}
        <div className="mb-6">
          <label htmlFor="recipientPhone" className="block text-gray-700 font-bold mb-2">Numéro du Destinataire</label>
          <input
            id="recipientPhone"
            type="text"
            value={formData.recipientPhone}
            onChange={handlePhoneChange}
            onBlur={validatePhoneNumber}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300 ${validation.isPhoneValid ? 'border-green-500' : 'border-gray-300'}`}
            placeholder="+2376XXXXXXXX"
            aria-describedby="phoneHelp"
          />
          <small id="phoneHelp" className={`block mt-1 ${validation.isPhoneValid ? 'text-green-500' : 'text-red-500'}`}>
            {validation.isPhoneValid ? `✓ Numéro valide : ${nameCheck}` : '❌ Le numéro doit commencer par +2376 et avoir 13 caractères.'}
          </small>
        </div>

        {/* Sélection du pays */}
        <div className="mb-6">
          <label htmlFor="countrySelect" className="block text-gray-700 font-bold mb-2">Nature du destinataire</label>
          <div className="relative">
            <button
              id="countrySelect"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left focus:outline-none"
            >
              {formData.selectedPaymentMode || "Sélectionnez la nature du destinataire"}
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
              Service destinataire : <span className="font-bold">{currency}</span>
            </div>
          )}
        </div>

        {/* Bouton suivant */}
        <button
          disabled={!isFormValid}
          className={`w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md ${isFormValid ? 'hover:from-blue-700 hover:to-purple-700' : 'opacity-50 cursor-not-allowed'}`}
          onClick={handleNameCheck}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default TranzakPageOne;
