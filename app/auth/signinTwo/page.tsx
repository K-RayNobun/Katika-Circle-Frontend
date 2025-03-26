'use client'

import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL // Charger l'URL depuis .env

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  
  },
});

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    pwd: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/account/login", credentials
       );

      localStorage.setItem("adminToken", data.data["access-token"]);
      console.log('successful login Two with credentials result', data.data["access-token"]);
    //   navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Échec de la connexion";
      setError(errorMessage);
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-600 to-pink-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-purple-800 py-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Katika Wallet</h2>
            <p className="mt-2 text-purple-200">Connectez-vous pour accéder au tableau de bord</p>
          </div>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="pwd"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.pwd}
                  onChange={handleChange}
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md 
                         text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-purple-500 font-medium transition-colors"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;