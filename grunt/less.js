module.exports = {
    compile: {
        options: {
            paths: ['app']
        },
        files: {
            '.tmp/app.css': [
                'app/less/app.less'
            ]
        }
    }
};
