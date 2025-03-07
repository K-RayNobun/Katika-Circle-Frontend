'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setToken } from '@/lib/redux/features/token/tokenSlice';

const storageKey = 'TransaktorUsersDb';

const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] =  useState('');
  const [confirmPassword, setConfirmPassword] =  useState('');
  const [referralCode, setReferralCode] = useState('');

  const router = useRouter();

  const navigateToHome = () => {
    router.push('/');
  };

  const getUsersFromStorage = () => {
    const users = localStorage.getItem(storageKey);
    return users ? JSON.parse(users) : [];
  }

  const saveUsersToStorage = (users: []) => {
    localStorage.setItem(storageKey, JSON.stringify(users))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users = getUsersFromStorage();

    const user = users.find(
        (user: any) =>  user.email === email && user.password == password
    );

    if (user) {
        alert('Login succesful');
        // Navigate to the next page
        navigateToHome();
    }
  }

  const handleSignup = (e) => {
    // Takes input fields value
    // Check if password and password confitm correspond
    if ( password !== confirmPassword ) {
        alert("Passwords does not match!");
    }

    const user = { email, password, referralCode };
    const users = getUsersFromStorage();

    if ( users.find((user: any) => user.email === email)) {
        alert(' Email already exists!')
        return;
    }

    users.push(user);
    saveUsersToStorage(users);

    alert("Signup successful!")
}

return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup ? (
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Referral Code</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter referral code"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
            >
              Login
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-purple-700 hover:text-purple-900"
          >
            {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
      >
        Login
      </button>
    </form>
  );
};

const SignupForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700">Referral Code</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your referral code"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your password"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700">Confirm Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Confirm your password"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
      >
        Sign Up
      </button>
    </form>
  );
};

export default LoginPage;
