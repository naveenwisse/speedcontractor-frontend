(function() {
    'use strict';

    angular
        .module('md.calendar')
        .controller('MdCollapseFallbackCtrl', function($scope, $attrs, $element) {

            $scope.$watch($attrs.mdCollapseFallback, function(shouldCollapse) {
                if (shouldCollapse) {
                    $element.addClass('ng-hide');
                } else {
                    $element.removeClass('ng-hide');
                }
            });

        })
        .directive('mdCollapseFallback', function() {

            return {
                restrict: 'A',
                controller: 'MdCollapseFallbackCtrl'
            };

        });
})();
