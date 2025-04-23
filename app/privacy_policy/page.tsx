'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { IoLanguage, IoArrowUp } from 'react-icons/io5'
import { FiDownload } from 'react-icons/fi';
import enData from '@/public/locales/en.json';
import frData from '@/public/locales/fr.json';

const PrivacyPolicy = () => {
    const { locale, switchLanguage } = useTranslation();
    const { t } = useTranslation();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const data = locale === 'en' ? enData : frData;
    const policyData = data.privacyPolicy; // Adjust the path to your JSON file

    useEffect(() => {
        console.log(`"${policyData.sections["1"].items.length}"`);
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
        console.log('Download PDF clicked!')
        const link = document.getElementById('download-link') as HTMLAnchorElement;
        link.href = '/documents/privacy-policy.pdf'; // Adjust the path if needed
        link.download = 'privacy-policy.pdf';
        link.click();
        console.log('Download link clicked!')
    }

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Hidden reusable download link */}
            <a id="download-link" style={{ display: 'none' }}></a>
            {/* Language Selector */}
            <button
                onClick={toggleLanguage}
                className="fixed top-4 right-4 z-10 flex gap-[12px] bg-white p-3 rounded-[12px] shadow-md hover:bg-gray-100"
                aria-label={t('privacyPolicy.toggleLanguage')}
            >
                <IoLanguage className="text-primary size-[24px]" />
                <h4 className='text-primary_dark uppercase size-[24px]'>{locale}</h4>
            </button>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-primary_dark text-center p-4 rounded-lg mb-8">
                    {t('privacyPolicy.title')}
                </h1>

                <p className="text-gray-700 leading-relaxed mb-8">
                    {t('privacyPolicy.introduction')}
                </p>

                <div className="space-y-8">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-semibold text-primary_dark p-3 rounded-lg mb-4">
                            {t('privacyPolicy.sections.1.title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            {t('privacyPolicy.sections.1.content')}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {policyData.sections["1"].items.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Sections 2-12 */}
                    {Array.from({ length: 11 }, (_, i) => i + 2).map((sectionNum) => {
                        const sectionKey = `${sectionNum}`;
                        // Check if items exist for the current section
                        if ('items' in policyData.sections[sectionKey as keyof typeof policyData.sections]) {
                            const section = policyData.sections[sectionKey as keyof typeof policyData.sections];
                            const sectionItems = 'items' in section ? section.items as string[] : [];
                            return (
                                <section key={sectionNum}>
                                    <h2 className="text-xl font-semibold text-primary_dark p-3 rounded-lg mb-4">
                                        {t(`privacyPolicy.sections.${sectionNum}.title`)}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {t(`privacyPolicy.sections.${sectionNum}.content`)}
                                    </p>
                                    
                                    {/* Render items if they exist */}
                                    {sectionItems && sectionItems.length > 0 && (
                                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                                            {sectionItems.map((item: string, index: number) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    
                                    {/* Render note if it exists */}
                                    {t(`privacyPolicy.sections.${sectionNum}.note`) && (
                                        <p className="mt-4 text-gray-600 italic">
                                            {t(`privacyPolicy.sections.${sectionNum}.note`)}
                                        </p>
                                    )}
                                </section>
                            );
                        } else {
                            // return section without items or note
                            return (
                                <section key={sectionNum}>
                                    <h2 className="text-xl font-semibold text-primary_dark p-3 rounded-lg mb-4">
                                        {t(`privacyPolicy.sections.${sectionNum}.title`)}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {t(`privacyPolicy.sections.${sectionNum}.content`)}
                                    </p>
                                </section>
                            );
                        }
                })}

                    {/* Company Information */}
                    <section className="mt-12 pt-8 border-t border-gray-200">
                        <h2 className="font-semibold text-primary_dark mb-2">
                            {t('privacyPolicy.companyInformation.name')}
                        </h2>
                        <p className="text-gray-700">
                            {t('privacyPolicy.companyInformation.address')}
                        </p>
                    </section>
                </div>

                {/* Download Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={downloadPDF}
                        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary_dark text-white font-semibold rounded-lg transition-colors"
                    >
                        <FiDownload className="mr-2" />
                        {t('privacyPolicy.downloadPDF')}
                    </button>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 bg-primary hover:bg-primary_dark text-white p-3 rounded-full shadow-lg transition-colors"
                    aria-label={t('privacyPolicy.scrollToTop')}
                >
                    <IoArrowUp className="w-6 h-6" />
                </button>
            )}
        </div>
    )
}

export default PrivacyPolicy