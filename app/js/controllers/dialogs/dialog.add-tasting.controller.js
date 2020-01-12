angular.module('controller.dialog.add-tasting', [])
    .controller('DialogAddTastingController', function(
        $scope,
        $rootScope,
        $mdDialog,
        $filter,
        businessService,
        businessInfo,
        $moment,
        tastingLevels
    ) {
        $scope.businessInfo = angular.copy(businessInfo);
        $scope.capacity = 30; // Default Capacity

        var now = new Date();
        const daysAfter = 0;

        $scope.levels = [{
            'level': '100',
            'description': 'All Jobs are invited'
        }, {
            'level': '200',
            'description': 'Everyone except Bussers and Bar Backs'
        }, {
            'level': '300',
            'description': 'Managers only'
        }];
        $scope.selectedIndex = 0;
        $scope.typeSelected = false;
        $scope.capacitySelected = false;

        $scope.minDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + daysAfter);

        $scope.addTastingFormData = {
            startTime: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + daysAfter,
                now.getHours()),
            endTime: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + daysAfter,
                now.getHours() + 1)
        };

        $scope.next = function(form) {
            if (form.$valid) {
                $scope.typeSelected = true;
                $scope.selectedIndex = 1;
            }
        };

        $scope.back = function() {
            $scope.typeSelected = false;
            $scope.selectedIndex = 0;
        };

        $scope.next1 = function(form) {
            if (form.$valid) {
                $scope.capacitySelected = true;
                $scope.typeSelected = false;
                $scope.selectedIndex = 2;
            }
        };

        $scope.back1 = function() {
            $scope.capacitySelected = false;
            $scope.typeSelected = true;
            $scope.selectedIndex = 1;
        };

        $scope.submit = function(form) {
            if ($scope.addTastingFormData.businessVenue === null) {
                $scope.addTastingForm.businessVenue.$setValidity("select", false);
                return;
            }
            if (form.$valid) {
                $scope.addTastingFormData.type = $scope.addTastingFormData.title + ' ' +
                    $filter('date')($scope.addTastingFormData.startTime, 'h:mm a') + ' to ' +
                    $filter('date')($scope.addTastingFormData.endTime, 'h:mm a');
                $scope.addTastingFormData.business = $scope.businessInfo._id;
                $scope.addTastingFormData.formattedAddress = $scope.addTastingFormData.businessVenue.formattedAddress;
                $scope.addTastingFormData.loc = $scope.addTastingFormData.businessVenue.loc;
                $scope.addTastingFormData.capacity = $scope.capacity;
                if ($scope.addTastingFormData.level) {
                    $scope.addTastingFormData.levelArray = tastingLevels[$scope.addTastingFormData.level];
                }

                $mdDialog.cancel();

                var tastingData = {
                    businessId: $scope.businessInfo._id,
                    tasting: $scope.addTastingFormData
                };

                businessService.addTasting(tastingData).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                    });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.searchTextChange = function(query) {
            $scope.addTastingFormData.businessVenue = null;
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
    });
