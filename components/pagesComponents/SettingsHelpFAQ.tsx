import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

const FAQData = [
    { title: "Combien de temps prend un transfert d'argent avec un wallet décentralisé ?" },
    { title: "Quels sont les moyens de confirmer ma transaction ?" },
    { title: "Quels moyens de paiement acceptez-vous ?" },
    { title: "Puis-je payer en plusieurs fois ?" },
    { title: "Comment obtenir une facture pour ma transaction ?" },
    { title: "Puis-je modifier ou annuler ma transaction ?" },
];

const HelpFAQSection = () => {
    const [toogledIndex, setToogledIndex] = useState<number | null>(null);

    const handleToogle = (index: number) => {
        if (toogledIndex === index) {
            setToogledIndex(null);
        } else {
            setToogledIndex(index);
        }
    };

    return (
        <div className='w-full p-[16px] lg:p-[32px] lg:space-y-[64px]'>
            <h4 className='text-[24px] hidden lg:block font-bold text-primary'>Aide et FAQ</h4>
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
                            className={`text-[14px] lg:text-[16px] transition duration-700 ease-in-out ${
                                index === toogledIndex ? 'block' : 'hidden'
                            }`}
                        >
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis labore reprehenderit neque cupiditate natus animi ea error ut rem nemo placeat assumenda quas, aliquid, dolor omnis. Soluta reiciendis nihil libero exercitationem laborum alias, asperiores quaerat velit aliquid quae iusto vitae eum ut magnam temporibus odio quibusdam debitis. Unde error nemo eum pariatur? Excepturi architecto molestiae illum commodi consequuntur doloribus dolorem?
                        </p>
                        <button
                            className=' absolute top-[30%] right-[24px] transition duration-700 ease-in-out'
                            onClick={() => handleToogle(index)}
                        >
                            <FontAwesomeIcon
                                size='xl'
                                icon={toogledIndex === index ? faCircleMinus : faCirclePlus}
                                className='hover:transform hover:scale-125 ease-in-out text-primary'
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpFAQSection;