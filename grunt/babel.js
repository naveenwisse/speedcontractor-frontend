module.exports = {
    options: {
        ast: false,
        compact: false,
        comments: true,
        minified: false,
        sourceMap: false,
        "presets": ["es2015"],
        "plugins": ["angularjs-annotate"]
    },
    app: {
        'src': 'dist/app.js',
        'dest': 'dist/app.min.js',
    },
};
