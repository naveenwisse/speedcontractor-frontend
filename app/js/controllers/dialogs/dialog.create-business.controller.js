angular.module('controller.dialog.create-business', [])
.controller('DialogCreateBusinessController', function($scope, $mdDialog, $user, userService, toastService, localStorageService, $auth) {
    var data = {
        dialogFormData: {}
    };

    var authUserKey = 'auth_user';

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submitDialog = function(form) {
        if (form.$valid) {
            userService.saveBusiness($scope.dialogFormData).then(
                function(res) {
                    var business = res.data.business;
                    $mdDialog.hide();
                    var user = localStorageService.get(authUserKey);
                    user.businesses.push({
                        companyName: business.companyName,
                        image: 'i/default-user-image.png',
                        slug: business.slug,
                        _id: business._id
                    });
                    user.personas.push({
                        name: business.companyName,
                        image: 'i/default-user-image.png',
                        slug: business.slug,
                        _id: business._id,
                        isBusiness: true
                    });
                    localStorageService.set(authUserKey, user);
                    $auth.authenticate();
                },
                function(err) {
                    toastService.showToast(err.data.message, "error", 2000);
                    $mdDialog.hide();
                });
        }
    };

    $scope.data = data;
});
