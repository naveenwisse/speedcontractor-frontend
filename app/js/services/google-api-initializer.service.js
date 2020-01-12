(function() {
    'use strict';
    angular.module('service.google-api-initializer', [])
        .factory('gapiInitializer', ['$window', '$q', function($window, $q) {

            //Google's url for async maps initialization accepting callback function
            var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBhrGGNqDThag5k9zofS9_Av9bVwwOaJXs&libraries=places&callback=',
                mapsDefer = $q.defer();

            //Callback function - resolving promise after maps successfully loaded
            $window.googleMapsInitialized = mapsDefer.resolve;

            //Async loader
            var asyncLoad = function(asyncUrl, callbackName) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = asyncUrl + callbackName;
                document.body.appendChild(script);
            };
            //Start loading google maps
            asyncLoad(asyncUrl, 'googleMapsInitialized');

            //Usage: Initializer.mapsInitialized.then(callback)
            return {
                mapsInitialized: mapsDefer.promise
            };
        }]);

})();
