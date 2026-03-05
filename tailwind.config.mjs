/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#7c6bff',
                danger: '#f87171',
                success: '#4ade80',
                warning: '#fbbf24',
                surface: '#1a1a2e',
                surface2: '#16213e',
                border: '#2a2a4a',
            },
        },
    },
    plugins: [],
};
