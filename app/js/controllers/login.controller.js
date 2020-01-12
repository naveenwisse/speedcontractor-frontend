angular.module('controller.login', [])
.controller('LoginController', function($log, $auth) {
    var vm = this;
    $log.log("Version: 6.3.19.23");
    vm.loginError = false;
    vm.loginErrorText = '';

    vm.login = function(form) {
        if (form.$valid) {
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            $auth.login(credentials).catch(function(err) {
                $log.error(err);
                vm.loginError = true;
                vm.loginErrorText = '';
                if (err && err.message) {
                    vm.loginErrorText = err.message;
                } else if (err && err.messages) {
                    for (var i = 0; i < err.messages.length; i++) {
                        vm.loginErrorText = vm.loginErrorText + err.messages[0].msg + '. ';
                    }
                } else {
                    vm.loginErrorText = 'An unknown error has occured.';
                }
            });
        } else {
            vm.loginError = true;
            vm.loginErrorText = 'The form is invalid.';
        }
    };

});

