var serveStatic = require('serve-static');

module.exports = function(grunt) {
    return {
        options: {
            host: 'www.speedcontractor.com:9009', 
            hostname: 'www.speedcontractor.com',
            base: ['dist']
        },
        livereload: {
            options: {
                hostname: 'www.speedcontractor.com',
                port: 9009,
                livereload: 9000,
                middleware: function(connect, options) {
                    var optBase = (typeof options.base === 'string') ? [options.base] : options.base;
                    return [require('connect-modrewrite')(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.gif|\\.swf$ \/ [L]'])].concat(
                        optBase.map(function(path) {
                            return serveStatic(path);
                        })
                    );
                }
            }
        }
    };
};