(function() {
    'use strict';
    angular.module('filter.dateConversion', [])
        .filter('dateConversion', function() {
            return function(input) {
                input = input || '';
                var d = new Date(input);

                if (!isNaN(d.valueOf())){
                    input = d.getFullYear().toString();
                }

                return input;
            };
        });
})();
