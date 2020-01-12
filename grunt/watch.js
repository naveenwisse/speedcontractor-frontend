module.exports = function(grunt) {
    return {
        options: {
            livereload: {
                host: 'localhost',
                port: 9000//,
                // key: grunt.file.read('/etc/apache2/ssl/key/vhost1.key'),
                // cert: grunt.file.read('/etc/apache2/ssl/crt/vhost1.crt')
            }
        },
        less: {
            files: ['app/less/**/*.less'],
            tasks: [
                'lesslint',
                'less',
                'postcss:dist',
                'postcss:ngMaterial'
            ]
        },
        scripts: {
            files: [
                'app/js/**/*.js',
                'app/html/**/*.html',
                'app/dialogs/**/*.html',
                'index.html'
            ],
            tasks: [
                'eslint',
                'replace:index',
                'html2js',
                'concat',
                'replace:local',
                'babel',
                'browserify',
            ]
        },
        img: {
            files: [
                'app/img/**/*'
            ],
            tasks: [
                'copy:images',
                'imagemin'
            ]
        }
    };
};
