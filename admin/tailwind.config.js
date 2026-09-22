/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: { light: 'hsl(354,42%,44%)', DEFAULT: 'hsl(354,42%,32%)', dark: 'hsl(354,42%,18%)' },
        secondary: { DEFAULT: 'hsl(38,55%,60%)', glow: 'hsl(40,68%,74%)' },
        cream: { DEFAULT: 'hsl(35,71%,95%)', light: 'hsl(35,71%,98%)' },
        sidebar: '#1a0d0f',
      },
      fontFamily: {
        karla: ['Karla', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
