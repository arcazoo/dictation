/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.10)',
        glow: '0 18px 60px rgba(16, 185, 129, 0.24)',
      },
    },
  },
  plugins: [],
};
