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
        blue_dark: '#400970',
        green_fluo: '#1DEF09'
      },
      fontFamily: {
        poppins_normal: ["var(--font-poppins)"],
      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
    plugin(function({addUtilities, theme}: { addUtilities: (utilities: Record<string, any>, options?: { variants?: string[], respectPrefix?: boolean, respectImportant?: boolean }) => void, theme: (path: string) => any }) {
      const newUtilities = {
        '.vibrate': {
          animation: 'vibrate 2s infinite'
        },
        '@keyframes vibrate': {
          '0%, 100%': {
            transform: 'translateX(0)'
          },
          '50%': {
            tranform: 'translateX(var(--vibrate-distance, 5px))',
          },
        }
      };
      addUtilities(newUtilities, { variants: ['responsive', 'hover'] });

      const vibrateUtilities = Object.entries(theme('vibrate')).reduce<Record<string, { '--vibrate-distance': string }>>((acc, [key, value]) => {
        acc[`.vibrate-${key}`] = {
          '--vibrate-distance': value as string,
        };
        return acc;
      }, {});
      addUtilities(vibrateUtilities, {variants: ['responsive', 'hover']})
    })
  ],
} satisfies Config;
