import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        colors: {
            blurple: '#5865f2',
            'blurple-darker': '#3f48cc',
            primary: '#efca69',
            background: '#12100e',
            neutral: colors.neutral,
            blue: colors.blue,
        },
    },
    plugins: [],
};
export default config;
