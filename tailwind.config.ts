/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  corePlugins: {
    backgroundOpacity: true, // Ensure opacity utilities are enabled
  },
  plugins: [],
};
