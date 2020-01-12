(function() {
    'use strict';
    angular.module('filter.escape', [])
        .filter('escape', function() {
            return window.encodeURIComponent;
        });
})();
