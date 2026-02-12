import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: '#fdf8e8',
          100: '#f9eec5',
          200: '#f3dc8b',
          300: '#edc951',
          400: '#e6b422',
          500: '#d4a017',
          600: '#a67c12',
          700: '#7a5c0e',
          800: '#503d0a',
          900: '#2a2005',
        },
        islamic: {
          dark: '#0d1117',
          darker: '#090c10',
          card: '#161b22',
          border: '#21262d',
          accent: '#c9a84c',
          green: '#2ea043',
          muted: '#8b949e',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(201, 168, 76, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
