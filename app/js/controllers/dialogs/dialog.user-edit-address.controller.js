angular.module('controller.dialog.user-edit-address', [])
.controller('DialogUserEditAddressController', function(
    $log,
    $scope,
    $mdDialog,
    userService,
    toastService,
    states,
    userInfo
) {
    $log.debug('apparently, address change is initialized');
    $scope.userInfo = angular.copy(userInfo);
    $scope.dialogFormData = {
        address1: $scope.userInfo.address1,
        address2: $scope.userInfo.address2,
        city: $scope.userInfo.city,
        regionId: $scope.userInfo.regionId,
        postalCode: $scope.userInfo.postalCode
    };

    $scope.states = angular.copy(states);

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function(form) {
        $log.debug('address submission called!!!! RIGHT?!!?');
        if (form.$valid) {
            var outputData = {
                profileType: 'profile',
                address1: $scope.dialogFormData.address1,
                address2: $scope.dialogFormData.address2,
                city: $scope.dialogFormData.city,
                regionId: $scope.dialogFormData.regionId,
                postalCode: $scope.dialogFormData.postalCode
            };

            return userService.updateAddress(outputData).then(
                response => {
                    $log.debug('address update finished response is ', response);
                    angular.extend(userInfo, $scope.dialogFormData);
                    return $mdDialog.hide();
                })
                .catch(err => {
                    $log.debug('address update finished response is ', err);
                    return toastService.showToast(err.data.message, "error", 20000);
                });
        }
        //return $mdDialog.cancel();
    };
});
