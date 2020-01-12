angular.module('service.price', [])
    .factory('priceService', function($rootScope, $http, $log, apiBase) {
        var factoryObject = {};

        var _getPrices = function(data) {
            return $http({
                method: 'POST',
                url: apiBase + 'api/getPrices',
                data: data
            });
        }

        factoryObject.getPrices = _getPrices;

        return factoryObject;
    });
