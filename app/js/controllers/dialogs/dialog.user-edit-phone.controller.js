angular.module('controller.dialog.user-edit-phone', [])
.controller('DialogUserEditPhoneController', function(
    $log,
    $scope,
    $mdDialog,
    userService,
    toastService,
    userInfo
) {
    $log.debug('apparently, address change is initialized');
    $scope.userInfo = angular.copy(userInfo);
    $scope.dialogFormData = {
        mobilePhone: $scope.userInfo.mobilePhone,
    };
    /* eslint-disable no-useless-escape */
    $scope.patternPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4,7}$/;
    /* eslint-enable no-useless-escape */

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
                mobilePhone: $scope.dialogFormData.mobilePhone
            };

            userService.updatePhone(outputData).then(() => {

                $mdDialog.hide();
                const success = $mdDialog.alert({
                    title: 'Update Phone',
                    textContent: 'phone was added',
                    ok: 'Close'
                });
                $mdDialog.show(success);
            }).catch(err => {
                toastService.showToast(err.data.message, "error", 20000);
                $mdDialog.hide();
            });
        }
    };
});
