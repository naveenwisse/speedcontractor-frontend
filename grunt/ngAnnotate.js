module.exports = {
    options: {
        singleQuotes: true
    },
    dist: {
        files: {
            'dist/app.js': [
                'app/js/**/*.js',
                '.tmp/templates.js'
            ]
        }
    }
};
