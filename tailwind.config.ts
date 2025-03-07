import type { Config } from "tailwindcss";

const plugin = require('tailwindcss/plugin');

export default {
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
        pink: '#E673D5'
      },
      fontFamily: {
        poppins_normal: ["var(--font-poppins-normal)"],
        poppins_bold:[ "var(--font-poppins-bold)"],
      }
    },
  },
  plugins: [
    plugin(function({addUtilities, theme}) {
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
      addUtilities(newUtilities, ['responsive', 'hover']);

      const vibrateUtilities = Object.entries(theme('vibrate')).reduce<Record<string, { '--vibrate-distance': string }>>((acc, [key, value]) => {
        acc[`.vibrate-${key}`] = {
          '--vibrate-distance': value as string,
        };
        return acc;
      }, {});
      addUtilities(vibrateUtilities, ['responsive', 'hover'])
    })
  ],
} satisfies Config;
