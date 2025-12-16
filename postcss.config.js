module.exports = {
  plugins: [
    // use the Tailwind PostCSS plugin wrapper
    require('@tailwindcss/postcss')(),
    require('autoprefixer'),
  ],
};