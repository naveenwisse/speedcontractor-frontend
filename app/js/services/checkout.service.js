(function() {
    'use strict';
    angular.module('service.checkout', [])
        .factory('checkoutService', function($http) {

            var serviceBase = '//api.speedcontractor.com/',
                checkoutServiceFactory = {};

            var _clientToken = function(data) {
                return $http({
                    method: 'GET',
                    url: serviceBase + 'api/client_token',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                }).then(function(response) {
                    return response;
                });
            };

            var _checkout = function() {
                return $http({
                    method: 'POST',
                    url: serviceBase + 'api/checkout',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    return response;
                });
            };

            checkoutServiceFactory.clientToken = _clientToken;
            checkoutServiceFactory.checkout = _checkout;

            return checkoutServiceFactory;
        });

})();
