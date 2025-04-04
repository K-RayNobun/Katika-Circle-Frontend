import { IoMdInformationCircle, IoMdArrowBack } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import React from 'react';

// Redux related imports
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { resetTransaction } from "@/lib/redux/features/transaction/transactionSlice";
import { useTranslation } from '@/lib/hooks/useTranslation';

interface screenProps {
    onClose: () => void,
    moveToScreen: (index: number) => void,
}

const ScreenThree = ({onClose, moveToScreen}: screenProps) => {
    const { translations } = useTranslation();
    const transactionDetails = useAppSelector((state) => state.transaction);
    const dispatch = useAppDispatch();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(resetTransaction());
        moveToScreen(1);
    }

    return (
        <div className={`flex flex-col w-full lg:w-[502px] h-[90%] rounded-t-[12px] lg:rounded-[12px] p-[32px] lg:p-[44px] pb-[40%] bg-white`}>
            <div className='flex items-center gap-[12px] ml-[-12px]'>
                <button onClick={() => moveToScreen(-1)} className="p-1 rounded-[50%] active:bg-gray">
                    <IoMdArrowBack size={24} className="text-primary_dark" />
                </button>
                <div className={`flex w-full justify-between items-center`}>
                    <h4 className={`text-[20px] font-bold text-primary`}>
                        {String(translations?.transactionScreens?.screenThree?.title)}
                    </h4>
                    <button onClick={onClose}>
                        <LiaTimesSolid size={24} className={`h-[24px]`} />
                    </button>
                </div>
            </div>
            <div className={`grow flex flex-col mt-[32px] text-[14px] lg:text-[16px] space-y-[12px] space-y-[16px]`}>
                <div className={`flex justify-between font-bold`}>
                    <h5>{String(translations?.transactionScreens?.screenThree?.details?.amountToSend)}</h5>
                    <h5>{transactionDetails.amountSent?.toLocaleString('en-US')} {transactionDetails.currencySent}</h5>
                </div>
                <div className={`flex justify-between font-bold`}>
                    <h5>{String(translations?.transactionScreens?.screenThree?.details?.amountReceived)}</h5>
                    <h5>{transactionDetails.amountReceived?.toLocaleString('en-US')} {transactionDetails.currencyReceived}</h5>
                </div>
                <div className={`flex justify-between font-bold`}>
                    <h5>{String(translations?.transactionScreens?.screenThree?.details?.recipientPhone)}</h5>
                    <h5>{transactionDetails.receiverPhoneNumber}</h5>
                </div>
                <div className={`flex justify-between font-bold`}>
                    <h5>{String(translations?.transactionScreens?.screenThree?.details?.recipientName)}</h5>
                    <h5 className="text-right text-[12px]">{transactionDetails.receiverName}</h5>
                </div>
                <div className={`flex justify-between font-bold`}>
                    <h5>{String(translations?.transactionScreens?.screenThree?.details?.cashback)}</h5>
                    <h5>{transactionDetails.cashback} {transactionDetails.currencySent}</h5>
                </div>
                <div className={`flex justify-between font-bold`}>
                    <h5>{String(translations?.transactionScreens?.screenThree?.details?.referralBonus)}</h5>
                    <h5>{transactionDetails.referralGain} {transactionDetails.currencySent}</h5>
                </div>
                <div className={`flex justify-between font-bold bg-gray-400 h-min`}>
                    <div className={`flex items-center`}>
                        <h5>{String(translations?.transactionScreens?.screenThree?.details?.exchangeRate)}</h5>
                        <IoMdInformationCircle size={24} className={`ml-[8px]`} />
                    </div>
                    <div className={`flex items-center space-x-[10px]`}>
                        <span className={`size-[8px] rounded-full bg-[#07E36E]`}></span>
                        <h5>{transactionDetails.transactionRate}</h5>
                    </div>
                </div>
                <div className="flex gap-[12px] px-[8px]">
                    <button type='submit' onClick={handleSubmit} className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                        <h6 className={`text-center font-bold `}>
                            {String(translations?.transactionScreens?.screenThree?.buttons?.redirect)}
                        </h6>
                    </button>
                </div>
                <div className={`grow lg:hidden`}></div>
                <button type='submit' onClick={handleSubmit} className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                    <h6 className={`text-center font-bold `}>
                        {String(translations?.transactionScreens?.screenThree?.buttons?.pay)}
                    </h6>
                </button>
            </div>
        </div>
    )
}

export default ScreenThree
