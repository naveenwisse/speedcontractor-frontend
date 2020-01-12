angular.module('controller.dialog.edit-event', [])
    .controller('DialogEditEventController', function (
        $scope,
        $log,
        $rootScope,
        $mdDialog,
        businessInfo,
        eventInfo,
        businessService,
        gapiInitializer,
        geolocation,
        $q,
        additionalCommentService,
    ) {

        $scope.loaded = $q.defer();
        var autocomplete,
            place,
            loadedPromise = $scope.loaded.promise;

        $scope.businessInfo = angular.copy(businessInfo);

        $scope.formData = angular.copy(eventInfo);
        $scope.formData.selectedLocation = null;
        $scope.formData.startsAt = new Date($scope.formData.startsAt);
        $scope.formData.endsAt = new Date($scope.formData.endsAt);


        $scope.$on('$destroy', function () {
            var instance = document.querySelector('.pac-container');

            autocomplete.unbindAll();
            google.maps.event.clearListeners(autocomplete);

            if (instance) {
                instance.parentNode.removeChild(instance);
            }
        });

        // Bias the autocomplete object to the user's geographical location,
        // as supplied by the browser's 'navigator.geolocation' object.
        $scope.geolocate = function () {
            geolocation.position.then(function (ret) {
                var center = {
                    lat: ret.lat,
                    lng: ret.lon
                },
                    circle = new google.maps.Circle({
                        center: center,
                        radius: ret.accuracy
                    });
                autocomplete.setBounds(circle.getBounds());
            }, function (error) {
                $log.log('Error occurred. Error code: ' + error.code);
            });
        };

        gapiInitializer.mapsInitialized.then(function () {
            loadedPromise.then(function () {
                autocomplete = new google.maps.places.Autocomplete(
                    /** @type {!HTMLInputElement} */
                    (document.getElementById('autolocation')), {
                        types: ['geocode']
                    });

                // When the user selects an address from the dropdown, populate the address
                // fields in the form.
                autocomplete.addListener('place_changed', function () {
                    place = autocomplete.getPlace();
                    $scope.checkPlace();
                    $scope.$apply();
                });
            });
        });

        $scope.checkPlace = function () {
            if (place === null) {
                $scope.eventForm.location.$setValidity("select", false);
            } else {
                $scope.eventForm.location.$setValidity("select", true);
            }
        };

        $scope.removePlace = function () {
            place = null;
            $scope.eventForm.location.$setValidity("select", false);
        };

        $scope.submit = function () {
            if (!place && (!$scope.businessInfo.formattedAddress || ($scope.businessInfo.formattedAddress && $scope.diffAddress))) {
                $scope.eventForm.location.$setValidity("select", false);
                return;
            }

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

            var data = {
                business: $scope.businessInfo._id,
                eventId: eventInfo._id,
                title: $scope.formData.title,
                description: $scope.formData.description,
                formattedAddress: $scope.formData.formattedAddress,
                loc: $scope.formData.geoLocation,
                startsAt:$scope.formData.startsAt,
                endsAt:$scope.formData.endsAt,
                comment: ''
            };

            $mdDialog.hide();

            const updateEventInfo = function (data) {
                eventInfo.title = data.title;
                eventInfo.description = data.description;
                eventInfo.formattedAddress = data.formattedAddress;
                eventInfo.loc = data.loc;
                eventInfo.startsAt=data.startsAt,
                eventInfo.endsAt=data.endsAt,
                $rootScope.$emit('business.reload-profile');
            }

            additionalCommentService.openAdditionalCommentModal()
                .then(res => {
                    data.comment = res;
                    businessService.editEvent(data).then(updateEventInfo(data))
                })
                .catch(() => {
                    businessService.editEvent(data).then(updateEventInfo(data))
                });

        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    });
