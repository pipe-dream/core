module.exports = {
    minimize: true,
    "plugins": [
        require('tailwindcss')('tailwind.js'),
        require('autoprefixer')(),
        require('cssnano')({ preset: 'default' }),
    ],
};
