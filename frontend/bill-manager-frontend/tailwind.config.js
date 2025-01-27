/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-011627': '#011627',
        'text-fdfffc': '#FDFFFC',
        'accent-f6ae2d': '#F6AE2D',
      },
    },
  },
  plugins: [],
}
