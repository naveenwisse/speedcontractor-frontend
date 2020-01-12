(function() {
    'use strict';
    angular.module('controller.dialog.password-prompt', [])
        .controller('DialogPasswordPromptController', function($scope, $log, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(pass) {
                $mdDialog.hide({
                    password: pass,
                    provider: 'planted'
                });
            };

            $scope.onReauth = function(err, res) {
                if (err) {
                    $mdDialog.cancel(err);
                } else{
                    $mdDialog.hide({
                        token: res,
                        provider: 'facebook'
                    });
                }
            };
        });

})();
