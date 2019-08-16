module.exports = {
    minimize: true,
    "plugins": [
        require('tailwindcss')('tailwind.config.js'),
        require('autoprefixer')(),
        require('cssnano')({ preset: 'default' }),
    ],
};
