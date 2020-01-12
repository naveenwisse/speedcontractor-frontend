angular.module('controller.toast', [])
.controller('ToastController', function($scope, $mdToast, toastLabel, toastType, $auth) {
    $scope.toastLabel = toastLabel;
    $scope.toastType = toastType;
    $scope.closeToast = function() {
        $mdToast.hide();
    };

    $scope.resend = function() {
        $auth.confirmResend().then(
            function() {
                $mdToast.hide();
            },
            function() {
                $mdToast.hide();
            });
    };
});
