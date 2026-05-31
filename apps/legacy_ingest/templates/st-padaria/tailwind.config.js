/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          50: '#F9F5F1', // Cream/White
          100: '#F2EBE5', // Light Beige
          200: '#E6D6C6', // Wheat
          300: '#D9C2A8',
          400: '#CBAE8A',
          500: '#BD9A6C', // Goldish
          600: '#A68255',
          700: '#8C6842', // Coffee light
          800: '#735235', // Coffee
          900: '#593C26', // Dark Coffee
          950: '#3D2819',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
