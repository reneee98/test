import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                'brand-yellow': '#D7DF21',
                'brand-light': '#F0F0F0',
                'brand-dark': '#1F1919',
                'brand-teal': '#368391',
                'brand-cyan': '#56C4C6',
            },
            fontFamily: {
                sans: ['Nohemi', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
