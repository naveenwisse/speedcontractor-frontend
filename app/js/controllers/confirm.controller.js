(function() {

    'use strict';

    angular.module('controller.confirm', [])
        .controller('ConfirmController', function($stateParams, $auth) {
            var vm = this;

            vm.alertType = 'alert-info';
            vm.alertText = 'Please wait while we confirm your email';

            if ($stateParams.token) {
                vm.token = {
                    token: $stateParams.token
                };
                $auth.confirmEmail(vm.token).then(
                    function(res) {
                        if (res.data.success) {
                            vm.alertIcon = 'check_circle';
                            vm.alertColor = {
                                'color': '#22ae00',
                                'vertical-align': 'bottom'
                            };
                        } else {
                            vm.alertIcon = 'error';
                            vm.alertColor = {
                                'color': 'rgb(216,67,21)',
                                'vertical-align': 'bottom'
                            };
                        }
                        vm.alertText = res.data.message;
                    },
                    function(err) {
                        vm.alertIcon = 'error';
                        vm.alertColor = {
                            'color': 'rgb(216,67,21)',
                            'vertical-align': 'bottom'
                        };
                        vm.alertText = err.data.message;
                    });
            } else {
                vm.alertIcon = 'error';
                vm.alertColor = {
                    'color': 'rgb(216,67,21)',
                    'vertical-align': 'bottom'
                };
                vm.alertText = 'No token provided.';
            }

        });
})();
