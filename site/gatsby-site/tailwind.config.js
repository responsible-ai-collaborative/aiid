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
      screens: {
        '1300px': { min: '1300px' },
      },
      colors: {
        'light-gray': 'rgba(0,0,0,.03)',
        'border-gray': 'rgba(0,0,0,.125)',
        'disable-gray': '#dee2e6',
        'primary-blue': '#0d6efd',
        'gray-500': '#adb5bd',
        'dark-gray': '#6c757d',
        'deep-blue': '#0a58ca',
        'secondary-gray': 'rgba(108,117,125,1)',
        'text-light-gray': 'rgba(248,249,250,1)',
        'border-light-gray': '#d9deee',
        'default-gray': 'rgb(128, 128, 128)',
        danger: '#dc3545',
        'gray-900': '#212529',
        '0-0-0-055': 'rgba(0, 0, 0, 0.55)',
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
      borderWidth: {
        1.5: '1.5px',
        2.5: '2.5px',
      },
      padding: {
        0.8: '0.8rem',
      },
      gridTemplateColumns: {
        '1fr-3fr': '1fr 3fr',
      },
      borderRadius: {
        '5px': '5px',
      },
      fontFamily: {
        karla: 'Karla, sans-serif',
      },
      fontSize: {
        '32px': '32px',
      },
    },
  },
  plugins: [],
  safelist: [
    'tw-btn-outline-primary',
    'tw-btn',
    'tw-bg-secondary',
    'tw-tooltip-top',
    'tw-tooltip-right',
    'tw-tooltip-bottom',
    'tw-tooltip-left',
  ],
};
