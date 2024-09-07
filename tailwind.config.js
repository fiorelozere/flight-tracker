/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        blue: {
          // should be same as in styles.scss
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#4c73db',
          700: '#2852c8',
          800: '#2144a6',
          900: '#1d3c91',
        },
      },
    },
  },
  plugins: [],
};
