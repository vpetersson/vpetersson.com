/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_pages/**/*.html',
    './_posts/**/*.md',
    './_posts/**/*.html',
    '*.html',
    './*.html',
    './**/*.html',
  ],
  content: [],
  theme: {
    colors: {
      white: '#FFFFFF',
      primaryBG: '#000212',
      secondaryBG: '#1A1B2A',
      primaryText: '#D6D6D6',
      altPrimaryText: '#000212',
      btnPrimary: '#5D5FEF',
      btnSecondary: 'rgba(93, 95, 239, 0.20)',
      'white-alpha-20': 'rgba(255, 255, 255, 0.2)',
      'white-alpha-25': 'rgba(255, 255, 255, 0.25)'
    },
    extend: {},
  },
  plugins: [],
}

