import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setPassedTutorials } from '@/lib/redux/features/metadata/metadataSlice';
import SignetTutorialContainer from './SignetTutorial';
import TransactionsTutorialContainer from '../../transactionTutorial/components/TransactionTutorial';
import Image from 'next/image';

// Example JSON data for tutorials
const tutorialsList = [
    {
        id: 1,
        title: "Installer l'application Send",
        description: "Installez l'application Send sur votre téléphone et accédez-y depuis votre écran d'accueil.",
        icon: "📱",
        image: "/tutorials/signetTuto.png", // Added image
    },
    {
        id: 2,
        title: "Lancez votre première transaction",
        description: "Effectuez votre première transaction en suivant les étapes simples de l'application, en faisant votre identification",
        icon: "💶",
        image: "/tutorials/signetTuto.png"
    }
];

const SettingsTutorials = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [expandedIndexes, setExpandedIndexes] = useState<{ [key: number]: boolean }>({});

    
    const toggleLength = (idx: number) => {
        setExpandedIndexes(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const handleBack = () => {
        setSelectedIndex(null);
    };

    if (selectedIndex === 0) {
        return (
            <div className="w-full">
                <SignetTutorialContainer goBack={handleBack} onFinish={() => dispatch(setPassedTutorials(true))} />
            </div>
        );
    } else if (selectedIndex === 1) {
        return (
            <div className="w-full">
                <TransactionsTutorialContainer onFinish={handleBack} goBack={handleBack} />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col item-center py-[24px] px-[16px] lg:p-[32px]">
            <h4 className="text-[22px] lg:text-[28px] text-center text-wrap block font-bold text-primary_dark mb-2 lg:mb-4">
                {t('settingsTutorials.title')}
            </h4>
            <h6 className="w-full text-[14px] lg:text-[16px] text-center text-wrap mb-8 lg:px-[10%]">
                {t('settingsTutorials.subtitle')}
            </h6>
            
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorialsList.map((tutorial, idx) => {

                    const maxLength = 70;
                    const isExpanded = !!expandedIndexes[idx];
                    const displayText = tutorial.description.length > maxLength ? tutorial.description.slice(0, maxLength) : tutorial.description;

                    return (<div
                        key={tutorial.id}
                        className={
                            `relative rounded-[8px] border-[3px] border-primary_dark bg-gray/70 py-4 px-4 transition-shadow duration-700 cursor-pointer shadow-primary/80 shadow-sm hover:shadow-primary/80 hover:shadow-md ${isExpanded ? 'h-auto' : 'max-h-[272px]'}`
                        }
                        onClick={() => setSelectedIndex(idx)}
                    >
                        <div className="flex items-center mb-2">
                            <div className='w-full'>
                                <h5 className="font-semibold text-[16px] lg:text-[18px] text-center text-primary_dark">{tutorial.title}</h5>
                            </div>
                        </div>
                        <div className="w-full">
                            <Image src={tutorial.image} width={10} height={196} alt='Img Not Found' className='rounded-md w-full mb-2 h-36 object-cover'/>
                        </div>
                        <span className="text-[12px] lg:text-[13px] leading-4 mb-2">
                            {isExpanded ? tutorial.description : displayText}
                            <button className='text-violet-700 inline' onClick={ e => {e.stopPropagation(); toggleLength(idx)}}>
                                { isExpanded ? t('settingsTutorials.viewLess') : t('settingsTutorials.viewMore')}
                            </button>
                        </span>
                    </div>)
                }
                )}
            </div>
        </div>
    );
};

export default SettingsTutorials;