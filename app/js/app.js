// eslint-disable-next-line no-unused-vars
// version-pp-client 230718
import { Visualizer } from 'ui-router-visualizer';

var modules = [
    'ngAnimate',
    'ngSanitize',
    'LocalStorageModule',
    'app.controllers',
    'app.services',
    'app.directives',
    'app.filters',
    'templates-all',
    'ui.router',
    'angular-loading-bar',
    'ngMaterial',
    'ngMessages',
    'md.calendar',
    'ngFileUpload',
    'angular-jwt',
    'angular-momentjs',
    'facebook',
    'angulartics',
    'angulartics.google.analytics',
    'angular-carousel',
    'ngRoute',
    'vcRecaptcha',
    'ngMap'
];

/*eslint-disable*/
if ('@@env' === 'prod') {
    modules.push('ngRaven')
}
/*eslint-enable*/

angular.module('app', modules)
.config(function(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $logProvider,
    $qProvider,
    $routeProvider,
    $mdThemingProvider,
    $analyticsProvider,
    $compileProvider,
    $mdAriaProvider,
    $mdGestureProvider,
    loadingBarProvider,
    FacebookProvider
) {

    $mdGestureProvider.skipClickHijack();

    $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
    $analyticsProvider.withBase(true); /* Records full path */

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(http(s)?|data):/);

    loadingBarProvider.includeSpinner = false;

    FacebookProvider.init({
        loadSDK: true,
        version: 'v2.8',
        appId: '1627077040949992'
    });

    /*eslint-disable*/
    if ('@@env' !== 'prod') {
        $logProvider.debugEnabled(true);
        $compileProvider.debugInfoEnabled(true);
        $qProvider.errorOnUnhandledRejections(true);
    }
    if ('@@env' === 'prod') {
        $mdAriaProvider.disableWarnings();
    }
    /*eslint-enable*/

    var primaryGreenMap = $mdThemingProvider.extendPalette('green', {
            '500': '1d9400'
        }),
        accentGreyMap = $mdThemingProvider.extendPalette('grey', {
            '500': '252830'
        }),
        warnRedMap = $mdThemingProvider.extendPalette('red', {
            '500': 'D84315'
        });

    $mdThemingProvider.definePalette('primaryGreen', primaryGreenMap);
    $mdThemingProvider.definePalette('accentGrey', accentGreyMap);
    $mdThemingProvider.definePalette('warnRed', warnRedMap);

    $mdThemingProvider.theme('default')
        .primaryPalette('primaryGreen', {
            default: '500'
        })
        .accentPalette('accentGrey', {
            default: '500'
        })
        .warnPalette('warnRed', {
            default: '500'
        });

    $mdThemingProvider.theme('default').foregroundPalette[3] = "#838e94";

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    // States
    $stateProvider

        .state('calendar', {
            url: '/calendar',
            templateUrl: 'calendar.html',
            controller: 'CalendarController as calendar',
            authRequired: true
        })

        ///////////////////////
        // Admin routes
        ///////////////////////
        .state('adminusers', {
            url: '/adminusers',
            templateUrl: 'admin/users.html',
            controller: 'UsersAdminController as admin'
        })
        .state('adminpositions', {
            url: '/adminpositions',
            templateUrl: 'admin/positions.html',
            controller: 'PositionsAdminController as admin'
        })
        .state('adminpositionedit', {
            url: '/adminpositionedit/:id',
            templateUrl: 'admin/position-edit.html',
            controller: 'PositionEditAdminController as admin'
        })
        .state('adminpositioncreate', {
            url: '/adminposition',
            templateUrl: 'admin/position-create.html',
            controller: 'PositionCreateAdminController as admin'
        })
        .state('adminterms', {
            url: '/adminterms',
            templateUrl: 'admin/terms.html',
            controller: 'TermsAdminController as admin'
        })
        .state('admintermedit', {
            url: '/admintermedit/:id',
            templateUrl: 'admin/term-edit.html',
            controller: 'TermEditAdminController as admin'
        })
        .state('admintermcreate', {
            url: '/adminterm',
            templateUrl: 'admin/term-create.html',
            controller: 'TermCreateAdminController as admin'
        })
        .state('adminbusinesses', {
            url: '/adminbusinesses',
            templateUrl: 'admin/businesses.html',
            controller: 'BusinessesAdminController as admin'
        })
        ///////////////////////
        // Public routes
        ///////////////////////

        .state('home', {
            url: '/',
            templateUrl: 'home.html'
        })
        .state('404', {
            url: '/404',
            templateUrl: '404.html'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'about.html'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'contact.html',
            controller: 'ContactController as contact'
        })
        .state('terms', {
            url: '/terms',
            templateUrl: 'terms.html'
        })
        .state('privacy', {
            url: '/privacy',
            templateUrl: 'privacy.html',
        })

        ///////////////////////
        // User routes
        ///////////////////////

        .state('profilePubic', {
            url: '/u/:id/:name',
            templateUrl: 'profile-public.html',
            controller: 'PublicProfileController as profile'
        })

        .state('profile', {
            url: '/profile',
            abstract: true,
            templateUrl: 'profile.html',
            controller: 'ProfileController as profile',
            authRequired: true
        })
        .state('profile.main', {
            url: '/main/',
            templateUrl: 'profile-main.html',
            authRequired: true
        })
        .state('profile.allEvents', {
            url: '/all-events',
            templateUrl: 'profile-all-events.html',
            controller: 'AllEventsController as allEvents',
            authRequired: true
        })
        .state('profile.settings', {
            url: '/settings',
            templateUrl: 'profile-settings.html',
            authRequired: true
        })
        .state('profile.eventListByCoor', {
            url: '/eventscoor/:lat/:long',
            templateUrl: 'jobs-coord.html',
            controller: 'JobsCoordController as coordCtrl',
            authRequired: true
        })
        .state('profile.businesses', {
            url: '/businesses',
            templateUrl: 'business-reviews.html',
            controller: 'BusinessesController'
        })

        ///////////////////////
        // Business routes
        ///////////////////////

        .state('business', {
            abstract: true,
            url: '/b/:id/:name',
            templateUrl: 'business.html',
            controller: 'BusinessController',
            params: {
                id: '',
                name: '',
            },
            resolve: {
                business: function($stateParams, userService, toastService) {
                    return userService.getBusiness({ _id: $stateParams.id })
                        .then(function(res) {
                            return res.data.business;
                        }, function(err) {
                            toastService.showToast('Unable to retrieve the business. ' + err.data.message, "error", 4000);
                        });
                }
            }
        })
        .state('business.main', {
            url: '',
            templateUrl: 'business-main.html'
        })
        .state('business.event', {
            url: '/event/:eventId',
            templateUrl: 'business-event.html',
            controller: 'EventController as event',
            params: {
                eventId: '',
            },
        })
        .state('business.tasting', {
            url: '/tasting/:tastingId',
            templateUrl: 'business-tasting.html',
            controller: 'TastingController'
        })
        .state('business.competition', {
            url: '/competition/:competitionId',
            templateUrl: 'business-competition.html',
            controller: 'CompetitionController'
        })
        .state('business.employees', {
            url: '/employees',
            templateUrl: 'business-employees.html',
            controller: 'EmployeesController'
        })
        .state('business.products', {
            url: '/products',
            templateUrl: 'business-products.html',
            controller: 'ProductsController'
        })
        .state('business.businesses', {
            url: '/businesses',
            templateUrl: 'business-reviews.html',
            controller: 'BusinessesController'
        })
        .state('business.settings', {
            url: '/settings',
            templateUrl: 'business-settings.html',
            controller: 'BusinessSettingsController as settings',
            authRequired: true
        })
        .state('business.gallery', {
            url: '/gallery',
            templateUrl: 'business-gallery.html',
            controller: 'BusinessGalleryController as gallery',
            authRequired: true
        })
        .state('business.job', {
            url: '/job/:massHireId/:group',
            templateUrl: 'job.html',
            controller: 'JobController as jobCtrl',
            authRequired: true
        })


        ///////////////////////
        // Auth(ish) routes
        ///////////////////////


        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginController as login'
        })
        .state('register', {
            url: '/register/:token/',
            templateUrl: 'register.html',
            controller: 'RegistrationController',
            params: {
                token: '',
            },
        })
        .state('reset', {
            url: '/reset/:token',
            templateUrl: 'reset.html',
            controller: 'ResetController as reset',
            params: {
                token: '',
            }
        })
        .state('confirm', {
            url: '/confirm/:token/',
            templateUrl: 'confirm.html',
            controller: 'ConfirmController as confirm',
            params: {
                token: '',
                utm_medium: '',
                utm_source: '',
                utm_campaign: '',
            },
        })
        .state('stripe-confirm', {
            url: '/stripe/confirm/?state&scope&code',
            templateUrl: 'stripe-confirm.html',
            controller: 'StripeConfirmController',
            params: {
                state: '',
                scope: '',
                code: '',
            },
            authRequired: true
        });

}).config(function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('speedcontractor')
        .setNotify(
            // don't emit set events
            false,
            // don't emit remove events
            false
        );
}).config(function($httpProvider, jwtOptionsProvider, apiBaseProvider) {
    jwtOptionsProvider.config({
        authPrefix: '',
        authHeader: 'x-access-token',
        whiteListedDomains: [
            'localhost',
            'localhost:9009',
            apiBaseProvider
                .base
                .replace(/\//g, '')
                .replace(/^https?:/, '')
        ],
        tokenGetter: ['$auth', function($auth) {
            return $auth.getAccessToken();
        }]
    });
    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push('authInterceptorService');
}).run(function($log, $uiRouter, $transitions, $rootScope, $state, $auth, $user, $location, $timeout) {

    // eslint-disable-next-line no-constant-condition
    if('@@visualizerInstance' === 'enabled') {
        // eslint-disable-next-line no-unused-vars
        const visualizerInstance = $uiRouter.plugin(Visualizer);
    }

    $auth.initAuthenticationOnLoad();

    var routeAuthedUser,
        removeOnAuthenticatedRouter,
        removeOnUnauthenticatedHandler;

    $rootScope.$auth = $auth;
    $rootScope.$user = $user;

    routeAuthedUser = function() {
        $log.debug('$user is: ',$user);
        var persona = $user.persona;
        //if (persona.isUser){
        if (!persona.isBusiness) {
            $log.debug('redirecting to profile.main');
            $timeout(() => $state.go('profile.main'), 1);
        } else {
            // Can't change path in the same tick that
            // we prevent stage change. Move it out one.
            $timeout(function() {
                $log.debug('redirecting to ',persona.slug);
                $location.path(persona.slug);
            },1);
        }
    };

    // Route on persona change
    $rootScope.$on('persona.changed', routeAuthedUser);

    // The auth module doesn't route once the user has been authenticated,
    // so we need to handle it here
    if (!$auth.authenticated) {
        removeOnAuthenticatedRouter = $rootScope.$on('authenticated', function() {
            removeOnAuthenticatedRouter();
            routeAuthedUser();
        });
    }

    // Fired from angular-jwt if a response contains 401, so use it wisely
    removeOnUnauthenticatedHandler = $rootScope.$on('unauthenticated', function() {
        removeOnUnauthenticatedHandler();
        $auth.logout();
    });

    //navigation guard/hook for authed states
    $transitions.onBefore({to: state =>  (state.includes['login', 'register'] || state.is('home'))&& $auth.authenticated},
        () => {
            routeAuthedUser();
            //return false to stop initial route transition.
            return false;
    });

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        var isAuthenticated = $auth.authenticated;

        $log.debug('auth required called:', toState, 'authenticated? ', isAuthenticated);

        $rootScope.showAds = $rootScope.showAds || $user.canDrink;

        if (isAuthenticated) {
            $rootScope.pageTitle = $user.persona.name + ' - Speed Contractor';
        } else {
            $rootScope.pageTitle = 'Speed Contractor';
        }

        if (toState.authRequired && !isAuthenticated) {
            event.preventDefault();
            $state.go(toState.authRequiredState || 'home');
        }
    });
});
