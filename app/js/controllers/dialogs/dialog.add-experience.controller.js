angular.module('controller.dialog.add-experience', [])
    .controller('DialogAddExperienceController', function($scope, $rootScope, $user, $log, userInfo, jobTypesData, $mdDialog, userService, businessService, toastService) {

        $scope.dialogFormData = {};
        $scope.jobTypes = jobTypesData;
        $scope.dialogFormData = {
            selectedJob: '(Select a job type)'
        };
        
        $scope.submitDialog = function(form) {
            if (form.$valid) {
                var data = {
                    from: $scope.dialogFormData.from,
                    to: $scope.dialogFormData.to,
                    title: $scope.dialogFormData.selectedJob
                };

                if ($scope.dialogFormData.business) {
                    data.employer = $scope.dialogFormData.business.companyName;
                    data.business = $scope.dialogFormData.business._id;
                } else {
                    data.employer = $scope.dialogFormData.searchText;
                }
                userService.addExperience(data).then(
                    function() {
                        var index = $user.positions.indexOf(data.title);
                        if (index === -1) {
                            $user.positions.push(data.title);
                        }                        
                        $rootScope.$emit('profile.get-feed'); // Update profile page
                        $mdDialog.hide(data);
                    },
                    function(err) {
                        toastService.showToast(err.data.message, "error", 2000);
                        $mdDialog.hide(data);
                    });
            }
        };

        $scope.searchTextChange = function(query) {
            $scope.dialogFormData.business = null;
            if (query && query.length >= 3) {
                this.businessQueryPromise =
                    businessService.getBusinesses({
                        companyName: query
                    }).then(function(res) {
                        return res.data.businesses || [];
                    });
            }
        };

        $scope.querySearch = function(query) {
            if (this.businessQueryPromise) {
                return this.businessQueryPromise.then(function(businesses) {
                    return businesses.filter(createFilterFor(query));
                });
            } else {
                return [];
            }
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(business) {
                return angular.lowercase(business.companyName).indexOf(lowercaseQuery) !== -1;
            };
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

    });
