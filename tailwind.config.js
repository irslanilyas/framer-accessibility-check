/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-slow': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.03)' },
    },
    sparkle: {
      '0%, 100%': { opacity: 0, transform: 'scale(0)' },
      '50%': { opacity: 1, transform: 'scale(1.2)' },
    }
  },
  animation: {
    'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
    sparkle: 'sparkle 1.5s ease-in-out infinite', 
      },
      
      fontWeight: {
        550: '550'
      },
      
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66abf9',
          400: '#338ff7',
          500: '#0073f5', // Primary color
          600: '#005cc4',
          700: '#004593',
          800: '#002e62',
          900: '#001731',
        },
        error: {
          light: '#FFECEC',
          DEFAULT: '#FF4747',
        },
        warning: {
          light: '#FFF9EC',
          DEFAULT: '#FFB020',
        },
        info: {
          light: '#ECEDFF',
          DEFAULT: '#6366F1',
        },
        success: {
          light: '#EDFBEC',
          DEFAULT: '#4CAF50',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
  // Support Framer's dark/light mode using data attribute
  darkMode: ['class', '[data-framer-theme="dark"]'],
}