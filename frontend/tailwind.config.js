/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :
      {
        blanc : "#F5F7F8",
        noir :  "#131313",
        chocolat : "#a05a2c",
        chocolat1 : "#8b4513"
      },
      screens: {
  			xs: '320px'
  		},
    },
  },
  plugins: [],
}

