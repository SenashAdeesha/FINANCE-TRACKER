/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",     // dark blue
        secondary: "#FACC15",   // yellow
        success: "#16A34A",     // green
        danger: "#DC2626",      // red
        cardBg: "#F3F4F6",      // light gray for cards
      },
    },
  },
  plugins: [],
};
