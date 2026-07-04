/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#171B21',
        panel: '#1F242C',
        'panel-alt': '#242A33',
        ink: '#E7E9EC',
        muted: '#8B93A1',
        border: '#313842',
        accent: {
          DEFAULT: '#E8A33D',
          dim: '#B87F2C',
        },
        teal: '#4FD1C5',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        tab: 'inset 0 1px 0 rgba(255,255,255,0.04)',
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
