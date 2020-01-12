(function() {
    'use strict';

    angular.module('directive.shakeThat', [])
        .directive('shakeThat', function() {
            return {
                require: '^form',
                scope: {
                    submit: '&'
                },
                link: function($scope, $element, $attrs, $form) {
                    // listen on submit event
                    $element.on('submit', function() {
                        if ($form.$valid) {
                            return $scope.submit($form);
                        }
                        // tell angular to update scope
                        $scope.$apply(function() {
                            // shake that form
                            $element.addClass('shake');
                            $element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                $element.removeClass('shake');
                            });
                        });
                    });
                }
            };
        });
})();
