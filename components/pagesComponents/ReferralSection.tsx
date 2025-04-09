import React, { useState, useRef } from 'react';
import AsyncSpinner from '../AsyncSpinner';
import { IoQrCode } from "react-icons/io5";
import { LuUserRoundPlus } from "react-icons/lu";
import ReferralDialogBox from '../ReferralDialogBox';
import { useAppSelector } from '@/lib/redux/hooks';
// import QrCodeDialog from '../QrCodeDialog';

import { useTranslation } from '@/lib/hooks/useTranslation';

const ReferralSection = ({ referralCode,  isScreenVisible }: { referralCode:string, isScreenVisible?:boolean | null }) => {
    const isSubmittingRef = useRef(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false)
    const userData = useAppSelector((state) => state.user);
    const [isCopied, setIsCopied] = useState(false);

    // Referral Code Query Params
    const referralCodeParam = {
        ref_code: userData.referralCode?.toString() || '',
    };
    const queryParams = new URLSearchParams(referralCodeParam).toString();


    const showReferralLink = () => {
        setIsDialogVisible(true);
        isSubmittingRef.current = true;
    }

    const closeRefLinkModal = () => {
        setIsDialogVisible(false);
        isSubmittingRef.current = false;
        
    }

    // Function made to display Copied for x seconds
    const copyReferral = async () => {
        try {
            // Check if the referral code exists
            if (!referralCode) {
                console.error('No referral code to copy');
                return;
            }
    
            // Use modern clipboard API with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(referralCode);
                setIsCopied(true);
            } else {
                // Fallback method using textarea
                const textArea = document.createElement('textarea');
                textArea.value = referralCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setIsCopied(true);
            }
    
            // Reset copy state after seconds
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
    
            // Cleanup timer on component unmount or re-render
            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Failed to copy referral code:', error);
            // You might want to show an error message to the user
        }
    }

    const {t} = useTranslation();
    
    return (
        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px] flex flex-col gap-[16px]`}>
            <h5 className={`text-[14px] text-primary font-semibold`}>{String(t('referralSection.yourReferralCode'))}</h5>
            <div className={`relative flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]`}>
                <input type='text' value={referralCode} readOnly={true} className={`appearance-none bg-transparent text-[14px] text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                <button disabled={isCopied} onClick={copyReferral} className={`absolute right-[10px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] px-[8px] py-[6px] rounded-[4px] text-white font-bold`}>{isCopied ? 
                        t('referralSection.copied') : 
                        t('referralSection.copy')
                    }</button>
            </div>
            <div className={`w-full gap-[18px] flex justify-between`}>
                <button onClick={showReferralLink} className={`gap-[8px] grow bg-primary flex justify-center rounded-[8px] px-[8px] lg:px-[36px] gap-[12px] py-[10px] ${isSubmittingRef.current ? 'opacity-50' : ''}`}>
                    {isSubmittingRef.current ? (
                        <>
                            <AsyncSpinner />
                        </>
                    ) : (
                        <div className={`w-full gap-[10px] flex justify-center items-center`}>
                            <LuUserRoundPlus size={20} className={`text-white`} />
                            <h5 className={`font-bold text-[12px] lg:text-[16px] text-white`}>{t('referralSection.inviteFriends')}</h5>
                        </div>
                    )}
                </button>
                <button className={`bg-primary grow rounded-[8px] px-[20px] py-[8px]`} title={t('referralSection.shareQRCode')}>
                    <IoQrCode className={`text-white text-center w-full h-[24px]`} />
                </button>
            </div>
            {/* Dialog Box */}
            {isDialogVisible && !isScreenVisible && (
                <ReferralDialogBox text={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup?${queryParams}`} onClose={closeRefLinkModal} />
            )}
        </div>
    );
};

export default ReferralSection;