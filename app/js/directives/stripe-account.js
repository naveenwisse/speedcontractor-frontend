angular.module('directive.stripe-account', []).component('stripeAccount', {
    templateUrl: 'stripe-account.ng.html',
    transclude: true,
    bindings: {
        // Business or User
        accountType: '@',
        // Business id or user id
        accountHolder: '@'
    },
    controller: function($log, $window, $http, $user, $mdDialog, apiBase ) {
        var ctrl = this;

        this.$onInit = () => {
            fetchAccount();
        };

        ctrl.disconnectAccount = function(){
            const confirm = $mdDialog.confirm({
                title: 'Disconnect Stripe Account',
                htmlContent: 'Are you sure you want to disconnect this Stripe Account?',
                ariaLabel: 'Disconnect Stripe Account',
                clickOutsideToClose: true,
                targetEvent: event,
                ok: 'Disconnect',
                cancel: 'Cancel'
            });
            $mdDialog
                .show(confirm)
                .then(function(){
                    $http.post(apiBase + 'api/stripe/disconnect', {
                        accountType: ctrl.accountType,
                        accountId: ctrl.account._id
                    }).then(function(){
                        if ($user.persona.isUser) {
                            $window.location.assign('/settings');
                        } else {
                            $window.location.assign($user.persona.slug + '/settings');
                        }
                        $log.error(`stripe account disconnection success`);
                    }, function(err){
                        $log.error(`stripe account disconnection errored with ${err}`);
                    });
        
                });


        };

        ctrl.connectAccount = function() {
            $http.post(apiBase + 'api/stripe/connect', {
                accountType: ctrl.accountType,
                accountHolder: ctrl.accountHolder
            }).then(function(res) {
                var stripeConnectHref = res.data.connectAccountHref;
                $window.location.assign(stripeConnectHref);
            }, function(err) {
                $log.error(`stripe account integration errored with ${err}`);
                switch (err.status) {
                    case 401:
                        ctrl.status = 'UNAUTHORIZED';
                        break;
                    case 404:
                        ctrl.status = 'ACCOUNT_NOT_FOUND';
                        break;
                    default:
                        ctrl.status = 'UNKNOWN_ERROR';
                        break;
                }
            });
        };

        function fetchAccount() {
            $http.get(apiBase + 'api/stripe', {
                params: {
                    accountType: ctrl.accountType,
                    accountHolder: ctrl.accountHolder
                }
            }).then(function(res) {
                ctrl.account = res.data;
            }, function(err) {
                switch (err.status) {
                    case 401:
                        ctrl.status = 'UNAUTHORIZED';
                        break;
                    case 404:
                        ctrl.status = 'ACCOUNT_NOT_FOUND';
                        break;
                    default:
                        ctrl.status = 'UNKNOWN_ERROR';
                        break;
                }
            });
        }

    }
});
