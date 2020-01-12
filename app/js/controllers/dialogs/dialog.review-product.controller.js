angular.module('controller.dialog.review-product', [])
    .controller('DialogReviewProductController', function(
        $scope,
        $mdDialog,
        businessService,
        eventData,
        productInfo,
        toastService
    ) {

        $scope.submit = function(form) {
            if (form.$valid) {
                $mdDialog.cancel();
                var data = {
                    rating: $scope.reviewProductFormData.rating,
                    review: $scope.reviewProductFormData.review,
                    notes: $scope.reviewProductFormData.notes,
                    productId: productInfo._id
                };
                if (eventData.modelType === 'TASTING') {
                    data.tastingId = eventData._id;
                } else {
                    data.competitionId = eventData._id;
                }
                businessService.addProductReview(data).then(
                    function(res) {
                        toastService.showToast(res.data.message, "success", 2000);
                    });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });
