import React, { useState } from 'react';
import { PiPlusCircle, PiMinusCircle } from "react-icons/pi";

const FAQData = [
    { title: "Combien de temps prend un transfert d'argent avec un wallet décentralisé ?",
        content: "Les transactions avec un wallet décentralisé sont généralement quasi-instantanées. Cependant, la vitesse peut varier en fonction du réseau blockchain utilisé et du niveau de congestion. Dans la plupart des cas, les fonds sont transférés en quelques secondes à quelques minutes."
     },
    { title: "Quels sont les moyens de confirmer ma transaction ?",
        content: "Vous pouvez confirmer votre transaction en consultant : \n- L'historique de transactions de votre Katika Wallet. \n- Une notification de confirmation dans l'application après validation. "
     },
    { title: "Quels moyens de paiement acceptez-vous ?",
        content: "Katika Wallet prend en charge plusieurs moyens de paiement, notamment : \n- Les cryptomonnaies compatibles avec le wallet. \n- L’achat de crypto via des partenaires intégrés (cartes bancaires, mobile money, orange money…)"
     },
    { title: "Puis-je payer en plusieurs fois ?",
        content: "Les transactions en cryptomonnaie nécessitent un paiement unique pour être validées sur la blockchain. Il n'est donc pas possible d’effectuer un paiement en plusieurs fois directement via le wallet. "
     },
    { title: "Comment obtenir une facture pour ma transaction ?",
        content: "Une fois votre transaction effectuée, vous pouvez générer un justificatif depuis l’historique des transactions de votre Katika Wallet. Selon le service utilisé, une facture peut également être envoyée par email."
     },
    { title: "Puis-je modifier ou annuler ma transaction ?",
        content: "Non. Les transactions en blockchain sont irréversibles une fois confirmées. Avant de valider un envoi, assurez-vous d’avoir saisi la bonne adresse et le bon montant. En cas d’erreur, il est recommandé de contacter directement le destinataire si possible.",
     },
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

    // Funtion to format content with line breaks
    const formatContent = (content: string) => {
        return content.split('\n').map((paragraph, i) => (
            <React.Fragment key={i}>
                {paragraph}
                <br />
            </React.Fragment>
        ))
    }

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