module.exports = {
    options: {
        paths: 'app',
        imports: ['app/less/common/*.less', 'app/less/components/*.less'],
        csslint: {
            csslintrc: '.csslintrc',
            formatters: [{
                id: 'junit-xml',
                dest: 'dist/reports/csslint_junit.xml'
            }]
        }
    },
    src: [
        'app/less/*.less',
        '!app/lib/**/*.less',
        '!app/less/app.less',
        '!app/less/scotch.less'
    ]
};
