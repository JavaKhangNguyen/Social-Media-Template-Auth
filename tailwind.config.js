/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors'

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {...colors.purple, DEFAULT: colors.purple[600]}
      },
      screens: {
        'mobile':  "960px",
        '0.5xl': '1125px',
        '3xl': '2560px',
      },
      maxWidth: {
        'mainSection': 'calc(100% - 35rem)',
      },
    },
  },
  plugins: [],
}
