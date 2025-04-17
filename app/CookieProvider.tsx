'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'

const CookieError = () => (
    <div className="fixed inset-0 bg-white z-40 flex items-center justify-center">
        <div className="text-center p-6">
            <h3 className="font-bold text-[24px] text-purple-900 mb-4">Cookies Required</h3>
            <p className="text-gray-700">
                Please accept cookies to continue using this website.
                <br />
                Refresh the page to see cookie settings again.
            </p>
        </div>
    </div>
)

export function withCookieProtection<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithCookieProtection(props: P) {
        const [loading, setLoading] = useState(true)
        const cookieConsent = useAppSelector((state) => state.metadata.isCookieConsent);

        useEffect(() => {
            setLoading(false)
        }, [])

        if (loading) {
            return null
        }

        if (!cookieConsent) {
            return <CookieError />
        }

        return <WrappedComponent {...props} />
    }
}