/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Asosiy brend — indigo (eski emerald glass o'rniga)
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        ink: {
          50: '#f4f5fb',
          100: '#e8eaf6',
          700: '#232b45',
          800: '#161d33',
          900: '#0f1426',
          950: '#0a0e1d',
        },
        success: {
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        danger: {
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
        },
        warn: {
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          800: '#92400e',
        },
      },
      boxShadow: {
        // hard — yangi identitetning asosiy "chunky" soyasi
        hard: '0 3px 0 0 rgba(15, 20, 38, 0.10)',
        'hard-lg': '0 5px 0 0 rgba(15, 20, 38, 0.12)',
        'hard-dark': '0 3px 0 0 rgba(0, 0, 0, 0.45)',
        // eski nomlar saqlanadi — ai komponentlari ham yangi ko'rinish oladi
        soft: '0 3px 0 0 rgba(15, 20, 38, 0.08)',
        glow: '0 6px 24px -6px rgba(99, 102, 241, 0.45)',
        'glow-danger': '0 6px 24px -6px rgba(239, 68, 68, 0.4)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 220ms ease-out',
        shake: 'shake 280ms ease-in-out',
        'pop-in': 'pop-in 160ms ease-out',
        'bounce-soft': 'bounce-soft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
