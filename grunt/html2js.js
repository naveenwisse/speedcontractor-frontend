module.exports = {
    options: {
        base: 'app/html',
        singleModule: true,
        htmlmin: {
            sortAttributes: true,
            decodeEntities: true,
            removeComments: true,
            removeOptionalTags: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true
        }
    },
    all: {
        src: 'app/html/**/*.html',
        dest: '.tmp/templates.js'
    }
};
