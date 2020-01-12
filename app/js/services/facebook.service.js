angular.module('service.facebook', []).factory('facebookService', function($q, $log, Facebook) {
    var service = {};

    // Logs the user into Facebook. The ideal solution would be to
    // check if the user is authenticated already before
    // attemtping to re-log them into Facebook, but we run the
    // risk of the Facebook popup getting caught by the user's
    // popup blocker if we jump through too many hoops. Always
    // calling the login method from the Facebook SDK will
    // potentially throw a (harmless) error in the console, but at
    // least we know that the popup will still get shown if they
    // do need to authenticate.
    function loginToFacebook(opts) {
        return $q(function(resolve, reject) {
            Facebook.login(function(res) {
                var authResponse = res.authResponse;
                if (authResponse) {
                    resolve(authResponse.accessToken);
                } else {
                    $log.error('Facebook.login failure:', res);
                    reject({
                        errMsg: 'User cancelled the Facebook auth process'
                    });
                }
            }, angular.extend({}, opts, {
                scope: 'email,public_profile,user_birthday'
            }));
        });
    }

    function getFacebookMeData() {
        return $q(function(resolve, reject) {
            Facebook.api('/me', {
                fields: 'id,name,email,birthday'
            }, function(res) {
                if (res.error) {
                    $log.error('Facebook.api(me) failure:', res);
                    reject(res.error);
                } else {
                    $log.log('Facebook.api(me) success:');
                    resolve(res);
                }
            });
        });
    }

    /**
     * @ngdoc method
     * @name FacebookService#isReady
     * @methodOf FacebookService#isReady
     * @function
     *
     * @description Returns the ready status of the service
     *
     * @example
     * ```js
     * FacebookService.isReady();
     * ```
     */
    service.isReady = function() {
        return Facebook.isReady();
    };

    /**
     * @ngdoc method
     * @name FacebookService#login
     * @methodOf FacebookService#login
     * @function
     *
     * @description Logs the user into Facebook (if necessary) and BodySpace
     *
     * @example
     * ```js
     * FacebookService.login();
     * ```
     */
    service.login = function() {
        return loginToFacebook();
    };

    /**
     * @ngdoc method
     * @name FacebookService#reauth
     * @methodOf FacebookService#reauth
     * @function
     *
     * @description Reauthorizes the user with Facebook
     *
     * @example
     * ```js
     * FacebookService.login();
     * ```
     */
    service.reauth = function() {
        return loginToFacebook({ auth_type: 'reauthenticate' });
    };

    service.getDataForSignUp = function() {
        return loginToFacebook().then(function(token) {
            return getFacebookMeData().then(function(res) {
                return {
                    token: token,
                    name: res.name,
                    email: res.email,
                    birthday: new Date(res.birthday).toISOString()
                };
            });
        }).catch(function(res) {
            $log.error('FacebookService#getDataForSignUp', res);
            return $q.reject(res);
        });
    };

    return service;
});
