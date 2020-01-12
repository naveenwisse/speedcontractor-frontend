angular.module('service.auth-interceptor', [])
.factory('authInterceptorService', function(localStorageService) {
    return {
        response: function(res) {
            var headers = res.headers,
                token = headers('x-access-token');
            if (token) {
                // This should use auth service but I got this crazy
                // circular dependency error shouted at me.. Out of all
                // the Angular code I've written this is the first time
                // I've seen it. We'll deal with that later.
                localStorageService.set('access_token', token);
            }
            return res;
        }
    };
});
