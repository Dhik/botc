/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'blood': '#8b0000',
        'townsfolk': '#4169e1',
        'outsider': '#4682b4',
        'minion': '#ff4500',
        'demon': '#dc143c',
      },
    },
  },
  plugins: [],
}
