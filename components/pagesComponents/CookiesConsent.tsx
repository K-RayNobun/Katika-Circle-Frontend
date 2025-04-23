'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCookieConsent } from '@/lib/redux/features/metadata/metadataSlice';
import Link from 'next/link';

const CookieConsentModal = () => {
    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const consent = useAppSelector((state) => state.metadata.isCookieConsent!);

    useEffect(() => {
        console.log('COOKIE CONSENT:', consent);
        if (!consent) {
            setShowModal(true)
        }
    }, [])

    const handleAccept = () => {
        dispatch(setCookieConsent(true));
        setShowModal(false);
    }

    if (!showModal) return null

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-[8px] p-6 max-w-md w-full mx-4">
                <h3 className="font-bold text-[20px] text-purple-900 mb-4">Cookie Settings</h3>
                <p className="text-gray-700 mb-6">
                    This website <span className='text-primary_dark'>uses cookies to improve your experience</span>. By continuing to visit this site you agree to its <Link href='/user_agreement' className='text-primary_dark'>Terms</Link> and <Link href='/privacy_policy' className='text-primary_dark'>Privacy Policy</Link>.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={handleAccept}
                        className="w-[30%] bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white font-bold"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CookieConsentModal