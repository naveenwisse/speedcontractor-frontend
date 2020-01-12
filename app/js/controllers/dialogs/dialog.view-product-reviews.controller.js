angular.module('controller.dialog.view-product-reviews', [])
.controller('DialogViewProductReviewsController', function(
    $scope,
    $mdDialog,
    businessService,
    businessInfo,
    productInfo,
    optionalArray,
    eventId,
) {
    var reviewData = {
        businessId: businessInfo._id,
        productId: productInfo._id,
        eventId: eventId
    };
    if (optionalArray && optionalArray.length > 0) reviewData.optionalArray = optionalArray;
    $scope.product = angular.copy(productInfo);
    $scope.loading = true;
    businessService.getProductReviews(reviewData).then(
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
