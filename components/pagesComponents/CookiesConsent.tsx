'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCookieConsent } from '@/lib/redux/features/metadata/metadataSlice';

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

    const handleDecline = () => {
        dispatch(setCookieConsent(false));
        setShowModal(false);
    }

    if (!showModal) return null

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-[8px] p-6 max-w-md w-full mx-4">
                <h3 className="font-bold text-[20px] text-purple-900 mb-4">Cookie Settings</h3>
                <p className="text-gray-700 mb-6">
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white font-bold"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleDecline}
                        className="flex-1 border-2 border-primary text-primary hover:bg-gray-100 py-[10px] rounded-[8px] font-bold"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CookieConsentModal