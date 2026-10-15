/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        sand: {
          50: '#FBF8F2',
          100: '#F5EEE0',
          200: '#EBDCC2',
          300: '#DDC49A',
          400: '#CBA873',
          500: '#B89055',
          600: '#A07848',
          700: '#83613C',
          800: '#6B4F34',
          900: '#5A4229',
        },
        terracotta: {
          50: '#FBF1EE',
          100: '#F6E1DB',
          200: '#ECC5BC',
          300: '#DDA193',
          400: '#C97D6A',
          500: '#B85C47',
          600: '#A04A39',
          700: '#843C2E',
          800: '#6E332B',
          900: '#5D2E28',
        },
        teal: {
          50: '#EFFBF9',
          100: '#D7F5F0',
          200: '#B0EBE1',
          300: '#7ADACB',
          400: '#45C1AE',
          500: '#2A9D8F',
          600: '#238A7D',
          700: '#1F7065',
          800: '#1D5A52',
          900: '#1B4B45',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
