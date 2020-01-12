(function() {
    'use strict';
    angular.module('service.job', [])
        .factory('jobService', function($http, apiBase) {

            var jobServiceFactory = {};

            var _getJobTypes = function() {
                return $http({
                    method: 'GET',
                    url: apiBase + 'api/job'
                });

            };

            jobServiceFactory.getJobTypes = _getJobTypes;
            return jobServiceFactory;
        });

})();
