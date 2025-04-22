/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Open Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'Outfit', 'ui-sans-serif', 'system-ui'],
        lato: ['var(--font-lato)', 'Lato', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}; 