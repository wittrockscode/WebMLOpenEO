import defaultTheme from "tailwindcss/defaultTheme"
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'ml-dark': '#403D39',
      'ml-light': '#CCC5B9',
      'ml-orange': '#EB5E28',
      'ml-green': '#A7C957',
      'ml-text': '#FFFCF2',
      'ml-black': '#252422',
    },
  },
  plugins: [],
}
