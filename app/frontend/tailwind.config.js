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
      'ml-light': '#FFFCF2',
      'ml-text': '#CCC5B9',
      'ml-dark': '#403D39',
      'ml-black': '#252422',
      'ml-red': '#D54433',
      'ml-blue': '#4CC9F0',
    },
  },
  plugins: [],
}
