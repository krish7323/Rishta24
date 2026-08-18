/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D62F5B',
          dark: '#B92349',
          light: '#FCEEF2',
          subtle: '#FFF5F7',
        },
        secondary: '#4A1525',
        surface: '#FFFFFF',
        background: '#FFF9FA',
        border: '#F0E2E6',
        gold: {
          DEFAULT: '#D9A441',
          light: '#F7D070',
          dark: '#B3822B',
        },
        textPrimary: '#321820',
        textSecondary: '#7C6870',
        textMuted: '#A59299',
        success: '#36B56A',
        warning: '#E9A23B',
        error: '#D64545',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(214, 47, 91, 0.08), 0 2px 6px -1px rgba(50, 24, 32, 0.04)',
        card: '0 8px 30px rgba(74, 21, 37, 0.06)',
      },
    },
  },
  plugins: [],
}
