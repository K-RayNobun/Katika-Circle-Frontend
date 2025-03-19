import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faQrcode } from '@fortawesome/free-solid-svg-icons';

const ReferralSection = ({ referralCode, setIsDialogVisible }: { referralCode:string, setIsDialogVisible:(isDialogVisible:boolean) => void }) => {
    return (
        <div className={`w-full bg-primary/15 rounded-[12px] p-[16px] flex flex-col gap-[16px]`}>
            <h5 className={`text-[14px] text-primary font-semibold`}>Your Referral Code</h5>
            <div className={`flex bg-primary/30 justify-between h-[49px] rounded-[5px] p-[10px]`}>
                <input type='text' value={referralCode} readOnly={true} className={`appearance-none bg-transparent text-[14px] text-primary font-bold`} style={{ MozAppearance: 'none' }} />
                <button className={`w-[48px] bg-primary hover:bg-primary_dark active:bg-primary_dark text-[12px] rounded-[4px] text-white font-bold`}>Copy</button>
            </div>
            <div className={`w-full gap-[18px] flex justify-between`}>
                <button onClick={() => setIsDialogVisible(true)} className={`gap-[8px] grow bg-primary flex justify-center rounded-[8px] px-[36px] gap-[12px] py-[10px]`}>
                    <FontAwesomeIcon className={`h-[20px] text-white`} icon={faUserPlus} />
                    <h5 className={`font-bold text-[16px] text-white`}>Invite Friends</h5>
                </button>
                <button className={`bg-primary grow rounded-[8px] px-[20px] py-[8px]`}>
                    <FontAwesomeIcon className={`text-white h-[24px]`} icon={faQrcode} />
                </button>
            </div>
        </div>
    );
};

export default ReferralSection;