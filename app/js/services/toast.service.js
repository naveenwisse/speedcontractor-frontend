(function() {
    'use strict';
    angular.module('service.toast', [])
        .factory('toastService', function($mdToast) {
            var service = {};

            service.showToast = function(toastLabel, toastType, hideDelay) {
                if (toastLabel) {
                    hideDelay = hideDelay || 0;
                    $mdToast.show({
                        controller: 'ToastController',
                        templateUrl: 'dialogs/toast-template.tmpl.html',
                        parent: angular.element(document.body),
                        hideDelay: hideDelay,
                        locals: {
                            toastLabel: toastLabel,
                            toastType: toastType
                        },
                        position: 'bottom right'
                    });
                }
            };

            service.hideToast = function() {
                $mdToast.hide();
            };

            return service;
        });

})();
