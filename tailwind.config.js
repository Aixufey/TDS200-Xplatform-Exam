/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                'handjet-black': ['Handjet-Black'],
                'handjet-light': ['Handjet-Light'],
                'handjet-regular': ['Handjet-Regular'],
                'ubuntu-italic': ['Ubuntu-Italic'],
                'ubuntu-light': ['Ubuntu-Light'],
                'ubuntu-regular': ['Ubuntu-Regular'],
            },
            colors: {
                primary: '#ff00aa',
                primary200: '#b60079',
                primary300: '#6d0049',
                secondary: '#ffed20',
                secondary200: '#dfcd00',
                secondary300: '#9f9200',
                tertiary: '#00FFFF',
                tertiary200: '#00b6b6',
                tertiary300: '#006d6d',
                neutral: '#ededed',
                neutral200: '#c8c8c8',
                neutral300: '#a4a4a4',
                dark: '#2d2d2d',
                dark200: '#202020',
                dark300: '#060606',
            },
        },
    },
    plugins: [],
};
