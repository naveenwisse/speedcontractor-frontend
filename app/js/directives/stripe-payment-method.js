angular.module('directive.stripe-payment-method', []).component('stripePaymentMethod', {
    templateUrl: 'stripe-payment-method.ng.html',
    require: {
        stripeAccount: '^stripeAccount'
    },
    controller: function($window, $http, apiBase, stripeCheckoutService, $mdDialog) {

        this.$onInit = () => {
            this.account = this.stripeAccount.account;
        };

        this.$onDestroy = () => {
            this.modalHandler = null;
            if (this.onPopstateHandler) {
                angular.element($window).off('popstate', this.onPopstateHandler);
                this.onPopstateHandler = null;
            }
        };

        this.showAddPaymentMethodModal = () => {
            stripeCheckoutService
                .load()
                .then(this._showAddPaymentMethodModal);
        };

        this._showAddPaymentMethodModal = StripeCheckout => {
            this.modalHandler = StripeCheckout.configure({
                key: '@@stripePublicKey',
                image: 'https://www.speedcontractor.com/i/apple-touch-icon-120x120.png',
                locale: 'auto',
                token: token => {
                    this._savePaymentMethod(token);
                }
            });

            this.modalHandler.open({
                name: 'speedcontractor.com',
                panelLabel: 'Save Payment Method',
                zipCode: true
            });

            // Checkout doesn't close the modal if the back button
            // is clicked so we must do it ourselves.
            angular.element($window).one('popstate',
                this.onPopstateHandler = () => {
                    this.onPopstateHandler = null;
                    this.modalHandler.close();
                });
        };

        this._savePaymentMethod = paymentToken => {
            $http({
                method: 'post',
                url: apiBase + 'api/stripe/addPaymentMethod',
                data: {
                    accountId: this.account._id,
                    paymentToken: paymentToken
                }
            }).then(res => {
                angular.extend(this.account, res.data);
            });
        };

        this.removePaymentMethod = event => {
            const confirm = $mdDialog.confirm({
                title: 'Remove payment method',
                htmlContent: 'Are you sure you want to remove this payment method?<br>' +
                    'A payment method is required for subscriptions and paying users for shifts.',
                ariaLabel: 'Remove payment method',
                clickOutsideToClose: true,
                targetEvent: event,
                ok: 'Remove payment method',
                cancel: 'Cancel'
            });
            $mdDialog
                .show(confirm)
                .then(this._removePaymentMethod);
        };

        this._removePaymentMethod = () => {
            $http({
                method: 'post',
                url: apiBase + 'api/stripe/removePaymentMethod',
                data: {
                    accountId: this.account._id
                }
            }).then(res => {
                angular.extend(this.account, res.data);
            });
        };

    }
});
