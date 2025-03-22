/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'apex-gold': '#FFD700',
        'apex-black': '#000000',
        'apex-gray': '#1A1A1A'
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Poppins', 'sans-serif'],
        'body': ['Poppins', 'sans-serif']
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
      }
    }
  },
  plugins: [],
}