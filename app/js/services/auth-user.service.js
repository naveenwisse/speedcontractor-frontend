angular.module('service.auth-user', []).factory('$user', function($rootScope, localStorageService, $moment) {
    var binder = $rootScope.$new(true),
        authUserKey = 'auth_user',
        removeStorageHandler,
        removeUnauthHandler,
        user;

    // Initialize an empty user
    user = binder[authUserKey] = {};

    // Prevent storage service from overwriting our user object
    // on the scope when we initialize the binding
    Object.defineProperty(binder, authUserKey, {
        set: angular.noop,
        get: function() {
            return user;
        }
    });

    // User is drinkin' age
    var canDrinkVal;
    Object.defineProperty(user, 'canDrink', {
        set: angular.noop,
        get: function() {
            if (canDrinkVal) return canDrinkVal;
            if (user.birthday) {
                canDrinkVal = $moment().diff(user.birthday, 'days') >= 7665;
                return canDrinkVal;
            }
        }
    });

    // Clear out user object so it doesn't get saved again
    $rootScope.$on('authenticated', function(event, authUser) {
        // Copy the auth user into our service user
        angular.copy(authUser, user);

        // Initialize the persona
        user.persona = user.persona || user.personas[0];

        // Link the persona to it's corresponding item in the personas
        // collection, that way updates to one are reflected in the other.
        // Object identity ftw
        var i = user.personas.length;
        while (i--) {
            if (user.personas[i]._id === user.persona._id) {
                user.personas[i] = user.persona;
                break;
            }
        }

        // Start monitoring & persisting changes to the user object
        removeStorageHandler = localStorageService.bind(binder, authUserKey);
    });

    // On logout, stop monitoring for changes to the user object
    removeUnauthHandler = $rootScope.$on('unauthenticated', function() {
        removeUnauthHandler && removeUnauthHandler();
        removeStorageHandler && removeStorageHandler();
    });

    return user;
});
