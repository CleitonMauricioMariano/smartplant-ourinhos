/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-canvas': '#07090E',
        'bg-primary': '#0B0E14',
        'bg-card': 'rgba(19, 24, 32, 0.78)',
        'bg-card-solid': '#131820',
        'bg-elevated': 'rgba(26, 32, 44, 0.85)',
        'border-subtle': 'rgba(255, 255, 255, 0.07)',
        'border-highlight': 'rgba(0, 230, 118, 0.35)',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
        'neon-green': '#00E676',
        'neon-amber': '#FFB300',
        'neon-orange': '#FF6D00',
        'neon-crimson': '#FF1744',
        'cyber-blue': '#2979FF',
        'surface-container-lowest': '#0c0e13',
        'surface-container-low': '#191c21',
        'surface-container': '#1d2025',
        'surface-container-high': '#282a30',
        'surface-container-highest': '#33353b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        'telemetry-code': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-success': '0 0 20px rgba(0, 230, 118, 0.18)',
        'glow-warning': '0 0 20px rgba(255, 179, 0, 0.18)',
        'glow-danger': '0 0 25px rgba(255, 23, 68, 0.30)',
        'card-scada': '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
