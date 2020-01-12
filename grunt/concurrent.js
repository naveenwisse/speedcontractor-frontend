module.exports = {
    'lint': [
        'eslint',
        'lesslint'
    ],
    'pre-build': [
        'less',
        'html2js',
        'replace:index',
        'copy'
    ],
    'compile-1st-pass': [
        'postcss:dist',
        'postcss:ngMaterial',
    ],
    'compile-2nd-pass': [
        'imagemin',
        'htmlmin',
    ],
    options: {
        limit: 4
    }
};
