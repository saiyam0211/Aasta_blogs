/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ASTA Design System Colors
        'primary': '#d0ee8a',
        'secondary': '#101D0F',
        'accent': '#00FF7F',
        'background': '#0D1B12',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'card-bg': '#1B2C1D',
        // Legacy colors for compatibility
        'darkest-green': '#0D1B12',
        'darker-green': '#101D0F',
        'dark-green': '#1B2C1D',
        'medium-green': '#0d4000',
        'forest-green': '#0f5000',
        'moss': '#C5FF4A',
        'cream': '#d0ee8a',
        'cream-dark': '#e8e5d3',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        tanjambore: ['Tanjambore', 'sans-serif'],
        bricolage: ['Bricolage Grotesque', 'sans-serif'],
        dela: ['Dela Gothic One', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
      },
      fontSize: {
        'h1': '64px',
        'h2': '48px',
        'h3': '32px',
        'base': '18px',
        'small': '14px',
      },
      spacing: {
        'section': '100px',
      },
    },
  },
  plugins: [],
};
