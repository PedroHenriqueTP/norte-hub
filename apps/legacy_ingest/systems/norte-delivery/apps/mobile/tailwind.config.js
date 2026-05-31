/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#fdfbf7',   // Beige
        surface: '#fff8ed',      // Cream
        'surface-strong': '#fae1cd', // Nude
        'surface-contrast': '#ffffff', // White

        // Text Colors
        main: '#431407',       // Dark Brown
        muted: '#9c6644',      // Light Brown
        invert: '#ffffff',

        border: '#e7d5c0',

        accent: '#ea580c',     // Burnt Orange
        'accent-soft': '#ffedd5',

        success: '#15803d',
        warning: '#ca8a04',
        danger: '#be123c',
      }
    },
  },
  plugins: [],
}
