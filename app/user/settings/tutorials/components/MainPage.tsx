import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import SignetTutorialContainer from './SignetTutorial';
import Image from 'next/image';

// Example JSON data for tutorials
const tutorialsList = [
    {
        id: 1,
        title: "Get started with transcoding",
        description: "Learn how to launch your first video transcoding job, transform your media files into different formats.",
        category: "TRANSCODING",
        icon: "🛠️",
        image: "https://placehold.co/600x200?text=Transcoding", // Added image
        details: "Step-by-step guide to transcoding your first video. \n1. Upload your file.\n2. Choose output format.\n3. Start transcoding job.\n\n**Tip:** Use high-quality source files for best results."
    },
    {
        id: 2,
        title: "Learn all about live streaming",
        description: "Let's get started with live streaming, create and manage live streams and projects.",
        category: "LIVE STREAMING",
        icon: "🔴",
        image: "https://placehold.co/600x200?text=Live+Streaming",
        details: "How to set up a live stream:\n• Configure your encoder.\n• Copy your stream key.\n• Go live!\n\n[Read more](https://example.com/live-streaming-guide)"
    },
    {
        id: 3,
        title: "Explore media management",
        description: "Store and manage your media files, organize and set settings for your assets.",
        category: "MEDIA MANAGEMENT",
        icon: "📦",
        image: "https://placehold.co/600x200?text=Media+Management",
        details: "Organize your media:\n- Create folders\n- Tag assets\n- Set permissions"
    },
    {
        id: 4,
        title: "Improve video player experience",
        description: "Customize your video player, add captions, overlays, and more.",
        category: "PLAYER",
        icon: "🎬",
        image: "https://placehold.co/600x200?text=Player+Experience",
        details: "Player customization options:\n✅ Add captions\n✅ Enable overlays\n✅ Adjust playback speed"
    }
];

const SettingsTutorials = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const { t } = useTranslation();
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

    if (selectedIndex !== null) {
        return (
            <div className="w-full">
                <SignetTutorialContainer goBack={handleBack} />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col item-center py-[24px] px-[16px] lg:p-[32px]">
            <h4 className="text-[22px] lg:text-[28px] text-center text-wrap block font-bold text-primary_dark mb-4">
                {t('settingsTutorials.title')}
            </h4>
            <h6 className="text-[16px] text-center text-wrap mb-8 px-[10%]">
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
                            `relative rounded-[8px] border-[3px] max-h-[272px] border-primary_dark bg-gray/70 py-4 px-4 transition-shadow duration-700 cursor-pointer shadow-primary/80 shadow-sm hover:shadow-primary/80 hover:shadow-md `
                        }
                        onClick={() => setSelectedIndex(idx)}
                    >
                        <div className="flex items-center mb-4">
                            <div>
                                <h5 className="font-semibold text-[18px] text-center text-primary_dark">{tutorial.title}</h5>
                            </div>
                        </div>
                        <Image src={tutorial.image} width={10} height={196} alt='Img Not Found' className='rounded-xl w-full mb-2'/>
                        <span className="text-[13px] mb-2">
                            {isExpanded ? tutorial.description : displayText}
                            <button className='text-violet-700 inline' onClick={ e => {e.stopPropagation(); toggleLength(idx)}}>
                                { isExpanded ? '... view less' : '... view more' }
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