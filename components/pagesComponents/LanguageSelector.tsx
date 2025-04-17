import { useTranslation } from "@/lib/hooks/useTranslation";

type LanguageOption = {
  language: string;
  code: string;
  dir?: "ltr" | "rtl";
};

const languageOptions: LanguageOption[] = [
  { language: "Français", code: "fr", dir: "ltr" },
  { language: "English", code: "en", dir: "ltr" },
];

/**
 * A dropdown component for selecting the application language.
 */
const LanguageSelector = () => {
  const { locale, switchLanguage } = useTranslation();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value as "en" | "fr";
    try {
      await switchLanguage(selectedLanguage);
      // stateUpdate(selectedLanguage); // Update parent state
    } catch {
      // console.error("Error switching language:", error);
    }
  };

  const currentDir = languageOptions.find((option) => option.code === locale)?.dir || "ltr";

  return (
    <select
      id="language"
      value={locale} // Use full locale code (e.g., "en")
      onChange={handleLanguageChange}
      className="p-2 min-w-[30px] bg-white text-primary_dark rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-primary/50 focus:ring-opacity-50"
      dir={currentDir}
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