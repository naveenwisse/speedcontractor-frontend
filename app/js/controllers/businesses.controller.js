angular.module('controller.businesses', [])
    .controller('BusinessesController', function($scope, $rootScope, $stateParams, userService) {
        var data = {
            businessId: 0
        };
        // if (optionalArray && optionalArray.length > 0) reviewData.optionalArray = optionalArray;
        // $scope.product = angular.copy(productInfo);
        $scope.loading = true;
        userService.getBusinessReviews(data).then(
            function(res) {
                $scope.businesses = res.data.reviews;
                $scope.loading = false;
                if (!res.data.reviews.length) {
                    $scope.loadError = true;
                    $scope.loadErrorText = 'There are no reviews for this product yet.';
                }
            },
            function() {
                $scope.loading = false;
                $scope.loadError = true;
                $scope.loadErrorText = 'Error loading the reviews.';
            });

    });
