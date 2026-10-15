/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        night:   '#0d0d14',
        ink:     '#0f0e17',
        ink2:    '#3b3952',
        ink3:    '#7c7a93',
        ink4:    '#b3b1c8',
        surface: '#f5f4fb',
        card:    '#ffffff',
        violet:  { DEFAULT: '#5b5cf6', dark: '#4b4be8', light: '#ede9fe' },
        grape:   '#a855f7',
        success: '#22c55e',
        warning: '#f59e0b',
        danger:  '#f43f5e',
      },
      boxShadow: {
        float: '0 2px 12px rgba(0,0,0,0.06)',
        card:  '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
        deep:  '0 8px 32px rgba(0,0,0,0.12)',
        glow:  '0 0 0 3px rgba(91,92,246,0.18)',
      },
      animation: {
        'fade-up':  'fadeUp .35s cubic-bezier(.22,1,.36,1) both',
        'fade-in':  'fadeIn .22s ease both',
        'scale-in': 'scaleIn .28s cubic-bezier(.22,1,.36,1) both',
        'slide-in': 'slideIn .3s cubic-bezier(.22,1,.36,1) both',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(.94)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
