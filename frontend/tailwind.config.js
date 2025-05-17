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
        jaune: '#F7B603',
        rouge: '#EB4468',
        blanc : "#F5F7F8",
        noir :  "#212121",
        beige: '#FAF3E0',
        marron : "#4A2C2A"
      },
      screens: {
  			xs: '320px'
  		},
    },
  },
  plugins: [],
}

