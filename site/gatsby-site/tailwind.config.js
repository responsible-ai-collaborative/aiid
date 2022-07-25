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
        'disable-grey': '#dee2e6',
        'dark-blue': '#212529',
        'primary-blue': '#0d6efd',
        'dark-grey': '#6c757d',
        'deep-blue': '#0a58ca',
        'secondary-grey': 'rgba(108,117,125,1)',
        'text-light-grey': 'rgba(248,249,250,1)',
      },
      boxShadow: {
        card: '0 2px 5px 0px #e3e5ec',
      },
      transitionProperty: {
        btn: 'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
      },
      zIndex: {
        2: '2',
      },
    },
  },
  plugins: [],
  safelist: ['tw-btn-outline-primary', 'tw-btn', 'tw-bg-secondary'],
};
