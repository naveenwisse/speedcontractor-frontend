angular.module('controller.business-settings', [])
.controller('BusinessSettingsController', function(
    $scope,
    $rootScope,
    $mdDialog,
    $anchorScroll,
    businessService,
    toastService,
    $user
) {

    resetFormData();

    function resetFormData() {
        $scope.addAdminFormData = {};
        $scope.removeAdminFormData = {};
    }

    function _successAddFn() {
        resetFormData();
        $rootScope.$emit('business.reload-profile');
        toastService.showToast("Successfully added user as an administrator.", "success", 2000);
    }

    function _errorAddFn() {
        toastService.showToast("An error occurred while adding the user.", "success", 2000);
    }

    function _successRemoveFn() {
        resetFormData();
        $rootScope.$emit('business.reload-profile');
        toastService.showToast("Successfully removed user from administrators.", "success", 2000);
    }

    function _errorRemoveFn() {
        toastService.showToast("An error occurred while removing the user.", "success", 2000);
    }

    $scope.add = function(form) {
        var formData = $scope.addAdminFormData;
        if (form.$valid && $user._id != formData.user._id) {
            $mdDialog.show({
                templateUrl: 'dialogs/password-prompt.tmpl.html',
                controller: 'DialogPasswordPromptController',
                parent: angular.element(document.body),
                onShowing: function() {
                    $anchorScroll();
                }
            }).then(function(res) {
                var data = {
                    businessId: $user.persona._id,
                    admin: formData.user._id
                };
                if (res.provider === 'facebook') {
                    data.token = res.token;
                    businessService.addFBAdministrator(data).then(_successAddFn, _errorAddFn);
                } else {
                    data.password = res.password;
                    businessService.addAdministrator(data).then(_successAddFn, _errorAddFn);
                }
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        }
    };

    $scope.remove = function(form) {
        var formData = $scope.removeAdminFormData;
        if (form.$valid && $user._id != formData.user._id) {
            $mdDialog.show({
                templateUrl: 'dialogs/password-prompt.tmpl.html',
                controller: 'DialogPasswordPromptController',
                parent: angular.element(document.body),
                onShowing: function() {
                    $anchorScroll();
                }
            }).then(function(res) {
                var data = {
                    businessId: $user.persona._id,
                    admin: formData.user._id
                };
                if (res.provider === 'facebook') {
                    data.token = res.token;
                    businessService.removeFBAdministrator(data).then(_successRemoveFn, _errorRemoveFn);
                } else {
                    data.password = res.password;
                    businessService.removeAdministrator(data).then(_successRemoveFn, _errorRemoveFn);
                }
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        }
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.searchTextChange = function(query) {
        $scope.addAdminFormData.user = null;
        if (query && query.length >= 3) {
            this.adminsQueryPromise =
                businessService.getUsers({
                    name: query
                }).then(function(res) {
                    return res.data.users || [];
                });
        }
    };

    $scope.querySearch = function(query) {
        if (this.adminsQueryPromise) {
            return this.adminsQueryPromise.then(function(admins) {
                return admins.filter(createFilterFor(query));
            });
        } else {
            return [];
        }
    };

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(user) {
            return angular.lowercase(user.name).indexOf(lowercaseQuery) !== -1;
        };
    }
});
