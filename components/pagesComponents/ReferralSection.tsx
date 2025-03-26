import React, { useState, useRef } from 'react';
import AsyncSpinner from '../AsyncSpinner';
import { IoQrCode } from "react-icons/io5";
import { LuUserRoundPlus } from "react-icons/lu";
import DialogBox from '../DialogBox';
import { useAppSelector } from '@/lib/redux/hooks';
import QrCodeDialog from '../QrCodeDialog';

const ReferralSection = ({ referralCode,  isScreenVisible }: { referralCode:string, isScreenVisible?:boolean | null }) => {
    const isSubmittingRef = useRef(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false)
    const userData = useAppSelector((state) => state.user);

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
    
    return (
        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px] flex flex-col gap-[16px]`}>
            <h5 className={`text-[14px] text-primary font-semibold`}>Your Referral Code</h5>
            <div className={`relative flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]`}>
                <input type='text' value={referralCode} readOnly={true} className={`appearance-none bg-transparent text-[14px] text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                <button className={`absolute right-[10px] w-[48px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] px-[4px] py-[6px] rounded-[4px] text-white font-bold`}>Copy</button>
            </div>
            <div className={`w-full gap-[18px] flex justify-between`}>
                <button onClick={showReferralLink} className={`gap-[8px] grow bg-primary flex justify-center rounded-[8px] px-[8px] lg:px-[36px] gap-[12px] py-[10px] ${isSubmittingRef.current ? 'opacity-50' : ''}`}>
                    {isSubmittingRef.current ? (
                        <>
                            <AsyncSpinner />
                            {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                        </>
                    ) : (
                        <div className={`w-full gap-[10px] flex justify-center items-center`}>
                            <LuUserRoundPlus size={20} className={`text-white`} />
                            <h5 className={`font-bold text-[12px] lg:text-[16px] text-white`}>Invite Friends</h5>
                        </div>
                    )}
                </button>
                <button className={`bg-primary grow rounded-[8px] px-[20px] py-[8px]`}>
                    <IoQrCode className={`text-white text-center w-full h-[24px]`} />
                </button>
            </div>
            {/* Dialog Box */}
            {isDialogVisible && !isScreenVisible && (
                <DialogBox text={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup?${queryParams}`} onClose={closeRefLinkModal} />
            )}
        </div>
    );
};

export default ReferralSection;