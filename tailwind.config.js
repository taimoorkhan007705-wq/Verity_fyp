/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon_blue: '#232f3e',
        amazon_orange: '#febd69',
      }
    },
  },
  plugins: [],
}