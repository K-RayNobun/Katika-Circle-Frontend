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
      stateUpdate(undefined); // Reset the state in the parent component

      // State update for page reloading
      window.localStorage.setItem("language", selectedLanguage);
      window.localStorage.setItem("locale", selectedLanguage);
      window.dispatchEvent(new Event('languageChange'));
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <select
      id="language"
      value={language.slice(0, 2).toLowerCase()}
      onChange={handleLanguageChange}
      className="p-2 max-w-[50px] bg-white tex-primary_dark rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-primary/50 focus:ring-opacity-50"
      dir={languageOptions.find(option => option.code === language)?.dir}
      aria-label="Select language"
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