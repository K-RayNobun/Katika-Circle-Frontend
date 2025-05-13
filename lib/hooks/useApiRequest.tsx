import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useTranslation } from "./useTranslation";
import { store } from "../redux/store";
import { ErrorMessage } from "@/components/ErrorComponent";
import { createPortal } from "react-dom";

interface ApiRequestState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

const getAccessToken = () => {
    return store.getState().token.token;
}

// SIGNIN SINGNUP RENEWPASSWORD RESETPASSWORD
export function useApiGet<T>() {
    
    const { t } = useTranslation();
    const [state, setState] = useState<ApiRequestState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });
    const [response, setResponse] = useState<T|null>();
    const [showError, setShowError] =useState(true);
    const fetchData = async (url: string, isTokenNecessary = true) => {
        const accessToken = getAccessToken();
        try {
            if (!url) return;

            if (isTokenNecessary) {
                console.log('-------------- The access token is --------------\n', accessToken);
                const response = await axios.get(url, {
                    headers: {
                        ...(isTokenNecessary && accessToken && {Authorization: `Bearer ${accessToken}`}),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });

                if (url === 'https://api-stg.transak.com/api/v2/countries') {
                    setState({
                        data: response.data.response,
                        isLoading: false,
                        error: null
                    });
                    return response.data.response as T;
                }

                setState({
                    data: response.data.data,
                    isLoading: false,
                    error: null
                });
                return response.data.data as T;
            } else {

                if (url.includes('/auth/account/referral/parent?code=')) {
                    console.log('This is a GET request for the referral code');
                } else {
                    console.log('This is rather the url', url);
                }

                const response = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });

                setState({
                    data: response.data.data,
                    isLoading: false,
                    error: null
                });
                setResponse(response.data.data);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            let errorMessage = t('errors.axiosError.default');

            if (axios.isAxiosError(error)) {
                switch (axiosError.response?.status) {
                    case 401:
                        errorMessage = t('errors.axiosError.unauthorized');
                        break;
                    case 403:
                        errorMessage = t('errors.axiosError.forbidden');
                        break;
                    case 404:
                        errorMessage = t('errors.axiosError.notFound');
                        break;
                    case 422:
                        errorMessage = t('errors.axiosError.validationError');
                        break;
                    case 429:
                        errorMessage = t('errors.axiosError.tooManyRequests');
                        break;
                    case 500:
                        errorMessage = t('errors.axiosError.serverError');
                        if (url.includes('/auth/account/referral/parent?code=')) {
                            console.log('This is a GET request for the referral code', error.response!.data.data);
                            if (error.response!.data.data.includes("Can't find parent referral with code")) {
                                errorMessage = 'Inexistant referral code';
                                return errorMessage;
                            }
                        }
                        break;
                }
            }

            setState({
                data: null,
                isLoading: false,
                error: errorMessage
            })
            setResponse(null);
            setShowError(true);

            setTimeout(() => setShowError(false), 5000);
        }

        return response;
    }

    const errorPopup = showError && state.error ?
        createPortal(
            <div className="fixed top-4 right-4 z-50">
                <ErrorMessage
                    message={state.error}
                    onRetry={() => setShowError(false)}
                />
            </div>,
            document.body
        ) : null;

       if (errorPopup) console.log('------------ An Error has been transaferred to errorMessage ------------\n Which is ', state.error);

    return {...state, fetchData, errorPopup};
}

export function useApiPost<T, P>() {
    const [state, setState] = useState<ApiRequestState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });
    // const [showError, setShowError] = useState(false);
    // const [errorPopup, setErrorPopup] = useState<React.ReactPortal | null>(null);

    const { t } =  useTranslation();

    const executePost = async (url: string, payload: P, isTokenNecessary=true) => {

        const accessToken = getAccessToken();

        setState(prev => ({ ...prev, isLoading: true, error: null}));
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    ...( isTokenNecessary && {Authorization: `Bearer ${accessToken}`}),
                    "Content-Type": 'application/json'
                }
            });
            console.log('POST Request Response', response);

            setState({
                data: response.data.data,
                isLoading: false,
                error: null
            });
        

            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            let errorMessage = t('errors.axiosError.default');

            if (axios.isAxiosError(error)) {
                switch (axiosError.response?.status) {
                    case 401:
                        errorMessage = t('errors.axiosError.unauthorized');
                        break;
                    case 403:
                        errorMessage = t('errors.axiosError.forbidden');
                        break;
                    case 404:
                        errorMessage = t('errors.axiosError.notFound');
                        break;
                    case 422:
                        errorMessage = t('errors.axiosError.validationError');
                        break;
                    case 429:
                        errorMessage = t('errors.axiosError.tooManyRequests');
                        break;
                    case 500:
                        errorMessage = t('errors.axiosError.serverError');
                        break;
                }
            }

            setState({
                data: null,
                isLoading: false,
                error: errorMessage
            });

            throw new Error(errorMessage);
        }
    }

    return { ...state, executePost };
}