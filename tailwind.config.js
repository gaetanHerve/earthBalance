/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Palette EarthBalance — copie exacte de la maquette
        eb: {
          dark:   '#0a0f1e',
          card:   '#111827',
          border: '#1f2d3d',
          deep:   '#060d18',
          mid:    '#0d1b2a',
          green:  '#00ff88',
          cyan:   '#00e5ff',
          red:    '#ff5050',
        },
      },
      fontFamily: {
        sans: ["'Segoe UI'", 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.5s infinite',
        ticker:      'ticker 30s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease',
      },
    },
  },
  plugins: [],
}
