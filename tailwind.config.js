/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#98FF98', // primary-light
          DEFAULT: '#64C850', // primary-default
          dark: '#3730a3', // primary-dark
          hover: '#21D300', 
        },
        secondary: {
          light: '#d9f99e',
          DEFAULT: '#a3e634',
          dark: '#b45309',
          hover: '#84cc16', 
        },
        neutral: {
          light: '#d1d5db',
          DEFAULT: '#6b7280',
          dark: '#374151',
          hover: '#4b5563', 
        },
    },
    backgroundImage: theme => ({
      'primary-gradient': 'linear-gradient(50deg, #d9f99e 50%, #ebfcca 100%)',

    }),
  },

  },
  variants: {},
  plugins: [],
}