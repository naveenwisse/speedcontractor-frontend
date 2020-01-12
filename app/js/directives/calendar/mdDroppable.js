(function() {
    'use strict';

    angular
        .module('md.calendar')
        .controller('MdDroppableCtrl', function($element, $scope, $parse, $attrs) {

            if (!interact) {
                return;
            }

            interact($element[0]).dropzone({
                ondragenter: function(event) {
                    angular.element(event.target).addClass('drop-active');
                },
                ondragleave: function(event) {
                    angular.element(event.target).removeClass('drop-active');
                },
                ondropdeactivate: function(event) {
                    angular.element(event.target).removeClass('drop-active');
                },
                ondrop: function(event) {
                    if (event.relatedTarget.dropData) {
                        $parse($attrs.onDrop)($scope, { dropData: event.relatedTarget.dropData });
                        $scope.$apply();
                    }
                }
            });

            $scope.$on('$destroy', function() {
                interact($element[0]).unset();
            });

        })
        .directive('mdDroppable', function() {

            return {
                restrict: 'A',
                controller: 'MdDroppableCtrl'
            };

        });
})();
