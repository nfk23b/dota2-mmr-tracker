/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'dota-red': '#FF4B4B',
          'mood-great': '#4CAF50',
          'mood-good': '#8BC34A',
          'mood-neutral': '#FFC107',
          'mood-bad': '#FF9800',
          'mood-terrible': '#F44336',
        }
      },
    },
    plugins: [],
  }