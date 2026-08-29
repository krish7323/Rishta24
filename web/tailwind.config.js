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
          border: '#FAD4DE',
        },
        primaryDark: '#B92349',
        primaryLight: '#FCEEF2',
        primarySubtle: '#FFF5F7',
        secondary: {
          DEFAULT: '#4A1525',
          light: '#7C344A',
        },
        surface: '#FFFFFF',
        surfaceSubtle: '#FCF7F8',
        background: '#FFF9FA',
        border: '#F0E2E6',
        gold: {
          DEFAULT: '#D9A441',
          light: '#F7D070',
          dark: '#B3822B',
          bg: '#FFFDF5',
        },
        goldLight: '#F7D070',
        goldDark: '#B3822B',
        goldBg: '#FFFDF5',
        textPrimary: '#321820',
        textSecondary: '#7C6870',
        textMuted: '#A59299',
        success: '#36B56A',
        warning: '#E9A23B',
        error: '#D64545',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 25px -2px rgba(214, 47, 91, 0.08), 0 2px 8px -1px rgba(50, 24, 32, 0.04)',
        card: '0 10px 35px rgba(74, 21, 37, 0.07)',
        glow: '0 0 35px rgba(214, 47, 91, 0.25)',
        goldGlow: '0 0 35px rgba(217, 164, 65, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
