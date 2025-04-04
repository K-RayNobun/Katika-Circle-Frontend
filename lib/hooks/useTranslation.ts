import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

type NestedJSON = {
    [key: string]: string | NestedJSON;
};

const availableLanguages = ['en', 'fr'] as const;
type AvailableLanguage = typeof availableLanguages[number];

export function useTranslation() {
    const [locale, setLocale] = useState<AvailableLanguage>('en');
    const [translations, setTranslations] = useState<NestedJSON>({});
    const dispatch = useDispatch();

    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let current: NestedJSON | string = translations;
        for (const k of keys) {
            if(k ==='filleulList') console.log('Accessing key:', k, 'Current key value:', current[k]);
            if (typeof current === 'string' || !(k in current)) {
                return key;
            }
            current = (current as NestedJSON)[k];
        }
        return typeof current === 'string' ? current : key;
    }, [translations]);

    const loadTranslations = useCallback(async (lang: AvailableLanguage) => {
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading translations:', error);
            return { error: 'Translation loading failed' };
        }
    }, []);

    const switchLanguage = useCallback(async (lang: AvailableLanguage) => {
        if (!availableLanguages.includes(lang)) return;
        const newTranslations = await loadTranslations(lang);
        setLocale(lang);
        setTranslations(newTranslations);
        localStorage.setItem('language', lang);
        dispatch({ type: 'SET_LANGUAGE', payload: lang });
    }, [dispatch, loadTranslations]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'language') {
                const storedLang = e.newValue as AvailableLanguage;
                if (storedLang && availableLanguages.includes(storedLang)) {
                    loadTranslations(storedLang).then((updatedTranslations) => {
                        setTranslations(updatedTranslations);
                        setLocale(storedLang);
                    });
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadTranslations]);

    useEffect(() => {
        const storedLang = localStorage.getItem('language');
        const browserLang = navigator.language.split('-')[0];
        const initialLang = availableLanguages.includes(storedLang as AvailableLanguage)
            ? (storedLang as AvailableLanguage)
            : availableLanguages.includes(browserLang as AvailableLanguage)
                ? (browserLang as AvailableLanguage)
                : 'en';

        loadTranslations(initialLang).then(setTranslations);
        setLocale(initialLang);
    }, [loadTranslations]);

    return { locale, translations, switchLanguage, t };
}