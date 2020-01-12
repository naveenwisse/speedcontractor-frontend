angular.module('controller.dialog.add-event', [])
.controller('DialogAddEventController', function(
    $state,
    $scope,
    $rootScope,
    $log,
    $user,
    $mdDialog,
    businessInfo,
    userService,
    gapiInitializer,
    geolocation,
    $q,
    stripeRequireService
) {

    $scope.loaded = $q.defer();

    var autocomplete,
        place,
        circle,
        loadedPromise = $scope.loaded.promise;

    $scope.businessInfo = angular.copy(businessInfo);
    $scope.formData = { selectedLocation: null };
    $scope.selectedText = null;
    $scope.bizArray = [];

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
        }, function(error) {
            $log.log('Error occurred. Error code: ' + error.code);
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
            $scope.eventForm.location.$setValidity("select", false);
        } else {
            $scope.eventForm.location.$setValidity("select", true);
        }
    };

    $scope.removePlace = function() {
        place = null;
        $scope.eventForm.location.$setValidity("select", false);
    };

    $scope.submit = function() {
        if (!place && (!$scope.businessInfo.formattedAddress || ($scope.businessInfo.formattedAddress && $scope.diffAddress))) {
            $scope.eventForm.location.$setValidity("select", false);
            return;
        }
        $scope.formData.type = 'success';
        $scope.formData.business = $scope.businessInfo._id;
        if ($scope.diffAddress || !$scope.businessInfo.formattedAddress) {
            $scope.formData.formattedAddress = place.formatted_address;
            // $log.log(place);
            $scope.formData.geoLocation = {
                coordinates: [
                    place.geometry.location.lng(),
                    place.geometry.location.lat()
                ],
                type: 'Point'
            };
        } else {
            $scope.formData.formattedAddress = $scope.businessInfo.formattedAddress;
            $scope.formData.geoLocation = $scope.businessInfo.loc;
        }

        stripeRequireService.stripeAccountRequired($scope.businessInfo)
        .then(addEvent);

        function addEvent() {
            userService.addEvent($scope.formData).then(
                function(res) {
                    $mdDialog.hide();
                    $rootScope.$emit('business.reload-profile');
                    $state.go('business.event', {
                        eventId: res.data.event._id
                    });
                });            
        }
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});
