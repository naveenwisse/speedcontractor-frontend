(function() {
    'use strict';
    angular.module('controller.dialog.edit-profile', [])
        .controller('DialogEditProfileController', function($log, $scope, $mdDialog, userInfo) {
            var data = {
                userInfo : angular.copy(userInfo),
                selectedJob : {},
                dialogFormData : {}
            };

            // console.log("User Info", data.userInfo);

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.submitDialog = function(form) {
                if (form.$valid){
                    $log.debug('edit profile dialog submit called');
                    $mdDialog.hide($scope.dialogFormData);
                }
            };

            $scope.data = data;
        });

})();
