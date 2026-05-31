import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          canvas: '#FBF9F6',
          surface: '#FFFFFF',
          text: '#111827',
          violet: '#8E24AA',
          orange: '#FF6D00',
          cyan: '#00B0FF',
          green: '#00E676',
          subtle: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};

export default config;
