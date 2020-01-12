angular.module('controller.dialog.add-resource-mass', [])
.controller('DialogAddResourceMassController', function(
    $scope,
    $mdDialog,
    jobService,
    $filter,
    businessService,
    businessInfo,
    massHire,
    $moment,
    gapiInitializer,
    geolocation,
    $log,
    $q,
    stripeRequireService
) {
    $scope.businessInfo = angular.copy(businessInfo);
    $scope.massHire = angular.copy(massHire);

    $scope.massJobs={
        title: null,
        quantity: 1
    }
    $scope.loaded = $q.defer();
    var autocomplete,
        circle,
        place,
        loadedPromise = $scope.loaded.promise,
        now = new Date();
    $scope.minDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 2);
    $scope.addResourceFormData = {
        invitedUsers: [],
        selectedLocation: null,
        title: '',
        startTime: new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours() + 2),
        endTime: new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours() + 3)
    };
    $scope.selectedText = null;
    $scope.selectedIndex = 0;
    $scope.viewJob = 0;

    $scope.resourcesCreated = false;
    $scope.step = 1;
    $scope.users = [];
    $scope.usersList = [];
    $scope.bizArray = [];
    $scope.search = {};
    $scope.jobsList = [];
    $scope.resources = [];

    $scope.rate = 3.35;
    $scope.fee = 5; 

    $scope.$watch('addResourceFormData.startTime', function(newValue) {
        $scope.hours = businessService.getBillableHours(newValue, $scope.addResourceFormData.endTime);
    }, true);

    $scope.$watch('addResourceFormData.endTime', function(newValue) {
        $scope.hours = businessService.getBillableHours($scope.addResourceFormData.startTime, newValue);
    }, true);

    jobService.getJobTypes().then(
        function(res) {
            $scope.types = res.data.jobTypes
        },
        function(err) {
            $log.error(err);
        });

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
                    (document.getElementById('autolocation')), { types: ['geocode'] });

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

    function containsTitle(title) {
        let contains = false; 
        $scope.jobsList.forEach(function(job) {
            if (job.title == title)
                contains = true;
        });
        return contains;
    }

    function _filterUser(user) {
        var endTime = $scope.addResourceFormData.endTime,
            startTime = $scope.addResourceFormData.startTime,
            conflict = false,
            i = 0,
            j = 0,
            start,
            end;
        if(user.resources){
            for (; i < user.resources.length; i++) {
                // (StartA <= EndB)  and  (EndA >= StartB)
                start = moment(user.resources[i].startTime);
                end = moment(user.resources[i].endTime);
                if ((start.isSame(endTime) || start.isBefore(endTime)) &&
                    (end.isSame(startTime) || end.isAfter(startTime))) {
                    conflict = true;
                }
            }
        }
        if (!conflict) {
            $log.log('no conflict');
            for (; j < user.positions.length; j++) {
                if (containsTitle(user.positions[j].title)) {
                    $scope.usersList.push(user);
                    break;
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
            $scope.step++;
            $scope.resourcesCreated = true;
            $scope.selectedIndex = 1;
            $scope.addResourceFormData.compensation = ($scope.rate * $scope.hours) + $scope.fee;
            $scope.addResourceFormData.type = $scope.addResourceFormData.title + ' ' + $filter('date')($scope.addResourceFormData.startTime, 'h:mm a') + ' to ' + $filter('date')($scope.addResourceFormData.endTime, 'h:mm a');
            $scope.addResourceFormData.unfilled = true;
            $scope.addResourceFormData.selected = false;
            $scope.addResourceFormData.business = $scope.businessInfo._id;
            $scope.addResourceFormData.users = [];
            $scope.addResourceFormData.jobsList = $scope.jobsList;
            if ($scope.diffAddress || !$scope.businessInfo.formattedAddress) {
                $scope.addResourceFormData.location = place.formatted_address;
                $scope.addResourceFormData.geoLocation = {
                    coordinates: [
                        place.geometry.location.lng(),
                        place.geometry.location.lat()
                    ],
                    type: 'Point'
                };
            } else {
                $scope.addResourceFormData.location = $scope.businessInfo.formattedAddress;
                $scope.addResourceFormData.geoLocation = $scope.businessInfo.loc;
            }
            if ($scope.step == 3) {
                businessService.getResourceUsers({
                    lat: $scope.addResourceFormData.geoLocation.coordinates[1],
                    lon: $scope.addResourceFormData.geoLocation.coordinates[0],
                    jobs: $scope.jobsList,
                }).then(
                    function(res) {
                        $scope.users = res.data.users;
                        if ($scope.users.length) {
                            $scope.usersList = [];
                            for (var i = 0; i < $scope.users.length && i < 10; i++) {
                                _filterUser($scope.users[i]);
                            }
                        }
                    }
                );
            }
        }
    };

   
    $scope.back = function() {
        $scope.step--;
        $scope.resourcesCreated = false;
        $scope.selectedIndex = 0;
        $scope.addResourceFormData.filled = null;
        $scope.addResourceFormData.unfilled = true;
        $scope.search = {};
    };

    /*
    $scope.fillUser = function(user) {
        // $scope.addResourceFormData.filled = user;
        // $scope.addResourceFormData.unfilled = false;
        if ($scope.addResourceFormData && !$scope.addResourceFormData.invitedUsers)
            $scope.addResourceFormData.invitedUsers = []; //for now we have just one invitedUser
        $scope.addResourceFormData.invitedUsers.push(user);
        $scope.search.name = user.name;
    };
    */

    $scope.hasSelected = (user) => {
        const result = isElementInArray(user, $scope.addResourceFormData.invitedUsers);
        return result;
    }

    const isElementInArray = (element, array) => {
        let arr = array || $scope.addResourceFormData.invitedUsers || [];
        for (var i = 0; i < arr.length ; i++) {
            const compare = arr[i]._id || arr[i]; // if its retrieved via backend, the array contains just the id, not an object
            if (compare == element._id){
                return i;
            }
        }
        return false
    }

    $scope.getIndex = (user) => {
        return (isElementInArray(user) + 1);
    }

    $scope.fillUser = function(user) {
        const indexArrayElem = isElementInArray(user, $scope.addResourceFormData.invitedUsers);
        if (indexArrayElem !== false){
            $scope.addResourceFormData.invitedUsers.splice(indexArrayElem, 1);
        } else {
            if ($scope.addResourceFormData.invitedUsers.length < 5)
                $scope.addResourceFormData.invitedUsers.push(user);
            // else TODO: Show a message saying that 5 users were selected
        }
    };

    $scope.getHours = (endTime, startTime) => {
        const start = moment(startTime);
        const end = moment(endTime);
        const duration = moment.duration(start.diff(end));
        const hours = duration.asHours();
        return hours;
    }

    $scope.submit = function() {
        $scope.addResourceFormData.jobsList.forEach((jobs) => {
            jobs.compensation = (jobs.rate * $scope.getHours(jobs.startTime, jobs.endTime)) + jobs.fee;
        });
        var resourceData = {
            businessId: $scope.businessInfo._id,
            resource: $scope.addResourceFormData,
            massHireId: $scope.massHire._id
        };
        $log.log(resourceData);
        stripeRequireService.stripeAccountRequired($scope.businessInfo)
        .then(addResource);

        function addResource() {
            businessService.addResource(resourceData)
            .then(function() {
                $mdDialog.hide();
                $scope.$emit('business.reload-profile');
            });
        }
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.addJobs = function(form) {
        if (form.title != null && form.quantity > 0) {
            $scope.jobsList.push({
                title: form.title,
                quantity: form.quantity,
                fee: 5,
                rate: 3.35,
                requiresFinish: false,
                business: $scope.businessInfo._id,
                startTime: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    now.getHours() + 2),
                endTime: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    now.getHours() + 3)
            });
            $scope.massJobs.title = null;
            $scope.massJobs.quantity = 1;            
        }
    };

    $scope.removeJobItem = function(index) {
        $scope.jobsList.splice(index, 1);
    };

    $scope.currentItem = 0;

    $scope.nextItem = function() {
        const maxIndex = $scope.jobsList.length - 1;
        if ($scope.currentItem != maxIndex)
            $scope.currentItem++;
    }

    $scope.backItem = function() {
        if ($scope.currentItem != 0)
            $scope.currentItem--;
    }
});
