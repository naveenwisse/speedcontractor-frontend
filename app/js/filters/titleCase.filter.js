(function() {
    'use strict';
    angular.module('filter.titleCase', [])
        .filter('titleCase', function() {
            return function(input) {
                input = input || '';
                return input.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).replace(/([a-z](?=[A-Z]))/g, '$1 ');
                });
            };
        });
})();
