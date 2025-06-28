import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fortnite-purple': '#7c3aed',
        'fortnite-blue': '#2563eb',
        'legendary': '#fbbf24',
        'epic': '#a855f7',
        'rare': '#3b82f6',
        'uncommon': '#10b981',
        'common': '#6b7280',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'hover-card': 'hover-card 0.3s ease-in-out',
      },
      keyframes: {
        'hover-card': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config