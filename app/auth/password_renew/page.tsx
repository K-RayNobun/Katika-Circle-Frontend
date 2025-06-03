// app/auth/password_renew/page.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { RiKeyFill } from "react-icons/ri";
import AsyncSpinner from '@/components/AsyncSpinner';
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useRouter } from 'next/navigation'; // Use useSearchParams instead of useParams
import { useAppSelector } from '@/lib/redux/hooks';
import axios, { AxiosError } from 'axios';

const PasswordRenew = () => {
    const { t } = useTranslation();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const newPasswordRef = useRef<string>('');
    const confirmPasswordRef = useRef<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    // const hasSubmittedOnceRef = useRef(false);
    // const isSubmittingRef = useRef(false);

    const accessToken = useAppSelector((state) => state.token.token); // Get the access token from Redux store
    const router = useRouter();
     // Read the token from the query string

     useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            // Assuming you want to set the token in the Redux store
            // dispatch(setToken(token));
            console.log('Token from URL:', token);
            setToken(token);
        } else {
            console.error('No token found in the URL');
        }
    }
    , []);


    const postRenewPassword = async (e: React.FormEvent<HTMLElement>) => {
        
        e.preventDefault();
        try {
            console.log('Renew password function called with password:', newPasswordRef.current);
            console.log('Access token:', accessToken);
            console.log('Token Passed:', token);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/reset-password`,
                { "pwd": newPasswordRef.current },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Reset-Header': token,
                    }
                }
            );

            if (response.data.error) {
                setErrorMessage(response.data.error.message);
                return;
            }

            // console.log('Response data: ', response.data.data);
            // console.log('Finished reset email post request');
            setErrorMessage(null);
            router.push('/auth/signin/'); // Redirect to sign-in after success
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response?.status !== 200) {
                setErrorMessage(t('signup.errors.serverError'));
                // console.error('Registration error:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const validatePasswords = useCallback(() => {

        if (newPasswordRef.current.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            setIsPasswordValid(false);
            return false;
        }
        if (newPasswordRef.current !== confirmPasswordRef.current) {
            setErrorMessage('Passwords do not match.');
            setIsPasswordValid(false);
            return false;
        }
        setErrorMessage(null);
        setIsPasswordValid(true);
        console.log('Passwords are valid');
        return true;
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'new-password') {
            newPasswordRef.current = value;
        } else if (id === 'confirm-password') {
            confirmPasswordRef.current = value;
        }
        validatePasswords();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // console.log('Submit function called');
        e.preventDefault();
        // if(!hasSubmittedOnceRef.current) hasSubmittedOnceRef.current = true;
        setIsSubmitting(true);
        postRenewPassword(e); // Call the API to reset the password
    };

    return (
        <div className="grow flex flex-col items-center justify-start h-full bg-white rounded-lg px-12 py-[10%]">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-primary/20 p-2 rounded-full">
                    <RiKeyFill size={24} className="text-primary" />
                </div>
                <h1 className="text-2xl font-semibold text-primary_dark mt-4">
                    {t('passwordRenew.title')}
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    {t('passwordRenew.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        defaultValue={newPasswordRef.current}
                        onChange={handlePasswordChange}
                        placeholder={t('passwordRenew.newPasswordPlaceholder')}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-3 font-semibold flex items-center text-gray_dark/60"
                    >
                        {showNewPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        defaultValue={confirmPasswordRef.current}
                        onChange={handlePasswordChange}
                        placeholder={t('passwordRenew.confirmPasswordPlaceholder')}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 font-semibold flex items-center text-gray_dark/60"
                    >
                        {showConfirmPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
                    </button>
                </div>
                {errorMessage && (
                    <div className="text-red text-center font-semibold text-sm mb-2">
                        {errorMessage}
                    </div>
                )}
                <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary_dark transition ${
                        isSubmitting || !isPasswordValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting || !isPasswordValid}
                >
                    {isSubmitting
                        ? <AsyncSpinner />
                        : t('passwordRenew.resetButton')}
                </button>
            </form>
        </div>
    );
};

export default PasswordRenew;