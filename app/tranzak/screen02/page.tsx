'use client'

import React, { useState } from "react";
import axios from "axios";

const TranzakPageTwo = () => {
  const [formData, setFormData] = useState({
    recipientType: "mobileMoney", // default to mobile money
    phoneNumber: "",
    accountHolder: "",
    iban: "",
    bankCode: "",
    bankName: "",
  });
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const token = process.env.REACT_APP_AUTH_TOKEN;

  // Validate phone number format
  const validatePhoneNumber = (phone: string) => {
    const isValid = phone.startsWith("+2376") && phone.length === 13;
    setIsPhoneValid(isValid);
    return isValid;
  };

  // Handle input changes for mobile money and bank account
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    checkFormValidity();
  };

  // Check if the form is valid (for Mobile Money)
  const checkFormValidity = () => {
    if (formData.recipientType === "mobileMoney") {
      setIsFormValid(isPhoneValid);
    } else {
      setIsFormValid(!!(formData.accountHolder && formData.iban && formData.bankCode && formData.bankName));
    }
  };

  // Handle recipient name check for Mobile Money
  const handleNameCheck = async () => {
    if (!validatePhoneNumber(formData.phoneNumber)) {
      return;
    }
    console.log('Token: ', token);
    try {
      const response = await axios.post(
        'https://dsapi.tranzak.me/xp021/v1/name-verification/create',
        { accountHolderId: formData.phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const verifiedName = response.data.data.verifiedName;
      setRecipientName(verifiedName);
      setIsNameChecked(true);
    } catch (error) {
      console.error("Error fetching recipient name:", error);
      setRecipientName("Utilisateur introuvable");
      setIsNameChecked(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Informations du Destinataire</h1>

        {/* Type de Destinataire */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-bold">Type de destinataire</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="recipientType"
                value="mobileMoney"
                checked={formData.recipientType === "mobileMoney"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span>Mobile Money</span>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="recipientType"
                value="bankAccount"
                checked={formData.recipientType === "bankAccount"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span>Compte Bancaire</span>
            </div>
          </div>
        </div>

        {/* Mobile Money Section */}
        {formData.recipientType === "mobileMoney" && (
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-2">Numéro de Téléphone</label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              onBlur={() => validatePhoneNumber(formData.phoneNumber)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300 ${isPhoneValid ? 'border-green-500' : 'border-gray-300'}`}
              placeholder="+2376XXXXXXXX"
            />
            {isPhoneValid ? (
              <div className="mt-1 text-green-500">✓ Numéro valide</div>
            ) : formData.phoneNumber ? (
              <div className="mt-1 text-red-500">❌ Le numéro doit commencer par +2376 et avoir 13 caractères</div>
            ) : null}
            <button
              onClick={handleNameCheck}
              disabled={!isPhoneValid}
              className={`w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md mt-4 ${!isPhoneValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Vérifier le Nom
            </button>
            {isNameChecked && (
              <div className="mt-4 text-lg font-bold text-center">
                {recipientName || "Utilisateur introuvable"}
              </div>
            )}
          </div>
        )}

        {/* Compte Bancaire Section */}
        {formData.recipientType === "bankAccount" && (
          <div className="space-y-4">
            <div className="mb-6">
              <label htmlFor="accountHolder" className="block text-gray-700 font-bold mb-2">Nom du Titulaire</label>
              <input
                id="accountHolder"
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300"
                placeholder="Nom du titulaire"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="iban" className="block text-gray-700 font-bold mb-2">IBAN</label>
              <input
                id="iban"
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300"
                placeholder="IBAN"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="bankCode" className="block text-gray-700 font-bold mb-2">Code de la Banque</label>
              <input
                id="bankCode"
                type="text"
                name="bankCode"
                value={formData.bankCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300"
                placeholder="Code de la banque"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="bankName" className="block text-gray-700 font-bold mb-2">Nom de la Banque</label>
              <input
                id="bankName"
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300"
                placeholder="Nom de la banque"
              />
            </div>
          </div>
        )}

        {/* Next Button */}
        <button
          disabled={!isFormValid}
          className={`w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md ${isFormValid ? 'hover:from-blue-700 hover:to-purple-700' : 'opacity-50 cursor-not-allowed'}`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default TranzakPageTwo;
