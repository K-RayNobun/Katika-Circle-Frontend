import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";

type LanguageOption = {
  language: string;
  code: string;
  dir?: 'ltr' | 'rtl';
};

const languageOptions: LanguageOption[] = [
  { 
    language: "Français", 
    code: "fr",
    dir: 'ltr'
  },
  {
    language: "English",
    code: "en",
    dir: 'ltr'
  },
];

interface LanguageSelectorProps {
  stateUpdate: Dispatch<SetStateAction<undefined>>;
}

const LanguageSelector = ({stateUpdate}: LanguageSelectorProps) => {

  const { locale, switchLanguage } = useTranslation();
  const [language, setLanguage] = useState(locale);

  useEffect(() => {
    setLanguage(locale);
  }, [locale]);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value as "en" | "fr";
    try {
      await switchLanguage(selectedLanguage);
      setLanguage(selectedLanguage);
      // Force a re-render by triggering a state update in the parent component
      window.dispatchEvent(new Event('languageChange'));
      stateUpdate(undefined);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <select
      id="language"
      value={language.slice(0, 1).toUpperCase() + language.slice(1)}
      onChange={handleLanguageChange}
      className="p-2 max-w-[50px border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
    >
      {languageOptions.map(({ language, code }) => (
        <option value={code} key={code} className="text-primary_dark bg-primary/20">
          {language.slice(0, 2).toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;