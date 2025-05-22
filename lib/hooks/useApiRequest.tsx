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

// LOGIN SINGNUP RENEWPASSWORD RESETPASSWORD


export function useApiGet() {
    const { t } = useTranslation();

    async function fetchData(url: string, isTokenNecessary=true) {
        try {
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(isTokenNecessary && getAccessToken() && {Authorization: `Bearer ${getAccessToken()}`})
                    }
                }
            );

            return {response: response.data.data, error: null}
        } catch(error) {
            const axiosError = error as AxiosError;
            let errorMessage = '' as string;

            if (axiosError) {
                if (axiosError.message === 'Network Error') {
                    errorMessage = 'Network Error';
                } else {
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
                            console.log('This is a 500 error', axiosError);
                            if (typeof axiosError.response.data === 'object' && axiosError.response.data && "message" in axiosError.response.data) {
                                errorMessage = axiosError.response.data.message!.toString();
                            } else {
                                errorMessage = t('errors.axiosError.server');
                            }
                            break;
                        default:
                            errorMessage = t('errors.axiosError.default');
                    }
                }
                
            } else {
                console.log("This error is not an axiosError");
            }

            return {response: null, error: errorMessage}
        }
    }

    return {fetchData}
}


















export function useApiGetHook<T>() {
    
    const { t } = useTranslation();
    const [state, setState] = useState<ApiRequestState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });
    const [response, setResponse] = useState<T|null>();
    const [showError, setShowError] =useState(true);
    const fetchData = async (url: string, isTokenNecessary = true) => {
        setState(prev => ({ ...prev, isLoading: true, error: null}));
        try {
            if (!url) return;

                const headers = {
                    ...(isTokenNecessary && getAccessToken() && 
                        {Authorization: `Bearer ${getAccessToken()}`}),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }

                const response = await axios.get(url, { headers });
                let responseData;

                // Handle different response structures
                if (url === 'https://api-stg.transak.com/api/v2/countries' || url === 'https://api.transak.com/api/v2/countries') {
                    responseData = response.data.response;
                } else {
                    responseData = response.data.data;
                }

                // Update state and return data atomically
                setState({
                    data: responseData,
                    isLoading: false,
                    error: null
                });

                return responseData as T;

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


export function useApiPost() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    async function executePost<P>(url: string, payload: P, isTokenNecessary = true) {
        setIsLoading(true);
        try {
            const response = await axios.post(
                url,
                payload,
                {
                    headers: {
                        ...(isTokenNecessary && getAccessToken() && {"Authorization": `Bearer ${getAccessToken()}`}),
                        "Content-Type": 'application/json',
                    }
                },
            )

            console.log('Error Processed correctly')

            return {response: response.data.data, error: null};
        }
        catch (error) {
            console.log('---------------- An error occured ----------------')
            const axiosError = error as AxiosError;
            let errorMessage  = '' as string;
            // Display the Network Error, 40.. error status messages and the 500 type error from axios.message 

            if (axiosError) {
                if (axiosError.message === 'Network Error') {
                    errorMessage = 'Network Error';
                } else {
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
                            console.log('This is a 500 error', axiosError);
                            if (typeof axiosError.response.data === 'object' && axiosError.response.data && "message" in axiosError.response.data) {
                                errorMessage = axiosError.response.data.message!.toString();
                            } else {
                                errorMessage = t('errors.axiosError.server');
                            }
                            break;
                        default:
                            errorMessage = t('errors.axiosError.default');
                    }
                }
                
            } else {
                console.log("This error is not an axiosError");
            }
            return { response: null, error: errorMessage};
        }
    }

    return {executePost, isLoading}

}

































export function useApiPostHook<T, P>() {
    const [state, setState] = useState<ApiRequestState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });
    // const [showError, setShowError] = useState(false);
    // const [errorPopup, setErrorPopup] = useState<React.ReactPortal | null>(null);

    const { t } =  useTranslation();
    // This function returns a promise of the data if it succeeds
    // or an error message if it fails
    const executePost = async (url: string, payload: P, isTokenNecessary=true) => {

        const accessToken = getAccessToken();

        setState(prev => ({ ...prev, isLoading: true, error: null}));
        try {
            console.log('Going for the POST request with accessToken', accessToken);
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
            let errorResponse: string | undefined = undefined;
            if (
                axiosError.response &&
                axiosError.response.data &&
                typeof axiosError.response.data === 'object' &&
                'message' in axiosError.response.data
            ) {
                errorResponse = (axiosError.response.data as { message?: string }).message;
            }
            console.log('Error in POST request', axiosError.message);

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
                        errorMessage = t('errors.axiosError.server');
                        break;
                }
                
                return {"message": errorMessage, "data": errorResponse};
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