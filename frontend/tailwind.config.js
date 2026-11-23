/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffe',
          300: '#7cc4fd',
          400: '#36a4fa',
          500: '#0c86eb',
          600: '#0168ca',
          700: '#0253a3',
          800: '#064786',
          900: '#0b3c6f',
          950: '#07264a',
        },
        blooms: {
          remember: '#10B981',    // Emerald
          understand: '#0D9488',  // Teal
          apply: '#0284C7',       // Sky/Cyan
          analyse: '#2563EB',     // Royal Blue
          evaluate: '#7C3AED',    // Purple/Violet
          create: '#4F46E5',      // Indigo
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
