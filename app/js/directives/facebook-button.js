angular.module('directive.facebookButton', [])
.directive('facebookButton', function(facebookService, $log, $auth) {
    return {
        restrict: 'EAC',
        templateUrl: 'facebook-button.html',
        link: facebookButtonLinkFn,
        scope: {
            onReauth: '&'
        }
    };

    function facebookButtonLinkFn($scope, $element, $attrs) {
        var action,
            loginHandler,
            signupHandler,
            reauthHandler,
            loginErrorHandler,
            signupErrorHandler,
            text;

        // Displays an error tooltip message to the user that there was a problem
        // logging them into Facebook. If the user doesn't have a SpeedContractor
        // account linked to the provided Facebook account, display the signup
        // modal and pre-populate all the data.
        loginErrorHandler = function loginErrorHandler(response) {
            if (response && response.status === 506) {
                $scope.noAssociatedPPAccountError = true;
            } else {
                $scope.errorLoggingInWithFacebook = true;
            }
        };

        // Displays an error tooltip message to the user that there was a problem
        // signing them up with Facebook. If the user doesn't have a SpeedContractor
        // account linked to the provided Facebook account, display the signup
        // modal and pre-populate all the data.
        signupErrorHandler = function signupErrorHandler() {
            // todo
        };

        // Forces a login to Facebook if the user is not already authenticated.
        // With the returned access token, assuming a successful login, the data
        // is sent to our api to confirm the associated user. If the user was
        // found and authenticated, the page is refreshed and the user is now
        // logged in.
        loginHandler = function loginHandler() {
            $log.debug('bbFacebookButton#loginHandler: Invoking the login action from the Facebook button.');
            facebookService
                .login()
                .then($auth.loginFacebook)
                .catch(loginErrorHandler);
        };

        // On successful auth from Facebook, the returned access
        // token is sent to our server to look up if a user has already
        // been signed up. If so, we assume a login and send them on their
        // way. If no user was found, we'll treat this as a signup and
        // launch the signup wizard with as much data pre-populated from
        // their Facebook account as possible.
        signupHandler = function signupHandler() {
            $log.debug('bbFacebookButton#signupHandler');
            facebookService
                .getDataForSignUp()
                .then($auth.signupFacebook)
                .catch(signupErrorHandler);
        };

        reauthHandler = function reauthHandler() {
            $log.debug('bbFacebookButton#reauthHandler: Invoking the reauth action from the Facebook button.');
            facebookService
                .reauth()
                .then(function(res) {
                    $log.debug('bbFacebookButton#reauthHandler: ', res);
                    $scope.onReauth({
                        res: res,
                        err: null
                    });
                }, function(err) {
                    $scope.onReauth({
                        err: err,
                        res: null
                    });
                });
        };

        // Defines the click event for the type of Facebook button
        // instantiated. Falls back to the login action if the type
        // is undefined or not supported. Also sets the default text
        // to display for the button.
        action = (function setupAction(type) {
            text = "Log in with Facebook";
            switch (type) {
                case "login":
                    return loginHandler;
                case "signup":
                    text = "Sign up with Facebook";
                    return signupHandler;
                case "reauth":
                    text = "Reauthorize with Facebook";
                    return reauthHandler;
                default:
                    $log.warn('Invalid type specified for Facebook button, defaulting to login action.');
                    return loginHandler;
            }
        }($attrs.type));

        // Set the text for the button. Checking for the attribute
        // allows the default text to be overridden if the case is
        // ever needed, such as localization.
        $scope.text = $attrs.text || text;

        // Binds the click event for the Facebook button and runs the
        // defined action that was specified by the type attribute.
        $scope.doAction = action;

    }
});
