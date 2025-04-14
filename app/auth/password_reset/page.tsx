'use client';

import React, {  useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { CgTimer } from "react-icons/cg";
import AsyncSpinner from '@/components/AsyncSpinner';
import { useRouter } from 'next/navigation';

import axios, { AxiosError } from 'axios';


interface ErrorType {
    response: {
        data: {
            message: ''
        }
    }
}

const ResetPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (!validateEmail(value)) {
            setErrorMessage('Please enter a valid email address.');
        } else {
            setErrorMessage('');
        }
    };

    // Get the pathNAme value after /password_reset
    

    const postResetEmail = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/reset-mailer`, 
                {"email": email},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
            
            if (response.data.error) {
                setErrorMessage(response.data.error.message);
                return;
            }

            console.log('Response data: ', response.data.data);
            console.log('Finished reset email post request');
            setErrorMessage('');
            router.push('/auth/mail_check/');
        } catch (err) {
            const axiosError = err as AxiosError;
            const error = err as ErrorType;
            // Handle error `Referral Does not exit Exist`
            
            if (axiosError.response?.status !== 200) {
                setErrorMessage(t('signup.errors.serverError'));
                console.error('Registration error:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    } 

    const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Submitted email:', email);

        // Simulate API call
        postResetEmail(e).then(() => {
            setIsSubmitting(false);
            alert('Reset email sent!');
        });
    };

    return (
            <div className="flex flex-col items-center justify-start grow h-full bg-white rounded-lg lg:rounded-r-lg py-[10%]">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary/20 p-1 rounded-full">
                        <CgTimer size={30} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary_dark mt-4">
                        {t('resetPassword.title')}
                    </h1>
                    <p className="text-gray-600 text-center mt-2">
                        {t('resetPassword.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-10/12 space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            {t('resetPassword.emailLabel')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder={t('resetPassword.emailPlaceholder')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    {/* Error message displays here */}
                    {errorMessage && (
                        <div className="text-red text-center font-semibold text-sm mb-2">
                            {errorMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary_dark transition ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting || !validateEmail(email)}
                    >
                        {isSubmitting
                            ? <AsyncSpinner />
                            : t('resetPassword.send')}
                    </button>
                </form>
            </div>
    );
};

export default ResetPassword;