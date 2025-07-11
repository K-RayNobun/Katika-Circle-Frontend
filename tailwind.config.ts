import type { Config } from "tailwindcss";

const plugin = require('tailwindcss/plugin');

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      vibrate: {
        '5': '5px',
        '10': '10px',
        '20': '20px',
        // Add more values as needed
      },
      textShadow: {
        red: '2px 2px 5px rgba(255, 0, 0, 0.7)',
        blue: '2px 2px 5px rgba(0, 0, 255, 0.7)',
        glow: '0 0 10px rgba(0, 255, 255, 0.8)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#931ABD',
        primary_dark: '#800FA7',
        indigo: '#7616B7',
        gray: '#F5F5F5',
        gray_dark: '#667085',
        stroke: '#DBD8DC',
        green: '#009646',
        orange: '#FF5C00',
        red: '#FF0004',
        pink: '#E673D5',
        blue_fluo: '#09E1EF',
        pink_fluo: '#D902D7',
        blue_dark: '#320754',
        green_fluo: '#1DEF09',
        dark_night: '[#1A0F2E]',
        
      },
      fontFamily: {
        poppins_normal: ["var(--font-poppins)"],
      }
    },
  },
  plugins: [],
} satisfies Config;
