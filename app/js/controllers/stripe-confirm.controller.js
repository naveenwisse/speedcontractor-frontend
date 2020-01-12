angular.module('controller.stripe-confirm', [])
.controller('StripeConfirmController', function($log, $scope, $location, $timeout, $user, $http, apiBase) {
    var query = $location.search();

    $log.debug('HEY YOU GOT TO THE STRIPE CONFIRM ROUTE, CONGRATS!');
    var code = query.code,
        state = query.state,
        error = query.error,
        errorDesc = query.error_description;

    $scope.error = error;
    $scope.errorDesc = errorDesc;

    if (!error) {

        $scope.confirming = true;

        $http.post(apiBase + 'api/stripe/confirm', {
            code: code,
            state: state
        }).then(function() {
            $scope.confirmed = true;

            $timeout(function() {
                if ($user.persona.isUser) {
                    $location.url('/settings');
                } else {
                    $location.url($user.persona.slug + '/settings');
                }
            }, 2000);

        }, function(err) {
            $scope.error = err;
            $log.log('stripe confirm error', err);
        }).finally(function() {
            $scope.confirming = false;
        });

    }

});
