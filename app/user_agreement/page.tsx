'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { IoLanguage, IoArrowUp } from 'react-icons/io5'
import { FiDownload } from 'react-icons/fi';
import enData from '@/public/locales/en.json';
import frData from '@/public/locales/fr.json';

const UserAgreement = () => {
    const { locale, switchLanguage } = useTranslation();
    const { t } = useTranslation();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const data = locale === 'en' ? enData : frData;
    const agreementData = data.userAgreement;
    

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggleLanguage = () => {
        const newLang = locale === 'en' ? 'fr' : 'en'
        switchLanguage(newLang)
    }

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = '/documents/user-agreement.pdf'; // Adjust the path if needed
        link.setAttribute('download', 'user-agreement.pdf');
        document.body.appendChild(link);
        
    
        try {
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
            window.open('/documents/user-agreement.pdf', '_blank');
        } finally {
            document.body.removeChild(link);
        }
    }

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Language Selector */}
            <button
                onClick={toggleLanguage}
                className="fixed top-4 right-4 z-10 flex gap-[12px] bg-white p-3 rounded-[12px] shadow-md hover:bg-gray-100"
                aria-label={t('userAgreement.toggleLanguage')}
            >
                <IoLanguage className="text-primary size-[24px]" />
                <h4 className='text-primary_dark uppercase size-[24px]'>{locale}</h4>
            </button>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-primary_dark text-center p-4 rounded-lg mb-8">
                    {t('userAgreement.title')}
                </h1>

                <div className="space-y-8">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-semibold text-primary_dark p-3 rounded-lg mb-4">
                            {t('userAgreement.sections.1.title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            {t('userAgreement.sections.1.content')}
                        </p>
                    </section>

                    {/* Sections 2-15 */}
                    {Array.from({ length: 14 }, (_, i) => i + 2).map((sectionNum) => {
                        const section = agreementData.sections[sectionNum.toString()  as keyof typeof agreementData.sections];
                        return (
                            <section key={sectionNum}>
                                <h2 className="text-xl font-semibold text-primary_dark p-3 rounded-lg mb-4">
                                    {t(`userAgreement.sections.${sectionNum}.title`)}
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {t(`userAgreement.sections.${sectionNum}.content`)}
                                </p>
                                {/* Render items if they exist */}
                                {'items' in section && (
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                                        {section.items.map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        )
                    })}
                </div>

                {/* Download Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={downloadPDF}
                        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary_dark text-white font-semibold rounded-lg transition-colors"
                    >
                        <FiDownload className="mr-2" />
                        {t('userAgreement.downloadPDF')}
                    </button>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 bg-primary hover:bg-primary_dark text-white p-3 rounded-full shadow-lg transition-colors"
                    aria-label={t('userAgreement.scrollToTop')}
                >
                    <IoArrowUp className="w-6 h-6" />
                </button>
            )}
        </div>
    )
}

export default UserAgreement