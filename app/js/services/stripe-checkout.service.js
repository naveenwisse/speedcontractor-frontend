angular.module('service.stripe-checkout', [])
    .factory('stripeCheckoutService', function($window, $http, $q) {
        var src = 'https://checkout.stripe.com/checkout.js',
            loadDeferred = $q.defer(),
            loadPromise;

        function load() {
            return loadPromise || (loadPromise = loadStripeCheckout());
        }

        function loadStripeCheckout() {
            var doc = $window.document,
                s = doc.createElement('script');
            s.onload = function() {
                loadDeferred.resolve($window.StripeCheckout);
                s.parentNode.removeChild(s);
                s = s.onload = null;
            };
            s.src = src;
            doc.getElementsByTagName('head')[0].appendChild(s);
            return loadDeferred.promise;
        }

        return {
            load: load
        };
    });
