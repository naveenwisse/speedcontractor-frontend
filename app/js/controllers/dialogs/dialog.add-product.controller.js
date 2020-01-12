angular.module('controller.dialog.add-product', [])
    .controller('DialogAddProductController', function(
        $scope,
        $rootScope,
        $http,
        $mdDialog,
        Upload,
        apiBase,
        businessService,
        businessInfo
    ) {

        $scope.noBoost = false;

        $scope.submit = function(form) {
            if (form.$valid) {
                if ($scope.addProductFormData.type) {
                    $mdDialog.cancel();
                    var productData = {
                        name: $scope.addProductFormData.name,
                        description: $scope.addProductFormData.description,
                        business: businessInfo._id,
                        type: $scope.addProductFormData.type
                    };
                    businessService.addProduct(productData).then(
                        function(res) {
                            var query = {
                                type: $scope.addProductFormData.image[0].type,
                                businessId: businessInfo._id,
                                productId: res.data.productId
                            };
                            $http.post(apiBase + 'api/productImageUpload', query)
                                .then(function(res) {
                                    Upload.upload({
                                        url: res.data.credentials.url, //s3Url
                                        transformRequest: function(data, headersGetter) {
                                            var headers = headersGetter();
                                            delete headers.Authorization;
                                            return data;
                                        },
                                        fields: res.data.credentials.fields, //credentials
                                        method: 'POST',
                                        file: $scope.addProductFormData.image[0]
                                    }).then(function() {
                                        $rootScope.$emit('business.reload-profile');
                                    });
                                });
                        });
                } else {
                    $scope.noBoost = true;
                }

            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });
