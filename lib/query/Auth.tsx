
/*import React, { useState} from "react";
import axios, { AxiosError } from "axios";

// Redux related imports
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { renewToken } from "../redux/features/token/tokenSlice";
const accessToken = useAppSelector((state) => state.token.token);
 
const dispatch =  useAppDispatch();


export const registerUser = async (e: React.FormEvent<HTMLElement>, formRef, selectedCountry, setError: (msg: string) => void, setIsSubmitting: (bool: boolean) => void, isRegistratedRef) => {
    e.preventDefault();
    try {
        console.log('Registering user');
        const formData = new FormData(formRef.current!);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/account/signin`, 
            {
                "fname": formData.get('user_firstname') as string,
                "lname": formData.get('user_name') as string,
                "email": formData.get('user_email')! as string,
                "pwd": formData.get('password') as string,
                "countryCode": selectedCountry!.name,
                "pReferralCode": formData.get('ref_code') as string,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        
        if (response.data.error) {
            setError(response.data.error.message || 'Registration failed');
            return;
        }

        console.log('User data: ', response.data.data);
        let accessToken = (response.data.data['access-token'])
        isRegistratedRef.current = true;
        console.log('Finished registering user');
        dispatch(renewToken({
            token: response.data.data['access-token'],
            expiresIn: null
        }));
        sendOTP();
    } catch (error) {
        const axiosError = error as AxiosError;
        setIsSubmitting(false);
        if (axiosError.response?.status === 500) {
            setError('User already exists');
            console.error('Registration error:', error);
        } else if (axiosError.response?.status !== 200) {
            setError(axiosError.response?.statusText + '\n Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    }
}
*/