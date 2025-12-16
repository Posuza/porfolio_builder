module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // use Tailwind PostCSS plugin package
    require('autoprefixer'),
  ],
};