/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Heritage Artistry — Deep Walnut
        walnut: {
          DEFAULT: '#4A2C2A',
          dark: '#321716',
          deep: '#2E1413',
          light: '#5F3E3C',
          surface: '#BD928F',
        },
        // Heritage Artistry — Imperial Gold
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E9C349',
          pale: '#C5A059',
          bright: '#FFBF00',
        },
        // Heritage Artistry — Polished Mahogany
        mahogany: {
          DEFAULT: '#8B4513',
          deep: '#582500',
          light: '#DE8750',
        },
        // Heritage Artistry — Rice Paper neutral
        rice: {
          DEFAULT: '#FDFBF7',
          dim: '#F5F3EF',
          silk: '#EFEEEA',
          muted: '#E4E2DE',
        },
        // Error (design token)
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
        },
        ink: {
          DEFAULT: '#1B1C1A',
          soft: '#504443',
          faint: '#827472',
        },
      },
      fontFamily: {
        serif: ['"Libre Caslon Text"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em' }],
        'display-mobile': ['36px', { lineHeight: '44px' }],
        'headline-md': ['32px', { lineHeight: '40px' }],
        'headline-sm': ['24px', { lineHeight: '32px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.1em' }],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      maxWidth: {
        container: '1280px',
      },
      boxShadow: {
        'heritage': '0 4px 24px rgba(74, 44, 42, 0.08)',
        'heritage-lg': '0 8px 40px rgba(74, 44, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
