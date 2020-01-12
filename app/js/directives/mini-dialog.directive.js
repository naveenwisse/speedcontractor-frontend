(function() {
    'use strict';

    angular.module('directive.mini-dialog', [])
        .directive('miniDialog', function() {
            return {
                restrict: 'E',
                templateUrl: 'mini-dialog.html',
                scope: true,
                controller: function($scope, $element, miniDialogService) {
                    $scope.service = miniDialogService;
                }
            };
        });
})();
