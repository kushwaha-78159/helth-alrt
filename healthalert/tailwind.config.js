/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E6EEF7',
          100: '#B8CDE8',
          500: '#1E4B8F',
          700: '#0F2D59',
          900: '#071A36',
        },
        accent: {
          50:  '#E8F4F8',
          100: '#B8E0EE',
          500: '#1A8F9E',
          700: '#0F5F6B',
          900: '#063338',
        },
        error: {
          50:  '#FCEBEB',
          100: '#F7C1C1',
          500: '#E24B4A',
          700: '#A32D2D',
          900: '#501313',
        },
        web3: {
          purple: '#6E4AFB',
          blue: '#3B82F6',
          dark: '#0A0F1C',
          light: '#F8FAFF',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'monospace'],
      },
      animation: {
        'pulse-ring': 'pulseRing 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(226,75,74,0.4)' },
          '50%': { boxShadow: '0 0 0 14px rgba(226,75,74,0)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}