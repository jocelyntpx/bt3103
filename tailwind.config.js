module.exports = {
  purge: { 
    content: ['./public/**/*.html', './src/**/*.vue'],
    options: {
      safelist: [
        /data-theme$/,
      ]
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],

  daisyui: {
    // styled: true,
    themes: ['cupcake'],
    // base: true,
    // utils: true,
    // logs: true,
    // rtl: false,
  },
}
