/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic tokens — light theme defaults
        bg: '#F8F9FA',
        panel: '#FFFFFF',
        'panel-alt': '#F0F1F3',
        ink: '#1A1D23',
        muted: '#6B7280',
        border: '#D1D5DB',
        accent: {
          DEFAULT: '#D97706',
          dim: '#B45309',
        },
        teal: '#0D9488',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        tab: 'inset 0 1px 0 rgba(0,0,0,0.05)',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, 8px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
    },
  },
  plugins: [],
}
