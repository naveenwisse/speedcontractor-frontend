module.exports = {
    options: {
        //minifyJS: true,
        sortAttributes: true,
        decodeEntities: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true
    },
    dist: {
        files: {
            'dist/index.html': 'dist/index.html'
        }
    }
};
