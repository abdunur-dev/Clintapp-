/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
      },
      fontFamily: {
        serif: ['CrimsonPro_400Regular'],
        'serif-bold': ['CrimsonPro_700Bold'],
      },
    },
  },
  plugins: [],
};