module.exports = {
    options: {
        separator: ';',
        sourcemap: true,
    },
    'app': {
            'src': [
                'app/js/**/*.js',
                '.tmp/templates.js'
            ],
            dest: 'dist/app.js'
        },
    'lib': {
        'src': [
            'app/lib/blob-polyfill/Blob.js',
            'app/lib/file-saver.js/FileSaver.js',
            'app/lib/moment/moment.js',
            'app/lib/interact/dist/interact.js',
            'app/lib/angular/angular.js',
            'app/lib/angular-momentjs/angular-momentjs.js',
            'app/lib/angular-sanitize/angular-sanitize.js',
            'app/lib/angular-animate/angular-animate.js',
            'app/lib/angular-aria/angular-aria.js',
            'app/lib/angular-material/angular-material.js',
            'app/lib/angular-messages/angular-messages.js',
            'app/lib/angular-facebook/lib/angular-facebook.js',
            'app/lib/angular-loading-bar/build/loading-bar.js',
            'app/lib/angular-route/angular-route.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/angular-local-storage/dist/angular-local-storage.js',
            'app/lib/angular-dateParser/dist/angular-dateparser.js',
            'app/lib/ng-file-upload-shim/ng-file-upload-shim.js',
            'app/lib/ng-file-upload/ng-file-upload.js',
            'app/lib/angular-jwt/dist/angular-jwt.js',
            'app/lib/angular-file-saver/dist/angular-file-saver.js',
            'app/lib/angulartics/src/angulartics.js',
            'app/lib/angulartics-google-analytics/lib/angulartics-ga.js',
            'node_modules/angular-jwt/dist/angular-jwt.js',
            'node_modules/ui-router-visualizer/bundles/visualizer.min.js',
            'node_modules/angular-recaptcha/release/angular-recaptcha.min.js',
            'node_modules/ngmap/build/scripts/ng-map.min.js'
        ],
        'dest' : 'dist/lib.js'
    }
};