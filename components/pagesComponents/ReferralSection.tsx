import React, { useRef } from 'react';
import AsyncSpinner from '../AsyncSpinner';
import { IoQrCode } from "react-icons/io5";
import { LuUserRoundPlus } from "react-icons/lu";

const ReferralSection = ({ referralCode, setIsDialogVisible }: { referralCode:string, setIsDialogVisible:(isDialogVisible:boolean) => void }) => {
    const isSubmittingRef = useRef(false)

    const showReferralLink = () => {
        setIsDialogVisible(true);
        isSubmittingRef.current = true;
    }
    
    return (
        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px] flex flex-col gap-[16px]`}>
            <h5 className={`text-[14px] text-primary font-semibold`}>Your Referral Code</h5>
            <div className={`flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]`}>
                <input type='text' value={referralCode} readOnly={true} className={`appearance-none bg-transparent text-[14px] text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                <button className={`w-[48px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] rounded-[4px] text-white font-bold`}>Copy</button>
            </div>
            <div className={`w-full gap-[18px] flex justify-between`}>
                <button onClick={showReferralLink} className={`gap-[8px] grow bg-primary flex justify-center rounded-[8px] px-[36px] gap-[12px] py-[10px] ${isSubmittingRef.current ? 'opacity-50' : ''}`}>
                    {isSubmittingRef.current ? (
                        <>
                            <AsyncSpinner />
                            {/* <h6 className='text-center font-bold'>Processing...</h6> */}
                        </>
                    ) : (
                        <div>
                            <LuUserRoundPlus className={`h-[20px] text-white`} />
                            <h5 className={`font-bold text-[16px] text-white`}>Invite Friends</h5>
                        </div>
                    )}
                </button>
                <button className={`bg-primary grow rounded-[8px] px-[20px] py-[8px]`}>
                    <IoQrCode className={`text-white h-[24px]`} />
                </button>
            </div>
        </div>
    );
};

export default ReferralSection;