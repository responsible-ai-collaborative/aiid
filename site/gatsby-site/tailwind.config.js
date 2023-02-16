const plugin = require('tailwindcss/plugin');

let safelist = [
  'tw-btn-primary',
  'tw-btn-secondary',
  'tw-btn-xs',
  'tw-btn-sm',
  'tw-btn-m',
  'tw-btn-lg',
  'tw-btn-xl',
  'tw-btn-outline-primary',
  'tw-btn',
  'tw-bg-secondary',
  'tw-tooltip-top',
  'tw-tooltip-right',
  'tw-tooltip-bottom',
  'tw-tooltip-left',
  'tw-btn-link',
  'bg-amber-400',
];

// Whitelisting level options from ListItem component
for (let i = 0; i < 100; i++) {
  safelist.push(`pl-[${2 + (i || 0) * 1}rem`);
}

const backfaceVisibility = plugin(function ({ addUtilities }) {
  addUtilities({
    '.backface-visible': {
      'backface-visibility': 'visible',
    },
    '.backface-hidden': {
      'backface-visibility': 'hidden',
    },
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'class', // This lets us use it for specific components where useful
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/elements/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  variants: {
    extend: {
      textColor: ['group-hover'],
    },
  },
  theme: {
    maxHeight: {
      240: '240px',
    },
    extend: {
      screens: {
        '1300px': { min: '1300px' },
        'min-576px': { min: '576px' },
        'min-767px': { min: '767px' },
        'min-992px': { min: '992px' },
        'max-50rem': { max: '50rem' },
        '767px': { max: '767px' },
        '965px': { max: '965px' },
        '992px': { min: '992px' },
        '800px': { max: '800px' },
        '1240px': { max: '1240px' },
      },
      colors: {
        'light-gray': 'rgba(0,0,0,.03)',
        'border-gray': 'rgba(0,0,0,.175)',
        'disable-gray': '#dee2e6',
        'primary-blue': '#0d6efd',
        'hover-blue': '#0b5ed7',
        'gray-500': '#adb5bd',
        'dark-gray': '#6c757d',
        'muted-gray': '#6c757d',
        'deep-blue': '#0a58ca',
        'secondary-gray': 'rgba(108,117,125,1)',
        'text-light-gray': 'rgba(248,249,250,1)',
        'border-light-gray': '#d9deee',
        'default-gray': 'rgb(128, 128, 128)',
        danger: '#dc3545',
        'gray-900': '#212529',
        '0-0-0-055': 'rgba(0, 0, 0, 0.55)',
        'light-orange': '#ec9982',
        'list-gray': '#5c6975',
        'light-blue': 'rgb(230,236,241)',
        'side-bar': 'rgb(237, 231, 243)',
        'form-control': '#ced4da',
        'black-25': 'rgba(0,0,0,.25)',
        'table-text': 'rgba(0,0,0,0.05)',
        'btn-check-active': '#565e64',
        'btn-check-border': '#51585e',
      },
      gridTemplateColumns: {
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        '1fr-3fr': '1fr 3fr',
      },
      boxShadow: {
        card: '0 2px 5px 0px #e3e5ec',
        'left-side-bar': 'rgb(175 158 232 / 40%) -1px 0px 4px 1px',
        table: 'inset 0 0 0 9999px transparent',
      },
      transitionDelay: {},
      transitionDuration: {
        btn: '.15s',
        'modal-fade': '0.3s',
        'bg-color-02': '0.2s',
        'form-control': '.15s',
        'carousel-indicator': '.6s',
        'carousel-next-prev': '.15s',
        'form-check-input': '.15s',
        modal: '15s',
      },
      transitionTimingFunction: {
        btn: 'ease-in-out',
        'modal-fade': 'ease-out',
        'bg-color-02': 'ease-out',
        'form-control': 'ease-in-out',
        'carousel-indicator': 'ease',
        'carousel-next-prev': 'ease',
        'form-check-input': 'ease-in-out',
        modal: 'linear',
        'rotate-180': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionProperty: {
        btn: 'color,background-color,border-color,box-shadow',
        'bg-color-02': 'color',
        'form-control': 'border-color,box-shadow',
        modal: 'opacity',
        'modal-fade': 'transform',
        'carousel-indicator': 'opacity',
        'carousel-next-prev': 'opacity',
        'form-check-input': 'background-position',
        'rotate-180': 'transform',
        width: 'width',
        visibility: 'visibility',
      },
      zIndex: {
        2: '2',
      },
      borderWidth: {
        1: '1px',
        1.5: '1.5px',
        2.5: '2.5px',
      },
      padding: {
        0.8: '0.8rem',
        'row-left': 'calc(1.5rem*.5)',
        'row-right': 'calc(1.5rem*.5)',
        'container-left': '.75rem',
        'container-right': '.75rem',
      },
      borderRadius: {
        '5px': '5px',
        'row-left': 'calc(var(--tw-gutter-x)*.5)',
        'row-right': 'calc(var(--tw-gutter-x)*.5)',
      },
      fontFamily: {
        karla: 'Karla, sans-serif',
      },
      fontSize: {
        h1: 'calc(1.375rem + 1.5vw)',
        '2rem': '2rem',
        '32px': '32px',
      },
      flex: {
        '0-0-auto': '0 0 auto',
        '0-1-auto': '0 1 auto',
        '1-1-auto': '1 1 auto',
        '2-1-auto': '1 1 0',
        '1/3': '1 0 32%',
        '1/3-fixed': '0 0 32%',
      },
      transformOrigin: {
        'center-left': 'center left',
      },
      backgroundImage: {
        'btn-close':
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E\")",
        'carousel-control-prev-icon':
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 16 16'%3E%3Cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E\")",
        'carousel-control-next-icon':
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E\")",
        'form-control':
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3E%3C/svg%3E\")",
        'form-check-input':
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='rgba(0, 0, 0, 0.25)'/%3E%3C/svg%3E\")",
        'form-select':
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E\")",
      },
      backgroundPosition: {
        'position-1/2': '50%',
        'form-control': 'right 0.57rem center',
        'form-check-input': '0',
        'form-select': 'right 0.75rem center',
      },
      backgroundSize: {
        'size-btn-close': '1em',
        'full-full': '100% 100%',
        'form-control': '1.125rem 1.125rem',
        'form-select': '16px 12px',
      },
      listStyleType: {
        revert: 'revert',
      },
    },
  },
  plugins: [backfaceVisibility, require('flowbite/plugin'), require('@tailwindcss/typography')],
  safelist: safelist,
};
