import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

// Define a recursive type for nested translation objects
type NestedJSON = {
  [key: string]: string | NestedJSON; // Each key can be a string or another nested object
};

// Define supported languages
const availableLanguages = ["en", "fr"] as const;
type AvailableLanguage = typeof availableLanguages[number]; // "en" | "fr"

/**
 * Custom hook to manage translations, including locale switching and key lookup.
 * @returns {object} - Contains locale, translations, switchLanguage function, and t (translate) function
 */
export function useTranslation() {
  const [locale, setLocale] = useState<AvailableLanguage>("en"); // Current language
  const [translations, setTranslations] = useState<NestedJSON>({}); // Loaded translation data
  const dispatch = useDispatch(); // Redux dispatch for global state updates

  /**
   * Translate a dot-separated key (e.g., "screenOne.title") into its value.
   * Returns the key itself if the path is invalid.
   */
  const t = useCallback(
    (key: string): string => {
      const keys = key.split("."); // Split key into parts (e.g., ["screenOne", "title"])
      let current: NestedJSON | string = translations; // Start at root of translations

      for (const k of keys) {
        if (typeof current === "string" || !(k in current)) {
          return key; // Return key if we hit a string or undefined property
        }
        current = (current as NestedJSON)[k]; // Move deeper into the object
      }
      return typeof current === "string" ? current : key; // Return value or key if not a string
    },
    [translations]
  );

  /**
   * Load translation file for a given language from the /locales directory.
   */
  const loadTranslations = useCallback(async (lang: AvailableLanguage) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }
      const data: NestedJSON = await response.json(); // Type the response
      return data;
    } catch (error) {
      console.error("Error loading translations:", error);
      return { error: "Translation loading failed" }; // Return fallback object
    }
  }, []);

  /**
   * Switch to a new language, updating state and storage.
   */
  const switchLanguage = useCallback(
    async (lang: AvailableLanguage) => {
      if (!availableLanguages.includes(lang)) return; // Validate language
      const newTranslations = await loadTranslations(lang); // Fetch new translations
      setLocale(lang); // Update locale state
      setTranslations(newTranslations); // Update translations state
      localStorage.setItem("language", lang); // Persist language choice
      console.log("--------- Switching language to:", lang);
      dispatch({ type: "SET_LANGUAGE", payload: lang }); // Notify Redux store
      window.location.reload();
    },
    [dispatch, loadTranslations]
  );

  // Sync translations with localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "language") {
        const storedLang = e.newValue as AvailableLanguage;
        if (storedLang && availableLanguages.includes(storedLang)) {
          loadTranslations(storedLang).then((updatedTranslations) => {
            setTranslations(updatedTranslations);
            setLocale(storedLang);
          });
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadTranslations]);

  // Initialize translations based on stored language, browser language, or default to "en"
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    const browserLang = navigator.language.split("-")[0]; // e.g., "en" from "en-US"
    const initialLang: AvailableLanguage =
      availableLanguages.includes(storedLang as AvailableLanguage)
        ? (storedLang as AvailableLanguage)
        : availableLanguages.includes(browserLang as AvailableLanguage)
          ? (browserLang as AvailableLanguage)
          : "en";

    loadTranslations(initialLang).then((data) => {
      setTranslations(data);
      setLocale(initialLang);
    });
  }, [loadTranslations]);

  return { locale, translations, switchLanguage, t };
}