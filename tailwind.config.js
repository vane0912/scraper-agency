/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agency-blue': '#1E3A8A',
        'background-white': '#FBFEF9',
        'orange-agency': '#ED7445'
      }
    },
  },
  plugins: [],
}

