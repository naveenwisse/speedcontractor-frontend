angular.module('service.stripe-require', [])
    .factory('stripeRequireService', function($log, $state, $mdDialog) {
        var service = {};

        service.stripeAccountRequired = function(user) {
            return new Promise(function(resolve, reject) {
                if(!user.stripeAccount) { // User dont setup stripe account
                    var confirm = $mdDialog.confirm()
                        .title('Stripe Account')
                        .textContent('Stripe Account is required.')
                        .ariaLabel('Cancel')
                        .ok('Stripe Setup')
                        .cancel('Cancel')
                        .multiple(true);
                    $mdDialog.show(confirm).then(function() {
                        $state.go('profile.settings');
                        $mdDialog.cancel();
                        reject();
                    });                
                } else { // User has valid stripe account, so continue to next step
                    resolve();
                }
            });            
        }

        return service;
    });
