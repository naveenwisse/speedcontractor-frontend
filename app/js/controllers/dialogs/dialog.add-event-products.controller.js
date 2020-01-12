angular.module('controller.dialog.add-event-products', [])
    .controller('DialogAddEventProductsController', function(
        $scope,
        $rootScope,
        $mdDialog,
        businessService,
        businessInfo,
        eventData,
        additionalCommentService
    ) {

        $scope.products = angular.copy(businessInfo.products);
        $scope.selectedProducts = angular.copy(eventData.products);

        if ($scope.selectedProducts.length) {
            for (var i = 0; i < $scope.selectedProducts.length; i++) {
                var index = $scope.products.findIndex(function(obj) {
                    return $scope.selectedProducts[i]._id === obj._id;
                });
                $scope.products[index].selected = true;
            }
        }

        $scope.selectProduct = function(product) {
            if (product.selected) {
                product.selected = false;
                var index = $scope.selectedProducts.findIndex(function(obj) {
                    return product._id === obj._id;
                });
                $scope.selectedProducts.splice(index, 1);
            } else {
                product.selected = true;
                $scope.selectedProducts.push(product);
            }
        };

        $scope.removeIndex = function(index, id) {
            var productIndex = $scope.products.findIndex(function(obj) {
                return id === obj._id;
            });
            $scope.products[productIndex].selected = false;
            $scope.selectedProducts.splice(index, 1);
        };

        $scope.submit = function(form) {
            if (form.$valid) {
                $mdDialog.cancel();
                var data = {
                    businessId: businessInfo._id,
                    comment: '',
                    products: $scope.selectedProducts.map(function(obj) {
                        return obj._id
                    })
                };
                if (eventData.modelType === 'TASTING') {
                    data.tastingId = eventData._id;
                } else {
                    data.competitionId = eventData._id;
                }
                additionalCommentService.openAdditionalCommentModal()
                    .then(res => {
                        data.comment = res;
                        businessService.addEventProducts(data).then(
                            function() {
                                eventData.products = $scope.selectedProducts;
                                $rootScope.$emit('business.reload-profile');
                            });
                    })
                    .catch(() => {
                        businessService.addEventProducts(data).then(
                            function() {
                                eventData.products = $scope.selectedProducts;
                                $rootScope.$emit('business.reload-profile');
                            });
                    });

            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });
