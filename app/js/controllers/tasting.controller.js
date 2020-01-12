angular.module('controller.tasting', [])
.controller('TastingController', function(
    $scope,
    $stateParams,
    $mdDialog,
    Upload,
    businessService,
    geolocation,
    toastService,
    $log,
    $user
) {

    $scope.tasting = {};
    $scope.isResumeSupported = Upload.isResumeSupported();
    $scope.checkInFormData = {
        code: ''
    };
    $scope.isTastingUser = false;
    $scope.atLocation = false;
    $scope.checkedIn = false;
    $scope.checkInLoaded = false;

    var tastingData = {
            _id: $stateParams.tastingId
        },
        distance;

    function deg2rad(degrees) {
        return degrees * Math.PI / 180;
    }

    function getDistance(latitude1, longitude1, latitude2, longitude2) {
        var earth_radius = 6371,
            dLat = deg2rad(latitude2 - latitude1),
            dLon = deg2rad(longitude2 - longitude1),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2),
            c = 2 * Math.asin(Math.sqrt(a)),
            d;
        d = earth_radius * c;
        return d;
    }

    function getTasting() {
        businessService.getTasting(tastingData).then(
            function(res) {
                $scope.tasting = res.data.tasting;
                $scope.typeText = $scope.tasting.tastingType == 'PUBLIC' ? 'Public' : 'Private'  
                $scope.isTastingUser = $scope.tasting.users.map(user => user._id).indexOf($user._id) > -1;
                $scope.tasting.checkedIn.forEach(function(check) {
                    if ($user._id === check.id) {
                        $scope.checkedIn = true;
                        $scope.checkInLoaded = true;
                    }
                });
                if (geolocation.support && !$scope.checkedIn) {
                    geolocation.position.then(function(ret) {
                        $scope.position = {
                            coords: {
                                latitude: ret.lat,
                                longitude: ret.lon,
                                accuracy: ret.accuracy
                            }
                        };
                        distance = getDistance(
                            $scope.tasting.loc.coordinates[1],
                            $scope.tasting.loc.coordinates[0],
                            ret.lat,
                            ret.lon
                        );
                        $log.debug('doing check in location validation, distance from check in is ',distance);
                        if (distance < 3) {
                            $scope.atLocation = true;
                        }
                        $scope.checkInLoaded = true;
                    });
                }
            },
            function(err) {
                $log.log(err.data.message);
            });
    }

    $scope.checkIn = function(form) {
        if (form.$valid) {
            var checkInData = {
                tastingId: $scope.tasting._id,
                code: $scope.checkInFormData.code,
                lon: $scope.position.coords.longitude,
                lat: $scope.position.coords.latitude
            };
            businessService.checkInTasting(checkInData).then(() => {
                toastService.showToast('Check-in success', "success", 2000);
                getTasting();
            }).catch((err) => {
                toastService.showToast(err.data.message, "error", 2000);
            });
        }
    };

    $scope.openAddProducts = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-event-products.tmpl.html',
            controller: 'DialogAddEventProductsController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user,
                eventData: $scope.tasting
            }
        });
    };

    $scope.openAddCheckIn = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-check-in.tmpl.html',
            controller: 'DialogAddCheckInController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                eventData: $scope.tasting,
                getTasting
            }
        });
    };

    $scope.openReviewProduct = function(ev, product) {
        $mdDialog.show({
            templateUrl: 'dialogs/review-product.tmpl.html',
            controller: 'DialogReviewProductController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                productInfo: product,
                eventData: $scope.tasting
            }
        });
    };

    getTasting();

});
