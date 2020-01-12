angular.module('service.auth', []).factory('$auth', function(
    $window,
    $rootScope,
    $timeout,
    $http,
    $log,
    apiBase,
    jwtHelper,
    localStorageService,
    $mdDialog
) {

    var accessTokenKey = 'access_token',
        authUserKey = 'auth_user',
        auth = {
            authenticated: false
        };

    auth.getAccessToken = function() {
        return localStorageService.get(accessTokenKey) || null;
    };

    auth.setAccessToken = function(token) {
        return localStorageService.set(accessTokenKey, token);
    };

    auth.isAuthenticated = function() {
        var token = auth.getAccessToken();
        return token && !jwtHelper.isTokenExpired(token);
    };

    auth.initAuthenticationOnLoad =
    auth.authenticate = function() {
        var isAuth = auth.isAuthenticated(),
            user = localStorageService.get(authUserKey);
        if (isAuth && user) {
            auth.authenticated = true;
            $rootScope.$emit('authenticated', user);
        }
    };

    auth.unauthenticate = function() {
        localStorageService.remove(accessTokenKey);
        localStorageService.remove(authUserKey);
        $rootScope.$emit('unauthenticated');
    };

    // Put user into storage after login and signup
    function loginSignupHandler(res) {
        localStorageService.set(authUserKey, res.data);
        return auth.authenticate();
    }

    //////////////
    // Logout
    //////////////

    auth.logout = function() {
        auth.unauthenticate();
        // Hard send to home, clears everything out nicely
        $window.location.assign('/');
    };

    auth.logoutConfirm = function(event) {
        var confirm = $mdDialog.confirm({
            title: 'Confirm log out',
            textContent: 'Are you sure you want to log out?',
            ariaLabel: 'Log out',
            clickOutsideToClose: true,
            targetEvent: event,
            ok: 'Log out',
            cancel: 'Cancel'
        });

        $mdDialog
            .show(confirm)
            .then(auth.logout);
    };

    //////////////
    // Login
    //////////////

    auth.login = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'login',
            data: data
        }).then(loginSignupHandler);
    };

    auth.loginFacebook = function(token) {
        return $http({
            method: 'POST',
            url: apiBase + 'loginFacebook',
            data: {
                token: token
            }
        }).then(loginSignupHandler);
    };

    //////////////
    // Signup
    //////////////

    auth.signup = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'signup',
            data: data
        }).then(loginSignupHandler);
    };

    auth.signupFacebook = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'signupFacebook',
            data: data
        }).then(loginSignupHandler);
    };

    //////////////
    // Dementia
    //////////////

    auth.reset = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'reset',
            data: {
                token: data.token,
                password: data.password
            }
        });
    };

    auth.forgot = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'forgot',
            data: {
                email: data.email
            }
        });
    };

    //////////////
    // Confirm
    //////////////

    auth.confirmEmail = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'confirmEmail',
            data: data
        });
    };

    auth.confirmResend = function() {
        return $http.post(apiBase + 'api/confirmResend');
    };

    return auth;

});
