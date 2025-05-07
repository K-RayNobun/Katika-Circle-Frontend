'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { FaPaperPlane, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTranslation } from '@/lib/hooks/useTranslation';

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = "Simple";
    axios
      .post("/api/newsletter", { email, category })
      .then(() => {
        setEmail("");
        console.log('Newsletter subscription successful');
      })
      .catch(() => {
        setEmail("");
        console.error('Newsletter subscription failed');
      });
  };

  const formatForLink = (content: string) => {
    return content.split('\b').map((line, i) => (
      <React.Fragment key={i}>
        {
          line.split('\b').map((expression, k) => (
                      (k % 2 === 1) ? (
                        <span key={k} className="text-[#7B61FF]">
                          {expression}
                        </span>
                      ):
                      expression
                    ))
        }
      </React.Fragment>
    ))
  }

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => (
        <React.Fragment key={i}>
            {
              paragraph.split('\n').map((line, j) => (
                <React.Fragment key={j}>
                  {
                    // Check Display the content between \b in bold
                    // For example in the sentence "The lion is a little \bchildish\b", the word childish will be in bold
                    line.split('\b').map((expression, k) => (
                      (k % 2 === 1) ? (
                        <span key={k} className="text-">
                          {formatForLink(expression)}
                        </span>
                      ):
                      formatForLink(expression)
                    ))
                  }
                  <br />
                </React.Fragment>
              ))
            }
            <br />
        </React.Fragment>
    ))
  }

  return (
    <footer className="w-full bg-[#1A0F2E] text-[#A1A1AA] min-h-[455px] flex flex-col justify-between">
    <div className="container py-16 px-[7.5%] flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-16 gap-y-8">
        {/* Logo and Mission */}
        <div className="col-span-1 lg:col-span-4">
          <Link href="/" className="block mb-6">
            <Image 
              src="/landing/SendLogo.svg" 
              alt="Katika" 
              width={160} 
              height={80} 
              className="mb-4 rounded-lg"
              priority
            />
          </Link>
          <p className="text-[15px] leading-relaxed text-[#A1A1AA]">
            {t('footer.mission')}
          </p>
        </div>

        {/* Liens Utiles */}
        <div className='col-span-1 lg:col-span-2'>
          <h6 className="text-white text-[18px] font-medium mb-6">{t('footer.usefulLinks')}</h6>
          <ul className="space-y-3 text-[15px]">
            <li><Link href="/user/transactions" className="hover:text-white transition-colors duration-200">{t('footer.links.transactions')}</Link></li>
            <li><Link href="/privacypolicy" className="hover:text-white transition-colors duration-200">{t('footer.links.privacyPolicy')}</Link></li>
            <li><Link href="/userlicenseagreement" className="hover:text-white transition-colors duration-200">{t('footer.links.userAgreement')}</Link></li>
            <li><Link href="/user/awards" className="hover:text-white transition-colors duration-200">{t('footer.links.awards')}</Link></li>
            <li><Link href="/user/settings" className="hover:text-white transition-colors duration-200">{t('footer.links.settings')}</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className='col-span-1 lg:col-span-2'>
          <h6 className="text-white text-[18px] font-medium mb-6">{t('footer.services')}</h6>
          <ul className="space-y-3 text-[15px]">
            <li><Link href="/katika-wallet" className="hover:text-white transition-colors duration-200">{t('footer.servicesList.wallet')}</Link></li>
            {/* <li><Link href="/ludokin" className="hover:text-white transition-colors duration-200">{t('footer.servicesList.ludokin')}</Link></li> */}
          </ul>
        </div>

        {/* Newsletter */}
        <div className='col-span-1 lg:col-span-4'>
          <h6 className="text-white text-[18px] font-medium mb-6">{t('footer.newsletter')}</h6>
          <p className="text-[15px] mb-6 leading-relaxed text-[#A1A1AA]">
            {t('footer.newsletterText')}
          </p>
          <form onSubmit={handleSubmit} className="relative p-[4px] pr-[40px] border-2 border-gray_dark rounded-lg">
            <input
              type="email"
              value={email}
              placeholder={t('footer.newsletterPlaceholder')}
              className="w-full bg-white border border-[#A1A1AA] rounded-lg px-4 py-[6px] text-white placeholder:text-[#A1A1AA] focus:outline-none focus:border-white"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B61FF] hover:text-white transition-colors"
              aria-label="Envoyer"
            >
              <FaPaperPlane size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* Separator */}
    <div className="w-full h-[2px] bg-[#3B3B3B]" />

    {/* Footer Bottom */}
    <div className="container px-[7.5%] py-6 flex flex-col md:flex-row justify-between items-center">
      <p className="text-[15px] text-white mb-4 md:mb-0">{t('footer.copyright')}</p>
      <div className="flex items-center gap-4">
        <a href="https://facebook.com/katika" className="text-white hover:text-[#7B61FF] transition-colors" aria-label="Facebook">
          <FaFacebook size={22} />
        </a>
        <a href="https://instagram.com/katika" className="text-white hover:text-[#7B61FF] transition-colors" aria-label="Instagram">
          <FaInstagram size={22} />
        </a>
        <a href="https://twitter.com/katika" className="text-white hover:text-[#7B61FF] transition-colors" aria-label="Twitter">
          <FaTwitter size={22} />
        </a>
        <a href="https://linkedin.com/company/katika" className="text-white hover:text-[#7B61FF] transition-colors" aria-label="LinkedIn">
          <FaLinkedin size={22} />
        </a>
      </div>
    </div>

    {/* Disclaimer */}
    <div className="w-full bg-transparent px-[7.5%] py-6">
      <div className="mx-auto">
        <p className="text-xs md:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
          {formatContent(t('footer.disclaimerPart1'))}
          {formatContent(t('footer.disclaimerPart2'))}
          {formatContent(t('footer.disclaimerPart3'))}
          {formatContent(t('footer.disclaimerPart4'))}
          {formatContent(t('footer.disclaimerPart5'))}
          <span>
            {t('footer.disclaimerEnd')}
            <Link href="/user_agreement" className="text-[#7B61FF] hover:underline mx-1">
              {t('footer.links.termsOfUse')}
            </Link>
            {t('footer.and')}
            <Link href="/privacy_policy" className="text-[#7B61FF] hover:underline mx-1">
              {t('footer.links.privacyPolicy')}
            </Link>
            {t('footer.pages')}
          </span>
        </p>
      </div>
    </div>

  </footer>
  );
};

export default Footer;