/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8C2100", // Replace with your primary color
        secondary: "#B31A1A", // Replace with your secondary color
        background: '#151515',
        headerBackground:'#F6F6F6',
        inputBackground: '#EBEBEB',
        inputBorder: '#B7B7B7',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '5px'
      }
    },
  },
  plugins: [],
}