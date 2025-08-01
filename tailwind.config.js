/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-accent': '#00FFAA', // Bright neon green-blue color
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 170, 0.7)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 170, 0.7)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 170, 1)' },
        }
      },
    },
  },
  plugins: [],
}