angular.module('controller.reset', [])
.controller('ResetController', function($stateParams, toastService, $auth, $window) {
    var vm = this;
    vm.tokenProvided = false;

    if ($stateParams.token) {
        vm.tokenProvided = true;
    }

    vm.reset = function() {
        var resetData = {
            token: $stateParams.token,
            password: vm.password
        };
        $auth.reset(resetData).then(
            function(res) {
                toastService.showToast(res.data.message, "success", 5000);
                // Hard send to log in page
                $window.location.assign('/login');
            },
            function(err) {
                toastService.showToast(err.data.message, "success", 5000);
            });
    };

    vm.forgot = function() {
        var forgotData = {
            token: $stateParams.token,
            email: vm.email
        };
        $auth.forgot(forgotData).then(
            function(res) {
                toastService.showToast(res.data.message, "success", 5000);
            },
            function(err) {
                toastService.showToast(err.data.message, "success", 5000);
            });
    };

});
