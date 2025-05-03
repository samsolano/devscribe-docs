/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'devscribe-teal':       '#FFFFFF',
        'devscribe-dark-gray':  '#121212',
        'devscribe-card-bg':    '#0C0C0C',
        'devscribe-hover-bg':   '#1A1A1A',
        'devscribe-border':     '#2A2A2A',
        'devscribe-text-primary':'#FFFFFF',
        'devscribe-text-secondary':'#A0A0A0',
      },
    },
  },
  plugins: [],
}
