/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080A",
        surface: {
          DEFAULT: "#0F0F13",
          hover: "#15151B",
          border: "#20202A",
          card: "#121217",
        },
        gold: {
          50: '#FBF8EE',
          100: '#F5EECB',
          200: '#EBDCA0',
          300: '#E1C771',
          400: '#D9B549',
          500: '#C99E26', // Premium Gold Accent
          600: '#AC7F1C',
          700: '#8A5E17',
          800: '#704B18',
          900: '#5E3E18',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'gold-glow': '0 0 40px -10px rgba(201, 158, 38, 0.35)',
        'gold-sm': '0 0 20px -5px rgba(201, 158, 38, 0.25)',
        'dark-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
