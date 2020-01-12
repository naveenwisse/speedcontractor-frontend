angular.module('controller.dialog.biz-edit-address', [])
.controller('DialogBizEditAddressController', function(
    $log,
    $scope,
    $mdDialog,
    toastService,
    userService,
    $user,
    states,
    businessInfo
) {
    $scope.businessInfo = angular.copy(businessInfo);
    $scope.dialogFormData = {
        address1: $scope.businessInfo.address1,
        address2: $scope.businessInfo.address2,
        city: $scope.businessInfo.city,
        regionId: $scope.businessInfo.regionId,
        postalCode: $scope.businessInfo.postalCode
    };

    $scope.states = angular.copy(states);

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function(form) {
        if (form.$valid) {
            var outputData = {
                businessId: $user.persona._id,
                profileType: 'business',
                address1: $scope.dialogFormData.address1,
                address2: $scope.dialogFormData.address2,
                city: $scope.dialogFormData.city,
                regionId: $scope.dialogFormData.regionId,
                postalCode: $scope.dialogFormData.postalCode
            };

            userService.updateAddress(outputData).then(
                response => {
                    $log.debug('address update finished response is ',response);
                    angular.extend(businessInfo, $scope.dialogFormData);
                    return $mdDialog.hide();
                })
                .catch(err => {
                    $log.debug('address update finished response is ', err);
                    return toastService.showToast(err.data.message, "error", 20000);
                });
        }
    };
});
