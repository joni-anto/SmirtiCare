/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#2B2B28',
        ivory: '#F7F5F0',
        card: '#FFFFFF',
        navy: '#22345C',
        navyDark: '#182746',
        earth: '#8A6A45',
        border: '#E1DDD3',
        success: '#3C6E52',
        alert: '#A6432F'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
