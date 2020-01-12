angular.module('controller.dialog.view-business-reviews', [])
.controller('DialogViewBusinessReviewsController', function(
    $scope,
    $mdDialog,
    userService,
    business
) {
    var reviewData = {
        businessId: business._id
    };
    // if (optionalArray && optionalArray.length > 0) reviewData.optionalArray = optionalArray;
    // $scope.product = angular.copy(productInfo);
    $scope.loading = true;
    $scope.businessName = business.companyName;
    userService.getBusinessReviews(reviewData).then(
        function(res) {
            $scope.reviews = res.data.reviews;
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


    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});
