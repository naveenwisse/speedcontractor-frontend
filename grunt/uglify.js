module.exports = {
    options: {
        sourceMap: true,
        compress: false
    },
    lib: {
        files: {
            'dist/lib.min.js': [
                'app/lib/es6-shim/es6-shim.js',
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
                'node_modules/raven-js/dist/raven.js',
                'node_modules/raven-js/dist/plugins/angular.js',
                'node_modules/angular-recaptcha/release/angular-recaptcha.min.js',
                'node_modules/ngmap/build/scripts/ng-map.min.js'
            ]
        }
    },
    ie: {
        files: {
            'dist/ie.min.js': [
                'node_modules/Base64/base64.js',
                'app/lib/html5shiv/dist/html5shiv.js',
                'app/lib/respond/dest/respond.src.js'
            ]
        }
    }
};
