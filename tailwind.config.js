/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
     width: {
        '70-666': '70.666667%' // Custom utility class
      },
    fontFamily: {
      'sans-serif': ['var(--cui-font-sans-serif)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
    },
  },
};
export const plugins = [];
