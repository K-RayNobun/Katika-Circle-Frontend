import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { AppProps } from "next/app";

const MyApp = ({ Component,  pageProps}: AppProps) => {
        const [loading, setLoading] = useState(true);
        useEffect(() => {
            console.log('Going to launch the Spinner');
            const timer = setTimeout(() => {
                setLoading(false);
                console.log('Spinner is going');
            }, 2000);

            return () => {
                clearTimeout(timer);
                setLoading(true);
            };
        }, []);

        return (
            <>
                {
                loading ? <Spinner />: (
                    <Component className='text-stone-700' {...pageProps} />
                )}
            </>
        );
}

export default MyApp;