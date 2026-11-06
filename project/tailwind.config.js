/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          50: '#EEF3F9',
          100: '#D6E2EF',
          200: '#ADC5DF',
          300: '#7FA6CC',
          400: '#4A90D9',
          500: '#2E72B8',
          600: '#1E3A5F',
          700: '#18304F',
          800: '#122640',
          900: '#0C1B2E',
        },
        accent: {
          DEFAULT: '#4A90D9',
          light: '#7FB0E5',
          dark: '#2E72B8',
        },
        success: {
          DEFAULT: '#27AE60',
          light: '#E8F7EF',
          dark: '#1E8449',
        },
        alert: {
          DEFAULT: '#E74C3C',
          light: '#FDECEA',
          dark: '#C0392B',
        },
        warning: {
          DEFAULT: '#F39C12',
          light: '#FEF3E0',
          dark: '#B9770E',
        },
        surface: '#FFFFFF',
        canvas: '#F5F7FA',
        ink: {
          DEFAULT: '#1F2937',
          soft: '#6B7280',
          muted: '#9CA3AF',
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        soft: '0 4px 12px rgba(15,23,42,0.08)',
        sheet: '0 -8px 24px rgba(15,23,42,0.18)',
        float: '0 8px 24px rgba(15,23,42,0.16)',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        slideUp: 'slideUp 280ms ease-out',
        fadeIn: 'fadeIn 200ms ease-out',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
