(function() {

    'use strict';

    angular.module('controller.dialog', [])
        .controller('DialogController', function($scope, $mdDialog, data) {
            $scope.data = data;
            $scope.dialogFormData = {};
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.submitDialog = function(form) {
                if (form.$valid){
                    $mdDialog.hide($scope.dialogFormData);
                }
            };
        });

})();
