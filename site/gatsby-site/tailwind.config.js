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
    maxHeight: {
      240: '240px',
    },
    extend: {
      colors: {
        'primary-blue': '#0d6efd',
        'muted-gray': '#6c757d',
      },
      gridTemplateColumns: {
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
