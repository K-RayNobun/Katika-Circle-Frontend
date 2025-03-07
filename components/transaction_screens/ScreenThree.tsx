import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useState, useRef, EventHandler } from 'react';
import axios from 'axios';

// Redux related imports
import { useAppSelector } from '@/lib/redux/hooks';

interface screenProps {
    onClose: () => void,
    nextScreen: () => void,
}

const ScreenThree = ({onClose, nextScreen}: screenProps) => {

    const katikaRate = 667;
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // const form = document.getElementById('form-one') as HTMLFormElement
        // const formData = new FormData(form);
        nextScreen();
    }
    const transactionDetails = useAppSelector((state) => state.transaction);

  return (
    <div className={`flex flex-col w-[502px] h-[90%] lg:h-max rounded-t-[12px] lg:rounded-[12px] p-[44px] bg-white`}>
        <div className={`flex w-full justify-between items-center`}>
            <h4 className={`text-[20px] font-bold text-primary`}>Recapitulatif de la transaction</h4>
            <button onClick={onClose}><FontAwesomeIcon icon={faXmark} className={`h-[24px]`} /></button>
        </div>
        <div className={`mt-[32px] space-y-[16px]`}>
            <div className={`flex justify-between font-bold`}>
                <h5>Montant à envoyer</h5>
                <h5>{transactionDetails.amountSent + ' ' + transactionDetails.currencySent}</h5>
            </div>
            <div className={`flex justify-between font-bold`}>
                <h5>Montant recu</h5>
                <h5>{transactionDetails.amountReceived + ' ' + transactionDetails.currencyReceived}</h5>
            </div>
            <div className={`flex justify-between font-bold`}>
                <h5>Cashback</h5>
                <h5>0.0001 EUR</h5>
            </div>
            <div className={`flex justify-between font-bold`}>
                <h5>Bonus de parrainage</h5>
                <h5>0.002 EUR</h5>
            </div>
            <div className={`flex justify-between font-bold bg-gray-400 h-min`}>
                <div className={`flex items-center`}>
                    <h5>Taux d'envoi</h5>
                    <FontAwesomeIcon icon={faCircleInfo} className={`ml-[8px]`} />
                </div>
                <div className={`flex items-center space-x-[10px]`}>
                    <span className={`size-[8px] rounded-full bg-[#07E36E]`}></span>
                    <h5 className={``}>{katikaRate}</h5>
                </div>
            </div>
            <button type='submit' onClick={handleSubmit} className={`hidden lg:block bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
                <h6 className={`text-center font-bold `}>Payer</h6>
            </button>
        </div>
        <div className={`grow lg:hidden`}></div>
        <button type='submit' onClick={handleSubmit} className={`lg:hidden bg-primary hover:bg-primary_dark py-[10px] rounded-[8px] text-white w-full`}>
            <h6 className={`text-center font-bold `}>Payer</h6>
        </button>
</div>
  )
}

export default ScreenThree
