angular.module('controller.products', [])
    .controller('ProductsController', function($scope, $rootScope, $stateParams, businessService, $mdDialog) {

        $scope.removeProduct = function(ev, product) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to remove ' + product.name + '?')
                .textContent('Removing this product cannot be undone. Please proceed with caution!')
                .ariaLabel('Remove product')
                .targetEvent(ev)
                .cancel('Cancel')
                .ok('Remove');
            $mdDialog.show(confirm).then(function() {
                var data = {
                    businessId: $stateParams.id,
                    productId: product._id
                };
                businessService.removeProduct(data).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                    });
            });
        };

    });
