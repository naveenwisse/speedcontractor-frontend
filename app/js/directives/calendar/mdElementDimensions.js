(function() {
    'use strict';

    angular
        .module('md.calendar')
        .controller('MdElementDimensionsCtrl', function($element, $scope, $parse, $attrs) {

            $parse($attrs.mdElementDimensions).assign($scope, {
                width: $element[0].offsetWidth,
                height: $element[0].offsetHeight
            });

        })
        .directive('mdElementDimensions', function() {

            return {
                restrict: 'A',
                controller: 'MdElementDimensionsCtrl'
            };

        });
})();
