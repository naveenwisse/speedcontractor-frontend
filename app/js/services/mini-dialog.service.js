(function() {
    'use strict';
    angular.module('service.mini-dialog', [])
        .factory('miniDialogService', ['$q', function($q) {
            var service = {
                    message: '',
                    show: false,
                    okButtonText: '',
                    cancelButtonText: '',
                    title: ''
                },
                deferred;

            service.showDialog = function(message, okButtonText, cancelButtonText, title) {
                deferred = $q.defer();
                service.message = message;
                service.okButtonText = okButtonText || "Proceed";
                service.cancelButtonText = cancelButtonText || "Cancel";
                service.title = title || "Before you continue";
                service.show = true;

                return deferred.promise;
            };

            service.accept = function() {
                service.show = false;
                return deferred.resolve(true);
            };

            service.cancel = function() {
                service.show = false;
                return deferred.resolve(false);
            };

            return service;
        }]);

})();
