/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/elements/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-grey': 'rgba(0,0,0,.03)',
        'border-grey': 'rgba(0,0,0,.125)',
      },
      boxShadow: {
        card: '0 2px 5px 0px #e3e5ec',
      },
    },
  },
  plugins: [],
};
