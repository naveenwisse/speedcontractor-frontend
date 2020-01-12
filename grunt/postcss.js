'use strict';

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const discardDuplicates = require('postcss-discard-duplicates');

// smoosh css
const nano = cssnano({
    safe: true
});

// remove duplicate declarations
const dedupe = discardDuplicates();

// make old / feisty browsers happy
const prefixer = autoprefixer({
    browsers: [
        'last 1 version',
        'ie >= 9',
        'Android >= 4'
    ]
});

module.exports = {
    dist: {
        src: '.tmp/app.css',
        dest: 'dist/app.min.css',
        options: {
            processors: [dedupe, prefixer, nano]
        }
    },
    ngMaterial: {
        src: '.tmp/app.css',
        dest: 'dist/app.min.css',
        options: {
            processors: [prefixer]
        }
    }
};
