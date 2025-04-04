'use client';

import { useEffect, useState } from "react";
import { LiaSun, LiaMoon } from "react-icons/lia";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeTheme, detectSystemTheme } from "@/lib/redux/features/metadata/metadataSlice";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.metadata.theme)

  useEffect(() => {
    // Check local storage or system preference on first load
    dispatch(detectSystemTheme());
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    dispatch(changeTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className=" hidden p-1 rounded bg-gray_dark/20 dark:bg-gray_dark/80 text-gray_dark dark:text-white"
    >
      {darkMode ? (
        <LiaSun
          className="w-6 h-6"
          onClick={toggleTheme}
        />
      ) : (
        <LiaMoon className="w-6 h-6 " onClick={toggleTheme} />
      )}
    </button>
  );
};

export default DarkModeToggle;