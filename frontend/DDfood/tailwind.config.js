/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#1C1C1E',
          bgSecondary: '#2B2D31',
          card: '#242426',
        },
        accent: {
          amber: '#F6C177',
          turquoise: '#7AD0C9',
        },
        text: {
          heading: '#F2F2F2',
          subtext: '#A1A1A6',
          muted: '#8E8E93',
        },
        border: 'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Red Hat Display', 'Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeUp: 'fadeUp 0.6s ease-out',
        stagger: 'stagger 0.3s ease-out',
        slideIn: 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(246, 193, 119, 0.3)',
      },
    },
  },
  plugins: [],
}

