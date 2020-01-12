angular.module('controller.dialog.edit-resource', [])
.controller('DialogEditResourceController', function(
    $scope,
    $rootScope,
    $mdDialog,
    jobService,
    $filter,
    businessService,
    businessInfo,
    resourceInfo,
    $moment,
    miniDialogService,
    gapiInitializer,
    geolocation,
    $q,
    $timeout,
    $log,
    additionalCommentService
) {
    var resourceData = angular.copy(resourceInfo);
    $scope.businessInfo = angular.copy(businessInfo);

    $scope.loaded = $q.defer();
    var autocomplete,
        circle,
        place,
        loadedPromise = $scope.loaded.promise,
        now = new Date();

    jobService.getJobTypes().then(
        function(res) {
            $scope.types = res.data.jobTypes
        },
        function(err) {
            $log.error(err);
        });

    $scope.minDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2);

    $scope.addResourceFormData = angular.copy(resourceInfo);
    $scope.addResourceFormData.startTime = new Date(resourceData.startTime);
    $scope.addResourceFormData.endTime = new Date(resourceData.endTime);
    $scope.addResourceFormData.geoLocation = resourceData.loc;
    $timeout(function() {
        $scope.addResourceForm.title.$validate();
    }, 100);

    $scope.selectedText = null;
    $scope.selectedIndex = 0;
    $scope.resourcesCreated = false;
    $scope.users = [];
    $scope.usersList = [];
    $scope.bizArray = [];
    $scope.search = {
        name: resourceData.filled ? resourceData.filled.name : ''
    };

    $scope.$on('$destroy', function() {
        var instance = document.querySelector('.pac-container');

        autocomplete.unbindAll();
        google.maps.event.clearListeners(autocomplete);

        if (instance) {
            instance.parentNode.removeChild(instance);
        }
    });

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    $scope.geolocate = function() {
        geolocation.position.then(function(ret) {
            var center = {
                lat: ret.lat,
                lng: ret.lon
            };
            circle = new google.maps.Circle({
                center: center,
                radius: ret.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    };

    gapiInitializer.mapsInitialized.then(function() {
        loadedPromise.then(function(resolved) {
            if (resolved) {
                autocomplete = new google.maps.places.Autocomplete(
                    /** @type {!HTMLInputElement} */
                    (document.getElementById('autolocation')), {
                        types: ['geocode']
                    });

                // When the user selects an address from the dropdown, populate the address
                // fields in the form.
                autocomplete.addListener('place_changed', function() {
                    place = autocomplete.getPlace();
                    $scope.checkPlace();
                    $scope.$apply();
                });
            }
        });
    });

    $scope.checkPlace = function() {
        if (place === null) {
            $scope.addResourceForm.location.$setValidity("select", false);
        } else {
            $scope.addResourceForm.location.$setValidity("select", true);
        }
    };

    $scope.removePlace = function() {
        place = null;
        $scope.addResourceForm.location.$setValidity("select", false);
    };

    function _filterUser(user) {
        var endTime = $scope.addResourceFormData.endTime,
            startTime = $scope.addResourceFormData.startTime,
            conflict = false,
            i = 0,
            j = 0,
            start,
            end;
        for (; i < user.resources.length; i++) {
            // (StartA <= EndB)  and  (EndA >= StartB)
            start = moment(user.resources[i].startTime);
            end = moment(user.resources[i].endTime);
            if ((start.isSame(endTime) || start.isBefore(endTime)) &&
                (end.isSame(startTime) || end.isAfter(startTime))) {
                conflict = true;
            }
        }
        if (!conflict) {
            for (; j < user.positions.length; j++) {
                if ($scope.addResourceFormData.title === user.positions[j].title) {
                    $scope.usersList.push(user);
                }
            }
        }
    }

    $scope.next = function(form) {
        if (!place && (!$scope.businessInfo.formattedAddress || ($scope.businessInfo.formattedAddress && $scope.diffAddress))) {
            $scope.addResourceForm.location.$setValidity("select", false);
            return;
        }
        if (form.$valid) {
            if (resourceData.title !== $scope.addResourceFormData.title) {
                miniDialogService.showDialog('If you proceed, you will need to select a new user to fill the position.').then(function(confirmed) {
                    if (confirmed) {
                        $scope.addResourceFormData.filled = null;
                        $scope.addResourceFormData.unfilled = true;
                        $scope.addResourceFormData.changed = true;
                        $scope.search = {
                            name: ''
                        };
                        $scope.selectedIndex = 1;
                        $scope.resourcesCreated = true;
                        businessService.getResourceUsers({
                            lat: $scope.addResourceFormData.geoLocation.coordinates[1],
                            lon: $scope.addResourceFormData.geoLocation.coordinates[0]
                        }).then(
                            function(res) {
                                $scope.users = res.data.users;
                                // console.log('users: ', $scope.users);
                                if ($scope.users.length) {
                                    $scope.usersList = [];
                                    for (var i = 0; i < $scope.users.length && i < 10; i++) {
                                        _filterUser($scope.users[i]);
                                    }
                                }
                            });
                    }
                });
            } else {
                $scope.selectedIndex = 1;
                $scope.resourcesCreated = true;
                businessService.getResourceUsers({
                    lat: $scope.addResourceFormData.geoLocation.coordinates[1],
                    lon: $scope.addResourceFormData.geoLocation.coordinates[0]
                }).then(
                    function(res) {
                        $scope.users = res.data.users;
                        // console.log('users: ', $scope.users);
                        if ($scope.users.length) {
                            $scope.usersList = [];
                            for (var i = 0; i < $scope.users.length && i < 10; i++) {
                                _filterUser($scope.users[i]);
                            }
                        }
                    });
            }
        }
    };

    $scope.back = function() {
        $scope.resourcesCreated = false;
        $scope.selectedIndex = 0;
    };

    $scope.fillUser = function(user) {
        $scope.addResourceFormData.filled = user;
        $scope.addResourceFormData.unfilled = false;
        $scope.search.name = user.name;
    };

    $scope.submit = function() {
        $mdDialog.cancel();

        additionalCommentService.openAdditionalCommentModal()
            .then(res => {
                $scope.addResourceFormData.comment = res;
                businessService.editResource($scope.addResourceFormData).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                    });
            })
            .catch(() => {
                $scope.addResourceFormData.comment = '';
                businessService.editResource($scope.addResourceFormData).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                    });
            });

    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

});
