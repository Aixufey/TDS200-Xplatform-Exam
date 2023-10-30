/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'handjet-black': ['Handjet-Black'],
        'handjet-light': ['Handjet-Light'],
        'handjet-regular': ['Handjet-Regular'],
        'ubuntu-italic': ['Ubuntu-Italic'],
        'ubuntu-light': ['Ubuntu-Light'],
        'ubuntu-regular': ['Ubuntu-Regular']
      }
    },
  },
  plugins: [],
}

