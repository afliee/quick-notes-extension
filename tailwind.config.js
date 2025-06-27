/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./popup.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
  safelist: [
    // Gray colors we're using
    'text-gray-400',
    'text-gray-500', 
    'text-gray-700',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'border-gray-200',
    'border-gray-300',
    'hover:border-gray-300',
    'hover:bg-gray-200',
    'hover:shadow-gray-100',
    // Blue colors
    'bg-blue-50',
    'bg-blue-500',
    'border-blue-200',
    'border-blue-500',
    'text-blue-700',
    'hover:bg-blue-600',
    'focus:border-blue-500',
    'focus:ring-blue-100',
    'focus:shadow-blue-500/10',
    'shadow-blue-500/30',
    // Red colors
    'bg-red-50',
    'bg-red-100',
    'border-red-200',
    'text-red-600',
    'text-red-800',
    'hover:bg-red-50',
    'hover:text-red-600',
    'focus:outline-red-500',
  ]
} 