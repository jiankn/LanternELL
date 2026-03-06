import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#818CF8',
        cta: '#F97316',
        background: '#EEF2FF',
        surface: '#FFFFFF',
        'text-primary': '#1E1B4B',
        'text-muted': '#6366F1',
      },
      fontFamily: {
        heading: ['Crimson Pro', 'serif'],
        body: ['Atkinson Hyperlegible', 'sans-serif'],
      },
      boxShadow: {
        'clay': '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'clay-sm': '4px 4px 8px rgba(163, 177, 198, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.6)',
        'clay-button': '4px 4px 8px rgba(0, 0, 0, 0.15), -2px -2px 6px rgba(255, 255, 255, 0.2)',
        'clay-button-hover': '6px 6px 12px rgba(0, 0, 0, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.25)',
        'clay-button-pressed': 'inset 4px 4px 8px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'clay': '20px',
        'clay-sm': '12px',
      },
    },
  },
  plugins: [],
}
export default config
