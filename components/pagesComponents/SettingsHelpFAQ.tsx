import React, { useState } from 'react';
import { PiPlusCircle, PiMinusCircle } from "react-icons/pi";
import { useTranslation } from '@/lib/hooks/useTranslation';
import data from '@/public/locales/en.json';


const HelpFAQSection = () => {
    const [toogledIndex, setToogledIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    const handleToogle = (index: number) => {
        if (toogledIndex === index) {
            setToogledIndex(null);
        } else {
            setToogledIndex(index);
        }
    };

    // Funtion to format content with line breaks
    const formatContent = (content: string) => {
        return content.split('\n').map((paragraph, i) => (
            <React.Fragment key={i}>
                {paragraph}
                <br />
            </React.Fragment>
        ))
    }

    const FAQData = data.settingsHelpFAQ.faq; // Adjust the path to your JSON file

    return (
        <div className='w-full p-[16px] lg:p-[32px] lg:space-y-[64px]'>
            <h4 className='text-[24px] hidden lg:block font-bold text-primary'>{t('settingsHelpFAQ.helpAndFAQ')}</h4>
            <div>
                {FAQData.map((faq, index) => (
                    <div
                        key={index} onClick={() => handleToogle(index)}
                        className={`py-[28px] pl-[12px] pr-[64px] lg:w-[920px] relative ${
                            index === FAQData.length - 1 ? '' : 'border-b-2 border-gray_dark/15'
                        } ${toogledIndex === index ? '' : 'hover:bg-gray hover:border-b-[2px]'} border-gray`}
                    >
                        <h5 className='font-semibold text-[17px] lg:text-[18px] mb-[6px]'>{faq.title}</h5>
                        <p
                            id={`content-${index}`}
                            className={`text-[14px] lg:text-[16px] overflow-hidden transition-all duration-3000 ease-in-out ${
                                index === toogledIndex ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {formatContent(faq.content)}
                        </p>
                        <button
                            className='absolute top-[30%] right-[24px] transition-all duration-3000 ease-in-out'
                            onClick={(e) => {e.stopPropagation(); handleToogle(index);}}
                        >
                            {toogledIndex === index ?
                                <PiMinusCircle
                                    size={24}
                                    className='hover:transform hover:scale-125 ease-in-out text-primary'
                                />
                                :
                                <PiPlusCircle
                                    size={24}
                                    className='hover:transform hover:scale-125 ease-in-out text-primary'
                                />
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpFAQSection;