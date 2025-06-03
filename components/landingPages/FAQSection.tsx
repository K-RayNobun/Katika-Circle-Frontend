import React, { useState } from "react";
import { PiPlusCircle, PiMinusCircle } from "react-icons/pi";
import { useTranslation } from "@/lib/hooks/useTranslation";

import data from '@/public/locales/fr.json';

const FaqSection = () => {

    const { t } = useTranslation();
    const [toggledIndex, setToggledIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        if (toggledIndex === index) {
        setToggledIndex(null);
        } else {
        setToggledIndex(index);
        }
    };

    const formatContent = (content: string) => {
        return content.split('\n').map((paragraph, i) => (
        <React.Fragment key={i}>
            { paragraph }
            <br />
        </React.Fragment>
        ))
    }

    const FAQData = data.settingsHelpFAQ.faq;

    return (
        <div className='w-full flex flex-col items-center p-[5%] lg:px-[0%] lg:space-y-[64px] bg-blue_dark '>
            <h4 className='great hidden lg:block font-bold text-white text-center'>{t('settingsHelpFAQ.helpAndFAQ')}</h4>
            <div className='text-white w-[60%]'>
                {FAQData.map((faq, index) => (
                    <div
                        key={index} onClick={() => handleToggle(index)}
                        className={`py-[28px] pl-[12px] pr-[64px] lg:w-[920px] relative rounded-t-lg ${
                            index === FAQData.length - 1 ? '' : 'border-b-2 border-gray_dark/15'
                        } ${toggledIndex === index ? '' : 'hover:bg-primary/40 hover:border-b-[2px]'} border-gray`}
                    >
                        <h5 className='font-semibold text-[17px] lg:text-[18px] mb-[6px]'>{faq.title}</h5>
                        <p
                            id={`content-${index}`}
                            className={`text-[14px] lg:text-[16px] overflow-hidden transition-all duration-6000 ease-in-out ${
                                index === toggledIndex ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {formatContent(faq.content)}
                        </p>
                        <button
                            className='absolute top-[30%] right-[24px] transition-all duration-6000 ease-in-out'
                            onClick={(e) => {e.stopPropagation(); handleToggle(index);}}
                        >
                            {toggledIndex === index ?
                                <PiMinusCircle
                                    size={24}
                                    className='hover:transform hover:scale-125 ease-in-out text-gray'
                                />
                                :
                                <PiPlusCircle
                                    size={24}
                                    className='hover:transform hover:scale-125 ease-in-out text-gray'
                                />
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FaqSection;