angular.module('controller.dialog.payment', [])
.controller('DialogPaymentController', function(
    $scope,
    $mdDialog,
    $log,
    checkoutService
) {

    var client = {
        tokenizeCard: function() {
            $log.error('unimplemented method `client.tokenizeCard()`');
        }
    };
    $scope.creditCard = {
        number: '4111111111111111',
        expirationDate: '10/18'
    };

    $scope.payButtonClicked = function() {
        client.tokenizeCard({
            number: '4111111111111111',
            expirationDate: '10/20'
        }, function(err, nonce) {
            checkoutService.checkout(nonce).then(
                function(res) {
                    $log.log(res);
                },
                function(err) {
                    $log.log(err);
                });
        });
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    checkoutService.clientToken().then(function() {
        $log.error('unimplemented `clientToken()` handler');
    });
});
