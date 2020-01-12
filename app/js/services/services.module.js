(function() {
    'use strict';

    angular.module('app.services', [
        'service.auth',
        'service.auth-user',
        'service.auth-interceptor',
        'service.user',
        'service.business',
        'service.state',
        'service.toast',
        'service.upload',
        'service.reasons-suspend',
        'service.mini-dialog',
        'service.google-api-initializer',
        'service.facebook',
        'service.checkout',
        'service.api',
        'service.tasting-levels',
        'service.price',
        'service.geolocation',
        'service.stripe-checkout',
        'service.job',
        'service.stripe-require',
        'service.additional-comment',
    ]);
})();
