angular.module('service.geolocation', []).factory('geolocation', function($window, $q, $log) {
    var navigator = $window.navigator,
        service = {
            get position() {
                return location;
            },
            set position(value) {
                location = value;
            },
        },
        location,
        config;

    service.support = 'geolocation' in navigator &&
        !!navigator.geolocation.watchPosition;

    config = {
        enablehighAccuracy: false, // quicker
        maximumAge: 5 * 60 * 1000, // 5 minutes
        timeout: 10 * 1000 // 10 seconds
    };

    if (service.support) {

        service.position = $q( (resolve, reject) => {
            navigator.geolocation.watchPosition(ret => {
                $log.debug('Geolocation.watchPosition result:', ret);
                let position = {
                    lon: ret.coords.longitude,
                    lat: ret.coords.latitude,
                    accuracy: ret.coords.accuracy
                };
                resolve(position);
            }, error => {
                if (error.message.indexOf("Only secure origins are allowed") == 0) {
                    reject(error);
                    $log.error(error.message);
                }
                $log.error('Geolocation.watchPosition:', error.message);
                reject(error);
            }, config)
        });

    } else {

        service.position = $q.reject({
            code: 0
        });

    }

    return service;
});
