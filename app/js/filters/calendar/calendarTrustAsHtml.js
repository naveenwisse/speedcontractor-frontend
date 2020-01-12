(function() {
    'use strict';

    angular
        .module('md.calendar')
        .filter('calendarTrustAsHtml', function($sce) {

            return function(text) {
                return $sce.trustAsHtml(text);
            };

        });
})();
