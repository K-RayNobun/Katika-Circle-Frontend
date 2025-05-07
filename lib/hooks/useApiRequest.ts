import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useTranslation } from "./useTranslation";
import { useAppSelector } from "../redux/hooks";
import { store } from "../redux/store";

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
    const fetchData = async (url: string, isTokenNecessary = true) => {
        const accessToken = getAccessToken();
        console.log('-------------- Fetching Data --------------');
        try {
            if (!url) return;

            if (isTokenNecessary) {
                console.log('Requesting with token: ', accessToken);

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
                    // console.log('Countreis Data List: ', response.data.response);
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
        }

        return response;
    }

    return {...state, fetchData};
}

export function useApiPost<T, P>() {
    const accessToken = useAppSelector((state) => state.token.token);
    const [state, setState] = useState<ApiRequestState<T>>({
        data: null,
        isLoading: false,
        error: null,
    })

    const { t } =  useTranslation();

    const executePost = async (url: string, payload: P, isTokenNecessary=true) => {
        setState(prev => ({ ...prev, isLoading: true, error: null}));
        try {
            console.log('Requesting with token: ', accessToken);
            const response = await axios.post(url, payload, {
                headers: {
                    ...( isTokenNecessary && {Authorization: `Bearer ${accessToken}`}),
                    "Content-Type": 'application/json'
                }
            });

            setState({
                data: response.data.data,
                isLoading: false,
                error: null
            });

            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            let errorMessage = t('error.axiosError.default');

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
    };

    return { ...state, executePost };
}