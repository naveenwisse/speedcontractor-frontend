module.exports = function(grunt) {

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        data: {
            bower: require('./bower.json'),
            npm: require('./package.json')
        },
        loadGruntTasks: {
            pattern: ['grunt-*'],
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });

};
