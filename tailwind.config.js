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
    require('daisyui')
  ],

  daisyui: {
    // styled: true,
    themes: ['emerald'],
    // base: true,
    // utils: true,
    // logs: true,
    // rtl: false,
  },
}
