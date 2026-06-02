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
                background: 'var(--background)',
                surface: {
                    DEFAULT: 'var(--surface)',
                    subtle: 'var(--surface-subtle)',
                    strong: 'var(--surface-strong)',
                    contrast: 'var(--surface-contrast)',
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    soft: 'var(--primary-soft)',
                    hover: 'var(--primary-hover)',
                },
                text: {
                    main: 'var(--text-main)',
                    muted: 'var(--text-muted)',
                    invert: 'var(--text-invert)',
                },
                main: 'var(--text-main)', // Shortcut
                muted: 'var(--text-muted)', // Shortcut
                border: 'var(--border)',
                norte: {
                    graphite: '#0D0D0D',
                    petroleum: '#050505',
                    shop: '#FFBF00',
                    cura: '#50C878',
                    study: '#7851A9',
                    fit: '#FF5F1F',
                    core: '#00D1FF',
                    accent: '#00D1FF',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'radial-gradient(circle at top right, var(--surface-strong) 0%, transparent 40%), radial-gradient(circle at bottom left, var(--primary-soft) 0%, transparent 40%)',
                'cyber-hub': "url('/cyber-bg.png')",
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
export default config;
